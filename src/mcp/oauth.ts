import { createHash, randomBytes, randomUUID, timingSafeEqual } from 'node:crypto';
import { z } from 'zod';
import { contentClient } from './client';
import { siteOrigin, allowedOwner } from './auth';

export const AUTH_BUCKET = 'zuluniner-mcp-auth';
export const RESOURCE = () => `${siteOrigin()}/api/mcp`;
const scope = 'content:read content:write';
const secret = () => randomBytes(32).toString('base64url');
export const digest = (value: string) => createHash('sha256').update(value).digest('hex');
const now = () => Math.floor(Date.now() / 1000);
const clientSchema = z.object({ client_id: z.string(), client_name: z.string(), redirect_uris: z.array(z.url()), token_endpoint_auth_method: z.literal('none') });
const requestSchema = z.object({ client_id: z.string(), redirect_uri: z.url(), state: z.string(), code_challenge: z.string(), resource: z.string(), scope: z.string(), expires_at: z.number() });
const grantSchema = requestSchema.extend({ user_id: z.uuid() });
const tokenSchema = z.object({ user_id: z.uuid(), client_id: z.string(), resource: z.string(), scope: z.string(), expires_at: z.number(), family_id: z.uuid(), family_expires_at: z.number() });
const markerSchema = z.object({ at: z.number() });

async function read<T extends z.ZodType>(path: string, schema: T): Promise<z.output<T> | null> {
  // This older Storage deployment wraps missing-object responses in HTTP 400.
  // Read the documented REST error explicitly; never confuse outages with absence.
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) throw new Error('Authentication storage is unavailable.');
  const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/${AUTH_BUCKET}/${path.split('/').map(encodeURIComponent).join('/')}`, {
    headers: { Authorization: `Bearer ${key}`, apikey: key }, cache: 'no-store', signal: AbortSignal.timeout(10000),
  });
  if (!response.ok) {
    const failure = z.object({ code: z.string().optional(), error: z.string().optional() }).safeParse(await response.json());
    if (response.status === 404 || (response.status === 400 && failure.success && (failure.data.code === 'NoSuchKey' || failure.data.error === 'not_found'))) return null;
    throw new Error('Authentication storage is unavailable.');
  }
  return schema.parse(await response.json());
}

async function write(path: string, value: object) {
  const { error } = await contentClient().storage.from(AUTH_BUCKET).upload(path, JSON.stringify(value), { contentType: 'application/json', upsert: false });
  if (error) throw new Error('Could not persist authorization.');
}

async function claim(path: string) {
  // Storage object names are unique in Postgres. Inserting this marker is an
  // atomic single-use claim across Vercel instances; no in-memory sessions.
  const { error } = await contentClient().storage.from(AUTH_BUCKET).upload(`used/${path}.json`, JSON.stringify({ at: now() }), { contentType: 'application/json', upsert: false });
  if (!error) return true;
  if ('statusCode' in error && String(error.statusCode) === '409') return false;
  throw new Error('Authentication storage is unavailable.');
}

export function trustedRedirect(uri: string) {
  const allowed = (process.env.ZULUNINER_OAUTH_REDIRECT_URIS || '').split(',').filter(Boolean);
  if (allowed.includes(uri)) return true;
  const url = new URL(uri);
  return url.origin === 'https://chatgpt.com' && !url.search && !url.hash &&
    (url.pathname === '/connector_platform_oauth_redirect' || /^\/connector\/oauth\/[a-zA-Z0-9_-]+$/.test(url.pathname));
}

export async function registerClient(body: object) {
  const input = z.object({ client_name: z.string().min(1).max(100).default('Agent'), redirect_uris: z.array(z.url()).min(1).max(5), token_endpoint_auth_method: z.literal('none').default('none'), grant_types: z.array(z.enum(['authorization_code', 'refresh_token'])).optional(), response_types: z.array(z.literal('code')).optional() }).passthrough().parse(body);
  if (!input.redirect_uris.every(trustedRedirect)) throw new Error('Register an approved ChatGPT callback or a configured agent redirect URI.');
  const client = { client_id: randomUUID(), client_name: input.client_name, redirect_uris: input.redirect_uris, token_endpoint_auth_method: 'none' as const };
  await write(`clients/${client.client_id}.json`, client);
  return { ...client, grant_types: ['authorization_code', 'refresh_token'], response_types: ['code'], client_id_issued_at: now() };
}

export async function beginAuthorization(params: URLSearchParams) {
  const input = requestSchema.parse({
    client_id: params.get('client_id'), redirect_uri: params.get('redirect_uri'), state: params.get('state'),
    code_challenge: params.get('code_challenge'), resource: params.get('resource') || RESOURCE(), scope: params.get('scope') || scope, expires_at: now() + 600,
  });
  if (params.get('response_type') !== 'code' || params.get('code_challenge_method') !== 'S256' || !/^[A-Za-z0-9_-]{43}$/.test(input.code_challenge)) throw new Error('Authorization requires code response type and S256 PKCE.');
  if (input.resource !== RESOURCE()) throw new Error('Invalid authorization resource.');
  if (!input.scope.split(' ').every(value => ['content:read', 'content:write'].includes(value))) throw new Error('Unsupported scope.');
  const client = await read(`clients/${z.uuid().parse(input.client_id)}.json`, clientSchema);
  if (!client || !client.redirect_uris.includes(input.redirect_uri)) throw new Error('Invalid OAuth client or redirect URI.');
  const requestId = secret();
  await write(`requests/${digest(requestId)}.json`, input);
  return `${siteOrigin()}/connect?request_id=${requestId}`;
}

export async function authorizationDetails(requestId: string) {
  const request = await read(`requests/${digest(requestId)}.json`, requestSchema);
  if (!request || request.expires_at <= now()) throw new Error('Authorization request expired. Start again from your agent.');
  const client = await read(`clients/${request.client_id}.json`, clientSchema);
  return { client_name: client?.client_name || 'Agent', scope: request.scope, request };
}

export async function approveAuthorization(requestId: string, ownerToken: string, approved: boolean) {
  const client = contentClient();
  const user = await client.auth.getUser(ownerToken);
  if (user.error || !user.data.user || !allowedOwner(user.data.user.id)) throw new Error('Only the configured site owner can connect an agent.');
  const profile = await client.from('users').select('role').eq('id', user.data.user.id).single();
  if (profile.error || profile.data.role !== 'admin') throw new Error('Owner access required.');
  const { request } = await authorizationDetails(requestId);
  if (!await claim(`request-${digest(requestId)}`)) throw new Error('Authorization request was already completed.');
  const redirect = new URL(request.redirect_uri);
  redirect.searchParams.set('state', request.state);
  redirect.searchParams.set('iss', siteOrigin());
  if (approved) {
    const code = secret();
    await write(`codes/${digest(code)}.json`, { ...request, user_id: user.data.user.id, expires_at: now() + 120 });
    redirect.searchParams.set('code', code);
  } else redirect.searchParams.set('error', 'access_denied');
  return { redirect_url: redirect.href };
}

async function issueTokens(grant: { user_id: string; client_id: string; resource: string; scope: string }, family: { family_id: string; family_expires_at: number } = { family_id: randomUUID(), family_expires_at: now() + 30 * 86400 }) {
  const access_token = secret();
  const refresh_token = secret();
  await write(`access/${digest(access_token)}.json`, { ...grant, ...family, expires_at: now() + 900 });
  await write(`refresh/${digest(refresh_token)}.json`, { ...grant, ...family, expires_at: family.family_expires_at });
  return { access_token, refresh_token, token_type: 'Bearer', expires_in: 900, scope: grant.scope };
}

export async function exchangeToken(params: URLSearchParams) {
  const clientId = z.uuid().parse(params.get('client_id'));
  const client = await read(`clients/${clientId}.json`, clientSchema);
  if (!client) throw new Error('Invalid OAuth client.');
  if (params.get('grant_type') === 'authorization_code') {
    const code = params.get('code') || '';
    const grant = await read(`codes/${digest(code)}.json`, grantSchema);
    if (!grant || grant.expires_at <= now() || grant.client_id !== clientId || grant.redirect_uri !== params.get('redirect_uri') || (params.get('resource') && params.get('resource') !== grant.resource)) throw new Error('Invalid or expired authorization code.');
    const verifier = params.get('code_verifier') || '';
    if (!/^[A-Za-z0-9._~-]{43,128}$/.test(verifier)) throw new Error('Invalid PKCE verifier.');
    const actual = createHash('sha256').update(verifier).digest('base64url');
    if (!timingSafeEqual(Buffer.from(actual), Buffer.from(grant.code_challenge))) throw new Error('Invalid PKCE verifier.');
    if (!await claim(`code-${digest(code)}`)) throw new Error('Authorization code was already used.');
    return issueTokens(grant);
  }
  if (params.get('grant_type') === 'refresh_token') {
    const refresh = params.get('refresh_token') || '';
    const grant = await read(`refresh/${digest(refresh)}.json`, tokenSchema);
    if (!grant || grant.expires_at <= now() || grant.client_id !== clientId || (params.get('resource') && params.get('resource') !== grant.resource) || await read(`revoked/${grant.family_id}.json`, markerSchema)) throw new Error('Invalid or expired refresh token.');
    if (!await claim(`refresh-${digest(refresh)}`)) {
      await revokeToken(new URLSearchParams({ token: refresh, client_id: clientId }));
      throw new Error('Refresh token reuse detected. Reconnect the agent.');
    }
    return issueTokens(grant, { family_id: grant.family_id, family_expires_at: grant.family_expires_at });
  }
  throw new Error('Unsupported grant type.');
}

export async function readAccessToken(token: string) {
  const grant = await read(`access/${digest(token)}.json`, tokenSchema);
  if (!grant || grant.expires_at <= now() || grant.resource !== RESOURCE() || await read(`revoked/${grant.family_id}.json`, markerSchema)) return null;
  return grant;
}

export async function revokeToken(params: URLSearchParams) {
  const token = params.get('token') || '';
  const clientId = params.get('client_id');
  if (!token || !clientId) return;
  const grant = await read(`access/${digest(token)}.json`, tokenSchema) || await read(`refresh/${digest(token)}.json`, tokenSchema);
  if (!grant || grant.client_id !== clientId) return;
  const { error } = await contentClient().storage.from(AUTH_BUCKET).upload(`revoked/${grant.family_id}.json`, JSON.stringify({ at: now() }), { contentType: 'application/json', upsert: true });
  if (error) throw new Error('Could not revoke this connection.');
}

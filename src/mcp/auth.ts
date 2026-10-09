import type { AuthInfo } from '@modelcontextprotocol/server';
import { createRemoteJWKSet, jwtVerify } from 'jose';
import { query, environment } from '@/worker/context';
import { readAccessToken } from './oauth';
export function siteOrigin() { return new URL(environment().SITE_URL).origin; }
export function allowedOwner(id: string) { return environment().OWNER_PROFILE_IDS.split(',').map(x => x.trim()).includes(id); }
export async function ownerFromIdentityToken(token: string) {
  const env = environment();
  // Verify signature, issuer and expiration; map identity to preserved application UUID.
  const jwks = createRemoteJWKSet(new URL(env.NEON_AUTH_JWKS_URL));
  const { payload } = await jwtVerify(token, jwks, { issuer: new URL(env.NEON_AUTH_BASE_URL).origin, audience: new URL(env.NEON_AUTH_BASE_URL).origin, algorithms: ['EdDSA'] });
  const [profile] = await query<{id:string;role:string}>('SELECT id,role FROM users WHERE auth_subject=$1', [payload.sub]);
  if (!profile || profile.role !== 'admin' || !allowedOwner(profile.id)) throw new Error('Only the configured site owner can connect an agent.');
  return profile.id;
}
export async function verifyOwner(_request: Request, token?: string): Promise<AuthInfo | undefined> {
  if (!token) return undefined;
  const grant = await readAccessToken(token);
  if (!grant || !allowedOwner(grant.user_id)) return undefined;
  const [profile] = await query<{role:string}>('SELECT role FROM users WHERE id=$1', [grant.user_id]);
  if (!profile || profile.role !== 'admin') return undefined;
  return { token, clientId: grant.client_id, scopes: grant.scope.split(' '), expiresAt: grant.expires_at, resource: new URL(grant.resource), extra: {userId:grant.user_id} };
}

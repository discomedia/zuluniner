// Explicit live mutation test. Deletes only IDs created by this invocation.
import assert from 'node:assert/strict';
import { randomBytes, createHash } from 'node:crypto';
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';
import sharp from 'sharp';
import { output } from '../src/mcp/schemas';
import type { Database } from '../src/api/schema';

async function main() {
const origin = new URL(process.argv[2] || 'https://zuluniner.com').origin;
const resource = `${origin}/api/mcp`;
const client = createClient<Database>(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, { auth: { persistSession: false } });
const ownerId = (process.env.ZULUNINER_MCP_OWNER_IDS || '').split(',')[0];
assert.ok(ownerId, 'Configure an owner UUID in .env.');
const owner = await client.auth.admin.getUserById(ownerId);
assert.ok(owner.data.user?.email, 'Owner must have an existing verified Auth account.');
const link = await client.auth.admin.generateLink({ type: 'magiclink', email: owner.data.user.email });
if (link.error) throw link.error;
const ownerAuth = createClient<Database>(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, { auth: { persistSession: false } });
const login = await ownerAuth.auth.verifyOtp({ type: 'magiclink', token_hash: link.data.properties.hashed_token });
if (login.error) throw login.error;
const ownerToken = login.data.session!.access_token;
const callback = 'https://chatgpt.com/connector_platform_oauth_redirect';
const tokenSchema = z.object({ access_token: z.string(), refresh_token: z.string(), expires_in: z.number(), token_type: z.literal('Bearer') });
const rpcSchema = z.object({ result: z.json().optional(), error: z.object({ message: z.string() }).passthrough().optional() });
let rpcId = 0;
let token = '';
const created: Array<{ kind: 'post' | 'aircraft'; id: string }> = [];
const assets: Array<{ kind: 'post' | 'aircraft'; storage_path: string }> = [];
const prefix = `mcp-verify-${Date.now()}`;
const record = z.object({ id: z.uuid(), updated_at: z.string(), slug: z.string() }).passthrough();

async function form(path: string, params: Record<string, string>) {
  return fetch(`${origin}${path}`, { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams(params) });
}
async function oauth(scopes = 'content:read content:write') {
  const registration = await fetch(`${origin}/oauth/register`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ client_name: 'ZuluNiner verification', redirect_uris: [callback], token_endpoint_auth_method: 'none' }) });
  assert.equal(registration.status, 201);
  const registered = z.object({ client_id: z.uuid() }).parse(await registration.json());
  const verifier = randomBytes(32).toString('base64url');
  const params = new URLSearchParams({ client_id: registered.client_id, redirect_uri: callback, state: prefix, response_type: 'code', code_challenge: createHash('sha256').update(verifier).digest('base64url'), code_challenge_method: 'S256', resource, scope: scopes });
  const authorize = await fetch(`${origin}/oauth/authorize?${params}`, { redirect: 'manual' });
  assert.equal(authorize.status, 302);
  const requestId = new URL(authorize.headers.get('location')!).searchParams.get('request_id')!;
  const consent = await fetch(`${origin}/api/oauth/request`, { method: 'POST', headers: { 'Content-Type': 'application/json', Origin: origin, Authorization: `Bearer ${ownerToken}` }, body: JSON.stringify({ request_id: requestId, approved: true }) });
  assert.equal(consent.status, 200, 'Owner consent must succeed.');
  const redirect = z.object({ redirect_url: z.url() }).parse(await consent.json());
  const code = new URL(redirect.redirect_url).searchParams.get('code')!;
  const grant = { client_id: registered.client_id, grant_type: 'authorization_code', redirect_uri: callback, code, code_verifier: verifier, resource };
  assert.equal((await form('/oauth/token', { ...grant, code_verifier: randomBytes(32).toString('base64url') })).status, 400, 'Reject wrong PKCE.');
  const exchange = await form('/oauth/token', grant);
  assert.equal(exchange.status, 200);
  const tokens = tokenSchema.parse(await exchange.json());
  assert.equal((await form('/oauth/token', grant)).status, 400, 'Reject reused authorization code.');
  return { ...tokens, client_id: registered.client_id };
}
async function rpc(method: string, params: object, bearer = token) {
  const response = await fetch(resource, { method: 'POST', headers: { Authorization: `Bearer ${bearer}`, 'Content-Type': 'application/json', Accept: 'application/json,text/event-stream', 'MCP-Protocol-Version': '2025-06-18' }, body: JSON.stringify({ jsonrpc: '2.0', id: ++rpcId, method, params }) });
  const body = await response.text();
  assert.equal(response.status, 200, `MCP ${method}: ${body.slice(0,500)}`);
  const json = response.headers.get('content-type')?.includes('text/event-stream') ? body.split('\n').filter(line => line.startsWith('data: ')).map(line => JSON.parse(line.slice(6))).find(value => value.id === rpcId) : JSON.parse(body);
  const parsed = rpcSchema.parse(json);
  if (parsed.error) throw new Error(parsed.error.message);
  return parsed.result;
}
async function call(name: string, args: object, expectedFailed = 0) {
  const raw = await rpc('tools/call', { name, arguments: args });
  const result = z.object({ structuredContent: output }).parse(raw).structuredContent;
  assert.equal(result.failed, expectedFailed, `${name}: ${JSON.stringify(result)}`);
  assert.equal(result.atomic, false);
  console.log(`${name}: ${result.succeeded} succeeded, ${result.failed} expected failures`);
  return result;
}

const grant = await oauth();
token = grant.access_token;
try {
  assert.equal((await fetch(resource)).status, 401, 'Unauthenticated MCP must be denied.');
  assert.equal((await fetch(resource, { headers: { Origin: 'https://untrusted.example' } })).status, 403);
  for (const route of ['/admin', '/api/admin/blog', '/api/admin/aircraft/auto-populate']) assert.equal((await fetch(`${origin}${route}`)).status, 404, route);
  const tools = z.object({ tools: z.array(z.object({ name: z.string(), annotations: z.object({ readOnlyHint: z.boolean(), destructiveHint: z.boolean() }).passthrough(), inputSchema: z.json(), outputSchema: z.json() })) }).parse(await rpc('tools/list', {}));
  assert.equal(tools.tools.length, 11);
  assert.ok(tools.tools.find(tool => tool.name === 'delete_content')?.annotations.destructiveHint);
  console.log('Owner OAuth, PKCE, single-use codes, scope discovery, auth/origin rejection and removed routes passed.');
  await call('list_content', { kind: 'aircraft', limit: 2 });
  await call('list_sellers', {});
  const posts = await call('create_posts', { items: [0,1].map(i => ({ title: `MCP verification post ${i}`, slug: `${prefix}-post-${i}`, content: 'Disposable **test** content.' })) });
  for (const item of posts.results) created.push({ kind: 'post', id: record.parse(item.data).id });
  const planes = await call('create_aircraft', { items: [0,1].map(i => ({ title: `MCP verification aircraft ${i} — not for sale`, slug: `${prefix}-aircraft-${i}`, price: 0, year: 2000, make: 'Test', model: 'Test', description: 'Disposable synthetic test listing. Not an actual aircraft for sale.' })) });
  for (const item of planes.results) created.push({ kind: 'aircraft', id: record.parse(item.data).id });
  const postRecords = posts.results.map(item => record.parse(item.data));
  const planeRecords = planes.results.map(item => record.parse(item.data));
  // Warm list pages and negative detail caches before publishing.
  await Promise.all([fetch(`${origin}/`), fetch(`${origin}/blog`), fetch(`${origin}/aircraft`)]);
  assert.equal((await fetch(`${origin}/blog/${postRecords[0].slug}`)).status, 404);
  assert.equal((await fetch(`${origin}/aircraft/${planeRecords[0].slug}`)).status, 404);
  assert.ok(posts.results.every(item => z.object({ published: z.literal(false) }).safeParse(item.data).success));
  assert.ok(planes.results.every(item => z.object({ status: z.literal('draft') }).safeParse(item.data).success));
  await call('update_posts', { items: postRecords.map(item => ({ id: item.id, expected_updated_at: item.updated_at, changes: { blurb: 'Updated by batch verification' } })) });
  await call('update_aircraft', { items: planeRecords.map(item => ({ id: item.id, expected_updated_at: item.updated_at, changes: { avionics: 'Synthetic MCP test value' } })) });
  await call('update_posts', { items: [{ id: postRecords[0].id, expected_updated_at: postRecords[0].updated_at, changes: { title: 'Must fail stale revision' } }] }, 1);
  const partial = await call('create_posts', { items: [{ title: 'Duplicate should fail', slug: postRecords[0].slug }, { title: 'Partial success test', slug: `${prefix}-partial` }] }, 1);
  assert.equal(partial.results[0].ok, false); assert.equal(partial.results[1].ok, true);
  created.push({ kind: 'post', id: record.parse(partial.results[1].data).id });
  const png = await sharp({ create: { width: 120, height: 80, channels: 3, background: '#187dbb' } }).png().toBuffer();
  const images = await call('upload_images', { items: [{ kind: 'post', filename: 'test.png', base64: png.toString('base64') }, { kind: 'aircraft', filename: 'test.png', base64: png.toString('base64') }] });
  const image = z.object({ storage_path: z.string(), public_url: z.url() });
  const [postImage, planeImage] = images.results.map(item => image.parse(item.data));
  assets.push({ kind: 'post', storage_path: postImage.storage_path }, { kind: 'aircraft', storage_path: planeImage.storage_path });
  await call('update_posts', { items: [{ id: postRecords[0].id, changes: { header_photo: postImage.storage_path, content: `Test **Markdown**.\n\n![Test](${postImage.public_url})`, published: true } }] });
  await call('set_aircraft_images', { items: planeRecords.map(item => ({ id: item.id, photos: [{ storage_path: planeImage.storage_path, alt_text: 'Synthetic test image', caption: 'Not a real aircraft' }] })) });
  const readback = await call('get_content', { items: created.map(item => ({ kind: item.kind, identifier: item.id })) });
  const actualPost = z.object({ title: z.string(), blurb: z.string(), header_photo: z.string(), published: z.literal(true) }).parse(readback.results[0].data);
  assert.equal(actualPost.title, 'MCP verification post 0'); assert.equal(actualPost.blurb, 'Updated by batch verification');
  assert.ok(readback.results.filter((_,i) => created[i].kind==='aircraft').every(item => z.object({ photos: z.array(z.object({ is_primary: z.literal(true) })).length(1) }).safeParse(item.data).success));
  assert.equal((await fetch(`${origin}/blog/${postRecords[0].slug}`)).status, 200);
  assert.equal((await fetch(`${origin}/aircraft/${planeRecords[0].slug}`)).status, 404, 'Draft must not be public.');
  assert.ok((await (await fetch(`${origin}/blog`)).text()).includes(postRecords[0].slug), 'Published post must invalidate the cached index.');
  await call('update_posts', { items: [{ id: postRecords[0].id, changes: { title: 'MCP verification cache update' } }] });
  assert.ok((await (await fetch(`${origin}/blog/${postRecords[0].slug}`)).text()).includes('MCP verification cache update'), 'Edits must invalidate cached detail HTML.');
  await call('update_posts', { items: [{ id: postRecords[0].id, changes: { published: false } }] });
  assert.equal((await fetch(`${origin}/blog/${postRecords[0].slug}`)).status, 404, 'Unpublishing must expire public HTML immediately.');
  assert.ok(!(await (await fetch(`${origin}/blog`)).text()).includes(postRecords[0].slug), 'Unpublishing must invalidate the index.');
  const renamedPost = `${prefix}-renamed-post`;
  await call('update_posts', { items: [{ id: postRecords[0].id, changes: { slug: renamedPost, published: true } }] });
  assert.equal((await fetch(`${origin}/blog/${postRecords[0].slug}`)).status, 404);
  assert.equal((await fetch(`${origin}/blog/${renamedPost}`)).status, 200, 'A new slug must render on demand.');
  await call('update_aircraft', { items: [{ id: planeRecords[0].id, changes: { status: 'active' } }] });
  assert.equal((await fetch(`${origin}/aircraft/${planeRecords[0].slug}`)).status, 200, 'Publishing must expire a cached draft 404.');
  assert.ok((await (await fetch(`${origin}/aircraft`)).text()).includes(planeRecords[0].slug), 'Publishing must invalidate the cached inventory.');
  assert.ok((await (await fetch(`${origin}/`)).text()).includes(planeRecords[0].slug), 'Publishing must invalidate the cached featured aircraft.');
  await call('update_aircraft', { items: [{ id: planeRecords[0].id, changes: { title: 'MCP verification aircraft cache update — not for sale' } }] });
  assert.ok((await (await fetch(`${origin}/aircraft/${planeRecords[0].slug}`)).text()).includes('MCP verification aircraft cache update'), 'Aircraft edits must expire detail HTML.');
  await call('update_aircraft', { items: [{ id: planeRecords[0].id, changes: { status: 'draft' } }] });
  assert.equal((await fetch(`${origin}/aircraft/${planeRecords[0].slug}`)).status, 404, 'Unpublishing an aircraft must expire cached HTML.');
  await call('update_aircraft', { items: [{ id: planeRecords[0].id, changes: { status: 'active' } }] });
  assert.equal((await fetch(`${origin}/aircraft/${planeRecords[0].slug}`)).status, 200);
  console.log('Public caches: publish, edits, unpublish, rename, cached 404s and featured inventory passed.');
  await call('set_aircraft_images', { items: planeRecords.map(item => ({ id: item.id, photos: [] })) });
  const direct = await call('begin_image_upload', { items: [{ kind: 'aircraft', filename: 'direct.png' }] });
  const signed = z.object({ storage_path: z.string(), signed_upload_url: z.url() }).parse(direct.results[0].data);
  const upload = await fetch(signed.signed_upload_url, { method: 'PUT', headers: { 'Content-Type': 'image/png' }, body: new Uint8Array(png) });
  assert.ok(upload.ok, 'Signed binary upload must succeed.'); assets.push({ kind: 'aircraft', storage_path: signed.storage_path });
  await call('set_aircraft_images', { items: [{ id: planeRecords[0].id, photos: [{ storage_path: signed.storage_path, alt_text: 'Direct upload test' }] }] });
  await call('upload_images', { items: [{ kind: 'post', filename: 'copy.webp', source_url: postImage.public_url }, { kind: 'post', filename: 'blocked.jpg', source_url: 'https://127.0.0.1/a.jpg' }] }, 1).then(result => { assets.push({ kind: 'post', storage_path: image.parse(result.results[0].data).storage_path }); });
  const readGrant = await oauth('content:read');
  const denied = z.object({ isError: z.literal(true), content: z.array(z.object({ text: z.string() }).passthrough()) }).parse(await rpc('tools/call', { name: 'create_posts', arguments: { items: [{ title: 'Denied', slug: `${prefix}-denied` }] } }, readGrant.access_token));
  assert.match(denied.content[0].text, /content:write/);
  await form('/oauth/revoke', { client_id: readGrant.client_id, token: readGrant.access_token });
  assert.equal((await fetch(resource, { headers: { Authorization: `Bearer ${readGrant.access_token}` } })).status, 401);
  const refreshed = await form('/oauth/token', { grant_type: 'refresh_token', client_id: grant.client_id, refresh_token: grant.refresh_token, resource });
  assert.equal(refreshed.status, 200);
  const newGrant = tokenSchema.parse(await refreshed.json()); token = newGrant.access_token;
  await call('list_content', { kind: 'post', query: 'MCP verification' });
  console.log('CRUD, batch isolation, image import/direct upload, galleries, drafts, field preservation and read-only scope passed.');
  await call('delete_content', { items: created }); created.length=0;
  assert.equal((await fetch(`${origin}/blog/${renamedPost}`)).status, 404, 'Deletion must expire cached post HTML.');
  assert.equal((await fetch(`${origin}/aircraft/${planeRecords[0].slug}`)).status, 404, 'Deletion must expire cached aircraft HTML.');
  assert.ok(!(await (await fetch(`${origin}/aircraft`)).text()).includes(planeRecords[0].slug));
  assert.ok(!(await (await fetch(`${origin}/blog`)).text()).includes(renamedPost));
  assert.equal((await form('/oauth/token', { grant_type: 'refresh_token', client_id: grant.client_id, refresh_token: grant.refresh_token })).status, 400);
  assert.equal((await fetch(resource, { headers: { Authorization: `Bearer ${newGrant.access_token}` } })).status, 401, 'Refresh replay must revoke the family.');
  console.log('Batch deletion, refresh rotation/replay revocation passed. All live MCP checks passed.');
} finally {
  // Cleanup uses service role only for IDs returned by this run, even if transport failed.
  for (const item of created) { const result=await client.from(item.kind==='post'?'blog_posts':'aircraft').delete().eq('id',item.id).like('slug',`${prefix}%`);if(result.error)console.error('Test cleanup failed:',item.id); }
  for (const kind of ['post','aircraft'] as const) { const paths=assets.filter(item=>item.kind===kind).map(item=>item.storage_path);if(paths.length)await client.storage.from(kind==='post'?'blog-images':'aircraft-photos').remove(paths); }
  await form('/oauth/revoke', { client_id: grant.client_id, token: grant.access_token });
  await ownerAuth.auth.signOut();
}

}
main().catch(error => { console.error(error instanceof Error ? error.stack : 'Verification failed.'); process.exitCode = 1; });

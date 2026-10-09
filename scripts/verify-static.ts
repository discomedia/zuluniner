import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {setTimeout} from 'node:timers/promises';
import {isDeepStrictEqual} from 'node:util';
import {z} from 'zod';
const origin=new URL(process.argv[2]||'https://zuluniner.com').origin;
const manifestSchema=z.object({snapshot_at:z.string(),aircraft:z.array(z.object({slug:z.string(),title:z.string()})),posts:z.array(z.object({slug:z.string(),title:z.string()}))});
const expected=manifestSchema.parse(JSON.parse(await readFile('dist/content-manifest.json','utf8')));
let manifest=manifestSchema.parse(await(await fetch(origin+'/content-manifest.json',{cache:'no-store'})).json());
// A completed upload can precede propagation to the checking edge. Allow 45
// seconds in total, but require the exact built snapshot before checking routes.
for(let attempt=1;attempt<=5&&!isDeepStrictEqual(manifest,expected);attempt++){
 console.log(`Waiting for the built snapshot to reach the public endpoint (retry ${attempt}/5).`);
 await setTimeout(attempt*3000);
 manifest=manifestSchema.parse(await(await fetch(origin+'/content-manifest.json',{cache:'no-store'})).json());
}
assert.deepEqual(manifest,expected,'Deployed content must match the build snapshot.');
const {aircraft,posts}=manifest;
const routes=['/','/aircraft','/blog','/about','/sell','/contact','/privacy','/terms','/connect',...aircraft.map(a=>`/aircraft/${a.slug}`),...posts.map(p=>`/blog/${p.slug}`)];
for(const path of routes){const response=await fetch(origin+path);assert.equal(response.status,200,path);const html=await response.text();assert.ok(!html.includes('/_next/'),path);assert.ok(!html.includes('supabase.co'),path);assert.ok(!html.includes('postgresql://'),path);if(path==='/'||path.startsWith('/blog'))assert.ok(!html.includes('astro-island'),`${path} should have no hydrated framework`);console.log(`Static route passed: ${path}`);}
for(const [kind,rows] of [['aircraft',aircraft],['blog',posts]] as const)for(const row of rows){const html=await(await fetch(`${origin}/${kind}/${row.slug}`)).text();assert.ok(html.includes(String(row.title).replace(/&/g,'&amp;')),`${kind}/${row.slug} title`);}
for(const path of ['/admin','/api/admin/blog','/not-a-real-route'])assert.equal((await fetch(origin+path)).status,404,path);
const mcp=await fetch(origin+'/api/mcp');assert.equal(mcp.status,401);assert.ok(mcp.headers.get('www-authenticate')?.includes('oauth-protected-resource'));
const metadata=await fetch(origin+'/.well-known/oauth-authorization-server');assert.equal(metadata.status,200);
console.log(`${routes.length} public routes and protected MCP verified.`);

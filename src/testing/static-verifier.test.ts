import {test} from 'node:test';
import assert from 'node:assert/strict';
import {verifyStaticSite} from '../../scripts/static-verifier';

const expected={snapshot_at:'2026-10-15T00:00:00Z',aircraft:Array.from({length:200},(_,i)=>({slug:'plane-'+i,title:'Aircraft '+i})),posts:[{slug:'article',title:'An article'}]};
function fixture({failPath='',permanent=false,wrongTitle=false}={}){
 const counts=new Map<string,number>();let active=0,maxActive=0;
 const request:typeof fetch=async input=>{const path=new URL(String(input)).pathname,count=(counts.get(path)||0)+1;counts.set(path,count);active++;maxActive=Math.max(active,maxActive);await new Promise(resolve=>setTimeout(resolve,1));active--;
 if(path==='/content-manifest.json')return Response.json(expected);
 if(path===failPath&&(permanent||count===1))return new Response('Edge not ready',{status:502});
 if(['/admin','/api/admin/blog','/not-a-real-route'].includes(path))return new Response('Not found',{status:404});
 if(path==='/api/mcp')return new Response('Protected',{status:401,headers:{'www-authenticate':'Bearer resource_metadata="oauth-protected-resource"'}});
 const entry=expected.aircraft.find(row=>path==='/aircraft/'+row.slug)||expected.posts.find(row=>path==='/blog/'+row.slug);
 return new Response(entry?(wrongTitle?'Wrong title':entry.title):'Static page');
 };
 return {request,counts,maxActive:()=>maxActive};
}
test('static verifier checks 200 listing titles in one read per route with bounded concurrency',async()=>{
 const f=fixture(),report=await verifyStaticSite({origin:'https://example.test',expected,request:f.request,sleep:async()=>{}});
 assert.equal(report.routes,210);assert.equal(report.requests,216);assert.equal(f.counts.get('/aircraft/plane-0'),1);assert.ok(f.maxActive()>1&&f.maxActive()<=6);
});
test('transient route failures retry only that route instead of triggering a deployment rerun',async()=>{
 const f=fixture({failPath:'/aircraft/plane-1'}),report=await verifyStaticSite({origin:'https://example.test',expected,request:f.request,sleep:async()=>{}});
 assert.equal(report.retries,1);assert.equal(f.counts.get('/aircraft/plane-1'),2);assert.equal(f.counts.get('/aircraft/plane-0'),1);
});
test('persistent route failures and wrong content still fail the publication check',async()=>{
 const f=fixture({failPath:'/aircraft/plane-1',permanent:true});
 await assert.rejects(verifyStaticSite({origin:'https://example.test',expected,request:f.request,sleep:async()=>{},retryDelays:[0,0]}),/plane-1/);
 assert.equal(f.counts.get('/aircraft/plane-1'),3);
 const wrong=fixture({wrongTitle:true});await assert.rejects(verifyStaticSite({origin:'https://example.test',expected,request:wrong.request,sleep:async()=>{}}),/title/);
});

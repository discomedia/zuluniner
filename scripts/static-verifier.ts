import assert from 'node:assert/strict';
import {setTimeout} from 'node:timers/promises';
import {isDeepStrictEqual} from 'node:util';
import {z} from 'zod';

export const manifestSchema=z.object({snapshot_at:z.string(),aircraft:z.array(z.object({slug:z.string(),title:z.string()})),posts:z.array(z.object({slug:z.string(),title:z.string()}))});
type Manifest=z.infer<typeof manifestSchema>;
type Options={origin:string;expected:Manifest;request?:typeof fetch;sleep?:(ms:number)=>Promise<unknown>;concurrency?:number;retryDelays?:number[];onProgress?:(message:string)=>void};

export async function verifyStaticSite({origin,expected,request=fetch,sleep=setTimeout,concurrency=6,retryDelays=[500,1500,4000,8000],onProgress=()=>{}}:Options) {
  assert.ok(Number.isInteger(concurrency)&&concurrency>=1&&concurrency<=8,'Bounded route concurrency required');
  let requests=0,retries=0;
  const get=async(path:string,status=200)=>{
    for(let attempt=0;;attempt++){
      let response:Response|undefined;
      try {requests++;response=await request(origin+path,{cache:'no-store',signal:AbortSignal.timeout(15000)});}
      catch(error){if(attempt>=retryDelays.length)throw error;}
      if(response?.status===status)return response;
      const transient=!response||[404,429,500,502,503,504].includes(response.status);
      if(!transient||attempt>=retryDelays.length){await response?.body?.cancel();assert.equal(response?.status,status,path);throw Error('Static route unavailable: '+path);}
      const retryAfter=Number(response?.headers.get('retry-after'));
      await response?.body?.cancel();retries++;
      onProgress(`Retrying transient route response for ${path} (${attempt+1}/${retryDelays.length}).`);
      await sleep(Math.max(retryDelays[attempt],Number.isFinite(retryAfter)?Math.min(retryAfter*1000,30000):0));
    }
  };
  let manifest=manifestSchema.parse(await(await get('/content-manifest.json')).json());
  for(let attempt=1;attempt<=5&&!isDeepStrictEqual(manifest,expected);attempt++){
    onProgress(`Waiting for the exact build snapshot (${attempt}/5).`);await sleep(attempt*3000);
    manifest=manifestSchema.parse(await(await get('/content-manifest.json')).json());
  }
  assert.deepEqual(manifest,expected,'Deployed content must match the build snapshot.');
  const routes=new Map<string,string|undefined>(['/','/aircraft','/blog','/about','/sell','/contact','/privacy','/terms','/connect'].map(path=>[path,undefined]));
  for(const [kind,rows] of [['aircraft',manifest.aircraft],['blog',manifest.posts]] as const)for(const row of rows)routes.set(`/${kind}/${row.slug}`,row.title);
  const jobs=[...routes];let next=0,checked=0,failed=false;
  const settled=await Promise.allSettled(Array.from({length:Math.min(concurrency,jobs.length)},async()=>{
    try{while(!failed){const index=next++;if(index>=jobs.length)break;const [path,title]=jobs[index];const response=await get(path);const html=await response.text();
      assert.ok(!html.includes('/_next/'),path);assert.ok(!html.includes('supabase.co'),path);assert.ok(!html.includes('postgresql://'),path);
      if(path==='/'||path.startsWith('/blog'))assert.ok(!html.includes('astro-island'),`${path} should have no hydrated framework`);
      if(title)assert.ok(html.includes(title.replace(/&/g,'&amp;')),`${path} title`);
      checked++;if(checked%50===0)onProgress(`Static routes passed: ${checked}/${jobs.length}`);
    }}catch(error){failed=true;throw error;}
  }));
  const failure=settled.find((result):result is PromiseRejectedResult=>result.status==='rejected');if(failure)throw failure.reason;
  for(const path of ['/admin','/api/admin/blog','/not-a-real-route'])await get(path,404);
  const mcp=await get('/api/mcp',401);assert.ok(mcp.headers.get('www-authenticate')?.includes('oauth-protected-resource'));
  await get('/.well-known/oauth-authorization-server');
  return {routes:checked,requests,retries,snapshot_at:manifest.snapshot_at};
}

import {test} from 'node:test';
import assert from 'node:assert/strict';
import worker from '../worker/index';
import type {RuntimeEnv} from '../worker/context';

test('1600 reads the main object directly; absent smaller variants fall back to main',async()=>{
  const previous=globalThis.caches;
  globalThis.caches={open:async()=>({match:async()=>undefined,put:async()=>undefined})} as unknown as CacheStorage;
  try {
    for(const width of ['', '1600', '480', '960']) {
      const reads:string[]=[];
      const env={MEDIA:{get:async(key:string)=>{
        reads.push(key);
        return key.startsWith('variants/')?null:{body:'main image',httpEtag:'"main"',writeHttpMetadata:(headers:Headers)=>headers.set('Content-Type','image/webp')};
      }}} as unknown as RuntimeEnv;
      const response=await worker.fetch(new Request('https://zuluniner.com/images/aircraft-photos/test.webp'+(width?'?w='+width:'')),env,{waitUntil:()=>undefined} as unknown as ExecutionContext);
      assert.equal(response.status,200);
      assert.equal(await response.text(),'main image');
      assert.deepEqual(reads,width && width!=='1600'?[`variants/${width}/aircraft-photos/test.webp`,'aircraft-photos/test.webp']:['aircraft-photos/test.webp']);
    }
  } finally {globalThis.caches=previous;}
});

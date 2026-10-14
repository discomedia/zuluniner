/* global Response, Request, URL, Buffer, setTimeout */
import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,writeFile,readFile,rm,appendFile} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {uploadObjects,sha256} from './media.mjs';
import {receiptStore} from './receipts.mjs';

test('3636-object media run uses bounded S3 lanes, one snapshot, exact verification and a zero-request repeat',async()=>{
 const directory=await mkdtemp(join(tmpdir(),'zuluniner-media-scale-')),body=Buffer.from('prepared-webp-fixture'),digest=sha256(body),stored=new Map();
 const file=join(directory,'image.webp'),lockFile=join(directory,'lock.json'),receiptsPath=join(directory,'receipts.json');
 await writeFile(file,body);await writeFile(lockFile,JSON.stringify({source:'controller',token:'test-lock'}));
 let writes=0,reads=0,inFlight=0,maxInFlight=0;
 const request=async(input,options={})=>{
   const req=input instanceof Request?input:new Request(input,options),url=new URL(req.url);
   inFlight++;maxInFlight=Math.max(maxInFlight,inFlight);await new Promise(resolve=>setTimeout(resolve,1));
   try{if(req.method==='PUT'){writes++;assert.ok(url.hostname.endsWith('.r2.cloudflarestorage.com'));assert.ok(req.headers.get('authorization').startsWith('AWS4-HMAC-SHA256 '));const key=url.pathname.replace('/zuluniner-images/','');stored.set(key,Buffer.from(await req.arrayBuffer()));return new Response(null);}
    reads++;const key=url.pathname.replace('/images/','');return new Response(stored.get(key),{headers:{'Content-Type':'image/webp'}});
   }finally{inFlight--;}
 };
 const objects=Array.from({length:3636},(_,i)=>{const key=`aircraft-photos/mcp/sync-experiment-scale-${i}.webp`;return {key,file,sha256:digest,bytes:body.length,public_url:'https://zuluniner.com/images/'+key};});
 const options={objects,receiptsPath,accountId:'a'.repeat(32),token:'fake-test-only-token',accessKeyId:'b'.repeat(32),source:'controller',lockToken:'test-lock',lockFile,request};
 try{
   const report=await uploadObjects(options);assert.equal(report.transport,'s3');assert.equal(writes,3636);assert.equal(reads,3636);assert.equal(report.full_snapshots,1);assert.equal(report.journal_appends,7272);assert.ok(maxInFlight>1&&maxInFlight<=6);assert.equal(inFlight,0);
   const repeat=await uploadObjects(options);assert.equal(repeat.requests,0);assert.equal(repeat.full_snapshots,0);assert.equal(writes,3636);assert.equal(reads,3636);
   assert.equal(Object.keys(JSON.parse(await readFile(receiptsPath))).length,3636);
 }finally{await rm(directory,{recursive:true,force:true});}
});
test('receipt journal recovers confirmed work and discards only an interrupted final append',async()=>{
 const directory=await mkdtemp(join(tmpdir(),'zuluniner-receipts-')),path=join(directory,'receipts.json');
 try{
  const first=await receiptStore(path);await first.set('verified',{sha256:'abc',verified_at:'2026-10-15'});await appendFile(path+'.journal','{"key":"interrupted');
  const recovered=await receiptStore(path);assert.equal(recovered.receipts.verified.verified_at,'2026-10-15');assert.equal(recovered.receipts.interrupted,undefined);
  await recovered.set('next',{sha256:'def',verified_at:'2026-10-15'});await recovered.checkpoint();assert.equal(Object.keys(JSON.parse(await readFile(path))).length,2);
 }finally{await rm(directory,{recursive:true,force:true});}
});
test('media failure settles all active lanes before releasing control and preserves successful receipts',async()=>{
 const directory=await mkdtemp(join(tmpdir(),'zuluniner-media-failure-')),body=Buffer.from('fixture'),file=join(directory,'image'),lockFile=join(directory,'lock.json'),receiptsPath=join(directory,'receipts.json');
 await writeFile(file,body);await writeFile(lockFile,JSON.stringify({source:'controller',token:'test-lock'}));let active=0;
 const request=async(input,options={})=>{const req=input instanceof Request?input:new Request(input,options);active++;try{await new Promise(resolve=>setTimeout(resolve,5));if(req.method==='PUT'&&req.url.includes('failure-0'))return new Response('Denied',{status:403});return req.method==='PUT'?new Response(null):new Response(body,{headers:{'Content-Type':'image/webp'}});}finally{active--;}};
 const objects=Array.from({length:12},(_,i)=>({key:`aircraft-photos/mcp/sync-experiment-failure-${i}.webp`,file,sha256:sha256(body),bytes:body.length,public_url:`https://zuluniner.com/images/aircraft-photos/mcp/sync-experiment-failure-${i}.webp`}));
 try{await assert.rejects(uploadObjects({objects,receiptsPath,accountId:'a'.repeat(32),token:'fake',accessKeyId:'b'.repeat(32),source:'controller',lockToken:'test-lock',lockFile,request}),/403/);assert.equal(active,0);const receipts=JSON.parse(await readFile(receiptsPath));assert.ok(Object.values(receipts).some(r=>r.verified_at));}finally{await rm(directory,{recursive:true,force:true});}
});

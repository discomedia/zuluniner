/* global Buffer, fetch, AbortSignal, setTimeout */
// Operator media transport: prepare locally once, upload only missing objects,
// verify each new immutable object once, then reuse its durable receipt.
import {readFile, writeFile, mkdir} from 'node:fs/promises';
import {dirname} from 'node:path';
import {createHash} from 'node:crypto';
import sharp from 'sharp';
import {receiptStore} from './receipts.mjs';
import {createR2Client} from './s3.mjs';

export const sha256 = bytes => createHash('sha256').update(bytes).digest('hex');
export async function prepareFamily({file, source, sourceId, index, directory, storagePath}) {
  if (!['barnstormers','controller','trade-a-plane'].includes(source) || !/^\d+$/.test(sourceId)) throw Error('Invalid source identity');
  const input = await readFile(file), digest = sha256(input);
  const path = storagePath || `mcp/archive-${source}-${sourceId}-${index+1}-${digest.slice(0,16)}-native-v2.webp`;
  if (!/^mcp\/[a-z0-9-]+\.webp$/.test(path)) throw Error('Invalid immutable media path');
  const original = await sharp(input).rotate().resize({width:1600,height:1600,fit:'inside',withoutEnlargement:true}).webp({quality:85}).toBuffer();
  const objects = [];
  for (const width of [0,480,960,1600]) {
    const bytes = width && width !== 1600 ? await sharp(original).resize({width,withoutEnlargement:true}).webp({quality:85}).toBuffer() : original;
    const meta = await sharp(bytes).metadata();
    if (meta.format !== 'webp' || meta.width > (width || 1600)) throw Error('Invalid prepared image dimensions');
    await sharp(bytes).stats();
    const key = `${width ? 'variants/'+width+'/' : ''}aircraft-photos/${path}`;
    const output = directory + '/' + key;
    await mkdir(dirname(output), {recursive:true});
    await writeFile(output, bytes);
    objects.push({key, file:output, sha256:sha256(bytes), bytes:bytes.length, width:meta.width, public_url:'https://zuluniner.com/images/aircraft-photos/'+path+(width?'?w='+width:'')});
  }
  return {source_sha256:digest,storage_path:path,public_url:'https://zuluniner.com/images/aircraft-photos/'+path,objects};
}
export function missingObjects(objects, receipts) {
  return objects.filter(object => !(receipts[object.key]?.sha256 === object.sha256 && receipts[object.key]?.verified_at));
}
export async function uploadObjects({objects, receiptsPath, accountId, token, source, lockToken, minimumIntervalMs=500, concurrency=6, transport='s3', accessKeyId, request=fetch, lockFile='data/marketplace-sync/release.lock/owner.json'}) {
  if (!token || !accountId || !lockToken) throw Error('Existing operator authorization and release lock are required');
  if (!/^[a-f0-9]{32}$/.test(accountId) || !['barnstormers','controller','trade-a-plane'].includes(source) || concurrency < 1 || concurrency > 8 || (transport==='rest' && minimumIntervalMs < 500) || !['s3','rest'].includes(transport)) throw Error('Invalid operator account, source or pacing');
  const checkLock = async () => {
    const lock = JSON.parse(await readFile(lockFile,'utf8'));
    if (lock.source !== source || lock.token !== lockToken) throw Error('Source release lock no longer held');
  };
  await checkLock();
  const store=await receiptStore(receiptsPath),receipts=store.receipts;
  const started = Date.now(), pending = missingObjects(objects, receipts),pendingCount=pending.length;
  if(!pendingCount)return {elapsed_ms:Date.now()-started,objects:objects.length,uploaded_or_recovered:0,reused:objects.length,requests:0,transport,concurrency,...store.stats()};
  // Reserve slots synchronously so concurrency cannot cause an API burst.
  let nextSlot = Date.now(), pausedUntil = 0, requests=0;
  const s3=pending.length&&transport==='s3'?await createR2Client({accountId,token,accessKeyId,request}):null;
  const rateLimit = async () => {
    const slot = Math.max(Date.now(),nextSlot,pausedUntil);
    nextSlot = slot + minimumIntervalMs;
    if (slot > Date.now()) await new Promise(resolve => setTimeout(resolve,slot-Date.now()));
    if (Date.now() < pausedUntil) await rateLimit();
  };
  const retry = async (url, options, paced=false,objectKey=null) => {
    for (let attempt=0; attempt<4; attempt++) {
      if(Date.now()<pausedUntil)await new Promise(resolve=>setTimeout(resolve,pausedUntil-Date.now()));
      if (paced) await rateLimit();
      let response;
      try { requests++; response = await (objectKey&&s3?s3(objectKey,{...options,signal:AbortSignal.timeout(30000)}):request(url,{...options,signal:AbortSignal.timeout(30000)})); }
      catch { if (attempt===3) throw Error('Media network request failed after retries'); }
      if (response?.ok) return response;
      const status=response?.status || 0;
      if (![0,429,500,502,503,504].includes(status) || attempt===3) { await response?.body?.cancel(); throw Error('Media HTTP '+status); }
      const retryAfter = Number(response?.headers.get('retry-after'));
      const delay = Number.isFinite(retryAfter) && retryAfter > 0 ? retryAfter*1000 : 1000*(attempt+1);
      if (status===429) pausedUntil = Math.max(pausedUntil,Date.now()+delay);
      await response?.body?.cancel();
      await new Promise(resolve => setTimeout(resolve,delay));
    }
  };
  let failed=false;
  const settled=await Promise.allSettled(Array.from({length:Math.min(concurrency,pending.length)},async()=>{
   try {while(!failed){const object=pending.shift();if(!object)break;
    await checkLock();
    if (!/^(?:variants\/(?:480|960|1600)\/)?aircraft-photos\/mcp\/(?:archive-(?:barnstormers|controller|trade-a-plane)-|sync-experiment-)[a-z0-9-]+\.webp$/.test(object.key)) throw Error('Object key outside marketplace operator scope');
    if (!object.key.includes('/mcp/archive-'+source+'-') && !object.key.includes('/mcp/sync-experiment-')) throw Error('Object belongs to another source');
    const bytes = await readFile(object.file);
    if (sha256(bytes) !== object.sha256) throw Error('Prepared image checksum mismatch');
    const endpoint = `https://api.cloudflare.com/client/v4/accounts/${accountId}/r2/buckets/zuluniner-images/objects/${object.key}`;
    // An unfinished receipt recovers by exact public bytes; never probe all old images.
    let verified = false;
    if (receipts[object.key]?.sha256 === object.sha256) {
      try {
        const response = await retry(object.public_url,{});
        verified = sha256(Buffer.from(await response.arrayBuffer())) === object.sha256;
      } catch { /* Incomplete upload: recover by putting only this object. */ }
    }
    if (!verified) {
      const response = await retry(endpoint,{method:'PUT',headers:{...(transport==='rest'?{Authorization:'Bearer '+token,'cf-r2-data-catalog-check':'true'}:{}),'Content-Type':'image/webp','Cache-Control':'public,max-age=31536000,immutable'},body:bytes},transport==='rest',object.key);
      await response.arrayBuffer();
      receipts[object.key] = {sha256:object.sha256,bytes:object.bytes,uploaded_at:new Date().toISOString()};
      await store.set(object.key,receipts[object.key]);
      const published = await retry(object.public_url,{});
      if (published.headers.get('content-type') !== 'image/webp' || sha256(Buffer.from(await published.arrayBuffer())) !== object.sha256) throw Error('Published media bytes do not match prepared object');
    }
    receipts[object.key].verified_at = new Date().toISOString();
    await store.set(object.key,receipts[object.key]);
   }}catch(error){failed=true;throw error;}
  }));
  await store.checkpoint();
  const failure=settled.find(result=>result.status==='rejected');if(failure)throw failure.reason;
  return {elapsed_ms:Date.now()-started,objects:objects.length,uploaded_or_recovered:pendingCount,reused:objects.length-pendingCount,requests,transport,concurrency,...store.stats()};
}

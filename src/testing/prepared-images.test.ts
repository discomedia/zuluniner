import { test, mock } from 'node:test';
import assert from 'node:assert/strict';
import sharp from 'sharp';
import { prepareImageFamily } from '../../scripts/upload-prepared-image';
import { readPreparedImages } from '../mcp/prepared-images';
import { storeImage, storeImageFamily, beginImageUpload, acceptSignedUpload } from '../mcp/images';
import { withEnvironment, type RuntimeEnv } from '../worker/context';

test('JPEG, PNG and WebP prepare complete, correctly sized families without a transformation binding', async () => {
  for (const format of ['jpeg','png','webp'] as const) {
    const bytes = await sharp({create:{width:1800,height:1200,channels:3,background:'#8899aa'}}).toFormat(format).toBuffer();
    const family = await readPreparedImages(await prepareImageFamily(bytes));
    assert.equal((await sharp(family.original).metadata()).width,1600);
    assert.deepEqual(await Promise.all([...family.variants.values()].map(async bytes => (await sharp(bytes).metadata()).width)),[480,960,1600]);
  }
  const small = await sharp({create:{width:120,height:80,channels:4,background:'#8899aa88'}}).png().toBuffer();
  const family = await readPreparedImages(await prepareImageFamily(small));
  assert.deepEqual(await Promise.all([...family.variants.values()].map(async bytes => (await sharp(bytes).metadata()).width)),[120,120,120]);
});

test('prepared validation rejects missing, duplicate, non-WebP, truncated and mismatched images', async () => {
  const source = await sharp({create:{width:960,height:640,channels:3,background:'#667788'}}).png().toBuffer();
  for (const failure of ['missing','duplicate','png','truncated','aspect','1600'] as const) {
    const form = await prepareImageFamily(source);
    if (failure==='missing') form.delete('480');
    if (failure==='duplicate') form.append('480',form.get('480')!);
    if (failure==='png') form.set('480',new Blob([new Uint8Array(source)]),'480.webp');
    if (failure==='truncated') {
      const bytes = new Uint8Array(await (form.get('480') as File).arrayBuffer());
      form.set('480',new Blob([bytes.slice(0,-4)]),'480.webp');
    }
    if (failure==='aspect' || failure==='1600') {
      const bytes = await sharp({create:{width:failure==='aspect'?480:960,height:failure==='aspect'?480:640,channels:3,background:'#ff0000'}}).webp().toBuffer();
      form.set(failure==='aspect'?'480':'1600',new Blob([new Uint8Array(bytes)]),'variant.webp');
    }
    await assert.rejects(readPreparedImages(form),Error,failure);
  }
});

test('prepared storage writes variants before original, bypasses Images, and removes a failed new family', async () => {
  const source = await sharp({create:{width:120,height:80,channels:3,background:'#667788'}}).png().toBuffer();
  const family = await readPreparedImages(await prepareImageFamily(source));
  for (const fail of [false,true]) {
    const written: string[] = [], deleted: string[][] = [];
    const env = {SITE_URL:'https://zuluniner.com',MEDIA:{put:async(key:string)=>{written.push(key);if(fail && written.length===2)throw Error('R2 unavailable');},delete:async(keys:string[])=>{deleted.push(keys);}},IMAGES:{input:()=>{throw Error('Images must not be called');}}} as unknown as RuntimeEnv;
    await withEnvironment(env,async()=>{
      if (fail) await assert.rejects(storeImageFamily('blog-images','mcp/new.webp',family),/R2 unavailable/);
      else assert.equal((await storeImageFamily('blog-images','mcp/new.webp',family)).storage_path,'mcp/new.webp');
    });
    if(fail)assert.deepEqual(deleted,[['variants/480/blog-images/mcp/new.webp','variants/960/blog-images/mcp/new.webp','variants/1600/blog-images/mcp/new.webp','blog-images/mcp/new.webp']]);
    else assert.equal(written.at(-1),'blog-images/mcp/new.webp');
  }
});

test('quota failure points to the prepared path; invalid signed uploads cannot write objects', async () => {
  const source = await sharp({create:{width:120,height:80,channels:3,background:'#667788'}}).png().toBuffer();
  const env = {SITE_URL:'https://zuluniner.com',UPLOAD_SIGNING_SECRET:'test-only',IMAGES:{input:()=>{throw Error('IMAGES_TRANSFORM_ERROR 9422');}},MEDIA:{put:()=>{throw Error('must not write');}}} as unknown as RuntimeEnv;
  await withEnvironment(env,async()=>{
    await assert.rejects(storeImage('blog-images','mcp/new.webp',source),/scripts\/upload-prepared-image.ts/);
    const signed = await beginImageUpload('post','cover.webp');
    const invalid = new FormData(); invalid.set('original',new Blob([new Uint8Array(source)]),'cover.png');
    await assert.rejects(acceptSignedUpload(new Request(signed.signed_upload_url,{method:'PUT',body:invalid})),/Supply exactly one/);
    const bad = await acceptSignedUpload(new Request(signed.signed_upload_url.replace(/token=./,'token=x'),{method:'PUT',body:invalid}));
    assert.equal(bad.status,403);
  });
});

test('signed prepared uploads keep scope, expiry and single-use enforcement', async () => {
  const source = await sharp({create:{width:120,height:80,channels:3,background:'#667788'}}).png().toBuffer();
  const writes: string[] = [];
  let claims = 0;
  const fetchMock = mock.method(globalThis,'fetch',async()=>Response.json({fields:[{name:'key',dataTypeID:25}],rows:claims++===0?[['claimed']]:[],rowCount:claims===1?1:0,command:'INSERT'}));
  const env = {DATABASE_URL:'postgresql://test:test@ep-example.neon.tech/neondb',SITE_URL:'https://zuluniner.com',UPLOAD_SIGNING_SECRET:'test-only',MEDIA:{put:async(key:string)=>{writes.push(key);}},IMAGES:{input:()=>{throw Error('Images must not be called');}}} as unknown as RuntimeEnv;
  try {
    await withEnvironment(env,async()=>{
      const signed = await beginImageUpload('post','cover.webp');
      const send = async()=>acceptSignedUpload(new Request(signed.signed_upload_url,{method:'PUT',body:await prepareImageFamily(source)}));
      const response = await send();
      assert.equal(response.status,200);
      assert.deepEqual(await response.json(),{storage_path:signed.storage_path,public_url:signed.public_url,bytes:(await readPreparedImages(await prepareImageFamily(source))).original.byteLength});
      assert.equal(writes.length,4);
      assert.ok(writes.every(key=>key.includes('blog-images/'+signed.storage_path)));
      assert.equal((await send()).status,409);
      assert.equal(writes.length,4);
      const now = Date.now();
      const timeMock = mock.method(Date,'now',()=>now+7201000);
      try { assert.equal((await send()).status,403); } finally { timeMock.mock.restore(); }
      assert.equal(claims,2);
    });
  } finally { fetchMock.mock.restore(); }
});

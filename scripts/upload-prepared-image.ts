import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { resolve, join } from 'node:path';
import { pathToFileURL } from 'node:url';
import sharp from 'sharp';
import { z } from 'zod';
import { IMAGE_WIDTHS, readPreparedImages } from '../src/mcp/prepared-images';
import { MAX_BYTES, validateRaster } from '../src/mcp/images';
import { storagePath } from '../src/mcp/schemas';

const uploadResult = z.object({storage_path:storagePath,public_url:z.url(),bytes:z.number().int().positive()});
const signedReceipt = z.object({storage_path:storagePath,public_url:z.url(),signed_upload_url:z.url()});

export async function prepareImageFamily(input: Uint8Array) {
  validateRaster(input);
  const original = await sharp(input, {limitInputPixels:40000000}).rotate().resize({width:1600,height:1600,fit:'inside',withoutEnlargement:true}).webp({quality:85}).toBuffer();
  const form = new FormData();
  form.set('original',new Blob([new Uint8Array(original)],{type:'image/webp'}),'original.webp');
  for (const width of IMAGE_WIDTHS) {
    const bytes = width === 1600 ? original : await sharp(original).resize({width,withoutEnlargement:true}).webp({quality:85}).toBuffer();
    await sharp(bytes).stats(); // Decode the complete encoded image, not just its header.
    form.set(String(width),new Blob([new Uint8Array(bytes)],{type:'image/webp'}),`${width}.webp`);
  }
  await readPreparedImages(form);
  const bodySize = (await new Response(form).arrayBuffer()).byteLength;
  if (bodySize > MAX_BYTES) throw Error('Prepared image family exceeds the 10 MiB upload limit.');
  return form;
}

async function main() {
  const [input, receiptFile, directory] = process.argv.slice(2);
  if (!input || !receiptFile || !directory || process.argv.length !== 5) throw Error('Usage: node --import tsx scripts/upload-prepared-image.ts SOURCE RECEIPT_JSON OUTPUT_DIRECTORY');
  const receipt = JSON.parse(await readFile(receiptFile,'utf8'));
  const parsed = signedReceipt.safeParse(receipt.structuredContent?.results?.[0]?.data ?? receipt);
  if (!parsed.success) throw Error('Receipt JSON does not contain a successful signed upload result.');
  const data = parsed.data;
  const url = new URL(data.signed_upload_url);
  if (url.origin !== 'https://zuluniner.com' || url.pathname !== '/api/images/upload' || !url.searchParams.has('token')) throw Error('Receipt must contain a ZuluNiner signed upload URL.');
  const form = await prepareImageFamily(await readFile(input));
  await mkdir(directory,{recursive:true});
  for (const [name,value] of form) if (typeof value !== 'string') await writeFile(join(directory,`${name}.webp`),new Uint8Array(await value.arrayBuffer()));
  let result: z.infer<typeof uploadResult> | undefined;
  try { result = uploadResult.parse(JSON.parse(await readFile(join(directory,'upload-result.json'),'utf8'))); } catch { /* First upload. */ }
  if (!result || result.storage_path !== data.storage_path) {
    let response;
    try { response = await fetch(url,{method:'PUT',body:form,redirect:'error',signal:AbortSignal.timeout(60000)}); }
    catch { throw Error('Prepared upload request failed; signed URL was not logged.'); }
    if (!response.ok) throw Error(`Prepared upload returned HTTP ${response.status}. Obtain a fresh receipt if its token expired or was already used.`);
    const saved = uploadResult.safeParse(await response.json());
    if (!saved.success) throw Error('Upload returned an invalid result.');
    result = saved.data;
    if (result.storage_path !== data.storage_path || result.public_url !== data.public_url) throw Error('Upload response does not match the signed receipt.');
    await writeFile(join(directory,'upload-result.json'),JSON.stringify(result,null,2)+'\n');
  }
  if (result.public_url !== data.public_url) throw Error('Cached upload result does not match the signed receipt.');
  const verified = [];
  for (const name of ['original',...IMAGE_WIDTHS.map(String)]) {
    const response = await fetch(result.public_url+(name==='original'?'':`?w=${name}`),{signal:AbortSignal.timeout(30000)});
    if (!response.ok || response.headers.get('content-type') !== 'image/webp') throw Error(`Uploaded ${name} image verification failed (HTTP ${response.status}).`);
    const bytes = Buffer.from(await response.arrayBuffer());
    if (!bytes.equals(await readFile(join(directory,`${name}.webp`)))) throw Error(`Uploaded ${name} bytes do not match the prepared image.`);
    const meta = await sharp(bytes).metadata();
    await sharp(bytes).stats();
    verified.push({size:name,width:meta.width,height:meta.height,bytes:bytes.length});
  }
  const report = {...result,verified_at:new Date().toISOString(),variants:verified};
  await writeFile(join(directory,'verified-upload.json'),JSON.stringify(report,null,2)+'\n');
  console.log(JSON.stringify(report)); // Contains public paths only, never the credential.
}

if (import.meta.url === pathToFileURL(resolve(process.argv[1] || '')).href) {
  main().catch(error => { console.error(error instanceof Error ? error.message : 'Prepared upload failed.'); process.exitCode=1; });
}

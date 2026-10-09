import { createHmac, timingSafeEqual, randomUUID } from 'node:crypto';
import ipaddr from 'ipaddr.js';
import { imageSize } from 'image-size';
import type { z } from 'zod';
import { imageInput, storagePath } from './schemas';
import { environment, query } from '@/worker/context';
import { siteOrigin } from './auth';
export const MAX_BYTES = 10 * 1024 * 1024;
export const imageBucket = (kind: 'post'|'aircraft') => kind === 'post' ? 'blog-images' : 'aircraft-photos';
export function publicImageAddress(address: string) { try { return ipaddr.process(address).range() === 'unicast'; } catch { return false; } }
export async function readBounded(body: ReadableStream<Uint8Array> | null, max: number) {
  if (!body) throw new Error('Empty request body.');
  const reader = body.getReader(); const chunks: Uint8Array[] = []; let size = 0;
  while (true) { const next = await reader.read(); if (next.done) break; size += next.value.length; if (size > max) { await reader.cancel(); throw new Error('Request exceeds size limit.'); } chunks.push(next.value); }
  return Buffer.concat(chunks);
}
export async function fetchImage(urlText: string, redirects = 0): Promise<Buffer> {
  const url = new URL(urlText); const host = url.hostname.replace(/^\[|\]$/g,'');
  if (url.protocol !== 'https:' || (url.port && url.port !== '443') || url.username || url.password || redirects > 3 || (ipaddr.isValid(host) && !publicImageAddress(host))) throw new Error('Use a public HTTPS image URL.');
  // Imports are restricted to explicitly trusted origins. Arbitrary local files use signed uploads.
  const allowed = (environment().IMAGE_IMPORT_HOSTS || 'zuluniner.com,images.unsplash.com,upload.wikimedia.org').split(',').map(x=>x.trim());
  if (!allowed.includes(host)) throw new Error('Image source host is not configured for import. Download it locally and use begin_image_upload instead.');
  // Cloudflare route fetches to our own hostname bypass this Worker. Read owned R2
  // objects directly so an agent can reuse an uploaded public_url reliably.
  if(url.origin===siteOrigin() && url.pathname.startsWith('/images/')) {
    const key=decodeURIComponent(url.pathname.slice('/images/'.length));
    if(!/^(aircraft-photos|blog-images)\//.test(key) || key.split('/').includes('..'))throw new Error('Invalid managed image path.');
    const file=await environment().MEDIA.get(key);
    if(!file || file.size>MAX_BYTES)throw new Error('Managed image not found or exceeds size limit.');
    return Buffer.from(await file.arrayBuffer());
  }
  const response = await fetch(url, {redirect:'manual', signal:AbortSignal.timeout(20000)});
  if (response.status >= 300 && response.status < 400 && response.headers.get('location')) return fetchImage(new URL(response.headers.get('location')!,url).href,redirects+1);
  if (!response.ok) throw new Error(`Image download returned HTTP ${response.status}.`);
  return readBounded(response.body, MAX_BYTES);
}
export function validateRaster(original: Uint8Array) {
  if (!original.length || original.length > MAX_BYTES) throw new Error('Supply an image no larger than 10 MiB.');
  const info = imageSize(original);
  if (!['jpg','png','webp'].includes(info.type || '') || !info.width || !info.height || info.width * info.height > 40000000) throw new Error('Supply a JPEG, PNG or WebP image with at most 40 million pixels.');
  return info;
}
export async function storeImage(bucket: string, path: string, original: Uint8Array) {
  validateRaster(original); const env = environment();
  const optimized = await env.IMAGES.input(new Blob([new Uint8Array(original)]).stream()).transform({width:1600,height:1600,fit:'scale-down'}).output({format:'image/webp',quality:85});
  const bytes = await optimized.response().arrayBuffer();
  await env.MEDIA.put(`${bucket}/${path}`, bytes, {httpMetadata:{contentType:'image/webp',cacheControl:'public, max-age=31536000, immutable'}});
  for (const width of [480,960,1600]) {
    const variant = await env.IMAGES.input(new Blob([bytes]).stream()).transform({width,fit:'scale-down'}).output({format:'image/webp',quality:85});
    await env.MEDIA.put(`variants/${width}/${bucket}/${path}`, variant.response().body, {httpMetadata:{contentType:'image/webp',cacheControl:'public, max-age=31536000, immutable'}});
  }
  return {storage_path:path,public_url:`${siteOrigin()}/images/${bucket}/${path}`,bytes:bytes.byteLength};
}
export async function uploadImage(input: z.infer<typeof imageInput>) {
  if (input.base64 && !/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(input.base64)) throw new Error('Invalid base64 image.');
  const original = input.source_url ? await fetchImage(input.source_url) : Buffer.from(input.base64!, 'base64');
  const name = input.filename.replace(/\.[^.]+$/,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'') || 'image';
  return storeImage(imageBucket(input.kind),`mcp/${randomUUID()}-${name}.webp`,original);
}
export async function requireImage(kind:'post'|'aircraft', path:string) {
  storagePath.parse(path); const file = await environment().MEDIA.get(`${imageBucket(kind)}/${path}`);
  if (!file) throw new Error('Image not found in the correct bucket. Upload it before attaching it.');
  validateRaster(new Uint8Array(await file.arrayBuffer()));
}
const sign = (value:string) => createHmac('sha256',environment().UPLOAD_SIGNING_SECRET).update(value).digest('base64url');
export async function beginImageUpload(kind:'post'|'aircraft', filename:string) {
  if (!/\.(jpe?g|png|webp)$/i.test(filename)) throw new Error('Use a .jpg, .jpeg, .png or .webp filename.');
  const path = `mcp/${randomUUID()}-${filename.replace(/\.[^.]+$/,'').toLowerCase().replace(/[^a-z0-9-]/g,'-')}.webp`;
  const payload=Buffer.from(JSON.stringify({kind,path,exp:Math.floor(Date.now()/1000)+7200})).toString('base64url');
  return {storage_path:path,signed_upload_url:`${siteOrigin()}/api/images/upload?token=${payload}.${sign(payload)}`,public_url:`${siteOrigin()}/images/${imageBucket(kind)}/${path}`,expires_in_seconds:7200,instructions:'PUT the binary JPEG/PNG/WebP to signed_upload_url, then attach storage_path. The server validates and optimizes it. Never publish the signed URL.'};
}
export async function acceptSignedUpload(request:Request) {
  const token = new URL(request.url).searchParams.get('token') || ''; const [payload,signature] = token.split('.');
  if (!payload || !signature || signature.length !== 43 || !timingSafeEqual(Buffer.from(sign(payload)),Buffer.from(signature))) return new Response('Invalid upload signature.',{status:403});
  const parsed: {kind:'post'|'aircraft';path:string;exp:number} = JSON.parse(Buffer.from(payload,'base64url').toString());
  if (!['post','aircraft'].includes(parsed.kind) || parsed.exp <= Date.now()/1000 || !storagePath.safeParse(parsed.path).success) return new Response('Expired upload.',{status:403});
  const original=await readBounded(request.body,MAX_BYTES);validateRaster(original);
  const key=`upload/${parsed.path}`;
  const claim=await query('INSERT INTO mcp_auth_records(key,value) VALUES($1,$2::jsonb) ON CONFLICT DO NOTHING RETURNING key',[key,JSON.stringify({at:Math.floor(Date.now()/1000)})]);
  if (!claim.length) return new Response('Upload URL already used.',{status:409});
  try {return Response.json(await storeImage(imageBucket(parsed.kind),parsed.path,original));}
  catch(error){await query('DELETE FROM mcp_auth_records WHERE key=$1',[key]);throw error;}
}

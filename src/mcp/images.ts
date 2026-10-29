import { createHmac, timingSafeEqual, randomUUID } from 'node:crypto';
import ipaddr from 'ipaddr.js';
import { imageSize } from 'image-size';
import type { z } from 'zod';
import { imageInput, storagePath } from './schemas';
import { environment, query } from '@/worker/context';
import { siteOrigin } from './auth';
import { IMAGE_WIDTHS, readPreparedImages, type ImageFamily } from './prepared-images';
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
export async function storeImageFamily(bucket: string, path: string, family: ImageFamily) {
  const media = environment().MEDIA;
  const mainWidth = imageSize(family.original).width!;
  const objects = [...family.variants].filter(([width]) => width < mainWidth && width < 1600).map(([width, bytes]) => ({key:`variants/${width}/${bucket}/${path}`,bytes}));
  // Publish the original last: a returned path always has every responsive size.
  objects.push({key:`${bucket}/${path}`,bytes:family.original});
  try {
    for (const {key,bytes} of objects) await media.put(key, bytes, {httpMetadata:{contentType:'image/webp',cacheControl:'public, max-age=31536000, immutable'}});
  } catch (error) {
    // All paths are newly generated for this upload; never touch existing media.
    await media.delete(objects.map(object => object.key));
    throw error;
  }
  return {storage_path:path,public_url:`${siteOrigin()}/images/${bucket}/${path}`,bytes:family.original.byteLength};
}
export async function storeImage(bucket: string, path: string, original: Uint8Array) {
  validateRaster(original); const env = environment();
  try {
    const optimized = await env.IMAGES.input(new Blob([new Uint8Array(original)]).stream()).transform({width:1600,height:1600,fit:'scale-down'}).output({format:'image/webp',quality:85});
    const bytes = await optimized.response().arrayBuffer();
    const variants = new Map<number, Uint8Array>();
    const mainWidth = imageSize(new Uint8Array(bytes)).width!;
    for (const width of IMAGE_WIDTHS.filter(width => width < mainWidth)) {
      const variant = await env.IMAGES.input(new Blob([bytes]).stream()).transform({width,fit:'scale-down'}).output({format:'image/webp',quality:85});
      variants.set(width, new Uint8Array(await variant.response().arrayBuffer()));
    }
    return await storeImageFamily(bucket,path,{original:new Uint8Array(bytes),variants});
  } catch (error) {
    if (error instanceof Error && /\b9422\b/.test(error.message)) throw Error('Cloudflare Images quota exhausted (9422). Use begin_image_upload and scripts/upload-prepared-image.ts to upload a locally optimized WebP family. Do not retry the same transformation or wait for another daily run.');
    throw error;
  }
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
  return {storage_path:path,signed_upload_url:`${siteOrigin()}/api/images/upload?token=${payload}.${sign(payload)}`,public_url:`${siteOrigin()}/images/${imageBucket(kind)}/${path}`,expires_in_seconds:7200,instructions:'PUT a binary JPEG/PNG/WebP for Cloudflare optimization, or multipart/form-data with locally optimized WebP files named original plus 480 and 960 only when smaller than the original to bypass transformation quotas. Use scripts/upload-prepared-image.ts with the saved receipt JSON and local source file. Prepared original: at most 1600x1600; variants preserve aspect ratio without enlargement; ?w=1600 serves original. Total body <=10 MiB. Attach storage_path only after success. Never publish or log the signed URL.'};
}
export async function acceptSignedUpload(request:Request) {
  const token = new URL(request.url).searchParams.get('token') || ''; const [payload,signature] = token.split('.');
  if (!payload || !signature || signature.length !== 43 || !timingSafeEqual(Buffer.from(sign(payload)),Buffer.from(signature))) return new Response('Invalid upload signature.',{status:403});
  const parsed: {kind:'post'|'aircraft';path:string;exp:number} = JSON.parse(Buffer.from(payload,'base64url').toString());
  if (!['post','aircraft'].includes(parsed.kind) || parsed.exp <= Date.now()/1000 || !storagePath.safeParse(parsed.path).success) return new Response('Expired upload.',{status:403});
  const body=await readBounded(request.body,MAX_BYTES);
  const multipart=request.headers.get('content-type')?.toLowerCase().startsWith('multipart/form-data');
  const family=multipart ? await readPreparedImages(await new Response(new Uint8Array(body),{headers:{'Content-Type':request.headers.get('content-type')!}}).formData()) : null;
  if (!family) validateRaster(body);
  const key=`upload/${parsed.path}`;
  const claim=await query('INSERT INTO mcp_auth_records(key,value) VALUES($1,$2::jsonb) ON CONFLICT DO NOTHING RETURNING key',[key,JSON.stringify({at:Math.floor(Date.now()/1000)})]);
  if (!claim.length) return new Response('Upload URL already used.',{status:409});
  try {return Response.json(family ? await storeImageFamily(imageBucket(parsed.kind),parsed.path,family) : await storeImage(imageBucket(parsed.kind),parsed.path,body));}
  catch(error){await query('DELETE FROM mcp_auth_records WHERE key=$1',[key]);throw error;}
}

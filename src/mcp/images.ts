import { lookup } from 'node:dns/promises';
import { request } from 'node:https';
import { randomUUID } from 'node:crypto';
import ipaddr from 'ipaddr.js';
import sharp from 'sharp';
import type { z } from 'zod';
import { imageInput } from './schemas';
import { contentClient } from './client';

const MAX_BYTES = 10 * 1024 * 1024;
export const imageBucket = (kind: 'post' | 'aircraft') => kind === 'post' ? 'blog-images' : 'aircraft-photos';

export function publicImageAddress(address: string) {
  try { return ipaddr.process(address).range() === 'unicast'; }
  catch { return false; }
}

export async function fetchImage(urlText: string, redirects = 0): Promise<Buffer> {
  const url = new URL(urlText);
  if (url.protocol !== 'https:' || (url.port && url.port !== '443') || url.username || url.password) {
    throw new Error('Images must use an HTTPS URL on port 443 without embedded credentials.');
  }
  if (redirects > 3) throw new Error('Too many image redirects.');
  const hostname = url.hostname.replace(/^\[|\]$/g, '');
  const addresses = await lookup(hostname, { all: true });
  if (!addresses.length || addresses.some(address => !publicImageAddress(address.address))) {
    throw new Error('Private or reserved network image addresses are not allowed.');
  }
  // Pin the checked DNS result for this request, preventing DNS rebinding.
  const address = addresses[0];
  const response = await new Promise<{ body: Buffer; redirect?: string }>((resolve, reject) => {
    const req = request(url, {
      agent: false,
      family: address.family,
      lookup: (_hostname, _options, callback) => callback(null, address.address, address.family),
      headers: { Accept: 'image/jpeg,image/png,image/webp', 'User-Agent': 'ZuluNiner-Content/1.0' },
    }, res => {
      if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        res.resume(); resolve({ body: Buffer.alloc(0), redirect: res.headers.location }); return;
      }
      if (res.statusCode !== 200) { res.resume(); reject(new Error(`Image download returned HTTP ${res.statusCode}.`)); return; }
      if (Number(res.headers['content-length'] || 0) > MAX_BYTES) { req.destroy(new Error('Image exceeds 10 MiB.')); return; }
      let size = 0;
      const chunks: Buffer[] = [];
      res.on('data', (chunk: Buffer) => {
        size += chunk.length;
        if (size > MAX_BYTES) { req.destroy(new Error('Image exceeds 10 MiB.')); return; }
        chunks.push(chunk);
      });
      res.on('end', () => resolve({ body: Buffer.concat(chunks) }));
      res.on('error', reject);
    });
    const timeout = setTimeout(() => req.destroy(new Error('Image download timed out.')), 20000);
    req.on('close', () => clearTimeout(timeout));
    req.on('error', reject);
    req.end();
  });
  return response.redirect ? fetchImage(new URL(response.redirect, url).href, redirects + 1) : response.body;
}

export async function uploadImage(input: z.infer<typeof imageInput>) {
  if (input.base64 && !/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(input.base64)) {
    throw new Error('Invalid base64 image.');
  }
  const original = input.source_url ? await fetchImage(input.source_url) : Buffer.from(input.base64!, 'base64');
  if (!original.length || original.length > MAX_BYTES) throw new Error('Empty image or image exceeds 10 MiB.');
  const image = sharp(original, { limitInputPixels: 40000000 });
  const metadata = await image.metadata();
  if (!metadata.format || !['jpeg', 'png', 'webp'].includes(metadata.format)) throw new Error('Supply a JPEG, PNG, or WebP image.');
  const buffer = await image.rotate().resize({ width: 1600, height: 1600, fit: 'inside', withoutEnlargement: true }).webp({ quality: 85 }).toBuffer();
  const name = input.filename.replace(/\.[^.]+$/, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'image';
  const storage_path = `mcp/${randomUUID()}-${name}.webp`;
  const storage = contentClient().storage.from(imageBucket(input.kind));
  const { error } = await storage.upload(storage_path, buffer, { contentType: 'image/webp', upsert: false });
  if (error) throw new Error(error.message);
  return { storage_path, public_url: storage.getPublicUrl(storage_path).data.publicUrl, bytes: buffer.length };
}

export async function requireImage(kind: 'post' | 'aircraft', path: string) {
  const storage = contentClient().storage.from(imageBucket(kind));
  const { data, error } = await storage.info(path);
  if (error || !data) throw new Error('Image not found in the correct storage bucket. Upload it before attaching it.');
  const info = zFileInfo(data);
  if (!info.size || info.size > MAX_BYTES || !['image/jpeg', 'image/png', 'image/webp'].includes(info.contentType)) throw new Error('Attach a JPEG, PNG or WebP image no larger than 10 MiB.');
  const file = await storage.download(path);
  if (file.error) throw new Error('Could not validate the uploaded image.');
  const metadata = await sharp(Buffer.from(await file.data.arrayBuffer()), { limitInputPixels: 40000000 }).metadata();
  if (!metadata.format || !['jpeg', 'png', 'webp'].includes(metadata.format)) throw new Error('Uploaded file is not a supported raster image.');
}

function zFileInfo(data: { size?: number; contentType?: string; metadata?: object }) {
  const metadata = data.metadata as { size?: number; mimetype?: string } | undefined;
  return { size: data.size ?? metadata?.size, contentType: data.contentType ?? metadata?.mimetype ?? '' };
}

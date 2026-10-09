import type { z } from 'zod';
import type { Tables, TablesUpdate } from '@/api/schema';
import { contentClient } from './client';
import { aircraftFields, aircraftPatch, postFields, postPatch, photoInput } from './schemas';
import { requireImage, imageBucket } from './images';
import { randomUUID } from 'node:crypto';

export async function listContent(input: { kind: 'post' | 'aircraft'; query?: string; offset: number; limit: number }) {
  const table = input.kind === 'post' ? 'blog_posts' : 'aircraft';
  let query = contentClient().from(table).select('*', { count: 'exact' }).order('created_at', { ascending: false });
  if (input.query) query = query.ilike('title', `%${input.query}%`);
  const { data, error, count } = await query.range(input.offset, input.offset + input.limit - 1);
  if (error) throw new Error(error.message);
  return { items: data || [], total: count || 0, offset: input.offset, limit: input.limit };
}

export async function getContent(kind: 'post' | 'aircraft', identifier: string) {
  const table = kind === 'post' ? 'blog_posts' : 'aircraft';
  const column = /^[0-9a-f]{8}-[0-9a-f-]{27}$/i.test(identifier) ? 'id' : 'slug';
  const { data, error } = await contentClient().from(table).select('*').eq(column, identifier).single();
  if (error) throw new Error('Content not found.');
  if (kind === 'post') return data;
  const photos = await contentClient().from('aircraft_photos').select('*').eq('aircraft_id', data.id).order('display_order');
  if (photos.error) throw new Error(photos.error.message);
  return { ...data, photos: photos.data || [] };
}

export async function createPost(input: z.infer<typeof postFields>, ownerId: string) {
  if (input.header_photo) await requireImage('post', input.header_photo);
  const { data, error } = await contentClient().from('blog_posts').insert({
    ...input, published: input.published ?? false, author_id: ownerId,
    published_at: input.published ? new Date().toISOString() : null,
  }).select('*').single();
  if (error) throw new Error(error.message);
  return data;
}

export async function createAircraft(input: z.infer<typeof aircraftFields>, ownerId: string) {
  const { data, error } = await contentClient().from('aircraft').insert({
    ...input, status: input.status ?? 'draft', user_id: input.user_id ?? ownerId,
  }).select('*').single();
  if (error) throw new Error(error.message);
  return data;
}

export async function updatePost(id: string, changes: z.infer<typeof postPatch>, expected?: string) {
  if (changes.header_photo) await requireImage('post', changes.header_photo);
  const client = contentClient();
  const existing = await client.from('blog_posts').select('published,published_at').eq('id', id).single();
  if (existing.error) throw new Error('Post not found.');
  const patch: TablesUpdate<'blog_posts'> = { ...changes };
  if (changes.published && !existing.data.published) patch.published_at = new Date().toISOString();
  let query = client.from('blog_posts').update(patch).eq('id', id);
  if (expected) query = query.eq('updated_at', expected);
  const { data, error } = await query.select('*').single();
  if (error) throw new Error(expected ? 'Post changed since it was read; read it again before editing.' : error.message);
  return data;
}

export async function updateAircraft(id: string, changes: z.infer<typeof aircraftPatch>, expected?: string) {
  let query = contentClient().from('aircraft').update(changes).eq('id', id);
  if (expected) query = query.eq('updated_at', expected);
  const { data, error } = await query.select('*').single();
  if (error) throw new Error(expected ? 'Aircraft changed since it was read; read it again before editing.' : error.message);
  return data;
}

export async function deleteContent(kind: 'post' | 'aircraft', id: string, expected?: string) {
  const table = kind === 'post' ? 'blog_posts' : 'aircraft';
  let query = contentClient().from(table).delete().eq('id', id);
  if (expected) query = query.eq('updated_at', expected);
  const { data, error } = await query.select('*').single();
  if (error) throw new Error(expected ? 'Content changed or was removed; read it again before deleting.' : 'Content not found or could not be deleted.');
  // Keep assets available for reuse; deleting a shared image would break other content.
  return { deleted: data, images_retained: true };
}

export async function setAircraftImages(id: string, photos: Array<z.infer<typeof photoInput>>, primaryIndex: number, expected?: string) {
  if (primaryIndex >= photos.length && photos.length) throw new Error('primary_index is outside the gallery.');
  if (new Set(photos.map(photo => photo.storage_path)).size !== photos.length) throw new Error('Each image can appear only once in a gallery.');
  for (const photo of photos) await requireImage('aircraft', photo.storage_path);
  const client = contentClient();
  const existing = await client.from('aircraft_photos').select('*').eq('aircraft_id', id);
  if (existing.error) throw new Error(existing.error.message);
  // Check/touch the parent's revision before making gallery changes.
  let touch = client.from('aircraft').update({ updated_at: new Date().toISOString() }).eq('id', id);
  if (expected) touch = touch.eq('updated_at', expected);
  const touched = await touch.select('updated_at').single();
  if (touched.error) throw new Error('Aircraft changed or was removed; read it again before changing images.');
  const rows = photos.map((photo, index) => ({ ...photo, id: randomUUID(), aircraft_id: id, display_order: index, is_primary: index === primaryIndex }));
  let inserted: Tables<'aircraft_photos'>[] = [];
  if (rows.length) {
    const result = await client.from('aircraft_photos').insert(rows).select('*');
    if (result.error) throw new Error(result.error.message);
    inserted = result.data;
  }
  if (existing.data.length) {
    const result = await client.from('aircraft_photos').delete().in('id', existing.data.map(photo => photo.id));
    if (result.error) {
      if (inserted.length) await client.from('aircraft_photos').delete().in('id', inserted.map(photo => photo.id));
      throw new Error('Could not replace the gallery. Read the aircraft to verify its current images.');
    }
  }
  return { aircraft_id: id, updated_at: touched.data.updated_at, photos: inserted, old_images_retained: true };
}

export async function beginImageUpload(kind: 'post' | 'aircraft', filename: string) {
  const name = filename.toLowerCase().replace(/[^a-z0-9_.-]/g, '-');
  if (!/\.(jpe?g|png|webp)$/.test(name)) throw new Error('Use a .jpg, .jpeg, .png, or .webp filename.');
  const path = `mcp/${randomUUID()}-${name}`;
  const storage = contentClient().storage.from(imageBucket(kind));
  const { data, error } = await storage.createSignedUploadUrl(path, { upsert: false });
  if (error) throw new Error(error.message);
  return { storage_path: path, signed_upload_url: data.signedUrl, token: data.token, public_url: storage.getPublicUrl(path).data.publicUrl, expires_in_seconds: 7200, instructions: 'Upload the binary image using Supabase uploadToSignedUrl or PUT to signed_upload_url; then attach storage_path through update_posts or set_aircraft_images. Never include the signed URL in public content.' };
}

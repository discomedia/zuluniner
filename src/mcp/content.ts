import type { z } from 'zod';
import type { Tables } from '@/api/schema';
import { query } from '@/worker/context';
import { aircraftFields, aircraftPatch, postFields, postPatch, photoInput } from './schemas';
import { requireImage, beginImageUpload } from './images';
export { beginImageUpload };

type Kind = 'post' | 'aircraft';
const tableFor = (kind: Kind) => kind === 'post' ? 'blog_posts' : 'aircraft';
const mutable = new Set([...Object.keys(postFields.shape), ...Object.keys(aircraftFields.shape), 'author_id', 'published_at', 'updated_at']);
function columns(input: object) {
  const entries = Object.entries(input).filter(([, v]) => v !== undefined);
  if (!entries.length || entries.some(([key]) => !mutable.has(key))) throw new Error('Invalid content fields.');
  return entries;
}
async function insert<T>(table: string, input: object) {
  const entries = columns(input);
  const [row] = await query<T>(`INSERT INTO ${table} (${entries.map(([k]) => k).join(',')}) VALUES (${entries.map((_, i) => `$${i + 1}`).join(',')}) RETURNING *`, entries.map(([, v]) => v));
  return row;
}
async function patch<T>(table: string, id: string, input: object, expected?: string) {
  const entries = columns(input); const values = entries.map(([, v]) => v);
  values.push(id); if (expected) values.push(expected);
  const [row] = await query<T>(`UPDATE ${table} SET ${entries.map(([k], i) => `${k}=$${i + 1}`).join(',')} WHERE id=$${entries.length + 1}${expected ? ` AND updated_at=$${entries.length + 2}::timestamptz` : ''} RETURNING *`, values);
  if (!row) throw new Error('Content changed or was removed; read it again before editing.');
  return row;
}
export async function listContent(input: { kind: Kind; query?: string; offset: number; limit: number }) {
  const table = tableFor(input.kind); const pattern = input.query ? `%${input.query}%` : '%';
  const items = await query<Tables<'aircraft'> | Tables<'blog_posts'>>(`SELECT * FROM ${table} WHERE title ILIKE $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3`, [pattern, input.limit, input.offset]);
  const [count] = await query<{total: number}>(`SELECT count(*)::int AS total FROM ${table} WHERE title ILIKE $1`, [pattern]);
  return { items, total: count.total, offset: input.offset, limit: input.limit };
}
export async function getContent(kind: Kind, identifier: string) {
  const column = /^[0-9a-f]{8}-[0-9a-f-]{27}$/i.test(identifier) ? 'id' : 'slug';
  const [data] = await query<Tables<'aircraft'> | Tables<'blog_posts'>>(`SELECT * FROM ${tableFor(kind)} WHERE ${column}=$1`, [identifier]);
  if (!data) throw new Error('Content not found.');
  if (kind === 'post') return data;
  return { ...data, photos: await query<Tables<'aircraft_photos'>>('SELECT * FROM aircraft_photos WHERE aircraft_id=$1 ORDER BY display_order', [data.id]) };
}
export async function createPost(input: z.infer<typeof postFields>, ownerId: string) {
  if (input.header_photo) await requireImage('post', input.header_photo);
  return insert<Tables<'blog_posts'>>('blog_posts', { ...input, published: input.published ?? false, author_id: ownerId, published_at: input.published ? new Date().toISOString() : null });
}
export async function createAircraft(input: z.infer<typeof aircraftFields>, ownerId: string) {
  return insert<Tables<'aircraft'>>('aircraft', { ...input, status: input.status ?? 'draft', user_id: input.user_id ?? ownerId });
}
export async function updatePost(id: string, changes: z.infer<typeof postPatch>, expected?: string) {
  if (changes.header_photo) await requireImage('post', changes.header_photo);
  // Publication time and optimistic revision are evaluated in the same UPDATE.
  const entries = columns(changes); const values = entries.map(([, v]) => v); values.push(id); if (expected) values.push(expected);
  const [row] = await query<Tables<'blog_posts'>>(`UPDATE blog_posts SET ${entries.map(([k], i) => `${k}=$${i + 1}`).join(',')}${changes.published ? ',published_at=CASE WHEN published THEN published_at ELSE now() END' : ''} WHERE id=$${entries.length + 1}${expected ? ` AND updated_at=$${entries.length + 2}::timestamptz` : ''} RETURNING *`, values);
  if (!row) throw new Error('Post changed or was removed; read it again before editing.'); return row;
}
export async function updateAircraft(id: string, changes: z.infer<typeof aircraftPatch>, expected?: string) { return patch<Tables<'aircraft'>>('aircraft', id, changes, expected); }
export async function deleteContent(kind: Kind, id: string, expected?: string) {
  const [deleted] = await query<Tables<'aircraft'> | Tables<'blog_posts'>>(`DELETE FROM ${tableFor(kind)} WHERE id=$1${expected ? ' AND updated_at=$2::timestamptz' : ''} RETURNING *`, expected ? [id, expected] : [id]);
  if (!deleted) throw new Error('Content changed or was removed; read it again before deleting.');
  return { deleted, images_retained: true };
}
export async function listSellers() { return { sellers: await query<Pick<Tables<'users'>, 'id'|'name'|'company'|'email'|'phone'>>('SELECT id,name,company,email,phone FROM users ORDER BY name') }; }
export async function setAircraftImages(id: string, photos: Array<z.infer<typeof photoInput>>, primaryIndex: number, expected?: string) {
  if (photos.length && primaryIndex >= photos.length) throw new Error('primary_index is outside the gallery.');
  if (new Set(photos.map(p => p.storage_path)).size !== photos.length) throw new Error('Each image can appear only once in a gallery.');
  for (const photo of photos) await requireImage('aircraft', photo.storage_path);
  // A database function locks/checks the parent and replaces the gallery atomically.
  const [result] = await query<{result: {aircraft_id:string;updated_at:string;photos:Tables<'aircraft_photos'>[];old_images_retained:boolean}}>('SELECT replace_aircraft_gallery($1,$2::jsonb,$3,$4::timestamptz) AS result', [id, JSON.stringify(photos), primaryIndex, expected ?? null]);
  return result.result;
}

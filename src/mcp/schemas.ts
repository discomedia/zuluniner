import { z } from 'zod';

export const id = z.uuid();
const text = (max = 1000) => z.string().trim().max(max);
const optionalText = (max = 1000) => text(max).nullable().optional();
export const slug = z.string().trim().min(1).max(200).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Use a lowercase, hyphen-separated slug.');
export const storagePath = z.string().min(1).max(500).regex(/^[a-zA-Z0-9][a-zA-Z0-9/_.-]*$/).refine(path => !path.split('/').includes('..'), 'Invalid image storage path.');
export const kind = z.enum(['post', 'aircraft']);
export const revision = z.iso.datetime({ offset: true }).optional().describe('Optional updated_at from a previous read; reject stale edits.');

export const postFields = z.object({
  title: text(200).min(1),
  slug,
  blurb: optionalText(2000),
  content: optionalText(200000).describe('Finished Markdown content supplied by the agent.'),
  meta_description: optionalText(300),
  header_photo: storagePath.nullable().optional().describe('Path from upload_images in the post bucket; null removes the header.'),
  published: z.boolean().optional().describe('Defaults to false on creation. Set true to publish.'),
}).strict();

export const aircraftFields = z.object({
  title: text(200).min(1),
  slug,
  description: optionalText(100000),
  price: z.number().int().min(0).max(2147483647).describe('USD whole dollars, matching the existing site display.'),
  year: z.number().int().min(1900).max(2100),
  make: text(100).min(1),
  model: text(150).min(1),
  hours: z.number().int().min(0).max(2147483647).nullable().optional(),
  engine_type: optionalText(300),
  avionics: optionalText(10000),
  airport_code: optionalText(20),
  city: optionalText(200),
  country: optionalText(100),
  latitude: z.number().min(-90).max(90).nullable().optional(),
  longitude: z.number().min(-180).max(180).nullable().optional(),
  status: z.enum(['active', 'sold', 'pending', 'draft']).optional().describe('Defaults to draft. Set active to publish.'),
  meta_description: optionalText(300),
  user_id: id.optional().describe('Existing seller profile ID. Defaults to the authenticated owner.'),
}).strict();

export const postPatch = postFields.partial().refine(value => Object.keys(value).length > 0, 'Provide at least one change.');
export const aircraftPatch = aircraftFields.partial().refine(value => Object.keys(value).length > 0, 'Provide at least one change.');
export const imageInput = z.object({
  kind,
  filename: text(100).min(1),
  source_url: z.url().optional().describe('Public HTTPS download URL; private network URLs are rejected.'),
  base64: z.string().max(2100000).optional().describe('Raw base64 for an image up to 1.5 MiB. Larger images should use source_url or begin_image_upload.'),
}).strict().refine(value => Boolean(value.source_url) !== Boolean(value.base64), 'Provide exactly one of source_url or base64.');

export const photoInput = z.object({
  storage_path: storagePath,
  alt_text: text(1000).min(1),
  caption: optionalText(2000),
}).strict();

export function batch<T extends z.ZodType>(schema: T) {
  return z.object({ items: z.array(schema).min(1).max(20) }).strict();
}

// Every tool returns the same inspectable envelope. A batch is sequential and
// non-atomic; individual errors never conceal already completed operations.
const json = z.json();
export const output = z.object({
  atomic: z.literal(false),
  succeeded: z.number().int(),
  failed: z.number().int(),
  results: z.array(z.object({
    index: z.number().int(),
    ok: z.boolean(),
    data: json.optional(),
    error: z.string().optional(),
  })),
});

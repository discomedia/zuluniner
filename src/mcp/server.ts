import { createMcpHandler, withMcpAuth } from 'mcp-handler';
import type { McpServer } from '@modelcontextprotocol/server';
import { z } from 'zod';
import * as schema from './schemas';
import * as content from './content';
import { uploadImage } from './images';
import { contentClient } from './client';
import { siteOrigin, verifyOwner } from './auth';
import { invalidatePublicContent } from '@/api/content-cache';

export async function runBatch<T>(items: T[], action: (item: T) => Promise<z.infer<typeof z.json>>) {
  const results: Array<{ index: number; ok: boolean; data?: z.infer<typeof z.json>; error?: string }> = [];
  for (const [index, item] of items.entries()) {
    try { results.push({ index, ok: true, data: await action(item) }); }
    catch (error) { results.push({ index, ok: false, error: error instanceof Error ? error.message : 'Operation failed.' }); }
  }
  const failed = results.filter(result => !result.ok).length;
  return schema.output.parse({ atomic: false, succeeded: results.length - failed, failed, results });
}

export function registerContentTools(server: McpServer) {
  function add<T extends z.ZodType>(name: string, description: string, inputSchema: T, action: (input: z.infer<T>, ownerId: string) => Promise<z.infer<typeof schema.output>>, readOnly = false, destructive = false) {
    server.registerTool<typeof schema.output, z.ZodType>(name, {
      title: name.replace(/_/g, ' '), description,
      inputSchema, outputSchema: schema.output,
      annotations: { readOnlyHint: readOnly, destructiveHint: destructive, openWorldHint: name === 'upload_images', idempotentHint: readOnly },
    }, async (input, ctx) => {
      const ownerId = ctx.http?.authInfo?.extra?.userId;
      if (typeof ownerId !== 'string') throw new Error('Owner authentication required.');
      const required = readOnly ? 'content:read' : 'content:write';
      if (!ctx.http?.authInfo?.scopes.includes(required)) throw new Error(`${required} permission is required.`);
      const result = await action(inputSchema.parse(input), ownerId);
      if (result.succeeded > 0) {
        if (name === 'create_posts' || name === 'update_posts' || name === 'delete_content') invalidatePublicContent('post');
        if (name === 'create_aircraft' || name === 'update_aircraft' || name === 'set_aircraft_images' || name === 'delete_content') invalidatePublicContent('aircraft');
      }
      if (!readOnly) console.info(JSON.stringify({ event: 'content_mutation', tool: name, owner_id: ownerId, succeeded: result.succeeded, failed: result.failed }));
      return { content: [{ type: 'text', text: JSON.stringify(result) }], structuredContent: result, isError: result.failed > 0 };
    });
  }

  const batchNote = ' Accepts 1–20 items. Runs sequentially, not atomically; inspect each indexed result and retry only failed items.';
  add('list_content', 'Find posts or aircraft, including drafts, by title. Returns full records with IDs and updated_at for safe edits.', z.object({ kind: schema.kind, query: z.string().max(200).optional(), offset: z.number().int().min(0).default(0), limit: z.number().int().min(1).max(100).default(20) }).strict(), input => runBatch([input], item => content.listContent(item)), true);
  add('get_content', 'Read posts or aircraft by exact ID or slug; aircraft include their ordered image gallery.' + batchNote, schema.batch(z.object({ kind: schema.kind, identifier: z.string().min(1).max(200) }).strict()), input => runBatch(input.items, item => content.getContent(item.kind, item.identifier)), true);
  add('list_sellers', 'List existing seller profiles for aircraft attribution. Creation otherwise uses the signed-in owner.', z.object({}).strict(), () => runBatch([0], async () => {
    const { data, error } = await contentClient().from('users').select('id,name,company,email,phone').order('name');
    if (error) throw new Error(error.message);
    return { sellers: data || [] };
  }), true);
  add('create_posts', 'Create posts from supplied Markdown, metadata and an optional uploaded header image. Draft by default; published=true publishes. No AI runs on the site.' + batchNote, schema.batch(schema.postFields), (input, owner) => runBatch(input.items, item => content.createPost(item, owner)));
  add('update_posts', 'Patch posts, preserving omitted fields. Set header_photo=null to remove a header, or published=false to unpublish. expected_updated_at prevents stale edits.' + batchNote, schema.batch(z.object({ id: schema.id, changes: schema.postPatch, expected_updated_at: schema.revision }).strict()), input => runBatch(input.items, item => content.updatePost(item.id, item.changes, item.expected_updated_at)), false, true);
  add('create_aircraft', 'Create aircraft listings with supplied specifications and text. Price is USD whole dollars. Draft by default; status=active publishes. Defaults to the signed-in owner as seller.' + batchNote, schema.batch(schema.aircraftFields), (input, owner) => runBatch(input.items, item => content.createAircraft(item, owner)));
  add('update_aircraft', 'Patch aircraft specifications, text, slug or publication status, preserving omitted fields. expected_updated_at prevents stale edits.' + batchNote, schema.batch(z.object({ id: schema.id, changes: schema.aircraftPatch, expected_updated_at: schema.revision }).strict()), input => runBatch(input.items, item => content.updateAircraft(item.id, item.changes, item.expected_updated_at)), false, true);
  add('delete_content', 'Permanently delete specifically identified posts or aircraft (and aircraft gallery records). Uploaded image files remain available for reuse. Prefer unpublishing for reversible removal.' + batchNote, schema.batch(z.object({ kind: schema.kind, id: schema.id, expected_updated_at: schema.revision }).strict()), input => runBatch(input.items, item => content.deleteContent(item.kind, item.id, item.expected_updated_at)), false, true);
  add('upload_images', 'Import supplied JPEG/PNG/WebP images using public HTTPS source_url or small raw base64. Validates and optimizes images to WebP. Returns storage_path and public_url; attach the path with update_posts or set_aircraft_images. Images can also be embedded in Markdown using public_url.' + batchNote, schema.batch(schema.imageInput), input => runBatch(input.items, uploadImage));
  add('begin_image_upload', 'Create scoped signed upload URLs for files the agent has locally (up to the storage bucket limit). Upload the binary file externally, then attach the returned storage_path. Signed URLs are credentials and must not appear in public content.' + batchNote, schema.batch(z.object({ kind: schema.kind, filename: z.string().min(1).max(100) }).strict()), input => runBatch(input.items, item => content.beginImageUpload(item.kind, item.filename)));
  add('set_aircraft_images', 'Replace an aircraft gallery with the supplied ordered images, alt text and captions. primary_index selects the cover. Reorder by resupplying paths; remove images by omitting them; an empty array clears the gallery. Uploaded files are retained. Read the complete current gallery before replacing it.' + batchNote, schema.batch(z.object({ id: schema.id, photos: z.array(schema.photoInput).max(30), primary_index: z.number().int().min(0).default(0), expected_updated_at: schema.revision }).strict()), input => runBatch(input.items, item => content.setAircraftImages(item.id, item.photos, item.primary_index, item.expected_updated_at)), false, true);
}

const handler = createMcpHandler(registerContentTools, {
  serverInfo: { name: 'ZuluNiner Content', version: '1.0.0' },
  instructions: 'Manage ZuluNiner aircraft and Markdown posts using finished content supplied by the agent. Never invent aircraft specifications or claim a test aircraft is for sale. Read before editing. Drafts are the default; publish only when requested. Every mutation supports 1–20 items and returns indexed partial-success results. Inspect errors before retrying to avoid duplicate records. No AI generation happens on the server.',
});

export const authenticatedHandler = withMcpAuth(handler, verifyOwner, {
  required: true, resourceUrl: siteOrigin(), resourceMetadataPath: '/.well-known/oauth-protected-resource',
});

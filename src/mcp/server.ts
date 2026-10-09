import { McpServer, WebStandardStreamableHTTPServerTransport } from '@modelcontextprotocol/server';

import { z } from 'zod';
import { CfWorkerJsonSchemaValidator } from '@modelcontextprotocol/server/validators/cf-worker';
import * as schema from './schemas';
import * as content from './content';
import { uploadImage } from './images';

import { siteOrigin, verifyOwner } from './auth';
import { requestPublish } from '@/worker/publishing';

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
      if (result.succeeded > 0 && ['create_posts','update_posts','delete_content','create_aircraft','update_aircraft','set_aircraft_images'].includes(name)) {
        const publishing = await requestPublish();
        for (const item of result.results) if (item.ok && item.data && typeof item.data === 'object' && !Array.isArray(item.data)) item.data = { ...item.data, publishing: z.json().parse(publishing) };
      }
      if (!readOnly) console.info(JSON.stringify({ event: 'content_mutation', tool: name, owner_id: ownerId, succeeded: result.succeeded, failed: result.failed }));
      return { content: [{ type: 'text', text: JSON.stringify(result) }], structuredContent: result, isError: result.failed > 0 };
    });
  }

  const batchNote = ' Accepts 1–20 items. Runs sequentially, not atomically; inspect each indexed result and retry only failed items.';
  add('list_content', 'Find posts or aircraft, including drafts, by title. Returns full records with IDs and updated_at for safe edits.', z.object({ kind: schema.kind, query: z.string().max(200).optional(), offset: z.number().int().min(0).default(0), limit: z.number().int().min(1).max(100).default(20) }).strict(), input => runBatch([input], item => content.listContent(item)), true);
  add('get_content', 'Read posts or aircraft by exact ID or slug; aircraft include their ordered image gallery.' + batchNote, schema.batch(z.object({ kind: schema.kind, identifier: z.string().min(1).max(200) }).strict()), input => runBatch(input.items, item => content.getContent(item.kind, item.identifier)), true);
  add('list_sellers', 'List existing seller profiles for aircraft attribution.', z.object({}).strict(), () => runBatch([0], content.listSellers), true);
  add('publish_site', 'Queue a fresh static-site deployment after a failed build or trigger.', z.object({}).strict(), () => runBatch([0], requestPublish));
  add('publish_status', 'Read the latest static-site deployment status. Content saves are immediate; public changes appear only after a successful deployment.', z.object({}).strict(), () => runBatch([0], async () => { const { publishStatus } = await import('@/worker/publishing'); return publishStatus(); }), true);
  add('create_posts', 'Create posts from supplied Markdown, metadata and an optional uploaded header image. Draft by default; published=true publishes. No AI runs on the site.' + batchNote, schema.batch(schema.postFields), (input, owner) => runBatch(input.items, item => content.createPost(item, owner)));
  add('update_posts', 'Patch posts, preserving omitted fields. Set header_photo=null to remove a header, or published=false to unpublish. expected_updated_at prevents stale edits.' + batchNote, schema.batch(z.object({ id: schema.id, changes: schema.postPatch, expected_updated_at: schema.revision }).strict()), input => runBatch(input.items, item => content.updatePost(item.id, item.changes, item.expected_updated_at)), false, true);
  add('create_aircraft', 'Create aircraft listings with supplied specifications and text. Price is USD whole dollars. Draft by default; status=active publishes. Defaults to the signed-in owner as seller.' + batchNote, schema.batch(schema.aircraftFields), (input, owner) => runBatch(input.items, item => content.createAircraft(item, owner)));
  add('update_aircraft', 'Patch aircraft specifications, text, slug or publication status, preserving omitted fields. expected_updated_at prevents stale edits.' + batchNote, schema.batch(z.object({ id: schema.id, changes: schema.aircraftPatch, expected_updated_at: schema.revision }).strict()), input => runBatch(input.items, item => content.updateAircraft(item.id, item.changes, item.expected_updated_at)), false, true);
  add('delete_content', 'Permanently delete specifically identified posts or aircraft (and aircraft gallery records). Uploaded image files remain available for reuse. Prefer unpublishing for reversible removal.' + batchNote, schema.batch(z.object({ kind: schema.kind, id: schema.id, expected_updated_at: schema.revision }).strict()), input => runBatch(input.items, item => content.deleteContent(item.kind, item.id, item.expected_updated_at)), false, true);
  add('upload_images', 'Import supplied JPEG/PNG/WebP images using public HTTPS source_url or small raw base64. Validates and optimizes images to WebP. Returns storage_path and public_url; attach the path with update_posts or set_aircraft_images. Images can also be embedded in Markdown using public_url.' + batchNote, schema.batch(schema.imageInput), input => runBatch(input.items, uploadImage));
  add('begin_image_upload', 'Create scoped signed upload URLs for files the agent has locally (up to the storage bucket limit). Upload the binary file externally, then attach the returned storage_path. Signed URLs are credentials and must not appear in public content.' + batchNote, schema.batch(z.object({ kind: schema.kind, filename: z.string().min(1).max(100) }).strict()), input => runBatch(input.items, item => content.beginImageUpload(item.kind, item.filename)));
  add('set_aircraft_images', 'Replace an aircraft gallery with the supplied ordered images, alt text and captions. primary_index selects the cover. Reorder by resupplying paths; remove images by omitting them; an empty array clears the gallery. Uploaded files are retained. Read the complete current gallery before replacing it.' + batchNote, schema.batch(z.object({ id: schema.id, photos: z.array(schema.photoInput).max(30), primary_index: z.number().int().min(0).default(0), expected_updated_at: schema.revision }).strict()), input => runBatch(input.items, item => content.setAircraftImages(item.id, item.photos, item.primary_index, item.expected_updated_at)), false, true);
}

export async function authenticatedHandler(request: Request) {
  const auth = await verifyOwner(request, request.headers.get('authorization')?.replace(/^Bearer /, ''));
  if (!auth) return new Response('Owner authentication required.', { status: 401, headers: { 'WWW-Authenticate': `Bearer resource_metadata="${siteOrigin()}/.well-known/oauth-protected-resource"` } });
  const server = new McpServer({name:'ZuluNiner Content',version:'2.0.0'}, {jsonSchemaValidator:new CfWorkerJsonSchemaValidator(),instructions:'Manage aircraft and Markdown posts using supplied content. Read before editing. Drafts are default. Mutations save immediately and queue a static site rebuild; use publish_status to check when public pages are deployed. Batches return indexed partial success.'});
  registerContentTools(server);
  const transport = new WebStandardStreamableHTTPServerTransport({sessionIdGenerator:undefined,enableJsonResponse:true});
  await server.connect(transport);
  return transport.handleRequest(request, {authInfo:auth});
}

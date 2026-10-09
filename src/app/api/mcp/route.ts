import { authenticatedHandler } from '@/mcp/server';
import { siteOrigin } from '@/mcp/auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 300;

const MAX_BODY = 3 * 1024 * 1024;

async function handle(request: Request) {
  const origin = request.headers.get('origin');
  if (origin && ![siteOrigin(), 'https://chatgpt.com', 'https://chat.openai.com'].includes(origin)) return new Response('Origin not allowed.', { status: 403 });
  if (request.method === 'POST' && request.body) {
    const reader = request.body.getReader();
    const chunks: Buffer[] = [];
    let size = 0;
    while (true) {
      const chunk = await reader.read();
      if (chunk.done) break;
      size += chunk.value.length;
      if (size > MAX_BODY) { await reader.cancel(); return new Response('MCP request exceeds 3 MiB; use smaller batches or signed image uploads.', { status: 413 }); }
      chunks.push(Buffer.from(chunk.value));
    }
    request = new Request(request, { body: Buffer.concat(chunks).toString('utf8') });
  }
  const response = await authenticatedHandler(request);
  response.headers.set('Cache-Control', 'no-store');
  if (origin) response.headers.set('Access-Control-Allow-Origin', origin);
  return response;
}

export { handle as GET, handle as POST, handle as DELETE };
export function OPTIONS(request: Request) {
  const origin = request.headers.get('origin') || siteOrigin();
  if (![siteOrigin(), 'https://chatgpt.com', 'https://chat.openai.com'].includes(origin)) return new Response(null, { status: 403 });
  return new Response(null, { status: 204, headers: { 'Access-Control-Allow-Origin': origin, 'Access-Control-Allow-Methods': 'GET,POST,DELETE,OPTIONS', 'Access-Control-Allow-Headers': 'Authorization,Content-Type,MCP-Protocol-Version', Vary: 'Origin' } });
}

import { registerClient } from '@/mcp/oauth';

export async function POST(request: Request) {
  try {
    if (Number(request.headers.get('content-length') || 0) > 16384) return new Response('Request too large.', { status: 413 });
    return Response.json(await registerClient(await request.json()), { status: 201, headers: { 'Cache-Control': 'no-store' } });
  } catch {
    return Response.json({ error: 'invalid_client_metadata', error_description: 'Use an approved callback, public client authentication (none), and authorization_code with PKCE.' }, { status: 400 });
  }
}

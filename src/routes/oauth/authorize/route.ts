import { beginAuthorization } from '@/mcp/oauth';

export async function GET(request: Request) {
  try {
    return Response.redirect(await beginAuthorization(new URL(request.url).searchParams), 302);
  } catch {
    return Response.json({ error: 'invalid_request', error_description: 'Invalid client, callback, scope, resource or S256 PKCE parameters.' }, { status: 400 });
  }
}

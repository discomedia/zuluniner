import { revokeToken } from '@/mcp/oauth';
export async function POST(request: Request) {
  try {
    await revokeToken(new URLSearchParams(await request.text()));
    return new Response(null, { status: 200, headers: { 'Cache-Control': 'no-store' } });
  } catch {
    return Response.json({ error: 'temporarily_unavailable' }, { status: 503, headers: { 'Cache-Control': 'no-store' } });
  }
}

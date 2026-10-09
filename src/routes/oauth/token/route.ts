import { exchangeToken } from '@/mcp/oauth';

export async function POST(request: Request) {
  try {
    const params = new URLSearchParams(await request.text());
    return Response.json(await exchangeToken(params), { headers: { 'Cache-Control': 'no-store', Pragma: 'no-cache' } });
  } catch {
    return Response.json({ error: 'invalid_grant', error_description: 'Invalid, expired or previously used grant. Reconnect the agent.' }, { status: 400, headers: { 'Cache-Control': 'no-store' } });
  }
}

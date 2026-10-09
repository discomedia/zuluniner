import { authorizationDetails, approveAuthorization } from '@/mcp/oauth';
import { siteOrigin } from '@/mcp/auth';
import { z } from 'zod';

export const runtime = 'nodejs';
export async function GET(request: Request) {
  try {
    const requestId = new URL(request.url).searchParams.get('request_id') || '';
    const details = await authorizationDetails(requestId);
    return Response.json({ client_name: details.client_name, scope: details.scope }, { headers: { 'Cache-Control': 'no-store' } });
  } catch { return Response.json({ error: 'Authorization request expired. Start again from your agent.' }, { status: 400 }); }
}

export async function POST(request: Request) {
  if (request.headers.get('origin') !== siteOrigin()) return new Response('Origin not allowed.', { status: 403 });
  try {
    const input = z.object({ request_id: z.string().min(20).max(100), approved: z.boolean() }).strict().parse(await request.json());
    const token = request.headers.get('authorization')?.replace(/^Bearer /, '') || '';
    return Response.json(await approveAuthorization(input.request_id, token, input.approved), { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : 'Could not authorize this agent.' }, { status: 400 });
  }
}

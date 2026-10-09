import { siteOrigin } from '@/mcp/auth';

export function GET() {
  return Response.json({
    resource: `${siteOrigin()}/api/mcp`,
    resource_name: 'ZuluNiner Content',
    authorization_servers: [siteOrigin()],
    scopes_supported: ['content:read', 'content:write'],
    bearer_methods_supported: ['header'],
  }, { headers: { 'Access-Control-Allow-Origin': '*', 'Cache-Control': 'no-store' } });
}

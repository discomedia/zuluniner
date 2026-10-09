import { siteOrigin } from '@/mcp/auth';

export function GET() {
  const origin = siteOrigin();
  return Response.json({
    issuer: origin,
    authorization_response_iss_parameter_supported: true,
    authorization_endpoint: `${origin}/oauth/authorize`,
    token_endpoint: `${origin}/oauth/token`,
    revocation_endpoint: `${origin}/oauth/revoke`,
    revocation_endpoint_auth_methods_supported: ['none'],
    registration_endpoint: `${origin}/oauth/register`,
    response_types_supported: ['code'],
    grant_types_supported: ['authorization_code', 'refresh_token'],
    token_endpoint_auth_methods_supported: ['none'],
    code_challenge_methods_supported: ['S256'],
    scopes_supported: ['content:read', 'content:write'],
  }, { headers: { 'Access-Control-Allow-Origin': '*', 'Cache-Control': 'no-store' } });
}

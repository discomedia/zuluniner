import type { AuthInfo } from '@modelcontextprotocol/server';
import { contentClient } from './client';
import { readAccessToken } from './oauth';

export function siteOrigin() {
  return new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://zuluniner.com').origin;
}

export function allowedOwner(id: string) {
  return (process.env.ZULUNINER_MCP_OWNER_IDS || '').split(',').map(value => value.trim()).includes(id);
}

export async function verifyOwner(_request: Request, token?: string): Promise<AuthInfo | undefined> {
  if (!token) return undefined;
  const grant = await readAccessToken(token);
  if (!grant || !allowedOwner(grant.user_id)) return undefined;
  const client = contentClient();
  // Authorize using the database, never user-editable JWT user_metadata.
  const profile = await client.from('users').select('role').eq('id', grant.user_id).single();
  if (profile.error || profile.data.role !== 'admin') return undefined;
  return { token, clientId: grant.client_id, scopes: grant.scope.split(' '), expiresAt: grant.expires_at, resource: new URL(grant.resource), extra: { userId: grant.user_id } };
}

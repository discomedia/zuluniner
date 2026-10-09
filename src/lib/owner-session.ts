import type { VanillaBetterAuthClient } from '@neondatabase/auth';

export async function ownerSessionToken(auth: VanillaBetterAuthClient) {
  // Neon Auth 0.5.0-beta treats /token as /get-session in its cache.
  // Force the JWT request to reach the server instead of returning session data.
  const jwt = await auth.token({ fetchOptions: { headers: { 'X-Force-Fetch': 'true' } } });
  if (jwt.error || !jwt.data?.token) {
    throw new Error(jwt.error?.message || 'Could not restore owner session.');
  }
  return jwt.data.token;
}

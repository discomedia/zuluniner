import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createAuthClient } from '@neondatabase/auth';
import { ownerSessionToken } from '../lib/owner-session';

test('owner JWT is fetched after the SDK caches a restored session', async () => {
  const originalFetch = globalThis.fetch;
  const requests: string[] = [];
  globalThis.fetch = async (input, init) => {
    const url = String(input);
    requests.push(url);
    assert.equal(new Headers(init?.headers).has('X-Force-Fetch'), false);
    if (url.endsWith('/get-session')) {
      return Response.json({
        session: { id: 'session', token: 'opaque-session', userId: 'owner', expiresAt: '2099-01-01T00:00:00Z' },
        user: { id: 'owner', email: 'owner@example.com' },
      });
    }
    assert.ok(url.endsWith('/token'));
    return Response.json({ token: 'signed-owner-jwt' });
  };
  try {
    const auth = createAuthClient('https://auth.example.com/auth');
    assert.equal((await auth.getSession()).data?.user.id, 'owner');
    assert.equal(await ownerSessionToken(auth), 'signed-owner-jwt');
    assert.equal(await ownerSessionToken(auth), 'signed-owner-jwt');
    assert.deepEqual(requests.map(url => new URL(url).pathname), ['/auth/get-session', '/auth/token', '/auth/token']);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { aircraftFields, postPatch, batch, imageInput, storagePath } from '../mcp/schemas';
import { publicImageAddress, fetchImage } from '../mcp/images';
import { runBatch } from '../mcp/server';
import { trustedRedirect, digest } from '../mcp/oauth';

test('batches retain successes and order around a failed item', async () => {
  const result = await runBatch([1, 2, 3], async value => {
    if (value === 2) throw new Error('conflict');
    return { value };
  });
  assert.deepEqual(result, { atomic: false, succeeded: 2, failed: 1, results: [
    { index: 0, ok: true, data: { value: 1 } },
    { index: 1, ok: false, error: 'conflict' },
    { index: 2, ok: true, data: { value: 3 } },
  ] });
});

test('mutation validation prevents empty, oversized and dangerous inputs', () => {
  assert.equal(batch(postPatch).safeParse({ items: [] }).success, false);
  assert.equal(batch(postPatch).safeParse({ items: Array(21).fill({ title: 'Test' }) }).success, false);
  assert.equal(postPatch.safeParse({}).success, false);
  assert.equal(postPatch.safeParse({ author_id: 'spoof' }).success, false);
  assert.equal(postPatch.safeParse({ title: ' ' }).success, false);
  assert.equal(storagePath.safeParse('../image.jpg').success, false);
  assert.equal(storagePath.safeParse('https://example.com/image.jpg').success, false);
  assert.equal(imageInput.safeParse({ kind: 'post', filename: 'a.jpg', base64: 'a', source_url: 'https://example.com/a.jpg' }).success, false);
  assert.equal(aircraftFields.safeParse({ title: 'Test', slug: 'test', price: -1, year: 2000, make: 'Test', model: 'Test' }).success, false);
  assert.equal(postPatch.parse({ content: null }).content, null);
});

test('image downloads reject private networks, credentials and unsafe schemes', async () => {
  for (const address of ['127.0.0.1', '10.0.0.1', '169.254.169.254', '192.168.1.1', '::1', 'fe80::1', '::ffff:127.0.0.1', '203.0.113.1']) assert.equal(publicImageAddress(address), false, address);
  assert.equal(publicImageAddress('1.1.1.1'), true);
  for (const url of ['http://example.com/a.jpg', 'https://user:pass@example.com/a.jpg', 'https://example.com:8443/a.jpg', 'https://127.0.0.1/a.jpg', 'https://[::1]/a.jpg']) await assert.rejects(fetchImage(url));
});

test('OAuth only accepts exact registered agent callbacks', () => {
  assert.equal(trustedRedirect('https://chatgpt.com/connector_platform_oauth_redirect'), true);
  assert.equal(trustedRedirect('https://chatgpt.com/connector/oauth/abc123'), true);
  for (const url of ['https://chatgpt.com.evil.test/connector_platform_oauth_redirect', 'https://chatgpt.com/connector_platform_oauth_redirect?redirect=evil', 'http://chatgpt.com/connector_platform_oauth_redirect', 'https://example.com/callback']) assert.equal(trustedRedirect(url), false, url);
  assert.equal(digest('secret').length, 64);
  assert.notEqual(digest('secret'), digest('different'));
});

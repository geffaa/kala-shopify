import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createHmac } from 'node:crypto';
import { verifyProxySignature, verifyWebhook } from '../src/shopify/hmac.js';

const SECRET = 'shpss_test_secret';

test('verifyWebhook accepts a correct HMAC and rejects tampering', () => {
  const body = Buffer.from('{"id":1,"name":"#1001"}');
  const hmac = createHmac('sha256', SECRET).update(body).digest('base64');
  assert.equal(verifyWebhook(body, hmac, SECRET), true);
  assert.equal(verifyWebhook(Buffer.from('{"id":1,"name":"#1002"}'), hmac, SECRET), false);
  assert.equal(verifyWebhook(body, hmac, 'other'), false);
  assert.equal(verifyWebhook(body, undefined, SECRET), false);
  assert.equal(verifyWebhook(body, 'not-base64!!', SECRET), false);
});

function signProxy(params) {
  const message = Object.keys(params)
    .sort()
    .map((k) => `${k}=${Array.isArray(params[k]) ? params[k].join(',') : params[k]}`)
    .join('');
  return createHmac('sha256', SECRET).update(message).digest('hex');
}

test('verifyProxySignature follows Shopify app proxy rules', () => {
  const now = Date.UTC(2026, 9, 15, 10, 0, 0);
  const params = {
    shop: 'kala-dev.myshopify.com',
    path_prefix: '/apps/kala',
    timestamp: String(now / 1000),
    logged_in_customer_id: '',
  };
  const qs = new URLSearchParams({ ...params, signature: signProxy(params) });
  assert.equal(verifyProxySignature(qs, SECRET, { now }), true);

  const tampered = new URLSearchParams(qs);
  tampered.set('shop', 'evil.myshopify.com');
  assert.equal(verifyProxySignature(tampered, SECRET, { now }), false);
});

test('verifyProxySignature joins repeated keys with commas', () => {
  const now = 1_760_000_000_000;
  const params = { shop: 's.myshopify.com', timestamp: String(now / 1000), extra: ['1', '2'] };
  const qs = new URLSearchParams([
    ['shop', params.shop],
    ['timestamp', params.timestamp],
    ['extra', '1'],
    ['extra', '2'],
    ['signature', signProxy(params)],
  ]);
  assert.equal(verifyProxySignature(qs, SECRET, { now }), true);
});

test('verifyProxySignature rejects stale requests (replay)', () => {
  const now = Date.UTC(2026, 9, 15);
  const params = { shop: 's.myshopify.com', timestamp: String(now / 1000 - 3600) };
  const qs = new URLSearchParams({ ...params, signature: signProxy(params) });
  assert.equal(verifyProxySignature(qs, SECRET, { now }), false);
});

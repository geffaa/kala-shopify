import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createHmac } from 'node:crypto';
import { createApp } from '../src/app.js';
import { openDb } from '../src/lib/db.js';
import { createQueue } from '../src/lib/queue.js';
import { toFulfillmentPayload } from '../src/webhooks/handlers.js';

const SECRET = 'shpss_test';
const silent = { info() {}, warn() {}, error() {} };

function setup({ variant } = {}) {
  const db = openDb(':memory:');
  const queue = createQueue({ baseDelayMs: 1, log: silent });
  const sent = { team: [], email: [], fulfillment: [] };
  const notify = {
    team: async (t) => sent.team.push(t),
    email: async (m) => sent.email.push(m),
    fulfillment: async (p) => sent.fulfillment.push(p),
  };
  const calls = [];
  const admin = {
    async graphql(query, variables) {
      calls.push(variables);
      if (query.includes('productVariant')) return { productVariant: variant ?? null };
      return { tagsAdd: { userErrors: [] } };
    },
    assertNoUserErrors: (p) => p,
  };
  const app = createApp({
    config: { clientSecret: SECRET, lowStockThreshold: 3, storefrontUrl: 'https://kala.test' },
    db,
    queue,
    admin,
    notify,
    log: silent,
  });
  return { app, db, queue, sent, calls };
}

function webhook(app, topic, payload, { id = crypto.randomUUID(), secret = SECRET } = {}) {
  const body = JSON.stringify(payload);
  return app.request('/webhooks', {
    method: 'POST',
    body,
    headers: {
      'X-Shopify-Hmac-Sha256': createHmac('sha256', secret).update(body).digest('base64'),
      'X-Shopify-Topic': topic,
      'X-Shopify-Shop-Domain': 'kala-dev.myshopify.com',
      'X-Shopify-Webhook-Id': id,
    },
  });
}

const order = {
  id: 820982911946154500,
  name: '#1042',
  currency: 'IDR',
  total_price: '718000.00',
  created_at: '2026-10-24T19:00:12+07:00',
  shipping_address: { name: 'Dewi', city: 'Bandung', country_code: 'ID', address1: 'Jl. Braga 21' },
  line_items: [
    { title: 'Kemeja Kerja Ramie', variant_title: 'M', quantity: 1, sku: 'KALA-0701-02' },
    { title: 'Tas Sisa Kain', variant_title: null, quantity: 1, sku: 'KALA-0706-01', requires_shipping: true },
  ],
};

test('rejects webhooks with a bad signature', async () => {
  const { app } = setup();
  const res = await webhook(app, 'orders/create', order, { secret: 'wrong' });
  assert.equal(res.status, 401);
});

test('orders/create: acks fast, forwards once, tags the order, ignores duplicates', async () => {
  const { app, queue, sent, calls, db } = setup();
  const first = await webhook(app, 'orders/create', order, { id: 'wh-1' });
  assert.equal(first.status, 200);
  assert.deepEqual(await first.json(), { queued: true });

  const dup = await webhook(app, 'orders/create', order, { id: 'wh-1' });
  assert.deepEqual(await dup.json(), { duplicate: true });

  await queue.idle();
  assert.equal(sent.fulfillment.length, 1);
  assert.equal(sent.fulfillment[0].order_number, '#1042');
  assert.match(sent.team[0], /#1042/);
  assert.deepEqual(calls.at(-1), { id: 'gid://shopify/Order/820982911946154500', tags: ['3pl-synced'] });
  assert.deepEqual(db.webhookStats(), [{ topic: 'orders/create', status: 'done', n: 1 }]);
});

test('toFulfillmentPayload keeps only what the 3PL needs', () => {
  const p = toFulfillmentPayload(order);
  assert.deepEqual(Object.keys(p.shipping_address).sort(), ['address1', 'address2', 'city', 'country_code', 'name', 'phone', 'province', 'zip']);
  assert.equal(p.lines.length, 2);
});

test('back-in-stock: proxy signup then restock webhook emails once', async () => {
  const variant = {
    id: 'gid://shopify/ProductVariant/111',
    title: 'S',
    availableForSale: false,
    inventoryItem: { id: 'gid://shopify/InventoryItem/999' },
    product: { title: 'Kemeja Pendek Ramie', handle: 'kemeja-pendek-ramie', onlineStoreUrl: null },
  };
  const { app, queue, sent } = setup({ variant });

  const params = { shop: 'kala-dev.myshopify.com', path_prefix: '/apps/kala', timestamp: String(Math.floor(Date.now() / 1000)) };
  const message = Object.keys(params).sort().map((k) => `${k}=${params[k]}`).join('');
  const signature = createHmac('sha256', SECRET).update(message).digest('hex');
  const qs = new URLSearchParams({ ...params, signature });

  const signup = await app.request(`/proxy/back-in-stock?${qs}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'Dewi@Example.com', variant_id: '111' }),
  });
  assert.equal(signup.status, 201);

  const bad = await app.request(`/proxy/back-in-stock?${qs}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'nope', variant_id: '111' }),
  });
  assert.equal(bad.status, 422);

  const unsigned = await app.request('/proxy/back-in-stock?shop=x', { method: 'POST', body: '{}' });
  assert.equal(unsigned.status, 401);

  await webhook(app, 'inventory_levels/update', { inventory_item_id: 999, available: 0 });
  await queue.idle();
  assert.equal(sent.email.length, 0, 'no email while still at 0');

  await webhook(app, 'inventory_levels/update', { inventory_item_id: 999, available: 4 });
  await webhook(app, 'inventory_levels/update', { inventory_item_id: 999, available: 3 });
  await queue.idle();
  assert.equal(sent.email.length, 1, 'notified exactly once');
  assert.equal(sent.email[0].to, 'dewi@example.com');
  assert.match(sent.email[0].html, /https:\/\/kala\.test\/products\/kemeja-pendek-ramie/);
});

test('products/update alerts on low stock once per level', async () => {
  const { app, queue, sent } = setup();
  const product = {
    title: 'Jaket Kebun',
    variants: [
      { id: 1, title: 'M', inventory_management: 'shopify', inventory_policy: 'deny', inventory_quantity: 1 },
      { id: 2, title: 'L', inventory_management: 'shopify', inventory_policy: 'deny', inventory_quantity: 12 },
    ],
  };
  await webhook(app, 'products/update', product);
  await webhook(app, 'products/update', product);
  await queue.idle();
  assert.deepEqual(sent.team, ['⚠️ Jaket Kebun / M: 1 left']);
});

test('customers/redact removes stored emails', async () => {
  const { app, queue, db } = setup();
  db.subscribe({ shop: 'kala-dev.myshopify.com', email: 'a@b.co', variantId: '1', inventoryItemId: '9' });
  await webhook(app, 'customers/redact', { customer: { email: 'a@b.co' } });
  await queue.idle();
  assert.equal(db.subscriptionsForEmail('kala-dev.myshopify.com', 'a@b.co').length, 0);
});

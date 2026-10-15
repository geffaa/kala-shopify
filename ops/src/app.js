import { Hono } from 'hono';
import { verifyProxySignature, verifyWebhook } from './shopify/hmac.js';
import { gid, legacyId } from './shopify/admin.js';
import { handlers } from './webhooks/handlers.js';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const VARIANT_LOOKUP = `
  query Variant($id: ID!) {
    productVariant(id: $id) {
      id
      title
      availableForSale
      inventoryItem { id }
      product { title handle onlineStoreUrl }
    }
  }`;

/**
 * HTTP surface, built as a factory so tests can inject an in-memory DB,
 * a fake Admin client and a recording notifier.
 */
export function createApp({ config, db, queue, admin, notify, log = console }) {
  const app = new Hono();
  const alerts = new Set();

  app.get('/healthz', (c) => c.json({ ok: true, queue: queue.size, webhooks: db.webhookStats() }));

  /**
   * One endpoint for every webhook topic. Order matters:
   * 1. verify HMAC on the raw body  2. de-duplicate by webhook id
   * 3. acknowledge  4. process asynchronously with retries.
   */
  app.post('/webhooks', async (c) => {
    const raw = Buffer.from(await c.req.arrayBuffer());
    if (!verifyWebhook(raw, c.req.header('x-shopify-hmac-sha256'), config.clientSecret)) {
      return c.json({ error: 'invalid hmac' }, 401);
    }
    const topic = c.req.header('x-shopify-topic');
    const shop = c.req.header('x-shopify-shop-domain');
    const id = c.req.header('x-shopify-webhook-id') || c.req.header('x-shopify-event-id');
    const handler = handlers[topic];
    if (!handler) return c.json({ ignored: topic }, 200);

    if (!db.recordWebhook({ id, topic, shop })) return c.json({ duplicate: true }, 200);

    let payload;
    try {
      payload = JSON.parse(raw.toString('utf8'));
    } catch {
      db.markWebhook(id, 'failed', 'invalid json');
      return c.json({ error: 'invalid json' }, 400);
    }

    queue.push(
      `${topic}#${id}`,
      () => handler(payload, { shop, db, admin, notify, config, log, alerts }),
      {
        onDone: () => db.markWebhook(id, 'done'),
        onFail: (e) => db.markWebhook(id, 'failed', e.message),
      }
    );
    return c.json({ queued: true }, 200);
  });

  /**
   * Storefront → /apps/kala/back-in-stock → (Shopify app proxy, signed) → here.
   * The proxy makes this same-origin for the theme and gives us a verified
   * shop + optional logged-in customer id without any CORS setup.
   */
  app.post('/proxy/back-in-stock', async (c) => {
    const url = new URL(c.req.url);
    if (!verifyProxySignature(url.searchParams, config.clientSecret)) {
      return c.json({ error: 'invalid signature' }, 401);
    }
    const shop = url.searchParams.get('shop');
    const customerId = url.searchParams.get('logged_in_customer_id') || null;

    const body = await c.req.json().catch(() => ({}));
    const email = String(body.email || '').trim().toLowerCase();
    const variantId = String(body.variant_id || '').replace(/\D/g, '');
    if (!EMAIL_RE.test(email) || email.length > 254) return c.json({ error: 'Please enter a valid email.' }, 422);
    if (!variantId) return c.json({ error: 'Missing variant.' }, 422);

    const data = await admin.graphql(VARIANT_LOOKUP, { id: gid('ProductVariant', variantId) });
    const variant = data.productVariant;
    if (!variant) return c.json({ error: 'Unknown variant.' }, 404);
    if (variant.availableForSale) return c.json({ message: 'Good news — this one is in stock right now.' }, 200);

    db.subscribe({
      shop,
      email,
      customerId,
      variantId,
      inventoryItemId: legacyId(variant.inventoryItem.id),
      productTitle: variant.product.title,
      variantTitle: variant.title,
      productUrl: variant.product.onlineStoreUrl || `${config.storefrontUrl ?? `https://${shop}`}/products/${variant.product.handle}`,
    });
    return c.json({ message: `Noted. We'll email ${email} once if it comes back.` }, 201);
  });

  app.onError((err, c) => {
    log.error(err);
    return c.json({ error: 'internal error' }, 500);
  });

  return app;
}

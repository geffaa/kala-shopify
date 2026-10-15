import { gid } from '../shopify/admin.js';

const escapeHtml = (s = '') => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

const money = (amount, currency) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: currency || 'IDR', maximumFractionDigits: 0 }).format(Number(amount));

/**
 * Pure transform: Shopify order webhook → the shape our fulfillment partner
 * expects. Kept separate from I/O so it can be unit-tested.
 */
export function toFulfillmentPayload(order) {
  return {
    id: order.id,
    order_number: order.name,
    created_at: order.created_at,
    currency: order.currency,
    total: order.total_price,
    note: order.note || null,
    shipping_address: order.shipping_address
      ? {
          name: order.shipping_address.name,
          phone: order.shipping_address.phone,
          address1: order.shipping_address.address1,
          address2: order.shipping_address.address2,
          city: order.shipping_address.city,
          province: order.shipping_address.province,
          zip: order.shipping_address.zip,
          country_code: order.shipping_address.country_code,
        }
      : null,
    lines: (order.line_items ?? [])
      .filter((l) => l.requires_shipping !== false)
      .map((l) => ({ sku: l.sku, title: l.title, variant: l.variant_title, quantity: l.quantity })),
  };
}

/** Variants at or below the threshold that are tracked and can't oversell. */
export function lowStockVariants(product, threshold) {
  return (product.variants ?? []).filter(
    (v) => v.inventory_management === 'shopify' && v.inventory_policy === 'deny' && v.inventory_quantity <= threshold
  );
}

const ORDER_TAGS = `
  mutation TagOrder($id: ID!, $tags: [String!]!) {
    tagsAdd(id: $id, tags: $tags) { userErrors { field message } }
  }`;

/**
 * Topic → handler. Each receives (payload, ctx) where ctx = { shop, admin, db, notify, config, log }.
 * Handlers must be idempotent; duplicates are filtered upstream but retries
 * after partial failure can still re-run a handler.
 */
export const handlers = {
  async 'orders/create'(order, { admin, notify, log }) {
    const lines = (order.line_items ?? []).map((l) => `${l.quantity}× ${l.title}${l.variant_title ? ` (${l.variant_title})` : ''}`);
    await notify.team(`🧾 ${order.name} — ${money(order.total_price, order.currency)}\n${lines.join('\n')}`);
    await notify.fulfillment(toFulfillmentPayload(order));
    if (admin) {
      const data = await admin.graphql(ORDER_TAGS, { id: gid('Order', order.id), tags: ['3pl-synced'] });
      admin.assertNoUserErrors(data.tagsAdd, 'tagsAdd');
    }
    log.info(`[orders/create] ${order.name} forwarded`);
  },

  async 'products/update'(product, { notify, config, alerts }) {
    // Campaign ops: tell the team when a size is about to sell out, once per level.
    for (const v of lowStockVariants(product, config.lowStockThreshold)) {
      const key = `${v.id}:${v.inventory_quantity}`;
      if (alerts.has(key)) continue;
      alerts.add(key);
      const state = v.inventory_quantity <= 0 ? 'SOLD OUT' : `${v.inventory_quantity} left`;
      await notify.team(`⚠️ ${product.title} / ${v.title}: ${state}`);
    }
  },

  async 'inventory_levels/update'(level, { shop, db, notify, log }) {
    if (!(level.available > 0)) return;
    const subs = db.pendingForInventoryItem(shop, level.inventory_item_id);
    if (!subs.length) return;
    // Don't email more people than there are units: first come, first served.
    const batch = subs.slice(0, Math.max(level.available * 3, 10));
    for (const sub of batch) {
      await notify.email({
        to: sub.email,
        subject: `${sub.product_title} (${sub.variant_title}) is back`,
        html: `<p>${escapeHtml(sub.product_title)} in ${escapeHtml(sub.variant_title)} is available again — ${level.available} in stock right now.</p>
               <p><a href="${escapeHtml(sub.product_url)}">Get it before it's gone</a></p>`,
      });
      db.markNotified(sub.id);
    }
    log.info(`[restock] notified ${batch.length} subscriber(s) for item ${level.inventory_item_id}`);
  },

  async 'app/uninstalled'(_payload, { shop, db, log }) {
    db.purgeShop(shop);
    log.info(`[app/uninstalled] purged data for ${shop}`);
  },

  // Mandatory privacy (GDPR) compliance topics.
  async 'customers/data_request'(payload, { shop, db, notify }) {
    const rows = db.subscriptionsForEmail(shop, payload.customer?.email);
    await notify.team(`🔐 Data request for ${payload.customer?.email}: ${rows.length} restock subscription(s) on file.`);
  },
  async 'customers/redact'(payload, { shop, db, log }) {
    const n = db.redactEmail(shop, payload.customer?.email);
    log.info(`[customers/redact] removed ${n} row(s)`);
  },
  async 'shop/redact'(_payload, { shop, db }) {
    db.purgeShop(shop);
  },
};

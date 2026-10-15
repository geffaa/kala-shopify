import { mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { DatabaseSync } from 'node:sqlite';

/**
 * SQLite via node:sqlite (no native deps). Two concerns live here:
 * - webhook_events: idempotency. Shopify delivers at-least-once and retries
 *   for 48h, so every handler must tolerate duplicates.
 * - restock_subscriptions: back-in-stock signups from the storefront.
 */
export function openDb(path) {
  if (path !== ':memory:') mkdirSync(dirname(path), { recursive: true });
  const db = new DatabaseSync(path);
  db.exec(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS webhook_events (
      webhook_id   TEXT PRIMARY KEY,
      topic        TEXT NOT NULL,
      shop         TEXT NOT NULL,
      received_at  TEXT NOT NULL DEFAULT (datetime('now')),
      processed_at TEXT,
      status       TEXT NOT NULL DEFAULT 'queued',
      attempts     INTEGER NOT NULL DEFAULT 0,
      error        TEXT
    );
    CREATE TABLE IF NOT EXISTS restock_subscriptions (
      id                INTEGER PRIMARY KEY AUTOINCREMENT,
      shop              TEXT NOT NULL,
      email             TEXT NOT NULL,
      variant_id        TEXT NOT NULL,
      inventory_item_id TEXT NOT NULL,
      product_title     TEXT,
      variant_title     TEXT,
      product_url       TEXT,
      customer_id       TEXT,
      created_at        TEXT NOT NULL DEFAULT (datetime('now')),
      notified_at       TEXT,
      UNIQUE (shop, variant_id, email)
    );
    CREATE INDEX IF NOT EXISTS idx_restock_pending
      ON restock_subscriptions (shop, inventory_item_id) WHERE notified_at IS NULL;
  `);

  return {
    raw: db,

    /** Returns false if this webhook id was already recorded (duplicate delivery). */
    recordWebhook({ id, topic, shop }) {
      const res = db
        .prepare('INSERT OR IGNORE INTO webhook_events (webhook_id, topic, shop) VALUES (?, ?, ?)')
        .run(id, topic, shop);
      return res.changes === 1;
    },
    markWebhook(id, status, error = null) {
      db.prepare(
        `UPDATE webhook_events SET status = ?, error = ?, attempts = attempts + 1,
         processed_at = CASE WHEN ? = 'done' THEN datetime('now') ELSE processed_at END WHERE webhook_id = ?`
      ).run(status, error, status, id);
    },
    webhookStats() {
      return db
        .prepare('SELECT topic, status, COUNT(*) AS n FROM webhook_events GROUP BY topic, status')
        .all()
        .map((row) => ({ ...row }));
    },

    subscribe(sub) {
      const res = db
        .prepare(
          `INSERT INTO restock_subscriptions
             (shop, email, variant_id, inventory_item_id, product_title, variant_title, product_url, customer_id)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)
           ON CONFLICT (shop, variant_id, email) DO UPDATE SET notified_at = NULL`
        )
        .run(
          sub.shop,
          sub.email,
          String(sub.variantId),
          String(sub.inventoryItemId),
          sub.productTitle ?? null,
          sub.variantTitle ?? null,
          sub.productUrl ?? null,
          sub.customerId ?? null
        );
      return res.changes;
    },
    pendingForInventoryItem(shop, inventoryItemId) {
      return db
        .prepare('SELECT * FROM restock_subscriptions WHERE shop = ? AND inventory_item_id = ? AND notified_at IS NULL')
        .all(shop, String(inventoryItemId));
    },
    markNotified(id) {
      db.prepare("UPDATE restock_subscriptions SET notified_at = datetime('now') WHERE id = ?").run(id);
    },
    redactEmail(shop, email) {
      return db.prepare('DELETE FROM restock_subscriptions WHERE shop = ? AND email = ?').run(shop, email).changes;
    },
    subscriptionsForEmail(shop, email) {
      return db.prepare('SELECT * FROM restock_subscriptions WHERE shop = ? AND email = ?').all(shop, email);
    },
    purgeShop(shop) {
      db.prepare('DELETE FROM restock_subscriptions WHERE shop = ?').run(shop);
    },
  };
}

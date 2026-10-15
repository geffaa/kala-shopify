import { serve } from '@hono/node-server';
import { config, requireConfig } from './config.js';
import { createApp } from './app.js';
import { openDb } from './lib/db.js';
import { createQueue } from './lib/queue.js';
import { createNotifier } from './lib/notify.js';
import { createAdminClient } from './shopify/admin.js';

requireConfig('shop', 'clientSecret');

const db = openDb(config.dbPath);
const queue = createQueue();
const notify = createNotifier(config);
const admin = createAdminClient({ ...config, token: config.adminToken, log: (m) => console.log(`[admin] ${m}`) });

const app = createApp({ config, db, queue, admin, notify });
const server = serve({ fetch: app.fetch, port: config.port }, ({ port }) => {
  console.log(`kala-ops listening on :${port}`);
});

// Finish in-flight jobs before exiting so acknowledged webhooks aren't lost.
for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, async () => {
    console.log(`${signal}: draining ${queue.size} job(s)…`);
    server.close();
    await queue.idle();
    process.exit(0);
  });
}

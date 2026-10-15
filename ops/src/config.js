import { fileURLToPath } from 'node:url';

try {
  process.loadEnvFile(fileURLToPath(new URL('../.env', import.meta.url)));
} catch {
  /* .env is optional; real deployments inject env vars */
}

const env = process.env;

export const config = {
  shop: env.SHOPIFY_SHOP, // kala-dev.myshopify.com
  apiVersion: env.SHOPIFY_API_VERSION || '2026-07',
  adminToken: env.SHOPIFY_ADMIN_TOKEN, // optional static token
  clientId: env.SHOPIFY_CLIENT_ID,
  clientSecret: env.SHOPIFY_CLIENT_SECRET, // also the webhook + app proxy signing secret
  port: Number(env.PORT || 8787),
  dbPath: env.DB_PATH || fileURLToPath(new URL('../data/kala-ops.sqlite', import.meta.url)),
  storefrontUrl: env.STOREFRONT_URL, // https://kala-dev.myshopify.com or custom domain
  slackWebhookUrl: env.SLACK_WEBHOOK_URL,
  fulfillmentWebhookUrl: env.FULFILLMENT_WEBHOOK_URL,
  fulfillmentSigningSecret: env.FULFILLMENT_SIGNING_SECRET,
  resendApiKey: env.RESEND_API_KEY,
  emailFrom: env.EMAIL_FROM || 'Kala <drops@example.com>',
  psiApiKey: env.PSI_API_KEY,
  lowStockThreshold: Number(env.LOW_STOCK_THRESHOLD || 3),
};

export function requireConfig(...keys) {
  const missing = keys.filter((k) => !config[k]);
  if (missing.length) {
    throw new Error(`Missing config: ${missing.join(', ')}. Copy .env.example to .env and fill it in.`);
  }
}

import { signOutbound } from '../shopify/hmac.js';

/**
 * Outbound integrations. Each one is optional: without its env var the
 * message is logged instead, so the service runs locally with zero setup.
 */
export function createNotifier(config, { fetchImpl = fetch, log = console } = {}) {
  async function post(url, body, headers = {}) {
    const res = await fetchImpl(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...headers },
      body,
    });
    if (!res.ok) throw new Error(`${url} responded ${res.status}`);
    return res;
  }

  return {
    /** Slack-compatible incoming webhook (Slack, Discord /slack endpoint, Mattermost). */
    async team(text) {
      if (!config.slackWebhookUrl) return log.info(`[team] ${text}`);
      await post(config.slackWebhookUrl, JSON.stringify({ text }));
    },

    /** Forward an order to a 3PL / ERP. Signed so the receiver can verify origin. */
    async fulfillment(payload) {
      if (!config.fulfillmentWebhookUrl) return log.info(`[3pl] would forward order ${payload.order_number}`);
      const body = JSON.stringify(payload);
      const headers = config.fulfillmentSigningSecret
        ? { 'X-Kala-Signature': signOutbound(body, config.fulfillmentSigningSecret) }
        : {};
      await post(config.fulfillmentWebhookUrl, body, { ...headers, 'Idempotency-Key': String(payload.id) });
    },

    /** Transactional email via Resend's REST API. */
    async email({ to, subject, html }) {
      if (!config.resendApiKey) return log.info(`[email] to=${to} subject="${subject}"`);
      await post('https://api.resend.com/emails', JSON.stringify({ from: config.emailFrom, to, subject, html }), {
        Authorization: `Bearer ${config.resendApiKey}`,
      });
    },
  };
}

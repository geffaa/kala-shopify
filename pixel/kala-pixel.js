/**
 * KALA — custom pixel (Shopify admin → Settings → Customer events → Add custom pixel)
 *
 * Why a custom pixel instead of tags in theme.liquid:
 *  - runs in Shopify's sandbox, off the main thread's critical path (no INP/LCP cost)
 *  - fires on checkout + thank-you pages, which themes can no longer touch
 *  - receives Shopify's standard events, so tracking doesn't break when the theme changes
 *  - consent comes from Shopify's Customer Privacy API, one source of truth
 *
 * Set Permission = "Required" for Marketing + Analytics in the pixel settings so
 * Shopify only loads it after consent in regions that require it. The consent
 * mode updates below handle consent changes during the session.
 *
 * Variables available in the sandbox: analytics, browser, init, api.
 */

const GA4_ID = 'G-XXXXXXXXXX';
const META_PIXEL_ID = '000000000000000';
const DEBUG = false;

const log = (...args) => DEBUG && console.log('[kala-pixel]', ...args);

/* ---------------------------------------------------------------------- */
/* Vendor bootstraps                                                       */
/* ---------------------------------------------------------------------- */

function loadScript(src) {
  const s = document.createElement('script');
  s.async = true;
  s.src = src;
  document.head.appendChild(s);
}

window.dataLayer = window.dataLayer || [];
function gtag() {
  window.dataLayer.push(arguments);
}

function consentState(privacy) {
  const granted = (v) => (v ? 'granted' : 'denied');
  return {
    analytics_storage: granted(privacy?.analyticsProcessingAllowed),
    ad_storage: granted(privacy?.marketingAllowed),
    ad_user_data: granted(privacy?.marketingAllowed),
    ad_personalization: granted(privacy?.marketingAllowed && privacy?.saleOfDataAllowed),
  };
}

gtag('consent', 'default', consentState(init.customerPrivacy));
gtag('js', new Date());
// page_view is sent manually from page_viewed so it carries the real URL
// (the sandbox iframe's own location is not the storefront page).
gtag('config', GA4_ID, { send_page_view: false });
loadScript(`https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`);

!(function (f, b, e, v, n, t, s) {
  if (f.fbq) return;
  n = f.fbq = function () {
    n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
  };
  if (!f._fbq) f._fbq = n;
  n.push = n;
  n.loaded = true;
  n.version = '2.0';
  n.queue = [];
})(window);
if (!init.customerPrivacy?.marketingAllowed) fbq('consent', 'revoke');
fbq('init', META_PIXEL_ID);
loadScript('https://connect.facebook.net/en_US/fbevents.js');

api.customerPrivacy.subscribe('visitorConsentCollected', (event) => {
  const privacy = event.customerPrivacy;
  gtag('consent', 'update', consentState(privacy));
  fbq('consent', privacy.marketingAllowed ? 'grant' : 'revoke');
  log('consent updated', privacy);
});

/* ---------------------------------------------------------------------- */
/* Mapping helpers (pure)                                                  */
/* ---------------------------------------------------------------------- */

const toItem = (variant, quantity = 1, extra = {}) => ({
  item_id: variant?.sku || variant?.product?.id,
  item_name: variant?.product?.title,
  item_variant: variant?.title,
  item_brand: variant?.product?.vendor,
  item_category: variant?.product?.type,
  price: variant?.price?.amount,
  quantity,
  ...extra,
});

const lineItems = (checkout) => (checkout?.lineItems ?? []).map((l) => toItem(l.variant, l.quantity, { discount: l.discountAllocations?.reduce((s, d) => s + d.amount.amount, 0) || 0 }));

const pageParams = (event) => ({
  page_location: event.context?.document?.location?.href,
  page_title: event.context?.document?.title,
  page_referrer: event.context?.document?.referrer,
});

// Same id on browser + server (Conversions API) events lets Meta de-duplicate.
const eventId = (event) => event.id;

/* ---------------------------------------------------------------------- */
/* Standard events                                                         */
/* ---------------------------------------------------------------------- */

analytics.subscribe('page_viewed', (event) => {
  gtag('event', 'page_view', pageParams(event));
  fbq('track', 'PageView', {}, { eventID: eventId(event) });
});

analytics.subscribe('product_viewed', (event) => {
  const v = event.data.productVariant;
  gtag('event', 'view_item', { currency: v.price.currencyCode, value: v.price.amount, items: [toItem(v)], ...pageParams(event) });
  fbq('track', 'ViewContent', { content_ids: [v.sku || v.product.id], content_type: 'product', value: v.price.amount, currency: v.price.currencyCode }, { eventID: eventId(event) });
});

analytics.subscribe('collection_viewed', (event) => {
  const c = event.data.collection;
  gtag('event', 'view_item_list', {
    item_list_id: c.id,
    item_list_name: c.title,
    items: c.productVariants.slice(0, 20).map((v, i) => toItem(v, 1, { index: i })),
  });
});

analytics.subscribe('search_submitted', (event) => {
  const query = event.data.searchResult.query;
  gtag('event', 'search', { search_term: query });
  fbq('track', 'Search', { search_string: query }, { eventID: eventId(event) });
});

analytics.subscribe('product_added_to_cart', (event) => {
  const line = event.data.cartLine;
  if (!line) return;
  const value = line.cost.totalAmount.amount;
  const currency = line.cost.totalAmount.currencyCode;
  gtag('event', 'add_to_cart', { currency, value, items: [toItem(line.merchandise, line.quantity)] });
  fbq('track', 'AddToCart', { content_ids: [line.merchandise.sku || line.merchandise.product.id], content_type: 'product', value, currency }, { eventID: eventId(event) });
});

analytics.subscribe('checkout_started', (event) => {
  const c = event.data.checkout;
  gtag('event', 'begin_checkout', { currency: c.currencyCode, value: c.totalPrice.amount, items: lineItems(c) });
  fbq('track', 'InitiateCheckout', { value: c.totalPrice.amount, currency: c.currencyCode, num_items: c.lineItems.length }, { eventID: eventId(event) });
});

analytics.subscribe('payment_info_submitted', (event) => {
  const c = event.data.checkout;
  gtag('event', 'add_payment_info', { currency: c.currencyCode, value: c.totalPrice.amount, items: lineItems(c) });
  fbq('track', 'AddPaymentInfo', {}, { eventID: eventId(event) });
});

analytics.subscribe('checkout_completed', (event) => {
  const c = event.data.checkout;
  const orderId = c.order?.id;
  gtag('event', 'purchase', {
    transaction_id: orderId, // GA4 de-duplicates purchases on this
    currency: c.currencyCode,
    value: c.subtotalPrice?.amount ?? c.totalPrice.amount,
    tax: c.totalTax?.amount,
    shipping: c.shippingLine?.price?.amount,
    coupon: c.discountApplications?.map((d) => d.title).join(',') || undefined,
    items: lineItems(c),
  });
  fbq(
    'track',
    'Purchase',
    { value: c.totalPrice.amount, currency: c.currencyCode, content_type: 'product', contents: lineItems(c).map((i) => ({ id: i.item_id, quantity: i.quantity })) },
    { eventID: `order_${orderId}` }
  );
});

/* ---------------------------------------------------------------------- */
/* Custom events published by the theme (window.Kala.publish → kala:*)     */
/* ---------------------------------------------------------------------- */

['size_guide_opened', 'quick_add', 'filter_applied', 'back_in_stock_subscribed'].forEach((name) => {
  analytics.subscribe(`kala:${name}`, (event) => {
    gtag('event', name, { ...event.customData, ...pageParams(event) });
    if (name === 'back_in_stock_subscribed') fbq('track', 'Lead', { content_name: 'restock' }, { eventID: eventId(event) });
    log(name, event.customData);
  });
});

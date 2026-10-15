/**
 * Offline preview for the Kala theme.
 *
 * Renders the real theme files with liquidjs plus Shopify-specific tags and
 * filters, against mock data from the seed catalog. Also emulates the
 * endpoints the theme's JS talks to (Ajax Cart API, Section Rendering API,
 * predictive search, recommendations, storefront filtering) so interactions
 * can be tested without a store.
 *
 * It approximates Shopify; a development store via `shopify theme dev` is
 * the source of truth. Run: node preview/server.mjs  →  http://localhost:9393
 */
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { existsSync, readFileSync } from 'node:fs';
import { extname } from 'node:path';
import { Liquid, Tag, Hash, Drop } from 'liquidjs';
import { byHandle, collections, menus, products, shopImages, withSelection } from './data.mjs';

const root = new URL('..', import.meta.url);
const themeDir = new URL('theme/', root);
const PORT = Number(process.env.PORT || 9393);

const read = (p) => readFile(new URL(p, themeDir), 'utf8');
const locale = JSON.parse(readFileSync(new URL('locales/en.default.json', themeDir), 'utf8'));
const settingsSchema = JSON.parse(readFileSync(new URL('config/settings_schema.json', themeDir), 'utf8'));

/* ---------------------------------------------------------------------- */
/* Settings                                                                */
/* ---------------------------------------------------------------------- */

class Color extends Drop {
  constructor(hex) {
    super();
    this.hex = hex;
    const n = parseInt(hex.slice(1), 16);
    this.red = (n >> 16) & 255;
    this.green = (n >> 8) & 255;
    this.blue = n & 255;
  }
  valueOf() {
    return this.hex;
  }
  toString() {
    return this.hex;
  }
}

function resolveSetting(type, value) {
  if (value == null || value === '') return null;
  switch (type) {
    case 'color':
      return new Color(value);
    case 'collection':
      return collections[value] ?? null;
    case 'product':
      return byHandle[value] ? withSelection(byHandle[value]) : null;
    case 'image_picker':
      return shopImages[String(value).replace('shopify://shop_images/', '')] ?? null;
    case 'link_list':
      return menus[value] ?? { links: [] };
    case 'url':
      return String(value).replace('shopify://collections/', '/collections/').replace('shopify://products/', '/products/');
    default:
      return value;
  }
}

function resolveSettings(schemaSettings = [], values = {}) {
  const out = {};
  for (const s of schemaSettings) {
    if (!s.id) continue;
    out[s.id] = resolveSetting(s.type, values[s.id] ?? s.default);
  }
  return out;
}

const themeSettings = resolveSettings(
  settingsSchema.flatMap((g) => g.settings ?? []),
  JSON.parse(readFileSync(new URL('config/settings_data.json', themeDir), 'utf8')).presets.Default
);

/* ---------------------------------------------------------------------- */
/* Money, translation                                                      */
/* ---------------------------------------------------------------------- */

const fmt = (cents) => new Intl.NumberFormat('id-ID', { maximumFractionDigits: 0 }).format(Math.round(Number(cents) / 100));
const money = (cents) => `Rp ${fmt(cents)}`;

const kw = (args) => Object.fromEntries(args.filter(Array.isArray));

function translate(key, args) {
  const vars = kw(args);
  let v = key.split('.').reduce((o, k) => o?.[k], locale);
  if (v && typeof v === 'object') v = vars.count === 1 ? v.one : v.other;
  if (typeof v !== 'string') return `translation missing: ${key}`;
  return v.replace(/\{\{\s*(\w+)\s*\}\}/g, (_, k) => (vars[k] ?? '').toString());
}

/* ---------------------------------------------------------------------- */
/* Engine                                                                  */
/* ---------------------------------------------------------------------- */

const engine = new Liquid({
  root: fileURLToPathSafe(themeDir),
  partials: fileURLToPathSafe(new URL('snippets/', themeDir)),
  extname: '.liquid',
  strictFilters: true,
  jsTruthy: false,
});

function fileURLToPathSafe(u) {
  return decodeURIComponent(u.pathname);
}

class ImageUrl {
  constructor(img, width) {
    this.img = img;
    this.width = width;
  }
  toString() {
    return `${this.img.src}${this.width ? `?width=${this.width}` : ''}`;
  }
}

const f = {
  t: (key, ...args) => translate(key, args),
  money,
  money_with_currency: (c) => `${money(c)} IDR`,
  money_without_trailing_zeros: money,
  money_without_currency: fmt,
  asset_url: (name) => `/assets/${name}`,
  stylesheet_tag: (url) => `<link href="${url}" rel="stylesheet" type="text/css" media="all">`,
  preload_tag: (url, ...args) => {
    const a = kw(args);
    return `<link href="${url}" rel="preload" as="${a.as}" type="${a.type ?? ''}" crossorigin="${a.crossorigin ?? ''}">`;
  },
  image_url: (img, ...args) => {
    if (!img) return '';
    const source = img.preview_image ?? img;
    return new ImageUrl(source, kw(args).width);
  },
  image_tag: (url, ...args) => {
    if (!url) return '';
    const a = kw(args);
    const img = url.img ?? {};
    const attrs = { src: String(url), alt: a.alt ?? img.alt ?? '', width: img.width, height: img.height };
    if (a.widths) attrs.srcset = String(a.widths).split(',').map((w) => `${img.src}?width=${w.trim()} ${w.trim()}w`).join(', ');
    for (const [k, v] of Object.entries(a)) if (!['widths', 'preload', 'alt'].includes(k)) attrs[k] = v;
    return `<img ${Object.entries(attrs).filter(([, v]) => v !== undefined && v !== null).map(([k, v]) => `${k}="${String(v).replace(/"/g, '&quot;')}"`).join(' ')}>`;
  },
  placeholder_svg_tag: (name, cls = '') => `<svg class="${cls}" viewBox="0 0 400 500" preserveAspectRatio="xMidYMid slice"><rect width="400" height="500"/></svg>`,
  structured_data: () => '{}',
  payment_button: () => '',
  default_pagination: () => '',
  default_errors: () => '',
  video_tag: () => '',
  external_video_tag: () => '',
  handle: (s) => String(s ?? '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
};
for (const [name, fn] of Object.entries(f)) engine.registerFilter(name, fn);

/* {% schema %} — consumed, outputs nothing */
engine.registerTag(
  'schema',
  class extends Tag {
    constructor(token, remain, liquid) {
      super(token, remain, liquid);
      while (remain.length) {
        const t = remain.shift();
        if (t.name === 'endschema') return;
      }
    }
    *render() {}
  }
);

/* {% form 'type', obj, id: 'x' %}…{% endform %} */
const FORM_ACTIONS = { product: '/cart/add', customer: '/contact#footer-signup', localization: '/localization', storefront_password: '/password' };
engine.registerTag(
  'form',
  class extends Tag {
    constructor(token, remain, liquid) {
      super(token, remain, liquid);
      const m = token.args.match(/^\s*'([^']+)'\s*(?:,\s*([a-z_.]+)(?=\s*(?:,|$)))?\s*,?(.*)$/s);
      this.type = m[1];
      this.hash = new Hash(m[3] ?? '');
      this.tpls = [];
      const stream = liquid.parser.parseStream(remain).on('tag:endform', () => stream.stop()).on('template', (tpl) => this.tpls.push(tpl)).on('end', () => {
        throw new Error('form not closed');
      });
      stream.start();
    }
    *render(ctx, emitter) {
      const attrs = yield this.hash.render(ctx);
      const extra = Object.entries(attrs).map(([k, v]) => `${k}="${v}"`).join(' ');
      emitter.write(`<form method="post" action="${FORM_ACTIONS[this.type] ?? '/'}" accept-charset="UTF-8" ${extra}><input type="hidden" name="form_type" value="${this.type}">`);
      ctx.push({ form: { errors: null, 'posted_successfully?': false } });
      yield this.liquid.renderer.renderTemplates(this.tpls, ctx, emitter);
      ctx.pop();
      emitter.write('</form>');
    }
  }
);

/* {% paginate x by n %}…{% endpaginate %} — single page in preview */
engine.registerTag(
  'paginate',
  class extends Tag {
    constructor(token, remain, liquid) {
      super(token, remain, liquid);
      const m = token.args.match(/^\s*([\w.]+)\s+by\s+([\w.]+)/);
      this.collectionPath = m[1];
      this.tpls = [];
      const stream = liquid.parser.parseStream(remain).on('tag:endpaginate', () => stream.stop()).on('template', (tpl) => this.tpls.push(tpl));
      stream.start();
    }
    *render(ctx, emitter) {
      const list = yield this.liquid.evalValue(this.collectionPath, ctx);
      const n = list?.length ?? 0;
      ctx.push({ paginate: { current_page: 1, current_offset: 0, items: n, pages: 1, next: null, previous: null } });
      yield this.liquid.renderer.renderTemplates(this.tpls, ctx, emitter);
      ctx.pop();
    }
  }
);

/* ---------------------------------------------------------------------- */
/* Sections                                                                */
/* ---------------------------------------------------------------------- */

async function loadSection(type) {
  const src = await read(`sections/${type}.liquid`);
  const match = src.match(/{%-?\s*schema\s*-?%}([\s\S]*?){%-?\s*endschema\s*-?%}/);
  const schema = match ? JSON.parse(match[1]) : {};
  return { src, schema };
}

async function renderSection(type, data = {}, sectionId = type, globals, index = 1) {
  const { src, schema } = await loadSection(type);
  const blockSchemas = Object.fromEntries((schema.blocks ?? []).map((b) => [b.type, b]));
  const order = data.block_order ?? Object.keys(data.blocks ?? {});
  const blocks = order.map((bid) => {
    const b = data.blocks[bid];
    return { id: bid, type: b.type, settings: resolveSettings(blockSchemas[b.type]?.settings, b.settings), shopify_attributes: '' };
  });
  const section = { id: sectionId, index, settings: resolveSettings(schema.settings, data.settings), blocks };
  const html = await engine.parseAndRender(src, { section }, { globals });
  const tag = schema.tag ?? 'div';
  return `<${tag} id="shopify-section-${sectionId}" class="shopify-section ${schema.class ?? ''}">${html}</${tag}>`;
}

async function renderGroup(name, globals) {
  const group = JSON.parse(await read(`sections/${name}.json`));
  let html = '';
  for (const key of group.order) {
    html += await renderSection(group.sections[key].type, group.sections[key], `sections--1__${key}`, globals);
  }
  return html;
}

engine.registerTag(
  'sections',
  class extends Tag {
    constructor(token, remain, liquid) {
      super(token, remain, liquid);
      this.name = token.args.trim().replace(/['"]/g, '');
    }
    *render(ctx, emitter) {
      emitter.write(yield renderGroup(this.name, ctx.getAll()));
    }
  }
);
engine.registerTag(
  'section',
  class extends Tag {
    constructor(token, remain, liquid) {
      super(token, remain, liquid);
      this.name = token.args.trim().replace(/['"]/g, '');
    }
    *render(ctx, emitter) {
      emitter.write(yield renderSection(this.name, {}, this.name, ctx.getAll()));
    }
  }
);

/* ---------------------------------------------------------------------- */
/* Cart                                                                    */
/* ---------------------------------------------------------------------- */

const variantIndex = new Map();
for (const p of products) for (const v of p.variants) variantIndex.set(String(v.id), { product: p, variant: v });

let cartLines = [];
let cartNote = '';

function cartObject() {
  const items = cartLines.map((l, i) => {
    const { product, variant } = variantIndex.get(String(l.id));
    const names = product.has_only_default_variant ? ['Title'] : product.options;
    return {
      key: `${variant.id}:${i}`,
      id: variant.id,
      url: `${product.url}?variant=${variant.id}`,
      image: variant.featured_media ?? product.featured_media,
      product,
      variant,
      quantity: l.quantity,
      options_with_values: names.map((name, j) => ({ name, value: variant.options[j] })),
      properties: {},
      line_level_discount_allocations: [],
      original_line_price: (variant.compare_at_price ?? variant.price) * l.quantity,
      final_line_price: variant.price * l.quantity,
    };
  });
  const total = items.reduce((s, i) => s + i.final_line_price, 0);
  return {
    items,
    item_count: items.reduce((s, i) => s + i.quantity, 0),
    total_price: total,
    note: cartNote,
    currency: { iso_code: 'IDR', symbol: 'Rp' },
    cart_level_discount_applications: [],
  };
}

function addToCart(id, quantity = 1) {
  const entry = variantIndex.get(String(id));
  if (!entry) throw Object.assign(new Error('Variant not found'), { status: 404 });
  const line = cartLines.find((l) => String(l.id) === String(id));
  const want = (line?.quantity ?? 0) + quantity;
  if (want > entry.variant.inventory_quantity) {
    throw Object.assign(new Error(`You can only add ${entry.variant.inventory_quantity} of ${entry.product.title} to the cart.`), { status: 422 });
  }
  if (line) line.quantity = want;
  else cartLines.push({ id: Number(id), quantity });
}

/* ---------------------------------------------------------------------- */
/* Collections: filtering + sorting                                       */
/* ---------------------------------------------------------------------- */

const SORT_OPTIONS = [
  { value: 'manual', name: 'Featured' },
  { value: 'price-ascending', name: 'Price, low to high' },
  { value: 'price-descending', name: 'Price, high to low' },
  { value: 'title-ascending', name: 'Alphabetically, A–Z' },
];

function filteredCollection(c, params) {
  const sizes = params.getAll('filter.v.option.size');
  const inStock = params.get('filter.v.availability') === '1';
  const gte = params.get('filter.v.price.gte');
  const lte = params.get('filter.v.price.lte');
  const sort = params.get('sort_by') || 'manual';
  const base = `${c.url}`;
  const urlWithout = (key, value) => {
    const p = new URLSearchParams(params);
    const rest = p.getAll(key).filter((v) => value === undefined || v !== value);
    p.delete(key);
    rest.forEach((v) => p.append(key, v));
    return `${base}?${p}`;
  };

  let list = c.products.filter((p) => {
    if (inStock && !p.available) return false;
    if (sizes.length && !p.variants.some((v) => v.options.some((o) => sizes.includes(o)))) return false;
    if (gte && p.price_min < Number(gte) * 100) return false;
    if (lte && p.price_min > Number(lte) * 100) return false;
    return true;
  });
  if (sort === 'price-ascending') list = [...list].sort((a, b) => a.price_min - b.price_min);
  if (sort === 'price-descending') list = [...list].sort((a, b) => b.price_min - a.price_min);
  if (sort === 'title-ascending') list = [...list].sort((a, b) => a.title.localeCompare(b.title));

  const allSizes = [...new Set(c.products.flatMap((p) => (p.options.includes('Size') ? p.variants.map((v) => v.options[p.options.indexOf('Size')]) : [])))];
  const sizeValues = allSizes.map((s) => ({
    label: s,
    value: s,
    param_name: 'filter.v.option.size',
    count: c.products.filter((p) => p.variants.some((v) => v.available && v.options.includes(s))).length,
    active: sizes.includes(s),
    url_to_remove: urlWithout('filter.v.option.size', s),
  }));
  const availValue = {
    label: 'In stock',
    value: '1',
    param_name: 'filter.v.availability',
    count: c.products.filter((p) => p.available).length,
    active: inStock,
    url_to_remove: urlWithout('filter.v.availability'),
  };
  const filters = [
    { label: 'Availability', type: 'boolean', param_name: 'filter.v.availability', values: [availValue], active_values: inStock ? [availValue] : [] },
    { label: 'Size', type: 'list', presentation: 'text', param_name: 'filter.v.option.size', values: sizeValues, active_values: sizeValues.filter((v) => v.active) },
    {
      label: 'Price',
      type: 'price_range',
      param_name: 'filter.v.price',
      min_value: { param_name: 'filter.v.price.gte', value: gte ? Number(gte) * 100 : null },
      max_value: { param_name: 'filter.v.price.lte', value: lte ? Number(lte) * 100 : null },
      range_max: Math.max(...c.products.map((p) => p.price_max)),
      active_values: [],
      url_to_remove: (() => {
        const p = new URLSearchParams(params);
        p.delete('filter.v.price.gte');
        p.delete('filter.v.price.lte');
        return `${base}?${p}`;
      })(),
    },
  ];
  return { ...c, products: list, products_count: list.length, filters, sort_options: SORT_OPTIONS, sort_by: sort, default_sort_by: 'manual' };
}

/* ---------------------------------------------------------------------- */
/* Routing                                                                 */
/* ---------------------------------------------------------------------- */

const routes = {
  root_url: '/',
  cart_url: '/cart',
  cart_add_url: '/cart/add',
  cart_change_url: '/cart/change',
  search_url: '/search',
  predictive_search_url: '/search/suggest',
  product_recommendations_url: '/recommendations/products',
  all_products_collection_url: '/collections/all',
  account_url: '/account',
  collections_url: '/collections',
};

function globalsFor(url, extra = {}) {
  return {
    settings: themeSettings,
    shop: { name: 'Kala', currency: 'IDR', customer_accounts_enabled: true, description: 'Small-run clothing from Bandung.', password_message: '' },
    cart: cartObject(),
    routes,
    request: { locale: { iso_code: 'en' }, page_type: extra.template?.name ?? 'index', design_mode: false, origin: `http://localhost:${PORT}` },
    localization: {
      country: { iso_code: 'ID' },
      available_countries: [
        { iso_code: 'ID', name: 'Indonesia', currency: { iso_code: 'IDR' } },
        { iso_code: 'SG', name: 'Singapore', currency: { iso_code: 'SGD' } },
        { iso_code: 'MY', name: 'Malaysia', currency: { iso_code: 'MYR' } },
      ],
    },
    canonical_url: url.href,
    page_title: extra.page_title ?? 'Kala',
    page_description: 'Small-run clothing from Bandung.',
    content_for_header: '<script>window.Shopify = { analytics: { publish(n, d) { console.log("[analytics]", n, d) } } }</script>',
    current_page: 1,
    collections: Object.values(collections).filter((c) => c.handle !== 'all'),
    ...extra,
  };
}

async function renderTemplate(name, url, extra = {}) {
  const template = JSON.parse(await read(`templates/${name}.json`));
  const globals = globalsFor(url, { template: { name }, ...extra });
  const sectionId = url.searchParams.get('section_id');

  let content = '';
  let i = 0;
  for (const key of template.order) {
    const id = `template--1__${key}`;
    if (sectionId && sectionId !== id) continue;
    content += await renderSection(template.sections[key].type, template.sections[key], id, globals, ++i);
  }
  if (sectionId) return content;
  const layout = await read(`layout/${template.layout ?? 'theme'}.liquid`);
  return engine.parseAndRender(layout, {}, { globals: { ...globals, content_for_layout: content } });
}

async function renderSectionsParam(ids, url) {
  const out = {};
  for (const id of ids) {
    if (id === 'cart-drawer') out[id] = await renderSection('cart-drawer', {}, 'cart-drawer', globalsFor(url));
    else if (id.startsWith('template--1__')) out[id] = await renderTemplate('cart', new URL(`/cart?section_id=${id}`, url));
  }
  return out;
}

const MIME = { '.css': 'text/css', '.js': 'text/javascript', '.png': 'image/png', '.woff2': 'font/woff2', '.svg': 'image/svg+xml' };

async function body(req) {
  const chunks = [];
  for await (const c of req) chunks.push(c);
  const raw = Buffer.concat(chunks).toString();
  if ((req.headers['content-type'] || '').includes('application/json')) return JSON.parse(raw || '{}');
  if ((req.headers['content-type'] || '').includes('multipart/form-data')) {
    const out = {};
    for (const part of raw.split(/------\S+/)) {
      const m = part.match(/name="([^"]+)"\r\n\r\n([\s\S]*?)\r\n$/);
      if (m) out[m[1]] = m[2];
    }
    return out;
  }
  return Object.fromEntries(new URLSearchParams(raw));
}

const server = createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  const path = url.pathname;
  const send = (status, content, type = 'text/html; charset=utf-8') => {
    res.writeHead(status, { 'Content-Type': type });
    res.end(content);
  };
  const json = (status, data) => send(status, JSON.stringify(data), 'application/json');

  try {
    if (path === '/favicon.ico') return send(204, '');
    if (path.startsWith('/assets/')) {
      const file = new URL(`assets/${path.slice(8)}`, themeDir);
      return existsSync(file) ? send(200, await readFile(file), MIME[extname(path)]) : send(404, 'not found');
    }
    if (path.startsWith('/img/')) {
      const file = new URL(`design/out/${path.slice(5)}`, root);
      return existsSync(file) ? send(200, await readFile(file), 'image/png') : send(404, 'not found');
    }

    if (req.method === 'POST' && path === '/cart/add.js') {
      const b = await body(req);
      const items = b.items ?? [{ id: b.id, quantity: Number(b.quantity || 1) }];
      try {
        items.forEach((i) => addToCart(i.id, Number(i.quantity || 1)));
      } catch (e) {
        return json(e.status ?? 422, { status: e.status ?? 422, message: 'Cart Error', description: e.message });
      }
      const ids = Array.isArray(b.sections) ? b.sections : String(b.sections || '').split(',').filter(Boolean);
      return json(200, { items, sections: await renderSectionsParam(ids, url) });
    }
    if (req.method === 'POST' && path === '/cart/change.js') {
      const b = await body(req);
      const idx = Number(b.line) - 1;
      if (b.quantity === 0) cartLines.splice(idx, 1);
      else {
        const { variant } = variantIndex.get(String(cartLines[idx].id));
        if (b.quantity > variant.inventory_quantity) return json(422, { status: 422, message: 'Cart Error', description: `Only ${variant.inventory_quantity} left.` });
        cartLines[idx].quantity = b.quantity;
      }
      const cart = cartObject();
      return json(200, { item_count: cart.item_count, total_price: cart.total_price, sections: await renderSectionsParam(b.sections ?? [], url) });
    }
    if (req.method === 'POST' && path === '/cart/update.js') {
      cartNote = (await body(req)).note ?? cartNote;
      return json(200, { note: cartNote });
    }
    if (req.method === 'POST' && path === '/apps/kala/back-in-stock') {
      const b = await body(req);
      return /@/.test(b.email ?? '') ? json(201, { message: `Noted. We'll email ${b.email} once if it comes back.` }) : json(422, { error: 'Please enter a valid email.' });
    }

    if (path === '/search/suggest') {
      const q = (url.searchParams.get('q') || '').toLowerCase();
      const match = products.filter((p) => p.title.toLowerCase().includes(q) || p.type.toLowerCase().includes(q));
      const html = await renderSection('predictive-search', {}, 'predictive-search', {
        ...globalsFor(url),
        predictive_search: {
          performed: true,
          terms: url.searchParams.get('q'),
          resources: {
            products: match.slice(0, 6),
            collections: Object.values(collections).filter((c) => c.title.toLowerCase().includes(q)),
            queries: q ? [{ text: q, styled_text: `<mark>${q}</mark>`, url: `/search?q=${q}` }] : [],
          },
        },
      });
      return send(200, html);
    }
    if (path === '/recommendations/products') {
      const product = products.find((p) => String(p.id) === url.searchParams.get('product_id'));
      const recs = products.filter((p) => p !== product && p.collection_handle === product?.collection_handle && p.available).slice(0, 4);
      const html = await renderSection('product-recommendations', { settings: {} }, url.searchParams.get('section_id'), {
        ...globalsFor(url),
        product,
        recommendations: { performed: true, products: recs, products_count: recs.length },
      });
      return send(200, html);
    }

    let m;
    if (path === '/' || path === '') return send(200, await renderTemplate('index', url));
    if (path === '/password') return send(200, await renderTemplate('password', url, { template: { name: 'password' } }));
    if ((m = path.match(/^\/products\/([\w-]+)/))) {
      const p = byHandle[m[1]];
      if (!p) return send(404, await renderTemplate('404', url));
      const product = withSelection(p, url.searchParams.get('variant'));
      return send(200, await renderTemplate('product', url, { product, page_title: p.title, template: { name: 'product' } }));
    }
    if (path === '/collections') return send(200, await renderTemplate('list-collections', url, { template: { name: 'list-collections' } }));
    if ((m = path.match(/^\/collections\/([\w-]+)/))) {
      const c = collections[m[1]];
      if (!c) return send(404, await renderTemplate('404', url));
      const collection = filteredCollection(c, url.searchParams);
      return send(200, await renderTemplate('collection', url, { collection, page_title: c.title, template: { name: 'collection' } }));
    }
    if (path === '/cart') return send(200, await renderTemplate('cart', url, { template: { name: 'cart' } }));
    if (path === '/search') {
      const q = (url.searchParams.get('q') || '').toLowerCase();
      const results = q ? products.filter((p) => p.title.toLowerCase().includes(q)).map((p) => ({ ...p, object_type: 'product' })) : [];
      return send(
        200,
        await renderTemplate('search', url, {
          template: { name: 'search' },
          search: { performed: Boolean(q), terms: q, results, results_count: results.length, filters: [], sort_options: SORT_OPTIONS, sort_by: 'relevance' },
        })
      );
    }
    return send(404, await renderTemplate('404', url, { template: { name: '404' } }));
  } catch (e) {
    console.error(e);
    send(500, `<pre>${String(e.stack).replace(/</g, '&lt;')}</pre>`);
  }
});

server.listen(PORT, () => console.log(`Kala preview → http://localhost:${PORT}`));

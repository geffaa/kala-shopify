/**
 * Mock storefront data built from ops/src/seed/catalog.json, shaped like the
 * Liquid objects the theme reads. Only what the theme uses is modelled.
 */
import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { Drop } from 'liquidjs';

const root = new URL('..', import.meta.url);
const catalog = JSON.parse(await readFile(new URL('ops/src/seed/catalog.json', root), 'utf8'));
const imgDir = new URL('design/out/', root);

let nextId = 1000;
const id = () => nextId++;

export function image(file, alt = '', w = 1600, h = 2000) {
  return { src: `/img/${file}`, width: w, height: h, aspect_ratio: w / h, alt, id: id() };
}

class OptionValue extends Drop {
  constructor(name, { available = true, selected = false } = {}) {
    super();
    this.name = name;
    this.available = available;
    this.selected = selected;
    this.swatch = null;
  }
  valueOf() {
    return this.name;
  }
  toString() {
    return this.name;
  }
}

class Metafield extends Drop {
  constructor(value) {
    super();
    this.value = value;
  }
  valueOf() {
    return typeof this.value === 'string' ? this.value : JSON.stringify(this.value);
  }
  toString() {
    return this.valueOf();
  }
}

function combos(options) {
  return Object.values(options).reduce((acc, values) => acc.flatMap((c) => values.map((v) => [...c, v])), [[]]);
}

export const products = [];
export const byHandle = {};

for (const p of catalog.products) {
  const names = Object.keys(p.options);
  const hasOptions = names.length > 0;
  const media = [];
  for (const view of ['front', 'back', 'detail']) {
    const f = `${p.handle}-${view}.png`;
    if (existsSync(new URL(f, imgDir))) media.push(image(f, `${p.title}, ${view} view`));
  }
  const colorMedia = {};
  if (p.colors) {
    Object.keys(p.colors).forEach((c, i) => {
      if (i === 0) return (colorMedia[c] = media[0]);
      const f = `${p.handle}-front-${c.toLowerCase()}.png`;
      const m = image(f, `${p.title} in ${c}`);
      media.push(m);
      colorMedia[c] = m;
    });
  }
  media.forEach((m) => Object.assign(m, { media_type: 'image', preview_image: m }));

  const variants = combos(p.options).map((combo) => {
    const title = hasOptions ? combo.join(' / ') : 'Default Title';
    const qty = p.stock?.[title] ?? p.stockOverrides?.[title] ?? p.stockDefault ?? 0;
    const color = names.indexOf('Color') >= 0 ? combo[names.indexOf('Color')] : null;
    return {
      id: id(),
      title,
      options: hasOptions ? combo : ['Default Title'],
      option1: combo[0],
      price: p.price * 100,
      compare_at_price: p.compareAt ? p.compareAt * 100 : null,
      inventory_quantity: qty,
      inventory_management: 'shopify',
      inventory_policy: 'deny',
      available: qty > 0,
      sku: `KALA-${p.drop_code}`,
      featured_media: color ? colorMedia[color] : null,
    };
  });

  const prices = variants.map((v) => v.price);
  const product = {
    id: id(),
    handle: p.handle,
    title: p.title,
    url: `/products/${p.handle}`,
    vendor: 'Kala',
    type: p.type,
    description: p.description,
    available: variants.some((v) => v.available),
    price: Math.min(...prices),
    price_min: Math.min(...prices),
    price_max: Math.max(...prices),
    price_varies: new Set(prices).size > 1,
    compare_at_price_min: p.compareAt ? p.compareAt * 100 : 0,
    media,
    featured_media: media[0],
    featured_image: media[0],
    images: media,
    variants,
    has_only_default_variant: !hasOptions,
    options: hasOptions ? names : ['Title'],
    collection_handle: p.collection,
    pairs: p.pairs ?? [],
    metafields: {
      kala: {
        drop_code: new Metafield(p.drop_code),
        fit_note: p.fit_note ? new Metafield(p.fit_note) : null,
        material: p.material ? new Metafield(p.material) : null,
        care: p.care ? new Metafield(p.care) : null,
        origin: p.origin ? new Metafield(p.origin) : null,
        size_chart: p.sizeChart ? new Metafield(catalog.sizeCharts[p.sizeChart]) : null,
        complementary: null,
      },
    },
    _colors: p.colors,
  };
  products.push(product);
  byHandle[p.handle] = product;
}
for (const p of products) {
  if (p.pairs.length) p.metafields.kala.complementary = new Metafield(p.pairs.map((h) => byHandle[h]).filter(Boolean));
}

/** Liquid-facing product with selection-dependent fields resolved. */
export function withSelection(product, variantId) {
  const selected = product.variants.find((v) => String(v.id) === String(variantId)) ?? product.variants.find((v) => v.available) ?? product.variants[0];
  const names = product.has_only_default_variant ? ['Title'] : product.options;
  const options_with_values = names.map((name, i) => {
    const values = [...new Set(product.variants.map((v) => v.options[i]))].map((value) => {
      const available = product.variants.some((v) => v.available && v.options[i] === value && v.options.every((o, j) => j === i || o === selected.options[j]));
      const ov = new OptionValue(value, { available, selected: selected.options[i] === value });
      if (product._colors && name === 'Color') ov.swatch = { color: product._colors[value] };
      return ov;
    });
    return { name, position: i + 1, values, selected_value: selected.options[i] };
  });
  return { ...product, selected_or_first_available_variant: selected, selected_variant: selected, options_with_values, collections: [collections[product.collection_handle]] };
}

export const collections = {};
for (const c of catalog.collections) {
  const list = products.filter((p) => p.collection_handle === c.handle);
  const cover = `knolling-${c.handle.split('-')[1]}.png`;
  collections[c.handle] = {
    id: id(),
    handle: c.handle,
    title: c.title,
    url: `/collections/${c.handle}`,
    description: c.description,
    image: image(cover, c.title),
    featured_image: image(cover, c.title),
    products: list,
    products_count: list.length,
  };
}
collections.all = { id: id(), handle: 'all', title: 'All products', url: '/collections/all', description: '', products, products_count: products.length };

export const shopImages = {
  'hero-07.png': image('hero-07.png', 'Kemeja Kerja technical drawing', 1600, 1800),
  'look-07.png': image('look-07.png', 'Look 07 flat-lay', 1600, 1200),
};

export const menus = {
  'main-menu': {
    links: [
      { title: 'Drop 07', url: '/collections/drop-07-kemarau' },
      { title: 'Shop all', url: '/collections/all' },
      { title: 'Archive', url: '/collections' },
      { title: 'Journal', url: '/blogs/journal' },
    ],
  },
  footer: {
    links: [
      { title: 'Shipping', url: '/pages/shipping' },
      { title: 'Returns & exchanges', url: '/pages/returns' },
      { title: 'Size guide', url: '/pages/size-guide' },
      { title: 'Contact', url: '/pages/contact' },
    ],
  },
};

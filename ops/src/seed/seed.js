import { readFile, stat } from 'node:fs/promises';
import { basename, join } from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * Seeds a development store with the Kala catalog through the Admin GraphQL API:
 * metafield definitions → images (staged uploads) → products (productSet,
 * idempotent by handle) → collections → Online Store publication → product
 * references for "pairs with". Safe to re-run.
 */

const DEFINITIONS = [
  ['drop_code', 'Drop code', 'single_line_text_field'],
  ['fit_note', 'Fit note', 'multi_line_text_field'],
  ['material', 'Material', 'single_line_text_field'],
  ['care', 'Care', 'single_line_text_field'],
  ['origin', 'Origin', 'single_line_text_field'],
  ['size_chart', 'Size chart', 'json'],
  ['complementary', 'Pairs with', 'list.product_reference'],
];

const M = {
  definition: `mutation($d: MetafieldDefinitionInput!) {
    metafieldDefinitionCreate(definition: $d) { createdDefinition { id } userErrors { field message code } }
  }`,
  staged: `mutation($input: [StagedUploadInput!]!) {
    stagedUploadsCreate(input: $input) {
      stagedTargets { url resourceUrl parameters { name value } }
      userErrors { field message }
    }
  }`,
  productSet: `mutation($input: ProductSetInput!, $identifier: ProductSetIdentifiers) {
    productSet(input: $input, identifier: $identifier, synchronous: true) {
      product { id handle }
      userErrors { field message code }
    }
  }`,
  collectionCreate: `mutation($input: CollectionInput!) {
    collectionCreate(input: $input) { collection { id } userErrors { field message } }
  }`,
  collectionAdd: `mutation($id: ID!, $productIds: [ID!]!) {
    collectionAddProducts(id: $id, productIds: $productIds) { userErrors { field message } }
  }`,
  publish: `mutation($id: ID!, $input: [PublicationInput!]!) {
    publishablePublish(id: $id, input: $input) { userErrors { field message } }
  }`,
  fileCreate: `mutation($files: [FileCreateInput!]!) {
    fileCreate(files: $files) { files { id } userErrors { field message } }
  }`,
  metafieldsSet: `mutation($metafields: [MetafieldsSetInput!]!) {
    metafieldsSet(metafields: $metafields) { userErrors { field message } }
  }`,
};

const Q = {
  context: `query {
    locations(first: 1) { nodes { id name } }
    publications(first: 20) { nodes { id name } }
  }`,
  collection: `query($handle: String!) { collectionByIdentifier(identifier: { handle: $handle }) { id } }`,
};

/** Cartesian product of option values → [['Bone','S'], ['Bone','M'], …] */
export function combinations(options) {
  const entries = Object.entries(options);
  if (!entries.length) return [[]];
  return entries.reduce((acc, [, values]) => acc.flatMap((combo) => values.map((v) => [...combo, v])), [[]]);
}

/** Pure: catalog entry → ProductSetInput. */
export function buildProductInput(p, { locationId, images = [], colorImages = {}, sizeCharts = {} }) {
  const optionNames = Object.keys(p.options);
  const colorIndex = optionNames.indexOf('Color');
  const hasOptions = optionNames.length > 0;
  const productOptions = hasOptions
    ? optionNames.map((name, i) => ({ name, position: i + 1, values: p.options[name].map((v) => ({ name: v })) }))
    : [{ name: 'Title', position: 1, values: [{ name: 'Default Title' }] }];

  const variants = combinations(p.options).map((combo, i) => {
    const title = hasOptions ? combo.join(' / ') : 'Default Title';
    const quantity =
      p.stock?.[title] ?? p.stockOverrides?.[title] ?? p.stockDefault ?? p.stock?.[combo.at(-1)] ?? 0;
    return {
      optionValues: hasOptions
        ? combo.map((value, j) => ({ optionName: optionNames[j], name: value }))
        : [{ optionName: 'Title', name: 'Default Title' }],
      price: String(p.price),
      compareAtPrice: p.compareAt ? String(p.compareAt) : null,
      sku: `KALA-${p.drop_code.replace('.', '')}-${String(i + 1).padStart(2, '0')}`,
      inventoryPolicy: 'DENY',
      inventoryItem: { tracked: true, measurement: { weight: { value: p.weight ?? 0.3, unit: 'KILOGRAMS' } } },
      inventoryQuantities: [{ locationId, name: 'available', quantity }],
      // Variant media must also be listed in the product's files; matched by source URL.
      ...(colorIndex >= 0 && colorImages[combo[colorIndex]]
        ? { file: { originalSource: colorImages[combo[colorIndex]].url, alt: colorImages[combo[colorIndex]].alt, contentType: 'IMAGE' } }
        : {}),
    };
  });

  const metafields = [
    ['drop_code', 'single_line_text_field', p.drop_code],
    ['fit_note', 'multi_line_text_field', p.fit_note],
    ['material', 'single_line_text_field', p.material],
    ['care', 'single_line_text_field', p.care],
    ['origin', 'single_line_text_field', p.origin],
    ['size_chart', 'json', p.sizeChart ? JSON.stringify(sizeCharts[p.sizeChart]) : null],
  ]
    .filter(([, , value]) => value)
    .map(([key, type, value]) => ({ namespace: 'kala', key, type, value }));

  return {
    title: p.title,
    handle: p.handle,
    descriptionHtml: p.description,
    vendor: 'Kala',
    productType: p.type,
    status: 'ACTIVE',
    tags: [p.collection, `drop-${p.drop_code.split('.')[0]}`],
    seo: { title: `${p.title} — Kala`, description: p.description.replace(/<[^>]+>/g, '').slice(0, 155) },
    productOptions,
    variants,
    metafields,
    files: [...images, ...Object.values(colorImages).filter((img) => !images.includes(img))].map((img) => ({
      originalSource: img.url,
      alt: img.alt,
      contentType: 'IMAGE',
    })),
  };
}

async function uploadImage(admin, path) {
  const bytes = await readFile(path);
  const filename = basename(path);
  const data = await admin.graphql(M.staged, {
    input: [{ filename, mimeType: 'image/png', resource: 'IMAGE', httpMethod: 'POST', fileSize: String(bytes.length) }],
  });
  const { stagedTargets } = admin.assertNoUserErrors(data.stagedUploadsCreate, 'stagedUploadsCreate');
  const target = stagedTargets[0];
  const form = new FormData();
  target.parameters.forEach(({ name, value }) => form.append(name, value));
  form.append('file', new Blob([bytes], { type: 'image/png' }), filename);
  const res = await fetch(target.url, { method: 'POST', body: form });
  if (!res.ok) throw new Error(`Upload of ${filename} failed: ${res.status}`);
  return target.resourceUrl;
}

const exists = (p) => stat(p).then(() => true, () => false);

export async function seed({ admin, imagesDir, log = console.log }) {
  const catalog = JSON.parse(await readFile(fileURLToPath(new URL('./catalog.json', import.meta.url)), 'utf8'));
  const ctx = await admin.graphql(Q.context);
  const locationId = ctx.locations.nodes[0].id;
  const onlineStore = ctx.publications.nodes.find((p) => p.name === 'Online Store');
  log(`Location: ${ctx.locations.nodes[0].name}; Online Store publication: ${onlineStore?.id ?? 'not found'}`);

  for (const [key, name, type] of DEFINITIONS) {
    const d = await admin.graphql(M.definition, { d: { name, namespace: 'kala', key, type, ownerType: 'PRODUCT' } });
    const errs = d.metafieldDefinitionCreate.userErrors.filter((e) => e.code !== 'TAKEN');
    if (errs.length) throw new Error(`definition ${key}: ${errs[0].message}`);
  }
  log(`Metafield definitions ready (${DEFINITIONS.length})`);

  const ids = {};
  for (const p of catalog.products) {
    const images = [];
    for (const suffix of ['front', 'back', 'detail']) {
      const file = join(imagesDir, `${p.handle}-${suffix}.png`);
      if (await exists(file)) images.push({ url: await uploadImage(admin, file), alt: `${p.title}, ${suffix} view` });
    }
    // Per-colour fronts become variant media, so picking a colour swaps the gallery.
    const colorImages = {};
    if (p.colors) {
      for (const [i, color] of Object.keys(p.colors).entries()) {
        if (i === 0 && images[0]) {
          colorImages[color] = images[0];
          continue;
        }
        const file = join(imagesDir, `${p.handle}-front-${color.toLowerCase()}.png`);
        if (await exists(file)) colorImages[color] = { url: await uploadImage(admin, file), alt: `${p.title} in ${color}` };
      }
    }
    const input = buildProductInput(p, { locationId, images, colorImages, sizeCharts: catalog.sizeCharts });
    const data = await admin.graphql(M.productSet, { input, identifier: { handle: p.handle } });
    const { product } = admin.assertNoUserErrors(data.productSet, `productSet ${p.handle}`);
    ids[p.handle] = product.id;
    if (onlineStore) {
      admin.assertNoUserErrors((await admin.graphql(M.publish, { id: product.id, input: [{ publicationId: onlineStore.id }] })).publishablePublish, 'publish');
    }
    log(`✓ ${p.drop_code} ${p.title} (${input.variants.length} variants, ${images.length} images)`);
  }

  for (const c of catalog.collections) {
    const productIds = catalog.products.filter((p) => p.collection === c.handle).map((p) => ids[p.handle]);
    const existing = (await admin.graphql(Q.collection, { handle: c.handle })).collectionByIdentifier;
    let id = existing?.id;
    if (id) {
      admin.assertNoUserErrors((await admin.graphql(M.collectionAdd, { id, productIds })).collectionAddProducts, 'collectionAddProducts');
    } else {
      const imagePath = c.image && join(imagesDir, c.image);
      const image = imagePath && (await exists(imagePath)) ? { src: await uploadImage(admin, imagePath), altText: c.title } : undefined;
      const data = await admin.graphql(M.collectionCreate, {
        input: { title: c.title, handle: c.handle, descriptionHtml: c.description, products: productIds, image, sortOrder: 'MANUAL' },
      });
      id = admin.assertNoUserErrors(data.collectionCreate, `collectionCreate ${c.handle}`).collection.id;
    }
    if (onlineStore) await admin.graphql(M.publish, { id, input: [{ publicationId: onlineStore.id }] });
    log(`✓ collection ${c.title} (${productIds.length} products)`);
  }

  // Campaign images referenced by templates/index.json as shopify://shop_images/<name>
  const shopImages = ['hero-07.png', 'look-07.png'];
  const files = [];
  for (const name of shopImages) {
    const path = join(imagesDir, name);
    if (await exists(path)) files.push({ originalSource: await uploadImage(admin, path), filename: name, alt: name.replace('.png', ''), contentType: 'IMAGE' });
  }
  if (files.length) {
    admin.assertNoUserErrors((await admin.graphql(M.fileCreate, { files })).fileCreate, 'fileCreate');
    log(`✓ uploaded ${files.length} campaign image(s) to Files`);
  }

  const references = catalog.products
    .filter((p) => p.pairs?.length)
    .map((p) => ({
      ownerId: ids[p.handle],
      namespace: 'kala',
      key: 'complementary',
      type: 'list.product_reference',
      value: JSON.stringify(p.pairs.map((h) => ids[h]).filter(Boolean)),
    }));
  if (references.length) {
    admin.assertNoUserErrors((await admin.graphql(M.metafieldsSet, { metafields: references })).metafieldsSet, 'metafieldsSet');
    log(`✓ linked "pairs with" for ${references.length} products`);
  }
}

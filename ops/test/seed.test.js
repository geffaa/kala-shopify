import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildProductInput, combinations } from '../src/seed/seed.js';

test('combinations builds the variant matrix in option order', () => {
  assert.deepEqual(combinations({ Color: ['Bone', 'Ink'], Size: ['S', 'M'] }), [
    ['Bone', 'S'],
    ['Bone', 'M'],
    ['Ink', 'S'],
    ['Ink', 'M'],
  ]);
  assert.deepEqual(combinations({}), [[]]);
});

test('buildProductInput maps stock overrides and metafields', () => {
  const input = buildProductInput(
    {
      handle: 'kaos',
      title: 'Kaos',
      type: 'T-shirt',
      collection: 'drop-07',
      drop_code: '07.03',
      price: 229000,
      description: '<p>Tee.</p>',
      options: { Color: ['Bone', 'Clay'], Size: ['S'] },
      stockDefault: 6,
      stockOverrides: { 'Clay / S': 0 },
      sizeChart: 'tops',
      material: 'Cotton',
    },
    { locationId: 'gid://shopify/Location/1', sizeCharts: { tops: { unit: 'cm' } } }
  );
  assert.equal(input.variants.length, 2);
  assert.deepEqual(input.variants.map((v) => v.inventoryQuantities[0].quantity), [6, 0]);
  assert.equal(input.variants[0].sku, 'KALA-0703-01');
  assert.deepEqual(input.metafields.map((m) => m.key).sort(), ['drop_code', 'material', 'size_chart']);
  assert.equal(input.seo.description, 'Tee.');
});

test('colour variants point at their own media, which is also in files', () => {
  const bone = { url: 'https://cdn/bone.png', alt: 'bone' };
  const ink = { url: 'https://cdn/ink.png', alt: 'ink' };
  const input = buildProductInput(
    { handle: 't', title: 'T', type: 'T', collection: 'c', drop_code: '07.03', price: 1, description: '', options: { Color: ['Bone', 'Ink'], Size: ['S'] }, stockDefault: 1 },
    { locationId: 'L', images: [bone], colorImages: { Bone: bone, Ink: ink } }
  );
  assert.deepEqual(input.variants.map((v) => v.file.originalSource), [bone.url, ink.url]);
  assert.deepEqual(input.files.map((f) => f.originalSource), [bone.url, ink.url]);
});

test('products without options get a Default Title variant', () => {
  const input = buildProductInput(
    { handle: 'cap', title: 'Cap', type: 'Hat', collection: 'c', drop_code: '07.05', price: 1, description: '', options: {}, stock: { 'Default Title': 3 } },
    { locationId: 'L' }
  );
  assert.deepEqual(input.productOptions, [{ name: 'Title', position: 1, values: [{ name: 'Default Title' }] }]);
  assert.equal(input.variants[0].inventoryQuantities[0].quantity, 3);
});

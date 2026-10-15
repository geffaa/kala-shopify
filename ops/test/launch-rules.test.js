import { test } from 'node:test';
import assert from 'node:assert/strict';
import { checkDiscount, checkProducts, summarize } from '../src/doctor/launch-rules.js';

const good = {
  title: 'Kemeja Kerja Ramie',
  status: 'ACTIVE',
  publishedOnOnlineStore: true,
  seoDescription: 'A work shirt in undyed ramie.',
  options: [{ name: 'Size' }],
  hasSizeChart: true,
  media: [{ alt: 'front' }, { alt: 'back' }, { alt: 'detail' }],
  variants: [{ title: 'M', price: '489000.00', compareAtPrice: null, inventoryQuantity: 4, inventoryPolicy: 'DENY', tracked: true, weight: 0.32 }],
};

test('a well-prepared product passes', () => {
  const findings = checkProducts([good]);
  assert.deepEqual(findings, []);
  assert.equal(summarize(findings).ok, true);
});

test('overselling and misleading compare-at prices are failures', () => {
  const bad = {
    ...good,
    variants: [{ ...good.variants[0], inventoryPolicy: 'CONTINUE', compareAtPrice: '489000.00' }],
  };
  const rules = checkProducts([bad]).filter((f) => f.level === 'fail').map((f) => f.rule);
  assert.deepEqual(rules.sort(), ['compare-at', 'oversell']);
});

test('draft status is a warning before launch and a failure after', () => {
  const draft = { ...good, status: 'DRAFT' };
  const now = new Date('2026-10-20T00:00:00Z');
  assert.equal(checkProducts([draft], { launchAt: '2026-10-24T12:00:00Z', now })[0].level, 'warn');
  assert.equal(checkProducts([draft], { launchAt: '2026-10-19T12:00:00Z', now })[0].level, 'fail');
});

test('missing alt text, size chart and weight are warnings', () => {
  const p = { ...good, hasSizeChart: false, media: [{ alt: '' }, { alt: 'x' }], variants: [{ ...good.variants[0], weight: 0 }] };
  const rules = checkProducts([p]).map((f) => `${f.level}:${f.rule}`);
  assert.deepEqual(rules.sort(), ['warn:alt-text', 'warn:size-chart', 'warn:weight']);
});

test('discount must be live at launch time', () => {
  const at = '2026-10-24T12:00:00Z';
  assert.equal(checkDiscount('DROP07', null, { launchAt: at })[0].message, 'Discount code DROP07 does not exist.');
  assert.equal(checkDiscount('DROP07', { status: 'SCHEDULED', startsAt: '2026-10-24T11:00:00Z', endsAt: null }, { launchAt: at }).length, 0);
  assert.equal(checkDiscount('DROP07', { status: 'SCHEDULED', startsAt: '2026-10-25T00:00:00Z' }, { launchAt: at }).length, 1);
  assert.equal(checkDiscount('DROP07', { status: 'ACTIVE', startsAt: '2026-10-01T00:00:00Z', endsAt: '2026-10-23T00:00:00Z' }, { launchAt: at }).length, 1);
});

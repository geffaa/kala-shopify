/**
 * End-to-end interaction checks against the preview server.
 * node preview/e2e.mjs   (server must be running on :9393)
 */
import puppeteer from 'puppeteer-core';

const BASE = process.env.BASE || 'http://localhost:9393';
const results = [];
const check = async (name, fn) => {
  try {
    await Promise.race([fn(), new Promise((_, reject) => setTimeout(() => reject(new Error('timed out after 20s')), 20000))]);
    results.push(['PASS', name]);
    console.log(`✓ ${name}`);
  } catch (e) {
    results.push(['FAIL', name, e.message]);
    console.log(`✗ ${name}\n    ${e.message}`);
  }
};
const assert = (cond, msg) => {
  if (!cond) throw new Error(msg);
};
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const browser = await puppeteer.launch({ executablePath: process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' });
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
const errors = [];
page.on('pageerror', (e) => errors.push(e.message));
page.on('response', (r) => r.status() === 404 && errors.push(`404 ${r.url()}`));
const analytics = [];
page.on('console', (m) => m.text().startsWith('[analytics]') && analytics.push(m.text()));

await page.goto(`${BASE}/products/kaos-berat-240`, { waitUntil: 'networkidle0' });

await check('sticky add-to-bag (mobile) appears only after scrolling past the buy button', async () => {
  const mobile = await browser.newPage();
  await mobile.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
  await mobile.goto(`${BASE}/products/kaos-berat-240`, { waitUntil: 'networkidle0' });
  await sleep(300);
  assert(await mobile.$eval('sticky-atc', (el) => el.hasAttribute('data-hidden')), 'sticky visible at top');
  await mobile.evaluate(() => window.scrollTo(0, 1600));
  await sleep(500);
  assert(!(await mobile.$eval('sticky-atc', (el) => el.hasAttribute('data-hidden'))), 'sticky not shown after scrolling past');
  await mobile.close();
  await page.bringToFront(); // background tabs throttle rAF and stall clicks
});

await check('variant change updates URL, label and price region', async () => {
  await page.click('label[for$="-1-1"]'); // Color: Ink
  await sleep(500);
  assert(page.url().includes('variant='), 'URL not updated');
  const label = await page.$eval('[data-selected-value]', (el) => el.textContent);
  assert(label === 'Ink', `label is ${label}`);
  assert((await page.evaluate(() => scrollY)) === 0, 'page scrolled away from the picker');
  assert(await page.$('.gallery__item[data-active]'), 'variant image not promoted');
});

await check('sold-out combination disables buy button and offers restock alert', async () => {
  await page.click('label[for$="-1-2"]'); // Clay
  await page.click('label[for$="-2-0"]'); // S
  await sleep(600);
  const disabled = await page.$eval('[data-main-atc]', (b) => b.disabled);
  assert(disabled, 'button still enabled');
  assert(await page.$('back-in-stock form'), 'no back-in-stock form');
  await page.type('back-in-stock input[type=email]', 'dewi@example.com');
  await page.click('back-in-stock button[type=submit]');
  await sleep(400);
  const status = await page.$eval('back-in-stock [data-status]', (el) => el.textContent);
  assert(status.includes('dewi@example.com'), `status: ${status}`);
});

await check('size S marked unavailable for Clay', async () => {
  const cls = await page.$eval('label[for$="-2-0"]', (l) => l.className);
  assert(cls.includes('is-unavailable'), cls);
});

await check('size guide dialog opens with measurements', async () => {
  await page.click('[data-open-dialog^="size-guide"]');
  await sleep(200);
  assert(await page.$eval('dialog[id^="size-guide"]', (d) => d.open), 'not open');
  assert((await page.$$('dialog[id^="size-guide"] tbody tr')).length === 4, 'rows missing');
  await page.keyboard.press('Escape');
});

await check('add to bag opens drawer with the line and updates count', async () => {
  await page.click('label[for$="-2-1"]'); // M (Clay / M available)
  await sleep(600);
  await page.click('[data-main-atc]');
  await sleep(700);
  assert(await page.$eval('#cart-drawer', (d) => d.open), 'drawer closed');
  const count = await page.$eval('[data-cart-count]', (el) => el.textContent.trim());
  assert(count === '1', `count ${count}`);
  const title = await page.$eval('#cart-drawer .line__title', (el) => el.textContent);
  assert(title.includes('Kaos Berat 240'), title);
});

await check('drawer quantity + and remove', async () => {
  await page.click('#cart-drawer [data-qty-step="1"]');
  await sleep(500);
  assert((await page.$eval('[data-cart-count]', (el) => el.textContent.trim())) === '2', 'qty not 2');
  await page.click('#cart-drawer [data-remove]');
  await sleep(500);
  assert((await page.$eval('[data-cart-count]', (el) => el.textContent.trim())) === '0', 'not removed');
  assert(await page.$('#cart-drawer .cart-empty'), 'empty state missing');
  await page.keyboard.press('Escape');
});

await check('collection filter via Section Rendering API + chip removal', async () => {
  await page.goto(`${BASE}/collections/drop-07-kemarau`, { waitUntil: 'networkidle0' });
  const before = (await page.$$('[data-grid] > li')).length;
  const xl = await page.$$eval('.facet__option', (ls) => ls.findIndex((l) => l.textContent.trim().startsWith('XL')));
  await (await page.$$('.facet__option'))[xl].click();
  await sleep(600);
  assert(page.url().includes('filter.v.option.size=XL'), page.url());
  const after = (await page.$$('[data-grid] > li')).length;
  assert(after < before && after > 0, `${before} → ${after}`);
  await page.click('.chip');
  await sleep(600);
  assert((await page.$$('[data-grid] > li')).length === before, 'chip removal failed');
});

await check('sort by price ascending', async () => {
  await page.select('select[name=sort_by]', 'price-ascending');
  await sleep(600);
  const prices = await page.$$eval('[data-grid] .price__current', (els) => els.map((e) => Number(e.textContent.replace(/\D/g, ''))));
  assert(prices.every((p, i) => i === 0 || p >= prices[i - 1]), prices.join(','));
});

await check('predictive search returns products', async () => {
  await page.click('[data-open-dialog="search-sheet"]');
  await page.type('#search-sheet-input', 'kem');
  await sleep(700);
  const titles = await page.$$eval('.ps__title', (els) => els.map((e) => e.textContent));
  assert(titles.some((t) => t.includes('Kemeja')), titles.join('|'));
  await page.keyboard.press('Escape');
});

await check('quick add from a product card', async () => {
  await page.goto(`${BASE}/`, { waitUntil: 'networkidle0' });
  const card = await page.$('quick-add');
  await card.evaluate((el) => el.scrollIntoView({ block: 'center' }));
  await (await card.$('.card__visual, a') ?? card).hover?.();
  await page.hover('.card');
  await sleep(400);
  await page.click('quick-add button:not([disabled])');
  await sleep(700);
  assert((await page.$eval('[data-cart-count]', (el) => el.textContent.trim())) !== '0', 'count still 0');
});

await check('custom analytics events published', async () => {
  assert(analytics.some((a) => a.includes('kala:size_guide_opened')), 'size_guide_opened missing');
  assert(analytics.some((a) => a.includes('kala:filter_applied')), 'filter_applied missing');
  assert(analytics.some((a) => a.includes('kala:back_in_stock_subscribed')), 'back_in_stock missing');
});

await check('no JS errors or 404s', async () => {
  assert(!errors.length, errors.join('\n'));
});

await browser.close();
console.log(`\n${results.filter(([s]) => s === 'PASS').length}/${results.length} passed`);
process.exitCode = results.some(([s]) => s === 'FAIL') ? 1 : 0;

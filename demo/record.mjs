/**
 * Scripted demo recording of the Kala storefront (via the offline preview).
 *   node preview/server.mjs &   then   node demo/record.mjs
 * Output: demo/out/kala-demo.mp4
 *
 * Each scene is recorded with Puppeteer's screencast (needs ffmpeg), then the
 * clips are joined and encoded to H.264 so the file plays everywhere.
 */
import puppeteer from 'puppeteer-core';
import { execFileSync } from 'node:child_process';
import { mkdirSync } from 'node:fs';

const BASE = process.env.BASE || 'http://localhost:9393';
const OUT = new URL('./out/', import.meta.url).pathname;
mkdirSync(OUT, { recursive: true });

const W = 1440;
const H = 900;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const browser = await puppeteer.launch({
  executablePath: process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  defaultViewport: null,
  args: [`--window-size=${W},${H}`, '--hide-scrollbars'],
});

/* ---------- overlay helpers (cursor + caption), injected on every page ---------- */

const OVERLAY = `
  (() => {
    if (window.__demo) return;
    window.__demo = true;
    const css = document.createElement('style');
    css.textContent = \`
      #demo-cursor { position: fixed; z-index: 2147483647; width: 22px; height: 22px; margin: -3px 0 0 -3px; pointer-events: none;
        transition: transform 60ms linear; }
      #demo-cursor.down { transform: scale(.82); }
      #demo-cap { position: fixed; z-index: 2147483646; left: 50%; bottom: 28px; transform: translate(-50%, 12px); opacity: 0;
        background: #131312; color: #EEEBE4; font: 600 15px/1.35 Archivo, system-ui, sans-serif; font-stretch: 90%;
        letter-spacing: .01em; padding: 12px 18px 11px; max-width: 760px; text-align: center; pointer-events: none;
        transition: opacity 240ms ease, transform 240ms ease; box-shadow: 0 0 0 1px rgba(238,235,228,.12); }
      #demo-cap.on { opacity: 1; transform: translate(-50%, 0); }
      #demo-cap b { color: #F0663A; font-weight: 700; }
    \`;
    const add = () => {
      document.head.appendChild(css);
      const c = document.createElement('div');
      c.id = 'demo-cursor';
      c.innerHTML = '<svg viewBox="0 0 22 22" width="22" height="22"><path d="M3 2l15 9-7 1.6L7.5 20z" fill="#131312" stroke="#EEEBE4" stroke-width="1.4" stroke-linejoin="round"/></svg>';
      const cap = document.createElement('div');
      cap.id = 'demo-cap';
      document.body.append(c, cap);
      const pos = JSON.parse(sessionStorage.getItem('demo-pos') || '[720,450]');
      c.style.left = pos[0] + 'px'; c.style.top = pos[1] + 'px';
      addEventListener('mousemove', (e) => { c.style.left = e.clientX + 'px'; c.style.top = e.clientY + 'px'; sessionStorage.setItem('demo-pos', JSON.stringify([e.clientX, e.clientY])); }, true);
      addEventListener('mousedown', () => c.classList.add('down'), true);
      addEventListener('mouseup', () => c.classList.remove('down'), true);
      // keep overlay above open <dialog>s (top layer): re-parent into the open dialog
      new MutationObserver(() => {
        const d = [...document.querySelectorAll('dialog[open]')].pop();
        const host = d || document.body;
        if (c.parentNode !== host) host.append(c, cap);
      }).observe(document.documentElement, { subtree: true, attributes: true, attributeFilter: ['open'] });
    };
    if (document.body) add(); else addEventListener('DOMContentLoaded', add);
  })();
`;

async function newPage(viewport) {
  const page = await browser.newPage();
  await page.setViewport(viewport);
  await page.evaluateOnNewDocument(OVERLAY);
  return page;
}

async function caption(page, html, hold = 0) {
  await page.evaluate((h) => {
    const cap = document.getElementById('demo-cap');
    if (!cap) return;
    if (!h) return cap.classList.remove('on');
    cap.innerHTML = h;
    cap.classList.add('on');
  }, html);
  if (hold) await sleep(hold);
}

let mouse = { x: 720, y: 450 };
async function moveTo(page, x, y, steps = 28) {
  const from = { ...mouse };
  for (let i = 1; i <= steps; i++) {
    const t = i / steps;
    const e = t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2; // ease in-out
    await page.mouse.move(from.x + (x - from.x) * e, from.y + (y - from.y) * e);
    await sleep(12);
  }
  mouse = { x, y };
}

async function center(page, selector, index = 0) {
  const box = await page.evaluate(
    (s, i) => {
      const el = document.querySelectorAll(s)[i];
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
    },
    selector,
    index
  );
  if (!box) throw new Error(`not found: ${selector}[${index}]`);
  return box;
}

async function clickOn(page, selector, index = 0, { pause = 250 } = {}) {
  const { x, y } = await center(page, selector, index);
  await moveTo(page, x, y);
  await sleep(pause);
  await page.mouse.down();
  await sleep(90);
  await page.mouse.up();
}

async function hoverOn(page, selector, index = 0) {
  const { x, y } = await center(page, selector, index);
  await moveTo(page, x, y);
}

/** Smooth scroll to an absolute Y (or element top minus offset). */
async function scrollTo(page, target, { offset = 0, duration = 1200 } = {}) {
  await page.evaluate(
    async (target, offset, duration) => {
      const y = typeof target === 'number' ? target : document.querySelector(target).getBoundingClientRect().top + scrollY - offset;
      const start = scrollY;
      const t0 = performance.now();
      await new Promise((done) => {
        const step = (now) => {
          const t = Math.min(1, (now - t0) / duration);
          const e = t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2;
          scrollTo(0, start + (y - start) * e);
          t < 1 ? requestAnimationFrame(step) : done();
        };
        requestAnimationFrame(step);
      });
    },
    target,
    offset,
    duration
  );
  await sleep(150);
}

async function typeSlow(page, selector, text) {
  await page.focus(selector);
  for (const ch of text) {
    await page.keyboard.type(ch);
    await sleep(85);
  }
}

async function slide(page, html) {
  await page.setContent(
    `<!doctype html><html><head><style>
      @font-face { font-family: Archivo; src: url('${BASE}/assets/archivo-var.woff2') format('woff2'); font-weight: 100 900; font-stretch: 62% 125%; }
      html, body { margin: 0; height: 100%; background: #131312; color: #EEEBE4; font-family: Archivo, sans-serif; }
      .s { height: 100%; box-sizing: border-box; padding: 72px 80px; display: grid; }
      .lab { font-weight: 600; font-stretch: 78%; letter-spacing: .06em; text-transform: uppercase; font-size: 15px; color: rgba(238,235,228,.6); }
      .sig { color: #F0663A; }
      h1 { font-size: 132px; line-height: .86; font-weight: 840; font-stretch: 125%; letter-spacing: -.04em; text-transform: uppercase; margin: 0; }
      h2 { font-size: 64px; line-height: .92; font-weight: 800; font-stretch: 120%; letter-spacing: -.03em; text-transform: uppercase; margin: 0; }
      .grid { display: grid; grid-template-columns: repeat(4, 1fr); border-top: 1px solid rgba(238,235,228,.18); }
      .grid div { padding: 22px 0 0; }
      .num { font-size: 56px; font-weight: 780; font-stretch: 110%; line-height: 1; color: #F0663A; }
      pre { font: 500 13px/1.6 ui-monospace, Menlo, monospace; background: #1d1d1b; padding: 18px 22px; margin: 0; color: #d9d5cc; border: 1px solid rgba(238,235,228,.12); }
      .f { color: #F0663A } .w { color: #d9b23f } .ok { color: #8fbf7a }
    </style></head><body>${html}</body></html>`,
    { waitUntil: 'load' }
  );
  await page.evaluate(() => document.fonts.ready);
}

/* ---------------------------------------------------------------------- */

const clips = [];

/** Static slides: screenshot → looped clip. Deterministic, unlike screencasting a page that doesn't repaint. */
async function still(name, page, html, seconds) {
  await page.bringToFront();
  await slide(page, html);
  await sleep(300);
  const path = `${OUT}${name}.png`;
  await page.screenshot({ path });
  clips.push({ path, seconds });
  console.log(`✓ ${name}`);
}

async function record(name, page, fn) {
  const path = `${OUT}${name}.webm`;
  await page.bringToFront(); // background tabs stop painting, which stalls the screencast
  const rec = await page.screencast({ path });
  try {
    await fn();
  } finally {
    await rec.stop();
  }
  clips.push({ path });
  console.log(`✓ ${name}`);
}

const desktop = await newPage({ width: W, height: H, deviceScaleFactor: 1 });
await desktop.goto(`${BASE}/`, { waitUntil: 'networkidle0' });

/* 1 — Title */
await still(
  '01-title',
  desktop,
    `<div class="s" style="align-content:space-between">
      <div class="lab" style="display:flex;justify-content:space-between"><span>Portfolio · Shopify developer</span><span>Yodhimas Geffananda</span></div>
      <div><p class="lab sig" style="margin:0 0 24px">Custom Online Store 2.0 theme + integrations</p><h1>Kala<br>Store build</h1></div>
      <div class="grid lab"><div>Liquid · vanilla JS</div><div>Webhooks · App Proxy</div><div>Core Web Vitals</div><div>GA4 · Meta pixel</div></div>
    </div>`,
  3.4
);

/* 2 — Home */
await record('02-home', desktop, async () => {
  await desktop.goto(`${BASE}/`, { waitUntil: 'networkidle0' });
  await sleep(500);
  await caption(desktop, 'Drop-based apparel store. Countdown runs in the bar and hero, and <b>switches to “live” on its own</b>.', 3200);
  await hoverOn(desktop, '.countdown');
  await sleep(1200);
  await caption(desktop, '');
  await scrollTo(desktop, '.featured', { offset: 0, duration: 1400 });
  await caption(desktop, 'Hairline product grid: stock badges, hover image, <b>size quick-add</b> on the card.');
  await hoverOn(desktop, '.card', 0);
  await sleep(1400);
  await hoverOn(desktop, '.card', 1);
  await sleep(900);
  await hoverOn(desktop, '.card', 0);
  await sleep(700); // quick-add bar slides up on hover; measure it after
  await clickOn(desktop, 'quick-add button:not([disabled])', 1);
  await caption(desktop, 'Added without a page load — cart drawer re-rendered in the <b>same request</b> (Section Rendering API).');
  await sleep(2600);
  await clickOn(desktop, '#cart-drawer [data-qty-step="1"]');
  await sleep(1500);
  await clickOn(desktop, '#cart-drawer [data-close-dialog]');
  await caption(desktop, '');
  await sleep(500);
});

/* 3 — Lookbook + archive */
await record('03-lookbook', desktop, async () => {
  await scrollTo(desktop, '.look', { offset: 56, duration: 1400 });
  await caption(desktop, 'Shoppable lookbook — each hotspot is linked to its product row.');
  for (const i of [0, 1, 2, 3]) {
    await hoverOn(desktop, '.look__pin', i);
    await sleep(650);
  }
  await sleep(500);
  await caption(desktop, '');
  await scrollTo(desktop, '.archive', { offset: 140, duration: 1600 });
  await caption(desktop, 'Drop archive: status comes from inventory, so nobody has to remember to mark it sold out.');
  await hoverOn(desktop, '.archive__link', 1);
  await sleep(1300);
  await hoverOn(desktop, '.archive__link', 2);
  await sleep(1300);
  await caption(desktop, '');
});

/* 4 — Product page */
await record('04-product', desktop, async () => {
  await desktop.goto(`${BASE}/products/kaos-berat-240`, { waitUntil: 'networkidle0' });
  await sleep(400);
  await caption(desktop, 'Product page. Picking a colour swaps the image, price, stock and URL — rendered by Liquid, not duplicated in JS.');
  await clickOn(desktop, 'label[for$="-1-1"]');
  await sleep(1600);
  await clickOn(desktop, 'label[for$="-1-2"]');
  await sleep(1200);
  await clickOn(desktop, 'label[for$="-2-0"]');
  await caption(desktop, 'Sold-out combination: button disables and a <b>back-in-stock</b> signup appears (App Proxy → webhook emails on restock).');
  await sleep(1400);
  await clickOn(desktop, 'back-in-stock input[type=email]');
  await typeSlow(desktop, 'back-in-stock input[type=email]', 'dewi@example.com');
  await clickOn(desktop, 'back-in-stock button[type=submit]');
  await sleep(2000);
  await caption(desktop, 'Size guide comes from a JSON metafield, so merchandisers edit it in the admin.');
  await clickOn(desktop, '[data-open-dialog^="size-guide"]');
  await sleep(2200);
  await clickOn(desktop, 'dialog[id^="size-guide"] [data-close-dialog]');
  await sleep(400);
  await clickOn(desktop, 'label[for$="-2-1"]');
  await sleep(1000);
  await caption(desktop, '');
  await clickOn(desktop, '[data-main-atc]');
  await caption(desktop, 'Free-shipping meter hides itself when a customer shops in another currency — no wrong numbers.');
  await sleep(2600);
  await clickOn(desktop, '#cart-drawer [data-close-dialog]');
  await caption(desktop, '');
  await sleep(300);
});

/* 5 — Collection + search */
await record('05-collection', desktop, async () => {
  await desktop.goto(`${BASE}/collections/drop-07-kemarau`, { waitUntil: 'networkidle0' });
  await sleep(400);
  await caption(desktop, 'Storefront filtering and sorting <b>without reloads</b>. URLs stay shareable, and it still works with JS off.');
  const xl = await desktop.$$eval('.facet__option', (ls) => ls.findIndex((l) => l.textContent.trim().startsWith('XL')));
  await clickOn(desktop, '.facet__option', xl);
  await sleep(1600);
  await clickOn(desktop, '.facet__option', 0);
  await sleep(1600);
  await clickOn(desktop, '.chip', 0);
  await sleep(1200);
  await desktop.select('select[name=sort_by]', 'price-ascending');
  await sleep(1400);
  await caption(desktop, 'Predictive search, rendered as a section; arrow keys move through results.');
  await clickOn(desktop, '[data-open-dialog="search-sheet"]');
  await sleep(300);
  await typeSlow(desktop, '#search-sheet-input', 'kemeja');
  await sleep(1800);
  await desktop.keyboard.press('Escape');
  await caption(desktop, '');
  await sleep(300);
});

/* 6 — Mobile, shown in a phone frame */
const phoneHost = await newPage({ width: W, height: H, deviceScaleFactor: 1 });
await phoneHost.goto(`${BASE}/`, { waitUntil: 'networkidle0' });
await phoneHost.setContent(
  `<!doctype html><html><head><style>
    @font-face { font-family: Archivo; src: url('${BASE}/assets/archivo-var.woff2') format('woff2'); font-weight: 100 900; font-stretch: 62% 125%; }
    html,body{margin:0;height:100%;background:#E4DFD4;font-family:Archivo,sans-serif;color:#131312}
    .wrap{height:100%;display:grid;grid-template-columns:1fr 430px 1fr;align-items:center}
    .phone{width:390px;height:780px;border:12px solid #131312;border-radius:44px;overflow:hidden;background:#EEEBE4;justify-self:center}
    iframe{width:390px;height:780px;border:0;display:block}
    .copy{padding:0 64px;align-self:center}
    .lab{font-weight:600;font-stretch:78%;letter-spacing:.06em;text-transform:uppercase;font-size:14px;color:#5F5C55}
    h2{font-size:58px;line-height:.9;font-weight:820;font-stretch:120%;letter-spacing:-.03em;text-transform:uppercase;margin:14px 0 18px}
    p{font-size:18px;line-height:1.45;max-width:30ch}
  </style></head><body><div class="wrap">
    <div class="copy"><div class="lab">Mobile-first</div><h2>Built for<br>the thumb</h2><p>Swipe gallery, sticky add-to-bag, filter drawer. Native &lt;dialog&gt; for every drawer.</p></div>
    <div class="phone"><iframe id="ph" src="${BASE}/products/kemeja-kerja-ramie"></iframe></div>
    <div class="copy"><div class="lab">Lighthouse · mobile</div><h2 style="font-size:46px">A11y 100<br>SEO 100<br>CLS 0</h2></div>
  </div></body></html>`,
  { waitUntil: 'load' }
);
await phoneHost.evaluate(() => document.fonts.ready);
await sleep(1500);
const frame = () => phoneHost.frames().find((f) => f.url().includes('/products/') || f.url().includes('/collections/'));

async function frameScroll(y, duration = 1100) {
  await frame().evaluate(
    async (y, duration) => {
      const start = scrollY;
      const t0 = performance.now();
      await new Promise((done) => {
        const step = (now) => {
          const t = Math.min(1, (now - t0) / duration);
          const e = t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2;
          scrollTo(0, start + (y - start) * e);
          t < 1 ? requestAnimationFrame(step) : done();
        };
        requestAnimationFrame(step);
      });
    },
    y,
    duration
  );
}

await record('06-mobile', phoneHost, async () => {
  await sleep(800);
  await frame().evaluate(() => {
    const t = document.querySelector('[data-track]');
    t.scrollTo({ left: t.clientWidth, behavior: 'smooth' });
  });
  await sleep(1200);
  await frame().evaluate(() => {
    const t = document.querySelector('[data-track]');
    t.scrollTo({ left: t.clientWidth * 2, behavior: 'smooth' });
  });
  await sleep(1200);
  await frameScroll(1500, 1800);
  await sleep(1400); // sticky add-to-bag now visible
  await frameScroll(0, 1200);
  await sleep(400);
  await frame().goto(`${BASE}/collections/drop-07-kemarau`, { waitUntil: 'networkidle0' });
  await sleep(900);
  await frame().click('.coll__filter-btn');
  await sleep(1800);
  await frame().click('[id^="facets-"] [data-close-dialog]');
  await sleep(600);
  await frameScroll(900, 1500);
  await sleep(900);
});

/* 7 — Behind the scenes (fresh tab: reused tabs can hand the screencast a stale frame) */
const outro = await newPage({ width: W, height: H, deviceScaleFactor: 1 });
await outro.goto(`${BASE}/`, { waitUntil: 'networkidle0' });
await still(
  '07-outro',
  outro,
    `<div class="s" style="grid-template-rows:auto auto 1fr auto;gap:36px">
      <div class="lab">Behind the storefront</div>
      <h2>Tooling for keeping<br>the store healthy</h2>
      <pre><span style="color:#8a877f">$ npm run launch-check -- --collection drop-07-kemarau --at 2026-10-24T19:00+07:00 --discount DROP07</span>

<span class="f">FAIL</span>  oversell    Jaket Kebun            M: "continue selling when out of stock" is on.
<span class="f">FAIL</span>  compare-at  Tas Sisa Kain          Default Title: compare-at 149000 is not above price 149000 — strikethrough would be misleading.
<span class="f">FAIL</span>  discount    DROP07                 Starts 2026-10-25T00:00:00Z, after launch.
<span class="w">WARN</span>  size-chart  Kaos Berat 240         Has a Size option but no kala.size_chart metafield.
<span class="w">WARN</span>  status      Topi Lapangan          Status is DRAFT. Activate before launch.
<span class="w">WARN</span>  alt-text    Celana Pendek Drill    2 image(s) without alt text.

<span class="f">NOT READY</span> — 3 failure(s), 3 warning(s)</pre>
      <div class="grid lab">
        <div><div class="num">0</div>Theme Check offenses</div>
        <div><div class="num">23</div>Ops tests · webhooks, HMAC, proxy</div>
        <div><div class="num">13/13</div>End-to-end checks</div>
        <div><div class="num">100</div>Lighthouse accessibility</div>
      </div>
    </div>`,
  6
);

await browser.close();

/* ---------- join + encode ---------- */
const parts = clips.flatMap((c) => (c.seconds ? ['-loop', '1', '-framerate', '30', '-t', String(c.seconds), '-i', c.path] : ['-i', c.path]));
const filter =
  clips.map((_, i) => `[${i}:v]scale=${W}:${H}:force_original_aspect_ratio=decrease,pad=${W}:${H}:(ow-iw)/2:(oh-ih)/2:color=0x131312,fps=30,setsar=1[v${i}]`).join(';') +
  ';' +
  clips.map((_, i) => `[v${i}]`).join('') +
  `concat=n=${clips.length}:v=1:a=0[out]`;
execFileSync('ffmpeg', ['-y', '-loglevel', 'error', ...parts, '-filter_complex', filter, '-map', '[out]', '-c:v', 'libx264', '-preset', 'slow', '-crf', '24', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', `${OUT}kala-demo.mp4`]);
console.log(`→ ${OUT}kala-demo.mp4`);

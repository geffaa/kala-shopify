/**
 * Renders catalog imagery to design/out/*.png with headless Chrome:
 *   <handle>-front.png, -back.png, -detail.png   product media (1600 × 2000)
 *   <handle>-front-<color>.png                  per-colour fronts for variant media
 *   knolling-<drop>.png                          collection covers (1600 × 2000)
 *   hero-07.png, look-07.png                     homepage campaign images
 *
 * Usage: node design/build.mjs [--only handle]
 */
import { mkdir, readFile, writeFile, rm } from 'node:fs/promises';
import { fileURLToPath, pathToFileURL } from 'node:url';
import puppeteer from 'puppeteer-core';
import { garmentMarkup, GARMENTS } from './garments.mjs';

const root = new URL('..', import.meta.url);
const out = fileURLToPath(new URL('design/out/', root));
const font = pathToFileURL(fileURLToPath(new URL('theme/assets/archivo-var.woff2', root))).href;
const catalog = JSON.parse(await readFile(new URL('ops/src/seed/catalog.json', root), 'utf8'));

const BG = '#E4DFD4';
const INK = '#1B1B19';
const SIGNAL = '#D9461B';
const handle = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-');

const label = (x, y, text, { size = 22, weight = 650, anchor = 'start', fill = INK, opacity = 1, stretch = 78, spacing = 1.4 } = {}) =>
  `<text x="${x}" y="${y}" text-anchor="${anchor}" fill="${fill}" opacity="${opacity}" style="font: ${weight} ${size}px Archivo; font-stretch: ${stretch}%; letter-spacing: ${spacing}px; text-transform: uppercase">${text}</text>`;

function paper(w, h, step = 50) {
  return `
    <defs><pattern id="grid" width="${step}" height="${step}" patternUnits="userSpaceOnUse">
      <path d="M${step} 0 L0 0 0 ${step}" fill="none" stroke="${INK}" stroke-opacity=".05" stroke-width="1"/>
    </pattern></defs>
    <rect width="${w}" height="${h}" fill="${BG}"/>
    <rect width="${w}" height="${h}" fill="url(#grid)"/>
    ${[[30, 30, 1, 1], [w - 30, 30, -1, 1], [30, h - 30, 1, -1], [w - 30, h - 30, -1, -1]]
      .map(([x, y, sx, sy]) => `<path d="M${x} ${y + sy * 22} L${x} ${y} L${x + sx * 22} ${y}" fill="none" stroke="${INK}" stroke-width="1.5"/>`)
      .join('')}`;
}

function frame(inner, { code, view, drop }) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1250" width="1000" height="1250">
    ${paper(1000, 1250)}
    ${inner}
    <path d="M60 70 L160 70 M60 62 L60 78 M110 66 L110 74 M160 62 L160 78" stroke="${INK}" stroke-width="1.5"/>
    ${label(60, 100, '10 cm', { size: 16, opacity: 0.6 })}
    ${label(60, 1196, code, { size: 26, weight: 760 })}
    ${label(60 + code.length * 15 + 18, 1196, view, { size: 26, opacity: 0.5 })}
    ${label(940, 1196, `Kala / Drop ${drop}`, { size: 18, anchor: 'end', opacity: 0.6 })}
  </svg>`;
}

function detailView(type, color, p) {
  const g = GARMENTS[type];
  const off = g.offsetY ?? 0;
  const [vx, vy, vw, vh] = g.detail.view;
  const sx = 1000 / vw;
  const sy = 1250 / vh;
  const notes = g.detail.notes
    .map(([gx, gy, text], i) => {
      const cx = (gx - vx) * sx;
      const cy = (gy + off - vy) * sy;
      const left = cx < 500;
      const tx = left ? 60 : 940;
      const ty = cy;
      return `
        <path d="M${cx} ${cy} L${left ? tx + 10 : tx - 10} ${ty}" stroke="${INK}" stroke-width="1.5"/>
        <circle cx="${cx}" cy="${cy}" r="9" fill="${SIGNAL}" stroke="${INK}" stroke-width="1.5"/>
        ${label(tx, ty - 12, `${String(i + 1).padStart(2, '0')} — ${text}`, { size: 22, anchor: left ? 'start' : 'end' })}`;
    })
    .join('');
  return frame(
    `<svg x="0" y="0" width="1000" height="1250" viewBox="${vx} ${vy} ${vw} ${vh}">${garmentMarkup(type, 'front', color)}</svg>${notes}`,
    { code: p.drop_code, view: 'Detail', drop: p.drop_code.split('.')[0] }
  );
}

function productViews(p) {
  const colors = p.colors ? Object.entries(p.colors) : [[null, p.color]];
  const [, base] = colors[0];
  const drop = p.drop_code.split('.')[0];
  const views = {
    [`${p.handle}-front`]: frame(garmentMarkup(p.garment, 'front', base), { code: p.drop_code, view: 'Front', drop }),
    [`${p.handle}-back`]: frame(garmentMarkup(p.garment, 'back', base), { code: p.drop_code, view: 'Back', drop }),
    [`${p.handle}-detail`]: detailView(p.garment, base, p),
  };
  for (const [name, hex] of colors.slice(1)) {
    views[`${p.handle}-front-${handle(name)}`] = frame(garmentMarkup(p.garment, 'front', hex), {
      code: p.drop_code,
      view: `Front · ${name}`,
      drop,
    });
  }
  return views;
}

/** Collection cover: 2 × 2 grid of the drop's first pieces + a title block. */
function knolling(collection) {
  const items = catalog.products.filter((p) => p.collection === collection.handle).slice(0, 4);
  const [num, name] = collection.title.split(' — ');
  const cells = items
    .map((p, i) => {
      const x = 60 + (i % 2) * 450;
      const y = 250 + Math.floor(i / 2) * 470;
      const color = p.color ?? Object.values(p.colors)[0];
      return `<svg x="${x}" y="${y}" width="430" height="440" viewBox="60 120 880 1000">${garmentMarkup(p.garment, 'front', color)}</svg>
              ${label(x + 20, y + 460, p.drop_code, { size: 18, opacity: 0.6 })}`;
    })
    .join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1250" width="1000" height="1250">
    ${paper(1000, 1250)}
    ${label(60, 150, num, { size: 26, opacity: 0.55 })}
    ${label(60, 210, name, { size: 64, weight: 820, stretch: 125, spacing: -1.5 })}
    ${cells}
  </svg>`;
}

/** Hero: the drop's anchor piece as a large, dimensioned technical drawing. */
function hero() {
  const p = catalog.products.find((x) => x.handle === 'kemeja-kerja-ramie');
  const dim = (x1, y1, x2, y2, text, tx, ty, rotate = 0) => `
    <path d="M${x1} ${y1} L${x2} ${y2}" stroke="${INK}" stroke-width="1.5"/>
    ${rotate
      ? `<path d="M${x1 - 10} ${y1} L${x1 + 10} ${y1} M${x2 - 10} ${y2} L${x2 + 10} ${y2}" stroke="${INK}" stroke-width="1.5"/>`
      : `<path d="M${x1} ${y1 - 10} L${x1} ${y1 + 10} M${x2} ${y2 - 10} L${x2} ${y2 + 10}" stroke="${INK}" stroke-width="1.5"/>`}
    <g transform="rotate(${rotate} ${tx} ${ty})">${label(tx, ty, text, { size: 20, anchor: 'middle' })}</g>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 1350" width="1200" height="1350">
    ${paper(1200, 1350)}
    <svg x="100" y="80" width="1000" height="1250" viewBox="0 0 1000 1250">${garmentMarkup('shirt', 'front', p.color)}</svg>
    ${dim(414, 1190, 786, 1190, 'Chest 57 cm', 600, 1225)}
    ${dim(1040, 285, 1040, 1135, 'Length 72 cm', 1075, 710, 90)}
    <circle cx="600" cy="472" r="9" fill="${SIGNAL}" stroke="${INK}" stroke-width="1.5"/>
    <path d="M600 472 L940 472" stroke="${INK}" stroke-width="1.5"/>
    ${label(1140, 466, 'Corozo, ×10', { size: 20, anchor: 'end' })}
    <circle cx="455" cy="545" r="9" fill="${SIGNAL}" stroke="${INK}" stroke-width="1.5"/>
    <path d="M455 545 L80 545" stroke="${INK}" stroke-width="1.5"/>
    ${label(60, 539, 'Phone-depth pocket', { size: 20 })}
    ${label(60, 80, '07.01 / Kemeja Kerja', { size: 22, weight: 760 })}
    ${label(1140, 80, 'Ramie 180 gsm', { size: 22, anchor: 'end', opacity: 0.6 })}
  </svg>`;
}

/** Lookbook: a full flat-lay outfit. Pins in templates/index.json match these positions. */
function look() {
  const piece = (handleName, x, y, w, view = 'front') => {
    const p = catalog.products.find((q) => q.handle === handleName);
    const color = p.color ?? Object.values(p.colors)[0];
    return `<svg x="${x}" y="${y}" width="${w}" height="${w * 1.25}" viewBox="0 0 1000 1250">${garmentMarkup(p.garment, view, color)}</svg>`;
  };
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 1200" width="1600" height="1200">
    ${paper(1600, 1200, 60)}
    ${piece('topi-lapangan', 120, 40, 420)}
    ${piece('jaket-kebun', 430, 60, 760)}
    ${piece('celana-lapangan-drill', 1080, 120, 640)}
    ${piece('tas-sisa-kain', 90, 520, 470)}
    ${label(60, 1150, 'Look 07 / Pasar Cihapit, 07:40', { size: 26, weight: 760 })}
    ${label(1540, 1150, 'Kala', { size: 20, anchor: 'end', opacity: 0.6 })}
  </svg>`;
}

/* ---------------------------------------------------------------------- */

const only = process.argv.includes('--only') ? process.argv[process.argv.indexOf('--only') + 1] : null;
const jobs = {};
for (const p of catalog.products) if (!only || p.handle === only) Object.assign(jobs, productViews(p));
if (!only) {
  for (const c of catalog.collections) jobs[`knolling-${c.handle.split('-')[1]}`] = knolling(c);
  jobs['hero-07'] = hero();
  jobs['look-07'] = look();
}

await mkdir(out, { recursive: true });
const browser = await puppeteer.launch({
  executablePath: process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  headless: true,
  args: ['--allow-file-access-from-files'],
});
const page = await browser.newPage();
const tmp = `${out}_render.html`;

for (const [name, svg] of Object.entries(jobs)) {
  const [, w, h] = svg.match(/viewBox="0 0 (\d+) (\d+)"/);
  await writeFile(
    tmp,
    `<!doctype html><html><head><style>
      @font-face { font-family: Archivo; src: url('${font}') format('woff2'); font-weight: 100 900; font-stretch: 62% 125%; }
      html, body { margin: 0; background: ${BG}; }
      svg { display: block; }
    </style></head><body>${svg}</body></html>`
  );
  await page.setViewport({ width: Number(w), height: Number(h), deviceScaleFactor: 1600 / Number(w) });
  await page.goto(pathToFileURL(tmp).href, { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: `${out}${name}.png`, clip: { x: 0, y: 0, width: Number(w), height: Number(h) } });
  process.stdout.write('.');
}
await rm(tmp);
await browser.close();
console.log(`\n${Object.keys(jobs).length} images → design/out/`);

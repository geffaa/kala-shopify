import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { findAppEmbeds, findExternalScripts, findOrphanSnippets, scanTheme } from '../src/doctor/theme-scan.js';

test('flags render-blocking third-party scripts in <head> only', () => {
  const layout = `<html><head>
    <script src="https://cdn.reviews.example/widget.js"></script>
    <script src="https://cdn.ok.example/a.js" defer></script>
    <script src="{{ 'global.js' | asset_url }}" type="module"></script>
  </head><body><script src="https://cdn.late.example/b.js"></script></body></html>`;
  const found = findExternalScripts('layout/theme.liquid', layout);
  assert.deepEqual(
    found.map((s) => [s.host, s.renderBlocking]),
    [
      ['cdn.reviews.example', true],
      ['cdn.ok.example', false],
      ['cdn.late.example', false],
    ]
  );
});

test('reads app embeds from settings_data.json, including the comment header', () => {
  const json = `/* auto-generated */ {"current":{"blocks":{
    "1": {"type":"shopify://apps/judge-me-reviews/blocks/preview_badge/61ccd3b1","disabled":true},
    "2": {"type":"shopify://apps/klaviyo/blocks/onsite/2632fe16"}
  }}}`;
  assert.deepEqual(findAppEmbeds(json), [
    { id: '1', app: 'judge-me-reviews', block: 'preview_badge', enabled: false },
    { id: '2', app: 'klaviyo', block: 'onsite', enabled: true },
  ]);
});

test('detects snippets nothing renders', () => {
  const files = {
    'layout/theme.liquid': "{% render 'used' %}",
    'snippets/used.liquid': "{% render 'nested' %}",
    'snippets/nested.liquid': '',
    'snippets/old-app-widget.liquid': '<div></div>',
  };
  assert.deepEqual(findOrphanSnippets(files), ['old-app-widget']);
});

test('the Kala theme itself is clean', async () => {
  const root = fileURLToPath(new URL('../../theme', import.meta.url));
  const files = {};
  for (const dir of ['layout', 'sections', 'snippets', 'templates', 'config']) {
    for (const name of await readdir(join(root, dir))) {
      files[`${dir}/${name}`] = await readFile(join(root, dir, name), 'utf8');
    }
  }
  const scan = scanTheme(files);
  assert.equal(scan.scripts.filter((s) => s.renderBlocking).length, 0);
  assert.deepEqual(scan.trackers, []);
  assert.deepEqual(scan.orphanSnippets, []);
});

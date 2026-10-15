/**
 * Static analysis of theme files. Pure functions over { filename: content }
 * so they run the same against a downloaded live theme or the local repo.
 *
 * What it looks for — the usual reasons a Shopify store gets slow over time:
 *  - third-party <script src> tags, especially render-blocking ones in <head>
 *  - tracking snippets pasted into the theme instead of Customer Events
 *  - app embeds that are enabled (each one ships JS on every page)
 *  - orphan snippets left behind by uninstalled apps
 *  - oversized assets
 */

const TRACKER_PATTERNS = [
  { name: 'Google tag (gtag.js)', re: /gtag\(|googletagmanager\.com\/gtag/ },
  { name: 'Google Tag Manager', re: /googletagmanager\.com\/gtm\.js/ },
  { name: 'Meta Pixel', re: /fbq\(|connect\.facebook\.net/ },
  { name: 'TikTok Pixel', re: /ttq\.(load|page|track)|analytics\.tiktok\.com/ },
  { name: 'Hotjar', re: /static\.hotjar\.com|hjid/ },
  { name: 'Klaviyo onsite', re: /static\.klaviyo\.com\/onsite/ },
  { name: 'Microsoft Clarity', re: /clarity\.ms/ },
];

const SCRIPT_TAG_RE = /<script\b([^>]*)>/gi;
const SRC_RE = /\bsrc\s*=\s*["']([^"']+)["']/i;

function hostOf(src) {
  if (src.startsWith('//')) src = `https:${src}`;
  try {
    return new URL(src).host;
  } catch {
    return null; // relative or Liquid-generated ({{ 'x.js' | asset_url }})
  }
}

export function findExternalScripts(filename, content) {
  const results = [];
  const headEnd = content.search(/<\/head>/i);
  for (const match of content.matchAll(SCRIPT_TAG_RE)) {
    const attrs = match[1];
    const src = attrs.match(SRC_RE)?.[1];
    if (!src || src.includes('{{')) continue;
    const host = hostOf(src);
    if (!host) continue;
    const isAsync = /\basync\b/i.test(attrs);
    const isDefer = /\bdefer\b/i.test(attrs);
    const isModule = /type\s*=\s*["']module["']/i.test(attrs);
    const inHead = filename.startsWith('layout/') && headEnd !== -1 && match.index < headEnd;
    results.push({
      file: filename,
      host,
      src,
      renderBlocking: inHead && !isAsync && !isDefer && !isModule,
    });
  }
  return results;
}

export function findHardcodedTrackers(filename, content) {
  return TRACKER_PATTERNS.filter((t) => t.re.test(content)).map((t) => ({ file: filename, tracker: t.name }));
}

/** App embed blocks live in settings_data.json under current.blocks. */
export function findAppEmbeds(settingsDataJson) {
  let data;
  try {
    // settings_data.json may start with a /* comment */ header written by Shopify.
    data = JSON.parse(settingsDataJson.replace(/^\s*\/\*[\s\S]*?\*\//, ''));
  } catch {
    return [];
  }
  const current = typeof data.current === 'object' ? data.current : {};
  return Object.entries(current.blocks ?? {})
    .filter(([, b]) => typeof b.type === 'string' && b.type.startsWith('shopify://apps/'))
    .map(([id, b]) => {
      const [, , , app, , block] = b.type.split('/');
      return { id, app, block, enabled: !b.disabled };
    });
}

/** Snippets that no other file renders/includes — typical leftovers from removed apps. */
export function findOrphanSnippets(files) {
  const snippetNames = Object.keys(files)
    .filter((f) => f.startsWith('snippets/') && f.endsWith('.liquid'))
    .map((f) => f.slice('snippets/'.length, -'.liquid'.length));
  const corpus = Object.entries(files)
    .filter(([f]) => f.endsWith('.liquid') || f.endsWith('.json'))
    .map(([, c]) => c)
    .join('\n');
  return snippetNames.filter((name) => {
    const re = new RegExp(`(render|include)\\s+['"]${name.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')}['"]`);
    return !re.test(corpus);
  });
}

export function scanTheme(files, sizes = {}, { largeAssetBytes = 150_000 } = {}) {
  const scripts = [];
  const trackers = [];
  for (const [file, content] of Object.entries(files)) {
    if (!file.endsWith('.liquid')) continue;
    scripts.push(...findExternalScripts(file, content));
    trackers.push(...findHardcodedTrackers(file, content));
  }
  const appEmbeds = files['config/settings_data.json'] ? findAppEmbeds(files['config/settings_data.json']) : [];
  const largeAssets = Object.entries(sizes)
    .filter(([f, size]) => f.startsWith('assets/') && size > largeAssetBytes)
    .map(([file, size]) => ({ file, size }))
    .sort((a, b) => b.size - a.size);

  return { scripts, trackers, appEmbeds, orphanSnippets: findOrphanSnippets(files), largeAssets };
}

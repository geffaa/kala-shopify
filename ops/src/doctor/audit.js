import { readdir, readFile, stat, mkdir, writeFile } from 'node:fs/promises';
import { join, relative } from 'node:path';
import { scanTheme } from './theme-scan.js';
import { runPsi, rate } from './psi.js';

const MAIN_THEME = `query { themes(first: 1, roles: [MAIN]) { nodes { id name } } }`;

const THEME_TEXT_FILES = `
  query ThemeFiles($id: ID!, $after: String) {
    theme(id: $id) {
      files(first: 50, after: $after, filenames: ["layout/*", "sections/*", "snippets/*", "templates/*", "config/settings_data.json"]) {
        nodes { filename size body { ... on OnlineStoreThemeFileBodyText { content } } }
        pageInfo { hasNextPage endCursor }
      }
    }
  }`;

const THEME_ASSETS = `
  query ThemeAssets($id: ID!, $after: String) {
    theme(id: $id) {
      files(first: 250, after: $after, filenames: ["assets/*"]) {
        nodes { filename size }
        pageInfo { hasNextPage endCursor }
      }
    }
  }`;

const SCRIPT_TAGS = `query { scriptTags(first: 100) { nodes { id src displayScope createdAt } } }`;

async function loadRemoteTheme(admin) {
  const { themes } = await admin.graphql(MAIN_THEME);
  const theme = themes.nodes[0];
  const files = {};
  const sizes = {};
  for await (const f of admin.paginate(THEME_TEXT_FILES, { id: theme.id }, (d) => d.theme.files)) {
    if (f.body?.content != null) files[f.filename] = f.body.content;
    sizes[f.filename] = Number(f.size);
  }
  for await (const f of admin.paginate(THEME_ASSETS, { id: theme.id }, (d) => d.theme.files)) {
    sizes[f.filename] = Number(f.size);
  }
  return { name: theme.name, files, sizes };
}

async function loadLocalTheme(dir) {
  const files = {};
  const sizes = {};
  async function walk(d) {
    for (const entry of await readdir(d, { withFileTypes: true })) {
      const full = join(d, entry.name);
      if (entry.isDirectory()) await walk(full);
      else {
        const rel = relative(dir, full);
        sizes[rel] = (await stat(full)).size;
        if (/\.(liquid|json)$/.test(rel)) files[rel] = await readFile(full, 'utf8');
      }
    }
  }
  await walk(dir);
  return { name: `local:${dir}`, files, sizes };
}

const ms = (v) => (v == null ? '—' : v >= 1000 ? `${(v / 1000).toFixed(2)} s` : `${Math.round(v)} ms`);
const cls = (v) => (v == null ? '—' : v.toFixed(3));

export function renderReport({ theme, scan, scriptTags, psi }) {
  const out = [];
  out.push(`# Store health report`, '', `Theme: **${theme}** · ${new Date().toISOString()}`, '');

  out.push('## Core Web Vitals');
  if (!psi.length) out.push('', '_Skipped (no --url given, or store is password protected)._');
  for (const r of psi) {
    out.push('', `### ${r.url} — Lighthouse ${r.score}/100`, '');
    out.push('| Metric | Field p75 (real users) | Rating | Lab |', '|---|---|---|---|');
    out.push(`| LCP | ${ms(r.field.LCP)} | ${rate('LCP', r.field.LCP)} | ${ms(r.lab.LCP)} |`);
    out.push(`| INP | ${ms(r.field.INP)} | ${rate('INP', r.field.INP)} | TBT ${ms(r.lab.TBT)} |`);
    out.push(`| CLS | ${cls(r.field.CLS)} | ${rate('CLS', r.field.CLS)} | ${cls(r.lab.CLS)} |`);
    if (r.lcpElement) out.push('', `LCP element: \`${r.lcpElement.slice(0, 160)}\``);
    if (r.thirdParties.length) {
      out.push('', '| Third party | Transfer | Main-thread blocking |', '|---|---|---|');
      r.thirdParties.forEach((t) => out.push(`| ${t.entity} | ${t.transferKb} KB | ${t.blockingMs} ms |`));
    }
  }

  out.push('', '## Scripts & apps', '');
  const blocking = scan.scripts.filter((s) => s.renderBlocking);
  out.push(`- External scripts in theme files: **${scan.scripts.length}** (${blocking.length} render-blocking)`);
  blocking.forEach((s) => out.push(`  - ❌ \`${s.src}\` in ${s.file} — add \`defer\` or move to an app embed / pixel`));
  const byHost = Object.entries(Object.groupBy(scan.scripts, (s) => s.host));
  byHost.forEach(([host, list]) => out.push(`  - ${host}: ${list.length} reference(s)`));

  out.push(`- Legacy ScriptTags (injected by apps on every page): **${scriptTags.length}**`);
  scriptTags.forEach((t) => out.push(`  - \`${t.src}\` (${t.displayScope}, since ${t.createdAt?.slice(0, 10)})`));

  const enabled = scan.appEmbeds.filter((e) => e.enabled);
  out.push(`- App embeds: **${enabled.length} enabled**, ${scan.appEmbeds.length - enabled.length} disabled`);
  scan.appEmbeds.forEach((e) => out.push(`  - ${e.enabled ? '●' : '○'} ${e.app} / ${e.block}`));

  out.push(`- Tracking code hardcoded in theme: **${scan.trackers.length}**`);
  scan.trackers.forEach((t) =>
    out.push(`  - ⚠️ ${t.tracker} in ${t.file} — move to Customer Events (custom pixel) so it runs sandboxed and respects consent`)
  );

  out.push(`- Orphan snippets (not rendered anywhere; often left by uninstalled apps): **${scan.orphanSnippets.length}**`);
  scan.orphanSnippets.forEach((s) => out.push(`  - snippets/${s}.liquid`));

  out.push(`- Assets over 150 KB: **${scan.largeAssets.length}**`);
  scan.largeAssets.forEach((a) => out.push(`  - ${a.file} — ${Math.round(a.size / 1024)} KB`));

  return out.join('\n') + '\n';
}

export async function audit({ admin, local, urls = [], psiKey, outDir = 'reports', log = console.log }) {
  const theme = local ? await loadLocalTheme(local) : await loadRemoteTheme(admin);
  log(`Scanning ${theme.name} (${Object.keys(theme.files).length} files)…`);
  const scan = scanTheme(theme.files, theme.sizes);

  const scriptTags = admin && !local ? (await admin.graphql(SCRIPT_TAGS)).scriptTags.nodes : [];

  const psi = [];
  for (const url of urls) {
    log(`PageSpeed Insights: ${url}`);
    try {
      psi.push(await runPsi(url, { key: psiKey }));
    } catch (e) {
      log(`  skipped: ${e.message}`);
    }
  }

  const report = renderReport({ theme: theme.name, scan, scriptTags, psi });
  await mkdir(outDir, { recursive: true });
  const file = join(outDir, `health-${new Date().toISOString().slice(0, 10)}.md`);
  await writeFile(file, report);
  return { file, report, scan, psi };
}

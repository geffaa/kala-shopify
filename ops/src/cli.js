#!/usr/bin/env node
import { parseArgs } from 'node:util';
import { fileURLToPath } from 'node:url';
import { config } from './config.js';
import { createAdminClient } from './shopify/admin.js';
import { audit } from './doctor/audit.js';
import { launchCheck } from './doctor/launch-check.js';
import { summarize } from './doctor/launch-rules.js';
import { seed } from './seed/seed.js';

const HELP = `kala-ops CLI

  audit         Store health: scripts, app embeds, orphan snippets, Core Web Vitals
                  --url <url>      page to test with PageSpeed Insights (repeatable)
                  --local <dir>    scan a local theme folder instead of the live theme
  launch-check  Pre-launch checklist for a drop. Exit code 1 on failures.
                  --collection <handle>  (required)
                  --at <iso datetime>    launch time
                  --discount <code>      discount code to verify (repeatable)
  seed          Create the demo catalog in a development store
  webhooks      List webhook subscriptions registered for the app
`;

const [command, ...rest] = process.argv.slice(2);
const { values } = parseArgs({
  args: rest,
  options: {
    url: { type: 'string', multiple: true },
    local: { type: 'string' },
    collection: { type: 'string' },
    at: { type: 'string' },
    discount: { type: 'string', multiple: true },
  },
});

const admin = () => createAdminClient({ ...config, token: config.adminToken, log: (m) => console.error(`[admin] ${m}`) });

const color = { fail: '\x1b[31m', warn: '\x1b[33m', reset: '\x1b[0m', green: '\x1b[32m' };

try {
  switch (command) {
    case 'audit': {
      const { file, report } = await audit({
        admin: values.local ? null : admin(),
        local: values.local,
        urls: values.url ?? [],
        psiKey: config.psiApiKey,
      });
      console.log(report);
      console.log(`Saved ${file}`);
      break;
    }
    case 'launch-check': {
      if (!values.collection) throw new Error('--collection is required');
      const { title, products, findings } = await launchCheck({
        admin: admin(),
        collection: values.collection,
        launchAt: values.at,
        discounts: values.discount ?? [],
      });
      console.log(`\nLaunch check — ${title} (${products.length} products)${values.at ? ` · launch ${values.at}` : ''}\n`);
      for (const f of findings.sort((a, b) => (a.level === b.level ? 0 : a.level === 'fail' ? -1 : 1))) {
        console.log(`${color[f.level]}${f.level.toUpperCase().padEnd(5)}${color.reset} ${f.rule.padEnd(11)} ${f.product.padEnd(22)} ${f.message}`);
      }
      const s = summarize(findings);
      console.log(`\n${s.ok ? color.green + 'READY' : color.fail + 'NOT READY'}${color.reset} — ${s.fail} failure(s), ${s.warn} warning(s)`);
      process.exitCode = s.ok ? 0 : 1;
      break;
    }
    case 'seed': {
      await seed({ admin: admin(), imagesDir: fileURLToPath(new URL('../../design/out', import.meta.url)) });
      break;
    }
    case 'webhooks': {
      const data = await admin().graphql(`query { webhookSubscriptions(first: 50) { nodes { topic uri } } }`);
      console.table(data.webhookSubscriptions.nodes);
      break;
    }
    default:
      console.log(HELP);
  }
} catch (e) {
  console.error(`${color.fail}${e.message}${color.reset}`);
  process.exitCode = 1;
}

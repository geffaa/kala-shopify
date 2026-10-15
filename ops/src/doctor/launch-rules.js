/**
 * Pre-launch rules for a drop. Pure: takes the data, returns findings.
 * Severity: fail = will break the launch or lose money, warn = fix if you can.
 */

export function checkProducts(products, { launchAt, now = new Date() } = {}) {
  const findings = [];
  const add = (level, product, rule, message) => findings.push({ level, product: product?.title ?? '—', rule, message });
  const launched = launchAt ? new Date(launchAt) <= now : true;

  for (const p of products) {
    if (p.status !== 'ACTIVE') {
      add(launched ? 'fail' : 'warn', p, 'status', `Status is ${p.status}. ${launched ? 'Launch time has passed.' : 'Activate before launch.'}`);
    }
    if (p.publishedOnOnlineStore === false) {
      add(launched ? 'fail' : 'warn', p, 'channel', 'Not published to the Online Store channel.');
    }

    const media = p.media ?? [];
    if (media.length < 2) add('warn', p, 'media', `Only ${media.length} image(s); product pages convert better with 3+.`);
    const missingAlt = media.filter((m) => !m.alt?.trim()).length;
    if (missingAlt) add('warn', p, 'alt-text', `${missingAlt} image(s) without alt text.`);

    if (!p.seoDescription?.trim()) add('warn', p, 'seo', 'No SEO description; Google will improvise one.');

    const hasSize = (p.options ?? []).some((o) => /^(size|ukuran)$/i.test(o.name));
    if (hasSize && !p.hasSizeChart) add('warn', p, 'size-chart', 'Has a Size option but no kala.size_chart metafield.');

    for (const v of p.variants ?? []) {
      const label = v.title;
      if (!(Number(v.price) > 0)) add('fail', p, 'price', `${label}: price is ${v.price}.`);
      if (v.compareAtPrice != null && Number(v.compareAtPrice) <= Number(v.price)) {
        add('fail', p, 'compare-at', `${label}: compare-at ${v.compareAtPrice} is not above price ${v.price} — strikethrough would be misleading.`);
      }
      if (!v.tracked) add('warn', p, 'tracking', `${label}: inventory not tracked — a limited drop can oversell.`);
      if (v.tracked && v.inventoryPolicy === 'CONTINUE') {
        add('fail', p, 'oversell', `${label}: "continue selling when out of stock" is on.`);
      }
      if (v.tracked && v.inventoryQuantity <= 0) add('warn', p, 'stock', `${label}: 0 in stock at launch.`);
      if (!(v.weight > 0)) add('warn', p, 'weight', `${label}: no weight; weight-based shipping rates will be wrong.`);
    }
  }
  return findings;
}

export function checkDiscount(code, discount, { launchAt } = {}) {
  if (!discount) return [{ level: 'fail', product: code, rule: 'discount', message: `Discount code ${code} does not exist.` }];
  const findings = [];
  const at = launchAt ? new Date(launchAt) : new Date();
  if (discount.status === 'EXPIRED') findings.push({ level: 'fail', product: code, rule: 'discount', message: 'Discount has expired.' });
  if (discount.startsAt && new Date(discount.startsAt) > at) {
    findings.push({ level: 'fail', product: code, rule: 'discount', message: `Starts ${discount.startsAt}, after launch.` });
  }
  if (discount.endsAt && new Date(discount.endsAt) <= at) {
    findings.push({ level: 'fail', product: code, rule: 'discount', message: `Ends ${discount.endsAt}, before launch.` });
  }
  if (discount.usageLimit != null && discount.asyncUsageCount >= discount.usageLimit) {
    findings.push({ level: 'fail', product: code, rule: 'discount', message: 'Usage limit already reached.' });
  }
  return findings;
}

export function summarize(findings) {
  const count = (l) => findings.filter((f) => f.level === l).length;
  return { fail: count('fail'), warn: count('warn'), ok: count('fail') === 0 };
}

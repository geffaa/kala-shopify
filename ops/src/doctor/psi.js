/**
 * PageSpeed Insights: field data (CrUX, what real users experienced over 28
 * days) plus a lab run (Lighthouse). Field data is what Google ranks on; lab
 * data is what you can debug. Both are reported, and kept distinct.
 */

const THRESHOLDS = {
  // [good, needs-improvement] upper bounds, per web.dev
  LCP: [2500, 4000],
  INP: [200, 500],
  CLS: [0.1, 0.25],
};

export function rate(metric, value) {
  const t = THRESHOLDS[metric];
  if (!t || value == null) return '—';
  return value <= t[0] ? 'good' : value <= t[1] ? 'needs work' : 'poor';
}

export function extractPsi(json) {
  const field = json.loadingExperience?.metrics ?? {};
  const audits = json.lighthouseResult?.audits ?? {};
  const thirdParty = audits['third-party-summary']?.details?.items ?? [];

  const fieldCls = field.CUMULATIVE_LAYOUT_SHIFT_SCORE?.percentile;
  return {
    url: json.id,
    score: Math.round((json.lighthouseResult?.categories?.performance?.score ?? 0) * 100),
    field: {
      LCP: field.LARGEST_CONTENTFUL_PAINT_MS?.percentile ?? null,
      INP: field.INTERACTION_TO_NEXT_PAINT?.percentile ?? null,
      CLS: fieldCls != null ? fieldCls / 100 : null,
    },
    lab: {
      LCP: audits['largest-contentful-paint']?.numericValue ?? null,
      CLS: audits['cumulative-layout-shift']?.numericValue ?? null,
      TBT: audits['total-blocking-time']?.numericValue ?? null,
      FCP: audits['first-contentful-paint']?.numericValue ?? null,
    },
    lcpElement: audits['largest-contentful-paint-element']?.details?.items?.[0]?.items?.[0]?.node?.snippet ?? null,
    thirdParties: thirdParty
      .map((i) => ({
        entity: typeof i.entity === 'string' ? i.entity : i.entity?.text,
        transferKb: Math.round((i.transferSize ?? 0) / 1024),
        blockingMs: Math.round(i.blockingTime ?? 0),
      }))
      .sort((a, b) => b.blockingMs - a.blockingMs || b.transferKb - a.transferKb)
      .slice(0, 8),
  };
}

export async function runPsi(url, { strategy = 'mobile', key, fetchImpl = fetch } = {}) {
  const params = new URLSearchParams({ url, strategy, category: 'performance' });
  if (key) params.set('key', key);
  const res = await fetchImpl(`https://www.googleapis.com/pagespeedonline/v5/runPagespeed?${params}`);
  if (!res.ok) throw new Error(`PSI ${res.status}: ${(await res.text()).slice(0, 200)}`);
  return extractPsi(await res.json());
}

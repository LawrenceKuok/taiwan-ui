/**
 * Shared anti-abuse helpers for API route handlers.
 *
 * Philosophy: raise the cost of automated abuse without breaking real users
 * or legitimate search-engine indexing. We don't try to "block all bots" —
 * that's both impossible for a public site and counterproductive for an
 * open-source docs site that benefits from indexing.
 *
 * What this module enforces:
 *   - Reject requests with empty / obviously-bot User-Agent strings on
 *     write endpoints
 *   - Reject cross-origin POSTs without a matching Origin header (CSRF
 *     defense-in-depth, in addition to SameSite cookie semantics)
 *   - Provide standard "no-index" headers for API responses so they don't
 *     pollute search indexes
 *   - Detect honeypot field hits
 */

const KNOWN_BAD_UA_PATTERNS = [
  /^$/,
  /^Mozilla\/5\.0 \(compatible; MJ12bot/i,
  /AhrefsBot/i,
  /SemrushBot/i,
  /DotBot/i,
  /MauiBot/i,
  /PetalBot/i,
  /seznam\.cz/i,
  /BLEXBot/i,
  /BacklinksExtendedBot/i,
  /python-requests/i,
  /^curl\//i,
  /^Wget\//i,
  /Go-http-client/i,
  /Java\//i,
  /Apache-HttpClient/i,
  /okhttp/i,
  /^node-fetch/i,
  /axios\//i,
  /libwww-perl/i,
];

export interface UAGuardResult {
  ok: boolean;
  reason?: "missing" | "blocked";
}

/**
 * Allow legitimate browsers + accept legitimate search engines (Googlebot,
 * Bingbot) which we want for indexing. Block obvious scraping libraries
 * and SEO data-mining bots.
 */
export function checkUserAgent(headers: Headers): UAGuardResult {
  const ua = headers.get("user-agent") ?? "";
  if (ua.trim().length < 10) return { ok: false, reason: "missing" };

  // Allow well-known crawlers we want indexing the site
  if (
    /Googlebot|Bingbot|DuckDuckBot|Slurp|Baiduspider|YandexBot|Applebot/i.test(
      ua
    )
  ) {
    return { ok: true };
  }

  for (const pattern of KNOWN_BAD_UA_PATTERNS) {
    if (pattern.test(ua)) return { ok: false, reason: "blocked" };
  }
  return { ok: true };
}

/**
 * For write endpoints: require Origin header to match an allowlist. Modern
 * browsers always send Origin on POST/PUT/PATCH/DELETE; missing Origin
 * suggests scripted abuse.
 *
 * Pass siteOrigins as an allowlist (e.g. from env / config). Localhost is
 * permitted only outside production.
 */
export interface OriginGuardResult {
  ok: boolean;
  reason?: "missing-origin" | "cross-origin";
}

export function checkOrigin(
  headers: Headers,
  siteOrigins: string[]
): OriginGuardResult {
  const origin = headers.get("origin");
  if (!origin) return { ok: false, reason: "missing-origin" };
  if (siteOrigins.includes(origin)) return { ok: true };
  // Allow Vercel preview deployments (URL pattern: *.vercel.app)
  try {
    const u = new URL(origin);
    if (u.hostname.endsWith(".vercel.app")) return { ok: true };
  } catch {
    /* malformed origin string */
  }
  return { ok: false, reason: "cross-origin" };
}

/** Headers to attach to API JSON responses to discourage indexing. */
export const NO_INDEX_HEADERS = {
  "X-Robots-Tag": "noindex, nofollow, nosnippet, noarchive",
} as const;

/**
 * Simple time-based honeypot: form should submit a `_t` field containing
 * the timestamp of when the form was rendered. Real humans take >800ms;
 * bots typically POST instantly.
 */
export function failsTimingCheck(formRenderedAtMs: number | undefined): boolean {
  if (typeof formRenderedAtMs !== "number" || !Number.isFinite(formRenderedAtMs)) {
    return true;
  }
  const elapsed = Date.now() - formRenderedAtMs;
  // <800ms = almost certainly a bot. >24h = stale page replay attempt.
  return elapsed < 800 || elapsed > 24 * 60 * 60 * 1000;
}

/** Check honeypot field — should be empty if filled by a real user. */
export function failsHoneypot(value: unknown): boolean {
  return typeof value === "string" && value.length > 0;
}

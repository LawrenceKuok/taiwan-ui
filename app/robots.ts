import type { MetadataRoute } from "next";

const SITE = "https://forge.pgintel.dev";

/**
 * Robots policy.
 *
 * Goals:
 *   1. Let legitimate search engines (Google, Bing, etc.) index the site —
 *      we WANT discoverability for an OSS docs site.
 *   2. Block known scraping / SEO data-mining bots that don't add value
 *      and only contribute to bandwidth costs.
 *   3. Block all bots from /api/* (no API responses should be in search
 *      indexes; the X-Robots-Tag header on those responses is a second
 *      layer of defense).
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // Default: allow well-behaved crawlers everywhere except /api/
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/"],
      },
      // Explicitly allow major search engines (defensive — already covered
      // by the wildcard above, but explicit is clearer for auditors)
      { userAgent: "Googlebot", allow: "/", disallow: ["/api/"] },
      { userAgent: "Bingbot", allow: "/", disallow: ["/api/"] },
      { userAgent: "DuckDuckBot", allow: "/", disallow: ["/api/"] },
      { userAgent: "Slurp", allow: "/", disallow: ["/api/"] }, // Yahoo
      { userAgent: "Applebot", allow: "/", disallow: ["/api/"] },

      // SEO data-mining bots that consume bandwidth without contributing
      // to organic discovery. Block entirely.
      { userAgent: "AhrefsBot", disallow: "/" },
      { userAgent: "SemrushBot", disallow: "/" },
      { userAgent: "MJ12bot", disallow: "/" },
      { userAgent: "DotBot", disallow: "/" },
      { userAgent: "BLEXBot", disallow: "/" },
      { userAgent: "PetalBot", disallow: "/" },
      { userAgent: "MauiBot", disallow: "/" },
      { userAgent: "SeznamBot", disallow: "/" },
      { userAgent: "BacklinksExtendedBot", disallow: "/" },
      { userAgent: "ZoominfoBot", disallow: "/" },
      { userAgent: "DataForSeoBot", disallow: "/" },
      { userAgent: "Bytespider", disallow: "/" }, // ByteDance scraper
      { userAgent: "ImagesiftBot", disallow: "/" },

      // AI training crawlers — opt-out by default. Note that opt-out
      // honoring is voluntary; a Cloudflare WAF rule is the only enforcement.
      { userAgent: "GPTBot", disallow: "/" },
      { userAgent: "ChatGPT-User", disallow: "/" },
      { userAgent: "CCBot", disallow: "/" },
      { userAgent: "anthropic-ai", disallow: "/" },
      { userAgent: "Claude-Web", disallow: "/" },
      { userAgent: "ClaudeBot", disallow: "/" },
      { userAgent: "Google-Extended", disallow: "/" },
      { userAgent: "PerplexityBot", disallow: "/" },
      { userAgent: "FacebookBot", disallow: "/" },
      { userAgent: "Diffbot", disallow: "/" },
      { userAgent: "Omgilibot", disallow: "/" },
      { userAgent: "Omgili", disallow: "/" },
      { userAgent: "ImagesiftBot", disallow: "/" },
      { userAgent: "Cotoyogi", disallow: "/" },
    ],
    sitemap: `${SITE}/sitemap.xml`,
    host: SITE,
  };
}

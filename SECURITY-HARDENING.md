# Security Hardening — Honest Self-Assessment

This document explains what hardening is in place to prevent abuse of the Forge documentation site (forge.pgintel.dev), what the realistic limits of "anti-scraping" are for a public OSS docs site, and how to layer additional protection at the Cloudflare edge.

## TL;DR — what "100% safe / unscrapable" actually means

**It does not mean you can prevent scraping.** No public website can. If a browser can render the content, a determined scraper can extract it. Anti-scraping for a public docs site is *not* a binary state — it's a cost-curve. You raise the cost until casual scrapers go elsewhere; sophisticated scrapers will always succeed.

What we *can* and *do* prevent:

1. ✅ **Spam abuse** of `/api/submit` (no flooding the GitHub issues queue)
2. ✅ **Quota exhaustion** of `/api/lookup/tax-id` (no burning the upstream 商業司 daily quota)
3. ✅ **Cross-origin POST abuse** (basic CSRF defense)
4. ✅ **Bot pollution of search indexes** (API responses excluded from indexing)
5. ✅ **AI training crawler opt-out** (declared in robots.txt)
6. ✅ **DDoS / volumetric attacks** (Cloudflare layer when proxied)

What we explicitly **don't** prevent:

- ❌ Search engines indexing the docs (we *want* this — discoverability)
- ❌ Manual copy-paste of code snippets (it's MIT-licensed; copy away)
- ❌ Determined scrapers using headless browsers + residential proxies
- ❌ Static-site mirrors (the entire build is public on GitHub)

If you need *true* isolation, you need a private deployment with auth — not a public docs site.

## What's currently in place

### Layer 1: HTTP security headers (`next.config.ts`)

| Header | Value |
|---|---|
| `Strict-Transport-Security` | `max-age=63072000; includeSubDomains; preload` |
| `Content-Security-Policy` | restrictive default-src 'self' + explicit allowlist for Vercel scripts |
| `X-Frame-Options` | `DENY` (no embedding in iframes) |
| `X-Content-Type-Options` | `nosniff` |
| `Referrer-Policy` | `strict-origin-when-cross-origin` |
| `Permissions-Policy` | camera, microphone, geolocation all disabled |

Verified live at https://forge.pgintel.dev (also confirmed via `curl -I`).

### Layer 2: API endpoint hardening

#### `/api/submit` (POST — component proposals)

- ✅ Rate limit: **2 requests/min/IP** (was 3)
- ✅ User-Agent gate: blocks empty UA + known bot UA patterns
- ✅ Origin gate: rejects POSTs from non-allowlisted origins (CSRF defense)
- ✅ Honeypot field: hidden `website` input — bots fill all fields and trip it
- ✅ Timing check: form must take >800ms to submit (instant submit = bot)
- ✅ Input sanitization: control char strip + length caps (80/40/1000/120 bytes)
- ✅ Email format validation (when provided)
- ✅ `X-Robots-Tag: noindex, nofollow, nosnippet, noarchive` on all responses
- ✅ Upstream timeout: 8s on GitHub API call

#### `/api/lookup/tax-id` (GET — 商業司 wrapper)

- ✅ Rate limit: **15/min/IP** (was 30) AND **60/hour/IP** (new)
- ✅ User-Agent gate
- ✅ Input format validation (tax ID alphanumeric, ≤16 chars)
- ✅ Format-gating: bad checksums never trigger upstream call
- ✅ Upstream timeout: 8s
- ✅ `X-Robots-Tag: noindex, nofollow` on all responses
- ✅ `Cache-Control: public, s-maxage=3600` (CDN caches 1h)

#### `/api/registry/*` (GET — public component metadata)

- ✅ `force-static` — no per-request compute
- ✅ `Cache-Control: public, s-maxage=3600`
- ✅ `X-Robots-Tag: noindex, nofollow` (don't pollute search indexes)

### Layer 3: robots.txt (`app/robots.ts`)

Allows: Googlebot, Bingbot, DuckDuckBot, Slurp (Yahoo), Applebot — search engines we want indexing the docs.

Blocks (Disallow: /):

- **SEO data-mining bots**: AhrefsBot, SemrushBot, MJ12bot, DotBot, BLEXBot, PetalBot, MauiBot, SeznamBot, BacklinksExtendedBot, ZoominfoBot, DataForSeoBot
- **Commercial scrapers**: Bytespider (ByteDance), ImagesiftBot, Diffbot, Omgilibot
- **AI training crawlers** (opt-out): GPTBot, ChatGPT-User, CCBot, anthropic-ai, Claude-Web, ClaudeBot, Google-Extended, PerplexityBot, FacebookBot

> Note: robots.txt is a **convention**, not enforcement. Well-behaved bots respect it; malicious scrapers ignore it. Cloudflare WAF is the actual enforcement layer (see below).

### Layer 4: rate-limit infrastructure (`lib/rate-limit.ts`)

KV-pluggable backend:

- **Production with Upstash/Vercel KV** (when env vars set): persistent across cold starts, multi-region consistent
- **Production without KV**: in-memory fallback per-instance — degrades fail-open if multiple Vercel regions

### Layer 5: error-message minimization

- 400/403/429 responses return generic error strings — no leakage of internal logic
- 500 responses don't include stack traces
- All API responses use `X-Robots-Tag: noindex` to keep accidental error pages out of search

## What you should also enable at Cloudflare

DNS-only mode (gray cloud) gives you SSL pass-through but **none of Cloudflare's protections**. To get the full hardening, flip to proxied (orange cloud) and enable:

### 1. Bot Fight Mode (Free tier)

Dashboard → **Security** → **Bots** → enable **Bot Fight Mode**.

Blocks known bot networks at the edge, before they ever hit your Vercel deployment. Costs you nothing.

### 2. WAF Custom Rules (Free tier — 5 rules)

Dashboard → **Security** → **WAF** → **Create rule**:

```
Rule name: Block API abuse via UA
When: (http.request.uri.path contains "/api/" and 
       http.user_agent eq "")
Action: Block
```

```
Rule name: Block common scrapers
When: (http.user_agent contains "AhrefsBot" or 
       http.user_agent contains "SemrushBot" or
       http.user_agent contains "Bytespider" or
       http.user_agent contains "GPTBot")
Action: Block
```

```
Rule name: Rate-limit /api/* aggressively
When: (http.request.uri.path contains "/api/")
Action: Challenge (interactive)
For visitors with: > 30 requests in 1 minute
```

### 3. Rate Limiting Rules (Free tier — 1 rule, Pro tier — 5)

Dashboard → **Security** → **WAF** → **Rate limiting rules**:

```
Path: /api/submit
Threshold: 5 requests / 5 minutes per IP
Action: Block for 1 hour
```

This is *in addition to* the per-route rate limit in the Next.js app — Cloudflare drops abuse traffic before it ever reaches Vercel (saving compute cost).

### 4. Page Rules / Cache Rules

For static asset paths, set aggressive edge caching:

```
URL: forge.pgintel.dev/_next/static/*
Cache TTL: 1 year (Cloudflare default already does this for hashed assets)
```

### 5. Turnstile on `/submit`

For real bot protection on the submission form, add **Cloudflare Turnstile** (their free CAPTCHA replacement):

1. Dashboard → **Turnstile** → **Add site**
2. Get your site key + secret
3. Add the widget to `/submit` form
4. Verify the token server-side in `/api/submit`

This is the highest-leverage upgrade if `/api/submit` ever sees real abuse. Implementation guide: https://developers.cloudflare.com/turnstile/get-started/

### 6. Cloudflare Analytics + Security Events

Dashboard → **Analytics** → review the **Security Events** tab weekly. You'll see:

- Which IPs hit rate limits
- What user agents are most common
- Where attacks originate geographically

If you see organized abuse, escalate the WAF rules.

## Threat model

| Threat | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Single-IP /api/submit spam | High | Medium (GitHub issue spam) | Per-IP rate limit + honeypot + timing check |
| Distributed /api/submit spam | Low (no incentive) | Medium | Cloudflare WAF + Turnstile (recommended) |
| /api/lookup/tax-id quota exhaustion (DoS upstream) | Medium | High (cuts off legitimate use) | Per-minute + per-hour rate limits |
| /api/lookup/tax-id used as free 商業司 proxy | Medium | Low (data is public anyway) | Rate limits, X-Robots-Tag |
| Code scraping / mirroring of docs | High | None (it's MIT, public on GitHub) | Don't bother — it's the point |
| AI training crawl | Medium | Low (opinion-dependent) | robots.txt opt-out (voluntary), Cloudflare WAF block (enforced) |
| DDoS volumetric attack | Low | High (cost spike, downtime) | Cloudflare proxy mode + Bot Fight Mode |
| CSRF via cross-origin POST | Low | Low (no auth state to exploit) | Origin header check on /api/submit |
| Source code disclosure | None | None | Repo is public anyway |
| PII leakage | None | None | Site has no user accounts; validators run client-side |

## What's NOT in this hardening (and why)

- **Auth wall**: would defeat the purpose of an OSS docs site
- **JS/HTML obfuscation**: useless against modern scrapers, hostile to honest dev tools
- **IP geo-blocking**: cuts off legitimate international traffic, doesn't stop sophisticated scrapers
- **Browser fingerprinting**: privacy-hostile, ineffective vs. headless browsers
- **CAPTCHA on every page**: degrades UX for 99.9% legitimate users to slow 0.1% scrapers
- **Premium WAF features**: Cloudflare Pro/Business adds value but for an OSS docs site, the free tier is fine

## Verification

To test the hardening yourself:

```bash
# Test rate limit on /api/submit
for i in {1..5}; do
  curl -X POST https://forge.pgintel.dev/api/submit \
    -H "Content-Type: application/json" \
    -H "Origin: https://forge.pgintel.dev" \
    -d '{"name":"test","description":"test"}' \
    -w "\n%{http_code}\n"
done
# Expected: first 2 succeed (or 400 if no honeypot), then 429

# Test UA gate on /api/lookup/tax-id
curl -A "" "https://forge.pgintel.dev/api/lookup/tax-id?id=04595252"
# Expected: 403 Forbidden

# Test bot UA block
curl -A "AhrefsBot/7.0" "https://forge.pgintel.dev/api/lookup/tax-id?id=04595252"
# Expected: 403 Forbidden

# Verify X-Robots-Tag on API responses
curl -s -I "https://forge.pgintel.dev/api/registry" | grep -i robots
# Expected: X-Robots-Tag: noindex, nofollow
```

## Updating

This document should be updated when:

1. New API endpoints are added — must include matching hardening
2. A real abuse incident occurs — write up the response and the new mitigation
3. Cloudflare adds new free-tier features — re-evaluate whether to enable
4. The threat model changes (e.g. project gains real adopters with PII at stake)

For incident response: see `SECURITY.md` (separate file) for the disclosure pipeline.

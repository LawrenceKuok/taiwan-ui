import type { NextRequest } from "next/server";
import { lookupCompanyByTaxID } from "@/lib/server";
import { checkRateLimit, getClientIP } from "@/lib/rate-limit";
import { checkUserAgent, NO_INDEX_HEADERS } from "@/lib/api-guard";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const LIMIT = 15; // Tightened from 30 -> 15 per minute (we forward to upstream gov API)
const WINDOW_MS = 60_000;
const BURST_LIMIT = 60; // 60/hour per IP — protects 商業司 quota
const BURST_WINDOW_MS = 60 * 60_000;

/**
 * GET /api/lookup/tax-id?id=04595252
 *
 * Pairs the format/checksum validator with an authoritative existence
 * check against 商業司 公司基本資料.
 *
 * Anti-abuse layers, in order:
 *   1. User-Agent gate (block obvious scraping libraries)
 *   2. Per-minute rate limit (15/min/IP) — short-burst protection
 *   3. Per-hour rate limit (60/hour/IP) — protects upstream quota
 *   4. Input shape validation
 *
 * Production callers should add caching (商業司 only updates daily) — wrap
 * with Redis / Vercel Cache. The Cache-Control header below is a hint to
 * downstream CDNs.
 */
export async function GET(request: NextRequest) {
  // Layer 1: UA gate
  const uaCheck = checkUserAgent(request.headers);
  if (!uaCheck.ok) {
    return Response.json(
      { error: "Forbidden" },
      { status: 403, headers: NO_INDEX_HEADERS }
    );
  }

  const url = new URL(request.url);
  const id = url.searchParams.get("id")?.trim() ?? "";

  if (!id) {
    return Response.json(
      { error: "Missing required query parameter: id" },
      { status: 400, headers: NO_INDEX_HEADERS }
    );
  }

  if (id.length > 16 || !/^[A-Za-z0-9]+$/.test(id)) {
    return Response.json(
      { error: "Invalid tax ID format." },
      { status: 400, headers: NO_INDEX_HEADERS }
    );
  }

  const ip = getClientIP(request.headers);

  // Layer 2 + 3: stacked rate limiters (per-minute + per-hour)
  const rlMin = await checkRateLimit({
    scope: "lookup-tax-id-minute",
    key: ip,
    limit: LIMIT,
    windowMs: WINDOW_MS,
  });
  if (!rlMin.allowed) {
    const retryAfter = Math.max(Math.ceil((rlMin.resetAt - Date.now()) / 1000), 1);
    return Response.json(
      { error: "Too many requests." },
      {
        status: 429,
        headers: {
          ...NO_INDEX_HEADERS,
          "Retry-After": String(retryAfter),
          "X-RateLimit-Limit": String(LIMIT),
          "X-RateLimit-Window": "60s",
        },
      }
    );
  }

  const rlHour = await checkRateLimit({
    scope: "lookup-tax-id-hour",
    key: ip,
    limit: BURST_LIMIT,
    windowMs: BURST_WINDOW_MS,
  });
  if (!rlHour.allowed) {
    const retryAfter = Math.max(Math.ceil((rlHour.resetAt - Date.now()) / 1000), 1);
    return Response.json(
      { error: "Hourly request quota exceeded." },
      {
        status: 429,
        headers: {
          ...NO_INDEX_HEADERS,
          "Retry-After": String(retryAfter),
          "X-RateLimit-Limit": String(BURST_LIMIT),
          "X-RateLimit-Window": "1h",
        },
      }
    );
  }

  const result = await lookupCompanyByTaxID(id, {
    signal: AbortSignal.timeout(8000),
  });

  return Response.json(result, {
    status: result.exists ? 200 : 404,
    headers: {
      ...NO_INDEX_HEADERS,
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}

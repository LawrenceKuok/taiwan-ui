import type { NextRequest } from "next/server";
import { lookupCompanyByTaxID } from "@/lib/server";
import { checkRateLimit, getClientIP } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const LIMIT = 30;
const WINDOW_MS = 60_000;

/**
 * GET /api/lookup/tax-id?id=04595252
 *
 * Pairs the format/checksum validator with an authoritative existence
 * check against 商業司 公司基本資料.
 *
 * Rate limit: 30/min/IP. Backed by the same KV-pluggable rate limiter
 * used by /api/submit (Upstash / Vercel KV when configured, in-memory
 * otherwise).
 *
 * This is a reference implementation. Production callers should add
 * caching (the underlying 商業司 dataset only changes daily) — wrap with
 * Redis / Vercel Cache as appropriate.
 */
export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const id = url.searchParams.get("id")?.trim() ?? "";

  if (!id) {
    return Response.json(
      { error: "Missing required query parameter: id" },
      { status: 400 }
    );
  }

  // 8-char alphanumeric only — defense-in-depth before passing to upstream
  if (id.length > 16 || !/^[A-Za-z0-9]+$/.test(id)) {
    return Response.json(
      { error: "Invalid tax ID format." },
      { status: 400 }
    );
  }

  const ip = getClientIP(request.headers);
  const rl = await checkRateLimit({
    scope: "lookup-tax-id",
    key: ip,
    limit: LIMIT,
    windowMs: WINDOW_MS,
  });
  if (!rl.allowed) {
    const retryAfter = Math.max(Math.ceil((rl.resetAt - Date.now()) / 1000), 1);
    return Response.json(
      { error: "Too many requests." },
      {
        status: 429,
        headers: {
          "Retry-After": String(retryAfter),
          "X-RateLimit-Limit": String(LIMIT),
        },
      }
    );
  }

  const result = await lookupCompanyByTaxID(id, {
    signal: AbortSignal.timeout(8000),
  });

  // 商業司 records are public, but downstream callers may want to cache —
  // hint that this can sit in CDN/edge cache for an hour.
  return Response.json(result, {
    status: result.exists ? 200 : 404,
    headers: {
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}

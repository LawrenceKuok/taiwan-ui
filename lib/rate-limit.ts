/**
 * Pluggable rate limiter.
 *
 * The runtime picks a backend in this order:
 *   1. Upstash Redis REST  — if UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN are set
 *   2. Vercel KV (same protocol) — if KV_REST_API_URL + KV_REST_API_TOKEN are set
 *   3. In-memory fallback  — per-instance Map. Fine for a single-region Vercel
 *      deployment; resets on cold starts. DO NOT rely on this for abuse
 *      prevention at scale — configure a KV backend for production.
 *
 * All backends share the same fixed-window algorithm: N requests per
 * windowMs per key. Returns { allowed, remaining, resetAt }.
 */

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number;
}

export interface RateLimitOptions {
  /** Unique rule id (e.g. "submit") — prefix for keys. */
  scope: string;
  /** Bucket key (e.g. IP address). */
  key: string;
  /** Max requests per window. */
  limit: number;
  /** Window length in milliseconds. */
  windowMs: number;
}

// ---------- in-memory backend ----------

const MEM_BUCKETS = new Map<string, { count: number; resetAt: number }>();

function memoryLimit(opts: RateLimitOptions): RateLimitResult {
  const now = Date.now();
  const k = `${opts.scope}:${opts.key}`;
  const b = MEM_BUCKETS.get(k);

  // Opportunistic cleanup so the Map doesn't grow forever on long-lived instances.
  if (MEM_BUCKETS.size > 10_000) {
    for (const [mk, mv] of MEM_BUCKETS) if (mv.resetAt < now) MEM_BUCKETS.delete(mk);
  }

  if (!b || b.resetAt < now) {
    const resetAt = now + opts.windowMs;
    MEM_BUCKETS.set(k, { count: 1, resetAt });
    return { allowed: true, remaining: opts.limit - 1, resetAt };
  }
  if (b.count >= opts.limit) {
    return { allowed: false, remaining: 0, resetAt: b.resetAt };
  }
  b.count += 1;
  return { allowed: true, remaining: opts.limit - b.count, resetAt: b.resetAt };
}

// ---------- upstash / vercel-kv REST backend ----------

function getKvConfig(): { url: string; token: string } | null {
  const url =
    process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL ?? null;
  const token =
    process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN ?? null;
  if (url && token) return { url, token };
  return null;
}

async function kvLimit(opts: RateLimitOptions): Promise<RateLimitResult> {
  const cfg = getKvConfig();
  if (!cfg) return memoryLimit(opts);

  const k = `rl:${opts.scope}:${opts.key}`;
  const windowSec = Math.ceil(opts.windowMs / 1000);

  // Pipeline: INCR then EXPIRE-IF-FIRST. Both are atomic on the Redis side.
  try {
    const res = await fetch(`${cfg.url}/pipeline`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${cfg.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify([
        ["INCR", k],
        ["EXPIRE", k, String(windowSec), "NX"],
        ["PTTL", k],
      ]),
      // Keep budget tight — a slow limiter should fail open, not hang the request.
      signal: AbortSignal.timeout(1500),
    });

    if (!res.ok) return memoryLimit(opts); // fail-open to memory
    const data = (await res.json()) as Array<{ result: number }>;
    const count = Number(data[0]?.result ?? 0);
    const pttl = Number(data[2]?.result ?? opts.windowMs);
    const resetAt = Date.now() + Math.max(pttl, 0);

    if (count > opts.limit) {
      return { allowed: false, remaining: 0, resetAt };
    }
    return { allowed: true, remaining: Math.max(opts.limit - count, 0), resetAt };
  } catch {
    // Fail open — but prefer availability over strict enforcement when KV is down.
    return memoryLimit(opts);
  }
}

// ---------- public API ----------

export async function checkRateLimit(opts: RateLimitOptions): Promise<RateLimitResult> {
  if (getKvConfig()) return kvLimit(opts);
  return memoryLimit(opts);
}

/** Extract the best-available client IP from a request's headers. */
export function getClientIP(headers: Headers): string {
  const fwd = headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0]!.trim();
  return headers.get("x-real-ip") ?? "unknown";
}

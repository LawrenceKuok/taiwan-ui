# Example 05 — Pairing Client Format Validation with Server-Side Lookup

## Scenario

A B2B SaaS needs to verify that the company tax ID a user enters at signup actually exists in the 商業司 database — not just that the format is valid. Format-only validation can pass on numbers that look correct but don't correspond to any real company.

This is the canonical "format ≠ existence ≠ identity" pattern that Forge's `GOVT_READINESS.md` warns about.

## What you'll build

A two-layer validation pattern:

1. **Client side**: `CompanyTaxIDInput` validates format + checksum live (instant feedback)
2. **Server side**: on submit, hit `/api/lookup/tax-id?id=...` which calls 商業司 `gcis.nat.gov.tw` and returns whether the company is real, currently registered, and what its name / status / address are

## Components used

- `CompanyTaxIDInput` (client)
- `lib/server/lookupCompanyByTaxID()` (server-side wrapper)
- The built-in `/api/lookup/tax-id` Route Handler (or build your own)

## Code: client component

```tsx
"use client";

import { useState } from "react";
import { CompanyTaxIDInput, type TaxIDValidationResult } from "@taiwan-ui/react";

interface ServerLookup {
  exists: boolean;
  companyName?: string;
  status?: string;
  reason?: string;
}

export default function CompanySignupForm() {
  const [taxId, setTaxId] = useState("");
  const [formatResult, setFormatResult] = useState<TaxIDValidationResult | null>(null);
  const [serverResult, setServerResult] = useState<ServerLookup | null>(null);
  const [verifying, setVerifying] = useState(false);

  async function verifyOnServer() {
    if (!formatResult?.valid) return;
    setVerifying(true);
    setServerResult(null);
    try {
      const res = await fetch(`/api/lookup/tax-id?id=${encodeURIComponent(formatResult.raw)}`);
      const data = (await res.json()) as ServerLookup;
      setServerResult(data);
    } catch {
      setServerResult({ exists: false, reason: "network" });
    } finally {
      setVerifying(false);
    }
  }

  return (
    <form className="space-y-4 max-w-md">
      <div>
        <label htmlFor="tax-id" className="block text-sm font-medium mb-1">
          公司統一編號
        </label>
        <div className="flex gap-2">
          <CompanyTaxIDInput
            value={taxId}
            onChange={(raw, result) => {
              setTaxId(raw);
              setFormatResult(result);
              setServerResult(null); // reset on any change
            }}
          />
          <button
            type="button"
            onClick={verifyOnServer}
            disabled={!formatResult?.valid || verifying}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white disabled:opacity-50 whitespace-nowrap"
          >
            {verifying ? "查詢中…" : "查 商業司"}
          </button>
        </div>

        {/* Layer 1: client-side format result */}
        {formatResult && !formatResult.valid && (
          <p role="alert" className="text-xs text-red-500 mt-1">
            格式錯誤：{formatResult.reason}
          </p>
        )}
        {formatResult?.valid && !serverResult && (
          <p className="text-xs text-yellow-500 mt-1">
            ✓ 格式正確 — 點「查 商業司」確認此公司是否存在
          </p>
        )}

        {/* Layer 2: server-side existence result */}
        {serverResult?.exists && (
          <div className="mt-2 p-3 rounded-lg bg-green-500/10 border border-green-500/30 text-xs">
            <p className="text-green-400 font-medium">✓ 已驗證</p>
            <p className="mt-1">公司名稱：{serverResult.companyName}</p>
            <p>登記狀態：{serverResult.status}</p>
          </div>
        )}
        {serverResult && !serverResult.exists && (
          <p role="alert" className="text-xs text-red-500 mt-1">
            ⚠ 商業司無此公司紀錄（{serverResult.reason}）。請確認統編無誤，或此公司可能尚未登記/已歇業。
          </p>
        )}
      </div>
    </form>
  );
}
```

## Code: server side (already shipped in Forge)

The `/api/lookup/tax-id` Route Handler exists in this repo at `app/api/lookup/tax-id/route.ts`. Here's a simplified version for use in your own Next.js app:

```ts
// app/api/lookup/tax-id/route.ts
import { lookupCompanyByTaxID } from "@taiwan-ui/react/server";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const id = url.searchParams.get("id")?.trim() ?? "";

  if (!id) {
    return Response.json({ error: "Missing id" }, { status: 400 });
  }

  const result = await lookupCompanyByTaxID(id, {
    signal: AbortSignal.timeout(8000),
  });

  return Response.json(result, {
    status: result.exists ? 200 : 404,
    headers: {
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
```

## Notes & gotchas

### 1. Why two layers, not one

The client-side checksum validator runs instantly and gives the user immediate feedback. The server-side existence check is comparatively slow (200ms–2s, network-bound) and rate-limited. Keeping them separate gives users immediate format feedback while reserving the slower lookup for the critical verification moment (e.g. before payment, before account creation).

### 2. Cache aggressively

商業司 公司基本資料 only updates daily. Cache the lookup result for at least an hour at the edge / CDN, and longer in your own database if you're storing customer records:

```
Cache-Control: public, s-maxage=3600, stale-while-revalidate=86400
```

### 3. Rate limiting

The 商業司 API doesn't publish hard rate limits but begins returning 429 around ~100 req/min from a single IP. Use the rate limiter in `lib/rate-limit.ts` (or any KV-backed limiter) to protect your route from abuse.

### 4. Failure modes to handle

The server lookup can fail in five ways:

| `reason` | Meaning | UX recommendation |
|---|---|---|
| `format` | Format is wrong | Show inline format error |
| `checksum` | Checksum failed | Show "請確認統編無誤" |
| `not-found` | Format OK, but no company | Show "商業司無此公司紀錄" |
| `rate-limited` | API rate-limited | Retry with backoff |
| `network` | Network error / timeout | Retry once, then degrade gracefully |

### 5. What this does NOT verify

- Whether the person filling out the form is **authorized** to act on behalf of that company (use OAuth + 公司負責人 verification)
- Whether the company is currently **operating** (look at `statusCode` — 「核准設立」 ≠ "operating")
- **Sanctions / KYC compliance** — that's a separate API and process

### 6. Privacy note

商業司 公司資料 is **public record** (公司法 §393). Logging tax ID lookups is legally fine, but you SHOULD NOT log them alongside personal information in a way that creates a tracking profile. Keep server logs separate and aggregate-only.

## Real-world variants

- **Auto-fill company name field**: when lookup succeeds, populate the company-name field for the user
- **Webhook on company status change**: poll 商業司 daily for monitored companies, notify if status changes to 解散 / 撤銷
- **B2B fraud detection**: companies registered very recently or with very low capital are higher fraud risk — you have this data from the lookup result

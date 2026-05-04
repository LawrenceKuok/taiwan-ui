# Example 02 — Invoice / Receipt Entry at E-Commerce Checkout

## Scenario

A Taiwanese e-commerce site needs the standard 台灣電子發票 selector during checkout: customer picks between phone-barcode carrier (手機條碼載具), donation to charity (捐贈發票), or company tax ID (公司戶統編).

## What you'll build

A radio-style invoice selector that:

- Defaults to "donate to charity" (the most common choice for individuals)
- Shows the appropriate input field based on selection
- Validates phone-barcode format (`/XXXXXXX`) live
- Validates company tax ID with checksum + 7-rule
- Stores result in shopping-cart state for backend submission

## Components used

- `PhoneBarcodeInput` (手機條碼載具)
- `CompanyTaxIDInput` (統編)
- `UniformInvoiceInput` (optional — for receipt-number lookup later)

## Code

```tsx
"use client";

import { useState } from "react";
import {
  PhoneBarcodeInput,
  CompanyTaxIDInput,
  type BarcodeValidationResult,
  type TaxIDValidationResult,
} from "@taiwan-ui/react";

type InvoiceMode = "donate" | "phone-barcode" | "company";

export interface InvoiceSelection {
  mode: InvoiceMode;
  carrierBarcode?: string;
  companyTaxId?: string;
  donationCode?: string;
}

export default function InvoiceSelector({
  value,
  onChange,
}: {
  value: InvoiceSelection;
  onChange: (v: InvoiceSelection) => void;
}) {
  const [barcodeResult, setBarcodeResult] =
    useState<BarcodeValidationResult | null>(null);
  const [taxIdResult, setTaxIdResult] =
    useState<TaxIDValidationResult | null>(null);

  return (
    <fieldset className="space-y-4">
      <legend className="text-sm font-medium mb-2">發票開立方式</legend>

      {/* Mode selector */}
      <div className="grid grid-cols-3 gap-2">
        {(
          [
            { v: "donate", label: "捐贈發票", subtitle: "donate" },
            { v: "phone-barcode", label: "手機條碼", subtitle: "carrier" },
            { v: "company", label: "公司統編", subtitle: "B2B" },
          ] as const
        ).map((opt) => (
          <button
            key={opt.v}
            type="button"
            onClick={() => onChange({ ...value, mode: opt.v })}
            className={`px-3 py-3 rounded-lg border text-sm font-medium ${
              value.mode === opt.v
                ? "border-blue-500 bg-blue-500/10 text-blue-400"
                : "border-gray-700"
            }`}
            aria-pressed={value.mode === opt.v}
          >
            <div>{opt.label}</div>
            <div className="text-[10px] opacity-60 mt-0.5">{opt.subtitle}</div>
          </button>
        ))}
      </div>

      {/* Mode-specific input */}
      {value.mode === "donate" && (
        <div>
          <label htmlFor="donate" className="block text-xs mb-1">
            捐贈代碼（選填）
          </label>
          <input
            id="donate"
            type="text"
            value={value.donationCode ?? ""}
            onChange={(e) =>
              onChange({ ...value, donationCode: e.target.value })
            }
            placeholder="例：56895991（伊甸基金會）"
            className="w-full px-3 py-2 border rounded-lg"
          />
          <p className="text-[10px] text-gray-500 mt-1">
            空白將捐贈給平台預設社福機構。
          </p>
        </div>
      )}

      {value.mode === "phone-barcode" && (
        <div>
          <label htmlFor="barcode" className="block text-xs mb-1">
            手機條碼載具
          </label>
          <PhoneBarcodeInput
            value={value.carrierBarcode ?? ""}
            onChange={(raw, result) => {
              onChange({ ...value, carrierBarcode: raw });
              setBarcodeResult(result);
            }}
          />
          <p className="text-[10px] text-gray-500 mt-1">
            格式：/ABC+123（共 8 字元，斜線開頭 + 7 字英數字）
          </p>
        </div>
      )}

      {value.mode === "company" && (
        <div>
          <label htmlFor="tax-id" className="block text-xs mb-1">
            公司統一編號
          </label>
          <CompanyTaxIDInput
            value={value.companyTaxId ?? ""}
            onChange={(raw, result) => {
              onChange({ ...value, companyTaxId: raw });
              setTaxIdResult(result);
            }}
          />
        </div>
      )}
    </fieldset>
  );
}
```

## Notes & gotchas

### 1. The "donate" default is the right default for B2C

Roughly 70% of individual receipts in Taiwan are donated. Defaulting to it improves conversion vs. forcing a positive choice.

### 2. Server-side: still verify the tax ID exists

Even when `taxIdResult.valid` is true, the company might not be currently active. For B2B invoices, hit `/api/lookup/tax-id?id=...` server-side at order confirmation — show the actual registered company name back to the user before charging:

```ts
const lookup = await fetch(`/api/lookup/tax-id?id=${taxId}`).then(r => r.json());
if (lookup.exists) {
  return `已確認：${lookup.companyName}`;
}
```

### 3. Phone barcode characters

The 手機條碼 character set is `[0-9A-Z.+-]` only. Lowercase is auto-uppercased. Reject anything else (the input does this automatically).

### 4. Persisting the choice

Most repeat customers want the same choice (their company tax ID, their barcode). Persist to `localStorage` keyed by user ID — don't make them re-enter every order.

### 5. Government API for invoice issuance

Once you have the `mode` + relevant identifier, the actual invoice issuance happens via a third-party EIP (電子發票服務平台) provider — not in the browser. Ezpay, Pay2go, Allpay, EcPay, etc. Forge handles input validation; the issuance itself is your e-invoicing provider's responsibility.

## Real-world variants

- **B2B-only checkout**: drop "donate" mode entirely; require company tax ID
- **Cross-border** (Taiwan customer buying from non-Taiwan merchant): may not need invoice fields at all — check 進口關稅 rules
- **Recurring subscriptions**: persist the invoice choice in the customer record, not per-order

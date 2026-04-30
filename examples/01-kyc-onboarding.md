# Example 01 — KYC Onboarding for a Taiwanese SaaS

## Scenario

A SaaS product needs a one-step onboarding flow that captures a new user's national ID, phone, and address — with proper Taiwan-localized validation, accessibility, and dark-mode support.

## What you'll build

A single-screen onboarding form that:

- Validates the TWID with checksum + region detection
- Accepts both new-format (2021+) ARC and citizen IDs
- Phone field auto-detects mobile vs landline and formats accordingly
- Address field cascades 縣市 → 區 → 路 with postal-code auto-fill
- Submits only when all three are valid; shows accessible error messaging otherwise

## Components used

- `TWIDInput` (身分證 / 居留證)
- `TWPhoneInput` (電話)
- `TaiwanAddressInput` (地址)

## Code

```tsx
"use client";

import { useState } from "react";
import {
  TWIDInput,
  TWPhoneInput,
  TaiwanAddressInput,
  type TWIDValidationResult,
  type PhoneValidationResult,
  type AddressValue,
} from "@taiwan-ui/react";

export default function OnboardingForm({
  onComplete,
}: {
  onComplete: (data: { twid: string; phone: string; address: AddressValue }) => void;
}) {
  const [twid, setTwid] = useState("");
  const [twidResult, setTwidResult] = useState<TWIDValidationResult | null>(null);
  const [phone, setPhone] = useState("");
  const [phoneResult, setPhoneResult] = useState<PhoneValidationResult | null>(null);
  const [address, setAddress] = useState<AddressValue>({
    city: "",
    district: "",
    detail: "",
    postal: "",
  });

  const allValid =
    twidResult?.valid &&
    phoneResult?.valid &&
    address.city &&
    address.district &&
    address.detail.length > 3;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!allValid || !twidResult || !phoneResult) return;
        onComplete({ twid: twidResult.raw, phone: phoneResult.formatted, address });
      }}
      className="space-y-6 max-w-md mx-auto p-6"
    >
      <header>
        <h1 className="text-2xl font-bold">歡迎，請完成註冊</h1>
        <p className="text-sm text-gray-500 mt-1">
          Welcome — please complete your profile.
        </p>
      </header>

      <div>
        <label htmlFor="twid" className="block text-sm font-medium mb-1">
          身分證 / 居留證
        </label>
        <TWIDInput
          value={twid}
          onChange={(raw, result) => {
            setTwid(raw);
            setTwidResult(result);
          }}
          ariaLabel="身分證或居留證號碼"
        />
        {twidResult?.valid && twidResult.region && (
          <p className="text-xs text-green-600 mt-1">
            ✓ 戶籍地：{twidResult.region}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-medium mb-1">
          聯絡電話
        </label>
        <TWPhoneInput
          value={phone}
          onChange={(raw, result) => {
            setPhone(raw);
            setPhoneResult(result);
          }}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">通訊地址</label>
        <TaiwanAddressInput value={address} onChange={setAddress} />
      </div>

      <button
        type="submit"
        disabled={!allValid}
        className="w-full py-3 rounded-lg bg-blue-600 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
      >
        完成註冊 · Submit
      </button>
    </form>
  );
}
```

## Notes & gotchas

### 1. ARC vs citizen distinction

`twidResult.type` will be `"citizen"`, `"arc-new"`, or `"arc-legacy"`. If your business logic differs (e.g. ARC holders need extra docs), branch on this:

```tsx
if (twidResult.type === "arc-new" || twidResult.type === "arc-legacy") {
  // route to ARC-specific flow
}
```

### 2. Phone formatting strategy

`TWPhoneInput` returns `result.formatted` in the canonical 09XX-XXX-XXX (mobile) or (02) XXXX-XXXX (landline) form. Submit `result.formatted` to your backend, not the raw user input — this normalizes inputs like `0912 345 678`, `+886 912-345-678`, and `0912345678` to one canonical shape.

### 3. Address postal code

`address.postal` is auto-populated when 縣市 + 區 are both selected. Do NOT make it user-editable — manual entry causes ~3% data quality issues per published 中華郵政 audits.

### 4. Server-side double-check (recommended)

Even with valid client-side format validation, hit `/api/lookup/tax-id?id=...` (or your own equivalent) for any data that needs cross-reference against an authoritative source. See [example 05](./05-server-side-validation.md).

### 5. Accessibility

All Taiwan UI inputs ship `aria-invalid`, `aria-describedby`, and `role="alert"` semantics by default. The `<label htmlFor>` pattern above is what completes the accessibility loop — don't replace labels with placeholders.

### 6. Dark mode

Components read CSS custom properties (`var(--background)`, `var(--card-border)`, etc.) so they inherit your app's theme automatically. Set those vars at the document root.

## Real-world variants of this pattern

- **Bank account opening**: add `BankAccountInput` after `TaiwanAddressInput`
- **Insurance underwriting**: add `ROCDatePicker` for date-of-birth (民國 calendar is what Taiwanese users expect)
- **Healthcare signup**: add `NHICardInput` (and remember it's format-only — pair with backend 健保署 SDK)

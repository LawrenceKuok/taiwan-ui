# Examples

Real-world integration examples showing how to use Taiwan UI in production scenarios. Each example is intentionally minimal — focused on showing the pattern, not on being a full app.

## Available examples

| File | Scenario | Key components used |
|---|---|---|
| [`01-kyc-onboarding.md`](./01-kyc-onboarding.md) | KYC onboarding form for a Taiwanese SaaS | TWIDInput, TaiwanAddressInput, TWPhoneInput |
| [`02-invoice-receipt.md`](./02-invoice-receipt.md) | Invoice / receipt entry for an e-commerce checkout | UniformInvoiceInput, PhoneBarcodeInput, CompanyTaxIDInput |
| [`03-employee-record.md`](./03-employee-record.md) | HR system: full employee record with tax + bank | TWIDInput, BankAccountInput, TaxBracketCalculator, ROCDatePicker |
| [`04-vehicle-registration.md`](./04-vehicle-registration.md) | Vehicle insurance quote form | LicensePlateInput, ROCDateRangePicker, CompanyTaxIDInput |
| [`05-server-side-validation.md`](./05-server-side-validation.md) | Pairing client format validation with server-side 商業司 lookup | `lib/server/lookupCompanyByTaxID` |

## How to use these

These are reference implementations. Copy the relevant snippets into your own Next.js / React project — they assume:

- React 18 or higher
- TypeScript (the patterns work in plain JS too, just remove type annotations)
- You've installed `@taiwan-ui/react` OR copied components via `npx taiwan-ui add`

## Structure of each example

Every example follows the same shape:

1. **Scenario** — what real-world problem this solves
2. **What you'll build** — the user-visible result
3. **Components used** — the Taiwan UI pieces involved
4. **Code** — full working snippet
5. **Notes & gotchas** — what to watch out for in production

## Contributing examples

Have a real-world Taiwan UI integration story you want to share? Open a PR adding it here. Good examples come from real production code, not hypothetical "Hello World" demos. Even short snippets from your team's actual codebase (with proprietary parts redacted) are valuable.

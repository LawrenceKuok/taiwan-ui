# Changelog

The canonical, always-current changelog lives in `lib/changelog.ts` and is rendered at https://taiwan-ui.vercel.app/changelog.

## [0.4.0] — 2026-04-15 — Developer platform

- **Added** Registry API (`/api/registry`, `/api/registry/[slug]`)
- **Added** `taiwan-ui` CLI (`add`, `list`, `init`) — zero deps, shadcn-style source copy
- **Added** Interactive Playground with auto-generated prop controls
- **Added** URL query-param sync on /components (q, category, status, sort)
- **Added** Changelog, contributing, and submission pages
- **Added** Vercel Analytics

## [0.3.0] — 2026-04-10 — Taiwan-specific component expansion

- **Added** 7 components: CompanyTaxIDInput, PhoneBarcodeInput, TWPhoneInput, LicensePlateInput, NHICardInput, BankAccountInput, eGUIInvoice

## [0.2.0] — 2026-04-05 — Platform foundation

- **Added** Component detail pages, browse & search, registry data layer
- **Added** Full security header suite (CSP, HSTS, X-Frame-Options, Referrer-Policy, Permissions-Policy)
- **Added** npm package scaffolding for `@taiwan-ui/react`

## [0.1.0] — 2026-03-28 — Initial release

- **Added** ROCDatePicker, TWIDInput, TaiwanAddressInput, TaiwanPaymentButton, UniformInvoiceInput

# Changelog

The canonical, always-current changelog lives in `lib/changelog.ts` and is rendered at https://taiwan-ui.vercel.app/changelog.

Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/). Versions follow [SemVer](https://semver.org/).

## [0.1.0] — 2026-04-15 — Initial public release

### Added

- 12 Taiwan-specific components (ROCDatePicker, TWIDInput, TaiwanAddressInput, TaiwanPaymentButton, UniformInvoiceInput, CompanyTaxIDInput, PhoneBarcodeInput, TWPhoneInput, LicensePlateInput, NHICardInput, BankAccountInput, eGUIInvoice)
- 7 pure-function validators in `lib/validators/` with 114 passing vitest tests against published specs (戶政司, 財政部, NCC, 公路總局)
- Component browse and detail pages (`/components`, `/components/[slug]`) with props tables, code examples, and interactive Playground
- Registry API (`/api/registry`, `/api/registry/[slug]`) and `taiwan-ui` CLI source (npm publish pending)
- Full security header suite: CSP, HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy
- Submission endpoint (`/api/submit`) with pluggable rate limiter (Upstash / Vercel KV, memory fallback)
- Privacy, Terms, Security pages and `SECURITY.md` disclosure policy
- GitHub Actions CI running typecheck, tests, build, and `npm audit --audit-level=high`
- sitemap.xml, robots.txt, Vercel Analytics
- `GOVT_READINESS.md` — honest self-assessment of what separates this from a procurement-grade deliverable

[0.1.0]: https://github.com/LawrenceKuok/taiwan-ui/releases/tag/v0.1.0

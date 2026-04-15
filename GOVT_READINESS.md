# Government / Enterprise Readiness — Self-Assessment

This document is an **honest** evaluation of where Taiwan UI stands relative to the bar a government ministry or regulated enterprise (金管會-regulated FI, 健保署 partner, public-sector IT procurement) would actually apply.

Short version: the library is well-engineered for a **public-facing web form** that needs to gate input to Taiwan-specific shapes. It is **not a drop-in replacement for government identity verification**, and no one should pretend otherwise.

## Ready ✅

- **Validators are pure functions** in `lib/validators/` with 114 passing tests against published algorithm specs (戶政司 TWID, 財政部 weights incl. 7-rule, NCC area codes).
- **Zero runtime dependencies** in component packages — minimal supply-chain attack surface.
- **Accessibility**: all inputs have `aria-label`, `aria-invalid`, `aria-describedby`, `role="alert"` on errors, `autoComplete="off"`, `spellCheck={false}`.
- **Security headers** (CSP, HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy) on all routes.
- **CI enforces** typecheck + test + build + `npm audit --audit-level=high` on every PR.
- **Rate limiting** on `/api/submit` with a KV-pluggable backend (Upstash / Vercel KV).
- **PDPA posture**: validators are client-side; no validated input is logged or exfiltrated.
- **Legal pages**: `/privacy`, `/terms`, `/security`, plus `SECURITY.md` with disclosure policy.

## Not ready ❌

This is what still separates the library from a GSA-grade deliverable:

1. **No real-world identity verification.** Format + checksum ≠ "this person exists." For KYC, prescription, or benefits-eligibility flows, callers MUST hit the relevant government API (戶政司, 商業司, 健保署). The library does not, and should not, make that call.
2. **No penetration test on file.** `npm audit` is a floor, not a ceiling. A third-party pentest against the submission API, CSP, and the demo pages has not been commissioned.
3. **No SOC 2 / ISO 27001 controls.** We run on Vercel; Vercel has certifications, we do not inherit them automatically.
4. **Rate limiter is fail-open.** If KV is unreachable, the middleware falls back to per-instance memory. A determined attacker can bypass by cycling IPs — this is a demo-site tradeoff, not an abuse-prevention system.
5. **Bank directory is partial.** `data/taiwan-banks.json` covers ~100 institutions including 中華郵政, 農漁會, 信用合作社, and digital banks, but is not authoritative; consult 金管會 for the current complete list.
6. **No formal threat model.** STRIDE / attack-tree documents have not been produced.
7. **Email `security@taiwan-ui.dev` / `privacy@taiwan-ui.dev` are placeholders.** Wire up real inboxes before claiming the disclosure policy is operational.
8. **No i18n runtime.** Dictionaries exist in `i18n/` but routes are not yet under `app/[locale]/`. Site is bilingual by virtue of hardcoded 中/EN strings.
9. **No PII-in-logs review.** We believe the submission endpoint redacts/caps field lengths, but a formal log audit has not been performed.
10. **No signed releases.** npm packages are not yet published; when they are, they should use `npm publish --provenance` + SLSA attestation.

## If you're considering production use

- **Small business / indie SaaS**: probably fine today, with the caveat that format validation is not identity verification.
- **Government or regulated FI**: treat this as a starting point. You will need your own pen test, threat model, signed dependencies, SLA'd monitoring, and backing server-side calls to the actual authoritative registries.
- **Healthcare (健保)**: absolutely require the 讀卡機 SDK on the server side. The 12-digit NHI validator here is format-only by design.

Keep the library's scope honest and it stays useful. Pretend it's more than a validated-input UI layer and it becomes a compliance risk.

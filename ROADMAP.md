# Roadmap

This is the public roadmap for Taiwan UI. Dates are intent, not promises — adjusted as the project evolves and as community feedback lands.

> Current version: **0.1.0** · 21 components · 157 tests · live at https://taiwan-ui.vercel.app

---

## v0.2 — Distribution & Adoption  ·  Q2 2026

The 0.1 release proved the technical foundation. v0.2 is about getting the library into actual developers' hands.

- [ ] Publish `@taiwan-ui/react` to npm with provenance (SLSA L3)
- [ ] Publish `taiwan-ui` CLI to npm
- [ ] CDN-hosted ESM bundle for `<script type="module">` use
- [ ] Bilingual docs site (中/EN) under `app/[locale]/`
- [ ] First-class Storybook with all 21 components
- [ ] Migration guide from common DIY patterns (e.g. "if you have a hand-rolled TWID validator, here's how to drop in `@taiwan-ui/react`")
- [ ] First 5 case-study projects using the library in production

**Success metric**: 500+ weekly npm downloads. 100+ GitHub stars. 3+ named adopters.

---

## v0.3 — Government API Integration  ·  Q3 2026

Format validation is half the story. v0.3 closes the loop by providing **server-side wrappers** around the authoritative Taiwan government APIs — without changing the client-side scope of the library.

- [ ] `@taiwan-ui/server-twid` — wrapper around 戶政司 身分證真偽驗證 API (requires applicant to register their own credentials with 內政部)
- [ ] `@taiwan-ui/server-tax-id` — wrapper around 商業司 `gcis.nat.gov.tw` company-search API (public, no credentials)
- [ ] `@taiwan-ui/server-invoice-prize` — wrapper around 財政部 bimonthly winning-numbers feed
- [ ] Documentation pattern: `<TWIDInput onValidate={validateAgainst戶政司}>` showing how to compose the format validator with a server-side authoritative check
- [ ] Reference Next.js example app demonstrating end-to-end identity verification

**Success metric**: At least one Taiwan government project using a `@taiwan-ui/server-*` wrapper.

---

## v0.4 — Accessibility & Compliance  ·  Q4 2026

Hardens the library for use in regulated industries (health, finance, government).

- [ ] Full WCAG 2.2 AA audit on every component (third-party — not self-audit)
- [ ] Screen reader testing with Taiwan-localized assistive tech (中華民國視障者教育協會 partnership)
- [ ] CNS 27001 / GCB self-assessment documentation
- [ ] Penetration test of the docs site + submission API (commissioned)
- [ ] Bilingual SECURITY.md disclosure timeline + real on-call inbox
- [ ] Statement of compliance with 個資法 (PDPA) for the validators
- [ ] Threat model document (STRIDE) for the API surfaces

**Success metric**: First government RFP citing Taiwan UI as an accepted dependency.

---

## v0.5 — Ecosystem  ·  Q1 2027

Expands beyond React.

- [ ] `@taiwan-ui/vue` — Vue 3 ports of all components (community-maintained)
- [ ] `@taiwan-ui/svelte` — Svelte 5 ports (community-maintained)
- [ ] `@taiwan-ui/core` — framework-agnostic vanilla-JS validators + formatters
- [ ] React Native port for the most-requested components (TWIDInput, TaiwanCurrencyInput, ROCDatePicker)

**Success metric**: 1+ contributors per framework port. Cross-framework adoption.

---

## v1.0 — Stable API  ·  Q2 2027

API freeze. Semantic-versioning commitments. Long-term-support story.

- [ ] All component APIs locked (breaking changes require major version bump)
- [ ] LTS branch policy (security patches for 18 months minimum)
- [ ] Documented deprecation policy
- [ ] Sponsor program for ongoing maintenance
- [ ] Conference talk track (COSCUP, MOPCON, SITCON)

**Success metric**: 5,000+ weekly npm downloads. 500+ GitHub stars. 10+ named production adopters. At least one government agency using it.

---

## Post-1.0 ideas (unscheduled)

These are interesting but not committed:

- Visual builder UI for composing forms from Taiwan UI components
- AI-assisted form-schema → component generation
- Component variants for legal/government 公文 style (more formal typography)
- Print-friendly variants for invoice / contract rendering
- Direct integration with popular Taiwan SaaS (LINE Pay, JKO Pay, ECPay) as opt-in modules
- Localization for Hong Kong / Macau identifiers (separate `@taiwan-ui/hk` package)

---

## How decisions get made

Roadmap items are added based on:

1. **Real adopter requests** (counts more than speculation)
2. **Community polls** in g0v Slack `#taiwan-ui` channel
3. **Sponsor priorities** when grants are tied to specific deliverables
4. **Maintainer judgement** for technical-debt and infrastructure items

The maintainer reserves the right to remove or reschedule any item. Items in **v0.2** and **v0.3** are highest-confidence — anything beyond that is directional.

## How to influence the roadmap

- Open an issue with the `roadmap` label
- Discuss in g0v Slack `#taiwan-ui` (once channel exists)
- Sponsor a specific feature via grant or direct funding (see SPONSORING.md, coming v0.2)

# Taiwan UI

A component library and documentation site for Taiwan-specific form inputs — 民國紀年 (ROC calendar), 身分證字號 (TWID), 統一編號 (統編), 電話, 車牌, 健保卡, 地址, 統一發票, 電子支付. Zero runtime dependencies, dark-first, accessibility-hardened.

> **Status: pre-1.0**. The validators have test coverage against published specs, but nothing in this repository has been through a formal government procurement audit. See [GOVT_READINESS.md](./GOVT_READINESS.md) for an honest self-assessment.

- **Site**: https://taiwan-ui.vercel.app
- **Package**: `@taiwan-ui/react` (React 18+)
- **CLI**: `npx taiwan-ui add <component>` (shadcn-style source copy)

## What's in the box

**Validators** (pure, tested, zero-dep) under `lib/validators/`:

| Module | Validates | Spec source |
|---|---|---|
| `twid` | 身分證字號, new-format ARC (2021+) | 內政部戶政司 |
| `tax-id` | 8-digit 統一編號 + 7-rule | 財政部 |
| `phone` | Mobile + landline with full area-code table incl. 馬祖 (0836), 烏坵 (0826), 金門 (082) | NCC 號碼計畫 |
| `uniform-invoice` | Uniform invoice number format | 財政部 |
| `phone-barcode` | 手機條碼載具 `/XXXXXXX` | 財政部電子發票平台 |
| `license-plate` | Car (new + legacy) and motorcycle plate formats | 交通部公路總局 |
| `nhi-card` | 12-digit 健保卡卡號 (format only) | 衛福部健保署 |

**Components** under `components/taiwan/` — each is a thin React wrapper around one validator with accessible labels, error messaging, and auto-formatting.

## Scope: what this is NOT

These validators check **format and checksum** only. They deliberately do not:

- Verify a TWID belongs to a real citizen (requires 戶政司 API + legal basis)
- Verify a 統編 corresponds to an active company (use 商業司 `gcis.nat.gov.tw` API)
- Verify a NHI card number is active (requires 讀卡機 SDK from 健保署)
- Look up prize-winning invoice numbers (use 財政部 bimonthly feed)
- Handle government, military, or diplomatic license plates (out of scope)

Using only format validation for high-stakes identity flows (banking KYC, prescription dispensing, government service eligibility) is **insufficient**. Back these with a server-side call to the appropriate authority.

## Install

```bash
# Shadcn-style: copies source into your repo
npx taiwan-ui add twid-input

# Or use the npm package
npm i @taiwan-ui/react
```

```tsx
import { TWIDInput } from "@taiwan-ui/react";

<TWIDInput value={id} onChange={(raw, result) => setId(result.raw)} />
```

## Develop

```bash
npm install
npm run dev           # next dev
npm test              # vitest
npm run test:coverage # vitest + coverage
npm run build         # next build (webpack — see AGENTS.md)
```

## Security

See [SECURITY.md](./SECURITY.md). Report vulnerabilities to `security@taiwan-ui.dev` — do not open a public issue.

## Privacy

The documentation site collects no personal data. Validators run client-side; no validated input leaves the browser. Full policy at `/privacy`.

## License

MIT — see `LICENSE`. Copyright (c) Taiwan UI contributors.

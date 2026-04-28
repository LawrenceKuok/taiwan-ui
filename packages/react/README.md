# @taiwan-ui/react

[![npm version](https://img.shields.io/npm/v/@taiwan-ui/react.svg)](https://www.npmjs.com/package/@taiwan-ui/react)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://github.com/LawrenceKuok/taiwan-ui/blob/main/LICENSE)

React components and pure-function validators for Taiwan-localized form inputs — ROC calendar, national ID, tax ID, NHI card, license plate, phone with full area-code coverage, address, uniform invoice, bank account, and more.

> **Pre-1.0 notice**: This package is in active development. The validators have test coverage against published government specifications, but the React component build is not yet finalized. For immediate use today, consume the source via the `taiwan-ui` CLI:
>
> ```bash
> npx taiwan-ui add twid-input
> ```
>
> See https://taiwan-ui.vercel.app for the live demo and documentation.

## Install

```bash
npm install @taiwan-ui/react
```

## Usage

```tsx
import { TWIDInput } from "@taiwan-ui/react";

export default function SignupForm() {
  return (
    <TWIDInput
      value={id}
      onChange={(raw, result) => {
        if (result.valid) {
          console.log("Valid TWID:", result.region); // "臺北市"
        }
      }}
    />
  );
}
```

For framework-agnostic validation only:

```ts
import { validateTWID, validateTaxID, validatePhone } from "@taiwan-ui/react/validators";

validateTaxID("04595252"); // { valid: true } — TSMC
```

## Components

See the full list with live demos at https://taiwan-ui.vercel.app/components.

## License

MIT — see [LICENSE](https://github.com/LawrenceKuok/taiwan-ui/blob/main/LICENSE).

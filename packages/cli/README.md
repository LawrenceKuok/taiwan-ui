# taiwan-ui

CLI for [Forge](https://taiwan-ui.vercel.app) — Taiwan-specific React components for ROC calendar, TWID validation, 統一編號, 健保卡, 車牌, phone formats, and more.

Follows the shadcn/ui model: **copies source code into your project** rather than installing as a dependency. You own the code.

## Usage

```bash
# List components
npx taiwan-ui list

# Add a component
npx taiwan-ui add roc-date-picker

# Custom target directory
npx taiwan-ui add twid-input --dir src/components
```

## Commands

| Command | Description |
| --- | --- |
| `list` | Show all available components |
| `add <slug>` | Copy a component into your project |
| `init` | Create `components/taiwan/` directory |

## Options

- `--dir <path>` — target directory (default `components/taiwan`)
- `--registry <url>` — registry base URL (default `https://taiwan-ui.vercel.app`)
- `--force` — overwrite existing files

## Zero dependencies

Components have **no runtime deps**. Node 18+ only for the CLI itself (uses built-in `fetch`).

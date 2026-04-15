# Contributing to Taiwan UI

See the live contributing guide at https://taiwan-ui.vercel.app/contributing.

## Quick start

```bash
git clone https://github.com/taiwan-ui/taiwan-ui
cd taiwan-ui
npm install
npm run dev
```

## Adding a component

1. Propose at https://taiwan-ui.vercel.app/submit first.
2. Create `components/taiwan/<ComponentName>/index.tsx` — zero runtime deps, `"use client"` only if necessary.
3. Register in `lib/registry.ts` with slug, props, category, status.
4. Add code examples in `lib/code-examples/<slug>.ts` (exports `basic`, `fullProps`, `formIntegration`).
5. Add an interactive demo variant in `app/components/[slug]/ComponentDemo.tsx`.
6. Run `npm run build` — it must pass cleanly.
7. Open a PR with screenshots and test data.

## Design principles

- **Zero runtime dependencies** — React only.
- **Taiwan-first** — solve real problems Taiwanese developers face.
- **Dark-first with CSS variables** — use `var(--background)` etc.
- **Accessible** — keyboard navigable, ARIA-labeled.
- **TypeScript-first** — export component *and* its types.

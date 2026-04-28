# Hacker News "Show HN" Post

Best timing: **Tuesday 9–11 AM US Pacific** = Wednesday 12–2 AM Taiwan time. Or **Wednesday 9–11 AM US Pacific** = Thursday morning Taiwan time. Avoid Mondays (overwhelmed) and Fridays (low activity).

---

## Title

Pick ONE. They have very different effects:

**Option A — Direct, scannable** (recommended for first-time HN poster):
```
Show HN: Taiwan UI – open-source React components for Taiwan-localized form inputs
```

**Option B — Specific hook** (higher CTR but riskier — bait can backfire):
```
Show HN: Taiwan UI – the validators every Taiwan developer keeps reimplementing
```

**Option C — Self-deprecating / honest** (works well for solo OSS):
```
Show HN: I built a React library for Taiwan-localized forms because I was tired of reimplementing them
```

## Body (the comment that goes with the URL)

```
Hi HN,

I'm Lawrence, recently relocated to Taipei. I open-sourced Taiwan UI — a React component library standardizing the inputs every Taiwan-facing app reimplements: ROC calendar (民國), national ID checksum (身分證), tax ID with 7-rule (統一編號), NHI card, license plate, phone with full area-code coverage, address, uniform invoice, and more.

Why this exists: every digital service handling Taiwan users needs to validate these fields, and most ship hand-rolled implementations with edge-case bugs and missing accessibility. Examples I've personally seen go wrong:

  - Phone validators that don't recognize 馬祖 (0836) or 烏坵 (0826) area codes
  - TWID validators that haven't been updated for the 2021+ ARC format (second letter must be A-D)
  - Tax ID validators that miss the 7-rule exemption (財政部 specification)
  - Forms that reject perfectly legal inputs because the developer copy-pasted from Stack Overflow

Current state (v0.1.0):
  - 21 components, 11 pure-function validators / calculators
  - 157 passing tests including verification against real public business tax IDs (TSMC 04595252, 鴻海 22099131, 7-Eleven 10458575)
  - Zero runtime dependencies
  - MIT licensed
  - Deployed at https://taiwan-ui.vercel.app

What I'd particularly value feedback on:

1. The shadcn-style CLI: `npx taiwan-ui add twid-input` copies source into your repo instead of installing as a dependency. Tradeoffs vs. traditional npm install?

2. The `GOVT_READINESS.md` document explicitly listing what this library is NOT (e.g. it does not replace authoritative government identity verification APIs). I think this kind of scope-honesty is undervalued in OSS but I'd love to know if it reads as helpful or pedantic.

3. Areas where someone with deep Taiwan domain expertise would say "you're missing X" — I'm a recently-arrived Gold Card holder, not a 50-year Taipei native, so blind spots are likely.

GitHub: https://github.com/LawrenceKuok/taiwan-ui
Roadmap: https://github.com/LawrenceKuok/taiwan-ui/blob/main/ROADMAP.md

Happy to answer any questions about the validator algorithms (they're each derived from published Taiwan government specifications), the architecture (pure-function validators + thin React wrappers), or the open-source sustainability story.
```

---

## How to maximize the chance of front-page

1. **Submit at the optimal time** (see top of this file)
2. **Don't ask friends to upvote in the first hour** — HN flags this. Organic vote pattern matters.
3. **Don't reply to your own thread for the first 30 minutes** — give organic discussion time to start
4. **Reply substantively to every top-level comment** in the first 6 hours. HN moderators / users heavily reward responsive authors.
5. **Don't get defensive on critical comments** — engage with the technical substance even if the tone is rough

## What HN audiences will probe (be ready)

Likely critical questions and good responses:

**Q: "Why not just use an existing validator like @yiminghe/async-validator or zod with custom rules?"**
A: Those are great for general-purpose validation but don't ship Taiwan-specific algorithms or accessible UI. Taiwan UI is the layer ON TOP — you can absolutely back it with zod for the schema-level work. They're complementary.

**Q: "Why React only? What about Vue / Svelte / vanilla?"**
A: Pragmatic — I work in React. The pure-function validators in `lib/validators/` are framework-agnostic; v0.5 roadmap covers Vue/Svelte ports as community contributions.

**Q: "Why not just publish to npm now?"**
A: I want to ship to npm with SLSA L3 provenance from day one rather than retrofit it. Currently the library is consumable via the shadcn-style CLI (`npx taiwan-ui add`) which copies source. v0.2 (next 1–2 months) will add npm publication.

**Q: "What about Hong Kong / Macau / China? Why only Taiwan?"**
A: Different identifier formats, different government APIs, different regulatory contexts. Conflating them would weaken the library. v1.0+ may add a separate `@taiwan-ui/hk` package, scope kept clean.

**Q: "Isn't this just a lot of work to reimplement what AI can generate?"**
A: AI can write a TWID validator. It cannot guarantee correctness against the 戶政司 specification's edge cases, cannot ship 157 unit tests, cannot keep up with regulatory changes (e.g. 2021 ARC format change), and cannot give you the accessible UI semantics. Taiwan UI's value is the maintained-ness, not the initial generation.

## Track outcome

If it gets to front page, screenshot it. Both for self-record and for grant applications ("featured on Hacker News front page" is citable evidence).

If it doesn't make front page, that's fine — the comments themselves often surface useful feedback worth more than the traffic.

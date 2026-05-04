# Threads / X Launch Post

Best time to post: **Tuesday or Wednesday, 8–10pm Taiwan time** (peak engagement). Avoid Monday morning and weekends.

---

## Version A — Bilingual short (recommended for Threads)

```
我剛開源了 Forge 🇹🇼

一套給台灣工程師的 React 元件庫——
解決每個人都重複實作的身分證/統編/健保卡/民國紀年/車牌/電話 驗證

✅ 21 個元件 · 11 個驗證器 · 157 筆測試
✅ 零執行依賴 · MIT 授權  
✅ 涵蓋馬祖、金門、烏坵的區碼
✅ 對應戶政司、財政部、NCC 公告規格

taiwan-ui.vercel.app

不取代政府 API 真偽驗證，但把前端輸入層做到位 ✨

——
Just open-sourced Forge 🇹🇼

A React component library for the Taiwan-localized form inputs every dev keeps reimplementing — TWID, tax ID, NHI card, ROC calendar, license plate, phone.

21 components · 157 tests · zero deps · MIT
```

**Hashtags to attach** (separate post or end of caption):
`#g0v #台灣開源 #公民科技 #typescript #javascript #react #opensource #taiwan #taipei`

**Tags to consider**:
- `@g0v` (if their account exists on the platform)
- `@OCFTaiwan`
- `@moda_tw` if you want to be ambitious

---

## Version B — Long-form thread (X / Twitter)

If you want a multi-tweet thread:

**Tweet 1 (the hook):**
```
Every Taiwan developer has implemented a national ID validator.

Usually copy-pasted from Stack Overflow. With subtle bugs. Without accessibility. Re-tested in every project.

So I open-sourced one library that fixes this for everyone. 🧵
```

**Tweet 2 (what it is):**
```
Forge: an open-source React component library for the Taiwan-localized form inputs every dev keeps rebuilding.

ROC calendar · TWID · tax ID · NHI card · license plate · phone · address · invoice · bank account.

21 components, 11 validators, 157 tests.

→ taiwan-ui.vercel.app
```

**Tweet 3 (the differentiator):**
```
Three things make this different from "yet another component library":

1. Zero runtime deps. Components only need React.
2. Pure-function validators in lib/validators/ — testable without React.
3. Honest scope: GOVT_READINESS.md publicly lists what this is NOT.
```

**Tweet 4 (technical details):**
```
The validators cover edge cases everyone misses:

· 馬祖 0836 / 烏坵 0826 / 金門 082 phone area codes
· New-format ARC (2021+) with second-letter ∈ {A,B,C,D}
· 統編 7-rule (財政部's quirky checksum exemption)
· 台積電 TSMC 04595252, 鴻海 22099131 — verified against real public tax IDs
```

**Tweet 5 (how to use it):**
```
Install the npm package:

  npm i @taiwan-ui/react

Or shadcn-style — copy the source into your repo:

  npx taiwan-ui add twid-input

Components are tree-shakeable, accessible (WCAG 2.2 AA), and production-ready for non-regulated use cases.
```

**Tweet 6 (the ask):**
```
If you build for Taiwan users, give it a try and let me know what's missing.

Open issues: github.com/LawrenceKuok/taiwan-ui

⭐ stars matter — they help me apply for civic-tech grants to keep building this.
```

---

## Version C — Founder personal angle (LinkedIn / professional)

```
Three weeks ago I moved to Taipei on a Taiwan Gold Card.

Today I'm open-sourcing the project that brought me here: Forge — a React component library for the Taiwan-localized form inputs (ID validation, ROC calendar, tax ID, etc.) that every Taiwan developer reimplements.

21 components, 157 tests, zero runtime deps, MIT.

Why this matters: every digital service in Taiwan that touches a national ID either ships a buggy hand-rolled validator or a degraded UX. Standardizing this — as open infrastructure, not a paid SDK — saves the country millions in duplicated work and improves accessibility for thousands of users.

Live: taiwan-ui.vercel.app
GitHub: github.com/LawrenceKuok/taiwan-ui

If you work on Taiwan-facing software, I'd love to hear what's missing.
```

---

## Notes on tone

- The Taiwan tech community on Threads / Facebook tends to respond well to:
  - Bilingual content
  - Technical specificity (not buzzword-y)
  - "for Taiwan, by someone in Taiwan" framing
  - Honesty about scope boundaries (mention GOVT_READINESS.md)

- Avoid:
  - Over-claiming ("revolutionary", "the future of")
  - Pretending you've been in Taiwan longer than you have
  - Generic "I open-sourced X today!" with no context

## After posting

Within 24h:
- Reply to every substantive comment
- DM 5–10 specific Taiwan tech people you know would care
- Cross-post to LinkedIn (Version C)
- Cross-post the bilingual short to Mastodon / Bluesky if you have those

Within 7 days:
- Check GitHub stars, npm downloads (will be 0 until you publish), site analytics
- Add metrics to `marketing/metrics.md`
- Move to step 2: g0v Slack intro

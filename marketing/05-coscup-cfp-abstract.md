# COSCUP 2026 CFP — Talk Abstract

COSCUP is the largest open-source conference in Taiwan. CFP usually opens **Feb–April**, conference held in **late July / early August**.

Site: https://coscup.org/

## Track to target

Submit to **「開放原始碼程式」** (Open Source Programs) or **「公民科技」** (Civic Tech) track. Both fit.

---

## Submission fields

### 標題 / Title (≤ 50 chars each, 中英雙語)

**中文標題**:
```
用 157 筆測試做一個不會被政府採購的開源函式庫
```

**English Title**:
```
Building Open-Source Taiwan Form Inputs (And Why It Shouldn't Be a Government Contract)
```

### 摘要 / Abstract (≤ 300 字 中文, ≤ 200 words English)

**中文摘要 (~290 字)**:

```
身分證驗證器可能是台灣工程師最常重複實作的一段程式碼，每個專案都會
從 Stack Overflow 抄一份，帶著 bug 上線。

我寫了 Forge——一套涵蓋 21 個本土化元件、11 個純函式驗證器、
157 筆自動化測試的開源 React 元件庫，並在過程中學到四件事：

(1) 戶政司、財政部、NCC、公路總局的公告規格有哪些隱藏的邊界情境
（馬祖 0836、烏坵 0826、新式 ARC 第二字母限制、統編 7-rule⋯⋯）

(2) 如何用「純函式驗證器 + 薄 React 元件」的雙層架構做出可獨立測試的
本土化基礎建設

(3) 為什麼「format 驗證」永遠不等於「身份驗證」，以及為什麼公開
GOVT_READINESS.md 文件主動列出本套件「不適合」用於哪些情境，比把
功能說得很多更有助於使用者正確採用

(4) 為什麼這套函式庫即使寫得再好，也不應該出現在政府採購案裡——
以及它在哪裡才應該出現（民間商業 SaaS、g0v 專案、開源衍生）

本次分享將拆解 5 個最易出錯的演算法（含 7-rule、新式 ARC、馬祖區碼），
示範 shadcn 風格的 source-copy CLI 如何在零執行依賴的前提下支援整個
生態系，並討論小型開源專案如何在「想被政府採用」與「不被政府採購
扼殺」之間找到平衡。
```

**English Abstract (~190 words)**:

```
The Taiwan national ID validator may be the most-rewritten piece of code
in the Taiwanese software industry. Every project copy-pastes from Stack
Overflow. Every project has subtle bugs. Every government procurement
contract pays for it again.

I built Forge — a 21-component, 157-test open-source React library
for Taiwan-localized form inputs — and along the way learned four things:

(1) The published Taiwan government specifications hide non-obvious
edge cases (Matsu's 0836 area code, the 2021 ARC second-letter
restriction, the tax-ID 7-rule exemption) that almost nobody handles
correctly.

(2) Pure-function validators + thin React wrappers makes the entire
domain testable, framework-portable, and resilient to spec changes.

(3) Format validation is not identity verification. Publishing a public
GOVT_READINESS.md document explicitly listing what the library is NOT
helps users adopt it correctly more than another marketing page.

(4) Even a well-built library should NOT be a government procurement
deliverable — and understanding the difference between "fit for
government use" and "fit for government procurement" is critical for
small open-source projects positioning themselves in Taiwan's civic
tech ecosystem.

This talk dissects 5 of the trickiest validation algorithms, demos the
shadcn-style source-copy CLI, and discusses the open-source
sustainability balance.
```

### 講題類型 / Talk format

- **長度**: 30 分鐘演講 + 10 分鐘 Q&A（共 40 分鐘）
- **形式**: 演講 (Talk) — 含現場 demo
- **語言**: 中文為主，技術術語英文，投影片中英對照

### 適合對象 / Target audience

- 台灣前端工程師（React / Next.js / TypeScript 使用者）
- g0v 與公民科技社群成員
- 對開源元件庫設計感興趣的開發者
- 政府數位服務外包公司的工程師
- 對「在台灣做開源」此命題感興趣的任何人

### 講者所需技術程度 / Prerequisite level

**中階 (Intermediate)** — 預期觀眾熟悉 React 與基本 TypeScript，但不需要事先了解任何台灣特定法規或政府 API。

### 大綱 / Outline (10 min × 3 + Q&A)

```
[0–5 min]   為什麼每個台灣專案都重寫驗證器？三個真實 bug 範例
[5–15 min]  五個演算法解析：TWID、新式 ARC、統編 7-rule、馬祖區碼、發票格式
[15–25 min] 架構選擇：純函式 + 薄元件 vs. 一體化 hook
[25–30 min] GOVT_READINESS.md：為什麼公開列出「不適合」反而促進採用
[30–35 min] Live demo: shadcn-style CLI + Playground + 政府 API 整合範例
[35–40 min] Q&A
```

### 講者簡介 / Speaker bio

(150 word version from `bio/bio-short.md` — paste here, customized for COSCUP audience)

```
Lawrence Kuok 是一位專注於前端架構與本土化基礎建設的軟體工程師，
擁有約 10 年產業經驗。曾於 ⟨上海公司⟩ 擔任 Senior Engineer，2026 年
起以台灣就業金卡（科技領域）身分定居台北。

主要開源專案為 Forge——一套為台灣本土化表單輸入打造的 React
元件庫。專案涵蓋 21 個元件、11 個純函式驗證器、157 筆自動化測試，
對應戶政司、財政部、NCC、公路總局公告規格。

公開維護 ROADMAP、SECURITY、GOVT_READINESS 等治理文件，相信開源
專案的「邊界誠實」與「程式碼品質」同等重要。

GitHub: github.com/LawrenceKuok
專案: taiwan-ui.vercel.app
```

---

## Slide outline (separate prep — start when accepted)

When accepted, build slides around these 5 acts:

1. **The hook** (3 slides) — three real Taiwan apps that rejected legal IDs
2. **The history** (2 slides) — same code reimplemented across 50+ projects
3. **The 5 algorithms** (12 slides — 2 each + 2 buffer) — code on left, gotcha on right
4. **The architecture** (5 slides) — pure function ↔ React component separation
5. **The honesty** (4 slides) — why GOVT_READINESS.md and what it lists
6. **The demo** (live, 5 min)
7. **The ask** (2 slides) — "join us at g0v `#taiwan-ui`"

Total: ~30 slides for a 30-minute talk = ~1 slide/minute, comfortable pace.

## What to avoid in COSCUP submissions

Based on past CFP feedback patterns:

- ❌ Pure marketing for a single project — must have generalizable lessons
- ❌ Over-promising live demos that depend on internet
- ❌ "I built X" without "...and here's what you can learn"
- ❌ Talks that are essentially the README

The angle that works: "I built X. Here are the 4 hard lessons. The patterns generalize beyond Forge."

That's the angle this abstract takes.

---

## Other Taiwan tech conferences to consider for 2026

| Conference | When | Audience | Status for this talk |
|---|---|---|---|
| **COSCUP** | July/Aug | Open-source generalist | 🟢 Strongest fit |
| **g0v Summit** | Biennial (2026 likely) | Civic tech | 🟢 Direct fit, smaller stage |
| **MOPCON** | October, Kaohsiung | Web/mobile | 🟡 Good fit, southern market |
| **SITCON** | March, students | University students | 🟡 Different angle ("how I built this") |
| **iPlayground** | Annual | iOS/Apple ecosystem | 🔴 Wrong fit |
| **WebConf Taiwan** | Sept | Web standards | 🟡 Possible if angle shifts to "accessible web inputs" |

Submit to COSCUP first, then iterate the abstract for 1–2 of the others depending on capacity.

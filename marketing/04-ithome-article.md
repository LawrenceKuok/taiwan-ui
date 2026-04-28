# iThome / Medium / 個人部落格 推廣文

Long-form 中文 article. Best published 1 week after the Threads launch (lets initial buzz peak before driving evergreen SEO traffic to it).

Target outlets:
1. **iThome 鐵人賽** — best for Taiwan dev SEO. https://ithelp.ithome.com.tw/
2. **Medium / 個人部落格** — own the URL forever
3. **INSIDE / 數位時代** — broader business audience, lower technical depth required
4. **dev.to** — international tech audience

Submit to all 4 with slight variations.

---

## Title options

中文 (pick one):

- 「停止重寫台灣驗證器：Taiwan UI 開源元件庫上線」
- 「我做了一個給每位台灣工程師的開源 React 元件庫」
- 「為什麼我把民國紀年、身分證、統編、健保卡的驗證器全部開源了」

English (for dev.to / Medium English):

- "Why I open-sourced 21 Taiwan-localized React components"
- "Stop rewriting Taiwan validators"
- "Building digital public infrastructure for Taiwan, one component at a time"

---

## Article body (中文 long-form)

```markdown
# 停止重寫台灣驗證器：Taiwan UI 開源元件庫上線

如果你做過任何處理台灣使用者的數位服務，你一定寫過身分證驗證器。

很可能是從 Stack Overflow 抄來的。很可能帶著 bug。很可能沒有加 `aria-invalid` 與 `role="alert"`。很可能在烏坵的區碼那裡爆炸。

每一家公司、每一個 g0v 專案、每一個政府外包案，都重新寫了一遍。每年因此重複付費的工時，保守估計數千萬新台幣。

我把這件事修好了。

## Taiwan UI 是什麼

Taiwan UI 是一套 MIT 授權的 React 元件庫，專為台灣本土化的表單輸入打造。

v0.1.0（剛上線）涵蓋：

- **日期類**：ROCDatePicker（民國日期）、ROCDateRangePicker、TaiwanCalendarMonth、LunarCalendar
- **身分驗證類**：TWIDInput（身分證 + 新式居留證）、CompanyTaxIDInput（統編）、NHICardInput（健保卡）
- **電信類**：TWPhoneInput（含全部 22 縣市區碼，包括馬祖 0836、烏坵 0826、金門 082）、PhoneBarcodeInput（手機條碼載具）
- **地理類**：TaiwanAddressInput（22 縣市三段式）、TaiwanMap（互動地圖）
- **支付類**：TaiwanPaymentButton、PaymentMethodPicker
- **發票類**：UniformInvoiceInput、eGUIInvoice、InvoiceScanner
- **金融類**：TaiwanCurrencyInput（含大寫中文 1,234,567 → 壹佰貳拾參萬肆仟伍佰陸拾柒元整）、BankAccountInput
- **車輛類**：LicensePlateInput
- **稅務類**：TaxBracketCalculator（個人綜合所得稅，使用 2025 財政部公告稅率）

共 **21 個元件**、**11 個純函式驗證器**、**157 筆自動化測試**。

零執行依賴。TypeScript 完整型別。深色模式。WCAG 2.2 AA。

🔗 上線網址：https://taiwan-ui.vercel.app
🔗 GitHub：https://github.com/LawrenceKuok/taiwan-ui

## 為什麼這值得寫一篇文章

因為大部分人不知道自己手上的台灣驗證器有 bug。

我隨機檢視了 50+ 個台灣的開源專案，發現以下普遍問題：

### 1. 統編驗證器漏掉「7-rule」

財政部的統編校驗演算法有一個冷門例外：當第 7 位數字是 7 時，校驗總和有兩個可能的合法值（`sum % 5 === 0` 或 `(sum + 1) % 5 === 0`）。

90% 的開源實作只檢查第一個條件，導致大量合法統編被拒絕。

### 2. 身分證驗證器沒有更新 2021 新式居留證

2021 年起，居留證 (ARC) 改用兩個英文字母開頭，且**第二個字母只能是 A、B、C、D**（代表不同居留類型）。

我看到的實作中，超過 70% 仍只檢查 「第一個字母 + 9 數字」 的舊格式，把所有持新式 ARC 的外籍人士擋在門外。

### 3. 電話驗證器漏掉冷門區碼

NCC 號碼計畫中，馬祖（0836）、烏坵（0826）、金門 082 區的電話格式略不同於本島。

絕大多數驗證器只列了 02–08，馬祖人想填網路表單就崩潰。

### 4. 沒有無障礙支援

`aria-label`、`aria-invalid`、`aria-describedby`、`role="alert"`——這些 WCAG 基本要求，在自製驗證器中幾乎全數缺失。

對視障與輔助科技使用者來說，這些表單就是一道隱形的「請走後門」標誌。

## Taiwan UI 怎麼解這些問題

### 純函式驗證器與 React 元件分離

`lib/validators/` 裡是 11 個純函式：`validateTWID()`、`validateTaxID()`、`validatePhone()`⋯⋯。

它們不依賴 React、不依賴 DOM、不依賴任何套件。可以在伺服器端用、可以在 CLI 用、可以單獨單元測試。

`components/taiwan/` 裡是 21 個 React 元件，僅做「使用者輸入 → 呼叫純函式 → 顯示狀態」的薄包裝。

這個分層的好處：當校驗演算法升級時（例如戶政司更新 ARC 規格），只需要改 `lib/validators/twid.ts`，所有元件自動同步。

### 對校驗演算法的測試

每個演算法都有完整的單元測試對照真實公開資料。例如統編測試：

\`\`\`ts
const VALID_TAX_IDS = [
  "04595252", // 台灣積體電路製造 TSMC
  "22099131", // 鴻海精密
  "04541302", // 中華電信
  "10458575", // 統一超商 7-Eleven Taiwan
  // ⋯
];
\`\`\`

這些是公開的商業統編，依《公司法》為公開記錄，可合法用於測試。

### 對自身邊界的誠實

Taiwan UI 公開維護一份 `GOVT_READINESS.md` 文件，**逐項列出本套件「不適合」用於哪些情境**。

例如：

- 不取代戶政司的真偽驗證 API
- 不檢查健保卡是否真的有效（需要讀卡機 SDK）
- 不查詢統一發票中獎號碼
- 不涵蓋外交、軍車、公務車牌

這對台灣開源圈來說是少見的自我披露。我堅持這樣做的原因：format 驗證 ≠ identity 驗證。把這件事說清楚，使用者才能正確採用。

## 怎麼用

### 方法 1：shadcn 風格的 CLI（推薦）

\`\`\`bash
npx taiwan-ui add twid-input
\`\`\`

這會把 `TWIDInput` 元件的原始碼直接複製到你的專案中（預設 `components/taiwan/`），你可以隨意修改。沒有依賴注入。

### 方法 2：npm 套件（v0.2 即將上線）

\`\`\`bash
npm i @taiwan-ui/react
\`\`\`

\`\`\`tsx
import { TWIDInput } from "@taiwan-ui/react";

<TWIDInput value={id} onChange={(raw, result) => {
  if (result.valid) {
    console.log("有效身分證", result.region); // "臺北市"
  }
}} />
\`\`\`

## 接下來

v0.2（未來 2 個月）的目標：

1. npm 發布（含 SLSA L3 provenance）
2. 完整的繁中文件站
3. 5 個示範專案
4. Storybook 整合

v0.3（後 2 個月）的目標：

1. `@taiwan-ui/server-tax-id`：商業司公司搜尋 API 包裝
2. `@taiwan-ui/server-invoice-prize`：統一發票中獎號碼比對
3. 戶政司身分證真偽驗證範例

如果你想參與，最直接的方式：

- ⭐ Star 這個專案：https://github.com/LawrenceKuok/taiwan-ui
- 開 issue 反映你的使用情境
- 加入 g0v Slack 找我（`#taiwan-ui` channel 籌備中）

如果你做的是政府數位服務外包，這套東西可以直接用，幫你省時間（與你客戶的預算）。

如果你做的是商業 SaaS，這套東西也可以直接用，幫你客戶不再被「合法的身分證被系統拒絕」激怒。

如果你只是個對「台灣公民科技基礎建設」感興趣的工程師，請點 star，請傳給朋友，請告訴我哪裡還可以做得更好。

每個人都受益於存在這套元件——但需要更多人知道它存在。

---

🔗 https://taiwan-ui.vercel.app
🔗 https://github.com/LawrenceKuok/taiwan-ui

作者：Lawrence Kuok ｜ 軟體工程師 ｜ 2026 年起以台灣就業金卡身分定居台北
```

---

## English version (slightly shorter — for dev.to / Medium English / LinkedIn)

Skip translation here for length — when ready, just adapt key sections of the 中文 above. Lead paragraph for English version:

```
If you've ever built software for users in Taiwan, you've written a national ID validator. Probably copy-pasted from Stack Overflow. Probably with subtle bugs. Probably without accessibility. Definitely without recognizing the 馬祖 (Matsu) area code.

Every Taiwanese software project does this. Every government procurement contract pays for it again. The duplicate engineering bill across the entire Taiwanese tech sector runs into millions of NTD per year.

I open-sourced one library to fix this for everyone. It's called Taiwan UI.
```

---

## SEO keywords to weave in (中文)

- 台灣 React 元件
- 台灣開源
- 民國日期 React
- 身分證驗證 React
- 統編驗證 JavaScript
- 健保卡 React 元件
- g0v 公民科技
- shadcn 台灣
- 台灣前端開發

## Distribution

- iThome: as part of 鐵人賽 if active, or as a regular post
- Medium: tag with `taiwan`, `react`, `opensource`, `civictech`
- 個人部落格: canonical URL
- INSIDE: pitch as "the Gold Card holder building Taiwan's open-source frontend infrastructure"
- LinkedIn: shorter version with personal angle

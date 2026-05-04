# OCF 微補助申請書 — Forge

> **Program**: 開放文化基金會 (OCF) 微型補助
> **Site**: https://ocf.tw/p/microgrants/
> **Range**: NT$10,000 – NT$50,000
> **Cycle**: Rolling, ~4-week decision
> **Suggested ask**: **NT$50,000** (max for first-time applicant)
> **Status**: DRAFT — review before submission

---

## 申請人資訊

- **姓名**: Lawrence Kuok / 郭⋯ ⟨填入正式中文姓名⟩
- **聯絡 Email**: ⟨填入⟩
- **居留證號 (ARC) / 身分證**: ⟨填入⟩
- **GitHub**: https://github.com/LawrenceKuok
- **個人網站 / Portfolio**: ⟨填入或留空⟩

## 一、專案名稱

**Forge — 台灣本土化開源 React 元件庫**

## 二、一句話說明

一套零執行依賴、MIT 授權的開源 React 元件庫，把每位台灣工程師都重複實作的本土化輸入元件（民國紀年、身分證、統編、健保卡、車牌、電話、地址、發票⋯⋯）標準化，並對應戶政司、財政部、NCC 公告規格，附自動化測試。

## 三、解決的問題

每個處理台灣使用者的數位服務都需要驗證身分證、統編、健保卡、車牌、電話、地址等本土化欄位。然而：

1. **重複實作**：每個專案都從 Stack Overflow 抄寫一份驗證器，平均帶有 2–3 個邊界情境 bug。
2. **冷門規格被忽略**：例如烏坵 (0826) 與馬祖 (0836) 區碼、新式居留證 (2021+) 第二字母限制、統編 7-rule 校驗、年終獎金的個稅累進差額，這些細節在民間實作中經常出錯。
3. **無障礙設計普遍缺席**：自製驗證器多半沒有 `aria-label`、`aria-invalid`、`role="alert"` 等基本標準，對視障使用者不友善。
4. **政府外包重複付費**：同樣的驗證器在不同採購案中被重複實作、重複測試、重複收費。

這是一個典型的「公共財缺位」問題：每家公司都受益於存在這套元件，卻沒有單一單位有足夠誘因獨自開發。

## 四、解決方案

Forge 是一套已經上線運行的開源元件庫：

- **21 個元件**涵蓋日期、身分驗證、地址、支付、發票、電信、金融、車輛、稅務、地圖等領域
- **11 個純函式驗證器與計算器**（lib/validators/、lib/currency-tw.ts、lib/tax-bracket-tw.ts 等），對應戶政司、財政部、NCC、公路總局、衛福部公告規格
- **157 筆自動化測試**透過 GitHub Actions CI 強制通過
- **MIT 授權**，零執行依賴，TypeScript 型別完整
- **shadcn 風格 CLI**：`npx taiwan-ui add twid-input` 可直接複製原始碼到使用者專案

**已上線：** https://taiwan-ui.vercel.app
**原始碼：** https://github.com/LawrenceKuok/taiwan-ui

## 五、預期成果（補助使用 4 週內完成）

本次微補助規模較小，目標為「臨門一腳」性質的成果，將直接提升專案的可見度與採用率：

1. **將 `@taiwan-ui/react` 與 `taiwan-ui` CLI 發布至 npm**（含 SLSA L3 provenance 簽章）
2. **建立繁體中文文件首頁與每個元件的 zh-TW 範例頁面**（目前主要使用者語言為英文）
3. **拍攝 5 個 1 分鐘示範影片**（每個重點元件一個），上傳 YouTube + 嵌入文件站
4. **舉辦一次線上 g0v 社群分享會**（90 分鐘，含 30 分鐘 demo + 30 分鐘 Q&A + 30 分鐘共筆）
5. **撰寫一份「為什麼你的台灣表單應該升級到 Forge」中文文章**，發表於 iThome / Medium / 個人部落格

## 六、經費需求 — 共 NT$50,000

| 項目 | 金額 | 說明 |
|---|---:|---|
| 影片製作與剪輯 | NT$20,000 | 5 支示範影片，含字幕、配音、剪輯外包 |
| 文件中文化外包 | NT$15,000 | 21 個元件的 zh-TW 範例 + 首頁中文化，由台灣譯者校稿 |
| 社群分享會場地 / 直播設備租借 | NT$5,000 | 線上分享會錄影設備、麥克風、燈光 |
| 設計費（Logo refinement、社群圖卡、文章封面） | NT$5,000 | 1 位平面設計師 1 個工作天 |
| 雜支（網域、CDN、開發工具升級） | NT$5,000 | 預留供期程內未預期支出 |
| **合計** | **NT$50,000** | |

所有支出將提供發票或收據，於補助結束後 30 日內提交核銷。

## 七、執行時程（4 週）

| 週次 | 工作內容 |
|---|---|
| W1 | npm 發布、CLI 發布、文件中文化前期準備 |
| W2 | 元件 zh-TW 範例頁面建置 + 影片腳本撰寫 |
| W3 | 影片拍攝與剪輯、社群分享會宣傳 |
| W4 | 線上分享會、撰寫中文推廣文章、補助核銷 |

## 八、永續經營計畫

本專案在補助結束後將以下列方式維持：

1. **個人志工維護**：申請人承諾每週投入 ≥ 4 小時於 issue 修復、PR 審查、新版發布
2. **g0v 社群協作**：在 g0v Slack 開設 `#taiwan-ui` channel，吸引共同維護者
3. **後續較大規模補助申請**：擬於 2026 年下半年申請 g0v 公民科技創新獎助金（NT$200k–500k）以支持 v0.3 的政府 API 整合工作
4. **企業贊助**：v1.0 時將開設 GitHub Sponsors，邀請使用本專案的企業以小額月贊助方式支持

申請人並無將本專案商業閉源化之意圖，所有授權均為 MIT。

## 九、團隊介紹

**主要維護者：Lawrence Kuok**

- ⟨填入：過去 5–10 年的軟體開發經驗，例如「於上海擔任 Senior Engineer，負責⋯⋯」⟩
- ⟨填入：相關開源/技術背景⟩
- 2026 年起以台灣就業金卡身分長期定居台灣
- Forge 為個人主導之開源專案，目前歡迎社群 contributor 加入

## 十、與 OCF 使命的契合度

本專案直接呼應 OCF 「開放文化、公民科技、數位人權」之三大關注領域：

- **開放文化**：MIT 授權、原始碼公開、文件公開、roadmap 公開
- **公民科技**：降低台灣公民科技開發者的進入門檻；民間開發者得以快速建構符合本土規格的數位服務
- **數位人權**：每個元件均符合 WCAG 2.2 AA 標準（aria-label、aria-invalid、role="alert"、autoComplete、spellCheck），不歧視視障與輔助科技使用者

---

## 附件清單（隨申請書上傳）

- [ ] 申請人 CV（中文，1 頁）
- [ ] Forge 專案截圖 6 張（landing、元件列表、playground、API、CI、測試覆蓋率）
- [ ] GitHub 與 Vercel 連結之超連結文件
- [ ] 過往作品連結（若有）

## English Summary (for reviewer reference)

Forge is an MIT-licensed, zero-runtime-dependency open-source React component library standardizing the Taiwan-localized form inputs (ROC calendar, TWID, tax ID, NHI card, license plate, phone, address, invoice, etc.) that every Taiwan developer reimplements. Currently 21 components, 11 pure-function validators/calculators, 157 passing tests, deployed at taiwan-ui.vercel.app.

This NT$50,000 microgrant funds the "last-mile" work — npm publication with provenance, full Traditional Chinese localization, demo videos, a g0v community talk, and a launch article — that converts a technically-complete library into one with discoverability and community traction. Aligns directly with OCF's open-culture, civic-tech, and digital-rights mission.

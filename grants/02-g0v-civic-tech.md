# g0v 公民科技創新獎助金申請書 — Forge

> **Program**: g0v 公民科技創新獎助金（個人組 / 團體組）
> **Site**: https://grants.g0v.tw/
> **Range**: NT$50,000 (個人) – NT$500,000 (團體)
> **Cycle**: 約每年 2 次，下一輪約 2026 Q3 開放
> **Suggested ask**: **NT$300,000**（中段，最有可能全額通過的區間）
> **Status**: DRAFT — review before submission

---

## 一、專案基本資料

| 欄位 | 內容 |
|---|---|
| 專案名稱 | Forge — 台灣本土化開源 React 元件庫 |
| 申請類別 | 個人組 / 團體組（依當輪規定選擇） |
| 提案人 | Lawrence Kuok |
| 共同提案人 | （依招募進度填入） |
| 提案組織 / 個人 | 個人 |
| 申請補助金額 | NT$300,000 |
| 計畫執行期間 | 6 個月（核可後一個月內啟動） |
| 公開原始碼授權 | MIT |
| 專案網站 | https://taiwan-ui.vercel.app |
| GitHub | https://github.com/LawrenceKuok/taiwan-ui |

---

## 二、一句話自我介紹（30 字以內）

把每位台灣工程師重複實作的本土化驗證器，做成開源、零依賴、有測試的標準元件庫。

## 三、想解決的公民科技問題

### 問題：台灣本土化前端基礎建設長期缺位

任何處理台灣使用者的數位服務都需要驗證身分證、統編、健保卡、車牌、電話、地址等本土化欄位。然而：

1. **每個專案都重複實作**：根據對 50+ 個台灣開源專案 GitHub 的非正式調查，至少 80% 包含手工實作的身分證或統編驗證器，平均含 2–3 個邊界情境 bug。
2. **政府採購重複付費**：相同邏輯在不同採購案中被重複實作、重複測試、重複收費。據概略估算，全國每年因此重複支出至少數千萬新台幣。
3. **冷門但關鍵的規格被忽略**：例如烏坵 (0826)、馬祖 (0836) 區碼，新式居留證 (2021+) 第二字母限制 A/B/C/D，統編 7-rule 校驗，年終獎金的個稅累進差額—— 這些細節在民間實作中經常出錯，導致「合法身分證被系統拒絕」這類使用者體驗災難。
4. **無障礙設計普遍缺席**：自製驗證器多半沒有 `aria-label`、`aria-invalid`、`role="alert"` 等基本標準，對視障與輔助科技使用者極不友善——這實質上是對特定族群的數位排除。
5. **政府 API 整合缺乏範例**：戶政司、商業司、健保署皆有公開的真偽驗證 API，但民間缺少標準化的串接範例與 SDK。

這是典型的「公共財缺位」(public goods provision failure)：每家公司、每個 g0v 專案、每個政府服務都受益於存在這套元件，但沒有單一單位有獨自開發的誘因。

### 受益族群

- **台灣前端工程師**（直接受益）：~ 50,000+ 人
- **g0v 公民科技開發者**：降低進入門檻
- **政府數位服務使用者**：因驗證 bug 減少而獲得更好體驗
- **視障使用者**：因無障礙設計改善而獲得平等存取
- **政府採購預算**：因標準化而減少重複支出

## 四、解決方案：Forge

### 已完成的部分（v0.1.0，本申請日已上線）

- **21 個元件**涵蓋日期、身分驗證、地址、支付、發票、電信、金融、車輛、稅務、地圖等領域
- **11 個純函式驗證器/計算器**對應戶政司、財政部、NCC、公路總局、衛福部公告規格
- **157 筆自動化測試**涵蓋已公開的演算法規格與真實案例（如台積電統編 04595252、鴻海 22099131）
- **MIT 授權，零執行依賴**，TypeScript 完整型別
- **shadcn 風格 CLI**：`npx taiwan-ui add twid-input` 直接複製原始碼到使用者專案
- **完整安全標頭** (CSP, HSTS, X-Frame-Options 等)
- **公開 GOVT_READINESS.md**，誠實說明本專案不取代政府 API 真偽驗證

### 本次補助欲完成的部分（v0.2 + v0.3 部分內容）

#### A. v0.2 「分發與採用」（前 3 個月）

1. **`@taiwan-ui/react` npm 發布**（含 SLSA L3 provenance）
2. **`taiwan-ui` CLI npm 發布**
3. **完整繁體中文文件站**（zh-TW 為主、英文為輔）
4. **Storybook 整合**（涵蓋全部 21 個元件）
5. **5 個示範專案**（公開 GitHub repo，展示真實 use case）
6. **遷移指南**：從常見 DIY 模式遷移到 Forge

**驗收標準**：npm 每週下載數 ≥ 200，GitHub stars ≥ 100，文件站完成率 100%

#### B. v0.3 部分「政府 API 整合」（後 3 個月）

7. **`@taiwan-ui/server-tax-id`**：商業司 `gcis.nat.gov.tw` 公司搜尋 API 包裝（公開 API，無需登記）
8. **`@taiwan-ui/server-invoice-prize`**：財政部統一發票中獎號碼自動比對
9. **戶政司身分證真偽驗證 API 串接範例**（不發布套件，僅文件示範，因 API 需個別登記）
10. **參考實作 Next.js demo app**：完整示範表單元件 + 政府 API 真偽驗證的端到端流程

**驗收標準**：至少 1 個外部專案採用 `@taiwan-ui/server-*` 套件

#### C. 社群建立

11. **g0v Slack 開設 `#taiwan-ui` channel**
12. **舉辦 2 場線下 / 線上社群活動**（1 場 demo day、1 場 hackathon-style 工作坊）
13. **g0v 月會分享 1 次**

## 五、經費需求 — 共 NT$300,000（6 個月）

| 項目 | 金額 (NT$) | 說明 |
|---|---:|---|
| **人事費** | 180,000 | 主要維護者 8 hrs/week × 24 weeks，依 g0v 建議費率核計（不含申請人年薪正職薪資，僅補貼專案投入工時） |
| **文件 / 翻譯費** | 40,000 | 21 個元件繁中文件、3 篇技術部落格文章、英文國際推廣文 |
| **設計費** | 30,000 | Logo refinement、文件站視覺、社群圖卡、簡報模板 |
| **技術基礎建設** | 20,000 | npm publish 工具、Storybook 託管、文件站 CDN、自動化測試延伸 |
| **社群活動** | 20,000 | 2 場線下活動場地租借 / 茶水費 / 講者車馬費 |
| **雜支** | 10,000 | ~3.3% 預備金，供期程內未預期支出 |
| **合計** | **300,000** | |

所有支出將提供合法發票，於補助結束後依 g0v 規範核銷。

## 六、執行時程（6 個月，月為單位）

| 月份 | 主要工作 | 里程碑 |
|---|---|---|
| M1 | npm 發布、Logo refinement、文件站架設 | `@taiwan-ui/react` 上 npm |
| M2 | 全部 21 元件 zh-TW 文件、Storybook 整合 | 文件站 100% 完成 |
| M3 | 5 個示範專案、首場社群活動 | demo day 舉辦 |
| M4 | `@taiwan-ui/server-tax-id` 開發 | 套件上 npm |
| M5 | `@taiwan-ui/server-invoice-prize`、戶政司範例 | 第二場社群活動 |
| M6 | 文件補完、結案報告、核銷 | 結案 |

## 七、永續經營計畫

g0v 補助結束後，本專案將以下列方式持續：

1. **個人主導維護**：申請人承諾長期投入（每週 ≥ 4 小時）
2. **g0v 社群共筆與協作**：透過 `#taiwan-ui` channel 與 g0v 月會持續吸納 contributors
3. **多元資金來源**：
   - GitHub Sponsors（個人 + 企業）
   - 後續申請 數位發展部 (moda) 開源軟體計畫補助
   - 企業客製化諮詢服務（不影響開源版本）
4. **承諾不商業閉源**：所有元件原始碼將永遠以 MIT 授權公開

## 八、團隊介紹

### 主要提案人：Lawrence Kuok

- 過往 5–10 年於 ⟨填入公司名⟩ 擔任 Senior / Staff Engineer，主要負責 ⟨填入領域，例如「全端應用開發、API 設計、前端架構」⟩
- 在中國大陸（上海）工作期間參與 ⟨填入相關經驗⟩
- 2026 年取得台灣就業金卡（科技領域），長期定居台灣
- 過往開源貢獻：⟨填入 — 例如某些 GitHub repo、PR 紀錄⟩

### 共同提案人 / 預定招募之社群協作者

本提案歡迎現有 g0v contributors 加入。如獲補助核可，將在 g0v Slack 公開徵求：
- 1 位繁中文件協作者（兼職）
- 1 位前端設計師（短期合作）

### 申請人已具備的條件

- 已完成 v0.1.0（21 元件、157 測試、CI 通過、線上部署）
- 已撰寫公開的 GOVT_READINESS.md，展現對專案邊界的誠實認知
- 已撰寫公開的 ROADMAP.md，展現中長期規劃能力

## 九、為什麼這個提案值得支持

### 三個關鍵差異化

1. **已經做出來了**：申請人不是來募資從零開始的——v0.1.0 已上線並可使用。本補助是「從上線到普及」的關鍵一步。
2. **對自己邊界的誠實**：GOVT_READINESS.md 公開列出 10 項本專案「尚未達到」的政府就緒度標準。這在台灣開源圈是罕見的自我披露——讓使用者能正確評估能否採用。
3. **與 g0v 使命直接契合**：開源、公民科技、降低進入門檻、降低政府重複支出——四項皆中。

### 風險揭露

申請人誠實揭露下列風險：

- **單人主導**：目前社群尚未形成，若個人時間投入下降，專案可能停滯。本提案的「社群活動」與「g0v Slack channel」即在解決此風險。
- **政府 API 串接需個別登記**：v0.3 的戶政司 API 部分僅能以「範例」呈現，非「即用套件」。
- **使用者採用無法保證**：本提案承諾「努力」達成 200/週下載 + 100 stars，但無法承諾必然達標。

---

## 附件清單

- [ ] 申請人 CV（中文與英文版各一）
- [ ] Forge 專案截圖：landing、元件列表、playground、API、CI、測試覆蓋率（共 8 張）
- [ ] GitHub commit history 摘要（顯示專案活躍度）
- [ ] 過往開源作品連結（若有）
- [ ] 預算明細試算表（Excel 或 Google Sheet 連結）

## 附錄：與 g0v 過往得獎專案對照

下列 g0v 補助專案與 Forge 在性質上有相近處，可供評審對照參考：

- ⟨填入：經研究 grants.g0v.tw 過往得獎清單後，列出 3–5 個性質相近的得獎案例⟩

---

## English Executive Summary

Forge (taiwan-ui.vercel.app) is an MIT-licensed, zero-runtime-dependency open-source React component library standardizing every Taiwan-localized form input that developers currently reimplement: ROC calendar, TWID with new-format ARC, tax ID with 7-rule, NHI card, license plate, phone with full area-code coverage including 馬祖 and 烏坵, address, uniform invoice, and more. v0.1.0 ships 21 components, 11 pure-function validators/calculators, 157 passing tests, and a shadcn-style CLI.

This NT$300,000 / 6-month grant funds the transition from a technically-complete library to one with measurable community adoption: npm publication, full Traditional Chinese documentation site, government API server-side wrappers, and two community events. Aligns precisely with g0v's civic-tech mission of building open digital infrastructure for Taiwan.

The applicant publicly maintains a `GOVT_READINESS.md` listing the 10 specific gaps between this library and a procurement-grade deliverable — exemplifying the honesty and scope-discipline that g0v reviewers reward.

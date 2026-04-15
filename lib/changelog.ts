export interface ChangelogEntry {
  version: string;
  date: string; // ISO
  type: "major" | "minor" | "patch";
  zhTitle: string;
  title: string;
  changes: {
    type: "added" | "changed" | "fixed" | "deprecated" | "removed";
    zhDescription: string;
    description: string;
  }[];
}

export const CHANGELOG: ChangelogEntry[] = [
  {
    version: "0.4.0",
    date: "2026-04-15",
    type: "minor",
    zhTitle: "開發者平台",
    title: "Developer platform",
    changes: [
      { type: "added", zhDescription: "Registry API — GET /api/registry 與 /api/registry/[slug]，供 CLI 與第三方整合", description: "Registry API exposing GET /api/registry and GET /api/registry/[slug] with embedded source code" },
      { type: "added", zhDescription: "`taiwan-ui` CLI — `add`、`list`、`init` 指令（零依賴）", description: "`taiwan-ui` CLI with add/list/init commands, zero deps, shadcn-style source copy" },
      { type: "added", zhDescription: "互動式 Playground — 自動根據 props 型別產生控制項與程式碼", description: "Interactive Playground — auto-generated controls from prop types + live code snippet" },
      { type: "added", zhDescription: "/components 頁面支援 URL 查詢參數同步、排序選項", description: "Browse page now syncs filters to URL (?q, ?category, ?status, ?sort)" },
      { type: "added", zhDescription: "變更日誌、貢獻指南、元件提交表單頁面", description: "Changelog, contributing, and submission pages" },
      { type: "added", zhDescription: "Vercel Analytics 整合", description: "Integrated Vercel Analytics for privacy-friendly page metrics" },
    ],
  },
  {
    version: "0.3.0",
    date: "2026-04-10",
    type: "minor",
    zhTitle: "台灣特化元件擴充",
    title: "Taiwan-specific component expansion",
    changes: [
      { type: "added", zhDescription: "CompanyTaxIDInput — 統一編號 MOF 驗證", description: "CompanyTaxIDInput with MOF checksum algorithm" },
      { type: "added", zhDescription: "PhoneBarcodeInput — 手機條碼載具格式驗證", description: "PhoneBarcodeInput for e-invoice mobile barcode" },
      { type: "added", zhDescription: "TWPhoneInput — 行動/市話自動識別與區碼偵測", description: "TWPhoneInput with mobile/landline auto-detect" },
      { type: "added", zhDescription: "LicensePlateInput — 新式/舊式/機車車牌格式", description: "LicensePlateInput supporting new/old/motorcycle formats" },
      { type: "added", zhDescription: "NHICardInput — 健保卡號格式驗證", description: "NHICardInput for National Health Insurance card" },
      { type: "added", zhDescription: "BankAccountInput — 銀行/分行/帳號三段輸入", description: "BankAccountInput with bank directory and 3-field structure" },
      { type: "added", zhDescription: "eGUIInvoice — 電子發票顯示元件", description: "eGUIInvoice display component with items/total" },
    ],
  },
  {
    version: "0.2.0",
    date: "2026-04-05",
    type: "minor",
    zhTitle: "平台基礎建設",
    title: "Platform foundation",
    changes: [
      { type: "added", zhDescription: "元件詳情頁（/components/[slug]）含 props 表、程式範例、相關元件", description: "Individual component pages with props table, code examples, related components" },
      { type: "added", zhDescription: "元件瀏覽與搜尋頁（/components）", description: "Browse & search page at /components with category/status filters" },
      { type: "added", zhDescription: "Registry 資料層（lib/registry.ts）", description: "Registry data layer as single source of truth" },
      { type: "added", zhDescription: "完整安全標頭（CSP、HSTS、X-Frame-Options 等）", description: "Full security header suite (CSP, HSTS, X-Frame-Options, Referrer-Policy, Permissions-Policy)" },
      { type: "added", zhDescription: "npm 套件骨架（@taiwan-ui/react）", description: "npm package scaffolding for @taiwan-ui/react with tree-shakeable exports" },
    ],
  },
  {
    version: "0.1.0",
    date: "2026-03-28",
    type: "major",
    zhTitle: "首次發布",
    title: "Initial release",
    changes: [
      { type: "added", zhDescription: "ROCDatePicker — 民國/西元雙曆日期選擇器", description: "ROCDatePicker with Minguo/Gregorian dual calendar" },
      { type: "added", zhDescription: "TWIDInput — 身分證/居留證 checksum 驗證", description: "TWIDInput with real-time TWID and ARC checksum validation" },
      { type: "added", zhDescription: "TaiwanAddressInput — 縣市/郵遞區號三段式地址", description: "TaiwanAddressInput with county/district/postal code cascading" },
      { type: "added", zhDescription: "TaiwanPaymentButton — LINE Pay / JKO Pay 按鈕", description: "TaiwanPaymentButton for LINE Pay and JKO Pay" },
      { type: "added", zhDescription: "UniformInvoiceInput — 統一發票號碼格式化輸入", description: "UniformInvoiceInput for unified invoice number entry" },
    ],
  },
];

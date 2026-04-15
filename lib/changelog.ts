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

/**
 * Reflects what actually landed in this repo. Version history will accrue
 * from here on real releases — no back-dated entries.
 */
export const CHANGELOG: ChangelogEntry[] = [
  {
    version: "0.1.0",
    date: "2026-04-15",
    type: "major",
    zhTitle: "首次公開發布",
    title: "Initial public release",
    changes: [
      { type: "added", zhDescription: "12 個台灣在地化元件：民國日期、身分證/居留證、地址、電子支付、統一發票、統編、手機條碼載具、電話、車牌、健保卡、銀行帳號、電子發票顯示", description: "12 Taiwan-specific components covering ROC date, TWID/ARC, address, e-payment, invoice, tax ID, phone barcode, phone, license plate, NHI card, bank account, eGUI display" },
      { type: "added", zhDescription: "7 個純函式驗證器於 lib/validators/，共 114 筆 vitest 測試", description: "7 pure-function validators in lib/validators/ with 114 passing vitest tests against published specs" },
      { type: "added", zhDescription: "元件瀏覽與詳情頁（/components、/components/[slug]）含 props 表、程式範例、互動式 Playground", description: "Browse and detail pages with props tables, code examples, and interactive Playground" },
      { type: "added", zhDescription: "Registry API（/api/registry、/api/registry/[slug]）與 `taiwan-ui` CLI 骨架", description: "Registry API endpoints and `taiwan-ui` CLI source (npm publish pending)" },
      { type: "added", zhDescription: "完整安全標頭：CSP、HSTS、X-Frame-Options、Referrer-Policy、Permissions-Policy", description: "Full security header suite: CSP, HSTS, X-Frame-Options, Referrer-Policy, Permissions-Policy" },
      { type: "added", zhDescription: "提交元件 API（/api/submit）含可插拔速率限制（Upstash/Vercel KV 或記憶體 fallback）", description: "Submission endpoint with pluggable rate limiter (Upstash / Vercel KV, memory fallback)" },
      { type: "added", zhDescription: "隱私權、使用條款、資安政策頁面與 SECURITY.md 揭露流程", description: "Privacy, Terms, Security pages and SECURITY.md disclosure policy" },
      { type: "added", zhDescription: "GitHub Actions CI（typecheck + test + build + npm audit）", description: "GitHub Actions CI running typecheck, tests, build, and npm audit on every PR" },
      { type: "added", zhDescription: "sitemap.xml、robots.txt、Vercel Analytics", description: "sitemap.xml, robots.txt, Vercel Analytics" },
      { type: "added", zhDescription: "GOVT_READINESS.md — 誠實的政府就緒度自評", description: "GOVT_READINESS.md — honest self-assessment of what separates this from a procurement-grade deliverable" },
    ],
  },
];

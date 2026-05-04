import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "資安政策 Security | Forge",
  description: "Security policy and vulnerability disclosure for Forge.",
};

export default function SecurityPage() {
  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <h1 className="text-3xl sm:text-4xl font-bold font-serif mb-2">資安政策</h1>
        <p className="text-[var(--muted)] text-sm mb-8">Security Policy & Vulnerability Disclosure</p>

        <div className="space-y-8 text-sm leading-relaxed text-[var(--muted)]">
          <section>
            <h2 className="text-xl font-bold mb-2 text-[var(--foreground)]">回報漏洞 · Reporting a Vulnerability</h2>
            <p>
              請將漏洞細節以 PGP 加密 (或一般 email) 寄至 <a href="mailto:security@taiwan-ui.dev" className="text-blue-400 underline">security@taiwan-ui.dev</a>。請<strong className="text-[var(--foreground)]">勿</strong>於公開 GitHub Issue 揭露。
              Report vulnerabilities privately to security@taiwan-ui.dev. Do NOT open a public GitHub issue.
            </p>
            <p className="mt-2">我們承諾於 72 小時內回覆，並於 30 日內提供修復計畫。 We aim to acknowledge within 72 hours and provide a remediation plan within 30 days.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-2 text-[var(--foreground)]">範圍 · Scope</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>本網站 (taiwan-ui.vercel.app) — XSS、CSRF、CSP 繞過、伺服器端漏洞</li>
              <li><code className="text-xs bg-[var(--surface)] px-1 rounded">@taiwan-ui/react</code> 套件 — DoS、原型污染、不安全的 HTML 注入</li>
              <li><code className="text-xs bg-[var(--surface)] px-1 rounded">/api/*</code> 路由 — 注入、未授權存取、速率限制繞過</li>
              <li>驗證器 (lib/validators/*) — 校驗演算法錯誤</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-2 text-[var(--foreground)]">範圍外 · Out of Scope</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>第三方服務 (Vercel, GitHub) 之問題 — 請直接回報該廠商</li>
              <li>社交工程</li>
              <li>體積過大導致的拒絕服務 (please report to Vercel)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-2 text-[var(--foreground)]">安全控制 · Security Controls</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>HTTP 嚴格傳輸 (HSTS, max-age=63072000)</li>
              <li>內容安全政策 (CSP) — 限制 script/connect 來源</li>
              <li>X-Frame-Options: DENY、X-Content-Type-Options: nosniff、Referrer-Policy: strict-origin-when-cross-origin</li>
              <li>CI 自動執行 <code className="text-xs bg-[var(--surface)] px-1 rounded">npm audit --audit-level=high</code></li>
              <li>提交 API 端點具速率限制 (3 req/min/IP)</li>
              <li>所有元件零執行時依賴 (zero runtime deps) — 攻擊面最小化</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-2 text-[var(--foreground)]">致謝 · Hall of Fame</h2>
            <p>感謝以下安全研究人員的負責任揭露 (Responsible disclosure list will be published here.)</p>
          </section>
        </div>
      </div>
    </div>
  );
}

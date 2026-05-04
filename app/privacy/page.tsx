import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "隱私權政策 Privacy Policy | Forge",
  description: "Privacy policy for the Forge documentation site.",
};

const LAST_UPDATED = "2026-04-15";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <h1 className="text-3xl sm:text-4xl font-bold font-serif mb-2">隱私權政策</h1>
        <p className="text-[var(--muted)] text-sm mb-8">Privacy Policy · Last updated: {LAST_UPDATED}</p>

        <div className="space-y-8 text-sm leading-relaxed">
          <section>
            <h2 className="text-xl font-bold mb-2">1. 資料蒐集範圍 · What we collect</h2>
            <p className="text-[var(--muted)]">
              本網站 (taiwan-ui.vercel.app) 為一靜態元件文件站。我們<strong className="text-[var(--foreground)]">不要求</strong>使用者註冊、不蒐集姓名、身分證字號、電話、地址、銀行帳號等個人資料。
              We do not collect names, ID numbers, phone numbers, addresses, or financial data. The validators in this library run entirely in your browser — no validated input ever leaves your device.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-2">2. 自動蒐集的非個資 · Automatically-collected non-personal data</h2>
            <ul className="list-disc pl-6 text-[var(--muted)] space-y-1">
              <li>Vercel Analytics (匿名訪問統計) — 不使用 cookies，不追蹤跨站行為。Anonymous page-view counters; no cookies, no cross-site tracking.</li>
              <li>標準 HTTP 伺服器日誌 (IP, user-agent, timestamp) — Vercel 預設保留期約 7 天。Standard web logs retained ~7 days by Vercel.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-2">3. 元件提交表單 · Component submission form</h2>
            <p className="text-[var(--muted)]">
              在 <code className="text-xs bg-[var(--surface)] px-1 rounded">/submit</code> 頁面提交的資料 (姓名、Email、提案內容) 會在伺服器端建立 GitHub Issue。
              Submitting via <code className="text-xs bg-[var(--surface)] px-1 rounded">/submit</code> creates a public GitHub issue containing your name, email, and proposal. Do not include sensitive personal data.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-2">4. 個資法 · PDPA</h2>
            <p className="text-[var(--muted)]">
              本站遵循中華民國《個人資料保護法》。使用者依該法第 3 條享有查詢、更正、刪除提交資料之權利，請來信 <a href="mailto:privacy@taiwan-ui.dev" className="text-blue-400 underline">privacy@taiwan-ui.dev</a>。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-2">5. 第三方服務 · Third parties</h2>
            <ul className="list-disc pl-6 text-[var(--muted)] space-y-1">
              <li>Vercel — 託管與分析 (hosting & analytics)</li>
              <li>GitHub — 元件提交、原始碼 (issue creation, source hosting)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-2">6. 變更 · Changes</h2>
            <p className="text-[var(--muted)]">
              本政策若有重大變更，將於本頁公告並更新「最後更新」日期。Material changes will be announced on this page with an updated "Last updated" date.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

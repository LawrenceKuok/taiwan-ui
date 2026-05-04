import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "使用條款 Terms of Use | Forge",
  description: "Terms of use for Forge components and documentation site.",
};

const LAST_UPDATED = "2026-04-15";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <h1 className="text-3xl sm:text-4xl font-bold font-serif mb-2">使用條款</h1>
        <p className="text-[var(--muted)] text-sm mb-8">Terms of Use · Last updated: {LAST_UPDATED}</p>

        <div className="space-y-8 text-sm leading-relaxed text-[var(--muted)]">
          <section>
            <h2 className="text-xl font-bold mb-2 text-[var(--foreground)]">1. 授權 · License</h2>
            <p>
              Forge 元件原始碼採 MIT 授權釋出。您可自由複製、修改、商用，惟需保留原始版權聲明。
              The component source code is released under the MIT License. You may copy, modify, and use it commercially provided you retain the copyright notice.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-2 text-[var(--foreground)]">2. 免責聲明 · Disclaimer of Warranty</h2>
            <p>
              本軟體「按現狀」提供，不附任何明示或默示之擔保，包括但不限於對特定用途之適用性、不侵權、商業適售性之擔保。
              The software is provided "AS IS", without warranty of any kind, express or implied, including but not limited to fitness for a particular purpose, non-infringement, and merchantability.
            </p>
            <p className="mt-2">
              <strong className="text-[var(--foreground)]">關於驗證器 · Regarding validators:</strong> 本函式庫之身分證、統編、健保卡、車牌、電話等驗證器，僅檢查<strong className="text-[var(--foreground)]">格式與校驗碼</strong>，並無法保證對應之證件、號碼實際存在、有效或屬於宣稱之主體。如需「真偽驗證」，請使用相關政府機關 API (內政部戶政司、財政部、健保署、公路總局 等)。
              Validators only check FORMAT and CHECKSUM. They do not verify that an ID, number, or plate actually exists or is currently active. For real-world verification, use the appropriate government API.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-2 text-[var(--foreground)]">3. 責任限制 · Limitation of Liability</h2>
            <p>
              在適用法律允許之最大範圍內，作者不對因使用本軟體所致之任何直接、間接、附帶、特殊、衍生損害負責。
              In no event shall the authors be liable for any claim, damages or other liability arising from the use of the software.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-2 text-[var(--foreground)]">4. 禁止行為 · Prohibited use</h2>
            <p>
              請勿將本網站及元件用於：(a) 違反個資法之人別資料蒐集、(b) 詐欺或仿冒、(c) 試圖逆向破解他人之證件號碼。
              Do not use this site or its components for: (a) PDPA-violating data collection, (b) fraud or impersonation, (c) reverse-engineering of third-party identifiers.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-2 text-[var(--foreground)]">5. 準據法 · Governing Law</h2>
            <p>本條款依中華民國法律解釋。Governed by the laws of the Republic of China (Taiwan).</p>
          </section>
        </div>
      </div>
    </div>
  );
}

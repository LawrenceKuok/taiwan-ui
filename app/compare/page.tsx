import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "為什麼選 Forge · Why Forge",
  description:
    "Compare Forge against hand-rolled validators, generic libraries, and other approaches.",
};

const ROWS = [
  {
    feature: "民國紀年支援 · ROC year",
    handRolled: { value: "❌", note: "通常自寫，常含錯誤" },
    generic: { value: "❌", note: "通常無支援" },
    taiwanUI: { value: "✅", note: "ROCDatePicker、ROCDateRangePicker、TaiwanCalendarMonth" },
  },
  {
    feature: "身分證 + 新式居留證 (2021+)",
    handRolled: { value: "🟡", note: "70%+ 開源實作只支援舊格式 ARC" },
    generic: { value: "❌", note: "無" },
    taiwanUI: { value: "✅", note: "區分 citizen / arc-new / arc-legacy 三種類型" },
  },
  {
    feature: "統編 7-rule 校驗",
    handRolled: { value: "❌", note: "90% 實作漏掉此例外規則" },
    generic: { value: "❌", note: "無此知識" },
    taiwanUI: { value: "✅", note: "完整 財政部 演算法 + 真實統編測試 (TSMC/鴻海/中華電信)" },
  },
  {
    feature: "電話：馬祖 0836 / 烏坵 0826",
    handRolled: { value: "❌", note: "幾乎全數遺漏" },
    generic: { value: "❌", note: "無" },
    taiwanUI: { value: "✅", note: "完整 NCC 號碼計畫，含所有外島區碼" },
  },
  {
    feature: "健保卡卡號格式",
    handRolled: { value: "🟡", note: "通常只做位數檢查" },
    generic: { value: "❌", note: "無" },
    taiwanUI: { value: "✅", note: "12 位檢查 + 文件明示需搭配讀卡機 SDK" },
  },
  {
    feature: "車牌：新式 / 舊式 / 機車重型",
    handRolled: { value: "🟡", note: "新式 (3+4) 通常有，機車重型常漏" },
    generic: { value: "❌", note: "無" },
    taiwanUI: { value: "✅", note: "全部 4 種格式 + hint=\"motorcycle\" 切換" },
  },
  {
    feature: "統一發票：格式驗證",
    handRolled: { value: "🟡", note: "通常只檢查 AB-12345678 字面" },
    generic: { value: "❌", note: "無" },
    taiwanUI: { value: "✅", note: "格式 + 中獎號碼比對 (v0.3 路線圖)" },
  },
  {
    feature: "金額：阿拉伯 → 大寫中文",
    handRolled: { value: "❌", note: "幾乎沒人做" },
    generic: { value: "❌", note: "無" },
    taiwanUI: { value: "✅", note: "1,234,567 → 壹佰貳拾參萬肆仟伍佰陸拾柒元整" },
  },
  {
    feature: "個人綜所稅累進稅額試算",
    handRolled: { value: "🟡", note: "稅率年年變，舊實作常過時" },
    generic: { value: "❌", note: "無" },
    taiwanUI: { value: "✅", note: "TaxBracketCalculator 對應 2025 財政部 公告" },
  },
  {
    feature: "WCAG 2.2 AA 無障礙",
    handRolled: { value: "❌", note: "aria-* 屬性多半缺失" },
    generic: { value: "🟡", note: "依套件而定" },
    taiwanUI: { value: "✅", note: "全部 21 元件含 aria-label / aria-invalid / role=alert" },
  },
  {
    feature: "TypeScript 完整型別",
    handRolled: { value: "❌", note: "通常 any" },
    generic: { value: "🟡", note: "依套件而定" },
    taiwanUI: { value: "✅", note: "嚴格 mode、validator 結果完整 union 型別" },
  },
  {
    feature: "執行依賴數量",
    handRolled: { value: "—", note: "0 (但你自己寫 + 維護)" },
    generic: { value: "🟡", note: "通常 5–20 個 transitive deps" },
    taiwanUI: { value: "✅", note: "0 — 元件僅依賴 React" },
  },
  {
    feature: "CI / 自動測試",
    handRolled: { value: "❌", note: "罕見" },
    generic: { value: "🟡", note: "依套件而定" },
    taiwanUI: { value: "✅", note: "GitHub Actions: typecheck + 157 tests + build + audit" },
  },
  {
    feature: "邊界誠實 (GOVT_READINESS.md)",
    handRolled: { value: "❌", note: "通常無文件" },
    generic: { value: "❌", note: "通常過度承諾" },
    taiwanUI: { value: "✅", note: "公開列出 10 項「不適合」情境" },
  },
] as const;

const Pill = ({ value }: { value: string }) => {
  const cls =
    value === "✅"
      ? "bg-green-500/15 text-green-400 border-green-500/30"
      : value === "🟡"
      ? "bg-yellow-500/15 text-yellow-400 border-yellow-500/30"
      : value === "❌"
      ? "bg-red-500/15 text-red-400 border-red-500/30"
      : "bg-[var(--card-bg)] text-[var(--muted)] border-[var(--card-border)]";
  return (
    <span
      className={`inline-flex items-center justify-center w-7 h-7 rounded-md border font-bold ${cls}`}
    >
      {value}
    </span>
  );
};

export default function ComparePage() {
  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Hero */}
        <header className="mb-12 max-w-3xl">
          <h1 className="text-3xl sm:text-4xl font-bold font-serif mb-3">
            為什麼選 Forge？
          </h1>
          <p className="text-[var(--muted)] text-sm leading-relaxed">
            Most Taiwan-localized form inputs in the wild are either copy-pasted
            from Stack Overflow with subtle bugs, or built on generic
            international libraries that don&apos;t know about{" "}
            <code className="text-xs bg-[var(--surface)] px-1 rounded">
              0836
            </code>{" "}
            (馬祖) or{" "}
            <code className="text-xs bg-[var(--surface)] px-1 rounded">
              7-rule
            </code>
            . Here&apos;s how Forge compares.
          </p>
          <p className="text-[var(--muted)] text-sm leading-relaxed mt-2 italic">
            民間 React 元件解決方案的常見問題 — Stack Overflow 抄寫、generic 國際套件不認識台灣本土規格。
          </p>
        </header>

        {/* Table */}
        <div className="overflow-x-auto -mx-4 sm:mx-0">
          <table className="min-w-full text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-[var(--card-border)]">
                <th className="text-left py-3 px-3 font-semibold text-[var(--muted)] uppercase text-[10px] tracking-wider">
                  項目 · Feature
                </th>
                <th className="text-center py-3 px-3 font-semibold w-32">
                  自寫驗證器
                  <div className="text-[10px] text-[var(--muted)] font-normal mt-0.5">
                    Hand-rolled
                  </div>
                </th>
                <th className="text-center py-3 px-3 font-semibold w-32">
                  通用國際庫
                  <div className="text-[10px] text-[var(--muted)] font-normal mt-0.5">
                    Generic libs
                  </div>
                </th>
                <th className="text-center py-3 px-3 font-semibold w-32 bg-blue-500/5 rounded-t-lg">
                  Forge
                  <div className="text-[10px] text-blue-400/70 font-normal mt-0.5">
                    這套
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {ROWS.map((row, i) => (
                <tr
                  key={row.feature}
                  className={`border-b border-[var(--card-border)] ${
                    i % 2 === 0 ? "bg-[var(--card-bg)]/30" : ""
                  }`}
                >
                  <td className="py-3 px-3 align-top">
                    <div className="font-medium">{row.feature}</div>
                  </td>
                  <td className="py-3 px-3 text-center align-top">
                    <Pill value={row.handRolled.value} />
                    <div className="text-[10px] text-[var(--muted)] mt-1.5 leading-tight">
                      {row.handRolled.note}
                    </div>
                  </td>
                  <td className="py-3 px-3 text-center align-top">
                    <Pill value={row.generic.value} />
                    <div className="text-[10px] text-[var(--muted)] mt-1.5 leading-tight">
                      {row.generic.note}
                    </div>
                  </td>
                  <td className="py-3 px-3 text-center align-top bg-blue-500/5">
                    <Pill value={row.taiwanUI.value} />
                    <div className="text-[10px] text-[var(--muted)] mt-1.5 leading-tight">
                      {row.taiwanUI.note}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer notes */}
        <section className="mt-12 grid sm:grid-cols-2 gap-4 text-xs leading-relaxed text-[var(--muted)]">
          <aside className="p-4 rounded-lg bg-[var(--card-bg)] border border-[var(--card-border)]">
            <h2 className="font-bold text-[var(--foreground)] mb-2 text-sm">
              方法論 · Methodology
            </h2>
            <p>
              「自寫驗證器」一欄基於對 50+ 個 GitHub 上公開的台灣專案非正式抽樣。「通用國際庫」泛指 Yup、Zod、async-validator 等不含台灣特定規則之套件。
            </p>
          </aside>
          <aside className="p-4 rounded-lg bg-[var(--card-bg)] border border-[var(--card-border)]">
            <h2 className="font-bold text-[var(--foreground)] mb-2 text-sm">
              Forge 也不適合的場景
            </h2>
            <p>
              本表只比格式與 UI 層。對於需要「真偽驗證」之高風險場景 (KYC、處方箋、政府福利資格)，請參考{" "}
              <Link
                href="https://github.com/LawrenceKuok/taiwan-ui/blob/main/GOVT_READINESS.md"
                className="text-blue-400 underline"
              >
                GOVT_READINESS.md
              </Link>
              。
            </p>
          </aside>
        </section>

        {/* CTA */}
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/components"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-colors"
          >
            瀏覽全部元件
          </Link>
          <code className="px-4 py-3 rounded-lg bg-[var(--card-bg)] border border-[var(--card-border)] text-sm font-mono">
            npx taiwan-ui add twid-input
          </code>
        </div>
      </div>
    </div>
  );
}

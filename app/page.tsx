"use client";

import Link from "next/link";
import { useState } from "react";
import TryItNow from "@/components/TryItNow";
import ROCDatePicker, { type ROCDate } from "@/components/taiwan/ROCDatePicker";
import TWIDInput from "@/components/taiwan/TWIDInput";
import TaiwanAddressInput, { type TaiwanAddress } from "@/components/taiwan/TaiwanAddressInput";
import TaiwanPaymentButton from "@/components/taiwan/TaiwanPaymentButton";
import UniformInvoiceInput from "@/components/taiwan/UniformInvoiceInput";

/* ─── Live mini-preview wrappers ───────────────────────────────────── */

function PreviewROC() {
  const [d, setD] = useState<ROCDate | null>(null);
  return <ROCDatePicker value={d} onChange={setD} />;
}

function PreviewTWID() {
  const [v, setV] = useState("A123456789");
  return <TWIDInput value={v} onChange={setV} />;
}

function PreviewAddr() {
  const [a, setA] = useState<TaiwanAddress | null>(null);
  return <TaiwanAddressInput value={a} onChange={setA} />;
}

function PreviewPay() {
  return (
    <div className="flex gap-2">
      <TaiwanPaymentButton provider="linepay" amount={1250} onClick={() => {}} size="sm" />
      <TaiwanPaymentButton provider="jkopay" amount={890} onClick={() => {}} size="sm" />
    </div>
  );
}

function PreviewInvoice() {
  const [v, setV] = useState("AB-12345678");
  return <UniformInvoiceInput value={v} onChange={(val) => setV(val)} />;
}

/* ─── Component data ───────────────────────────────────────────────── */

const COMPONENTS = [
  {
    slug: "roc-date-picker",
    name: "ROCDatePicker",
    zh: "民國日期選擇器",
    desc: "民國/西元雙曆顯示，支援日期範圍限制",
    preview: PreviewROC,
    tags: ["民國紀年", "雙曆", "minDate/maxDate"],
  },
  {
    slug: "twid-input",
    name: "TWIDInput",
    zh: "身分證字號驗證",
    desc: "即時 checksum 驗證，自動辨識國民身分證與居留證",
    preview: PreviewTWID,
    tags: ["校驗碼", "26 地區碼", "ARC 支援"],
  },
  {
    slug: "taiwan-address-input",
    name: "TaiwanAddressInput",
    zh: "台灣地址輸入",
    desc: "三級聯動縣市鄉鎮區，自動帶入郵遞區號",
    preview: PreviewAddr,
    tags: ["22 縣市", "368 鄉鎮區", "自動郵遞區號"],
  },
  {
    slug: "taiwan-payment-button",
    name: "TaiwanPaymentButton",
    zh: "本土支付按鈕",
    desc: "LINE Pay / JKO Pay 品牌規範按鈕",
    preview: PreviewPay,
    tags: ["LINE Pay", "街口支付", "3 尺寸"],
  },
  {
    slug: "uniform-invoice-input",
    name: "UniformInvoiceInput",
    zh: "統一發票輸入",
    desc: "自動格式化 XX-XXXXXXXX，即時格式驗證",
    preview: PreviewInvoice,
    tags: ["自動連字號", "格式驗證"],
  },
];

const ROADMAP = [
  { name: "eGUI 電子發票 API 串接", status: "規劃中" },
  { name: "自然人憑證整合", status: "評估中" },
  { name: "Taiwan FidO 身分驗證", status: "評估中" },
  { name: "金融卡 / 信用卡格式 (六大行庫)", status: "規劃中" },
  { name: "GOVT_READINESS 1.0 自評再審", status: "規劃中" },
];

/* ─── Page ─────────────────────────────────────────────────────────── */

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      {/* ── Hero ── */}
      <section className="relative overflow-hidden grid-pattern">
        {/* Glow orb */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 pt-20 sm:pt-32 pb-20 text-center">
          <div className="animate-fade-in-up opacity-0">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-medium border border-blue-500/20 bg-blue-500/10 text-blue-400 mb-8">
              Open Source &middot; MIT License &middot; Made for Taiwan
            </span>
          </div>

          <div className="animate-fade-in-up opacity-0 inline-flex items-center gap-2 mb-6">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-white font-black text-lg shadow-lg shadow-orange-500/20">
              F
            </div>
            <span className="text-xl font-bold tracking-tight">Forge</span>
          </div>
          <h1 className="animate-fade-in-up opacity-0 animate-delay-100 text-4xl sm:text-6xl lg:text-7xl font-bold font-serif leading-[1.1] tracking-tight">
            <span className="gradient-text">停止重寫</span>
            <br />
            <span className="text-[var(--foreground)]">台灣驗證器</span>
          </h1>

          <p className="animate-fade-in-up opacity-0 animate-delay-200 text-base sm:text-lg text-[var(--muted)] mt-6 max-w-xl mx-auto leading-relaxed">
            民國紀年、身分證、統編、健保卡、車牌、電話、地址 ——
            <br className="hidden sm:inline" />
            21 個開源 React 元件，零依賴，<span className="text-[var(--foreground)] font-medium">157 筆測試</span>，MIT 授權。
          </p>
          <p className="animate-fade-in-up opacity-0 animate-delay-200 text-xs text-[var(--muted)]/70 mt-3 max-w-xl mx-auto italic">
            21 open-source React components for the Taiwan-localized form
            inputs every developer keeps rebuilding.
          </p>

          <div className="animate-fade-in-up opacity-0 animate-delay-300 flex flex-col sm:flex-row items-center justify-center gap-3 mt-10">
            <Link
              href="/components"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-colors shadow-lg shadow-blue-600/20"
            >
              瀏覽元件庫
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <Link
              href="/form"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-[var(--card-border)] hover:bg-[var(--card-bg)] font-semibold transition-colors"
            >
              完整表單範例
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>

          {/* Stats */}
          <div className="animate-fade-in-up opacity-0 animate-delay-400 grid grid-cols-4 gap-4 max-w-lg mx-auto mt-16">
            {[
              { v: "21", l: "元件" },
              { v: "11", l: "校驗器" },
              { v: "150+", l: "單元測試" },
              { v: "零", l: "外部依賴" },
            ].map((s) => (
              <div key={s.l} className="text-center">
                <p className="text-xl sm:text-2xl font-bold text-blue-400">{s.v}</p>
                <p className="text-[10px] text-[var(--muted)] mt-0.5">{s.l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Try It Now interactive widget ── */}
      <TryItNow />

      {/* ── Why section ── */}
      <section className="border-t border-[var(--card-border)]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-20">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold font-serif">
              為什麼需要本土化元件？
            </h2>
            <p className="text-[var(--muted)] mt-3 max-w-lg mx-auto text-sm">
              台灣數位服務有獨特需求，每個團隊都在重複造輪子。
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            {[
              {
                icon: (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3l-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3l-3 3" />
                  </svg>
                ),
                title: "消除重複開發",
                desc: "身分證驗證、郵遞區號、民國日期——這些邏輯不該每個專案重寫。",
              },
              {
                icon: (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                  </svg>
                ),
                title: "正確性保證",
                desc: "完整校驗邏輯：身分證 checksum、368 鄉鎮區郵遞區號、發票格式。",
              },
              {
                icon: (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                  </svg>
                ),
                title: "即裝即用",
                desc: "零外部依賴、TypeScript 型別完整、深色模式支援。",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="p-5 rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] hover:border-blue-500/30 transition-colors"
              >
                <div className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-blue-500/10 text-blue-400 mb-3">
                  {item.icon}
                </div>
                <h3 className="font-bold text-sm mb-1">{item.title}</h3>
                <p className="text-xs text-[var(--muted)] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Components showcase with LIVE previews ── */}
      <section className="border-t border-[var(--card-border)]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-20">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold font-serif">
              五大核心元件
            </h2>
            <p className="text-[var(--muted)] mt-3 text-sm">
              每個元件都可直接互動 — 點擊試用
            </p>
          </div>

          <div className="space-y-4">
            {COMPONENTS.map((c) => {
              const Preview = c.preview;
              return (
                <Link
                  key={c.name}
                  href={`/components/${c.slug}`}
                  className="group block rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] hover:border-blue-500/40 transition-all overflow-hidden"
                >
                  <div className="flex flex-col lg:flex-row">
                    {/* Info */}
                    <div className="p-5 lg:w-72 shrink-0 flex flex-col justify-center">
                      <h3 className="font-bold text-sm group-hover:text-blue-400 transition-colors">
                        {c.name}
                      </h3>
                      <p className="text-xs text-blue-400/80 mb-1">{c.zh}</p>
                      <p className="text-xs text-[var(--muted)] leading-relaxed mb-3">
                        {c.desc}
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {c.tags.map((t) => (
                          <span
                            key={t}
                            className="px-2 py-0.5 rounded text-[10px] bg-[var(--surface)] text-[var(--muted)] border border-[var(--card-border)]"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Live preview */}
                    <div
                      className="flex-1 p-5 border-t lg:border-t-0 lg:border-l border-[var(--card-border)] bg-[var(--surface)]"
                      onClick={(e) => e.preventDefault()}
                    >
                      <Preview />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          <div className="text-center mt-8">
            <Link
              href="/components"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-[var(--card-border)] hover:bg-[var(--card-bg)] text-sm font-medium transition-colors"
            >
              瀏覽全部 12 個元件
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Integration ── */}
      <section className="border-t border-[var(--card-border)]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-20">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold font-serif">
              三步驟快速整合
            </h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              { n: "1", title: "安裝", code: "npx taiwan-ui add twid-input" },
              { n: "2", title: "引入", code: `import TWIDInput\n  from '@/components/taiwan/TWIDInput'` },
              { n: "3", title: "使用", code: `<TWIDInput\n  value={id}\n  onChange={setId} />` },
            ].map((s) => (
              <div key={s.n} className="text-center">
                <div className="inline-flex items-center justify-center w-8 h-8 rounded-full border border-blue-500/30 text-blue-400 text-xs font-bold mb-4">
                  {s.n}
                </div>
                <h3 className="font-bold text-sm mb-3">{s.title}</h3>
                <pre className="p-3 rounded-lg bg-[var(--card-bg)] border border-[var(--card-border)] text-[var(--foreground)] text-xs text-left overflow-x-auto font-mono">
                  {s.code}
                </pre>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Accessibility & Compliance ── */}
      <section className="border-t border-[var(--card-border)]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-20">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold font-serif">
              無障礙 &middot; 合規 &middot; 標準
            </h2>
            <p className="text-[var(--muted)] mt-3 text-sm">
              Accessibility, Compliance & Standards
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: "♿", title: "WCAG 2.1 AA", desc: "鍵盤導航、螢幕閱讀器支援、高對比度" },
              { icon: "🔒", title: "資料安全", desc: "純前端驗證，不傳送任何個資至外部伺服器" },
              { icon: "📱", title: "響應式設計", desc: "375px 起完整支援，適用行動裝置" },
              { icon: "🌐", title: "國際化就緒", desc: "中英雙語介面，可擴展多語系" },
            ].map((item) => (
              <div
                key={item.title}
                className="p-4 rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)]"
              >
                <div className="text-lg mb-2">{item.icon}</div>
                <h3 className="font-bold text-xs mb-1">{item.title}</h3>
                <p className="text-[10px] text-[var(--muted)] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Roadmap ── */}
      <section className="border-t border-[var(--card-border)]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-20">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold font-serif">
              發展藍圖
            </h2>
            <p className="text-[var(--muted)] mt-3 text-sm">
              Roadmap — 持續擴充台灣數位服務所需的核心元件
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 max-w-3xl mx-auto">
            {ROADMAP.map((item) => (
              <div
                key={item.name}
                className="flex items-center gap-3 px-4 py-3 rounded-lg border border-dashed border-[var(--card-border)] bg-[var(--card-bg)]"
              >
                <div className="w-2 h-2 rounded-full bg-blue-500/40 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium truncate">{item.name}</p>
                </div>
                <span className="text-[10px] text-[var(--muted)] shrink-0">
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="border-t border-[var(--card-border)] relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-blue-500/5 to-transparent pointer-events-none" />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 py-20 text-center">
          <h2 className="text-2xl font-bold font-serif mb-3">
            開始使用台灣 UI 元件庫
          </h2>
          <p className="text-[var(--muted)] mb-8 text-sm">
            查看互動式元件文件，或瀏覽完整的政府表單範例
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/components"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-colors shadow-lg shadow-blue-600/20"
            >
              瀏覽元件庫 →
            </Link>
            <Link
              href="/form"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-[var(--card-border)] hover:bg-[var(--card-bg)] font-semibold transition-colors"
            >
              表單範例 →
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-[var(--card-border)] py-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] text-[var(--muted)]">
          <p>台灣 UI 元件庫 &middot; Open Source &middot; MIT License</p>
          <p>Built with Next.js &middot; TypeScript &middot; Tailwind CSS</p>
        </div>
      </footer>
    </div>
  );
}

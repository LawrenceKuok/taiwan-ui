"use client";

import { useState, useEffect, useCallback } from "react";
import ROCDatePicker, { type ROCDate } from "@/components/taiwan/ROCDatePicker";
import TWIDInput, { type TWIDResult } from "@/components/taiwan/TWIDInput";
import TaiwanAddressInput, { type TaiwanAddress } from "@/components/taiwan/TaiwanAddressInput";
import TaiwanPaymentButton, { type PaymentProvider } from "@/components/taiwan/TaiwanPaymentButton";
import UniformInvoiceInput, { type InvoiceResult } from "@/components/taiwan/UniformInvoiceInput";

/* ─── Shared UI pieces ─────────────────────────────────────────────── */

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="inline-flex items-center gap-2 cursor-pointer select-none text-sm">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative w-9 h-5 rounded-full transition-colors ${
          checked ? "bg-blue-500" : "bg-gray-300 dark:bg-gray-600"
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform shadow ${
            checked ? "translate-x-4" : ""
          }`}
        />
      </button>
      <span className="text-[var(--foreground)]">{label}</span>
    </label>
  );
}

function CodeBlock({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);
  const copy = useCallback(() => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [code]);

  return (
    <div className="relative group">
      <pre className="p-4 rounded-lg bg-gray-900 text-gray-100 text-xs leading-relaxed overflow-x-auto font-mono">
        {code}
      </pre>
      <button
        onClick={copy}
        className="absolute top-2 right-2 px-2 py-1 text-xs rounded bg-gray-700 text-gray-300 hover:bg-gray-600 opacity-0 group-hover:opacity-100 transition-opacity"
      >
        {copied ? "Copied!" : "Copy"}
      </button>
    </div>
  );
}

function JsonOutput({ data }: { data: unknown }) {
  return (
    <pre className="p-3 rounded-lg bg-gray-50 dark:bg-gray-900 text-xs overflow-x-auto text-[var(--foreground)] font-mono leading-relaxed">
      {JSON.stringify(data, null, 2)}
    </pre>
  );
}

function SectionLabel({ children }: { children: string }) {
  return (
    <p className="text-[10px] font-semibold uppercase tracking-widest text-[var(--muted)] mb-2">
      {children}
    </p>
  );
}

/* ─── Sidebar nav items ────────────────────────────────────────────── */

const NAV_ITEMS = [
  { id: "roc-date-picker", en: "ROCDatePicker", zh: "民國日期" },
  { id: "twid-input", en: "TWIDInput", zh: "身分證字號" },
  { id: "address-input", en: "AddressInput", zh: "台灣地址" },
  { id: "payment-button", en: "PaymentButton", zh: "支付按鈕" },
  { id: "invoice-input", en: "InvoiceInput", zh: "統一發票" },
];

/* ─── Main page ────────────────────────────────────────────────────── */

export default function DemoPage() {
  const [activeSection, setActiveSection] = useState(NAV_ITEMS[0].id);

  // Intersection observer for active sidebar highlight
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        }
      },
      { rootMargin: "-20% 0px -70% 0px" }
    );
    NAV_ITEMS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  /* ── Component states ── */

  // ROCDatePicker
  const [rocDate, setRocDate] = useState<ROCDate | null>(null);
  const [rocDisabled, setRocDisabled] = useState(false);
  const [rocShowGregorian, setRocShowGregorian] = useState(true);
  const [rocUseMinMax, setRocUseMinMax] = useState(false);

  // TWIDInput
  const [twidValue, setTwidValue] = useState("");
  const [twidResult, setTwidResult] = useState<TWIDResult>({ valid: false, type: "invalid", raw: "" });
  const [twidDisabled, setTwidDisabled] = useState(false);
  const [twidShowRegion, setTwidShowRegion] = useState(true);

  // TaiwanAddressInput
  const [address, setAddress] = useState<TaiwanAddress | null>(null);
  const [addrDisabled, setAddrDisabled] = useState(false);

  // TaiwanPaymentButton
  const [paymentEvent, setPaymentEvent] = useState<{ provider: string; timestamp: string } | null>(null);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentSize, setPaymentSize] = useState<"sm" | "md" | "lg">("md");

  // UniformInvoiceInput
  const [invoiceValue, setInvoiceValue] = useState("");
  const [invoiceResult, setInvoiceResult] = useState<InvoiceResult>({ valid: false, formatted: "", raw: "" });
  const [invoiceDisabled, setInvoiceDisabled] = useState(false);

  const handlePayment = (provider: PaymentProvider) => {
    setPaymentLoading(true);
    setPaymentEvent({ provider, timestamp: new Date().toISOString() });
    setTimeout(() => setPaymentLoading(false), 1500);
  };

  const rocOutput = rocDate
    ? {
        rocYear: rocDate.year - 1911,
        gregorianYear: rocDate.year,
        month: rocDate.month + 1,
        day: rocDate.day,
        formatted: `民國 ${rocDate.year - 1911} 年 ${rocDate.month + 1} 月 ${rocDate.day} 日`,
        iso: `${rocDate.year}-${String(rocDate.month + 1).padStart(2, "0")}-${String(rocDate.day).padStart(2, "0")}`,
      }
    : null;

  const today = new Date();
  const minDate = rocUseMinMax ? new Date(today.getFullYear(), today.getMonth(), 1) : undefined;
  const maxDate = rocUseMinMax ? new Date(today.getFullYear(), today.getMonth() + 1, 0) : undefined;

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] transition-colors scroll-smooth">
      {/* ── Hero header ── */}
      <header className="border-b border-[var(--card-border)] bg-gradient-to-b from-blue-50/60 to-transparent dark:from-blue-950/20 dark:to-transparent">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
          <p className="text-xs font-semibold uppercase tracking-widest text-blue-600 dark:text-blue-400 mb-2">
            Component Registry · 元件文件
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif">
            互動式元件文件
          </h1>
          <p className="text-[var(--muted)] mt-2 max-w-lg text-sm">
            每個元件皆可即時切換屬性、檢視輸出結果、複製程式碼。
          </p>
        </div>
      </header>

      {/* ── Body: sidebar + content ── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex gap-8">
        {/* Sidebar */}
        <aside className="hidden lg:block w-48 shrink-0 py-8">
          <nav className="sticky top-20 space-y-1">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-[var(--muted)] mb-3">
              Components
            </p>
            {NAV_ITEMS.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className={`block px-3 py-1.5 rounded-md text-sm transition-colors ${
                  activeSection === item.id
                    ? "bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 font-medium"
                    : "text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-gray-50 dark:hover:bg-gray-800/50"
                }`}
              >
                <span className="block">{item.en}</span>
                <span className="block text-[10px] opacity-60">{item.zh}</span>
              </a>
            ))}
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 min-w-0 py-8 space-y-16 pb-24">
          {/* ═══════════ ROCDatePicker ═══════════ */}
          <section id="roc-date-picker">
            <div className="mb-4">
              <h2 className="text-xl font-bold">ROCDatePicker</h2>
              <p className="text-sm text-[var(--muted)]">
                民國日期選擇器 — Date picker with ROC (民國) year conversion and dual-calendar display.
              </p>
            </div>

            <div className="border border-[var(--card-border)] rounded-xl overflow-hidden">
              {/* Controls */}
              <div className="flex flex-wrap gap-4 px-5 py-3 bg-gray-50/50 dark:bg-gray-900/30 border-b border-[var(--card-border)]">
                <Toggle label="disabled" checked={rocDisabled} onChange={setRocDisabled} />
                <Toggle label="showGregorianSub" checked={rocShowGregorian} onChange={setRocShowGregorian} />
                <Toggle label="minDate / maxDate (current month)" checked={rocUseMinMax} onChange={setRocUseMinMax} />
              </div>

              {/* Demo */}
              <div className="p-5 bg-[var(--card-bg)]">
                <div className="max-w-sm">
                  <ROCDatePicker
                    value={rocDate}
                    onChange={setRocDate}
                    disabled={rocDisabled}
                    showGregorianSub={rocShowGregorian}
                    minDate={minDate}
                    maxDate={maxDate}
                  />
                </div>
              </div>

              {/* Output */}
              <div className="px-5 py-4 border-t border-[var(--card-border)] bg-[var(--card-bg)]">
                <SectionLabel>Output</SectionLabel>
                <JsonOutput data={rocOutput} />
              </div>

              {/* Code */}
              <div className="px-5 py-4 border-t border-[var(--card-border)]">
                <SectionLabel>Usage</SectionLabel>
                <CodeBlock
                  code={`import ROCDatePicker from '@/components/taiwan/ROCDatePicker'

<ROCDatePicker
  value={date}
  onChange={setDate}
  showGregorianSub={true}
  minDate={new Date(2025, 0, 1)}
  maxDate={new Date(2025, 11, 31)}
/>`}
                />
              </div>
            </div>
          </section>

          {/* ═══════════ TWIDInput ═══════════ */}
          <section id="twid-input">
            <div className="mb-4">
              <h2 className="text-xl font-bold">TWIDInput</h2>
              <p className="text-sm text-[var(--muted)]">
                身分證字號輸入 — Taiwan National ID / ARC number input with real-time checksum validation and region detection.
              </p>
            </div>

            <div className="border border-[var(--card-border)] rounded-xl overflow-hidden">
              <div className="flex flex-wrap gap-4 px-5 py-3 bg-gray-50/50 dark:bg-gray-900/30 border-b border-[var(--card-border)]">
                <Toggle label="disabled" checked={twidDisabled} onChange={setTwidDisabled} />
                <Toggle label="showRegion" checked={twidShowRegion} onChange={setTwidShowRegion} />
              </div>

              <div className="p-5 bg-[var(--card-bg)]">
                <div className="max-w-sm">
                  <TWIDInput
                    value={twidValue}
                    onChange={setTwidValue}
                    onValidate={setTwidResult}
                    disabled={twidDisabled}
                    showRegion={twidShowRegion}
                  />
                </div>
                <p className="text-xs text-[var(--muted)] mt-3">
                  Try: <button type="button" className="font-mono text-blue-500 hover:underline" onClick={() => { setTwidValue("A123456789"); setTwidResult({ valid: true, type: "citizen", region: "臺北市", raw: "A123456789" }); }}>A123456789</button> (valid) or <button type="button" className="font-mono text-blue-500 hover:underline" onClick={() => { setTwidValue("X987654321"); setTwidResult({ valid: false, type: "invalid", raw: "X987654321" }); }}>X987654321</button> (invalid)
                </p>
              </div>

              <div className="px-5 py-4 border-t border-[var(--card-border)] bg-[var(--card-bg)]">
                <SectionLabel>Output</SectionLabel>
                <JsonOutput data={twidResult} />
              </div>

              <div className="px-5 py-4 border-t border-[var(--card-border)]">
                <SectionLabel>Usage</SectionLabel>
                <CodeBlock
                  code={`import TWIDInput from '@/components/taiwan/TWIDInput'

<TWIDInput
  value={idNumber}
  onChange={setIdNumber}
  onValidate={(result) => {
    // result.valid, result.type, result.region
  }}
  showRegion={true}
/>`}
                />
              </div>
            </div>
          </section>

          {/* ═══════════ TaiwanAddressInput ═══════════ */}
          <section id="address-input">
            <div className="mb-4">
              <h2 className="text-xl font-bold">TaiwanAddressInput</h2>
              <p className="text-sm text-[var(--muted)]">
                台灣地址輸入 — Cascading city/district selector with auto-filled 3-digit postal code. Covers all 22 cities and ~368 districts.
              </p>
            </div>

            <div className="border border-[var(--card-border)] rounded-xl overflow-hidden">
              <div className="flex flex-wrap gap-4 px-5 py-3 bg-gray-50/50 dark:bg-gray-900/30 border-b border-[var(--card-border)]">
                <Toggle label="disabled" checked={addrDisabled} onChange={setAddrDisabled} />
              </div>

              <div className="p-5 bg-[var(--card-bg)]">
                <TaiwanAddressInput
                  value={address}
                  onChange={setAddress}
                  disabled={addrDisabled}
                />
              </div>

              <div className="px-5 py-4 border-t border-[var(--card-border)] bg-[var(--card-bg)]">
                <SectionLabel>Output</SectionLabel>
                <JsonOutput data={address ?? { postalCode: "", city: "", district: "", streetAddress: "" }} />
              </div>

              <div className="px-5 py-4 border-t border-[var(--card-border)]">
                <SectionLabel>Usage</SectionLabel>
                <CodeBlock
                  code={`import TaiwanAddressInput from '@/components/taiwan/TaiwanAddressInput'

<TaiwanAddressInput
  value={address}
  onChange={setAddress}
  placeholder="請輸入詳細地址"
/>`}
                />
              </div>
            </div>
          </section>

          {/* ═══════════ TaiwanPaymentButton ═══════════ */}
          <section id="payment-button">
            <div className="mb-4">
              <h2 className="text-xl font-bold">TaiwanPaymentButton</h2>
              <p className="text-sm text-[var(--muted)]">
                台灣支付按鈕 — Branded payment buttons for LINE Pay and JKO Pay (街口支付) with loading states and size variants.
              </p>
            </div>

            <div className="border border-[var(--card-border)] rounded-xl overflow-hidden">
              {/* Size selector */}
              <div className="flex flex-wrap items-center gap-4 px-5 py-3 bg-gray-50/50 dark:bg-gray-900/30 border-b border-[var(--card-border)]">
                <span className="text-xs text-[var(--muted)]">size:</span>
                {(["sm", "md", "lg"] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => setPaymentSize(s)}
                    className={`px-2.5 py-0.5 text-xs rounded-full border transition-colors ${
                      paymentSize === s
                        ? "border-blue-500 bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                        : "border-[var(--card-border)] text-[var(--muted)] hover:border-blue-300"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>

              <div className="p-5 bg-[var(--card-bg)] space-y-5">
                {/* With amount */}
                <div>
                  <p className="text-xs text-[var(--muted)] mb-2">With amount</p>
                  <div className="flex flex-wrap gap-3">
                    <TaiwanPaymentButton provider="linepay" amount={1250} onClick={handlePayment} loading={paymentLoading} size={paymentSize} />
                    <TaiwanPaymentButton provider="jkopay" amount={890} onClick={handlePayment} loading={paymentLoading} size={paymentSize} />
                  </div>
                </div>

                {/* Without amount */}
                <div>
                  <p className="text-xs text-[var(--muted)] mb-2">Without amount</p>
                  <div className="flex flex-wrap gap-3">
                    <TaiwanPaymentButton provider="linepay" onClick={handlePayment} size={paymentSize} />
                    <TaiwanPaymentButton provider="jkopay" onClick={handlePayment} size={paymentSize} />
                    <TaiwanPaymentButton provider="streetpay" onClick={handlePayment} size={paymentSize} />
                  </div>
                </div>

                {/* States */}
                <div>
                  <p className="text-xs text-[var(--muted)] mb-2">Disabled + Full width</p>
                  <div className="space-y-2 max-w-sm">
                    <TaiwanPaymentButton provider="linepay" amount={500} onClick={handlePayment} disabled size={paymentSize} />
                    <TaiwanPaymentButton provider="jkopay" amount={2000} onClick={handlePayment} size={paymentSize} fullWidth />
                  </div>
                </div>
              </div>

              <div className="px-5 py-4 border-t border-[var(--card-border)] bg-[var(--card-bg)]">
                <SectionLabel>Last event</SectionLabel>
                <JsonOutput data={paymentEvent ?? { provider: null, timestamp: null }} />
              </div>

              <div className="px-5 py-4 border-t border-[var(--card-border)]">
                <SectionLabel>Usage</SectionLabel>
                <CodeBlock
                  code={`import TaiwanPaymentButton from '@/components/taiwan/TaiwanPaymentButton'

<TaiwanPaymentButton
  provider="linepay"   // 'linepay' | 'jkopay' | 'streetpay'
  amount={1250}
  onClick={(provider) => checkout(provider)}
  size="md"            // 'sm' | 'md' | 'lg'
  fullWidth={false}
/>`}
                />
              </div>
            </div>
          </section>

          {/* ═══════════ UniformInvoiceInput ═══════════ */}
          <section id="invoice-input">
            <div className="mb-4">
              <h2 className="text-xl font-bold">UniformInvoiceInput</h2>
              <p className="text-sm text-[var(--muted)]">
                統一發票號碼輸入 — Taiwan uniform invoice number input with auto-formatting (XX-XXXXXXXX) and validation.
              </p>
            </div>

            <div className="border border-[var(--card-border)] rounded-xl overflow-hidden">
              <div className="flex flex-wrap gap-4 px-5 py-3 bg-gray-50/50 dark:bg-gray-900/30 border-b border-[var(--card-border)]">
                <Toggle label="disabled" checked={invoiceDisabled} onChange={setInvoiceDisabled} />
              </div>

              <div className="p-5 bg-[var(--card-bg)]">
                <div className="max-w-sm">
                  <UniformInvoiceInput
                    value={invoiceValue}
                    onChange={(val, result) => { setInvoiceValue(val); setInvoiceResult(result); }}
                    disabled={invoiceDisabled}
                  />
                </div>
                <p className="text-xs text-[var(--muted)] mt-3">
                  Format: 2 uppercase letters + hyphen + 8 digits. Try: <button type="button" className="font-mono text-blue-500 hover:underline" onClick={() => { setInvoiceValue("AB-12345678"); setInvoiceResult({ valid: true, formatted: "AB-12345678", raw: "AB12345678" }); }}>AB-12345678</button>
                </p>
              </div>

              <div className="px-5 py-4 border-t border-[var(--card-border)] bg-[var(--card-bg)]">
                <SectionLabel>Output</SectionLabel>
                <JsonOutput data={invoiceResult} />
              </div>

              <div className="px-5 py-4 border-t border-[var(--card-border)]">
                <SectionLabel>Usage</SectionLabel>
                <CodeBlock
                  code={`import UniformInvoiceInput from '@/components/taiwan/UniformInvoiceInput'

<UniformInvoiceInput
  value={invoice}
  onChange={(value, result) => {
    // result.valid, result.formatted, result.raw
  }}
/>`}
                />
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

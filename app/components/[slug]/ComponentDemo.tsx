"use client";

import { useState } from "react";
import ROCDatePicker, { type ROCDate } from "@/components/taiwan/ROCDatePicker";
import TWIDInput, { type TWIDResult } from "@/components/taiwan/TWIDInput";
import TaiwanAddressInput, { type TaiwanAddress } from "@/components/taiwan/TaiwanAddressInput";
import TaiwanPaymentButton from "@/components/taiwan/TaiwanPaymentButton";
import UniformInvoiceInput from "@/components/taiwan/UniformInvoiceInput";
import CompanyTaxIDInput, { type TaxIDResult } from "@/components/taiwan/CompanyTaxIDInput";
import PhoneBarcodeInput from "@/components/taiwan/PhoneBarcodeInput";
import TWPhoneInput, { type PhoneResult } from "@/components/taiwan/TWPhoneInput";
import LicensePlateInput, { type PlateResult } from "@/components/taiwan/LicensePlateInput";
import NHICardInput from "@/components/taiwan/NHICardInput";
import BankAccountInput, { type BankAccount } from "@/components/taiwan/BankAccountInput";
import eGUIInvoice from "@/components/taiwan/eGUIInvoice";
import TaiwanMap, { type TaiwanCountyCode, TAIWAN_COUNTIES } from "@/components/taiwan/TaiwanMap";
import PaymentMethodPicker, { type PaymentMethodId } from "@/components/taiwan/PaymentMethodPicker";
import TaiwanHolidayBadge from "@/components/taiwan/TaiwanHolidayBadge";
import ROCLunarCalendar from "@/components/taiwan/ROCLunarCalendar";
import EInvoiceQRScanner, { type ParsedInvoice } from "@/components/taiwan/EInvoiceQRScanner";
import TaiwanCurrencyInput from "@/components/taiwan/TaiwanCurrencyInput";
import ROCDateRangePicker, { type ROCDateRange } from "@/components/taiwan/ROCDateRangePicker";
import TaxBracketCalculator from "@/components/taiwan/TaxBracketCalculator";
import TaiwanCalendarMonth from "@/components/taiwan/TaiwanCalendarMonth";
import { toCapitalChinese } from "@/lib/currency-tw";

function DemoROCDatePicker() {
  const [date, setDate] = useState<ROCDate | null>(null);
  const [disabled, setDisabled] = useState(false);
  const [showGregorian, setShowGregorian] = useState(true);
  const [useMinMax, setUseMinMax] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3 text-xs">
        <label className="flex items-center gap-1.5 cursor-pointer">
          <input type="checkbox" checked={disabled} onChange={() => setDisabled(!disabled)} className="rounded" />
          disabled
        </label>
        <label className="flex items-center gap-1.5 cursor-pointer">
          <input type="checkbox" checked={showGregorian} onChange={() => setShowGregorian(!showGregorian)} className="rounded" />
          showGregorianSub
        </label>
        <label className="flex items-center gap-1.5 cursor-pointer">
          <input type="checkbox" checked={useMinMax} onChange={() => setUseMinMax(!useMinMax)} className="rounded" />
          minDate/maxDate
        </label>
      </div>
      <ROCDatePicker
        value={date}
        onChange={setDate}
        disabled={disabled}
        showGregorianSub={showGregorian}
        minDate={useMinMax ? new Date(2000, 0, 1) : undefined}
        maxDate={useMinMax ? new Date() : undefined}
      />
      {date && (
        <div className="text-xs font-mono p-3 rounded-lg bg-[var(--surface)] border border-[var(--card-border)] text-[var(--muted)]">
          {JSON.stringify({ rocYear: date.year - 1911, gregorianYear: date.year, month: date.month + 1, day: date.day }, null, 2)}
        </div>
      )}
    </div>
  );
}

function DemoTWIDInput() {
  const [value, setValue] = useState("");
  const [result, setResult] = useState<TWIDResult | null>(null);
  const [disabled, setDisabled] = useState(false);
  const [showRegion, setShowRegion] = useState(true);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3 text-xs">
        <label className="flex items-center gap-1.5 cursor-pointer">
          <input type="checkbox" checked={disabled} onChange={() => setDisabled(!disabled)} className="rounded" />
          disabled
        </label>
        <label className="flex items-center gap-1.5 cursor-pointer">
          <input type="checkbox" checked={showRegion} onChange={() => setShowRegion(!showRegion)} className="rounded" />
          showRegion
        </label>
        <button
          onClick={() => { setValue("A123456789"); }}
          className="px-2 py-0.5 rounded bg-blue-500/15 text-blue-400 hover:bg-blue-500/25 transition-colors"
        >
          Try A123456789
        </button>
      </div>
      <TWIDInput
        value={value}
        onChange={setValue}
        onValidate={setResult}
        disabled={disabled}
        showRegion={showRegion}
      />
      {result && (
        <div className="text-xs font-mono p-3 rounded-lg bg-[var(--surface)] border border-[var(--card-border)] text-[var(--muted)]">
          {JSON.stringify(result, null, 2)}
        </div>
      )}
    </div>
  );
}

function DemoTaiwanAddressInput() {
  const [address, setAddress] = useState<TaiwanAddress | null>(null);
  const [disabled, setDisabled] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3 text-xs">
        <label className="flex items-center gap-1.5 cursor-pointer">
          <input type="checkbox" checked={disabled} onChange={() => setDisabled(!disabled)} className="rounded" />
          disabled
        </label>
      </div>
      <TaiwanAddressInput value={address} onChange={setAddress} disabled={disabled} />
      {address && (
        <div className="text-xs font-mono p-3 rounded-lg bg-[var(--surface)] border border-[var(--card-border)] text-[var(--muted)]">
          {JSON.stringify(address, null, 2)}
        </div>
      )}
    </div>
  );
}

function DemoTaiwanPaymentButton() {
  const [size, setSize] = useState<"sm" | "md" | "lg">("md");
  const [lastClick, setLastClick] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3 text-xs">
        {(["sm", "md", "lg"] as const).map((s) => (
          <button
            key={s}
            onClick={() => setSize(s)}
            className={`px-2 py-0.5 rounded transition-colors ${
              size === s ? "bg-blue-500/15 text-blue-400" : "text-[var(--muted)] hover:bg-[var(--surface)]"
            }`}
          >
            {s}
          </button>
        ))}
      </div>
      <div className="flex flex-wrap gap-3">
        <TaiwanPaymentButton
          provider="linepay"
          amount={1250}
          onClick={() => setLastClick("LINE Pay")}
          size={size}
        />
        <TaiwanPaymentButton
          provider="jkopay"
          amount={890}
          onClick={() => setLastClick("JKO Pay")}
          size={size}
        />
      </div>
      {lastClick && (
        <div className="text-xs font-mono p-3 rounded-lg bg-[var(--surface)] border border-[var(--card-border)] text-[var(--muted)]">
          {JSON.stringify({ provider: lastClick, timestamp: new Date().toISOString() }, null, 2)}
        </div>
      )}
    </div>
  );
}

function DemoUniformInvoiceInput() {
  const [value, setValue] = useState("");
  const [disabled, setDisabled] = useState(false);

  const rawClean = value.replace(/-/g, "");
  const isValid = /^[A-Z]{2}\d{8}$/.test(rawClean);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3 text-xs">
        <label className="flex items-center gap-1.5 cursor-pointer">
          <input type="checkbox" checked={disabled} onChange={() => setDisabled(!disabled)} className="rounded" />
          disabled
        </label>
        <button
          onClick={() => setValue("AB-12345678")}
          className="px-2 py-0.5 rounded bg-blue-500/15 text-blue-400 hover:bg-blue-500/25 transition-colors"
        >
          Try AB-12345678
        </button>
      </div>
      <UniformInvoiceInput value={value} onChange={(val) => setValue(val)} disabled={disabled} />
      {rawClean.length === 10 && (
        <div className="text-xs font-mono p-3 rounded-lg bg-[var(--surface)] border border-[var(--card-border)] text-[var(--muted)]">
          {JSON.stringify({ valid: isValid, formatted: value, raw: rawClean }, null, 2)}
        </div>
      )}
    </div>
  );
}

function DemoCompanyTaxIDInput() {
  const [value, setValue] = useState("");
  const [result, setResult] = useState<TaxIDResult | null>(null);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3 text-xs">
        <button
          onClick={() => setValue("04595252")}
          className="px-2 py-0.5 rounded bg-blue-500/15 text-blue-400 hover:bg-blue-500/25 transition-colors"
        >
          Try 04595252
        </button>
      </div>
      <CompanyTaxIDInput value={value} onChange={setValue} onValidate={setResult} />
      {result && (
        <div className="text-xs font-mono p-3 rounded-lg bg-[var(--surface)] border border-[var(--card-border)] text-[var(--muted)]">
          {JSON.stringify(result, null, 2)}
        </div>
      )}
    </div>
  );
}

function DemoPhoneBarcodeInput() {
  const [value, setValue] = useState("/");

  const isComplete = value.length === 8 && value.startsWith("/");

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3 text-xs">
        <button
          onClick={() => setValue("/ABC+123")}
          className="px-2 py-0.5 rounded bg-blue-500/15 text-blue-400 hover:bg-blue-500/25 transition-colors"
        >
          Try /ABC+123
        </button>
      </div>
      <PhoneBarcodeInput value={value} onChange={(val) => setValue(val)} />
      {isComplete && (
        <div className="text-xs font-mono p-3 rounded-lg bg-[var(--surface)] border border-[var(--card-border)] text-[var(--muted)]">
          {JSON.stringify({ valid: /^\/[0-9A-Z.+\-]{7}$/.test(value), formatted: value }, null, 2)}
        </div>
      )}
    </div>
  );
}

function DemoTWPhoneInput() {
  const [value, setValue] = useState("");
  const [result, setResult] = useState<PhoneResult | null>(null);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3 text-xs">
        <button
          onClick={() => { setValue("0912345678"); }}
          className="px-2 py-0.5 rounded bg-blue-500/15 text-blue-400 hover:bg-blue-500/25 transition-colors"
        >
          Try 0912345678
        </button>
        <button
          onClick={() => { setValue("0223456789"); }}
          className="px-2 py-0.5 rounded bg-blue-500/15 text-blue-400 hover:bg-blue-500/25 transition-colors"
        >
          Try 02-2345-6789
        </button>
      </div>
      <TWPhoneInput value={value} onChange={setValue} onValidate={setResult} />
      {result && result.raw.length >= 9 && (
        <div className="text-xs font-mono p-3 rounded-lg bg-[var(--surface)] border border-[var(--card-border)] text-[var(--muted)]">
          {JSON.stringify(result, null, 2)}
        </div>
      )}
    </div>
  );
}

function DemoLicensePlateInput() {
  const [value, setValue] = useState("");
  const [result, setResult] = useState<PlateResult | null>(null);
  const [vehicleType, setVehicleType] = useState<"car" | "motorcycle" | "auto">("auto");

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3 text-xs">
        {(["auto", "car", "motorcycle"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setVehicleType(t)}
            className={`px-2 py-0.5 rounded transition-colors ${
              vehicleType === t ? "bg-blue-500/15 text-blue-400" : "text-[var(--muted)] hover:bg-[var(--surface)]"
            }`}
          >
            {t}
          </button>
        ))}
        <button
          onClick={() => setValue("ABC1234")}
          className="px-2 py-0.5 rounded bg-blue-500/15 text-blue-400 hover:bg-blue-500/25 transition-colors"
        >
          Try ABC-1234
        </button>
      </div>
      <LicensePlateInput value={value} onChange={setValue} onValidate={setResult} vehicleType={vehicleType} />
      {result && value.length >= 5 && (
        <div className="text-xs font-mono p-3 rounded-lg bg-[var(--surface)] border border-[var(--card-border)] text-[var(--muted)]">
          {JSON.stringify(result, null, 2)}
        </div>
      )}
    </div>
  );
}

function DemoNHICardInput() {
  const [value, setValue] = useState("");

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3 text-xs">
        <button
          onClick={() => setValue("123456789012")}
          className="px-2 py-0.5 rounded bg-blue-500/15 text-blue-400 hover:bg-blue-500/25 transition-colors"
        >
          Try 123456789012
        </button>
      </div>
      <NHICardInput value={value} onChange={setValue} />
      {value.length === 12 && (
        <div className="text-xs font-mono p-3 rounded-lg bg-[var(--surface)] border border-[var(--card-border)] text-[var(--muted)]">
          {JSON.stringify({ valid: /^\d{12}$/.test(value), raw: value }, null, 2)}
        </div>
      )}
    </div>
  );
}

function DemoBankAccountInput() {
  const [account, setAccount] = useState<BankAccount | null>(null);

  return (
    <div className="space-y-4">
      <BankAccountInput value={account} onChange={setAccount} />
      {account?.bankCode && (
        <div className="text-xs font-mono p-3 rounded-lg bg-[var(--surface)] border border-[var(--card-border)] text-[var(--muted)]">
          {JSON.stringify(account, null, 2)}
        </div>
      )}
    </div>
  );
}

function DemoEGUIInvoice() {
  const EGUIInvoice = eGUIInvoice;
  return (
    <EGUIInvoice
      invoiceNumber="AB12345678"
      date="114/03/15"
      sellerName="台灣科技股份有限公司"
      sellerTaxId="04595252"
      items={[
        { name: "雲端服務月費", quantity: 1, unitPrice: 2400 },
        { name: "資料備份方案", quantity: 2, unitPrice: 300 },
        { name: "技術支援", quantity: 1, unitPrice: 500 },
      ]}
      totalAmount={3500}
    />
  );
}

function DemoTaiwanMap() {
  const [single, setSingle] = useState<TaiwanCountyCode | null>("TPE");
  const [english, setEnglish] = useState(false);
  const [showLabels, setShowLabels] = useState(true);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3 text-xs">
        <label className="flex items-center gap-1.5 cursor-pointer">
          <input type="checkbox" checked={english} onChange={() => setEnglish(!english)} className="rounded" />
          english
        </label>
        <label className="flex items-center gap-1.5 cursor-pointer">
          <input type="checkbox" checked={showLabels} onChange={() => setShowLabels(!showLabels)} className="rounded" />
          showLabels
        </label>
        <button
          onClick={() => setSingle(null)}
          className="px-2 py-0.5 rounded bg-blue-500/15 text-blue-400 hover:bg-blue-500/25 transition-colors"
        >
          Clear selection
        </button>
      </div>
      <div className="flex flex-col items-center">
        <TaiwanMap value={single} onSelect={(c) => setSingle(c)} english={english} showLabels={showLabels} width={320} />
      </div>
      {single && (
        <div className="text-xs font-mono p-3 rounded-lg bg-[var(--surface)] border border-[var(--card-border)] text-[var(--muted)]">
          {JSON.stringify(TAIWAN_COUNTIES[single], null, 2)}
        </div>
      )}
    </div>
  );
}

function DemoPaymentMethodPicker() {
  const [method, setMethod] = useState<PaymentMethodId | null>("linepay");
  const [variant, setVariant] = useState<"grid" | "list">("grid");

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3 text-xs">
        {(["grid", "list"] as const).map((v) => (
          <button
            key={v}
            onClick={() => setVariant(v)}
            className={`px-2 py-0.5 rounded transition-colors ${
              variant === v ? "bg-blue-500/15 text-blue-400" : "text-[var(--muted)] hover:bg-[var(--surface)]"
            }`}
          >
            variant={v}
          </button>
        ))}
      </div>
      <PaymentMethodPicker value={method} onChange={setMethod} variant={variant} />
      {method && (
        <div className="text-xs font-mono p-3 rounded-lg bg-[var(--surface)] border border-[var(--card-border)] text-[var(--muted)]">
          {JSON.stringify({ selected: method }, null, 2)}
        </div>
      )}
    </div>
  );
}

function DemoTaiwanHolidayBadge() {
  const dates = ["2026-02-17", "2026-02-28", "2026-04-03", "2026-05-01", "2026-09-25", "2026-10-10", "2026-04-15"];
  return (
    <div className="space-y-3">
      <p className="text-xs text-[var(--muted)]">Showing 2026 holidays + one regular workday for contrast:</p>
      <div className="space-y-2">
        {dates.map((d) => (
          <div key={d} className="flex items-center gap-3 text-sm">
            <span className="font-mono text-[var(--muted)] w-28">{d}</span>
            <TaiwanHolidayBadge
              date={d}
              fallback={<span className="text-xs text-[var(--muted)] italic">— 一般日 —</span>}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function DemoROCLunarCalendar() {
  const [date, setDate] = useState<string>("2026-02-17");
  const [bilingual, setBilingual] = useState(false);
  const [compact, setCompact] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3 text-xs">
        <label className="flex items-center gap-1.5 cursor-pointer">
          <input type="checkbox" checked={bilingual} onChange={() => setBilingual(!bilingual)} className="rounded" />
          bilingual
        </label>
        <label className="flex items-center gap-1.5 cursor-pointer">
          <input type="checkbox" checked={compact} onChange={() => setCompact(!compact)} className="rounded" />
          compact
        </label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="px-2 py-0.5 rounded bg-[var(--surface)] border border-[var(--card-border)] text-xs"
        />
        {["2026-02-17", "2026-06-19", "2026-09-25", "2026-10-10"].map((d) => (
          <button
            key={d}
            onClick={() => setDate(d)}
            className="px-2 py-0.5 rounded bg-blue-500/15 text-blue-400 hover:bg-blue-500/25 transition-colors"
          >
            {d}
          </button>
        ))}
      </div>
      <ROCLunarCalendar date={date} bilingual={bilingual} compact={compact} />
    </div>
  );
}

function DemoEInvoiceQRScanner() {
  const [scanned, setScanned] = useState<ParsedInvoice | null>(null);

  return (
    <div className="space-y-3">
      <p className="text-xs text-[var(--muted)] leading-relaxed">
        Requires camera permission. Browser must support <code className="font-mono">BarcodeDetector</code> (Chrome/Edge/Android). Point at the LEFT QR-code on a Taiwan 統一發票.
      </p>
      <EInvoiceQRScanner onScan={setScanned} width={280} />
      {scanned && (
        <div className="text-xs font-mono p-3 rounded-lg bg-[var(--surface)] border border-[var(--card-border)] text-[var(--muted)]">
          {JSON.stringify(scanned, null, 2)}
        </div>
      )}
    </div>
  );
}

function DemoTaiwanCurrencyInput() {
  const [amount, setAmount] = useState<number | null>(1234567);
  const [showCapital, setShowCapital] = useState(true);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3 text-xs">
        <label className="flex items-center gap-1.5 cursor-pointer">
          <input type="checkbox" checked={showCapital} onChange={() => setShowCapital(!showCapital)} className="rounded" />
          showCapital
        </label>
        {[1, 100, 1234, 50000, 1234567, 9999999999].map((v) => (
          <button
            key={v}
            onClick={() => setAmount(v)}
            className="px-2 py-0.5 rounded bg-blue-500/15 text-blue-400 hover:bg-blue-500/25 transition-colors font-mono"
          >
            {v.toLocaleString()}
          </button>
        ))}
      </div>
      <TaiwanCurrencyInput value={amount} onChange={setAmount} showCapital={showCapital} />
      {amount != null && amount > 0 && (
        <div className="text-xs font-mono p-3 rounded-lg bg-[var(--surface)] border border-[var(--card-border)] text-[var(--muted)]">
          {JSON.stringify({ value: amount, capital: toCapitalChinese(amount) }, null, 2)}
        </div>
      )}
    </div>
  );
}

function DemoROCDateRangePicker() {
  const [range, setRange] = useState<ROCDateRange>({ start: null, end: null });

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3 text-xs">
        <button
          onClick={() => setRange({ start: null, end: null })}
          className="px-2 py-0.5 rounded bg-blue-500/15 text-blue-400 hover:bg-blue-500/25 transition-colors"
        >
          Clear
        </button>
      </div>
      <ROCDateRangePicker value={range} onChange={setRange} />
      {(range.start || range.end) && (
        <div className="text-xs font-mono p-3 rounded-lg bg-[var(--surface)] border border-[var(--card-border)] text-[var(--muted)]">
          {JSON.stringify(range, null, 2)}
        </div>
      )}
    </div>
  );
}

function DemoTaxBracketCalculator() {
  return (
    <div className="space-y-4">
      <p className="text-xs text-[var(--muted)] leading-relaxed">
        試算 2025 年（114 年度）個人綜合所得稅。輸入「淨所得」（已扣除免稅額與扣除額後）後，立即計算各級稅額與有效/邊際稅率。
      </p>
      <TaxBracketCalculator defaultIncome={1500000} />
    </div>
  );
}

function DemoTaiwanCalendarMonth() {
  // Default to Feb 2026 to showcase 春節 holidays
  const [year, setYear] = useState(2026);
  const [month, setMonth] = useState(1);
  const [date, setDate] = useState<Date | null>(null);

  return (
    <div className="space-y-3">
      <p className="text-xs text-[var(--muted)] leading-relaxed">
        Default view: Feb 2026 (春節 + 和平紀念日 visible). Click prev/next to navigate, click any date to select.
      </p>
      <TaiwanCalendarMonth
        year={year}
        month={month}
        value={date}
        onSelect={setDate}
        onMonthChange={(y, m) => { setYear(y); setMonth(m); }}
      />
      {date && (
        <div className="text-xs font-mono p-3 rounded-lg bg-[var(--surface)] border border-[var(--card-border)] text-[var(--muted)]">
          {JSON.stringify({ selected: date.toISOString().slice(0, 10), rocYear: year - 1911, month: month + 1 }, null, 2)}
        </div>
      )}
    </div>
  );
}

const DEMO_MAP: Record<string, React.ComponentType> = {
  "roc-date-picker": DemoROCDatePicker,
  "twid-input": DemoTWIDInput,
  "taiwan-address-input": DemoTaiwanAddressInput,
  "taiwan-payment-button": DemoTaiwanPaymentButton,
  "uniform-invoice-input": DemoUniformInvoiceInput,
  "company-tax-id-input": DemoCompanyTaxIDInput,
  "phone-barcode-input": DemoPhoneBarcodeInput,
  "tw-phone-input": DemoTWPhoneInput,
  "license-plate-input": DemoLicensePlateInput,
  "nhi-card-input": DemoNHICardInput,
  "bank-account-input": DemoBankAccountInput,
  "egui-invoice": DemoEGUIInvoice,
  "taiwan-map": DemoTaiwanMap,
  "payment-method-picker": DemoPaymentMethodPicker,
  "taiwan-holiday-badge": DemoTaiwanHolidayBadge,
  "roc-lunar-calendar": DemoROCLunarCalendar,
  "einvoice-qr-scanner": DemoEInvoiceQRScanner,
  "taiwan-currency-input": DemoTaiwanCurrencyInput,
  "roc-date-range-picker": DemoROCDateRangePicker,
  "tax-bracket-calculator": DemoTaxBracketCalculator,
  "taiwan-calendar-month": DemoTaiwanCalendarMonth,
};

export default function ComponentDemo({ slug }: { slug: string }) {
  const Demo = DEMO_MAP[slug];

  if (!Demo) {
    return (
      <div className="p-8 text-center text-[var(--muted)] text-sm">
        Interactive demo coming soon.
      </div>
    );
  }

  return (
    <div className="p-6 rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)]">
      <Demo />
    </div>
  );
}

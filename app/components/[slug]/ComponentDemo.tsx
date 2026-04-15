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

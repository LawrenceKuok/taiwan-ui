"use client";

import { useState } from "react";
import ROCDatePicker, { type ROCDate } from "@/components/taiwan/ROCDatePicker";
import TWIDInput, { type TWIDResult } from "@/components/taiwan/TWIDInput";
import TaiwanAddressInput, { type TaiwanAddress } from "@/components/taiwan/TaiwanAddressInput";
import TaiwanPaymentButton, { type PaymentProvider } from "@/components/taiwan/TaiwanPaymentButton";
import UniformInvoiceInput, { type InvoiceResult } from "@/components/taiwan/UniformInvoiceInput";

/* ─── Types ────────────────────────────────────────────────────────── */

interface FormData {
  name: string;
  idNumber: string;
  idResult: TWIDResult;
  birthDate: ROCDate | null;
  address: TaiwanAddress | null;
  invoice: string;
  invoiceResult: InvoiceResult;
  paymentProvider: PaymentProvider | null;
}

const INITIAL: FormData = {
  name: "",
  idNumber: "",
  idResult: { valid: false, type: "invalid", raw: "" },
  birthDate: null,
  address: null,
  invoice: "",
  invoiceResult: { valid: false, formatted: "", raw: "" },
  paymentProvider: null,
};

const STEPS = [
  { key: "applicant", label: "申請人資料", en: "Applicant" },
  { key: "address", label: "聯絡地址", en: "Address" },
  { key: "invoice", label: "發票資訊", en: "Invoice" },
  { key: "payment", label: "付款方式", en: "Payment" },
];

/* ─── Validation helpers ───────────────────────────────────────────── */

function getErrors(form: FormData) {
  const errors: Record<string, string> = {};
  if (!form.name.trim()) errors.name = "請輸入姓名";
  if (!form.idResult.valid) errors.idNumber = "請輸入有效的身分證字號";
  if (!form.birthDate) errors.birthDate = "請選擇出生日期";
  if (!form.address?.city || !form.address?.district) errors.address = "請選擇完整地址";
  if (!form.address?.streetAddress?.trim()) errors.streetAddress = "請輸入詳細地址";
  if (!form.invoiceResult.valid) errors.invoice = "請輸入有效的發票號碼";
  if (!form.paymentProvider) errors.payment = "請選擇付款方式";
  return errors;
}

/* ─── Page ─────────────────────────────────────────────────────────── */

export default function FormDemoPage() {
  const [form, setForm] = useState<FormData>(INITIAL);
  const [submitted, setSubmitted] = useState(false);
  const [showErrors, setShowErrors] = useState(false);

  const errors = getErrors(form);
  const isValid = Object.keys(errors).length === 0;

  // Figure out which steps are complete
  const stepComplete = [
    form.name.trim() && form.idResult.valid && form.birthDate,
    form.address?.city && form.address?.district && form.address?.streetAddress?.trim(),
    form.invoiceResult.valid,
    form.paymentProvider,
  ];

  const handleSubmit = () => {
    if (!isValid) {
      setShowErrors(true);
      return;
    }
    setSubmitted(true);
  };

  const handleReset = () => {
    setForm(INITIAL);
    setSubmitted(false);
    setShowErrors(false);
  };

  // Build the JSON payload
  const payload = {
    applicant: {
      name: form.name || null,
      idNumber: form.idNumber || null,
      idType: form.idResult.valid ? form.idResult.type : null,
      region: form.idResult.valid ? form.idResult.region : null,
      birthDate: form.birthDate
        ? `${form.birthDate.year}-${String(form.birthDate.month + 1).padStart(2, "0")}-${String(form.birthDate.day).padStart(2, "0")}`
        : null,
      birthDateROC: form.birthDate
        ? `民國 ${form.birthDate.year - 1911} 年 ${form.birthDate.month + 1} 月 ${form.birthDate.day} 日`
        : null,
    },
    address: form.address
      ? {
          postalCode: form.address.postalCode,
          city: form.address.city,
          district: form.address.district,
          street: form.address.streetAddress,
          full: `${form.address.postalCode} ${form.address.city}${form.address.district}${form.address.streetAddress}`,
        }
      : null,
    invoice: {
      number: form.invoiceResult.valid ? form.invoiceResult.formatted : null,
      valid: form.invoiceResult.valid,
    },
    payment: {
      provider: form.paymentProvider,
    },
  };

  if (submitted) {
    return (
      <div className="min-h-[calc(100vh-3.5rem)] bg-[var(--background)] text-[var(--foreground)]">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-16 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 text-3xl mb-6">
            ✓
          </div>
          <h1 className="text-2xl font-bold font-serif mb-2">申請已送出</h1>
          <p className="text-[var(--muted)] mb-8">
            Application Submitted Successfully
          </p>

          <div className="text-left">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-[var(--muted)] mb-2">
              表單資料 Form Payload
            </p>
            <pre className="p-4 rounded-xl bg-gray-900 text-gray-100 text-xs overflow-x-auto leading-relaxed font-mono">
              {JSON.stringify(payload, null, 2)}
            </pre>
          </div>

          <button
            onClick={handleReset}
            className="mt-8 px-6 py-2.5 rounded-lg border border-[var(--card-border)] font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            重新填寫 Reset
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-[var(--background)] text-[var(--foreground)]">
      {/* Header */}
      <div className="border-b border-[var(--card-border)] bg-gradient-to-b from-blue-50/60 to-transparent dark:from-blue-950/20 dark:to-transparent">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
          <p className="text-xs font-semibold uppercase tracking-widest text-blue-600 dark:text-blue-400 mb-2">
            Form Demo · 表單範例
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif">
            數位服務申請表
          </h1>
          <p className="text-[var(--muted)] mt-1 text-sm">
            Digital Service Application — 展示所有元件在真實表單中的整合效果
          </p>
        </div>
      </div>

      {/* Step indicator */}
      <div className="border-b border-[var(--card-border)] bg-[var(--card-bg)]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex overflow-x-auto">
            {STEPS.map((step, i) => (
              <div
                key={step.key}
                className={`flex items-center gap-2 px-4 py-3 text-sm whitespace-nowrap border-b-2 transition-colors ${
                  stepComplete[i]
                    ? "border-green-500 text-green-600 dark:text-green-400"
                    : "border-transparent text-[var(--muted)]"
                }`}
              >
                <span
                  className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-bold ${
                    stepComplete[i]
                      ? "bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400"
                      : "bg-gray-100 dark:bg-gray-800 text-[var(--muted)]"
                  }`}
                >
                  {stepComplete[i] ? "✓" : i + 1}
                </span>
                <span className="hidden sm:inline">{step.label}</span>
                <span className="sm:hidden">{step.en}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Body: form + JSON */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 flex gap-8">
        {/* Form */}
        <div className="flex-1 min-w-0 space-y-8">
          {/* Section 1: Applicant */}
          <section className="space-y-5">
            <div>
              <h2 className="text-lg font-bold">1. 申請人資料</h2>
              <p className="text-xs text-[var(--muted)]">Applicant Information</p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">
                  姓名 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="王小明"
                  className="w-full px-3 py-2 border rounded-lg bg-[var(--input-bg)] border-[var(--input-border)] focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {showErrors && errors.name && (
                  <p className="text-xs text-red-500 mt-1">{errors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5">
                  身分證字號 <span className="text-red-500">*</span>
                </label>
                <TWIDInput
                  value={form.idNumber}
                  onChange={(v) => setForm({ ...form, idNumber: v })}
                  onValidate={(r) => setForm((prev) => ({ ...prev, idResult: r }))}
                />
                {showErrors && errors.idNumber && !form.idResult.valid && (
                  <p className="text-xs text-red-500 mt-1">{errors.idNumber}</p>
                )}
              </div>
            </div>

            <div className="max-w-sm">
              <label className="block text-sm font-medium mb-1.5">
                出生日期 <span className="text-red-500">*</span>
              </label>
              <ROCDatePicker
                value={form.birthDate}
                onChange={(d) => setForm({ ...form, birthDate: d })}
                maxDate={new Date()}
                placeholder="請選擇出生日期"
              />
              {showErrors && errors.birthDate && (
                <p className="text-xs text-red-500 mt-1">{errors.birthDate}</p>
              )}
            </div>
          </section>

          <hr className="border-[var(--card-border)]" />

          {/* Section 2: Address */}
          <section className="space-y-5">
            <div>
              <h2 className="text-lg font-bold">2. 聯絡地址</h2>
              <p className="text-xs text-[var(--muted)]">Contact Address</p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">
                通訊地址 <span className="text-red-500">*</span>
              </label>
              <TaiwanAddressInput
                value={form.address}
                onChange={(a) => setForm({ ...form, address: a })}
              />
              {showErrors && (errors.address || errors.streetAddress) && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.address || errors.streetAddress}
                </p>
              )}
            </div>
          </section>

          <hr className="border-[var(--card-border)]" />

          {/* Section 3: Invoice */}
          <section className="space-y-5">
            <div>
              <h2 className="text-lg font-bold">3. 發票資訊</h2>
              <p className="text-xs text-[var(--muted)]">Invoice Information</p>
            </div>

            <div className="max-w-sm">
              <label className="block text-sm font-medium mb-1.5">
                統一發票號碼 <span className="text-red-500">*</span>
              </label>
              <UniformInvoiceInput
                value={form.invoice}
                onChange={(v, r) => setForm((prev) => ({ ...prev, invoice: v, invoiceResult: r }))}
              />
              {showErrors && errors.invoice && !form.invoiceResult.valid && (
                <p className="text-xs text-red-500 mt-1">{errors.invoice}</p>
              )}
            </div>
          </section>

          <hr className="border-[var(--card-border)]" />

          {/* Section 4: Payment */}
          <section className="space-y-5">
            <div>
              <h2 className="text-lg font-bold">4. 付款方式</h2>
              <p className="text-xs text-[var(--muted)]">Payment Method</p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-3">
                選擇付款方式 <span className="text-red-500">*</span>
              </label>
              <div className="grid sm:grid-cols-2 gap-3 max-w-md">
                {(["linepay", "jkopay"] as const).map((provider) => (
                  <button
                    key={provider}
                    type="button"
                    onClick={() => setForm({ ...form, paymentProvider: provider })}
                    className={`p-3 rounded-lg border-2 transition-colors ${
                      form.paymentProvider === provider
                        ? "border-blue-500 bg-blue-50/50 dark:bg-blue-950/20"
                        : "border-[var(--card-border)] hover:border-blue-200 dark:hover:border-blue-800"
                    }`}
                  >
                    <TaiwanPaymentButton
                      provider={provider}
                      onClick={() => setForm({ ...form, paymentProvider: provider })}
                      size="sm"
                      fullWidth
                    />
                  </button>
                ))}
              </div>
              {showErrors && errors.payment && (
                <p className="text-xs text-red-500 mt-2">{errors.payment}</p>
              )}
            </div>
          </section>

          <hr className="border-[var(--card-border)]" />

          {/* Submit */}
          <div className="flex items-center gap-4">
            <button
              onClick={handleSubmit}
              className={`px-8 py-3 rounded-lg font-bold text-white transition-colors ${
                isValid
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              送出申請 Submit
            </button>

            {showErrors && !isValid && (
              <p className="text-sm text-red-500">
                請填寫所有必填欄位 ({Object.keys(errors).length} 個錯誤)
              </p>
            )}
          </div>
        </div>

        {/* Live JSON panel (desktop) */}
        <aside className="hidden lg:block w-80 shrink-0">
          <div className="sticky top-20">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-[var(--muted)] mb-2">
              即時表單資料 Live Payload
            </p>
            <pre className="p-4 rounded-xl bg-gray-900 text-gray-100 text-[11px] overflow-x-auto leading-relaxed font-mono max-h-[calc(100vh-8rem)] overflow-y-auto">
              {JSON.stringify(payload, null, 2)}
            </pre>
          </div>
        </aside>
      </div>
    </div>
  );
}

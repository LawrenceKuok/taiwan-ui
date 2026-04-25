"use client";

/**
 * "Try It Now" homepage hero widget.
 *
 * Sits above the fold. Four tabs (身分證 / 統編 / 車牌 / 健保卡) — paste
 * any value, validation runs in real-time, and the install command for
 * that specific component is shown alongside.
 *
 * This is the "stage demo" moment: an audience member can paste their
 * own ID into their phone browser during a talk and watch it validate,
 * then run `npx taiwan-ui add twid-input` after.
 */

import { useState } from "react";
import { validateTWID } from "@/lib/validators/twid";
import { validateTaxID } from "@/lib/validators/tax-id";
import { validatePlate } from "@/lib/validators/license-plate";
import { validateNHICard } from "@/lib/validators/nhi-card";

type TabKey = "twid" | "tax-id" | "plate" | "nhi";

interface TabConfig {
  key: TabKey;
  label: string;
  zh: string;
  placeholder: string;
  example: string;
  install: string;
  spec: string;
  validate: (raw: string) => {
    valid: boolean;
    formatted?: string;
    reason?: string;
    extra?: { label: string; value: string }[];
  };
}

const TABS: TabConfig[] = [
  {
    key: "twid",
    label: "身分證",
    zh: "TWID",
    placeholder: "A123456789",
    example: "A123456789",
    install: "npx taiwan-ui add twid-input",
    spec: "內政部戶政司",
    validate: (raw) => {
      const r = validateTWID(raw);
      const extra: { label: string; value: string }[] = [];
      if (r.valid) {
        if (r.type) extra.push({ label: "Type", value: r.type });
        if (r.region) extra.push({ label: "Region", value: r.region });
      }
      return {
        valid: r.valid,
        formatted: r.raw,
        reason: r.reason,
        extra,
      };
    },
  },
  {
    key: "tax-id",
    label: "統一編號",
    zh: "Tax ID",
    placeholder: "12345675",
    example: "12345675",
    install: "npx taiwan-ui add company-tax-id-input",
    spec: "財政部",
    validate: (raw) => {
      const r = validateTaxID(raw);
      return {
        valid: r.valid,
        formatted: r.raw,
        reason: r.reason,
      };
    },
  },
  {
    key: "plate",
    label: "車牌",
    zh: "License Plate",
    placeholder: "ABC-1234",
    example: "ABC-1234",
    install: "npx taiwan-ui add license-plate-input",
    spec: "交通部公路總局",
    validate: (raw) => {
      const r = validatePlate(raw);
      const extra: { label: string; value: string }[] = [];
      if (r.valid && r.type && r.type !== "unknown")
        extra.push({ label: "Vehicle", value: r.type });
      // PlateValidationResult has no `reason` field — invalid means
      // "didn't match any of the published Taiwan plate formats".
      return {
        valid: r.valid,
        formatted: r.formatted || r.raw,
        reason: r.valid ? undefined : "format",
        extra,
      };
    },
  },
  {
    key: "nhi",
    label: "健保卡",
    zh: "NHI Card",
    placeholder: "0000 0000 0000",
    example: "000012345678",
    install: "npx taiwan-ui add nhi-card-input",
    spec: "衛福部健保署",
    validate: (raw) => {
      const r = validateNHICard(raw);
      return {
        valid: r.valid,
        formatted: r.formatted ?? r.raw,
        reason: r.reason,
      };
    },
  },
];

export default function TryItNow() {
  const [activeKey, setActiveKey] = useState<TabKey>("twid");
  // Each tab keeps its own input value so switching tabs doesn't lose state
  const [values, setValues] = useState<Record<TabKey, string>>({
    twid: "A123456789",
    "tax-id": "12345675",
    plate: "ABC-1234",
    nhi: "",
  });
  const [copied, setCopied] = useState(false);

  const active = TABS.find((t) => t.key === activeKey)!;
  const value = values[activeKey];
  const result = value.trim() ? active.validate(value) : null;

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(active.install);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard might be blocked — silently noop */
    }
  };

  return (
    <section className="border-t border-[var(--card-border)]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
        {/* Section eyebrow + headline */}
        <div className="text-center mb-10">
          <span className="inline-block px-3 py-1 rounded-full text-[10px] font-medium border border-blue-500/20 bg-blue-500/10 text-blue-400 mb-4 uppercase tracking-[0.18em]">
            Try it now
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold font-serif">
            貼上一組任何資料，即時驗證。
          </h2>
          <p className="text-[var(--muted)] mt-3 text-sm max-w-md mx-auto">
            校驗碼、格式、區域代碼——全部在你的瀏覽器裡跑，沒有任何資料離開。
          </p>
        </div>

        {/* Widget */}
        <div className="rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)] overflow-hidden">
          {/* Tabs */}
          <div
            className="flex overflow-x-auto"
            style={{ borderBottom: "1px solid var(--card-border)" }}
            role="tablist"
          >
            {TABS.map((t) => {
              const isActive = t.key === activeKey;
              return (
                <button
                  key={t.key}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActiveKey(t.key)}
                  className="px-5 py-3.5 text-sm font-medium whitespace-nowrap transition-colors"
                  style={{
                    color: isActive ? "var(--foreground)" : "var(--muted)",
                    background: isActive ? "var(--surface)" : "transparent",
                    borderBottom: isActive
                      ? "2px solid rgb(96 165 250)"
                      : "2px solid transparent",
                  }}
                >
                  <span>{t.label}</span>
                  <span
                    className="ml-2 text-[10px] uppercase tracking-wider"
                    style={{ color: "var(--muted)" }}
                  >
                    {t.zh}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Body */}
          <div className="p-5 sm:p-7 grid lg:grid-cols-[1fr_320px] gap-6">
            {/* LEFT — input + result */}
            <div>
              <label
                htmlFor={`try-${activeKey}`}
                className="block text-[10px] uppercase tracking-[0.18em] text-[var(--muted)] mb-2"
              >
                {active.label} · {active.zh}
              </label>
              <input
                id={`try-${activeKey}`}
                type="text"
                spellCheck={false}
                autoComplete="off"
                value={value}
                onChange={(e) =>
                  setValues((v) => ({ ...v, [activeKey]: e.target.value }))
                }
                placeholder={active.placeholder}
                className="w-full px-4 py-3 rounded-lg bg-[var(--surface)] border-2 border-[var(--card-border)] focus:border-blue-500/60 outline-none font-mono text-base tracking-wider transition-colors"
              />

              {/* Result */}
              <div className="mt-4 min-h-[88px]">
                {result === null ? (
                  <div className="text-xs text-[var(--muted)] flex items-center gap-2">
                    <span>例:</span>
                    <button
                      type="button"
                      onClick={() =>
                        setValues((v) => ({ ...v, [activeKey]: active.example }))
                      }
                      className="font-mono px-2 py-0.5 rounded bg-[var(--surface)] border border-[var(--card-border)] hover:border-blue-500/40 transition-colors"
                    >
                      {active.example}
                    </button>
                  </div>
                ) : (
                  <div
                    className="rounded-lg border p-4"
                    style={{
                      borderColor: result.valid
                        ? "rgba(34, 197, 94, 0.3)"
                        : "rgba(239, 68, 68, 0.3)",
                      background: result.valid
                        ? "rgba(34, 197, 94, 0.06)"
                        : "rgba(239, 68, 68, 0.06)",
                    }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className="text-base"
                        style={{
                          color: result.valid
                            ? "rgb(34, 197, 94)"
                            : "rgb(239, 68, 68)",
                        }}
                      >
                        {result.valid ? "✓" : "✕"}
                      </span>
                      <span
                        className="text-sm font-semibold"
                        style={{
                          color: result.valid
                            ? "rgb(34, 197, 94)"
                            : "rgb(239, 68, 68)",
                        }}
                      >
                        {result.valid ? "Valid" : "Invalid"}
                      </span>
                      {result.formatted && (
                        <span className="ml-auto font-mono text-xs text-[var(--muted)]">
                          {result.formatted}
                        </span>
                      )}
                    </div>
                    {!result.valid && result.reason ? (
                      <div className="text-xs text-[var(--muted)]">
                        Reason: <span className="font-mono">{result.reason}</span>
                      </div>
                    ) : null}
                    {result.extra && result.extra.length > 0 ? (
                      <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs">
                        {result.extra.map((e) => (
                          <div key={e.label} className="text-[var(--muted)]">
                            <span className="uppercase tracking-wider mr-1.5">
                              {e.label}:
                            </span>
                            <span className="text-[var(--foreground)] font-medium">
                              {e.value}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : null}
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT — install command + spec citation */}
            <div className="lg:border-l lg:pl-6 border-[var(--card-border)] flex flex-col">
              <div className="text-[10px] uppercase tracking-[0.18em] text-[var(--muted)] mb-2">
                Install in your project
              </div>
              <button
                type="button"
                onClick={onCopy}
                className="group text-left rounded-lg bg-[var(--surface)] border border-[var(--card-border)] hover:border-blue-500/40 transition-colors p-3 mb-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <code className="text-xs font-mono text-blue-400 break-all leading-relaxed">
                    {active.install}
                  </code>
                  <span
                    className="text-[10px] uppercase tracking-wider shrink-0"
                    style={{ color: copied ? "rgb(34, 197, 94)" : "var(--muted)" }}
                  >
                    {copied ? "✓ Copied" : "Copy"}
                  </span>
                </div>
              </button>

              <div className="text-[10px] uppercase tracking-[0.18em] text-[var(--muted)] mb-2">
                Spec source
              </div>
              <div className="text-sm text-[var(--foreground)] mb-3">
                {active.spec}
              </div>

              <div className="text-[10px] text-[var(--muted)] leading-relaxed mt-auto">
                Pure function. No network calls. The validator runs entirely
                in your browser — paste anything, nothing leaves your device.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

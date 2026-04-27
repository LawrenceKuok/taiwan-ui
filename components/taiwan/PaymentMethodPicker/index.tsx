"use client";

import { useCallback, useMemo } from "react";

/**
 * Multi-provider payment method picker covering the major Taiwan e-wallets
 * and credit-card families. Renders a labeled radio group; brand colors come
 * from each provider's published brand guidelines.
 *
 * Pure presentational component — does NOT initiate a payment. Wire your own
 * SDK / redirect from the onChange handler.
 */

export type PaymentMethodId =
  | "linepay"
  | "jkopay"
  | "streetpay"
  | "easywallet"
  | "icashpay"
  | "applepay"
  | "googlepay"
  | "samsungpay"
  | "creditcard"
  | "atm"
  | "convenience";

export interface PaymentMethod {
  id: PaymentMethodId;
  label: string;
  zhLabel: string;
  brandColor: string;
  /** Single-character glyph used as a fallback icon. */
  glyph: string;
}

export const PAYMENT_METHODS: Record<PaymentMethodId, PaymentMethod> = Object.freeze({
  linepay:    { id: "linepay",    label: "LINE Pay",    zhLabel: "LINE Pay",    brandColor: "#00C300", glyph: "L" },
  jkopay:     { id: "jkopay",     label: "JKO Pay",     zhLabel: "街口支付",    brandColor: "#FF6B00", glyph: "街" },
  streetpay:  { id: "streetpay",  label: "PXPay Plus",  zhLabel: "全支付",      brandColor: "#005CAB", glyph: "全" },
  easywallet: { id: "easywallet", label: "EasyWallet",  zhLabel: "悠遊付",      brandColor: "#0E9094", glyph: "悠" },
  icashpay:   { id: "icashpay",   label: "iCash Pay",   zhLabel: "iCash Pay",   brandColor: "#E60012", glyph: "i" },
  applepay:   { id: "applepay",   label: "Apple Pay",   zhLabel: "Apple Pay",   brandColor: "#000000", glyph: "" },
  googlepay:  { id: "googlepay",  label: "Google Pay",  zhLabel: "Google Pay",  brandColor: "#4285F4", glyph: "G" },
  samsungpay: { id: "samsungpay", label: "Samsung Pay", zhLabel: "Samsung Pay", brandColor: "#1428A0", glyph: "S" },
  creditcard: { id: "creditcard", label: "Credit Card", zhLabel: "信用卡",      brandColor: "#475569", glyph: "💳" },
  atm:        { id: "atm",        label: "ATM Transfer",zhLabel: "ATM 轉帳",   brandColor: "#0F766E", glyph: "🏦" },
  convenience:{ id: "convenience",label: "Convenience", zhLabel: "超商代收",    brandColor: "#16A34A", glyph: "🏪" },
} as Record<PaymentMethodId, PaymentMethod>);

export interface PaymentMethodPickerProps {
  value: PaymentMethodId | null;
  onChange: (id: PaymentMethodId) => void;
  /** Subset of methods to show; defaults to a sensible Taiwan set. */
  methods?: PaymentMethodId[];
  /** Use English labels instead of 中文. */
  english?: boolean;
  /** Compact horizontal pill style instead of grid cards. */
  variant?: "grid" | "list";
  disabled?: boolean;
  ariaLabel?: string;
}

const DEFAULT_METHODS: PaymentMethodId[] = [
  "linepay",
  "jkopay",
  "streetpay",
  "easywallet",
  "applepay",
  "googlepay",
  "creditcard",
  "convenience",
];

export default function PaymentMethodPicker({
  value,
  onChange,
  methods = DEFAULT_METHODS,
  english = false,
  variant = "grid",
  disabled = false,
  ariaLabel = "選擇付款方式",
}: PaymentMethodPickerProps) {
  const items = useMemo(() => methods.map((m) => PAYMENT_METHODS[m]).filter(Boolean), [methods]);

  const handleSelect = useCallback(
    (id: PaymentMethodId) => {
      if (disabled) return;
      onChange(id);
    },
    [disabled, onChange]
  );

  if (variant === "list") {
    return (
      <div role="radiogroup" aria-label={ariaLabel} className="flex flex-wrap gap-2">
        {items.map((m) => {
          const selected = value === m.id;
          return (
            <button
              key={m.id}
              type="button"
              role="radio"
              aria-checked={selected}
              disabled={disabled}
              onClick={() => handleSelect(m.id)}
              className={`inline-flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium border transition-all
                ${selected
                  ? "text-white shadow-sm"
                  : "bg-[var(--surface)] text-[var(--foreground)] border-[var(--card-border)] hover:border-current"}
                ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
              `}
              style={selected ? { backgroundColor: m.brandColor, borderColor: m.brandColor } : undefined}
            >
              <span aria-hidden="true" className="text-xs font-bold">{m.glyph}</span>
              <span>{english ? m.label : m.zhLabel}</span>
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div role="radiogroup" aria-label={ariaLabel} className="grid grid-cols-2 sm:grid-cols-3 gap-2">
      {items.map((m) => {
        const selected = value === m.id;
        return (
          <button
            key={m.id}
            type="button"
            role="radio"
            aria-checked={selected}
            disabled={disabled}
            onClick={() => handleSelect(m.id)}
            className={`flex items-center gap-3 px-3 py-3 rounded-lg border-2 text-left transition-all
              ${selected
                ? "shadow-md"
                : "bg-[var(--surface)] border-[var(--card-border)] hover:bg-[var(--card-bg)]"}
              ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
            `}
            style={selected ? { borderColor: m.brandColor, backgroundColor: `${m.brandColor}14` } : undefined}
          >
            <div
              aria-hidden="true"
              className="w-9 h-9 rounded-md flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
              style={{ backgroundColor: m.brandColor }}
            >
              {m.glyph}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate text-[var(--foreground)]">
                {english ? m.label : m.zhLabel}
              </p>
              {!english && m.label !== m.zhLabel && (
                <p className="text-[10px] text-[var(--muted)] truncate">{m.label}</p>
              )}
            </div>
            <div
              className={`w-4 h-4 rounded-full border-2 flex-shrink-0 transition-colors
                ${selected ? "" : "border-[var(--card-border)]"}`}
              style={selected ? { borderColor: m.brandColor, backgroundColor: m.brandColor } : undefined}
            >
              {selected && (
                <svg viewBox="0 0 16 16" className="w-full h-full text-white" aria-hidden="true">
                  <path d="M4 8.5l3 3 5-6" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}

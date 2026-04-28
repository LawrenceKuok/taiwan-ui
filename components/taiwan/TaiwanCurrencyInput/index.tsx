"use client";

import { useCallback, useMemo } from "react";
import { formatNTD, parseNTD, toCapitalChinese } from "@/lib/currency-tw";

/**
 * Taiwan currency input with optional 大寫中文 (capital-form Chinese) conversion.
 *
 * 大寫中文 is required by Taiwan legal documents (contracts, cheques, loans,
 * 公文) per 公文程式條例. Most npm currency-input libraries don't support it.
 *
 * Pure JS, zero deps.
 */

export interface TaiwanCurrencyInputProps {
  value: number | null;
  onChange: (value: number | null) => void;
  /** Show 大寫中文 conversion below the input. */
  showCapital?: boolean;
  /** Currency symbol prefix. Default "NT$". */
  symbol?: string;
  /** Suffix for 大寫中文 output. */
  capitalSuffix?: "元整" | "元" | "";
  /** Max digits accepted (default: 13 → ≈ 10 trillion ceiling). */
  maxDigits?: number;
  placeholder?: string;
  disabled?: boolean;
  ariaLabel?: string;
}

export default function TaiwanCurrencyInput({
  value,
  onChange,
  showCapital = true,
  symbol = "NT$",
  capitalSuffix = "元整",
  maxDigits = 13,
  placeholder = "0",
  disabled = false,
  ariaLabel = "金額",
}: TaiwanCurrencyInputProps) {
  const display = value == null ? "" : formatNTD(value, { symbol: "" }).trim();

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const stripped = e.target.value.replace(/[^\d]/g, "").slice(0, maxDigits);
      if (stripped === "") {
        onChange(null);
        return;
      }
      const n = parseNTD(stripped);
      onChange(Number.isFinite(n) ? n : null);
    },
    [onChange, maxDigits]
  );

  const capital = useMemo(
    () => (value == null || value < 0 ? "" : toCapitalChinese(Math.round(value), { suffix: capitalSuffix })),
    [value, capitalSuffix]
  );

  return (
    <div className="w-full">
      <div className="relative">
        <span
          aria-hidden="true"
          className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-[var(--muted)] pointer-events-none"
        >
          {symbol}
        </span>
        <input
          type="text"
          inputMode="numeric"
          value={display}
          onChange={handleChange}
          placeholder={placeholder}
          disabled={disabled}
          aria-label={ariaLabel}
          autoComplete="off"
          spellCheck={false}
          className={`w-full pl-12 pr-3 py-2 border rounded-lg font-mono tracking-wide text-right transition-colors
            ${disabled ? "opacity-50 cursor-not-allowed bg-gray-100 dark:bg-gray-800" : "bg-[var(--input-bg)]"}
            border-[var(--input-border)] focus:outline-none focus:ring-2 focus:ring-blue-500
          `}
        />
      </div>
      {showCapital && capital && (
        <p
          className="mt-1.5 text-xs text-[var(--muted)] font-serif tracking-wide"
          aria-live="polite"
        >
          <span className="text-[10px] uppercase tracking-wider mr-1.5 opacity-70">大寫</span>
          {capital}
        </p>
      )}
    </div>
  );
}

"use client";

import { useCallback } from "react";
import { validateUniformInvoice, type InvoiceValidationResult } from "@/lib/validators/uniform-invoice";

/** @deprecated Use InvoiceValidationResult from @/lib/validators/uniform-invoice */
export type InvoiceResult = InvoiceValidationResult;

export interface UniformInvoiceInputProps {
  value: string;
  onChange: (value: string, result: InvoiceValidationResult) => void;
  placeholder?: string;
  disabled?: boolean;
  showPrizeCheck?: boolean;
  ariaLabel?: string;
}

const parseInvoice = validateUniformInvoice;

export default function UniformInvoiceInput({
  value,
  onChange,
  placeholder = "AB-12345678",
  disabled = false,
  ariaLabel = "統一發票號碼",
}: UniformInvoiceInputProps) {
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const input = e.target.value;
      // Remove existing hyphens for processing
      let raw = input.replace(/-/g, "").toUpperCase();

      // Enforce: positions 0-1 must be letters, positions 2-9 must be digits
      let filtered = "";
      for (let i = 0; i < raw.length && i < 10; i++) {
        if (i < 2) {
          if (/[A-Z]/.test(raw[i])) filtered += raw[i];
        } else {
          if (/\d/.test(raw[i])) filtered += raw[i];
        }
      }

      // Build formatted with auto-hyphen
      const formatted =
        filtered.length > 2
          ? filtered.slice(0, 2) + "-" + filtered.slice(2)
          : filtered;

      const result = parseInvoice(filtered);
      onChange(formatted, result);
    },
    [onChange]
  );

  const rawClean = value.replace(/-/g, "");
  const isComplete = rawClean.length === 10;
  const result = isComplete ? parseInvoice(rawClean) : null;

  return (
    <div className="w-full">
      <input
        type="text"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        disabled={disabled}
        maxLength={11}
        aria-label={ariaLabel}
        aria-invalid={isComplete && !result?.valid ? true : undefined}
        autoComplete="off"
        spellCheck={false}
        className={`w-full px-3 py-2 border rounded-lg font-mono tracking-wider transition-colors
          ${disabled ? "opacity-50 cursor-not-allowed bg-gray-100 dark:bg-gray-800" : "bg-[var(--input-bg)]"}
          ${isComplete && result?.valid ? "border-green-500 focus:ring-green-500" : ""}
          ${isComplete && !result?.valid ? "border-red-500 focus:ring-red-500" : ""}
          ${!isComplete ? "border-[var(--input-border)]" : ""}
          focus:outline-none focus:ring-2
        `}
      />
      {isComplete && result?.valid && (
        <p className="mt-1 text-xs text-green-600 dark:text-green-400">有效發票號碼</p>
      )}
      {isComplete && !result?.valid && (
        <p role="alert" className="mt-1 text-xs text-red-500">格式錯誤</p>
      )}
    </div>
  );
}

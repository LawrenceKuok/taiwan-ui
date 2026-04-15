"use client";

import { useCallback } from "react";
import { validateTaxID, type TaxIDValidationResult } from "@/lib/validators/tax-id";

/** @deprecated Use TaxIDValidationResult from @/lib/validators/tax-id */
export type TaxIDResult = TaxIDValidationResult;

export interface CompanyTaxIDInputProps {
  value: string;
  onChange: (value: string) => void;
  onValidate?: (result: TaxIDValidationResult) => void;
  placeholder?: string;
  disabled?: boolean;
  ariaLabel?: string;
}

export default function CompanyTaxIDInput({
  value,
  onChange,
  onValidate,
  placeholder = "12345678",
  disabled = false,
  ariaLabel = "統一編號",
}: CompanyTaxIDInputProps) {
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value.replace(/\D/g, "").slice(0, 8);
      onChange(raw);
      if (raw.length === 8) {
        const result = validateTaxID(raw);
        onValidate?.(result);
      } else {
        onValidate?.({ valid: false, raw, reason: "length" });
      }
    },
    [onChange, onValidate]
  );

  const isComplete = value.length === 8;
  const result = isComplete ? validateTaxID(value) : null;

  return (
    <div className="w-full">
      <div className="relative">
        <input
          type="text"
          inputMode="numeric"
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          disabled={disabled}
          maxLength={8}
          aria-label={ariaLabel}
          aria-invalid={isComplete && !result?.valid ? true : undefined}
          aria-describedby={isComplete && !result?.valid ? "tax-id-error" : undefined}
          autoComplete="off"
          spellCheck={false}
          className={`w-full px-3 py-2 border rounded-lg transition-colors font-mono tracking-widest text-center
            ${disabled ? "opacity-50 cursor-not-allowed bg-gray-100 dark:bg-gray-800" : "bg-[var(--input-bg)]"}
            ${isComplete && result?.valid ? "border-green-500 focus:ring-green-500" : ""}
            ${isComplete && !result?.valid ? "border-red-500 focus:ring-red-500" : ""}
            ${!isComplete ? "border-[var(--input-border)]" : ""}
            focus:outline-none focus:ring-2
          `}
        />
        {isComplete && result?.valid && (
          <span aria-hidden="true" className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500">✓</span>
        )}
        {isComplete && !result?.valid && (
          <span aria-hidden="true" className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500">✗</span>
        )}
      </div>

      {isComplete && result?.valid && (
        <p className="mt-1 text-xs text-green-600 dark:text-green-400">有效統一編號</p>
      )}
      {isComplete && !result?.valid && (
        <p id="tax-id-error" role="alert" className="mt-1 text-xs text-red-500">
          {result?.reason === "checksum" ? "檢核碼錯誤" : "統一編號格式錯誤"}
        </p>
      )}
    </div>
  );
}

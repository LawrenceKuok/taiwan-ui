"use client";

import { useCallback } from "react";
import { validateNHICard, type NHIValidationResult } from "@/lib/validators/nhi-card";

/** @deprecated Use NHIValidationResult from @/lib/validators/nhi-card */
export type NHIResult = NHIValidationResult;

export interface NHICardInputProps {
  value: string;
  onChange: (value: string) => void;
  onValidate?: (result: NHIValidationResult) => void;
  placeholder?: string;
  disabled?: boolean;
  ariaLabel?: string;
}

const validateNHI = validateNHICard;

export default function NHICardInput({
  value,
  onChange,
  onValidate,
  placeholder = "000000000000",
  disabled = false,
  ariaLabel = "健保卡號碼",
}: NHICardInputProps) {
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value.replace(/\D/g, "").slice(0, 12);
      onChange(raw);
      const result = validateNHI(raw);
      onValidate?.(result);
    },
    [onChange, onValidate]
  );

  const isComplete = value.length === 12;
  const result = isComplete ? validateNHI(value) : null;

  // Format for display: XXXX XXXX XXXX
  const displayValue = value.length > 0
    ? value.replace(/(\d{4})(?=\d)/g, "$1 ").trim()
    : "";

  return (
    <div className="w-full">
      <div className="relative">
        <input
          type="text"
          inputMode="numeric"
          value={displayValue}
          onChange={handleChange}
          placeholder={placeholder}
          disabled={disabled}
          maxLength={14}
          aria-label={ariaLabel}
          aria-invalid={isComplete && !result?.valid ? true : undefined}
          autoComplete="off"
          spellCheck={false}
          className={`w-full px-3 py-2 border rounded-lg transition-colors font-mono tracking-wider
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
        <div className="mt-1 flex items-center gap-2">
          <span className="inline-block px-2 py-0.5 text-xs rounded-full bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
            健保卡號有效
          </span>
        </div>
      )}
      {isComplete && !result?.valid && (
        <p role="alert" className="mt-1 text-xs text-red-500">健保卡號格式錯誤</p>
      )}
    </div>
  );
}

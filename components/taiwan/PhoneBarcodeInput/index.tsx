"use client";

import { useCallback } from "react";
import { validatePhoneBarcode, type BarcodeValidationResult } from "@/lib/validators/phone-barcode";

/** @deprecated Use BarcodeValidationResult from @/lib/validators/phone-barcode */
export type BarcodeResult = BarcodeValidationResult;

export interface PhoneBarcodeInputProps {
  value: string;
  onChange: (value: string, result: BarcodeValidationResult) => void;
  placeholder?: string;
  disabled?: boolean;
  ariaLabel?: string;
}

const VALID_CHARS = /^[0-9A-Z.+\-]$/;
const parseBarcode = validatePhoneBarcode;

export default function PhoneBarcodeInput({
  value,
  onChange,
  placeholder = "/ABC+123",
  disabled = false,
  ariaLabel = "手機條碼載具",
}: PhoneBarcodeInputProps) {
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      let input = e.target.value.toUpperCase();

      // Ensure starts with /
      if (!input.startsWith("/")) {
        input = "/" + input.replace(/\//g, "");
      }

      // Filter: only allow valid characters after /
      let filtered = "/";
      for (let i = 1; i < input.length && filtered.length < 8; i++) {
        if (VALID_CHARS.test(input[i])) {
          filtered += input[i];
        }
      }

      const result = parseBarcode(filtered);
      onChange(filtered, result);
    },
    [onChange]
  );

  const isComplete = value.length === 8 && value.startsWith("/");
  const result = isComplete ? parseBarcode(value) : null;

  return (
    <div className="w-full">
      <input
        type="text"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        disabled={disabled}
        maxLength={8}
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
        <p className="mt-1 text-xs text-green-600 dark:text-green-400">有效手機條碼載具</p>
      )}
      {isComplete && !result?.valid && (
        <p role="alert" className="mt-1 text-xs text-red-500">格式錯誤</p>
      )}
    </div>
  );
}

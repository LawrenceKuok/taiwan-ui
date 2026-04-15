"use client";

import { useCallback, useMemo } from "react";
import { validatePhone, AREA_CODES, type PhoneValidationResult } from "@/lib/validators/phone";

/** @deprecated Use PhoneValidationResult from @/lib/validators/phone */
export type PhoneResult = PhoneValidationResult;

export interface TWPhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  onValidate?: (result: PhoneValidationResult) => void;
  type?: "mobile" | "landline" | "auto";
  placeholder?: string;
  disabled?: boolean;
  ariaLabel?: string;
}

const formatPhone = validatePhone;

export default function TWPhoneInput({
  value,
  onChange,
  onValidate,
  type = "auto",
  placeholder,
  disabled = false,
  ariaLabel = "電話號碼",
}: TWPhoneInputProps) {
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value.replace(/[^\d]/g, "").slice(0, 12);
      onChange(raw);
      const result = formatPhone(raw);
      onValidate?.(result);
    },
    [onChange, onValidate]
  );

  const result = useMemo(() => formatPhone(value), [value]);
  const isComplete = result.valid;

  const placeholderText = placeholder || (type === "landline" ? "02-1234-5678" : type === "mobile" ? "0912-345-678" : "0912-345-678");

  return (
    <div className="w-full">
      <div className="relative">
        <input
          type="tel"
          inputMode="numeric"
          value={isComplete ? result.formatted : value}
          onChange={handleChange}
          placeholder={placeholderText}
          disabled={disabled}
          maxLength={15}
          aria-label={ariaLabel}
          aria-invalid={value.length >= 9 && !isComplete ? true : undefined}
          autoComplete="tel"
          className={`w-full px-3 py-2 border rounded-lg transition-colors font-mono tracking-wider
            ${disabled ? "opacity-50 cursor-not-allowed bg-gray-100 dark:bg-gray-800" : "bg-[var(--input-bg)]"}
            ${isComplete ? "border-green-500 focus:ring-green-500" : ""}
            ${value.length >= 9 && !isComplete ? "border-red-500 focus:ring-red-500" : ""}
            ${value.length < 9 ? "border-[var(--input-border)]" : ""}
            focus:outline-none focus:ring-2
          `}
        />
        {isComplete && (
          <span aria-hidden="true" className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500">✓</span>
        )}
      </div>

      {isComplete && (
        <div className="mt-1 flex items-center gap-2">
          <span className="inline-block px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
            {result.type === "mobile" ? "行動電話" : `市話 ${AREA_CODES[result.areaCode || ""] || ""}`}
          </span>
        </div>
      )}
    </div>
  );
}

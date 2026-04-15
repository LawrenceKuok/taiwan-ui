"use client";

import { useCallback } from "react";
import { validateTWID, type TWIDValidationResult } from "@/lib/validators/twid";

/** @deprecated Use TWIDValidationResult from @/lib/validators/twid */
export type TWIDResult = TWIDValidationResult & { type: TWIDValidationResult["type"] | "arc" };

export interface TWIDInputProps {
  value: string;
  onChange: (value: string) => void;
  onValidate?: (result: TWIDValidationResult) => void;
  placeholder?: string;
  disabled?: boolean;
  showRegion?: boolean;
  /** Accessibility label for screen readers. Defaults to "身分證字號". */
  ariaLabel?: string;
}

export default function TWIDInput({
  value,
  onChange,
  onValidate,
  placeholder = "A123456789",
  disabled = false,
  showRegion = true,
  ariaLabel = "身分證字號",
}: TWIDInputProps) {
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value.toUpperCase().slice(0, 10);
      onChange(raw);
      if (raw.length === 10) {
        const result = validateTWID(raw);
        onValidate?.(result);
      } else {
        onValidate?.({ valid: false, type: "invalid", raw, reason: "length" });
      }
    },
    [onChange, onValidate]
  );

  const result = value.length === 10 ? validateTWID(value) : null;
  const isComplete = value.length === 10;

  return (
    <div className="w-full">
      <div className="relative">
        <input
          type="text"
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          disabled={disabled}
          maxLength={10}
          aria-label={ariaLabel}
          aria-invalid={isComplete && !result?.valid ? true : undefined}
          aria-describedby={isComplete && !result?.valid ? "twid-error" : undefined}
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

      {isComplete && result?.valid && showRegion && result.region && (
        <div className="mt-1 flex items-center gap-2">
          <span className="inline-block px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
            {result.region}
          </span>
          <span className="text-xs text-[var(--muted)]">
            {result.type === "citizen" ? "國民身分證" : result.type === "arc-new" ? "居留證" : "居留證（舊式）"}
          </span>
        </div>
      )}

      {isComplete && !result?.valid && (
        <p id="twid-error" role="alert" className="mt-1 text-xs text-red-500">
          {result?.reason === "checksum" ? "檢核碼錯誤" : "格式錯誤"}
        </p>
      )}
    </div>
  );
}

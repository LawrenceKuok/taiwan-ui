"use client";

import { useCallback, useMemo } from "react";
import { validatePlate, type PlateValidationResult } from "@/lib/validators/license-plate";

/** @deprecated Use PlateValidationResult from @/lib/validators/license-plate */
export type PlateResult = PlateValidationResult;

export interface LicensePlateInputProps {
  value: string;
  onChange: (value: string) => void;
  onValidate?: (result: PlateValidationResult) => void;
  vehicleType?: "car" | "motorcycle" | "auto";
  placeholder?: string;
  disabled?: boolean;
  ariaLabel?: string;
}

const TYPE_LABELS: Record<string, string> = {
  "car-new": "新式汽車車牌",
  "car-old": "舊式汽車車牌",
  "motorcycle": "機車車牌",
  "motorcycle-heavy": "大型重機車牌",
};

export default function LicensePlateInput({
  value,
  onChange,
  onValidate,
  vehicleType = "auto",
  placeholder = "ABC-1234",
  disabled = false,
  ariaLabel = "車牌號碼",
}: LicensePlateInputProps) {
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 7);
      onChange(raw);
      const result = validatePlate(raw, vehicleType);
      onValidate?.(result);
    },
    [onChange, onValidate, vehicleType]
  );

  const result = useMemo(() => validatePlate(value, vehicleType), [value, vehicleType]);

  return (
    <div className="w-full">
      <div className="relative">
        <input
          type="text"
          value={result.valid ? result.formatted : value}
          onChange={handleChange}
          placeholder={placeholder}
          disabled={disabled}
          maxLength={8}
          aria-label={ariaLabel}
          aria-invalid={value.length >= 5 && !result.valid ? true : undefined}
          autoComplete="off"
          spellCheck={false}
          className={`w-full px-3 py-2 border rounded-lg transition-colors font-mono tracking-widest text-center text-lg
            ${disabled ? "opacity-50 cursor-not-allowed bg-gray-100 dark:bg-gray-800" : "bg-[var(--input-bg)]"}
            ${result.valid ? "border-green-500 focus:ring-green-500" : ""}
            ${value.length >= 5 && !result.valid ? "border-red-500 focus:ring-red-500" : ""}
            ${value.length < 5 ? "border-[var(--input-border)]" : ""}
            focus:outline-none focus:ring-2
          `}
        />
        {result.valid && (
          <span aria-hidden="true" className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500">✓</span>
        )}
      </div>

      {result.valid && (
        <div className="mt-1 flex items-center gap-2">
          <span className="inline-block px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
            {TYPE_LABELS[result.type] || result.type}
          </span>
        </div>
      )}
    </div>
  );
}

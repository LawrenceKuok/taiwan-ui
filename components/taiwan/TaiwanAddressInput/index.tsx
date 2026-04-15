"use client";

import { useCallback, useMemo } from "react";
import postalData from "@/data/taiwan-postal.json";

export interface TaiwanAddress {
  postalCode: string;
  city: string;
  district: string;
  streetAddress: string;
}

export interface TaiwanAddressInputProps {
  value: TaiwanAddress | null;
  onChange: (address: TaiwanAddress | null) => void;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
}

const data = postalData as Record<string, Record<string, string>>;
const cities = Object.keys(data);

export default function TaiwanAddressInput({
  value,
  onChange,
  placeholder = "請輸入詳細地址",
  disabled = false,
}: TaiwanAddressInputProps) {
  const districts = useMemo(
    () => (value?.city ? Object.keys(data[value.city] || {}) : []),
    [value?.city]
  );

  const handleCityChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const city = e.target.value;
      onChange(city ? { postalCode: "", city, district: "", streetAddress: value?.streetAddress || "" } : null);
    },
    [onChange, value?.streetAddress]
  );

  const handleDistrictChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const district = e.target.value;
      const city = value?.city || "";
      const postalCode = district && city ? data[city]?.[district] || "" : "";
      onChange({ postalCode, city, district, streetAddress: value?.streetAddress || "" });
    },
    [onChange, value?.city, value?.streetAddress]
  );

  const handleStreetChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange({
        postalCode: value?.postalCode || "",
        city: value?.city || "",
        district: value?.district || "",
        streetAddress: e.target.value,
      });
    },
    [onChange, value?.postalCode, value?.city, value?.district]
  );

  const selectClass = `px-3 py-2 border rounded-lg bg-[var(--input-bg)] border-[var(--input-border)] focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${disabled ? "opacity-50 cursor-not-allowed" : ""}`;

  return (
    <div className="w-full space-y-2">
      {/* Row 1: postal code + city + district */}
      <div className="flex gap-2">
        <input
          type="text"
          value={value?.postalCode || ""}
          readOnly
          placeholder="郵遞區號"
          className="w-20 px-3 py-2 border rounded-lg bg-gray-50 dark:bg-gray-800 border-[var(--input-border)] text-center font-mono"
        />
        <select
          value={value?.city || ""}
          onChange={handleCityChange}
          disabled={disabled}
          className={`flex-1 ${selectClass}`}
        >
          <option value="">選擇縣市</option>
          {cities.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <select
          value={value?.district || ""}
          onChange={handleDistrictChange}
          disabled={disabled || !value?.city}
          className={`flex-1 ${selectClass}`}
        >
          <option value="">選擇鄉鎮區</option>
          {districts.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
      </div>

      {/* Row 2: street address */}
      <input
        type="text"
        value={value?.streetAddress || ""}
        onChange={handleStreetChange}
        placeholder={placeholder}
        disabled={disabled || !value?.district}
        className={`w-full px-3 py-2 border rounded-lg bg-[var(--input-bg)] border-[var(--input-border)] focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
      />

      {/* Preview */}
      {value?.city && (
        <p className="text-sm text-[var(--muted)]">
          {value.postalCode} {value.city}
          {value.district}
          {value.streetAddress}
        </p>
      )}
    </div>
  );
}

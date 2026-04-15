"use client";

import { useCallback, useMemo, useState } from "react";
import bankData from "@/data/taiwan-banks.json";

export interface BankAccount {
  bankCode: string;
  bankName: string;
  branchCode: string;
  accountNumber: string;
}

export interface BankAccountInputProps {
  value: BankAccount | null;
  onChange: (account: BankAccount | null) => void;
  disabled?: boolean;
}

const banks = bankData as Record<string, string>;
const bankCodes = Object.keys(banks);

export default function BankAccountInput({
  value,
  onChange,
  disabled = false,
}: BankAccountInputProps) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredBanks = useMemo(() => {
    if (!searchQuery) return bankCodes;
    const q = searchQuery.toLowerCase();
    return bankCodes.filter(
      (code) => code.includes(q) || banks[code].includes(q)
    );
  }, [searchQuery]);

  const handleBankSelect = useCallback(
    (code: string) => {
      onChange({
        bankCode: code,
        bankName: banks[code] || "",
        branchCode: value?.branchCode || "",
        accountNumber: value?.accountNumber || "",
      });
      setSearchOpen(false);
      setSearchQuery("");
    },
    [onChange, value?.branchCode, value?.accountNumber]
  );

  const handleBranchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const branchCode = e.target.value.replace(/\D/g, "").slice(0, 4);
      onChange({
        bankCode: value?.bankCode || "",
        bankName: value?.bankName || "",
        branchCode,
        accountNumber: value?.accountNumber || "",
      });
    },
    [onChange, value?.bankCode, value?.bankName, value?.accountNumber]
  );

  const handleAccountChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const accountNumber = e.target.value.replace(/\D/g, "").slice(0, 16);
      onChange({
        bankCode: value?.bankCode || "",
        bankName: value?.bankName || "",
        branchCode: value?.branchCode || "",
        accountNumber,
      });
    },
    [onChange, value?.bankCode, value?.bankName, value?.branchCode]
  );

  const inputClass = `px-3 py-2 border rounded-lg bg-[var(--input-bg)] border-[var(--input-border)] focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors font-mono ${disabled ? "opacity-50 cursor-not-allowed" : ""}`;

  const isComplete = value?.bankCode && value?.branchCode?.length === 4 && value?.accountNumber?.length >= 10;

  return (
    <div className="w-full space-y-2">
      {/* Bank selector */}
      <div className="relative">
        <button
          type="button"
          disabled={disabled}
          onClick={() => !disabled && setSearchOpen(!searchOpen)}
          className={`w-full text-left px-3 py-2 border rounded-lg transition-colors
            ${disabled ? "opacity-50 cursor-not-allowed bg-gray-100 dark:bg-gray-800" : "bg-[var(--input-bg)] border-[var(--input-border)] hover:border-blue-400 cursor-pointer"}
          `}
        >
          {value?.bankCode ? (
            <span className="text-[var(--foreground)]">
              <span className="font-mono">{value.bankCode}</span>{" "}
              <span className="text-sm">{value.bankName}</span>
            </span>
          ) : (
            <span className="text-[var(--muted)]">選擇銀行</span>
          )}
        </button>

        {searchOpen && (
          <div className="absolute z-50 mt-1 w-full bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg shadow-lg overflow-hidden">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜尋銀行代碼或名稱..."
              className="w-full px-3 py-2 border-b border-[var(--card-border)] bg-[var(--input-bg)] text-sm focus:outline-none"
              autoFocus
            />
            <div className="max-h-48 overflow-y-auto">
              {filteredBanks.map((code) => (
                <button
                  key={code}
                  type="button"
                  onClick={() => handleBankSelect(code)}
                  className={`w-full text-left px-3 py-2 text-sm hover:bg-[var(--surface)] transition-colors ${
                    value?.bankCode === code ? "bg-blue-500/10 text-blue-400" : ""
                  }`}
                >
                  <span className="font-mono text-[var(--muted)]">{code}</span>{" "}
                  <span>{banks[code]}</span>
                </button>
              ))}
              {filteredBanks.length === 0 && (
                <p className="px-3 py-4 text-sm text-[var(--muted)] text-center">
                  找不到符合的銀行
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Branch code + Account number */}
      <div className="flex gap-2">
        <input
          type="text"
          inputMode="numeric"
          value={value?.branchCode || ""}
          onChange={handleBranchChange}
          placeholder="分行代碼"
          disabled={disabled || !value?.bankCode}
          maxLength={4}
          className={`w-28 ${inputClass}`}
        />
        <input
          type="text"
          inputMode="numeric"
          value={value?.accountNumber || ""}
          onChange={handleAccountChange}
          placeholder="帳號"
          disabled={disabled || !value?.bankCode}
          maxLength={16}
          className={`flex-1 ${inputClass}`}
        />
      </div>

      {/* Preview */}
      {isComplete && (
        <div className="flex items-center gap-2">
          <span className="inline-block px-2 py-0.5 text-xs rounded-full bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
            {value?.bankName}
          </span>
          <span className="text-xs text-[var(--muted)] font-mono">
            {value?.bankCode}-{value?.branchCode}-{value?.accountNumber}
          </span>
        </div>
      )}
    </div>
  );
}

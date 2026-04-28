"use client";

import { useMemo, useState } from "react";
import TaiwanCurrencyInput from "@/components/taiwan/TaiwanCurrencyInput";
import { BRACKETS_2025, calculateTax, formatRate, type TaxBracket } from "@/lib/tax-bracket-tw";
import { formatNTD } from "@/lib/currency-tw";

/**
 * Taiwan 個人綜合所得稅 (personal income tax) bracket calculator.
 *
 * Input: 淨所得 (taxable income, after deductions). Output: per-bracket
 * breakdown + total tax + effective rate, with a stacked visualisation of
 * how income falls across brackets.
 *
 * Uses 2025 brackets per 財政部 by default; pass `brackets` to override
 * for older tax years or scenario modeling.
 */

export interface TaxBracketCalculatorProps {
  /** Initial income value (controlled use can pass income+onIncomeChange instead). */
  defaultIncome?: number;
  /** Controlled income value. */
  income?: number;
  onIncomeChange?: (income: number | null) => void;
  /** Override brackets (e.g. for previous tax years). */
  brackets?: readonly TaxBracket[];
  /** Show the per-bracket detail table. */
  showBreakdown?: boolean;
}

const BAR_COLORS = [
  "rgb(59, 130, 246)",   // blue
  "rgb(34, 197, 94)",    // green
  "rgb(234, 179, 8)",    // yellow
  "rgb(249, 115, 22)",   // orange
  "rgb(239, 68, 68)",    // red
];

export default function TaxBracketCalculator({
  defaultIncome = 1_000_000,
  income: controlled,
  onIncomeChange,
  brackets = BRACKETS_2025,
  showBreakdown = true,
}: TaxBracketCalculatorProps) {
  const [internal, setInternal] = useState<number | null>(defaultIncome);
  const income = controlled ?? internal;

  const handleChange = (v: number | null) => {
    if (controlled === undefined) setInternal(v);
    onIncomeChange?.(v);
  };

  const result = useMemo(() => calculateTax(income ?? 0, brackets), [income, brackets]);
  const maxBarIncome = useMemo(
    () => Math.max(...result.perBracket.map((p) => p.incomeInBracket), 1),
    [result]
  );

  return (
    <div className="w-full max-w-md space-y-4">
      <div>
        <label className="block text-xs font-semibold text-[var(--muted)] uppercase tracking-wider mb-1.5">
          淨所得 Taxable Income
        </label>
        <TaiwanCurrencyInput
          value={income}
          onChange={handleChange}
          showCapital={false}
          ariaLabel="淨所得"
        />
      </div>

      <div className="grid grid-cols-3 gap-2">
        <div className="rounded-lg bg-[var(--surface)] border border-[var(--card-border)] p-3 text-center">
          <p className="text-[10px] uppercase tracking-wider text-[var(--muted)] font-semibold mb-0.5">
            應納稅額 Tax
          </p>
          <p className="text-base font-bold font-mono text-red-500">{formatNTD(result.totalTax)}</p>
        </div>
        <div className="rounded-lg bg-[var(--surface)] border border-[var(--card-border)] p-3 text-center">
          <p className="text-[10px] uppercase tracking-wider text-[var(--muted)] font-semibold mb-0.5">
            邊際稅率
          </p>
          <p className="text-base font-bold font-mono text-[var(--foreground)]">
            {formatRate(result.marginalRate)}
          </p>
        </div>
        <div className="rounded-lg bg-[var(--surface)] border border-[var(--card-border)] p-3 text-center">
          <p className="text-[10px] uppercase tracking-wider text-[var(--muted)] font-semibold mb-0.5">
            有效稅率
          </p>
          <p className="text-base font-bold font-mono text-[var(--foreground)]">
            {formatRate(result.effectiveRate)}
          </p>
        </div>
      </div>

      {showBreakdown && (
        <div className="space-y-1.5">
          <p className="text-[10px] uppercase tracking-wider text-[var(--muted)] font-semibold">
            分級計算 Bracket Breakdown
          </p>
          {result.perBracket.map((p, i) => {
            const barWidth = (p.incomeInBracket / maxBarIncome) * 100;
            const color = BAR_COLORS[i] ?? "currentColor";
            const active = p.incomeInBracket > 0;
            return (
              <div
                key={i}
                className={`text-xs font-mono flex items-center gap-2 ${active ? "" : "opacity-40"}`}
                role="row"
              >
                <span className="w-9 text-right tabular-nums text-[var(--muted)]">
                  {formatRate(p.bracket.rate)}
                </span>
                <div className="flex-1 h-5 bg-[var(--surface)] rounded relative overflow-hidden">
                  <div
                    className="h-full rounded transition-all"
                    style={{ width: `${barWidth}%`, backgroundColor: color }}
                  />
                  <span className="absolute inset-0 flex items-center px-2 text-[10px] text-[var(--foreground)]">
                    {p.incomeInBracket > 0 && formatNTD(p.incomeInBracket).replace("NT$ ", "")}
                  </span>
                </div>
                <span className="w-20 text-right tabular-nums text-red-500/80">
                  {p.taxInBracket > 0 ? formatNTD(p.taxInBracket).replace("NT$ ", "") : "—"}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

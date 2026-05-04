"use client";

import { useMemo, useState } from "react";
import {
  calculateNHIPremium,
  PREMIUM_RATE_2026,
  DEPENDENT_CAP,
  type NHIPremiumResult,
} from "@/lib/health-insurance-tw";
import { formatNTD } from "@/lib/currency-tw";

/**
 * Taiwan 全民健康保險 (NHI / 健保) premium calculator.
 *
 * Renders monthly salary input + dependent count, displays insured-amount
 * bracket, total premium, and the employee/employer/government three-way
 * split. Uses 2026 rate (5.17%) by default.
 *
 * For category-1 (regular employee) scenarios only. See lib/health-insurance-tw.ts
 * for scope limitations.
 */

export interface HealthInsuranceCalculatorProps {
  /** Initial monthly income (uncontrolled). */
  defaultIncome?: number;
  /** Initial dependents (uncontrolled). */
  defaultDependents?: number;
  /** Controlled monthly income. */
  income?: number;
  onIncomeChange?: (income: number) => void;
  /** Controlled dependent count. */
  dependents?: number;
  onDependentsChange?: (n: number) => void;
  /** Override the premium rate (e.g. historical or scenario modeling). */
  premiumRate?: number;
  /** Show the annual employee summary card. */
  showAnnual?: boolean;
}

export default function HealthInsuranceCalculator({
  defaultIncome = 50_000,
  defaultDependents = 0,
  income: controlledIncome,
  onIncomeChange,
  dependents: controlledDeps,
  onDependentsChange,
  premiumRate = PREMIUM_RATE_2026,
  showAnnual = true,
}: HealthInsuranceCalculatorProps) {
  const [internalIncome, setInternalIncome] = useState(defaultIncome);
  const [internalDeps, setInternalDeps] = useState(defaultDependents);
  const income = controlledIncome ?? internalIncome;
  const dependents = controlledDeps ?? internalDeps;

  const setIncome = (v: number) => {
    if (controlledIncome === undefined) setInternalIncome(v);
    onIncomeChange?.(v);
  };
  const setDeps = (v: number) => {
    if (controlledDeps === undefined) setInternalDeps(v);
    onDependentsChange?.(v);
  };

  const result: NHIPremiumResult = useMemo(
    () => calculateNHIPremium({ monthlyIncome: income, dependents, premiumRate }),
    [income, dependents, premiumRate]
  );

  const total = result.totalMonthly;
  const employeePct = total > 0 ? (result.employeeMonthly / total) * 100 : 0;
  const employerPct = total > 0 ? (result.employerMonthly / total) * 100 : 0;
  const governmentPct = total > 0 ? (result.governmentMonthly / total) * 100 : 0;

  return (
    <div className="w-full max-w-xl space-y-6">
      {/* Inputs */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="nhi-income" className="block text-xs font-semibold mb-1.5">
            月薪 · Monthly salary (NTD)
          </label>
          <input
            id="nhi-income"
            type="number"
            min={0}
            step={1000}
            value={income}
            onChange={(e) => setIncome(Number(e.target.value) || 0)}
            className="w-full px-3 py-2 rounded-lg border border-[var(--input-border)] bg-[var(--input-bg)] font-mono tabular-nums focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-describedby="nhi-bracket"
          />
          <p id="nhi-bracket" className="text-[10px] text-[var(--muted)] mt-1">
            投保金額：{formatNTD(result.insuredSalary)}（第 {result.bracketNumber} 級）
          </p>
        </div>
        <div>
          <label htmlFor="nhi-deps" className="block text-xs font-semibold mb-1.5">
            眷屬人數 · Dependents (cap {DEPENDENT_CAP})
          </label>
          <input
            id="nhi-deps"
            type="number"
            min={0}
            max={DEPENDENT_CAP}
            step={1}
            value={dependents}
            onChange={(e) => setDeps(Math.max(0, Number(e.target.value) || 0))}
            className="w-full px-3 py-2 rounded-lg border border-[var(--input-border)] bg-[var(--input-bg)] font-mono tabular-nums focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {dependents > DEPENDENT_CAP && (
            <p className="text-[10px] text-amber-500 mt-1">
              超過上限 — 計入 {DEPENDENT_CAP} 人
            </p>
          )}
        </div>
      </div>

      {/* Total premium card */}
      <div className="rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] p-5">
        <div className="flex items-baseline justify-between mb-3">
          <span className="text-xs font-semibold text-[var(--muted)] uppercase tracking-wider">
            每月健保費總額
          </span>
          <span className="text-[10px] text-[var(--muted)]">
            費率 {(result.premiumRate * 100).toFixed(2)}%
          </span>
        </div>
        <p className="text-3xl font-bold font-mono tabular-nums">
          {formatNTD(total)}
        </p>

        {/* Stacked split bar */}
        <div className="mt-4 flex h-3 rounded-full overflow-hidden bg-[var(--surface)]">
          <div
            className="bg-blue-500"
            style={{ width: `${employeePct}%` }}
            title={`員工負擔 ${formatNTD(result.employeeMonthly)}`}
          />
          <div
            className="bg-emerald-500"
            style={{ width: `${employerPct}%` }}
            title={`雇主負擔 ${formatNTD(result.employerMonthly)}`}
          />
          <div
            className="bg-amber-500"
            style={{ width: `${governmentPct}%` }}
            title={`政府補助 ${formatNTD(result.governmentMonthly)}`}
          />
        </div>

        {/* Three-way split detail */}
        <div className="mt-4 grid grid-cols-3 gap-3">
          {[
            {
              label: "員工負擔",
              en: "Employee 30%",
              value: result.employeeMonthly,
              dot: "bg-blue-500",
            },
            {
              label: "雇主負擔",
              en: "Employer 60%",
              value: result.employerMonthly,
              dot: "bg-emerald-500",
            },
            {
              label: "政府補助",
              en: "Government 10%",
              value: result.governmentMonthly,
              dot: "bg-amber-500",
            },
          ].map((row) => (
            <div key={row.label} className="text-xs">
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className={`inline-block w-2 h-2 rounded-full ${row.dot}`} />
                <span className="font-medium">{row.label}</span>
              </div>
              <p className="font-mono tabular-nums text-sm font-semibold">
                {formatNTD(row.value)}
              </p>
              <p className="text-[10px] text-[var(--muted)]">{row.en}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Annual summary */}
      {showAnnual && (
        <div className="rounded-lg border border-[var(--card-border)] bg-[var(--surface)] p-4 text-sm">
          <div className="flex items-center justify-between">
            <span className="font-medium">員工年度健保費</span>
            <span className="font-mono tabular-nums text-base font-bold">
              {formatNTD(result.employeeAnnual)}
            </span>
          </div>
          <p className="text-[10px] text-[var(--muted)] mt-1">
            眷屬 {result.effectiveDependents} 人 × 投保 {formatNTD(result.insuredSalary)} × 12 個月
          </p>
        </div>
      )}

      {/* Honest scope disclaimer */}
      <p className="text-[10px] text-[var(--muted)] leading-relaxed">
        ⓘ 僅適用第一類被保險人（公司受雇者）。不含補充保費、勞保、就保、退休金提繳。費率與分級表以
        <a
          href="https://www.nhi.gov.tw/"
          target="_blank"
          rel="noopener noreferrer"
          className="underline mx-1"
        >
          衛福部健保署公告
        </a>
        為準。
      </p>
    </div>
  );
}

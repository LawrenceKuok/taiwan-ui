/**
 * Taiwan 個人綜合所得稅 progressive bracket calculator.
 *
 * Brackets per 財政部 (2025 tax year, applied to filings in 2026).
 * "quickDeduct" (累進差額) is the standard 財政部 shortcut: tax = income × rate − quickDeduct.
 *
 * Input is taxable income (淨所得) — i.e. after免稅額 + 標準/列舉扣除額 + 特別扣除額.
 * Caller is responsible for those deductions; this module just applies brackets.
 */

export interface TaxBracket {
  /** Lower bound inclusive (NTD). */
  min: number;
  /** Upper bound exclusive (or Infinity for the top bracket). */
  max: number;
  /** Marginal rate as a decimal (0.05 = 5%). */
  rate: number;
  /** 累進差額 (quick-deduct) per 財政部 published table. */
  quickDeduct: number;
}

/** 2025 brackets per 財政部 公告. */
export const BRACKETS_2025: readonly TaxBracket[] = Object.freeze([
  { min: 0,         max: 590_001,    rate: 0.05, quickDeduct: 0 },
  { min: 590_001,   max: 1_330_001,  rate: 0.12, quickDeduct: 41_300 },
  { min: 1_330_001, max: 2_660_001,  rate: 0.20, quickDeduct: 147_700 },
  { min: 2_660_001, max: 4_980_001,  rate: 0.30, quickDeduct: 413_700 },
  { min: 4_980_001, max: Infinity,   rate: 0.40, quickDeduct: 911_700 },
]);

export interface TaxBreakdown {
  income: number;
  totalTax: number;
  effectiveRate: number;
  marginalRate: number;
  /** Per-bracket breakdown: how much of the income fell in each bracket and the tax owed for that slice. */
  perBracket: Array<{
    bracket: TaxBracket;
    incomeInBracket: number;
    taxInBracket: number;
  }>;
}

export function calculateTax(
  income: number,
  brackets: readonly TaxBracket[] = BRACKETS_2025
): TaxBreakdown {
  if (!Number.isFinite(income) || income < 0) {
    return {
      income: 0,
      totalTax: 0,
      effectiveRate: 0,
      marginalRate: 0,
      perBracket: brackets.map((b) => ({ bracket: b, incomeInBracket: 0, taxInBracket: 0 })),
    };
  }

  let marginalRate = 0;
  const perBracket = brackets.map((b) => {
    const top = Math.min(income, b.max - 1); // brackets are inclusive on the lower bound, exclusive on max
    const incomeInBracket = top >= b.min ? top - b.min + 1 : 0;
    // Wait — fences. Use plain (max - min) not +1 for monetary ranges.
    // Re-evaluate:
    const lower = b.min;
    const upper = b.max === Infinity ? income : Math.min(income, b.max - 1);
    const span = income > lower ? upper - lower + 1 : 0;
    const realIncomeInBracket = Math.max(0, span);
    const realTaxInBracket = realIncomeInBracket * b.rate;
    if (realIncomeInBracket > 0) marginalRate = b.rate;
    return {
      bracket: b,
      incomeInBracket: realIncomeInBracket,
      taxInBracket: Math.round(realTaxInBracket),
    };
  });

  // 財政部 official formula: tax = income × marginalRate - quickDeduct
  // We round once at the end to match published tables.
  const topBracket = brackets.find((b) => income >= b.min && income < b.max) ?? brackets[brackets.length - 1]!;
  const totalTax = Math.max(0, Math.round(income * topBracket.rate - topBracket.quickDeduct));
  const effectiveRate = income > 0 ? totalTax / income : 0;

  return {
    income,
    totalTax,
    effectiveRate,
    marginalRate,
    perBracket,
  };
}

/** Format a rate as "12%". */
export function formatRate(rate: number): string {
  return `${(rate * 100).toFixed(rate * 100 < 10 && rate > 0 ? 1 : 0)}%`;
}

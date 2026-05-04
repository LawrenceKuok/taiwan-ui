/**
 * Taiwan 全民健康保險 (NHI / 健保) premium calculator.
 *
 * Reference: 衛生福利部中央健康保險署 投保金額分級表 (current as of 2026).
 * The official tables are published at https://www.nhi.gov.tw/.
 *
 * SCOPE — what this module computes:
 *   1. Insured-amount bracket (投保金額) for a given monthly salary
 *   2. Monthly NHI premium for category-1 employees (公司受雇者)
 *   3. Three-way split: employee 30% / employer 60% / government 10%
 *   4. Dependent multiplier (each dependent adds the employee share, capped at 3)
 *
 * SCOPE — what this module does NOT compute:
 *   - 補充保費 (supplementary premium, applied to bonus / dividends / etc.)
 *   - Category 2-6 insureds (self-employed, farmers, military / civil servants,
 *     low-income households, etc.). Different split ratios apply per 健保法.
 *   - 勞保 / 就保 / 退休金提繳 — those are separate modules.
 *
 * Use the result of this module ONLY for category-1 employee scenarios.
 */

/**
 * 健保 投保金額分級表 — Insured-amount brackets in NTD.
 * Each entry is the bracket ceiling: a salary of `monthlyIncome` is rounded
 * UP to the smallest bracket >= monthlyIncome.
 *
 * 2024-2026 schedule per 衛福部 公告. Brackets occasionally shift with
 * minimum-wage changes — verify against current 健保署 publication for
 * production use.
 */
export const INSURED_SALARY_BRACKETS: readonly number[] = Object.freeze([
  28_590, 30_300, 31_800, 33_300, 34_800, 36_300,
  38_200, 40_100, 42_000, 43_900, 45_800, 48_200,
  50_600, 53_000, 55_400, 57_800, 60_800, 63_800,
  66_800, 69_800, 72_800, 76_500, 80_200, 83_900,
  87_600, 92_100, 96_600, 101_100, 105_600, 110_100,
  115_500, 120_900, 126_300, 131_700, 137_100, 142_500,
  147_900, 150_000, 156_400, 162_800, 169_200, 175_600,
  182_000, 189_500, 197_000, 204_500, 212_000, 219_500,
]);

/**
 * 健保費率 (premium rate) as decimal. 2021- present rate per 健保署.
 * If 健保署 announces a future change, override via the `premiumRate`
 * parameter — don't mutate this constant.
 */
export const PREMIUM_RATE_2026 = 0.0517;

/** Cost-share ratios for category-1 (regular employee) insureds. */
export const SHARE = Object.freeze({
  employee: 0.3,
  employer: 0.6,
  government: 0.1,
});

/** Maximum dependents that count toward employee premium (per 健保法). */
export const DEPENDENT_CAP = 3;

export interface NHIPremiumInput {
  /** Gross monthly salary in NTD. */
  monthlyIncome: number;
  /** Number of declared dependents (0+). Capped internally at DEPENDENT_CAP. */
  dependents?: number;
  /** Override the premium rate (use for "what-if" or historical scenarios). */
  premiumRate?: number;
  /** Override bracket table (use for historical years). */
  brackets?: readonly number[];
}

export interface NHIPremiumResult {
  /** Bracket-rounded insured salary. */
  insuredSalary: number;
  /** 1-indexed bracket position. */
  bracketNumber: number;
  /** Effective rate used. */
  premiumRate: number;
  /** Capped dependent count actually applied. */
  effectiveDependents: number;
  /** Total monthly premium across all parties. */
  totalMonthly: number;
  /** Employee monthly cost (incl. dependent multiplier). */
  employeeMonthly: number;
  /** Employer monthly cost (per insured + dependents in some scenarios — here, per insured only). */
  employerMonthly: number;
  /** Government subsidy per month. */
  governmentMonthly: number;
  /** Annual employee out-of-pocket. */
  employeeAnnual: number;
}

/**
 * Round monthly income up to the nearest 健保 bracket.
 * Below the lowest bracket → returns the lowest bracket.
 * Above the highest bracket → returns the highest bracket (statutory cap).
 */
export function getInsuredSalary(
  monthlyIncome: number,
  brackets: readonly number[] = INSURED_SALARY_BRACKETS
): { insuredSalary: number; bracketNumber: number } {
  if (!brackets.length) {
    throw new Error("brackets must be non-empty");
  }
  if (monthlyIncome <= brackets[0]!) {
    return { insuredSalary: brackets[0]!, bracketNumber: 1 };
  }
  for (let i = 0; i < brackets.length; i++) {
    if (monthlyIncome <= brackets[i]!) {
      return { insuredSalary: brackets[i]!, bracketNumber: i + 1 };
    }
  }
  return {
    insuredSalary: brackets[brackets.length - 1]!,
    bracketNumber: brackets.length,
  };
}

/**
 * Compute the NHI premium breakdown for a category-1 employee scenario.
 *
 * Model:
 *   - Per-person base premium = insuredSalary × premiumRate
 *   - Employee pays 30% × base × (1 + dependents) — dependents capped at 3
 *   - Employer pays 60% × base × (1 + 0.61 × averageDependentMultiplier)
 *     SIMPLIFIED HERE: employer pays 60% × base only (per-insured). Real
 *     employer side uses an "average dependents per employee" figure from
 *     健保署 each year (~0.61 in 2024). For an individual-employee
 *     calculator UI, the employer-per-employee number is what matters.
 *   - Government pays 10% × base
 */
export function calculateNHIPremium(input: NHIPremiumInput): NHIPremiumResult {
  const {
    monthlyIncome,
    dependents = 0,
    premiumRate = PREMIUM_RATE_2026,
    brackets = INSURED_SALARY_BRACKETS,
  } = input;

  if (!Number.isFinite(monthlyIncome) || monthlyIncome < 0) {
    throw new Error("monthlyIncome must be a non-negative finite number");
  }
  if (!Number.isFinite(dependents) || dependents < 0) {
    throw new Error("dependents must be a non-negative finite number");
  }

  const effectiveDependents = Math.min(Math.floor(dependents), DEPENDENT_CAP);
  const { insuredSalary, bracketNumber } = getInsuredSalary(monthlyIncome, brackets);

  const base = insuredSalary * premiumRate;
  const employeeMonthly = Math.round(base * SHARE.employee * (1 + effectiveDependents));
  const employerMonthly = Math.round(base * SHARE.employer);
  const governmentMonthly = Math.round(base * SHARE.government);
  const totalMonthly = employeeMonthly + employerMonthly + governmentMonthly;

  return {
    insuredSalary,
    bracketNumber,
    premiumRate,
    effectiveDependents,
    totalMonthly,
    employeeMonthly,
    employerMonthly,
    governmentMonthly,
    employeeAnnual: employeeMonthly * 12,
  };
}

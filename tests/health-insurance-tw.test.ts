import { describe, it, expect } from "vitest";
import {
  INSURED_SALARY_BRACKETS,
  PREMIUM_RATE_2026,
  SHARE,
  DEPENDENT_CAP,
  getInsuredSalary,
  calculateNHIPremium,
} from "@/lib/health-insurance-tw";

describe("INSURED_SALARY_BRACKETS", () => {
  it("is frozen", () => {
    expect(Object.isFrozen(INSURED_SALARY_BRACKETS)).toBe(true);
  });
  it("is monotonically increasing", () => {
    for (let i = 1; i < INSURED_SALARY_BRACKETS.length; i++) {
      expect(INSURED_SALARY_BRACKETS[i]!).toBeGreaterThan(INSURED_SALARY_BRACKETS[i - 1]!);
    }
  });
  it("first bracket meets 2024 minimum-wage floor", () => {
    expect(INSURED_SALARY_BRACKETS[0]!).toBeGreaterThanOrEqual(28_000);
  });
  it("top bracket reflects published 健保 ceiling", () => {
    expect(INSURED_SALARY_BRACKETS[INSURED_SALARY_BRACKETS.length - 1]!).toBe(219_500);
  });
});

describe("getInsuredSalary", () => {
  it("clamps below-floor incomes to lowest bracket", () => {
    const r = getInsuredSalary(0);
    expect(r.insuredSalary).toBe(INSURED_SALARY_BRACKETS[0]!);
    expect(r.bracketNumber).toBe(1);
  });
  it("rounds up to next bracket boundary", () => {
    const r = getInsuredSalary(40_000);
    // 40_000 falls between 38_200 and 40_100; should round UP to 40_100
    expect(r.insuredSalary).toBe(40_100);
  });
  it("matches exact bracket boundary", () => {
    const r = getInsuredSalary(50_600);
    expect(r.insuredSalary).toBe(50_600);
  });
  it("clamps above-ceiling incomes to top bracket", () => {
    const r = getInsuredSalary(500_000);
    expect(r.insuredSalary).toBe(219_500);
    expect(r.bracketNumber).toBe(INSURED_SALARY_BRACKETS.length);
  });
});

describe("calculateNHIPremium / category-1 employee", () => {
  it("computes a known scenario: NT$50,000 salary, 0 dependents", () => {
    const r = calculateNHIPremium({ monthlyIncome: 50_000, dependents: 0 });
    expect(r.insuredSalary).toBe(50_600); // rounds up
    expect(r.premiumRate).toBeCloseTo(PREMIUM_RATE_2026);
    // base = 50,600 × 0.0517 ≈ 2,615.62
    // employee 30% = ~785
    expect(r.employeeMonthly).toBe(Math.round(50_600 * 0.0517 * 0.3));
    expect(r.employerMonthly).toBe(Math.round(50_600 * 0.0517 * 0.6));
    expect(r.governmentMonthly).toBe(Math.round(50_600 * 0.0517 * 0.1));
  });

  it("applies dependent multiplier to employee share only", () => {
    const r0 = calculateNHIPremium({ monthlyIncome: 50_000, dependents: 0 });
    const r2 = calculateNHIPremium({ monthlyIncome: 50_000, dependents: 2 });
    // Employee share scales by (1 + dependents); allow ±1 NTD due to single-step rounding
    expect(Math.abs(r2.employeeMonthly - r0.employeeMonthly * 3)).toBeLessThanOrEqual(1);
    // Employer/government do NOT scale
    expect(r2.employerMonthly).toBe(r0.employerMonthly);
    expect(r2.governmentMonthly).toBe(r0.governmentMonthly);
  });

  it("caps dependents at 3", () => {
    const r5 = calculateNHIPremium({ monthlyIncome: 50_000, dependents: 5 });
    const r3 = calculateNHIPremium({ monthlyIncome: 50_000, dependents: 3 });
    expect(r5.effectiveDependents).toBe(DEPENDENT_CAP);
    expect(r5.employeeMonthly).toBe(r3.employeeMonthly);
  });

  it("annual = monthly × 12", () => {
    const r = calculateNHIPremium({ monthlyIncome: 75_000 });
    expect(r.employeeAnnual).toBe(r.employeeMonthly * 12);
  });

  it("share constants sum to 1.0", () => {
    expect(SHARE.employee + SHARE.employer + SHARE.government).toBeCloseTo(1.0);
  });

  it("rejects negative income", () => {
    expect(() => calculateNHIPremium({ monthlyIncome: -1 })).toThrow();
  });

  it("rejects negative dependents", () => {
    expect(() => calculateNHIPremium({ monthlyIncome: 50_000, dependents: -1 })).toThrow();
  });

  it("respects custom premium rate (e.g. historical 2020 rate)", () => {
    const r = calculateNHIPremium({ monthlyIncome: 50_000, premiumRate: 0.0469 });
    expect(r.premiumRate).toBe(0.0469);
    expect(r.employeeMonthly).toBe(Math.round(50_600 * 0.0469 * 0.3));
  });

  it("high-income employee maxes out at top bracket", () => {
    const r = calculateNHIPremium({ monthlyIncome: 1_000_000 });
    expect(r.insuredSalary).toBe(219_500);
  });
});

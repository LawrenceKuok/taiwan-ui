import { describe, it, expect } from "vitest";
import { calculateTax, BRACKETS_2025, formatRate } from "@/lib/tax-bracket-tw";

/**
 * Reference values cross-checked against 財政部 published 累進差額 table.
 * Formula: tax = income × marginalRate − quickDeduct
 */

describe("calculateTax / 2025 brackets", () => {
  it("zero income → zero tax", () => {
    const r = calculateTax(0);
    expect(r.totalTax).toBe(0);
    expect(r.marginalRate).toBe(0);
    expect(r.effectiveRate).toBe(0);
  });

  it("first bracket (5%): 500,000 → 25,000", () => {
    const r = calculateTax(500_000);
    expect(r.totalTax).toBe(25_000);
    expect(r.marginalRate).toBe(0.05);
  });

  it("second bracket (12%): 1,000,000 → 78,700", () => {
    // 1,000,000 × 0.12 − 41,300 = 120,000 − 41,300 = 78,700
    const r = calculateTax(1_000_000);
    expect(r.totalTax).toBe(78_700);
    expect(r.marginalRate).toBe(0.12);
  });

  it("third bracket (20%): 2,000,000 → 252,300", () => {
    // 2,000,000 × 0.20 − 147,700 = 400,000 − 147,700 = 252,300
    const r = calculateTax(2_000_000);
    expect(r.totalTax).toBe(252_300);
    expect(r.marginalRate).toBe(0.20);
  });

  it("fourth bracket (30%): 3,000,000 → 486,300", () => {
    // 3,000,000 × 0.30 − 413,700 = 900,000 − 413,700 = 486,300
    const r = calculateTax(3_000_000);
    expect(r.totalTax).toBe(486_300);
    expect(r.marginalRate).toBe(0.30);
  });

  it("fifth bracket (40%): 6,000,000 → 1,488,300", () => {
    // 6,000,000 × 0.40 − 911,700 = 2,400,000 − 911,700 = 1,488,300
    const r = calculateTax(6_000_000);
    expect(r.totalTax).toBe(1_488_300);
    expect(r.marginalRate).toBe(0.40);
  });

  it("effective rate < marginal rate", () => {
    const r = calculateTax(2_000_000);
    expect(r.effectiveRate).toBeLessThan(r.marginalRate);
    expect(r.effectiveRate).toBeGreaterThan(0);
  });

  it("rejects negative income", () => {
    const r = calculateTax(-1000);
    expect(r.totalTax).toBe(0);
  });

  it("rejects non-finite", () => {
    expect(calculateTax(NaN).totalTax).toBe(0);
    expect(calculateTax(Infinity).totalTax).toBe(0);
  });

  it("BRACKETS_2025 is frozen and matches 財政部 spec", () => {
    expect(Object.isFrozen(BRACKETS_2025)).toBe(true);
    expect(BRACKETS_2025).toHaveLength(5);
    expect(BRACKETS_2025[0]!.rate).toBe(0.05);
    expect(BRACKETS_2025[4]!.rate).toBe(0.40);
    expect(BRACKETS_2025[4]!.quickDeduct).toBe(911_700);
  });
});

describe("formatRate", () => {
  it("formats whole-percent rates", () => {
    expect(formatRate(0.20)).toBe("20%");
    expect(formatRate(0.40)).toBe("40%");
  });

  it("formats single-digit rate with decimal", () => {
    expect(formatRate(0.05)).toBe("5.0%");
  });

  it("formats zero", () => {
    expect(formatRate(0)).toBe("0%");
  });
});

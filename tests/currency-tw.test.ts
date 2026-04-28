import { describe, it, expect } from "vitest";
import { toCapitalChinese, formatNTD, parseNTD } from "@/lib/currency-tw";

describe("toCapitalChinese", () => {
  it("returns 零元整 for 0", () => {
    expect(toCapitalChinese(0)).toBe("零元整");
  });

  it("converts single-digit values", () => {
    expect(toCapitalChinese(1)).toBe("壹元整");
    expect(toCapitalChinese(9)).toBe("玖元整");
  });

  it("converts within a single 4-digit group", () => {
    expect(toCapitalChinese(10)).toBe("壹拾元整");
    expect(toCapitalChinese(100)).toBe("壹佰元整");
    expect(toCapitalChinese(1000)).toBe("壹仟元整");
    expect(toCapitalChinese(1234)).toBe("壹仟貳佰參拾肆元整");
  });

  it("converts 萬-group values", () => {
    expect(toCapitalChinese(10000)).toBe("壹萬元整");
    expect(toCapitalChinese(12345)).toBe("壹萬貳仟參佰肆拾伍元整");
    expect(toCapitalChinese(1234567)).toBe("壹佰貳拾參萬肆仟伍佰陸拾柒元整");
  });

  it("converts 億-group values", () => {
    expect(toCapitalChinese(100_000_000)).toBe("壹億元整");
    expect(toCapitalChinese(123_456_789)).toBe("壹億貳仟參佰肆拾伍萬陸仟柒佰捌拾玖元整");
  });

  it("inserts 零 between groups when middle group is empty", () => {
    // 100,000,001 = 1 億 + 0 萬-group + 1 → expect 零 separator
    expect(toCapitalChinese(100_000_001)).toBe("壹億零壹元整");
  });

  it("collapses internal zeros in a single group to one 零", () => {
    expect(toCapitalChinese(1001)).toBe("壹仟零壹元整");
    expect(toCapitalChinese(10001)).toBe("壹萬零壹元整");
  });

  it("supports custom suffix", () => {
    expect(toCapitalChinese(100, { suffix: "元" })).toBe("壹佰元");
    expect(toCapitalChinese(100, { suffix: "" })).toBe("壹佰");
  });

  it("rejects invalid input", () => {
    expect(toCapitalChinese(-1)).toBe("");
    expect(toCapitalChinese(1.5)).toBe("");
    expect(toCapitalChinese(NaN)).toBe("");
    expect(toCapitalChinese(Infinity)).toBe("");
  });

  it("rejects values >= 10^16", () => {
    expect(toCapitalChinese(1e16)).toBe("");
  });
});

describe("formatNTD", () => {
  it("formats with NT$ prefix and commas", () => {
    expect(formatNTD(1234567)).toBe("NT$ 1,234,567");
    expect(formatNTD(0)).toBe("NT$ 0");
    expect(formatNTD(100)).toBe("NT$ 100");
  });

  it("supports custom symbol", () => {
    expect(formatNTD(100, { symbol: "$" })).toBe("$ 100");
    expect(formatNTD(100, { symbol: "" })).toBe(" 100");
  });

  it("handles negatives", () => {
    expect(formatNTD(-500)).toBe("NT$ -500");
  });

  it("rejects NaN", () => {
    expect(formatNTD(NaN)).toBe("");
  });
});

describe("parseNTD", () => {
  it("strips formatting", () => {
    expect(parseNTD("NT$ 1,234,567")).toBe(1234567);
    expect(parseNTD("$1,000")).toBe(1000);
    expect(parseNTD("100")).toBe(100);
  });

  it("returns NaN for empty/invalid", () => {
    expect(parseNTD("")).toBeNaN();
    expect(parseNTD("abc")).toBeNaN();
  });
});

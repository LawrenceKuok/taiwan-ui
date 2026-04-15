import { describe, it, expect } from "vitest";
import { validatePlate } from "@/lib/validators/license-plate";

describe("validatePlate / auto-detect", () => {
  const CASES = [
    { input: "ABC-1234", type: "car-new", formatted: "ABC-1234" },
    { input: "abc1234", type: "car-new", formatted: "ABC-1234" },
    { input: "1234-AB", type: "car-new", formatted: "1234-AB" },
    { input: "AB-1234", type: "car-old", formatted: "AB-1234" },
    { input: "A12345", type: "car-old", formatted: "A1-2345" },
    { input: "ABC-123", type: "motorcycle", formatted: "ABC-123" },
    { input: "AB-123", type: "motorcycle", formatted: "AB-123" },
    { input: "123-AB", type: "motorcycle", formatted: "123-AB" },
  ];

  for (const { input, type, formatted } of CASES) {
    it(`accepts ${input} as ${type}`, () => {
      const r = validatePlate(input);
      expect(r.valid, `expected ${input} valid`).toBe(true);
      expect(r.type).toBe(type);
      expect(r.formatted).toBe(formatted);
    });
  }
});

describe("validatePlate / hint=motorcycle", () => {
  it("classifies AAA-0000 as heavy motorcycle with hint", () => {
    const r = validatePlate("ABC-1234", "motorcycle");
    expect(r.valid).toBe(true);
    expect(r.type).toBe("motorcycle-heavy");
  });

  it("rejects car-only legacy format with motorcycle hint", () => {
    const r = validatePlate("AB-1234", "motorcycle");
    expect(r.valid).toBe(false);
  });
});

describe("validatePlate / hint=car", () => {
  it("rejects short motorcycle format with car hint", () => {
    const r = validatePlate("ABC-123", "car");
    expect(r.valid).toBe(false);
  });
});

describe("validatePlate / invalid", () => {
  const INVALID = ["", "A", "12", "ABCD-1234", "ABC-12", "XYZ-12A4", "!!!-1234"];
  for (const input of INVALID) {
    it(`rejects "${input}"`, () => {
      expect(validatePlate(input).valid).toBe(false);
    });
  }
});

describe("validatePlate / normalization", () => {
  it("uppercases input", () => {
    expect(validatePlate("abc-1234").raw).toBe("ABC1234");
  });
  it("strips separators and spaces", () => {
    expect(validatePlate("ABC 1234").raw).toBe("ABC1234");
    expect(validatePlate("ABC/1234").raw).toBe("ABC1234");
  });
});

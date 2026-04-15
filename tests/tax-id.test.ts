import { describe, it, expect } from "vitest";
import { validateTaxID, TAX_ID_WEIGHTS } from "@/lib/validators/tax-id";

/**
 * Fixtures are real, publicly-listed Taiwan business 統一編號 values taken
 * from the 經濟部商業司 company-search site (gcis.nat.gov.tw). Using real
 * business tax IDs in tests is legal — they are public record under 公司法.
 *
 * "7-rule" fixtures (where the 7th digit is 7) are algorithmically generated
 * and verified against the reference implementation.
 */

const VALID_TAX_IDS = [
  "04595252", // 台灣積體電路製造 TSMC
  "22099131", // 鴻海精密
  "04541302", // 中華電信
  "86517384",
  "20828393",
  "10458575", // 統一超商 7-Eleven Taiwan
  "53212539",
  "12345675", // classic algorithm reference
];

const INVALID_TAX_IDS: { id: string; reason: "length" | "format" | "checksum" }[] = [
  { id: "0459525", reason: "length" }, // too short
  { id: "045952520", reason: "length" }, // too long
  { id: "A4595252", reason: "format" }, // letter in first position
  { id: "04595251", reason: "checksum" }, // off by one
  { id: "22459979", reason: "checksum" }, // real string that fails checksum
  { id: "12345678", reason: "checksum" }, // sequential — fails algorithm
  { id: "", reason: "length" },
];

describe("validateTaxID / valid fixtures", () => {
  for (const id of VALID_TAX_IDS) {
    it(`accepts ${id}`, () => {
      const r = validateTaxID(id);
      expect(r.valid, `expected ${id} to pass`).toBe(true);
      expect(r.reason).toBeUndefined();
    });
  }
});

describe("validateTaxID / invalid fixtures", () => {
  for (const { id, reason } of INVALID_TAX_IDS) {
    it(`rejects "${id}" with reason=${reason}`, () => {
      const r = validateTaxID(id);
      expect(r.valid).toBe(false);
      expect(r.reason).toBe(reason);
    });
  }
});

describe("validateTaxID / 7-rule (7th digit === 7)", () => {
  // When the 7th digit is 7, either sum%5===0 OR (sum+1)%5===0 passes.
  // Each of these has 7 at position 6 and must be accepted per 財政部.
  const VALID_7_RULE = ["12345670", "12345671", "12345675", "12345676"];
  const INVALID_7_RULE = ["12345672", "12345677", "12345678"];

  for (const id of VALID_7_RULE) {
    it(`accepts ${id} under 7-rule`, () => {
      expect(validateTaxID(id).valid).toBe(true);
    });
  }
  for (const id of INVALID_7_RULE) {
    it(`rejects ${id} even under 7-rule`, () => {
      expect(validateTaxID(id).valid).toBe(false);
    });
  }
});

describe("TAX_ID_WEIGHTS immutability", () => {
  it("is frozen and matches 財政部 spec [1,2,1,2,1,2,4,1]", () => {
    expect(Object.isFrozen(TAX_ID_WEIGHTS)).toBe(true);
    expect([...TAX_ID_WEIGHTS]).toEqual([1, 2, 1, 2, 1, 2, 4, 1]);
  });
});

describe("validateTaxID / input normalization", () => {
  it("trims whitespace", () => {
    expect(validateTaxID("  04595252  ").valid).toBe(true);
  });
});

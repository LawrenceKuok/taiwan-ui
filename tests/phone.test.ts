import { describe, it, expect } from "vitest";
import { validatePhone, normalizePhone, AREA_CODES } from "@/lib/validators/phone";

describe("normalizePhone", () => {
  it("strips separators", () => {
    expect(normalizePhone("0912-345-678")).toBe("0912345678");
    expect(normalizePhone("(02) 1234-5678")).toBe("0212345678");
    expect(normalizePhone("02 1234 5678")).toBe("0212345678");
  });

  it("converts +886 prefix to leading 0", () => {
    expect(normalizePhone("+886-912-345-678")).toBe("0912345678");
    expect(normalizePhone("+886 2 1234 5678")).toBe("0212345678");
  });

  it("converts bare 886 prefix to leading 0", () => {
    expect(normalizePhone("886912345678")).toBe("0912345678");
  });
});

describe("validatePhone / mobile", () => {
  const VALID = ["0912345678", "0987654321", "0900000000", "+886912345678", "0912-345-678"];
  for (const input of VALID) {
    it(`accepts mobile ${input}`, () => {
      const r = validatePhone(input);
      expect(r.valid).toBe(true);
      expect(r.type).toBe("mobile");
      expect(r.formatted).toMatch(/^09\d{2}-\d{3}-\d{3}$/);
    });
  }

  const INVALID = [
    "091234567", // 9 digits
    "09123456789", // 11 digits
    "0812345678", // wrong prefix (not 09)
  ];
  for (const input of INVALID) {
    it(`rejects mobile ${input}`, () => {
      expect(validatePhone(input).valid).toBe(false);
    });
  }
});

describe("validatePhone / landline", () => {
  const CASES = [
    { input: "0212345678", areaCode: "02", local: "12345678" },
    { input: "0312345678", areaCode: "03", local: "12345678" },
    { input: "031234567", areaCode: "03", local: "1234567" },
    { input: "0412345678", areaCode: "04", local: "12345678" },
    { input: "051234567", areaCode: "05", local: "1234567" },
    { input: "061234567", areaCode: "06", local: "1234567" },
    { input: "0712345678", areaCode: "07", local: "12345678" },
    { input: "081234567", areaCode: "08", local: "1234567" },
    { input: "0371234567", areaCode: "037", local: "1234567" },
    { input: "0371234567", areaCode: "037", local: "1234567" },
    { input: "0491234567", areaCode: "049", local: "1234567" },
    { input: "0891234567", areaCode: "089", local: "1234567" },
    { input: "083612345", areaCode: "0836", local: "12345" }, // 馬祖
    { input: "082612345", areaCode: "0826", local: "12345" }, // 烏坵
  ];

  for (const { input, areaCode } of CASES) {
    it(`accepts landline ${input} as area ${areaCode}`, () => {
      const r = validatePhone(input);
      expect(r.valid, `expected ${input} valid`).toBe(true);
      expect(r.type).toBe("landline");
      expect(r.areaCode).toBe(areaCode);
    });
  }

  it("rejects landline with too-short local part", () => {
    const r = validatePhone("021234");
    expect(r.valid).toBe(false);
    expect(r.areaCode).toBe("02");
    expect(r.reason).toBe("length");
  });

  it("rejects unknown area code", () => {
    const r = validatePhone("0121234567");
    expect(r.valid).toBe(false);
    expect(r.reason).toBe("unknown-area-code");
  });
});

describe("validatePhone / formatting", () => {
  it("formats mobile with hyphens", () => {
    expect(validatePhone("0912345678").formatted).toBe("0912-345-678");
  });
  it("formats landline with area-code brackets", () => {
    expect(validatePhone("0223456789").formatted).toMatch(/^\(02\) /);
  });
});

describe("AREA_CODES coverage", () => {
  it("includes all region major codes 02..08", () => {
    for (const c of ["02", "03", "04", "05", "06", "07", "08"]) {
      expect(AREA_CODES[c], `missing ${c}`).toBeTruthy();
    }
  });
  it("includes outlying islands (馬祖 0836, 金門 082, 烏坵 0826)", () => {
    expect(AREA_CODES["0836"]).toBe("馬祖");
    expect(AREA_CODES["082"]).toBe("金門");
    expect(AREA_CODES["0826"]).toBe("烏坵");
  });
});

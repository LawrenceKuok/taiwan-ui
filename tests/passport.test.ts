import { describe, it, expect } from "vitest";
import { validatePassport } from "@/lib/validators/passport";

describe("validatePassport", () => {
  it("accepts 9 numeric digits", () => {
    expect(validatePassport("123456789").valid).toBe(true);
    expect(validatePassport("000000001").valid).toBe(true);
    expect(validatePassport("999999999").valid).toBe(true);
  });

  it("strips whitespace and hyphens before validating", () => {
    expect(validatePassport("123 456 789").valid).toBe(true);
    expect(validatePassport("123-456-789").valid).toBe(true);
    expect(validatePassport(" 123456789 ").valid).toBe(true);
  });

  it("rejects empty input with reason 'empty'", () => {
    const r = validatePassport("");
    expect(r.valid).toBe(false);
    expect(r.reason).toBe("empty");
  });

  it("rejects wrong length with reason 'length'", () => {
    expect(validatePassport("12345").reason).toBe("length");
    expect(validatePassport("12345678").reason).toBe("length");
    expect(validatePassport("1234567890").reason).toBe("length");
  });

  it("rejects non-numeric with reason 'format'", () => {
    expect(validatePassport("A12345678").reason).toBe("format");
    expect(validatePassport("12345678X").reason).toBe("format");
    expect(validatePassport("123abc789").reason).toBe("format");
  });

  it("always returns the cleaned raw string", () => {
    expect(validatePassport("123-456-789").raw).toBe("123456789");
    expect(validatePassport("XYZ").raw).toBe("XYZ");
  });
});

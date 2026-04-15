import { describe, it, expect } from "vitest";
import { validateUniformInvoice } from "@/lib/validators/uniform-invoice";

describe("validateUniformInvoice", () => {
  it("accepts canonical AB12345678", () => {
    const r = validateUniformInvoice("AB12345678");
    expect(r.valid).toBe(true);
    expect(r.formatted).toBe("AB-12345678");
  });

  it("accepts with hyphen", () => {
    expect(validateUniformInvoice("AB-12345678").valid).toBe(true);
  });

  it("uppercases lowercase letters", () => {
    const r = validateUniformInvoice("ab12345678");
    expect(r.valid).toBe(true);
    expect(r.raw).toBe("AB12345678");
  });

  it("rejects wrong length", () => {
    expect(validateUniformInvoice("AB1234567").reason).toBe("length");
    expect(validateUniformInvoice("AB123456789").reason).toBe("length");
  });

  it("rejects when letters are digits", () => {
    expect(validateUniformInvoice("1234567890").reason).toBe("format");
  });

  it("rejects when digits contain letters", () => {
    expect(validateUniformInvoice("AB1234567X").reason).toBe("format");
  });
});

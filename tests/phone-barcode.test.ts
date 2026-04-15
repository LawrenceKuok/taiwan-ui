import { describe, it, expect } from "vitest";
import { validatePhoneBarcode } from "@/lib/validators/phone-barcode";

describe("validatePhoneBarcode", () => {
  it("accepts canonical barcode", () => {
    expect(validatePhoneBarcode("/ABC+123").valid).toBe(true);
  });

  it("accepts all allowed characters", () => {
    expect(validatePhoneBarcode("/A.+-012").valid).toBe(true);
    expect(validatePhoneBarcode("/ZZZZZZZ").valid).toBe(true);
    expect(validatePhoneBarcode("/0000000").valid).toBe(true);
  });

  it("uppercases lowercase input", () => {
    const r = validatePhoneBarcode("/abc+123");
    expect(r.valid).toBe(true);
    expect(r.raw).toBe("/ABC+123");
  });

  it("rejects wrong length", () => {
    expect(validatePhoneBarcode("/ABC").reason).toBe("length");
    expect(validatePhoneBarcode("/ABCDEFGH").reason).toBe("length");
  });

  it("rejects disallowed characters", () => {
    expect(validatePhoneBarcode("/ABC 123").reason).toBe("format");
    expect(validatePhoneBarcode("/ABC@123").reason).toBe("format");
  });

  it("prepends missing leading slash", () => {
    // If user types "ABC+123X" (8 chars no slash), normalization adds "/" → becomes 9 chars → length fail.
    // But "ABC+123" (7 chars) gets "/" prepended → valid.
    expect(validatePhoneBarcode("ABC+123").valid).toBe(true);
  });
});

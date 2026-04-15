import { describe, it, expect } from "vitest";
import { validateNHICard } from "@/lib/validators/nhi-card";

describe("validateNHICard", () => {
  it("accepts 12 numeric digits", () => {
    const r = validateNHICard("000012345678");
    expect(r.valid).toBe(true);
    expect(r.formatted).toBe("0000 1234 5678");
  });

  it("strips non-digit separators", () => {
    expect(validateNHICard("0000-1234-5678").valid).toBe(true);
    expect(validateNHICard("0000 1234 5678").valid).toBe(true);
  });

  it("rejects length != 12", () => {
    expect(validateNHICard("12345").reason).toBe("length");
    expect(validateNHICard("1234567890123").reason).toBe("length");
    expect(validateNHICard("").reason).toBe("length");
  });

  it("exposes formatted raw regardless of validity", () => {
    const r = validateNHICard("1234");
    expect(r.raw).toBe("1234");
  });
});

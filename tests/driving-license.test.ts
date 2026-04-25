import { describe, it, expect } from "vitest";
import { validateDrivingLicense } from "@/lib/validators/driving-license";

describe("validateDrivingLicense", () => {
  describe("modern TWID-form (1 letter + 9 digits)", () => {
    it("accepts a real-format TWID and reports format='twid'", () => {
      // A123456789 — well-known synthetic-but-valid TWID checksum
      const r = validateDrivingLicense("A123456789");
      expect(r.valid).toBe(true);
      expect(r.format).toBe("twid");
    });

    it("rejects TWID-form with a bad checksum", () => {
      const r = validateDrivingLicense("A123456780");
      expect(r.valid).toBe(false);
      expect(r.format).toBe("twid");
      expect(r.reason).toBe("checksum");
    });

    it("strips whitespace and uppercases letters", () => {
      expect(validateDrivingLicense("a 1234 56789").valid).toBe(true);
      expect(validateDrivingLicense(" A123456789 ").valid).toBe(true);
    });
  });

  describe("legacy 6-8 digit serial format", () => {
    it("accepts 6-, 7-, 8-digit pure-numeric serials with format='legacy'", () => {
      expect(validateDrivingLicense("123456").format).toBe("legacy");
      expect(validateDrivingLicense("1234567").valid).toBe(true);
      expect(validateDrivingLicense("12345678").valid).toBe(true);
    });

    it("strips internal whitespace", () => {
      expect(validateDrivingLicense("123 4567").valid).toBe(true);
    });
  });

  describe("rejection paths", () => {
    it("rejects empty input with reason 'empty'", () => {
      const r = validateDrivingLicense("");
      expect(r.valid).toBe(false);
      expect(r.reason).toBe("empty");
    });

    it("rejects out-of-range lengths", () => {
      expect(validateDrivingLicense("12345").reason).toBe("length");
      expect(validateDrivingLicense("12345678901").reason).toBe("length");
    });

    it("rejects mixed-format that doesn't match either shape", () => {
      expect(validateDrivingLicense("A12345").reason).toBe("format");
      expect(validateDrivingLicense("AB123456").reason).toBe("format");
    });
  });
});

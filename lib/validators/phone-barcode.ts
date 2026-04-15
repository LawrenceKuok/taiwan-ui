/**
 * Taiwan e-invoice mobile barcode carrier (手機條碼載具) validator.
 *
 * Spec: 財政部電子發票整合服務平台 — 共通性載具 (手機條碼).
 * Format: leading "/" followed by exactly 7 characters from the set
 *   [0-9], [A-Z], ".", "+", "-"
 *
 * Total length: 8 characters including the slash.
 *
 * This is a FORMAT check only. To verify a barcode actually exists and is
 * active, a caller must use the MOF e-invoice API (載具驗證) with a
 * registered AppID. That call is out of scope for this library.
 */

export interface BarcodeValidationResult {
  valid: boolean;
  /** Normalized form (uppercased, leading "/" ensured for length≥1). */
  raw: string;
  /** Same as raw — barcodes have no display separators. */
  formatted: string;
  reason?: "length" | "format";
}

const BARCODE_RE = /^\/[0-9A-Z.+\-]{7}$/;

export function validatePhoneBarcode(input: string): BarcodeValidationResult {
  const upper = input.toUpperCase();
  const normalized = upper.startsWith("/") ? upper : "/" + upper.replace(/\//g, "");

  if (normalized.length !== 8) {
    return { valid: false, raw: normalized, formatted: normalized, reason: "length" };
  }
  if (!BARCODE_RE.test(normalized)) {
    return { valid: false, raw: normalized, formatted: normalized, reason: "format" };
  }
  return { valid: true, raw: normalized, formatted: normalized };
}

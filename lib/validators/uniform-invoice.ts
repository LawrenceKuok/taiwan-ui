/**
 * Taiwan Uniform Invoice Number (統一發票號碼) validator.
 *
 * Format: two uppercase letters + 8 digits, displayed as "AB-12345678".
 *
 * Spec: 財政部 "統一發票使用辦法".
 *
 * This validator only checks the FORMAT of the number string. To determine
 * whether an invoice has won a prize in a given period (統一發票中獎號碼),
 * a caller must compare against the MOF's bimonthly winning numbers feed
 * (https://invoice.etax.nat.gov.tw/). That lookup is intentionally out of
 * scope for this library.
 */

export interface InvoiceValidationResult {
  valid: boolean;
  /** Uppercased with hyphens stripped. */
  raw: string;
  /** Display form "AB-12345678" when raw.length >= 2. */
  formatted: string;
  reason?: "length" | "format";
}

export function validateUniformInvoice(input: string): InvoiceValidationResult {
  const raw = input.replace(/-/g, "").toUpperCase().trim();
  const formatted = raw.length > 2 ? `${raw.slice(0, 2)}-${raw.slice(2)}` : raw;

  if (raw.length !== 10) return { valid: false, raw, formatted, reason: "length" };
  if (!/^[A-Z]{2}\d{8}$/.test(raw)) return { valid: false, raw, formatted, reason: "format" };
  return { valid: true, raw, formatted };
}

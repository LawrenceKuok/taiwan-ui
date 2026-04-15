/**
 * Taiwan National Health Insurance card (健保卡) number validator.
 *
 * Spec: 衛生福利部中央健康保險署 健保卡格式.
 *
 * Current cards use a 12-digit numeric identifier printed on the front-bottom
 * of the card ("卡號"). Older two-segment cards (4-digit + 8-digit) are rare
 * but still in circulation and accepted when input without separators.
 *
 * No checksum is published publicly for the NHI card number — this validator
 * only enforces the numeric-12-digit shape. A govt-integration layer (健保署
 * 讀卡機 SDK) must be used for actual card validity.
 */

export interface NHIValidationResult {
  valid: boolean;
  raw: string;
  /** Display form: XXXX XXXX XXXX */
  formatted: string;
  reason?: "length" | "format";
}

export function validateNHICard(input: string): NHIValidationResult {
  const raw = input.replace(/\D/g, "");
  if (raw.length !== 12) {
    return { valid: false, raw, formatted: raw.replace(/(\d{4})(?=\d)/g, "$1 ").trim(), reason: "length" };
  }
  if (!/^\d{12}$/.test(raw)) {
    return { valid: false, raw, formatted: raw, reason: "format" };
  }
  return {
    valid: true,
    raw,
    formatted: `${raw.slice(0, 4)} ${raw.slice(4, 8)} ${raw.slice(8, 12)}`,
  };
}

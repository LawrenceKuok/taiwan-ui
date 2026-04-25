/**
 * Taiwan (ROC) Passport Number validator (中華民國護照號碼).
 *
 * Official spec sources:
 * - 外交部領事事務局 — Bureau of Consular Affairs, MOFA
 *   (https://www.boca.gov.tw — passport number format reference)
 *
 * Format:
 *   Modern ROC passports (2008+ e-passport era): 9 digits, no leading
 *   letter, no internal checksum published. Numeric range 0-9 per
 *   position. The first digit is non-zero in practice but the spec
 *   doesn't formally forbid leading zero — we accept both.
 *
 *   Historical pre-2008 booklets used a similar 9-digit format but
 *   are no longer issued; outstanding ones remain in circulation
 *   and validate the same way.
 *
 * Scope:
 *   - Format-only validation (length + numeric).
 *   - Does NOT verify against MOFA's records — there is no public API.
 *   - Does NOT distinguish issued vs. not-yet-issued numbers.
 *   - Strips whitespace; rejects letters, hyphens, anything non-digit.
 *
 * Out of scope (intentionally not handled):
 *   - Diplomatic / official passports (different number space)
 *   - Republic of China (Taiwan) Travel Document for ARC holders
 *   - Foreign passports (use a separate validator)
 */

export interface PassportValidationResult {
  /** True iff the input is a well-formed 9-digit Taiwan passport number. */
  valid: boolean;
  /** The cleaned input (digits only). Always returned. */
  raw: string;
  /** Stable i18n-safe reason when invalid. */
  reason?: "empty" | "length" | "format";
}

/** Strip whitespace and any internal separators a user might paste. */
function clean(input: string): string {
  return input.replace(/[\s\-_]/g, "");
}

export function validatePassport(input: string): PassportValidationResult {
  const raw = clean(input ?? "");

  if (raw.length === 0) {
    return { valid: false, raw, reason: "empty" };
  }

  if (raw.length !== 9) {
    return { valid: false, raw, reason: "length" };
  }

  if (!/^\d{9}$/.test(raw)) {
    return { valid: false, raw, reason: "format" };
  }

  return { valid: true, raw };
}

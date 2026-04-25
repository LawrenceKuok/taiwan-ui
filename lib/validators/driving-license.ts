/**
 * Taiwan Driver's License Number validator (中華民國駕駛執照號碼).
 *
 * Official spec sources:
 * - 交通部公路總局 — Directorate General of Highways, MOTC
 *   "汽車駕駛執照號碼編定原則"
 *
 * Format:
 *   Modern driver's licenses use the holder's national ID number
 *   (身分證字號) as the licence number — i.e. 1 letter + 9 digits.
 *   Issued from late-1980s onwards. This is the only format actively
 *   issued today.
 *
 *   Historical licenses (pre-1980s) used a 6–8 digit serial number;
 *   those remain valid but are vanishingly rare in circulation.
 *   We accept both:
 *     - "twid" form: matches the TWID checksum spec (1 letter + 9 digits)
 *     - "legacy" form: 6–8 digit pure-numeric serial (no checksum)
 *
 * Scope:
 *   - Format + (for TWID-form) checksum validation.
 *   - Does NOT verify license class (汽車/機車/職業駕照).
 *   - Does NOT verify against the MOTC issuance database.
 *
 * For TWID-form numbers we delegate to the existing twid validator
 * so checksum logic is shared and stays in one place.
 */

import { validateTWID } from "./twid";

export interface DrivingLicenseValidationResult {
  /** True iff the input is a well-formed Taiwan driver's license number. */
  valid: boolean;
  /** The cleaned input. Always returned. */
  raw: string;
  /** Which historical format the input matches. */
  format?: "twid" | "legacy";
  /** Stable i18n-safe reason when invalid. */
  reason?: "empty" | "length" | "format" | "checksum";
}

function clean(input: string): string {
  return (input ?? "").replace(/[\s\-_]/g, "").toUpperCase();
}

export function validateDrivingLicense(
  input: string
): DrivingLicenseValidationResult {
  const raw = clean(input);

  if (raw.length === 0) {
    return { valid: false, raw, reason: "empty" };
  }

  // Modern TWID-form: 1 letter + 9 digits, with full checksum
  if (/^[A-Z]\d{9}$/.test(raw)) {
    const t = validateTWID(raw);
    if (t.valid) {
      return { valid: true, raw, format: "twid" };
    }
    return { valid: false, raw, format: "twid", reason: "checksum" };
  }

  // Legacy serial format: 6–8 digits, no checksum
  if (/^\d{6,8}$/.test(raw)) {
    return { valid: true, raw, format: "legacy" };
  }

  // Anything else — wrong shape entirely
  if (raw.length < 6 || raw.length > 10) {
    return { valid: false, raw, reason: "length" };
  }

  return { valid: false, raw, reason: "format" };
}

/**
 * Taiwan phone number (台灣電話號碼) validator/formatter.
 *
 * Specs:
 * - 行動電話 (mobile): 09XX-XXX-XXX (10 digits, prefixes 09).
 * - 市內電話 (landline): area code + local number.
 *   - 2-digit codes (02, 03, 04, 05, 06, 07, 08, 089, 082): 7–8 digit local.
 *   - 3-digit codes (037 苗栗, 049 南投, 089 臺東, 082 金門): 6–7 digit local.
 *   - 4-digit codes (0836 馬祖): 5 digit local.
 * - 國際冠碼 "+886" is normalized to leading "0".
 */

export type PhoneType = "mobile" | "landline" | "unknown";

export interface PhoneValidationResult {
  valid: boolean;
  type: PhoneType;
  /** Digits-only canonical form (always leading 0 for TW). */
  raw: string;
  /** Hyphenated / bracketed display form; empty string for invalid input. */
  formatted: string;
  /** Area code for landlines (e.g. "02", "037"). Omitted for mobile. */
  areaCode?: string;
  reason?: "length" | "format" | "unknown-area-code";
}

export const AREA_CODES: Readonly<Record<string, string>> = Object.freeze({
  "02": "臺北/新北/基隆",
  "03": "桃園/新竹/宜蘭/花蓮",
  "037": "苗栗",
  "04": "臺中/彰化",
  "049": "南投",
  "05": "嘉義/雲林",
  "06": "臺南/澎湖",
  "07": "高雄",
  "08": "屏東",
  "082": "金門",
  "0826": "烏坵",
  "0836": "馬祖",
  "089": "臺東",
});

/** Expected local-number length(s) per area code. Where a range exists we accept either. */
const LANDLINE_LOCAL_LENGTHS: Readonly<Record<string, readonly number[]>> = Object.freeze({
  "02": [8],
  "03": [7, 8],
  "037": [6, 7],
  "04": [7, 8],
  "049": [6, 7],
  "05": [7],
  "06": [6, 7],
  "07": [7, 8],
  "08": [7],
  "082": [6, 7],
  "0826": [5],
  "0836": [5],
  "089": [6, 7],
});

/** Normalize user input: strip non-digits, convert +886… → 0… . */
export function normalizePhone(input: string): string {
  let d = input.replace(/[^\d+]/g, "");
  if (d.startsWith("+886")) d = "0" + d.slice(4);
  else if (d.startsWith("886") && !d.startsWith("0")) d = "0" + d.slice(3);
  return d.replace(/\D/g, "");
}

export function validatePhone(input: string): PhoneValidationResult {
  const raw = normalizePhone(input);

  // Mobile: 09XX-XXX-XXX
  if (/^09\d{8}$/.test(raw)) {
    return {
      valid: true,
      type: "mobile",
      raw,
      formatted: `${raw.slice(0, 4)}-${raw.slice(4, 7)}-${raw.slice(7)}`,
    };
  }

  // Landline: try longest area code first.
  const codes = Object.keys(AREA_CODES).sort((a, b) => b.length - a.length);
  for (const code of codes) {
    if (raw.startsWith(code)) {
      const local = raw.slice(code.length);
      const allowed = LANDLINE_LOCAL_LENGTHS[code];
      if (allowed && allowed.includes(local.length)) {
        const mid = Math.ceil(local.length / 2);
        return {
          valid: true,
          type: "landline",
          raw,
          areaCode: code,
          formatted: `(${code}) ${local.slice(0, mid)}-${local.slice(mid)}`,
        };
      }
      // Matched area code but wrong local length
      return {
        valid: false,
        type: "landline",
        raw,
        formatted: raw,
        areaCode: code,
        reason: "length",
      };
    }
  }

  if (raw.startsWith("09")) {
    return { valid: false, type: "mobile", raw, formatted: raw, reason: "length" };
  }
  if (raw.length === 0) return { valid: false, type: "unknown", raw, formatted: "", reason: "length" };

  return { valid: false, type: "unknown", raw, formatted: raw, reason: "unknown-area-code" };
}

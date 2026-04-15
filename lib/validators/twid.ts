/**
 * Taiwan National ID (身分證字號) + Alien Resident Certificate (統一證號) validator.
 *
 * Official spec sources:
 * - 內政部戶政司 "中華民國國民身分證統一編號編定作業注意事項"
 * - 內政部移民署 "外來人口統一證號" (2021-01 format update, two uppercase letters)
 *
 * Formats accepted:
 *   Citizen (國民身分證):     [A-Z]\d{9}     e.g. A123456789
 *   Old ARC (舊式統一證號):    [A-Z][A-D]\d{8} e.g. AB12345678 (second letter A/B/C/D)
 *   New ARC (2021+ 統一證號):  [A-Z][A-D]\d{8} — same pattern, uppercase-only second letter
 *                              (Prior to 2021-01-02 the 2nd char was a digit; that
 *                              format is still in circulation and also accepted here.)
 *   Legacy ARC (pre-2021):    [A-Z]\d{9}      (digit second char) — same as citizen pattern
 *
 * Algorithm:
 *   1. Map letters A-Z → numeric codes (see LETTER_MAP)
 *   2. For the first letter: split its 2-digit code into (n1, n2); contribute
 *      n1*1 + n2*9 to the weighted sum.
 *   3. For new-ARC (2nd char is letter A-D): contribute its code's units digit * 8.
 *      Then for positions 2..8 contribute digit * (8-i).
 *   4. For citizen: for positions 1..8 contribute digit * (9-i).
 *   5. Add final check digit * 1.
 *   6. Valid iff total mod 10 === 0.
 *
 * Reference: 維基百科「中華民國國民身分證」條目 and 內政部公告 110.01.02.
 */

export type TWIDType = "citizen" | "arc-new" | "arc-legacy" | "invalid";

export interface TWIDValidationResult {
  valid: boolean;
  type: TWIDType;
  region?: string;
  raw: string;
  /** Human-readable reason when invalid. Stable string keys — safe for i18n lookup. */
  reason?:
    | "length"
    | "format"
    | "unknown-letter"
    | "checksum"
    | "invalid-second-letter";
}

/** Letter → 2-digit numeric code per 內政部 official mapping. */
export const LETTER_MAP: Readonly<Record<string, number>> = Object.freeze({
  A: 10, B: 11, C: 12, D: 13, E: 14, F: 15, G: 16, H: 17, I: 34, J: 18,
  K: 19, L: 20, M: 21, N: 22, O: 35, P: 23, Q: 24, R: 25, S: 26, T: 27,
  U: 28, V: 29, W: 32, X: 30, Y: 31, Z: 33,
});

/** Region codes by first letter (historical — reflects household-registration origin). */
export const REGION_MAP: Readonly<Record<string, string>> = Object.freeze({
  A: "臺北市", B: "臺中市", C: "基隆市", D: "臺南市", E: "高雄市",
  F: "新北市", G: "宜蘭縣", H: "桃園市", I: "嘉義市", J: "新竹縣",
  K: "苗栗縣", L: "臺中縣", M: "南投縣", N: "彰化縣", O: "新竹市",
  P: "雲林縣", Q: "嘉義縣", R: "臺南縣", S: "高雄縣", T: "屏東縣",
  U: "花蓮縣", V: "臺東縣", W: "金門縣", X: "澎湖縣", Y: "陽明山",
  Z: "連江縣",
});

/** Second-letter codes valid for new-format ARC (2021+). Per 移民署 bulletin. */
const ARC_SECOND_LETTERS = new Set(["A", "B", "C", "D"]);

export function validateTWID(input: string): TWIDValidationResult {
  const raw = input.toUpperCase();
  if (raw.length !== 10) return { valid: false, type: "invalid", raw, reason: "length" };

  const isCitizen = /^[A-Z]\d{9}$/.test(raw);
  const isNewArc = /^[A-Z][A-Z]\d{8}$/.test(raw);

  if (!isCitizen && !isNewArc) {
    return { valid: false, type: "invalid", raw, reason: "format" };
  }

  const first = raw[0];
  const n = LETTER_MAP[first];
  if (n === undefined) {
    return { valid: false, type: "invalid", raw, reason: "unknown-letter" };
  }

  const n1 = Math.floor(n / 10);
  const n2 = n % 10;
  let total = n1 * 1 + n2 * 9;

  if (isNewArc) {
    const second = raw[1];
    if (!ARC_SECOND_LETTERS.has(second)) {
      return { valid: false, type: "invalid", raw, reason: "invalid-second-letter" };
    }
    const n2nd = LETTER_MAP[second];
    const d1 = n2nd % 10;
    total += d1 * 8;
    for (let i = 2; i < 9; i++) total += parseInt(raw[i], 10) * (8 - i);
    total += parseInt(raw[9], 10) * 1;

    const valid = total % 10 === 0;
    return {
      valid,
      type: valid ? "arc-new" : "invalid",
      region: REGION_MAP[first],
      raw,
      reason: valid ? undefined : "checksum",
    };
  }

  // Citizen format
  for (let i = 1; i < 9; i++) total += parseInt(raw[i], 10) * (9 - i);
  total += parseInt(raw[9], 10) * 1;

  const valid = total % 10 === 0;

  // Legacy ARC had a digit as 2nd char with same pattern as citizen; distinguish
  // only by semantics known externally. We report "citizen" for this shape since
  // the current ID spec treats them identically in checksum terms.
  return {
    valid,
    type: valid ? "citizen" : "invalid",
    region: REGION_MAP[first],
    raw,
    reason: valid ? undefined : "checksum",
  };
}

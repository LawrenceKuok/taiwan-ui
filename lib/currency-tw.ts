/**
 * Taiwan currency formatting + 大寫中文 (capital-form Chinese) number conversion.
 *
 * 大寫中文 numerals are required by Taiwan legal contracts, bank cheques,
 * loan documents, and any 公文 (official document) per 公文程式條例.
 * Format example:  1234567 → 壹佰貳拾參萬肆仟伍佰陸拾柒元整
 *
 * Range supported: 0 to 9,999,999,999,999 (under 10 trillion). Integers only —
 * for cents, multiply input by 100 and append 角分 manually.
 *
 * Pure-function module, fully tested, zero deps.
 */

const CAPITAL_DIGITS = ["零", "壹", "貳", "參", "肆", "伍", "陸", "柒", "捌", "玖"];
/** Position labels within a 4-digit group: ones, tens, hundreds, thousands. */
const POSITION = ["", "拾", "佰", "仟"];
/** Group-of-4 labels: ones-group, 萬-group, 億-group, 兆-group. */
const GROUP = ["", "萬", "億", "兆"];

/**
 * Convert an integer NTD amount to its 大寫中文 form.
 *  - Returns "零元整" for 0.
 *  - Returns the empty string for negative/non-finite/non-integer input.
 *  - Suffix is "元整" by default; pass `{ suffix: "元" }` to omit "整".
 */
export function toCapitalChinese(
  amount: number,
  options: { suffix?: "元整" | "元" | "" } = {}
): string {
  const suffix = options.suffix ?? "元整";
  if (!Number.isFinite(amount) || amount < 0 || !Number.isInteger(amount)) return "";
  if (amount === 0) return "零" + suffix;
  if (amount >= 1e16) return ""; // overflow guard

  // Split into groups of 4 from the right: e.g. 1234567 → [567, 234, 1] → groups [1, 234, 567]
  // We build from highest group down.
  const groups: number[] = [];
  let n = amount;
  while (n > 0) {
    groups.push(n % 10000);
    n = Math.floor(n / 10000);
  }

  let result = "";
  let prevGroupEmpty = false;

  for (let g = groups.length - 1; g >= 0; g--) {
    const groupValue = groups[g]!;
    if (groupValue === 0) {
      // Empty group — track so we can emit a single 零 between non-empty groups
      prevGroupEmpty = true;
      continue;
    }

    if (result) {
      // Insert 零 between groups when (a) a whole intermediate group was zero
      // ("壹億零壹元整") or (b) the current group has zero in its thousands
      // position ("壹萬零壹元整" — the 4-digit group 0001 has leading zeros).
      if (prevGroupEmpty || groupValue < 1000) result += "零";
    }
    prevGroupEmpty = false;

    result += convertGroup(groupValue) + GROUP[g];
  }

  return result + suffix;
}

/** Convert a 0–9999 group to 大寫中文, with internal zeros collapsed to a single 零. */
function convertGroup(group: number): string {
  if (group === 0) return "";
  const digits = [
    Math.floor(group / 1000) % 10,
    Math.floor(group / 100) % 10,
    Math.floor(group / 10) % 10,
    group % 10,
  ];

  let out = "";
  let zeroPending = false;
  for (let i = 0; i < 4; i++) {
    const d = digits[i]!;
    const pos = 3 - i;
    if (d === 0) {
      // Defer the zero — only emit if a non-zero digit follows.
      zeroPending = out !== "";
      continue;
    }
    if (zeroPending) {
      out += "零";
      zeroPending = false;
    }
    out += CAPITAL_DIGITS[d] + POSITION[pos];
  }
  return out;
}

/**
 * Format an integer amount as a Taiwan-style currency display.
 *   formatNTD(1234567) === "NT$ 1,234,567"
 */
export function formatNTD(amount: number, options: { symbol?: string } = {}): string {
  if (!Number.isFinite(amount)) return "";
  const sym = options.symbol ?? "NT$";
  const abs = Math.abs(Math.round(amount));
  const grouped = abs.toLocaleString("en-US");
  return `${sym} ${amount < 0 ? "-" : ""}${grouped}`;
}

/** Strip a formatted/comma-separated string back to a numeric value. Returns NaN on failure. */
export function parseNTD(input: string): number {
  if (!input) return NaN;
  const cleaned = input.replace(/[^\d-]/g, "");
  if (!cleaned || cleaned === "-") return NaN;
  return Number(cleaned);
}

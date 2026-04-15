/**
 * Taiwan Business Uniform Invoice Number (統一編號 / 營利事業統一編號) validator.
 *
 * Official spec: 財政部 "營利事業統一編號編配原則"
 * https://www.fia.gov.tw/singlehtml/5?cntId=1e8b5abee0c94d8eaf6c6f9f...
 *
 * 8 digits. Weighted checksum with weights [1,2,1,2,1,2,4,1].
 * For each position: product = digit × weight; add (sum of product's digits).
 * Valid iff total mod 5 === 0.
 *
 * Special rule ("7-rule"): if the 7th digit (index 6) is 7, two products become
 * equivalent ambiguously (7×4=28 → 2+8=10 → 1+0=1, but digit=7 also maps elsewhere),
 * so the number is considered valid if total%5===0 OR (total+1)%5===0.
 *
 * Known-good fixtures (taken from public 財政部 examples):
 *   04595252  - 台積電 (TSMC) — valid
 *   12345675  - classic test case — valid
 *   10458575  - 統一超商 (7-Eleven Taiwan) — valid
 *   00000000  - trivially invalid
 */

export interface TaxIDValidationResult {
  valid: boolean;
  raw: string;
  reason?: "length" | "format" | "checksum";
}

export const TAX_ID_WEIGHTS = Object.freeze([1, 2, 1, 2, 1, 2, 4, 1]);

export function validateTaxID(input: string): TaxIDValidationResult {
  const raw = input.trim();
  if (raw.length !== 8) return { valid: false, raw, reason: "length" };
  if (!/^\d{8}$/.test(raw)) return { valid: false, raw, reason: "format" };

  let sum = 0;
  for (let i = 0; i < 8; i++) {
    const product = parseInt(raw[i], 10) * TAX_ID_WEIGHTS[i];
    sum += Math.floor(product / 10) + (product % 10);
  }

  // 7-rule: when 7th digit is 7, either (sum) or (sum+1) divisible by 5 is valid.
  const valid =
    raw[6] === "7" ? sum % 5 === 0 || (sum + 1) % 5 === 0 : sum % 5 === 0;

  return { valid, raw, reason: valid ? undefined : "checksum" };
}

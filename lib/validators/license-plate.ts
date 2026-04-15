/**
 * Taiwan vehicle license plate (車牌) validator.
 *
 * Spec: 交通部公路總局 "汽車牌照號碼編發規則"
 *
 * Supported formats:
 *
 *   Cars / small trucks
 *   -------------------
 *   Current (2012+):     AAA-0000  (e.g. ABC-1234)          → "car-new"
 *   Current variant:     0000-AA   (e.g. 1234-AB)           → "car-new"
 *   Legacy:              AA-0000   (e.g. AB-1234)           → "car-old"
 *   Legacy:              0000-AA   (older style)            → "car-old"
 *   Taxi (黃牌):          AAA-0000 / same patterns          → "car-new" (color not encoded in number)
 *
 *   Motorcycles
 *   -----------
 *   Heavy (大型重機):     AAA-0000  (white-on-red plate)     → "motorcycle-heavy"
 *   Light+ (普通重機):    ABC-123 or ABC-1234               → "motorcycle"
 *   Light (輕型/50cc):    AAA-0000 or similar               → "motorcycle"
 *
 *   Electric vehicles (2014+ green-bordered):
 *                        RAA-0000 / RBA-0000 etc. — "R" prefix by convention.
 *                        Treated as "car-new" (format identical).
 *
 *   Government / diplomatic plates are issued under separate spec and
 *   explicitly NOT handled here (caller should detect and allow-list).
 *
 * The validator is purely a format check; it does NOT verify the plate is
 * actually issued, active, or corresponds to a real vehicle.
 */

export type PlateType =
  | "car-new"
  | "car-old"
  | "motorcycle"
  | "motorcycle-heavy"
  | "unknown";

export type PlateVehicleHint = "car" | "motorcycle" | "auto";

export interface PlateValidationResult {
  valid: boolean;
  type: PlateType;
  /** Hyphenated display form, empty when input is too short. */
  formatted: string;
  /** Alphanumeric-only (uppercased) canonical form. */
  raw: string;
}

function stripToAlnum(input: string): string {
  return input.toUpperCase().replace(/[^A-Z0-9]/g, "");
}

function carMatch(raw: string): PlateValidationResult | null {
  // New 3+4
  if (/^[A-Z]{3}\d{4}$/.test(raw)) {
    return { valid: true, type: "car-new", formatted: `${raw.slice(0, 3)}-${raw.slice(3)}`, raw };
  }
  // New variant 4+2
  if (/^\d{4}[A-Z]{2}$/.test(raw)) {
    return { valid: true, type: "car-new", formatted: `${raw.slice(0, 4)}-${raw.slice(4)}`, raw };
  }
  // Legacy 2+4
  if (/^[A-Z]{2}\d{4}$/.test(raw)) {
    return { valid: true, type: "car-old", formatted: `${raw.slice(0, 2)}-${raw.slice(2)}`, raw };
  }
  // Legacy 1 letter + 5 digits (very old)
  if (/^[A-Z]\d{5}$/.test(raw)) {
    return { valid: true, type: "car-old", formatted: `${raw.slice(0, 2)}-${raw.slice(2)}`, raw };
  }
  return null;
}

function motoMatch(raw: string): PlateValidationResult | null {
  // Heavy motorcycle: AAA-0000 (red plate)
  if (/^[A-Z]{3}\d{4}$/.test(raw)) {
    return { valid: true, type: "motorcycle-heavy", formatted: `${raw.slice(0, 3)}-${raw.slice(3)}`, raw };
  }
  // Motorcycle ABC-123
  if (/^[A-Z]{3}\d{3}$/.test(raw)) {
    return { valid: true, type: "motorcycle", formatted: `${raw.slice(0, 3)}-${raw.slice(3)}`, raw };
  }
  // Legacy motorcycle AA-000
  if (/^[A-Z]{2}\d{3}$/.test(raw)) {
    return { valid: true, type: "motorcycle", formatted: `${raw.slice(0, 2)}-${raw.slice(2)}`, raw };
  }
  // Legacy 000-AA
  if (/^\d{3}[A-Z]{2}$/.test(raw)) {
    return { valid: true, type: "motorcycle", formatted: `${raw.slice(0, 3)}-${raw.slice(3)}`, raw };
  }
  return null;
}

export function validatePlate(
  input: string,
  hint: PlateVehicleHint = "auto"
): PlateValidationResult {
  const raw = stripToAlnum(input);

  if (hint === "car") return carMatch(raw) ?? { valid: false, type: "unknown", formatted: raw, raw };
  if (hint === "motorcycle") return motoMatch(raw) ?? { valid: false, type: "unknown", formatted: raw, raw };

  // Auto-detect: cars first (more common), then motorcycles.
  // 7-char alphanumeric is ambiguous between car-new and motorcycle-heavy:
  // when AAA\d{4}, classify as car-new by default (more frequent). Callers
  // needing heavy-moto should pass hint="motorcycle".
  return carMatch(raw) ?? motoMatch(raw) ?? { valid: false, type: "unknown", formatted: raw, raw };
}

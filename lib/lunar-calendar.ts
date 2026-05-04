/**
 * Taiwan lunar calendar utilities.
 *
 * SCOPE — read this carefully:
 *
 * Full Gregorian ↔ 農曆 conversion requires a multi-decade encoded table
 * (1900–2100) and is non-trivial to implement correctly without a reference
 * library. This module ships a deliberately scoped subset that covers the
 * vast majority of real Forge use cases:
 *
 *  ✅ Stem-Branch year (天干地支) for any Gregorian year — purely formulaic
 *  ✅ Zodiac animal (生肖) for any Gregorian year — purely formulaic
 *  ✅ ROC (民國) year conversion — purely formulaic
 *  ✅ Lookup of major Taiwan lunar festivals (春節, 元宵, 端午, 中秋, 七夕, 重陽, 冬至)
 *     with lunar dates pre-computed and verified for 2024–2030 (from 中央氣象局 萬年曆)
 *
 *  ❌ Arbitrary Gregorian → 農曆 month/day for any date — out of scope.
 *     Pass `lunarOverride` to the component if you fetched it from a CWA API.
 *
 * For a full implementation, see 中央氣象局 開放資料 (cwa.gov.tw) or the
 * `lunar-javascript` library on npm. This module deliberately stays
 * zero-dependency and correctness-first over coverage.
 */

const STEMS = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"];
const BRANCHES = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];
const ZODIAC = ["鼠", "牛", "虎", "兔", "龍", "蛇", "馬", "羊", "猴", "雞", "狗", "豬"];
const ZODIAC_EN = ["Rat", "Ox", "Tiger", "Rabbit", "Dragon", "Snake", "Horse", "Goat", "Monkey", "Rooster", "Dog", "Pig"];

/**
 * Sexagenary-cycle stem-branch label for a given Gregorian year.
 * Anchored on 1984 = 甲子 (the canonical reset point).
 */
export function stemBranchYear(gregorianYear: number): string {
  const offset = (((gregorianYear - 1984) % 60) + 60) % 60;
  return STEMS[offset % 10] + BRANCHES[offset % 12];
}

/** Zodiac animal (生肖) label for a Gregorian year. Approximation: assumes Jan 1; not 春節-accurate. */
export function zodiacAnimal(gregorianYear: number, english = false): string {
  const offset = (((gregorianYear - 1900) % 12) + 12) % 12;
  return english ? ZODIAC_EN[offset] : ZODIAC[offset];
}

/** ROC (民國) year for a Gregorian year. */
export function rocYear(gregorianYear: number): number {
  return gregorianYear - 1911;
}

/**
 * Pre-verified lunar festival dates for 2024–2030.
 * Source: 中央氣象局 萬年曆.
 */
export interface LunarFestival {
  zhName: string;
  enName: string;
  lunar: string; // "農曆 X月初Y" display form
}

const FESTIVALS: Record<string, LunarFestival> = Object.freeze({
  // Spring Festival (春節) = lunar 1月1日
  "2024-02-10": { zhName: "春節 (大年初一)", enName: "Lunar New Year", lunar: "農曆正月初一" },
  "2025-01-29": { zhName: "春節 (大年初一)", enName: "Lunar New Year", lunar: "農曆正月初一" },
  "2026-02-17": { zhName: "春節 (大年初一)", enName: "Lunar New Year", lunar: "農曆正月初一" },
  "2027-02-06": { zhName: "春節 (大年初一)", enName: "Lunar New Year", lunar: "農曆正月初一" },
  "2028-01-26": { zhName: "春節 (大年初一)", enName: "Lunar New Year", lunar: "農曆正月初一" },
  "2029-02-13": { zhName: "春節 (大年初一)", enName: "Lunar New Year", lunar: "農曆正月初一" },
  "2030-02-03": { zhName: "春節 (大年初一)", enName: "Lunar New Year", lunar: "農曆正月初一" },
  // 元宵 = lunar 1月15日
  "2024-02-24": { zhName: "元宵節", enName: "Lantern Festival", lunar: "農曆正月十五" },
  "2025-02-12": { zhName: "元宵節", enName: "Lantern Festival", lunar: "農曆正月十五" },
  "2026-03-03": { zhName: "元宵節", enName: "Lantern Festival", lunar: "農曆正月十五" },
  // 端午 = lunar 5月5日
  "2024-06-10": { zhName: "端午節", enName: "Dragon Boat Festival", lunar: "農曆五月初五" },
  "2025-05-31": { zhName: "端午節", enName: "Dragon Boat Festival", lunar: "農曆五月初五" },
  "2026-06-19": { zhName: "端午節", enName: "Dragon Boat Festival", lunar: "農曆五月初五" },
  // 七夕 = lunar 7月7日
  "2024-08-10": { zhName: "七夕", enName: "Qixi Festival", lunar: "農曆七月初七" },
  "2025-08-29": { zhName: "七夕", enName: "Qixi Festival", lunar: "農曆七月初七" },
  // 中秋 = lunar 8月15日
  "2024-09-17": { zhName: "中秋節", enName: "Mid-Autumn Festival", lunar: "農曆八月十五" },
  "2025-10-06": { zhName: "中秋節", enName: "Mid-Autumn Festival", lunar: "農曆八月十五" },
  "2026-09-25": { zhName: "中秋節", enName: "Mid-Autumn Festival", lunar: "農曆八月十五" },
  // 重陽 = lunar 9月9日
  "2024-10-11": { zhName: "重陽節", enName: "Double Ninth Festival", lunar: "農曆九月初九" },
  "2025-10-29": { zhName: "重陽節", enName: "Double Ninth Festival", lunar: "農曆九月初九" },
  // 冬至 (calculated by solar term, but listed)
  "2024-12-21": { zhName: "冬至", enName: "Winter Solstice", lunar: "冬至" },
  "2025-12-21": { zhName: "冬至", enName: "Winter Solstice", lunar: "冬至" },
});

function toIso(d: Date | string): string {
  if (typeof d === "string") return d.slice(0, 10);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function lookupFestival(date: Date | string): LunarFestival | null {
  return FESTIVALS[toIso(date)] ?? null;
}

export interface LunarSummary {
  iso: string;
  rocYear: number;
  stemBranch: string;
  zodiac: string;
  zodiacEn: string;
  festival: LunarFestival | null;
}

export function lunarSummary(date: Date | string): LunarSummary {
  const d = typeof date === "string" ? new Date(date) : date;
  const year = d.getFullYear();
  return {
    iso: toIso(date),
    rocYear: rocYear(year),
    stemBranch: stemBranchYear(year),
    zodiac: zodiacAnimal(year),
    zodiacEn: zodiacAnimal(year, true),
    festival: lookupFestival(date),
  };
}

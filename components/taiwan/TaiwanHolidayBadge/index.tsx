"use client";

import HOLIDAYS from "@/data/taiwan-holidays.json";

/**
 * Taiwan public-holiday badge.
 *
 * Looks up a date against the official 行政院人事行政總處 (DGPA) holiday
 * calendar and renders a typed pill if the date is a recognised holiday.
 * Quietly returns null otherwise — safe to drop into any UI.
 *
 * Data covers 2025–2026; refresh `data/taiwan-holidays.json` annually.
 */

type HolidayType = "national" | "lunar" | "adjusted";

interface HolidayEntry {
  name: string;
  enName: string;
  type: HolidayType;
}

type HolidayMap = Record<string, HolidayEntry | string>;
const TABLE = HOLIDAYS as unknown as HolidayMap;

const TYPE_STYLES: Record<HolidayType, { bg: string; fg: string; ring: string }> = {
  national: { bg: "bg-red-500/15", fg: "text-red-500 dark:text-red-400", ring: "ring-red-500/30" },
  lunar:    { bg: "bg-amber-500/15", fg: "text-amber-600 dark:text-amber-400", ring: "ring-amber-500/30" },
  adjusted: { bg: "bg-blue-500/15", fg: "text-blue-600 dark:text-blue-400", ring: "ring-blue-500/30" },
};

function toIsoKey(input: Date | string): string {
  if (input instanceof Date) {
    const y = input.getFullYear();
    const m = String(input.getMonth() + 1).padStart(2, "0");
    const d = String(input.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  }
  // Already an ISO yyyy-mm-dd
  return input.slice(0, 10);
}

export function getHoliday(date: Date | string): HolidayEntry | null {
  const key = toIsoKey(date);
  const entry = TABLE[key];
  if (!entry || typeof entry === "string") return null; // skip _source key
  return entry;
}

export interface TaiwanHolidayBadgeProps {
  /** ISO-8601 date string (YYYY-MM-DD) or a Date object. */
  date: Date | string;
  /** Use English name. */
  english?: boolean;
  /** Tone size. */
  size?: "sm" | "md";
  /** What to show when not a holiday. Default: render nothing. */
  fallback?: React.ReactNode;
}

export default function TaiwanHolidayBadge({
  date,
  english = false,
  size = "md",
  fallback = null,
}: TaiwanHolidayBadgeProps) {
  const holiday = getHoliday(date);
  if (!holiday) return <>{fallback}</>;

  const styles = TYPE_STYLES[holiday.type];
  const sizeClass = size === "sm" ? "text-[10px] px-1.5 py-0.5" : "text-xs px-2 py-1";
  const label = english ? holiday.enName : holiday.name;

  return (
    <span
      role="status"
      aria-label={`${label} (${holiday.type})`}
      className={`inline-flex items-center gap-1 rounded-full font-medium ring-1 ${styles.bg} ${styles.fg} ${styles.ring} ${sizeClass}`}
    >
      <span aria-hidden="true" className="text-[8px]">●</span>
      {label}
    </span>
  );
}

export { HOLIDAYS };

"use client";

import { useMemo } from "react";
import { lunarSummary, type LunarFestival } from "@/lib/lunar-calendar";

/**
 * ROC + lunar calendar summary card.
 *
 * Shows for any Gregorian date:
 *  - 國曆 (Gregorian)
 *  - 民國 year
 *  - 天干地支 (sexagenary cycle)
 *  - 生肖 (zodiac)
 *  - Festival name if it falls on a recognised lunar festival (2024–2030)
 *
 * Full lunar month/day for arbitrary dates is out of scope (see lib/lunar-calendar.ts).
 * Pass `lunarOverride` if you fetched the lunar date from a CWA API.
 */

export interface ROCLunarCalendarProps {
  /** Date to display. Accepts a Date or ISO yyyy-mm-dd string. */
  date: Date | string;
  /** Optional pre-computed lunar string (e.g., "農曆十月初八") for non-festival days. */
  lunarOverride?: string;
  /** English labels alongside 中文. */
  bilingual?: boolean;
  /** Compact one-line variant. */
  compact?: boolean;
  /** Festival lookup callback override (e.g., to plug a server lookup). */
  festivalOverride?: LunarFestival | null;
}

const WEEKDAY_ZH = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
const WEEKDAY_EN = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function formatGregorian(d: Date, bilingual: boolean): string {
  const y = d.getFullYear();
  const m = d.getMonth() + 1;
  const day = d.getDate();
  const wd = bilingual ? WEEKDAY_EN[d.getDay()] : WEEKDAY_ZH[d.getDay()];
  return `${y}年${m}月${day}日 ${wd}`;
}

export default function ROCLunarCalendar({
  date,
  lunarOverride,
  bilingual = false,
  compact = false,
  festivalOverride,
}: ROCLunarCalendarProps) {
  const d = useMemo(() => (typeof date === "string" ? new Date(date) : date), [date]);
  const summary = useMemo(() => lunarSummary(date), [date]);
  const festival = festivalOverride ?? summary.festival;

  if (compact) {
    return (
      <div className="inline-flex items-baseline gap-2 text-sm font-mono">
        <span className="text-[var(--foreground)]">民國 {summary.rocYear}年</span>
        <span className="text-[var(--muted)]">·</span>
        <span className="text-[var(--muted)]">
          {summary.stemBranch}年 {summary.zodiac}
        </span>
        {festival && (
          <span className="text-[var(--muted)]">
            · <span className="text-amber-500 font-semibold">{festival.zhName}</span>
          </span>
        )}
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] p-5 max-w-md">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-[10px] uppercase tracking-wider text-[var(--muted)] font-semibold mb-1">
            {bilingual ? "Gregorian · 國曆" : "國曆"}
          </p>
          <p className="text-lg font-bold text-[var(--foreground)]">{formatGregorian(d, false)}</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] uppercase tracking-wider text-[var(--muted)] font-semibold mb-1">民國</p>
          <p className="text-2xl font-bold font-serif text-blue-500">{summary.rocYear}</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="rounded-lg bg-[var(--surface)] p-3 text-center">
          <p className="text-[10px] uppercase tracking-wider text-[var(--muted)] font-semibold mb-1">天干地支</p>
          <p className="text-lg font-bold font-serif text-[var(--foreground)]">{summary.stemBranch}</p>
        </div>
        <div className="rounded-lg bg-[var(--surface)] p-3 text-center">
          <p className="text-[10px] uppercase tracking-wider text-[var(--muted)] font-semibold mb-1">
            {bilingual ? "Zodiac" : "生肖"}
          </p>
          <p className="text-lg font-bold font-serif text-[var(--foreground)]">
            {summary.zodiac}
            {bilingual && <span className="ml-1 text-xs text-[var(--muted)]">{summary.zodiacEn}</span>}
          </p>
        </div>
        <div className="rounded-lg bg-[var(--surface)] p-3 text-center">
          <p className="text-[10px] uppercase tracking-wider text-[var(--muted)] font-semibold mb-1">
            {bilingual ? "Year" : "西元"}
          </p>
          <p className="text-lg font-bold font-serif text-[var(--foreground)]">{d.getFullYear()}</p>
        </div>
      </div>

      {(festival || lunarOverride) && (
        <div className="rounded-lg bg-amber-500/10 border border-amber-500/30 p-3">
          <p className="text-[10px] uppercase tracking-wider text-amber-600 dark:text-amber-400 font-semibold mb-0.5">
            {bilingual ? "Lunar · 農曆" : "農曆"}
          </p>
          {festival && (
            <p className="text-sm font-bold text-amber-700 dark:text-amber-300">
              {festival.zhName}
              {bilingual && <span className="ml-2 font-normal text-xs">{festival.enName}</span>}
            </p>
          )}
          <p className="text-xs text-amber-700 dark:text-amber-400 mt-0.5">
            {lunarOverride ?? festival?.lunar}
          </p>
        </div>
      )}
    </div>
  );
}

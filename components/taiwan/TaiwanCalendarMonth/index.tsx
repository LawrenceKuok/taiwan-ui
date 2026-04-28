"use client";

import { useCallback, useMemo, useState } from "react";
import TaiwanHolidayBadge, { getHoliday } from "@/components/taiwan/TaiwanHolidayBadge";

/**
 * Full-month calendar grid for Taiwan UIs.
 *
 * Renders 6 weeks × 7 days for any month with:
 *  - ROC year header (民國 X 年 X 月)
 *  - Weekday headers (週日 ~ 週六)
 *  - Weekend tinting
 *  - Holiday badges via TaiwanHolidayBadge
 *  - Click-to-select cell with onSelect callback
 *  - Keyboard navigation (arrows, enter)
 */

export interface TaiwanCalendarMonthProps {
  /** Year (Gregorian). */
  year: number;
  /** Month (0-indexed: 0 = January). */
  month: number;
  /** Selected date (must be within the rendered month or null). */
  value?: Date | null;
  /** Called when a date cell is clicked. */
  onSelect?: (date: Date) => void;
  /** Called when user navigates to a different month (e.g., via prev/next buttons). */
  onMonthChange?: (year: number, month: number) => void;
  /** Show prev/next month navigation buttons. */
  showNav?: boolean;
  /** English weekday headers. */
  english?: boolean;
}

const WEEKDAYS_ZH = ["日", "一", "二", "三", "四", "五", "六"];
const WEEKDAYS_EN = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function isSameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function toIso(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export default function TaiwanCalendarMonth({
  year,
  month,
  value,
  onSelect,
  onMonthChange,
  showNav = true,
  english = false,
}: TaiwanCalendarMonthProps) {
  const today = useMemo(() => new Date(), []);
  const [focusedDay, setFocusedDay] = useState<number | null>(null);

  const cells = useMemo(() => {
    const firstOfMonth = new Date(year, month, 1);
    const startWeekday = firstOfMonth.getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const grid: (Date | null)[] = [];
    for (let i = 0; i < startWeekday; i++) grid.push(null);
    for (let d = 1; d <= daysInMonth; d++) grid.push(new Date(year, month, d));
    while (grid.length < 42) grid.push(null);
    return grid;
  }, [year, month]);

  const navigate = useCallback(
    (delta: number) => {
      const newDate = new Date(year, month + delta, 1);
      onMonthChange?.(newDate.getFullYear(), newDate.getMonth());
    },
    [year, month, onMonthChange]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent, d: Date) => {
      const day = d.getDate();
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      let next: number | null = null;
      if (e.key === "ArrowRight") next = Math.min(daysInMonth, day + 1);
      else if (e.key === "ArrowLeft") next = Math.max(1, day - 1);
      else if (e.key === "ArrowDown") next = Math.min(daysInMonth, day + 7);
      else if (e.key === "ArrowUp") next = Math.max(1, day - 7);
      else if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onSelect?.(d);
        return;
      }
      if (next != null) {
        e.preventDefault();
        setFocusedDay(next);
      }
    },
    [year, month, onSelect]
  );

  const rocYear = year - 1911;
  const monthLabel = english
    ? new Date(year, month, 1).toLocaleString("en-US", { month: "long" })
    : `${month + 1} 月`;

  return (
    <div className="rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] p-3 max-w-md inline-block">
      <div className="flex items-center justify-between mb-2 px-1">
        <div>
          <p className="text-xs text-[var(--muted)] font-semibold uppercase tracking-wider">
            民國 {rocYear} 年 · {year}
          </p>
          <p className="text-lg font-bold font-serif text-[var(--foreground)]">{monthLabel}</p>
        </div>
        {showNav && (
          <div className="flex gap-1">
            <button
              type="button"
              aria-label="Previous month"
              onClick={() => navigate(-1)}
              className="w-7 h-7 rounded-md hover:bg-[var(--surface)] text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
            >
              ‹
            </button>
            <button
              type="button"
              aria-label="Next month"
              onClick={() => navigate(1)}
              className="w-7 h-7 rounded-md hover:bg-[var(--surface)] text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
            >
              ›
            </button>
          </div>
        )}
      </div>

      <div role="grid" aria-label={`${rocYear}/${month + 1} calendar`} className="grid grid-cols-7 gap-px">
        {(english ? WEEKDAYS_EN : WEEKDAYS_ZH).map((wd, i) => (
          <div
            key={wd}
            className={`text-center text-[10px] font-semibold uppercase tracking-wider py-1.5 ${
              i === 0 || i === 6 ? "text-red-500/70" : "text-[var(--muted)]"
            }`}
            role="columnheader"
          >
            {wd}
          </div>
        ))}

        {cells.map((d, i) => {
          if (!d) return <div key={`empty-${i}`} className="aspect-square" />;
          const wd = d.getDay();
          const isWeekend = wd === 0 || wd === 6;
          const isToday = isSameDay(d, today);
          const isSelected = value ? isSameDay(d, value) : false;
          const holiday = getHoliday(d);
          return (
            <button
              key={toIso(d)}
              type="button"
              role="gridcell"
              aria-selected={isSelected}
              tabIndex={focusedDay === d.getDate() || (focusedDay == null && d.getDate() === 1) ? 0 : -1}
              onClick={() => onSelect?.(d)}
              onKeyDown={(e) => handleKeyDown(e, d)}
              className={`aspect-square flex flex-col items-stretch justify-between p-1 rounded-md text-left transition-colors
                ${isSelected ? "bg-blue-500 text-white" : isWeekend || holiday ? "bg-red-500/5" : "hover:bg-[var(--surface)]"}
                ${isToday && !isSelected ? "ring-2 ring-blue-500/40" : ""}
              `}
            >
              <span
                className={`text-xs font-semibold ${
                  isSelected ? "text-white" : holiday ? "text-red-500" : isWeekend ? "text-red-500/70" : "text-[var(--foreground)]"
                }`}
              >
                {d.getDate()}
              </span>
              {holiday && (
                <TaiwanHolidayBadge date={d} size="sm" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

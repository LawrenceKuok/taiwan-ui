"use client";

import { useCallback, useMemo } from "react";
import ROCDatePicker, { type ROCDate } from "@/components/taiwan/ROCDatePicker";

/**
 * ROC (民國) date range picker — two ROCDatePickers wired together with
 * cross-field validation: the end date is constrained to be ≥ start date.
 *
 * Composed entirely from the existing ROCDatePicker — no new calendar logic.
 */

export interface ROCDateRange {
  start: ROCDate | null;
  end: ROCDate | null;
}

export interface ROCDateRangePickerProps {
  value: ROCDateRange;
  onChange: (range: ROCDateRange) => void;
  /** Optional outer min/max constraints applied to both pickers. */
  minDate?: Date;
  maxDate?: Date;
  startPlaceholder?: string;
  endPlaceholder?: string;
  disabled?: boolean;
  showGregorianSub?: boolean;
  /** Custom separator between the two pickers. */
  separator?: React.ReactNode;
}

function rocToDate(d: ROCDate | null): Date | undefined {
  if (!d) return undefined;
  return new Date(d.year, d.month, d.day);
}

function dayCount(range: ROCDateRange): number | null {
  if (!range.start || !range.end) return null;
  const start = new Date(range.start.year, range.start.month, range.start.day);
  const end = new Date(range.end.year, range.end.month, range.end.day);
  const ms = end.getTime() - start.getTime();
  if (ms < 0) return null;
  return Math.round(ms / 86_400_000) + 1; // inclusive of both endpoints
}

export default function ROCDateRangePicker({
  value,
  onChange,
  minDate,
  maxDate,
  startPlaceholder = "起始日期",
  endPlaceholder = "結束日期",
  disabled = false,
  showGregorianSub = true,
  separator = "→",
}: ROCDateRangePickerProps) {
  const handleStart = useCallback(
    (start: ROCDate | null) => {
      // If new start is after current end, clear end to avoid an invalid range.
      if (start && value.end) {
        const s = new Date(start.year, start.month, start.day);
        const e = new Date(value.end.year, value.end.month, value.end.day);
        if (s > e) {
          onChange({ start, end: null });
          return;
        }
      }
      onChange({ ...value, start });
    },
    [onChange, value]
  );

  const handleEnd = useCallback(
    (end: ROCDate | null) => {
      onChange({ ...value, end });
    },
    [onChange, value]
  );

  // End picker's effective minimum is max(outer minDate, current start)
  const endMin = useMemo(() => {
    const fromStart = rocToDate(value.start);
    if (fromStart && minDate) return fromStart > minDate ? fromStart : minDate;
    return fromStart ?? minDate;
  }, [value.start, minDate]);

  const days = dayCount(value);

  return (
    <div className="w-full">
      <div className="flex items-center gap-2">
        <div className="flex-1">
          <ROCDatePicker
            value={value.start}
            onChange={handleStart}
            placeholder={startPlaceholder}
            minDate={minDate}
            maxDate={maxDate}
            disabled={disabled}
            showGregorianSub={showGregorianSub}
          />
        </div>
        <span aria-hidden="true" className="text-[var(--muted)] text-sm font-bold px-1">
          {separator}
        </span>
        <div className="flex-1">
          <ROCDatePicker
            value={value.end}
            onChange={handleEnd}
            placeholder={endPlaceholder}
            minDate={endMin}
            maxDate={maxDate}
            disabled={disabled || !value.start}
            showGregorianSub={showGregorianSub}
          />
        </div>
      </div>
      {days != null && (
        <p
          className="mt-1.5 text-xs text-[var(--muted)] tracking-wide"
          aria-live="polite"
        >
          共 <span className="font-bold text-blue-500">{days.toLocaleString()}</span> 天
        </p>
      )}
    </div>
  );
}

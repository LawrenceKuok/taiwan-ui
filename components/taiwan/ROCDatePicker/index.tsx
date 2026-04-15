"use client";

import { useState, useRef, useEffect, useCallback } from "react";

export interface ROCDate {
  year: number;
  month: number;
  day: number;
}

export interface ROCDatePickerProps {
  value: ROCDate | null;
  onChange: (date: ROCDate | null) => void;
  placeholder?: string;
  minDate?: Date;
  maxDate?: Date;
  disabled?: boolean;
  showGregorianSub?: boolean;
}

function toROCYear(gregorian: number) {
  return gregorian - 1911;
}

function daysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function isDateDisabled(
  date: Date,
  minDate?: Date,
  maxDate?: Date
): boolean {
  if (minDate) {
    const min = new Date(minDate.getFullYear(), minDate.getMonth(), minDate.getDate());
    if (date < min) return true;
  }
  if (maxDate) {
    const max = new Date(maxDate.getFullYear(), maxDate.getMonth(), maxDate.getDate());
    if (date > max) return true;
  }
  return false;
}

const WEEKDAYS = ["日", "一", "二", "三", "四", "五", "六"];

export default function ROCDatePicker({
  value,
  onChange,
  placeholder = "請選擇日期",
  minDate,
  maxDate,
  disabled = false,
  showGregorianSub = true,
}: ROCDatePickerProps) {
  const today = new Date();
  const [open, setOpen] = useState(false);
  const [viewYear, setViewYear] = useState(value?.year ?? today.getFullYear());
  const [viewMonth, setViewMonth] = useState(value?.month ?? today.getMonth());
  const [showYearMonth, setShowYearMonth] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setShowYearMonth(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleSelect = useCallback(
    (day: number) => {
      onChange({ year: viewYear, month: viewMonth, day });
      setOpen(false);
      setShowYearMonth(false);
    },
    [onChange, viewYear, viewMonth]
  );

  const firstDayOfWeek = new Date(viewYear, viewMonth, 1).getDay();
  const totalDays = daysInMonth(viewYear, viewMonth);

  const rocYear = toROCYear(viewYear);

  const displayText = value
    ? `民國 ${toROCYear(value.year)} 年 ${value.month + 1} 月 ${value.day} 日`
    : placeholder;

  const subText =
    value && showGregorianSub
      ? `${value.year}/${String(value.month + 1).padStart(2, "0")}/${String(value.day).padStart(2, "0")}`
      : null;

  const yearOptions: number[] = [];
  const startY = minDate ? minDate.getFullYear() : today.getFullYear() - 100;
  const endY = maxDate ? maxDate.getFullYear() : today.getFullYear() + 10;
  for (let y = startY; y <= endY; y++) yearOptions.push(y);

  return (
    <div ref={ref} className="relative inline-block w-full">
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setOpen(!open)}
        className={`w-full text-left px-3 py-2 border rounded-lg transition-colors
          ${disabled ? "opacity-50 cursor-not-allowed bg-gray-100 dark:bg-gray-800" : "bg-[var(--input-bg)] border-[var(--input-border)] hover:border-blue-400 cursor-pointer"}
        `}
      >
        <span className={value ? "text-[var(--foreground)]" : "text-[var(--muted)]"}>
          {displayText}
        </span>
        {subText && (
          <span className="block text-xs text-[var(--muted)] mt-0.5">{subText}</span>
        )}
      </button>

      {open && (
        <div className="absolute z-50 mt-1 w-80 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg shadow-lg p-3">
          {/* Header */}
          <div className="flex items-center justify-between mb-2">
            <button
              type="button"
              onClick={() => {
                if (viewMonth === 0) {
                  setViewMonth(11);
                  setViewYear(viewYear - 1);
                } else {
                  setViewMonth(viewMonth - 1);
                }
              }}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
            >
              ◀
            </button>
            <button
              type="button"
              onClick={() => setShowYearMonth(!showYearMonth)}
              className="font-medium hover:bg-gray-100 dark:hover:bg-gray-700 px-2 py-1 rounded text-sm"
            >
              <div>民國 {rocYear} 年 {viewMonth + 1} 月</div>
              {showGregorianSub && (
                <div className="text-xs text-[var(--muted)]">
                  {viewYear} / {String(viewMonth + 1).padStart(2, "0")}
                </div>
              )}
            </button>
            <button
              type="button"
              onClick={() => {
                if (viewMonth === 11) {
                  setViewMonth(0);
                  setViewYear(viewYear + 1);
                } else {
                  setViewMonth(viewMonth + 1);
                }
              }}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
            >
              ▶
            </button>
          </div>

          {showYearMonth ? (
            <div className="grid grid-cols-2 gap-2 mb-2">
              <select
                value={viewYear}
                onChange={(e) => setViewYear(Number(e.target.value))}
                className="px-2 py-1 border rounded bg-[var(--input-bg)] border-[var(--input-border)] text-sm"
              >
                {yearOptions.map((y) => (
                  <option key={y} value={y}>
                    民國 {toROCYear(y)} ({y})
                  </option>
                ))}
              </select>
              <select
                value={viewMonth}
                onChange={(e) => {
                  setViewMonth(Number(e.target.value));
                  setShowYearMonth(false);
                }}
                className="px-2 py-1 border rounded bg-[var(--input-bg)] border-[var(--input-border)] text-sm"
              >
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i} value={i}>
                    {i + 1} 月
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <>
              {/* Weekday headers */}
              <div className="grid grid-cols-7 gap-1 mb-1">
                {WEEKDAYS.map((d, i) => (
                  <div
                    key={d}
                    className={`text-center text-xs font-medium py-1 ${
                      i === 0 ? "text-red-500" : i === 6 ? "text-blue-500" : "text-[var(--muted)]"
                    }`}
                  >
                    {d}
                  </div>
                ))}
              </div>

              {/* Days grid */}
              <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: firstDayOfWeek }, (_, i) => (
                  <div key={`empty-${i}`} />
                ))}
                {Array.from({ length: totalDays }, (_, i) => {
                  const day = i + 1;
                  const date = new Date(viewYear, viewMonth, day);
                  const dayOfWeek = date.getDay();
                  const isToday = isSameDay(date, today);
                  const isSelected =
                    value &&
                    value.year === viewYear &&
                    value.month === viewMonth &&
                    value.day === day;
                  const isDisabled = isDateDisabled(date, minDate, maxDate);

                  return (
                    <button
                      key={day}
                      type="button"
                      disabled={isDisabled}
                      onClick={() => handleSelect(day)}
                      className={`
                        w-full aspect-square flex items-center justify-center text-sm rounded
                        ${isDisabled ? "opacity-30 cursor-not-allowed" : "hover:bg-blue-100 dark:hover:bg-blue-900 cursor-pointer"}
                        ${isSelected ? "bg-blue-500 text-white hover:bg-blue-600" : ""}
                        ${isToday && !isSelected ? "ring-1 ring-blue-400" : ""}
                        ${!isSelected && dayOfWeek === 0 ? "text-red-500" : ""}
                        ${!isSelected && dayOfWeek === 6 ? "text-blue-500" : ""}
                      `}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
            </>
          )}

          {/* Footer */}
          <div className="flex justify-between mt-2 pt-2 border-t border-[var(--card-border)]">
            <button
              type="button"
              onClick={() => {
                const t = new Date();
                handleSelect(t.getDate());
                setViewYear(t.getFullYear());
                setViewMonth(t.getMonth());
              }}
              className="text-sm text-blue-500 hover:text-blue-600 px-2 py-1"
            >
              今天
            </button>
            <button
              type="button"
              onClick={() => {
                onChange(null);
                setOpen(false);
              }}
              className="text-sm text-[var(--muted)] hover:text-red-500 px-2 py-1"
            >
              清除
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

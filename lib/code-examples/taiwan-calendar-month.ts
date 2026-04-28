export const basic = `import { useState } from "react";
import TaiwanCalendarMonth from "@/components/taiwan/TaiwanCalendarMonth";

export default function MonthView() {
  const [date, setDate] = useState<Date | null>(null);
  const [year, setYear] = useState(2026);
  const [month, setMonth] = useState(1); // February (0-indexed)

  return (
    <TaiwanCalendarMonth
      year={year}
      month={month}
      value={date}
      onSelect={setDate}
      onMonthChange={(y, m) => { setYear(y); setMonth(m); }}
    />
  );
}`;

export const fullProps = `import { useState } from "react";
import TaiwanCalendarMonth from "@/components/taiwan/TaiwanCalendarMonth";

export default function HolidayShowcase() {
  // Show February 2026 — when 春節 falls
  const [date, setDate] = useState<Date | null>(null);

  return (
    <TaiwanCalendarMonth
      year={2026}
      month={1}
      value={date}
      onSelect={setDate}
      showNav={true}
      english={false}
    />
  );
}`;

export const formIntegration = `import { useState } from "react";
import TaiwanCalendarMonth from "@/components/taiwan/TaiwanCalendarMonth";
import { getHoliday } from "@/components/taiwan/TaiwanHolidayBadge";

// Combine the calendar with the holiday lookup helper for richer logic.
export default function HolidayPlanner() {
  const [date, setDate] = useState<Date | null>(null);
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());

  const holiday = date ? getHoliday(date) : null;

  return (
    <div>
      <TaiwanCalendarMonth
        year={year}
        month={month}
        value={date}
        onSelect={setDate}
        onMonthChange={(y, m) => { setYear(y); setMonth(m); }}
      />
      {date && (
        <p>
          選擇了 {date.toLocaleDateString("zh-TW")}
          {holiday && \` — \${holiday.name}\`}
        </p>
      )}
    </div>
  );
}`;

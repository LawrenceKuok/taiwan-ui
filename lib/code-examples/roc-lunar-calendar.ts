export const basic = `import ROCLunarCalendar from "@/components/taiwan/ROCLunarCalendar";

export default function Today() {
  return <ROCLunarCalendar date={new Date()} />;
}`;

export const fullProps = `import ROCLunarCalendar from "@/components/taiwan/ROCLunarCalendar";

export default function FestivalCard() {
  return (
    <ROCLunarCalendar
      date="2026-02-17"
      bilingual={true}
      compact={false}
    />
  );
}`;

export const formIntegration = `import { useState } from "react";
import ROCLunarCalendar from "@/components/taiwan/ROCLunarCalendar";
import ROCDatePicker, { type ROCDate } from "@/components/taiwan/ROCDatePicker";

export default function DatePickerWithLunar() {
  const [date, setDate] = useState<ROCDate | null>(null);

  return (
    <div className="space-y-4">
      <ROCDatePicker value={date} onChange={setDate} />
      {date && (
        <ROCLunarCalendar
          date={new Date(date.year, date.month, date.day)}
          compact
        />
      )}
    </div>
  );
}`;

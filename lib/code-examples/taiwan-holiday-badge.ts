export const basic = `import TaiwanHolidayBadge from "@/components/taiwan/TaiwanHolidayBadge";

export default function HolidayCheck() {
  return (
    <div>
      <TaiwanHolidayBadge date="2026-02-17" />
      <TaiwanHolidayBadge date="2026-10-10" />
    </div>
  );
}`;

export const fullProps = `import TaiwanHolidayBadge from "@/components/taiwan/TaiwanHolidayBadge";

export default function HolidayShowcase() {
  return (
    <div className="space-y-2">
      <TaiwanHolidayBadge date="2026-02-17" english={false} size="md" />
      <TaiwanHolidayBadge date="2026-10-10" english={true} size="sm" />
      <TaiwanHolidayBadge
        date="2026-04-15"
        fallback={<span className="text-xs text-gray-400">— 一般工作日 —</span>}
      />
    </div>
  );
}`;

export const formIntegration = `import TaiwanHolidayBadge, { getHoliday } from "@/components/taiwan/TaiwanHolidayBadge";

// Use the lookup helper directly when you need to gate logic on holiday status.
export default function CalendarRow({ date }: { date: string }) {
  const holiday = getHoliday(date);
  const dayOfWeek = new Date(date).getDay();
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
  const isWorkDay = !holiday && !isWeekend;

  return (
    <div className={isWorkDay ? "" : "bg-red-50 dark:bg-red-950/20"}>
      <span>{date}</span>
      <TaiwanHolidayBadge date={date} size="sm" />
      {isWeekend && !holiday && <span>週末</span>}
    </div>
  );
}`;

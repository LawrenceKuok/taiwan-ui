export const basic = `import { useState } from "react";
import ROCDateRangePicker, { type ROCDateRange } from "@/components/taiwan/ROCDateRangePicker";

export default function LeaveForm() {
  const [range, setRange] = useState<ROCDateRange>({ start: null, end: null });

  return <ROCDateRangePicker value={range} onChange={setRange} />;
}`;

export const fullProps = `import { useState } from "react";
import ROCDateRangePicker, { type ROCDateRange } from "@/components/taiwan/ROCDateRangePicker";

export default function ProjectDates() {
  const [range, setRange] = useState<ROCDateRange>({ start: null, end: null });

  return (
    <ROCDateRangePicker
      value={range}
      onChange={setRange}
      minDate={new Date(2026, 0, 1)}
      maxDate={new Date(2027, 11, 31)}
      startPlaceholder="專案起始"
      endPlaceholder="專案結束"
      separator="至"
      showGregorianSub
    />
  );
}`;

export const formIntegration = `import { useState } from "react";
import ROCDateRangePicker, { type ROCDateRange } from "@/components/taiwan/ROCDateRangePicker";

export default function LeaveRequest() {
  const [range, setRange] = useState<ROCDateRange>({ start: null, end: null });
  const valid = range.start && range.end;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!valid) return;
        const start = new Date(range.start!.year, range.start!.month, range.start!.day);
        const end = new Date(range.end!.year, range.end!.month, range.end!.day);
        const days = Math.round((end.getTime() - start.getTime()) / 86400000) + 1;
        alert(\`請假 \${days} 天\`);
      }}
    >
      <label className="block mb-1 text-sm font-bold">請假期間</label>
      <ROCDateRangePicker value={range} onChange={setRange} />
      <button type="submit" disabled={!valid}>送出</button>
    </form>
  );
}`;

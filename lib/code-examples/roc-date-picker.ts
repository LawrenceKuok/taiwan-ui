export const basic = `import { useState } from "react";
import ROCDatePicker, { type ROCDate } from "@/components/taiwan/ROCDatePicker";

export default function MyForm() {
  const [date, setDate] = useState<ROCDate | null>(null);

  return <ROCDatePicker value={date} onChange={setDate} />;
}`;

export const fullProps = `import { useState } from "react";
import ROCDatePicker, { type ROCDate } from "@/components/taiwan/ROCDatePicker";

export default function MyForm() {
  const [date, setDate] = useState<ROCDate | null>(null);

  return (
    <ROCDatePicker
      value={date}
      onChange={setDate}
      placeholder="請選擇出生日期"
      minDate={new Date(1911, 0, 1)}
      maxDate={new Date()}
      showGregorianSub={true}
      disabled={false}
    />
  );
}`;

export const formIntegration = `import { useState } from "react";
import ROCDatePicker, { type ROCDate } from "@/components/taiwan/ROCDatePicker";

export default function ApplicationForm() {
  const [birthDate, setBirthDate] = useState<ROCDate | null>(null);

  const handleSubmit = () => {
    if (!birthDate) return;
    const iso = \`\${birthDate.year}-\${String(birthDate.month + 1).padStart(2, "0")}-\${String(birthDate.day).padStart(2, "0")}\`;
    console.log("ISO date:", iso);
    console.log("ROC:", \`民國 \${birthDate.year - 1911} 年\`);
  };

  return (
    <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
      <label>出生日期</label>
      <ROCDatePicker
        value={birthDate}
        onChange={setBirthDate}
        maxDate={new Date()}
      />
      <button type="submit">送出</button>
    </form>
  );
}`;

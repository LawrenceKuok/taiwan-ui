export const basic = `import { useState } from "react";
import TaiwanMap, { type TaiwanCountyCode } from "@/components/taiwan/TaiwanMap";

export default function CountyPicker() {
  const [code, setCode] = useState<TaiwanCountyCode | null>(null);

  return (
    <TaiwanMap
      value={code}
      onSelect={(c) => setCode(c)}
    />
  );
}`;

export const fullProps = `import { useState } from "react";
import TaiwanMap, { type TaiwanCountyCode } from "@/components/taiwan/TaiwanMap";

export default function MultiSelectMap() {
  const [selected, setSelected] = useState<TaiwanCountyCode[]>([]);

  const toggle = (code: TaiwanCountyCode) =>
    setSelected((prev) =>
      prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code]
    );

  return (
    <TaiwanMap
      value={selected}
      onSelect={(c) => toggle(c)}
      english={false}
      showLabels={true}
      highlightColor="rgb(34, 197, 94)"
      width={420}
    />
  );
}`;

export const formIntegration = `import { useMemo } from "react";
import TaiwanMap, { type TaiwanCountyCode, TAIWAN_COUNTIES } from "@/components/taiwan/TaiwanMap";

// Choropleth: color each county by some value (e.g. population, sales).
const SALES: Partial<Record<TaiwanCountyCode, number>> = {
  TPE: 280, NWT: 320, TAO: 180, TXG: 240, TNN: 150, KHH: 210,
};

function colorFor(value: number) {
  // Simple linear ramp from blue → red
  const t = Math.min(1, value / 350);
  return \`rgba(\${Math.round(59 + (220 - 59) * t)}, 130, \${Math.round(246 - 200 * t)}, 0.5)\`;
}

export default function SalesByCounty() {
  return (
    <TaiwanMap
      colorize={(code) => SALES[code] != null ? colorFor(SALES[code]!) : undefined}
      onSelect={(code) => alert(\`\${TAIWAN_COUNTIES[code].zhName}: \${SALES[code] ?? 0}\`)}
    />
  );
}`;

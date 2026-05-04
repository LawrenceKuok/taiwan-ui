export const basic = `import { useState } from "react";
import TaiwanMRTPicker, { type MRTSelection } from "@/components/taiwan/TaiwanMRTPicker";

export default function NearestStation() {
  const [station, setStation] = useState<MRTSelection | null>(null);
  return <TaiwanMRTPicker value={station} onChange={setStation} />;
}`;

export const fullProps = `import { useState } from "react";
import TaiwanMRTPicker, { type MRTSelection } from "@/components/taiwan/TaiwanMRTPicker";

export default function TaipeiOnly() {
  const [station, setStation] = useState<MRTSelection | null>(null);
  return (
    <TaiwanMRTPicker
      value={station}
      onChange={setStation}
      systems={["trtc"]}        // restrict to Taipei Metro
      lang="zh"
      placeholder="選擇最近捷運站"
    />
  );
}`;

export const formIntegration = `// Real-estate listing: store nearest MRT for filtering
import { useState } from "react";
import TaiwanMRTPicker, { type MRTSelection } from "@/components/taiwan/TaiwanMRTPicker";

export interface PropertyForm {
  address: string;
  rent: number;
  nearestMRT?: {
    code: string;
    line: string;
    color: string;
  };
}

export default function PropertyListingForm() {
  const [station, setStation] = useState<MRTSelection | null>(null);

  const submit = async () => {
    const data: PropertyForm = {
      address: "...",
      rent: 25000,
      nearestMRT: station
        ? {
            code: station.stationCode,
            line: station.lineId,
            color: station.lineColor,
          }
        : undefined,
    };
    await fetch("/api/listings", { method: "POST", body: JSON.stringify(data) });
  };

  return (
    <form onSubmit={(e) => { e.preventDefault(); submit(); }}>
      <label>最近捷運站</label>
      <TaiwanMRTPicker value={station} onChange={setStation} />
      <button type="submit">Save listing</button>
    </form>
  );
}`;

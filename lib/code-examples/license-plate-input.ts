export const basic = `import { useState } from "react";
import LicensePlateInput from "@/components/taiwan/LicensePlateInput";

export default function MyForm() {
  const [plate, setPlate] = useState("");

  return <LicensePlateInput value={plate} onChange={setPlate} />;
}`;

export const fullProps = `import { useState } from "react";
import LicensePlateInput, { type PlateResult } from "@/components/taiwan/LicensePlateInput";

export default function MyForm() {
  const [plate, setPlate] = useState("");
  const [result, setResult] = useState<PlateResult | null>(null);

  return (
    <div>
      <LicensePlateInput
        value={plate}
        onChange={setPlate}
        onValidate={setResult}
        vehicleType="auto"
        placeholder="ABC-1234"
        disabled={false}
      />
      {result?.valid && <p>{result.type}: {result.formatted}</p>}
    </div>
  );
}`;

export const formIntegration = `import { useState } from "react";
import LicensePlateInput from "@/components/taiwan/LicensePlateInput";

export default function VehicleForm() {
  const [plate, setPlate] = useState("");
  const [valid, setValid] = useState(false);

  return (
    <form onSubmit={(e) => { e.preventDefault(); if (valid) alert("車牌已確認"); }}>
      <label>車牌號碼</label>
      <LicensePlateInput
        value={plate}
        onChange={setPlate}
        onValidate={(r) => setValid(r.valid)}
        vehicleType="car"
      />
      <button type="submit" disabled={!valid}>登記</button>
    </form>
  );
}`;

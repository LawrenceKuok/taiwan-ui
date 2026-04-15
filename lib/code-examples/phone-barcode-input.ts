export const basic = `import { useState } from "react";
import PhoneBarcodeInput from "@/components/taiwan/PhoneBarcodeInput";

export default function MyForm() {
  const [barcode, setBarcode] = useState("/");

  return <PhoneBarcodeInput value={barcode} onChange={(val) => setBarcode(val)} />;
}`;

export const fullProps = `import { useState } from "react";
import PhoneBarcodeInput, { type BarcodeResult } from "@/components/taiwan/PhoneBarcodeInput";

export default function MyForm() {
  const [barcode, setBarcode] = useState("/");
  const [result, setResult] = useState<BarcodeResult | null>(null);

  return (
    <div>
      <PhoneBarcodeInput
        value={barcode}
        onChange={(val, r) => { setBarcode(val); setResult(r); }}
        placeholder="/ABC+123"
        disabled={false}
      />
      {result?.valid && <p>Valid barcode: {result.formatted}</p>}
    </div>
  );
}`;

export const formIntegration = `import { useState } from "react";
import PhoneBarcodeInput from "@/components/taiwan/PhoneBarcodeInput";

export default function InvoiceCarrierForm() {
  const [barcode, setBarcode] = useState("/");
  const [valid, setValid] = useState(false);

  return (
    <form onSubmit={(e) => { e.preventDefault(); if (valid) alert("載具設定完成"); }}>
      <label>手機條碼載具</label>
      <PhoneBarcodeInput
        value={barcode}
        onChange={(val, r) => { setBarcode(val); setValid(r.valid); }}
      />
      <button type="submit" disabled={!valid}>確認載具</button>
    </form>
  );
}`;

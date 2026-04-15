export const basic = `import { useState } from "react";
import NHICardInput from "@/components/taiwan/NHICardInput";

export default function MyForm() {
  const [card, setCard] = useState("");

  return <NHICardInput value={card} onChange={setCard} />;
}`;

export const fullProps = `import { useState } from "react";
import NHICardInput, { type NHIResult } from "@/components/taiwan/NHICardInput";

export default function MyForm() {
  const [card, setCard] = useState("");
  const [result, setResult] = useState<NHIResult | null>(null);

  return (
    <div>
      <NHICardInput
        value={card}
        onChange={setCard}
        onValidate={setResult}
        placeholder="000000000000"
        disabled={false}
      />
      {result?.valid && <p>健保卡號有效</p>}
    </div>
  );
}`;

export const formIntegration = `import { useState } from "react";
import NHICardInput from "@/components/taiwan/NHICardInput";

export default function MedicalForm() {
  const [card, setCard] = useState("");
  const [valid, setValid] = useState(false);

  return (
    <form onSubmit={(e) => { e.preventDefault(); if (valid) alert("健保卡驗證通過"); }}>
      <label>健保卡號碼</label>
      <NHICardInput
        value={card}
        onChange={setCard}
        onValidate={(r) => setValid(r.valid)}
      />
      <button type="submit" disabled={!valid}>掛號</button>
    </form>
  );
}`;

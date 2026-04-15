export const basic = `import { useState } from "react";
import TWIDInput from "@/components/taiwan/TWIDInput";

export default function MyForm() {
  const [id, setId] = useState("");

  return <TWIDInput value={id} onChange={setId} />;
}`;

export const fullProps = `import { useState } from "react";
import TWIDInput, { type TWIDResult } from "@/components/taiwan/TWIDInput";

export default function MyForm() {
  const [id, setId] = useState("");
  const [result, setResult] = useState<TWIDResult | null>(null);

  return (
    <div>
      <TWIDInput
        value={id}
        onChange={setId}
        onValidate={setResult}
        placeholder="A123456789"
        showRegion={true}
        disabled={false}
      />
      {result?.valid && <p>Valid {result.type} from {result.region}</p>}
    </div>
  );
}`;

export const formIntegration = `import { useState } from "react";
import TWIDInput, { type TWIDResult } from "@/components/taiwan/TWIDInput";

export default function IdentityForm() {
  const [id, setId] = useState("");
  const [valid, setValid] = useState(false);

  return (
    <form onSubmit={(e) => { e.preventDefault(); if (valid) alert("ID verified"); }}>
      <label>身分證字號</label>
      <TWIDInput
        value={id}
        onChange={setId}
        onValidate={(r) => setValid(r.valid)}
      />
      <button type="submit" disabled={!valid}>驗證</button>
    </form>
  );
}`;

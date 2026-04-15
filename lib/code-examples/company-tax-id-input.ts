export const basic = `import { useState } from "react";
import CompanyTaxIDInput from "@/components/taiwan/CompanyTaxIDInput";

export default function MyForm() {
  const [taxId, setTaxId] = useState("");

  return <CompanyTaxIDInput value={taxId} onChange={setTaxId} />;
}`;

export const fullProps = `import { useState } from "react";
import CompanyTaxIDInput, { type TaxIDResult } from "@/components/taiwan/CompanyTaxIDInput";

export default function MyForm() {
  const [taxId, setTaxId] = useState("");
  const [result, setResult] = useState<TaxIDResult | null>(null);

  return (
    <div>
      <CompanyTaxIDInput
        value={taxId}
        onChange={setTaxId}
        onValidate={setResult}
        placeholder="12345678"
        disabled={false}
      />
      {result?.valid && <p>Valid tax ID</p>}
    </div>
  );
}`;

export const formIntegration = `import { useState } from "react";
import CompanyTaxIDInput, { type TaxIDResult } from "@/components/taiwan/CompanyTaxIDInput";

export default function CompanyForm() {
  const [taxId, setTaxId] = useState("");
  const [valid, setValid] = useState(false);

  return (
    <form onSubmit={(e) => { e.preventDefault(); if (valid) alert("統編驗證通過"); }}>
      <label>公司統一編號</label>
      <CompanyTaxIDInput
        value={taxId}
        onChange={setTaxId}
        onValidate={(r) => setValid(r.valid)}
      />
      <button type="submit" disabled={!valid}>送出</button>
    </form>
  );
}`;

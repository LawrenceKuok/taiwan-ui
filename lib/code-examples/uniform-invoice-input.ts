export const basic = `import { useState } from "react";
import UniformInvoiceInput from "@/components/taiwan/UniformInvoiceInput";

export default function MyForm() {
  const [invoice, setInvoice] = useState("");

  return <UniformInvoiceInput value={invoice} onChange={(val) => setInvoice(val)} />;
}`;

export const fullProps = `import { useState } from "react";
import UniformInvoiceInput, { type InvoiceResult } from "@/components/taiwan/UniformInvoiceInput";

export default function MyForm() {
  const [invoice, setInvoice] = useState("");
  const [result, setResult] = useState<InvoiceResult | null>(null);

  return (
    <div>
      <UniformInvoiceInput
        value={invoice}
        onChange={(val, r) => { setInvoice(val); setResult(r); }}
        placeholder="AB-12345678"
        disabled={false}
      />
      {result?.valid && <p>Valid invoice: {result.formatted}</p>}
    </div>
  );
}`;

export const formIntegration = `import { useState } from "react";
import UniformInvoiceInput, { type InvoiceResult } from "@/components/taiwan/UniformInvoiceInput";

export default function InvoiceForm() {
  const [invoice, setInvoice] = useState("");
  const [valid, setValid] = useState(false);

  return (
    <form onSubmit={(e) => { e.preventDefault(); if (valid) alert("Invoice submitted"); }}>
      <label>統一發票號碼</label>
      <UniformInvoiceInput
        value={invoice}
        onChange={(val, r) => { setInvoice(val); setValid(r.valid); }}
      />
      <button type="submit" disabled={!valid}>送出</button>
    </form>
  );
}`;

export const basic = `import { useState } from "react";
import TWPhoneInput from "@/components/taiwan/TWPhoneInput";

export default function MyForm() {
  const [phone, setPhone] = useState("");

  return <TWPhoneInput value={phone} onChange={setPhone} />;
}`;

export const fullProps = `import { useState } from "react";
import TWPhoneInput, { type PhoneResult } from "@/components/taiwan/TWPhoneInput";

export default function MyForm() {
  const [phone, setPhone] = useState("");
  const [result, setResult] = useState<PhoneResult | null>(null);

  return (
    <div>
      <TWPhoneInput
        value={phone}
        onChange={setPhone}
        onValidate={setResult}
        type="auto"
        placeholder="0912-345-678"
        disabled={false}
      />
      {result?.valid && <p>{result.type}: {result.formatted}</p>}
    </div>
  );
}`;

export const formIntegration = `import { useState } from "react";
import TWPhoneInput, { type PhoneResult } from "@/components/taiwan/TWPhoneInput";

export default function ContactForm() {
  const [phone, setPhone] = useState("");
  const [valid, setValid] = useState(false);

  return (
    <form onSubmit={(e) => { e.preventDefault(); if (valid) alert("電話已確認"); }}>
      <label>聯絡電話</label>
      <TWPhoneInput
        value={phone}
        onChange={setPhone}
        onValidate={(r) => setValid(r.valid)}
      />
      <button type="submit" disabled={!valid}>送出</button>
    </form>
  );
}`;

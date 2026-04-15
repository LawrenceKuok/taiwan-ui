export const basic = `import { useState } from "react";
import TaiwanAddressInput, { type TaiwanAddress } from "@/components/taiwan/TaiwanAddressInput";

export default function MyForm() {
  const [address, setAddress] = useState<TaiwanAddress | null>(null);

  return <TaiwanAddressInput value={address} onChange={setAddress} />;
}`;

export const fullProps = `import { useState } from "react";
import TaiwanAddressInput, { type TaiwanAddress } from "@/components/taiwan/TaiwanAddressInput";

export default function MyForm() {
  const [address, setAddress] = useState<TaiwanAddress | null>(null);

  return (
    <TaiwanAddressInput
      value={address}
      onChange={setAddress}
      placeholder="請輸入詳細地址（如：中正路 100 號 3 樓）"
      disabled={false}
      required={true}
    />
  );
}`;

export const formIntegration = `import { useState } from "react";
import TaiwanAddressInput, { type TaiwanAddress } from "@/components/taiwan/TaiwanAddressInput";

export default function ShippingForm() {
  const [address, setAddress] = useState<TaiwanAddress | null>(null);

  const handleSubmit = () => {
    if (!address) return;
    const full = \`\${address.postalCode} \${address.city}\${address.district}\${address.streetAddress}\`;
    console.log("Full address:", full);
  };

  return (
    <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
      <label>收件地址</label>
      <TaiwanAddressInput value={address} onChange={setAddress} required />
      <button type="submit">送出</button>
    </form>
  );
}`;

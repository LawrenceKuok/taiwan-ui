export const basic = `import { useState } from "react";
import PaymentMethodPicker, { type PaymentMethodId } from "@/components/taiwan/PaymentMethodPicker";

export default function Checkout() {
  const [method, setMethod] = useState<PaymentMethodId | null>(null);

  return <PaymentMethodPicker value={method} onChange={setMethod} />;
}`;

export const fullProps = `import { useState } from "react";
import PaymentMethodPicker, { type PaymentMethodId } from "@/components/taiwan/PaymentMethodPicker";

export default function MobileWallets() {
  const [method, setMethod] = useState<PaymentMethodId | null>("linepay");

  return (
    <PaymentMethodPicker
      value={method}
      onChange={setMethod}
      methods={["linepay", "jkopay", "streetpay", "easywallet", "icashpay"]}
      variant="list"
      english={false}
    />
  );
}`;

export const formIntegration = `import { useState } from "react";
import PaymentMethodPicker, { type PaymentMethodId } from "@/components/taiwan/PaymentMethodPicker";

export default function CheckoutForm() {
  const [method, setMethod] = useState<PaymentMethodId | null>(null);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!method) return alert("請選擇付款方式");
        // call your payment SDK here
        console.log("Pay with", method);
      }}
    >
      <fieldset>
        <legend className="font-bold mb-2">付款方式</legend>
        <PaymentMethodPicker value={method} onChange={setMethod} />
      </fieldset>
      <button type="submit" disabled={!method}>結帳</button>
    </form>
  );
}`;

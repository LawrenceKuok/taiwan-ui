export const basic = `import TaiwanPaymentButton from "@/components/taiwan/TaiwanPaymentButton";

export default function Checkout() {
  return (
    <TaiwanPaymentButton
      provider="linepay"
      amount={1250}
      onClick={(provider) => console.log(\`Pay with \${provider}\`)}
    />
  );
}`;

export const fullProps = `import { useState } from "react";
import TaiwanPaymentButton from "@/components/taiwan/TaiwanPaymentButton";

export default function Checkout() {
  const [loading, setLoading] = useState(false);

  const handlePay = (provider: string) => {
    setLoading(true);
    // Call payment API...
    setTimeout(() => setLoading(false), 2000);
  };

  return (
    <div className="flex gap-3">
      <TaiwanPaymentButton
        provider="linepay"
        amount={1250}
        onClick={handlePay}
        loading={loading}
        disabled={false}
        size="md"
        fullWidth={false}
      />
      <TaiwanPaymentButton
        provider="jkopay"
        amount={1250}
        onClick={handlePay}
        size="md"
      />
    </div>
  );
}`;

export const formIntegration = `import { useState } from "react";
import TaiwanPaymentButton, { type PaymentProvider } from "@/components/taiwan/TaiwanPaymentButton";

export default function PaymentStep() {
  const [selected, setSelected] = useState<PaymentProvider | null>(null);

  return (
    <div>
      <h3>選擇付款方式</h3>
      <div className="flex gap-3">
        {(["linepay", "jkopay"] as const).map((p) => (
          <TaiwanPaymentButton
            key={p}
            provider={p}
            amount={2500}
            onClick={() => setSelected(p)}
            size="lg"
            fullWidth
          />
        ))}
      </div>
      {selected && <p>已選擇: {selected}</p>}
    </div>
  );
}`;

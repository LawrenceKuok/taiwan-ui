export const basic = `import { useState } from "react";
import TaiwanCurrencyInput from "@/components/taiwan/TaiwanCurrencyInput";

export default function ContractAmount() {
  const [amount, setAmount] = useState<number | null>(1234567);

  return <TaiwanCurrencyInput value={amount} onChange={setAmount} />;
}`;

export const fullProps = `import { useState } from "react";
import TaiwanCurrencyInput from "@/components/taiwan/TaiwanCurrencyInput";

export default function ChequeAmount() {
  const [amount, setAmount] = useState<number | null>(50000);

  return (
    <TaiwanCurrencyInput
      value={amount}
      onChange={setAmount}
      showCapital={true}
      symbol="NT$"
      capitalSuffix="元整"
      maxDigits={10}
      placeholder="請輸入金額"
    />
  );
}`;

export const formIntegration = `import { useState } from "react";
import TaiwanCurrencyInput from "@/components/taiwan/TaiwanCurrencyInput";
import { toCapitalChinese } from "@/lib/currency-tw";

// You can also use the conversion helper directly when generating PDFs / docs.
const text = toCapitalChinese(1234567); // → "壹佰貳拾參萬肆仟伍佰陸拾柒元整"

export default function ContractForm() {
  const [amount, setAmount] = useState<number | null>(null);

  return (
    <form>
      <label className="block mb-1 text-sm font-bold">合約金額</label>
      <TaiwanCurrencyInput value={amount} onChange={setAmount} />
      <button type="submit" disabled={!amount}>送出</button>
    </form>
  );
}`;

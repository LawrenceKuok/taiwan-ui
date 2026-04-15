export const basic = `import { useState } from "react";
import BankAccountInput, { type BankAccount } from "@/components/taiwan/BankAccountInput";

export default function MyForm() {
  const [account, setAccount] = useState<BankAccount | null>(null);

  return <BankAccountInput value={account} onChange={setAccount} />;
}`;

export const fullProps = `import { useState } from "react";
import BankAccountInput, { type BankAccount } from "@/components/taiwan/BankAccountInput";

export default function MyForm() {
  const [account, setAccount] = useState<BankAccount | null>(null);

  return (
    <div>
      <BankAccountInput
        value={account}
        onChange={setAccount}
        disabled={false}
      />
      {account?.bankCode && (
        <p>Bank: {account.bankName} ({account.bankCode})</p>
      )}
    </div>
  );
}`;

export const formIntegration = `import { useState } from "react";
import BankAccountInput, { type BankAccount } from "@/components/taiwan/BankAccountInput";

export default function PaymentForm() {
  const [account, setAccount] = useState<BankAccount | null>(null);

  const isComplete = account?.bankCode &&
    account?.branchCode?.length === 4 &&
    account?.accountNumber?.length >= 10;

  return (
    <form onSubmit={(e) => { e.preventDefault(); if (isComplete) alert("帳號已設定"); }}>
      <label>收款帳戶</label>
      <BankAccountInput value={account} onChange={setAccount} />
      <button type="submit" disabled={!isComplete}>確認帳戶</button>
    </form>
  );
}`;

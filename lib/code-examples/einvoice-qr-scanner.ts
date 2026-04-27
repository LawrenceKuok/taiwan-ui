export const basic = `import EInvoiceQRScanner from "@/components/taiwan/EInvoiceQRScanner";

export default function ScanInvoice() {
  return (
    <EInvoiceQRScanner
      onScan={(invoice) => {
        console.log("發票", invoice.invoiceNumber);
        console.log("金額", invoice.totalAmount);
      }}
    />
  );
}`;

export const fullProps = `import { useState } from "react";
import EInvoiceQRScanner, { type ParsedInvoice } from "@/components/taiwan/EInvoiceQRScanner";

export default function ScannerDemo() {
  const [invoice, setInvoice] = useState<ParsedInvoice | null>(null);
  const [unknown, setUnknown] = useState<string[]>([]);

  return (
    <div className="space-y-3">
      <EInvoiceQRScanner
        onScan={setInvoice}
        onRawScan={(raw) => setUnknown((p) => [...p, raw])}
        oneShot={false}
        width={360}
      />
      {invoice && (
        <pre className="text-xs">{JSON.stringify(invoice, null, 2)}</pre>
      )}
    </div>
  );
}`;

export const formIntegration = `import { useState } from "react";
import EInvoiceQRScanner, { type ParsedInvoice, parseInvoiceQR } from "@/components/taiwan/EInvoiceQRScanner";

// You can also parse a raw QR string directly without using the scanner UI
// (e.g. when receiving the raw payload from a hardware reader or a webhook).
const parsed = parseInvoiceQR("AB1234567811403150123ABCD000003E8000003E80000000004595252...");

export default function ExpenseCapture() {
  const [invoice, setInvoice] = useState<ParsedInvoice | null>(null);

  async function submitToAccounting(inv: ParsedInvoice) {
    // POST to your backend
    await fetch("/api/expenses", { method: "POST", body: JSON.stringify(inv) });
  }

  return (
    <div>
      <EInvoiceQRScanner
        onScan={(inv) => {
          setInvoice(inv);
          submitToAccounting(inv);
        }}
      />
      {invoice && <p>已記錄發票 {invoice.invoiceNumber}</p>}
    </div>
  );
}`;

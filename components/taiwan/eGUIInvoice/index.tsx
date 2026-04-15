"use client";

export interface InvoiceItem {
  name: string;
  quantity: number;
  unitPrice: number;
}

export interface eGUIInvoiceProps {
  invoiceNumber: string;
  date: string;
  sellerName: string;
  sellerTaxId?: string;
  buyerTaxId?: string;
  items: InvoiceItem[];
  totalAmount: number;
  qrCodeUrl?: string;
  compact?: boolean;
}

export default function eGUIInvoice({
  invoiceNumber,
  date,
  sellerName,
  sellerTaxId,
  buyerTaxId,
  items,
  totalAmount,
  qrCodeUrl,
  compact = false,
}: eGUIInvoiceProps) {
  const formatted = invoiceNumber.length >= 10
    ? `${invoiceNumber.slice(0, 2)}-${invoiceNumber.slice(2)}`
    : invoiceNumber;

  return (
    <div className="w-full max-w-sm mx-auto border border-[var(--card-border)] rounded-xl bg-[var(--card-bg)] overflow-hidden">
      {/* Header */}
      <div className="bg-blue-600 text-white px-4 py-3 text-center">
        <p className="text-[10px] tracking-wider opacity-80">電子發票證明聯</p>
        <p className="font-bold font-mono text-lg tracking-widest mt-0.5">{formatted}</p>
        <p className="text-xs opacity-80 mt-0.5">{date}</p>
      </div>

      {/* Seller / Buyer info */}
      <div className="px-4 py-3 border-b border-dashed border-[var(--card-border)] text-xs space-y-1">
        <div className="flex justify-between">
          <span className="text-[var(--muted)]">賣方</span>
          <span>{sellerName}</span>
        </div>
        {sellerTaxId && (
          <div className="flex justify-between">
            <span className="text-[var(--muted)]">賣方統編</span>
            <span className="font-mono">{sellerTaxId}</span>
          </div>
        )}
        {buyerTaxId && (
          <div className="flex justify-between">
            <span className="text-[var(--muted)]">買方統編</span>
            <span className="font-mono">{buyerTaxId}</span>
          </div>
        )}
      </div>

      {/* Items */}
      {!compact && items.length > 0 && (
        <div className="px-4 py-3 border-b border-dashed border-[var(--card-border)]">
          <table className="w-full text-xs">
            <thead>
              <tr className="text-[var(--muted)]">
                <th className="text-left font-normal pb-1">品項</th>
                <th className="text-right font-normal pb-1">數量</th>
                <th className="text-right font-normal pb-1">單價</th>
                <th className="text-right font-normal pb-1">小計</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, i) => (
                <tr key={i}>
                  <td className="py-0.5">{item.name}</td>
                  <td className="text-right font-mono">{item.quantity}</td>
                  <td className="text-right font-mono">${item.unitPrice.toLocaleString()}</td>
                  <td className="text-right font-mono">${(item.quantity * item.unitPrice).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Total */}
      <div className="px-4 py-3 flex justify-between items-center border-b border-[var(--card-border)]">
        <span className="text-sm font-medium">合計</span>
        <span className="text-lg font-bold font-mono text-blue-400">
          NT$ {totalAmount.toLocaleString()}
        </span>
      </div>

      {/* QR Code */}
      {qrCodeUrl && (
        <div className="px-4 py-4 flex justify-center">
          <img
            src={qrCodeUrl}
            alt="Invoice QR Code"
            className="w-24 h-24 rounded"
          />
        </div>
      )}

      {/* Footer */}
      <div className="px-4 py-2 bg-[var(--surface)] text-center">
        <p className="text-[10px] text-[var(--muted)]">
          此為電子發票證明聯，與實體發票具同等效力
        </p>
      </div>
    </div>
  );
}

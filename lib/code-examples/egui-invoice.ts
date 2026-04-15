export const basic = `import eGUIInvoice from "@/components/taiwan/eGUIInvoice";

export default function MyPage() {
  return (
    <eGUIInvoice
      invoiceNumber="AB12345678"
      date="114/03/15"
      sellerName="台灣科技股份有限公司"
      items={[
        { name: "商品 A", quantity: 2, unitPrice: 150 },
        { name: "商品 B", quantity: 1, unitPrice: 300 },
      ]}
      totalAmount={600}
    />
  );
}`;

export const fullProps = `import eGUIInvoice from "@/components/taiwan/eGUIInvoice";

export default function MyPage() {
  return (
    <eGUIInvoice
      invoiceNumber="CD87654321"
      date="114/03/15"
      sellerName="範例商店"
      sellerTaxId="12345678"
      buyerTaxId="87654321"
      items={[
        { name: "筆記型電腦", quantity: 1, unitPrice: 35000 },
        { name: "無線滑鼠", quantity: 2, unitPrice: 500 },
        { name: "螢幕保護貼", quantity: 1, unitPrice: 250 },
      ]}
      totalAmount={36250}
      compact={false}
    />
  );
}`;

export const formIntegration = `import eGUIInvoice from "@/components/taiwan/eGUIInvoice";

export default function OrderConfirmation() {
  const order = {
    invoiceNumber: "EF11223344",
    items: [
      { name: "訂閱服務（年費）", quantity: 1, unitPrice: 3600 },
    ],
  };

  return (
    <div>
      <h2>訂單確認</h2>
      <eGUIInvoice
        invoiceNumber={order.invoiceNumber}
        date="114/04/01"
        sellerName="雲端服務有限公司"
        sellerTaxId="22334455"
        items={order.items}
        totalAmount={3600}
        compact={false}
      />
    </div>
  );
}`;

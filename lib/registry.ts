export type ComponentCategory =
  | "date"
  | "identity"
  | "address"
  | "payment"
  | "invoice"
  | "telecom"
  | "finance"
  | "vehicle";

export type ComponentStatus = "stable" | "beta" | "planned";

export interface PropDef {
  name: string;
  type: string;
  default?: string;
  required: boolean;
  description: string;
  zhDescription: string;
}

export interface ComponentMeta {
  slug: string;
  name: string;
  zhName: string;
  description: string;
  zhDescription: string;
  category: ComponentCategory;
  tags: string[];
  props: PropDef[];
  version: string;
  source: string;
  dependencies: string[];
  status: ComponentStatus;
}

export const REGISTRY: ComponentMeta[] = [
  {
    slug: "roc-date-picker",
    name: "ROCDatePicker",
    zhName: "民國日期選擇器",
    description:
      "Date picker with ROC (Minguo) calendar support. Displays both ROC and Gregorian years with min/max date constraints.",
    zhDescription:
      "民國/西元雙曆顯示，支援日期範圍限制、今天/清除快捷鍵。",
    category: "date",
    tags: ["民國紀年", "雙曆", "minDate/maxDate", "calendar"],
    props: [
      { name: "value", type: "ROCDate | null", required: true, description: "Selected date value", zhDescription: "已選擇的日期" },
      { name: "onChange", type: "(date: ROCDate | null) => void", required: true, description: "Callback when date changes", zhDescription: "日期變更時的回呼" },
      { name: "placeholder", type: "string", default: '"請選擇日期"', required: false, description: "Placeholder text", zhDescription: "佔位文字" },
      { name: "minDate", type: "Date", required: false, description: "Minimum selectable date", zhDescription: "最小可選日期" },
      { name: "maxDate", type: "Date", required: false, description: "Maximum selectable date", zhDescription: "最大可選日期" },
      { name: "disabled", type: "boolean", default: "false", required: false, description: "Disable the picker", zhDescription: "停用選擇器" },
      { name: "showGregorianSub", type: "boolean", default: "true", required: false, description: "Show Gregorian date subtitle", zhDescription: "顯示西元日期副標" },
    ],
    version: "0.1.0",
    source: "components/taiwan/ROCDatePicker/index.tsx",
    dependencies: [],
    status: "stable",
  },
  {
    slug: "twid-input",
    name: "TWIDInput",
    zhName: "身分證字號驗證",
    description:
      "Real-time Taiwan national ID and ARC (Alien Resident Certificate) validation with checksum verification and region detection.",
    zhDescription:
      "即時 checksum 驗證，自動辨識國民身分證與居留證，顯示 26 地區碼。",
    category: "identity",
    tags: ["校驗碼", "26 地區碼", "ARC 支援", "checksum"],
    props: [
      { name: "value", type: "string", required: true, description: "Current input value", zhDescription: "目前輸入值" },
      { name: "onChange", type: "(value: string) => void", required: true, description: "Callback when value changes", zhDescription: "值變更時的回呼" },
      { name: "onValidate", type: "(result: TWIDResult) => void", required: false, description: "Callback with validation result", zhDescription: "驗證結果回呼" },
      { name: "placeholder", type: "string", default: '"A123456789"', required: false, description: "Placeholder text", zhDescription: "佔位文字" },
      { name: "disabled", type: "boolean", default: "false", required: false, description: "Disable the input", zhDescription: "停用輸入" },
      { name: "showRegion", type: "boolean", default: "true", required: false, description: "Show region badge on valid ID", zhDescription: "顯示地區標籤" },
    ],
    version: "0.1.0",
    source: "components/taiwan/TWIDInput/index.tsx",
    dependencies: [],
    status: "stable",
  },
  {
    slug: "taiwan-address-input",
    name: "TaiwanAddressInput",
    zhName: "台灣地址輸入",
    description:
      "Cascading city/district/postal code selector covering all 22 cities and 368+ districts in Taiwan with auto postal code lookup.",
    zhDescription:
      "三級聯動縣市鄉鎮區選擇器，自動帶入郵遞區號，涵蓋全台 22 縣市 368 鄉鎮區。",
    category: "address",
    tags: ["22 縣市", "368 鄉鎮區", "自動郵遞區號", "cascading"],
    props: [
      { name: "value", type: "TaiwanAddress | null", required: true, description: "Current address value", zhDescription: "目前地址值" },
      { name: "onChange", type: "(address: TaiwanAddress | null) => void", required: true, description: "Callback when address changes", zhDescription: "地址變更時的回呼" },
      { name: "placeholder", type: "string", default: '"請輸入詳細地址"', required: false, description: "Street address placeholder", zhDescription: "街道地址佔位文字" },
      { name: "disabled", type: "boolean", default: "false", required: false, description: "Disable all inputs", zhDescription: "停用所有輸入" },
      { name: "required", type: "boolean", default: "false", required: false, description: "Mark as required", zhDescription: "標記為必填" },
    ],
    version: "0.1.0",
    source: "components/taiwan/TaiwanAddressInput/index.tsx",
    dependencies: ["data/taiwan-postal.json"],
    status: "stable",
  },
  {
    slug: "taiwan-payment-button",
    name: "TaiwanPaymentButton",
    zhName: "本土支付按鈕",
    description:
      "Branded payment buttons for Taiwan local payment providers including LINE Pay and JKO Pay with proper brand colors and loading states.",
    zhDescription:
      "LINE Pay / JKO Pay 品牌規範按鈕，支援金額顯示、載入狀態、三種尺寸。",
    category: "payment",
    tags: ["LINE Pay", "JKO Pay", "3 尺寸", "branded"],
    props: [
      { name: "provider", type: '"linepay" | "jkopay" | "streetpay"', required: true, description: "Payment provider", zhDescription: "支付供應商" },
      { name: "amount", type: "number", required: false, description: "Payment amount in NTD", zhDescription: "新台幣金額" },
      { name: "onClick", type: "(provider: PaymentProvider) => void", required: true, description: "Click handler", zhDescription: "點擊事件處理" },
      { name: "loading", type: "boolean", default: "false", required: false, description: "Show loading spinner", zhDescription: "顯示載入動畫" },
      { name: "disabled", type: "boolean", default: "false", required: false, description: "Disable the button", zhDescription: "停用按鈕" },
      { name: "size", type: '"sm" | "md" | "lg"', default: '"md"', required: false, description: "Button size", zhDescription: "按鈕尺寸" },
      { name: "fullWidth", type: "boolean", default: "false", required: false, description: "Full width button", zhDescription: "全寬按鈕" },
    ],
    version: "0.1.0",
    source: "components/taiwan/TaiwanPaymentButton/index.tsx",
    dependencies: [],
    status: "stable",
  },
  {
    slug: "uniform-invoice-input",
    name: "UniformInvoiceInput",
    zhName: "統一發票輸入",
    description:
      "Taiwan uniform invoice number input with auto-formatting (XX-XXXXXXXX) and real-time format validation.",
    zhDescription:
      "統一發票號碼輸入，自動格式化 XX-XXXXXXXX，即時格式驗證。",
    category: "invoice",
    tags: ["自動連字號", "格式驗證", "auto-format"],
    props: [
      { name: "value", type: "string", required: true, description: "Current input value", zhDescription: "目前輸入值" },
      { name: "onChange", type: "(value: string, result: InvoiceResult) => void", required: true, description: "Callback when value changes", zhDescription: "值變更時的回呼" },
      { name: "placeholder", type: "string", default: '"AB-12345678"', required: false, description: "Placeholder text", zhDescription: "佔位文字" },
      { name: "disabled", type: "boolean", default: "false", required: false, description: "Disable the input", zhDescription: "停用輸入" },
      { name: "showPrizeCheck", type: "boolean", default: "false", required: false, description: "Show prize check feature", zhDescription: "顯示對獎功能" },
    ],
    version: "0.1.0",
    source: "components/taiwan/UniformInvoiceInput/index.tsx",
    dependencies: [],
    status: "stable",
  },
  {
    slug: "company-tax-id-input",
    name: "CompanyTaxIDInput",
    zhName: "統編驗證",
    description: "Taiwan company tax ID (統一編號) input with MOF checksum validation using weighted sum algorithm.",
    zhDescription: "公司統一編號輸入，含財政部校驗碼驗證（加權總和 mod 5）。",
    category: "identity",
    tags: ["統一編號", "MOF checksum", "8 碼"],
    props: [
      { name: "value", type: "string", required: true, description: "Current input value", zhDescription: "目前輸入值" },
      { name: "onChange", type: "(value: string) => void", required: true, description: "Callback when value changes", zhDescription: "值變更時的回呼" },
      { name: "onValidate", type: "(result: TaxIDResult) => void", required: false, description: "Callback with validation result", zhDescription: "驗證結果回呼" },
      { name: "placeholder", type: "string", default: '"12345678"', required: false, description: "Placeholder text", zhDescription: "佔位文字" },
      { name: "disabled", type: "boolean", default: "false", required: false, description: "Disable the input", zhDescription: "停用輸入" },
    ],
    version: "0.1.0",
    source: "components/taiwan/CompanyTaxIDInput/index.tsx",
    dependencies: [],
    status: "stable",
  },
  {
    slug: "phone-barcode-input",
    name: "PhoneBarcodeInput",
    zhName: "手機條碼載具",
    description: "Taiwan mobile barcode carrier input (/XXXXXXX format) for e-invoice carrier identification.",
    zhDescription: "手機條碼載具輸入，自動帶入斜線前綴，即時格式驗證。",
    category: "invoice",
    tags: ["載具", "電子發票", "barcode"],
    props: [
      { name: "value", type: "string", required: true, description: "Current input value", zhDescription: "目前輸入值" },
      { name: "onChange", type: "(value: string, result: BarcodeResult) => void", required: true, description: "Callback when value changes", zhDescription: "值變更時的回呼" },
      { name: "placeholder", type: "string", default: '"/ABC+123"', required: false, description: "Placeholder text", zhDescription: "佔位文字" },
      { name: "disabled", type: "boolean", default: "false", required: false, description: "Disable the input", zhDescription: "停用輸入" },
    ],
    version: "0.1.0",
    source: "components/taiwan/PhoneBarcodeInput/index.tsx",
    dependencies: [],
    status: "stable",
  },
  {
    slug: "tw-phone-input",
    name: "TWPhoneInput",
    zhName: "台灣電話輸入",
    description: "Taiwan phone number input supporting mobile (09XX) and landline with area codes. Auto-formats and detects phone type.",
    zhDescription: "台灣電話號碼輸入，支援手機與市話區碼自動格式化與類型偵測。",
    category: "telecom",
    tags: ["手機", "市話", "區碼", "auto-format"],
    props: [
      { name: "value", type: "string", required: true, description: "Current input value (digits only)", zhDescription: "目前輸入值（純數字）" },
      { name: "onChange", type: "(value: string) => void", required: true, description: "Callback when value changes", zhDescription: "值變更時的回呼" },
      { name: "onValidate", type: "(result: PhoneResult) => void", required: false, description: "Callback with validation result", zhDescription: "驗證結果回呼" },
      { name: "type", type: '"mobile" | "landline" | "auto"', default: '"auto"', required: false, description: "Phone type filter", zhDescription: "電話類型篩選" },
      { name: "placeholder", type: "string", required: false, description: "Placeholder text", zhDescription: "佔位文字" },
      { name: "disabled", type: "boolean", default: "false", required: false, description: "Disable the input", zhDescription: "停用輸入" },
    ],
    version: "0.1.0",
    source: "components/taiwan/TWPhoneInput/index.tsx",
    dependencies: [],
    status: "stable",
  },
  {
    slug: "license-plate-input",
    name: "LicensePlateInput",
    zhName: "車牌號碼輸入",
    description: "Taiwan vehicle license plate input with format validation for new/old car plates and motorcycle plates.",
    zhDescription: "台灣車牌號碼輸入，支援新式、舊式汽車車牌及機車格式自動辨識。",
    category: "vehicle",
    tags: ["汽車", "機車", "新式車牌", "auto-format"],
    props: [
      { name: "value", type: "string", required: true, description: "Current input value", zhDescription: "目前輸入值" },
      { name: "onChange", type: "(value: string) => void", required: true, description: "Callback when value changes", zhDescription: "值變更時的回呼" },
      { name: "onValidate", type: "(result: PlateResult) => void", required: false, description: "Callback with validation result", zhDescription: "驗證結果回呼" },
      { name: "vehicleType", type: '"car" | "motorcycle" | "auto"', default: '"auto"', required: false, description: "Vehicle type filter", zhDescription: "車輛類型篩選" },
      { name: "placeholder", type: "string", default: '"ABC-1234"', required: false, description: "Placeholder text", zhDescription: "佔位文字" },
      { name: "disabled", type: "boolean", default: "false", required: false, description: "Disable the input", zhDescription: "停用輸入" },
    ],
    version: "0.1.0",
    source: "components/taiwan/LicensePlateInput/index.tsx",
    dependencies: [],
    status: "stable",
  },
  {
    slug: "nhi-card-input",
    name: "NHICardInput",
    zhName: "健保卡驗證",
    description: "Taiwan National Health Insurance card number input with 12-digit format validation.",
    zhDescription: "全民健保卡號碼輸入，12 碼格式驗證，自動分組顯示。",
    category: "identity",
    tags: ["健保卡", "NHI", "12 碼"],
    props: [
      { name: "value", type: "string", required: true, description: "Current input value (digits only)", zhDescription: "目前輸入值（純數字）" },
      { name: "onChange", type: "(value: string) => void", required: true, description: "Callback when value changes", zhDescription: "值變更時的回呼" },
      { name: "onValidate", type: "(result: NHIResult) => void", required: false, description: "Callback with validation result", zhDescription: "驗證結果回呼" },
      { name: "placeholder", type: "string", default: '"000000000000"', required: false, description: "Placeholder text", zhDescription: "佔位文字" },
      { name: "disabled", type: "boolean", default: "false", required: false, description: "Disable the input", zhDescription: "停用輸入" },
    ],
    version: "0.1.0",
    source: "components/taiwan/NHICardInput/index.tsx",
    dependencies: [],
    status: "stable",
  },
  {
    slug: "bank-account-input",
    name: "BankAccountInput",
    zhName: "銀行帳號輸入",
    description: "Taiwan bank account input with searchable bank code lookup (37 banks), branch code, and account number fields.",
    zhDescription: "銀行帳號輸入，含 37 家銀行代碼搜尋、分行代碼、帳號三欄位。",
    category: "finance",
    tags: ["銀行代碼", "分行", "帳號", "37 banks"],
    props: [
      { name: "value", type: "BankAccount | null", required: true, description: "Current bank account value", zhDescription: "目前銀行帳號值" },
      { name: "onChange", type: "(account: BankAccount | null) => void", required: true, description: "Callback when value changes", zhDescription: "值變更時的回呼" },
      { name: "disabled", type: "boolean", default: "false", required: false, description: "Disable all inputs", zhDescription: "停用所有輸入" },
    ],
    version: "0.1.0",
    source: "components/taiwan/BankAccountInput/index.tsx",
    dependencies: ["data/taiwan-banks.json"],
    status: "stable",
  },
  {
    slug: "egui-invoice",
    name: "eGUIInvoice",
    zhName: "電子發票元件",
    description: "Display component for Taiwan e-invoices with seller/buyer info, item list, totals, and optional QR code.",
    zhDescription: "電子發票顯示元件，含賣方/買方資訊、品項列表、金額合計、QR Code。",
    category: "invoice",
    tags: ["電子發票", "eGUI", "display", "QR Code"],
    props: [
      { name: "invoiceNumber", type: "string", required: true, description: "Invoice number (e.g. AB12345678)", zhDescription: "發票號碼" },
      { name: "date", type: "string", required: true, description: "Invoice date string", zhDescription: "發票日期" },
      { name: "sellerName", type: "string", required: true, description: "Seller name", zhDescription: "賣方名稱" },
      { name: "sellerTaxId", type: "string", required: false, description: "Seller tax ID", zhDescription: "賣方統編" },
      { name: "buyerTaxId", type: "string", required: false, description: "Buyer tax ID", zhDescription: "買方統編" },
      { name: "items", type: "InvoiceItem[]", required: true, description: "Array of invoice items", zhDescription: "品項列表" },
      { name: "totalAmount", type: "number", required: true, description: "Total amount in NTD", zhDescription: "合計金額" },
      { name: "qrCodeUrl", type: "string", required: false, description: "QR code image URL", zhDescription: "QR Code 圖片網址" },
      { name: "compact", type: "boolean", default: "false", required: false, description: "Hide item details", zhDescription: "隱藏品項明細" },
    ],
    version: "0.1.0",
    source: "components/taiwan/eGUIInvoice/index.tsx",
    dependencies: [],
    status: "stable",
  },
];

export const CATEGORIES: { key: ComponentCategory; label: string; zhLabel: string }[] = [
  { key: "date", label: "Date", zhLabel: "日期" },
  { key: "identity", label: "Identity", zhLabel: "身分驗證" },
  { key: "address", label: "Address", zhLabel: "地址" },
  { key: "payment", label: "Payment", zhLabel: "支付" },
  { key: "invoice", label: "Invoice", zhLabel: "發票" },
  { key: "telecom", label: "Telecom", zhLabel: "通訊" },
  { key: "finance", label: "Finance", zhLabel: "金融" },
  { key: "vehicle", label: "Vehicle", zhLabel: "車輛" },
];

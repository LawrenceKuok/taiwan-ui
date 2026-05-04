export type ComponentCategory =
  | "date"
  | "identity"
  | "address"
  | "payment"
  | "invoice"
  | "telecom"
  | "finance"
  | "vehicle"
  | "map"
  | "tax";

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
  {
    slug: "taiwan-map",
    name: "TaiwanMap",
    zhName: "台灣縣市地圖",
    description:
      "Stylised SVG selector for Taiwan's 22 counties/cities + 3 outlying island groups. Click-to-select, choropleth-ready, fully keyboard accessible.",
    zhDescription:
      "22 縣市加 3 大離島群島的可點選 SVG 地圖，支援單/多選、自訂色彩、鍵盤導覽。",
    category: "map",
    tags: ["地圖", "縣市選擇", "data-viz", "SVG", "choropleth"],
    props: [
      { name: "value", type: "TaiwanCountyCode | TaiwanCountyCode[] | null", required: false, description: "Selected county code(s)", zhDescription: "已選縣市代碼" },
      { name: "onSelect", type: "(code: TaiwanCountyCode, county: TaiwanCounty) => void", required: false, description: "Selection callback", zhDescription: "選取回呼" },
      { name: "colorize", type: "(code: TaiwanCountyCode) => string | undefined", required: false, description: "Per-county color override for choropleth maps", zhDescription: "依縣市自訂顏色" },
      { name: "showLabels", type: "boolean", default: "true", required: false, description: "Show county labels on tiles", zhDescription: "顯示縣市標籤" },
      { name: "english", type: "boolean", default: "false", required: false, description: "Use English county names", zhDescription: "顯示英文縣市名" },
      { name: "highlightColor", type: "string", default: '"rgb(59,130,246)"', required: false, description: "Selected tile color", zhDescription: "選中縣市顏色" },
      { name: "disabled", type: "boolean", default: "false", required: false, description: "Read-only mode", zhDescription: "唯讀模式" },
      { name: "width", type: "number", default: "360", required: false, description: "Map width in pixels", zhDescription: "地圖寬度" },
    ],
    version: "0.1.0",
    source: "components/taiwan/TaiwanMap/index.tsx",
    dependencies: [],
    status: "stable",
  },
  {
    slug: "payment-method-picker",
    name: "PaymentMethodPicker",
    zhName: "支付方式選擇器",
    description:
      "Multi-provider payment-method radio group covering Taiwan e-wallets (LINE Pay, 街口, 全支付, 悠遊付, iCash) plus Apple/Google/Samsung Pay, credit card, ATM, and convenience-store payment.",
    zhDescription:
      "涵蓋台灣主要電子錢包（LINE Pay、街口、全支付、悠遊付、iCash）、行動支付（Apple/Google/Samsung Pay）、信用卡、ATM、超商代收的單選元件。",
    category: "payment",
    tags: ["LINE Pay", "街口支付", "全支付", "Apple Pay", "11 providers"],
    props: [
      { name: "value", type: "PaymentMethodId | null", required: true, description: "Selected method id", zhDescription: "已選支付方式" },
      { name: "onChange", type: "(id: PaymentMethodId) => void", required: true, description: "Selection callback", zhDescription: "選取回呼" },
      { name: "methods", type: "PaymentMethodId[]", required: false, description: "Subset of methods to show; defaults to a sensible Taiwan set", zhDescription: "要顯示的支付方式子集" },
      { name: "english", type: "boolean", default: "false", required: false, description: "Use English labels", zhDescription: "顯示英文標籤" },
      { name: "variant", type: '"grid" | "list"', default: '"grid"', required: false, description: "Display variant", zhDescription: "顯示變體" },
      { name: "disabled", type: "boolean", default: "false", required: false, description: "Disable selection", zhDescription: "停用選取" },
    ],
    version: "0.1.0",
    source: "components/taiwan/PaymentMethodPicker/index.tsx",
    dependencies: [],
    status: "stable",
  },
  {
    slug: "taiwan-holiday-badge",
    name: "TaiwanHolidayBadge",
    zhName: "台灣國定假日標籤",
    description:
      "Renders a coloured badge if a given date is a Taiwan public holiday per 行政院人事行政總處 (DGPA) calendar. National / lunar / adjusted holidays each get a distinct tone. Quietly renders nothing for non-holiday dates.",
    zhDescription:
      "依行政院人事行政總處公告日曆，標示國定/農曆/彈性假日，並以不同色調區分。非假日不顯示。資料涵蓋 2025–2026。",
    category: "date",
    tags: ["國定假日", "農曆假日", "DGPA", "行政院"],
    props: [
      { name: "date", type: "Date | string", required: true, description: "Date to check (Date object or YYYY-MM-DD string)", zhDescription: "要檢查的日期" },
      { name: "english", type: "boolean", default: "false", required: false, description: "Use English holiday name", zhDescription: "使用英文假日名" },
      { name: "size", type: '"sm" | "md"', default: '"md"', required: false, description: "Badge size", zhDescription: "標籤尺寸" },
      { name: "fallback", type: "React.ReactNode", required: false, description: "What to render when not a holiday (default: nothing)", zhDescription: "非假日時的替代內容" },
    ],
    version: "0.1.0",
    source: "components/taiwan/TaiwanHolidayBadge/index.tsx",
    dependencies: ["data/taiwan-holidays.json"],
    status: "stable",
  },
  {
    slug: "roc-lunar-calendar",
    name: "ROCLunarCalendar",
    zhName: "民國農曆資訊卡",
    description:
      "Shows for any Gregorian date: ROC year (民國), sexagenary cycle (天干地支), zodiac animal (生肖), and lunar festival name (春節, 元宵, 端午, 中秋, 七夕, 重陽). Festival data verified for 2024–2030.",
    zhDescription:
      "顯示任意西元日期對應的民國年、天干地支、生肖、農曆節日（春節、元宵、端午、中秋、七夕、重陽）。節日資料已驗證 2024–2030。",
    category: "date",
    tags: ["民國紀年", "天干地支", "生肖", "農曆節日"],
    props: [
      { name: "date", type: "Date | string", required: true, description: "Date to display", zhDescription: "要顯示的日期" },
      { name: "lunarOverride", type: "string", required: false, description: "Pre-computed lunar string for non-festival days", zhDescription: "非節日日期的農曆字串" },
      { name: "bilingual", type: "boolean", default: "false", required: false, description: "Show English alongside 中文", zhDescription: "中英對照" },
      { name: "compact", type: "boolean", default: "false", required: false, description: "One-line compact variant", zhDescription: "單行精簡顯示" },
      { name: "festivalOverride", type: "LunarFestival | null", required: false, description: "Override festival lookup", zhDescription: "覆寫節日查詢結果" },
    ],
    version: "0.1.0",
    source: "components/taiwan/ROCLunarCalendar/index.tsx",
    dependencies: ["lib/lunar-calendar.ts"],
    status: "beta",
  },
  {
    slug: "einvoice-qr-scanner",
    name: "EInvoiceQRScanner",
    zhName: "電子發票 QR 掃描器",
    description:
      "Scans the left-side QR code of a Taiwan uniform invoice using the browser's native BarcodeDetector API. Parses the invoice number, ROC date, sales/total amounts, buyer/seller tax IDs, random code, and encryption verification code per 財政部電子發票二維條碼規格. Zero deps; camera permission required.",
    zhDescription:
      "使用瀏覽器原生 BarcodeDetector API 掃描台灣統一發票左側 QR Code，解析發票號碼、民國日期、金額、買/賣方統編、隨機碼、加密驗證碼。零依賴，需相機權限。",
    category: "invoice",
    tags: ["QR scanner", "BarcodeDetector", "電子發票", "財政部規格"],
    props: [
      { name: "onScan", type: "(invoice: ParsedInvoice) => void", required: true, description: "Callback with parsed invoice fields", zhDescription: "解析成功回呼" },
      { name: "onRawScan", type: "(raw: string) => void", required: false, description: "Callback for non-invoice QR strings", zhDescription: "非發票 QR 回呼" },
      { name: "oneShot", type: "boolean", default: "true", required: false, description: "Auto-stop after first successful scan", zhDescription: "首次掃描成功後自動停止" },
      { name: "width", type: "number", default: "320", required: false, description: "Video preview width in pixels", zhDescription: "影像預覽寬度" },
    ],
    version: "0.1.0",
    source: "components/taiwan/EInvoiceQRScanner/index.tsx",
    dependencies: [],
    status: "beta",
  },
  {
    slug: "taiwan-currency-input",
    name: "TaiwanCurrencyInput",
    zhName: "新台幣金額輸入",
    description:
      "Taiwan currency input with auto comma formatting and optional 大寫中文 (capital-form Chinese) conversion required by Taiwan legal contracts, cheques, and 公文 (e.g. 1,234,567 → 壹佰貳拾參萬肆仟伍佰陸拾柒元整).",
    zhDescription:
      "新台幣金額輸入，自動千分位分隔，並可顯示法律文件、支票、公文要求的大寫中文金額（如：1,234,567 → 壹佰貳拾參萬肆仟伍佰陸拾柒元整）。",
    category: "finance",
    tags: ["大寫中文", "千分位", "公文格式", "支票"],
    props: [
      { name: "value", type: "number | null", required: true, description: "Current numeric value", zhDescription: "目前數值" },
      { name: "onChange", type: "(value: number | null) => void", required: true, description: "Change callback", zhDescription: "變更回呼" },
      { name: "showCapital", type: "boolean", default: "true", required: false, description: "Show 大寫中文 conversion", zhDescription: "顯示大寫中文" },
      { name: "symbol", type: "string", default: '"NT$"', required: false, description: "Currency symbol prefix", zhDescription: "貨幣符號" },
      { name: "capitalSuffix", type: '"元整" | "元" | ""', default: '"元整"', required: false, description: "Suffix for capital form", zhDescription: "大寫後綴" },
      { name: "maxDigits", type: "number", default: "13", required: false, description: "Max digits accepted", zhDescription: "最大位數" },
      { name: "placeholder", type: "string", default: '"0"', required: false, description: "Placeholder", zhDescription: "佔位文字" },
      { name: "disabled", type: "boolean", default: "false", required: false, description: "Disable input", zhDescription: "停用輸入" },
    ],
    version: "0.1.0",
    source: "components/taiwan/TaiwanCurrencyInput/index.tsx",
    dependencies: ["lib/currency-tw.ts"],
    status: "stable",
  },
  {
    slug: "roc-date-range-picker",
    name: "ROCDateRangePicker",
    zhName: "民國日期範圍選擇器",
    description:
      "ROC (民國) date range picker — composes two ROCDatePickers with cross-field validation so the end date cannot be before the start. Auto-calculates the day count.",
    zhDescription:
      "民國紀年日期範圍選擇器，自動驗證起訖日期順序、計算總天數，由兩個 ROCDatePicker 組合而成。",
    category: "date",
    tags: ["民國紀年", "日期範圍", "validation", "天數計算"],
    props: [
      { name: "value", type: "ROCDateRange", required: true, description: "Current range value", zhDescription: "目前範圍值" },
      { name: "onChange", type: "(range: ROCDateRange) => void", required: true, description: "Change callback", zhDescription: "變更回呼" },
      { name: "minDate", type: "Date", required: false, description: "Outer min date constraint", zhDescription: "整體最小日期" },
      { name: "maxDate", type: "Date", required: false, description: "Outer max date constraint", zhDescription: "整體最大日期" },
      { name: "startPlaceholder", type: "string", default: '"起始日期"', required: false, description: "Start picker placeholder", zhDescription: "起始日佔位" },
      { name: "endPlaceholder", type: "string", default: '"結束日期"', required: false, description: "End picker placeholder", zhDescription: "結束日佔位" },
      { name: "disabled", type: "boolean", default: "false", required: false, description: "Disable both pickers", zhDescription: "停用全部" },
      { name: "showGregorianSub", type: "boolean", default: "true", required: false, description: "Show Gregorian subtitle", zhDescription: "顯示西元副標" },
      { name: "separator", type: "React.ReactNode", default: '"→"', required: false, description: "Between-pickers separator", zhDescription: "中間分隔符" },
    ],
    version: "0.1.0",
    source: "components/taiwan/ROCDateRangePicker/index.tsx",
    dependencies: ["components/taiwan/ROCDatePicker"],
    status: "stable",
  },
  {
    slug: "tax-bracket-calculator",
    name: "TaxBracketCalculator",
    zhName: "個人綜合所得稅試算",
    description:
      "Taiwan personal income tax (個人綜合所得稅) bracket calculator with 5 progressive brackets (5/12/20/30/40%). Shows total tax, marginal + effective rates, and a per-bracket visualisation. Uses 2025 brackets per 財政部 by default; pass custom brackets for older tax years.",
    zhDescription:
      "依財政部公告之 2025 年 5 級累進稅率（5/12/20/30/40%）試算個人綜合所得稅，顯示應納稅額、邊際與有效稅率、分級可視化長條圖。可傳入自訂稅率表進行情境模擬。",
    category: "tax",
    tags: ["個人所得稅", "5 級累進", "財政部 2025", "累進差額"],
    props: [
      { name: "income", type: "number", required: false, description: "Controlled income value", zhDescription: "受控所得值" },
      { name: "onIncomeChange", type: "(income: number | null) => void", required: false, description: "Income change callback", zhDescription: "所得變更回呼" },
      { name: "defaultIncome", type: "number", default: "1000000", required: false, description: "Initial income for uncontrolled use", zhDescription: "預設所得" },
      { name: "brackets", type: "readonly TaxBracket[]", required: false, description: "Override brackets (e.g. previous tax years)", zhDescription: "覆寫稅率表" },
      { name: "showBreakdown", type: "boolean", default: "true", required: false, description: "Show per-bracket detail bars", zhDescription: "顯示分級長條圖" },
    ],
    version: "0.1.0",
    source: "components/taiwan/TaxBracketCalculator/index.tsx",
    dependencies: ["lib/tax-bracket-tw.ts", "lib/currency-tw.ts"],
    status: "stable",
  },
  {
    slug: "taiwan-calendar-month",
    name: "TaiwanCalendarMonth",
    zhName: "台灣月曆",
    description:
      "Full month calendar grid with ROC year header, weekday labels, weekend tinting, holiday badges (via TaiwanHolidayBadge), prev/next navigation, and full keyboard support (arrow keys, Enter to select).",
    zhDescription:
      "完整月曆網格，含民國年標題、週末色調、國定假日標記（整合 TaiwanHolidayBadge）、前後月切換按鈕、完整鍵盤導覽支援。",
    category: "date",
    tags: ["月曆", "民國紀年", "假日標記", "鍵盤導覽"],
    props: [
      { name: "year", type: "number", required: true, description: "Gregorian year", zhDescription: "西元年" },
      { name: "month", type: "number", required: true, description: "Month (0-indexed: 0 = January)", zhDescription: "月份（0 = 一月）" },
      { name: "value", type: "Date | null", required: false, description: "Selected date", zhDescription: "已選日期" },
      { name: "onSelect", type: "(date: Date) => void", required: false, description: "Cell click callback", zhDescription: "點擊日期回呼" },
      { name: "onMonthChange", type: "(year: number, month: number) => void", required: false, description: "Month navigation callback", zhDescription: "切換月份回呼" },
      { name: "showNav", type: "boolean", default: "true", required: false, description: "Show prev/next buttons", zhDescription: "顯示前後月按鈕" },
      { name: "english", type: "boolean", default: "false", required: false, description: "English weekday headers", zhDescription: "英文星期標題" },
    ],
    version: "0.1.0",
    source: "components/taiwan/TaiwanCalendarMonth/index.tsx",
    dependencies: ["components/taiwan/TaiwanHolidayBadge"],
    status: "stable",
  },
  {
    slug: "health-insurance-calculator",
    name: "HealthInsuranceCalculator",
    zhName: "健保費試算",
    description:
      "全民健康保險 (NHI) premium calculator for category-1 employees. Computes insured-amount bracket from monthly salary, applies the 5.17% premium rate, and shows the employee/employer/government three-way split with dependent multiplier (capped at 3).",
    zhDescription:
      "依 衛福部健保署 投保金額分級表計算每月健保費，含員工/雇主/政府三方分攤、眷屬人數加成（上限 3 人）。費率採 2026 年公告值 5.17%。",
    category: "tax",
    tags: ["健保", "NHI", "社會保險", "薪資", "雇主分攤"],
    props: [
      { name: "defaultIncome", type: "number", default: "50000", required: false, description: "Initial monthly income", zhDescription: "預設月薪" },
      { name: "defaultDependents", type: "number", default: "0", required: false, description: "Initial dependent count", zhDescription: "預設眷屬人數" },
      { name: "income", type: "number", required: false, description: "Controlled monthly income", zhDescription: "受控月薪" },
      { name: "onIncomeChange", type: "(income: number) => void", required: false, description: "Income change callback", zhDescription: "月薪變更回呼" },
      { name: "dependents", type: "number", required: false, description: "Controlled dependent count", zhDescription: "受控眷屬人數" },
      { name: "onDependentsChange", type: "(n: number) => void", required: false, description: "Dependent change callback", zhDescription: "眷屬人數變更回呼" },
      { name: "premiumRate", type: "number", default: "0.0517", required: false, description: "Override premium rate", zhDescription: "覆寫費率" },
      { name: "showAnnual", type: "boolean", default: "true", required: false, description: "Show annual employee summary", zhDescription: "顯示年度員工負擔" },
    ],
    version: "0.1.0",
    source: "components/taiwan/HealthInsuranceCalculator/index.tsx",
    dependencies: ["lib/health-insurance-tw.ts", "lib/currency-tw.ts"],
    status: "stable",
  },
  {
    slug: "taiwan-mrt-picker",
    name: "TaiwanMRTPicker",
    zhName: "捷運車站選擇器",
    description:
      "Picker for Taipei Metro (TRTC), Kaohsiung Metro (KRTC), and Taichung Metro (TMRT) stations. Searchable by 中文/English name or station code, browsable by line with color-coded line tags. Bundles current station data; transfer markers shown inline.",
    zhDescription:
      "支援台北、高雄、台中三大捷運系統，含路線顏色標記、轉乘站標記、中英搜尋。資料截至 2026-04，可內建使用或外部覆寫。",
    category: "address",
    tags: ["捷運", "MRT", "車站", "台北捷運", "高雄捷運", "台中捷運"],
    props: [
      { name: "value", type: "MRTSelection | null", required: false, description: "Currently-selected station", zhDescription: "已選車站" },
      { name: "onChange", type: "(selection: MRTSelection | null) => void", required: false, description: "Selection change callback", zhDescription: "選擇變更回呼" },
      { name: "systems", type: "(\"trtc\" | \"krtc\" | \"tmrt\")[]", required: false, description: "Restrict to specific systems", zhDescription: "限制系統" },
      { name: "lang", type: "\"zh\" | \"en\"", default: "\"zh\"", required: false, description: "Display language preference", zhDescription: "顯示語言" },
      { name: "placeholder", type: "string", required: false, description: "Search placeholder", zhDescription: "搜尋框佔位文字" },
    ],
    version: "0.1.0",
    source: "components/taiwan/TaiwanMRTPicker/index.tsx",
    dependencies: ["data/taiwan-mrt.json"],
    status: "stable",
  },
  {
    slug: "taiwan-convenience-store-picker",
    name: "TaiwanConvenienceStorePicker",
    zhName: "超商取貨選擇器",
    description:
      "Convenience-store pickup-location picker for Taiwan e-commerce checkouts. Supports the four major chains (7-ELEVEN, FamilyMart, Hi-Life, OK Mart) with chain/city/keyword filtering. Ships with a demo dataset of ~50 stores; production deployments pass live data via the `stores` prop (e.g. ECPay logistics API).",
    zhDescription:
      "台灣超商取貨門市選擇器，支援四大連鎖（7-ELEVEN、全家、萊爾富、OK 超商）。內建 ~50 家示範門市，可透過 stores prop 串接 ECPay/Pay2go 物流 API 即時門市清單。",
    category: "address",
    tags: ["超商", "取貨", "7-ELEVEN", "全家", "FamilyMart", "電商", "物流"],
    props: [
      { name: "value", type: "ConvenienceStore | null", required: false, description: "Currently-selected store", zhDescription: "已選門市" },
      { name: "onChange", type: "(store: ConvenienceStore | null) => void", required: false, description: "Selection change callback", zhDescription: "選擇變更回呼" },
      { name: "stores", type: "ConvenienceStore[]", required: false, description: "Override bundled demo dataset with live data", zhDescription: "覆寫內建門市資料" },
      { name: "chains", type: "ConvenienceChain[]", required: false, description: "Restrict to specific chains", zhDescription: "限制連鎖品牌" },
      { name: "defaultCity", type: "string", required: false, description: "Initial city filter", zhDescription: "預設縣市" },
    ],
    version: "0.1.0",
    source: "components/taiwan/TaiwanConvenienceStorePicker/index.tsx",
    dependencies: ["data/taiwan-convenience-stores.json"],
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
  { key: "map", label: "Map", zhLabel: "地圖" },
  { key: "tax", label: "Tax", zhLabel: "稅務" },
];

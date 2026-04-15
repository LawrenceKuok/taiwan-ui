"use client";

export type PaymentProvider = "linepay" | "jkopay" | "streetpay";

export interface TaiwanPaymentButtonProps {
  provider: PaymentProvider;
  amount?: number;
  onClick: (provider: PaymentProvider) => void;
  loading?: boolean;
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
}

const PROVIDER_CONFIG: Record<
  string,
  { label: string; bg: string; hover: string }
> = {
  linepay: { label: "LINE Pay", bg: "#00C300", hover: "brightness(0.92)" },
  jkopay: { label: "JKO Pay", bg: "#FF6B00", hover: "brightness(0.92)" },
  streetpay: { label: "JKO Pay", bg: "#FF6B00", hover: "brightness(0.92)" },
};

const SIZE_CLASSES = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-5 py-2.5 text-base",
  lg: "px-7 py-3.5 text-lg",
};

export default function TaiwanPaymentButton({
  provider,
  amount,
  onClick,
  loading = false,
  disabled = false,
  size = "md",
  fullWidth = false,
}: TaiwanPaymentButtonProps) {
  const config = PROVIDER_CONFIG[provider] || PROVIDER_CONFIG.jkopay;

  const label = amount
    ? `用 ${config.label} 付款 · NT$ ${amount.toLocaleString()}`
    : `用 ${config.label} 付款`;

  return (
    <button
      type="button"
      disabled={disabled || loading}
      onClick={() => !disabled && !loading && onClick(provider)}
      className={`
        inline-flex items-center justify-center rounded-lg font-bold text-white transition-all
        ${SIZE_CLASSES[size]}
        ${fullWidth ? "w-full" : ""}
        ${disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}
      `}
      style={{
        backgroundColor: config.bg,
        filter: disabled ? undefined : undefined,
        minWidth: loading ? "auto" : undefined,
      }}
      onMouseEnter={(e) => {
        if (!disabled && !loading) {
          (e.currentTarget as HTMLButtonElement).style.filter = config.hover;
        }
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLButtonElement).style.filter = "none";
      }}
    >
      {loading ? (
        <svg
          className="animate-spin h-5 w-5"
          viewBox="0 0 24 24"
          fill="none"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>
      ) : (
        label
      )}
    </button>
  );
}

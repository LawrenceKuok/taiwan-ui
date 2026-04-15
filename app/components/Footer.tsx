import Link from "next/link";

const SECTIONS = [
  {
    title: "元件庫",
    subtitle: "Components",
    links: [
      { href: "/components", label: "瀏覽所有元件" },
      { href: "/components?category=identity", label: "身分驗證" },
      { href: "/components?category=payment", label: "支付元件" },
      { href: "/components?category=invoice", label: "發票元件" },
    ],
  },
  {
    title: "社群",
    subtitle: "Community",
    links: [
      { href: "/changelog", label: "變更日誌 Changelog" },
      { href: "/contributing", label: "貢獻指南 Contributing" },
      { href: "/submit", label: "提交元件 Submit" },
    ],
  },
  {
    title: "資源",
    subtitle: "Resources",
    links: [
      { href: "/api/registry", label: "Registry API" },
      { href: "/demo", label: "元件文件 Docs" },
      { href: "/form", label: "表單範例 Form example" },
    ],
  },
  {
    title: "法務",
    subtitle: "Legal",
    links: [
      { href: "/privacy", label: "隱私權 Privacy" },
      { href: "/terms", label: "使用條款 Terms" },
      { href: "/security", label: "資安政策 Security" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-[var(--card-border)] bg-[var(--background)]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-8">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 mb-3">
              <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white text-xs font-bold">
                TW
              </div>
              <span className="font-bold text-sm">台灣 UI</span>
            </Link>
            <p className="text-xs text-[var(--muted)] leading-relaxed max-w-xs">
              專為台灣數位服務打造的開源 React 元件庫。
            </p>
            <p className="text-xs text-[var(--muted)] leading-relaxed max-w-xs mt-1">
              Open-source React components for Taiwan digital services.
            </p>
          </div>

          {SECTIONS.map((section) => (
            <div key={section.title}>
              <h3 className="text-xs font-bold text-[var(--foreground)] mb-1">{section.title}</h3>
              <p className="text-[10px] text-[var(--muted)] uppercase tracking-wider mb-3">
                {section.subtitle}
              </p>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-xs text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-6 border-t border-[var(--card-border)] flex flex-wrap items-center justify-between gap-2">
          <p className="text-[10px] text-[var(--muted)]">
            © 2026 Taiwan UI. MIT License. Built in Taipei.
          </p>
          <p className="text-[10px] text-[var(--muted)] font-mono">
            npx taiwan-ui add &lt;component&gt;
          </p>
        </div>
      </div>
    </footer>
  );
}

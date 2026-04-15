import type { PropDef } from "@/lib/registry";

export default function PropsTable({ props }: { props: PropDef[] }) {
  if (props.length === 0) {
    return (
      <p className="text-sm text-[var(--muted)] italic">
        Props documentation coming soon.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-[var(--card-border)]">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-[var(--surface)] text-left">
            <th className="px-4 py-3 font-semibold text-xs text-[var(--muted)] uppercase tracking-wider">Prop</th>
            <th className="px-4 py-3 font-semibold text-xs text-[var(--muted)] uppercase tracking-wider">Type</th>
            <th className="px-4 py-3 font-semibold text-xs text-[var(--muted)] uppercase tracking-wider">Default</th>
            <th className="px-4 py-3 font-semibold text-xs text-[var(--muted)] uppercase tracking-wider hidden sm:table-cell">說明</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--card-border)]">
          {props.map((p) => (
            <tr key={p.name} className="hover:bg-[var(--surface)] transition-colors">
              <td className="px-4 py-3">
                <code className="text-xs font-mono text-blue-400 bg-blue-500/10 px-1.5 py-0.5 rounded">
                  {p.name}
                </code>
                {p.required && (
                  <span className="ml-1.5 text-[10px] text-red-400">*</span>
                )}
              </td>
              <td className="px-4 py-3">
                <code className="text-xs font-mono text-[var(--muted)]">{p.type}</code>
              </td>
              <td className="px-4 py-3 text-xs text-[var(--muted)]">
                {p.default || "—"}
              </td>
              <td className="px-4 py-3 text-xs text-[var(--muted)] hidden sm:table-cell">
                {p.zhDescription}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

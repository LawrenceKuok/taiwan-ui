import type { Metadata } from "next";
import { CHANGELOG } from "@/lib/changelog";

export const metadata: Metadata = {
  title: "Changelog | Taiwan UI",
  description: "Version history and release notes for Taiwan UI.",
};

const TYPE_STYLES = {
  major: "bg-purple-500/15 text-purple-400 border-purple-500/20",
  minor: "bg-blue-500/15 text-blue-400 border-blue-500/20",
  patch: "bg-gray-500/15 text-gray-400 border-gray-500/20",
};

const CHANGE_STYLES: Record<string, string> = {
  added: "bg-green-500/15 text-green-400",
  changed: "bg-blue-500/15 text-blue-400",
  fixed: "bg-yellow-500/15 text-yellow-400",
  deprecated: "bg-orange-500/15 text-orange-400",
  removed: "bg-red-500/15 text-red-400",
};

export default function ChangelogPage() {
  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold font-serif mb-2">變更日誌</h1>
          <p className="text-[var(--muted)] text-sm">
            Changelog · Version history for Taiwan UI.
          </p>
        </div>

        <div className="space-y-10">
          {CHANGELOG.map((entry) => (
            <article
              key={entry.version}
              className="relative pl-6 border-l-2 border-[var(--card-border)]"
            >
              <div className="absolute w-3 h-3 rounded-full bg-blue-500 -left-[7px] top-1" />
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <h2 className="text-xl font-bold font-mono">v{entry.version}</h2>
                <span
                  className={`px-2 py-0.5 text-[10px] font-medium rounded-full border ${TYPE_STYLES[entry.type]}`}
                >
                  {entry.type}
                </span>
                <span className="text-xs text-[var(--muted)] font-mono">{entry.date}</span>
              </div>
              <p className="text-base font-semibold mb-1">{entry.zhTitle}</p>
              <p className="text-xs text-[var(--muted)] mb-4">{entry.title}</p>

              <ul className="space-y-2">
                {entry.changes.map((change, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 p-3 rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)]"
                  >
                    <span
                      className={`shrink-0 mt-0.5 px-1.5 py-0.5 rounded text-[10px] font-medium uppercase ${CHANGE_STYLES[change.type]}`}
                    >
                      {change.type}
                    </span>
                    <div className="text-xs space-y-0.5 min-w-0">
                      <p className="text-[var(--foreground)] leading-relaxed">
                        {change.zhDescription}
                      </p>
                      <p className="text-[var(--muted)] leading-relaxed">
                        {change.description}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";

const TABS = [
  { key: "basic", label: "Basic" },
  { key: "fullProps", label: "Full Props" },
  { key: "formIntegration", label: "Form Integration" },
] as const;

type TabKey = (typeof TABS)[number]["key"];

interface CodeExamplesProps {
  examples: Record<string, string>;
}

export default function CodeExamples({ examples }: CodeExamplesProps) {
  const [tab, setTab] = useState<TabKey>("basic");
  const [copied, setCopied] = useState(false);

  const code = examples[tab] || "";

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <div className="flex gap-1">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                tab === t.key
                  ? "bg-blue-500/15 text-blue-400"
                  : "text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface)]"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface)] transition-colors"
        >
          {copied ? (
            <>
              <svg className="w-3.5 h-3.5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              Copied
            </>
          ) : (
            <>
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Copy
            </>
          )}
        </button>
      </div>
      <pre className="p-4 rounded-lg bg-[var(--surface)] border border-[var(--card-border)] overflow-x-auto text-xs font-mono leading-relaxed text-[var(--foreground)]">
        {code}
      </pre>
    </div>
  );
}

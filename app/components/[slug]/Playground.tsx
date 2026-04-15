"use client";

import { useMemo, useState } from "react";
import type { ComponentMeta } from "@/lib/registry";
import {
  controlType,
  defaultPropValues,
  generateSnippet,
  isEditableProp,
  selectOptions,
  type PropValue,
} from "@/lib/code-generator";

export default function Playground({ component }: { component: ComponentMeta }) {
  const [values, setValues] = useState<Record<string, PropValue>>(() =>
    defaultPropValues(component)
  );
  const [copied, setCopied] = useState(false);

  const editable = component.props.filter(isEditableProp);

  const snippet = useMemo(() => generateSnippet(component, values), [component, values]);

  const set = (name: string, v: PropValue) =>
    setValues((prev) => ({ ...prev, [name]: v }));

  async function copy() {
    try {
      await navigator.clipboard.writeText(snippet);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // noop
    }
  }

  if (editable.length === 0) {
    return (
      <div className="p-6 rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] text-sm text-[var(--muted)]">
        No editable props for this component.
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 gap-4">
      {/* Controls */}
      <div className="p-5 rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] space-y-4">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
          Props
        </h3>
        {editable.map((p) => {
          const kind = controlType(p);
          const v = values[p.name];
          return (
            <div key={p.name} className="space-y-1">
              <label className="flex items-center justify-between text-xs">
                <span className="font-mono text-[var(--foreground)]">{p.name}</span>
                <span className="text-[10px] text-[var(--muted)] font-mono">{p.type}</span>
              </label>
              {kind === "boolean" && (
                <label className="flex items-center gap-2 cursor-pointer text-xs text-[var(--muted)]">
                  <input
                    type="checkbox"
                    checked={Boolean(v)}
                    onChange={(e) => set(p.name, e.target.checked)}
                    className="rounded"
                  />
                  {v ? "true" : "false"}
                </label>
              )}
              {kind === "select" && (
                <select
                  value={String(v ?? "")}
                  onChange={(e) => set(p.name, e.target.value)}
                  className="w-full px-2 py-1.5 rounded-md border border-[var(--input-border)] bg-[var(--input-bg)] text-xs"
                >
                  <option value="">(unset)</option>
                  {selectOptions(p).map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              )}
              {kind === "number" && (
                <input
                  type="number"
                  value={v === undefined || v === null ? "" : String(v)}
                  onChange={(e) =>
                    set(p.name, e.target.value === "" ? undefined : Number(e.target.value))
                  }
                  className="w-full px-2 py-1.5 rounded-md border border-[var(--input-border)] bg-[var(--input-bg)] text-xs font-mono"
                />
              )}
              {kind === "string" && (
                <input
                  type="text"
                  value={v === undefined || v === null ? "" : String(v)}
                  onChange={(e) => set(p.name, e.target.value || undefined)}
                  className="w-full px-2 py-1.5 rounded-md border border-[var(--input-border)] bg-[var(--input-bg)] text-xs font-mono"
                />
              )}
              {kind === "unknown" && (
                <p className="text-[10px] text-[var(--muted)]">
                  Non-editable type — edit in code.
                </p>
              )}
              <p className="text-[10px] text-[var(--muted)]">{p.zhDescription}</p>
            </div>
          );
        })}
      </div>

      {/* Generated snippet */}
      <div className="rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] overflow-hidden">
        <div className="flex items-center justify-between px-4 py-2 border-b border-[var(--card-border)]">
          <span className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
            Generated code
          </span>
          <button
            onClick={copy}
            className="px-2 py-0.5 rounded text-[10px] bg-blue-500/15 text-blue-400 hover:bg-blue-500/25 transition-colors"
          >
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
        <pre className="p-4 text-xs font-mono overflow-x-auto whitespace-pre text-[var(--foreground)]">
          {snippet}
        </pre>
      </div>
    </div>
  );
}

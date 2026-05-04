import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Contributing | Forge",
  description: "How to contribute components to Forge.",
};

export default function ContributingPage() {
  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold font-serif mb-2">貢獻指南</h1>
          <p className="text-[var(--muted)] text-sm">Contributing · How to add components to Forge.</p>
        </div>

        <div className="prose prose-invert max-w-none space-y-8">
          <section>
            <h2 className="text-xl font-bold mb-3">設計原則 · Design Principles</h2>
            <ul className="space-y-2 text-sm text-[var(--muted)]">
              <li className="flex gap-2"><span className="text-blue-400">✦</span><span><strong className="text-[var(--foreground)]">Zero runtime dependencies</strong> — 所有元件只依賴 React。No external runtime deps — components rely on React only.</span></li>
              <li className="flex gap-2"><span className="text-blue-400">✦</span><span><strong className="text-[var(--foreground)]">Taiwan-first</strong> — 解決台灣開發者日常遇到的在地化問題（民國紀年、統編、健保、車牌…）。Solve real problems Taiwan developers face.</span></li>
              <li className="flex gap-2"><span className="text-blue-400">✦</span><span><strong className="text-[var(--foreground)]">Dark-first, CSS variable theming</strong> — 使用 <code className="text-xs bg-[var(--surface)] px-1 rounded">var(--background)</code> 等變數，支援明暗模式。</span></li>
              <li className="flex gap-2"><span className="text-blue-400">✦</span><span><strong className="text-[var(--foreground)]">TypeScript-first</strong> — Export both the component and its types.</span></li>
              <li className="flex gap-2"><span className="text-blue-400">✦</span><span><strong className="text-[var(--foreground)]">{"\"use client\""} only when needed</strong> — Prefer server components where possible.</span></li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3">新增元件 · Adding a Component</h2>
            <ol className="list-decimal list-inside space-y-3 text-sm text-[var(--muted)]">
              <li>先在 <Link href="/submit" className="text-blue-400 hover:underline">/submit</Link> 提案，確認方向後再動工。<span className="block text-xs mt-1">Propose via /submit first to align on direction.</span></li>
              <li>在 <code className="text-xs bg-[var(--surface)] px-1 rounded">components/taiwan/&lt;ComponentName&gt;/index.tsx</code> 建立元件。</li>
              <li>在 <code className="text-xs bg-[var(--surface)] px-1 rounded">lib/registry.ts</code> 新增 metadata（slug、props 等）。</li>
              <li>在 <code className="text-xs bg-[var(--surface)] px-1 rounded">lib/code-examples/&lt;slug&gt;.ts</code> 提供三段範例（<code className="text-xs">basic</code> / <code className="text-xs">fullProps</code> / <code className="text-xs">formIntegration</code>）。</li>
              <li>在 <code className="text-xs bg-[var(--surface)] px-1 rounded">app/components/[slug]/ComponentDemo.tsx</code> 加入互動展示變體。</li>
              <li>執行 <code className="text-xs bg-[var(--surface)] px-1 rounded">npm run build</code>，確保無型別錯誤。</li>
              <li>開 PR，附上螢幕截圖與測試資料。</li>
            </ol>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3">程式碼風格 · Code Style</h2>
            <pre className="text-xs bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg p-4 overflow-x-auto">{`"use client";

import { useState } from "react";

export interface MyComponentProps {
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
}

export default function MyComponent({
  value,
  onChange,
  disabled = false,
}: MyComponentProps) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      className="w-full px-3 py-2 rounded-lg border border-[var(--input-border)] bg-[var(--input-bg)]"
    />
  );
}`}</pre>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3">回報問題 · Reporting Issues</h2>
            <p className="text-sm text-[var(--muted)]">
              發現 bug 或有新元件想法？<Link href="/submit" className="text-blue-400 hover:underline">前往 /submit 提交</Link>，或直接在 GitHub 開 issue。
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

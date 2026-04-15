"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { REGISTRY, CATEGORIES, type ComponentCategory } from "@/lib/registry";

const STATUS_STYLES = {
  stable: "bg-green-500/15 text-green-400",
  beta: "bg-yellow-500/15 text-yellow-400",
  planned: "bg-gray-500/15 text-gray-400",
};

type SortKey = "name" | "category" | "status";

function ComponentsPageInner() {
  const router = useRouter();
  const params = useSearchParams();

  const [search, setSearch] = useState(params.get("q") ?? "");
  const [category, setCategory] = useState<ComponentCategory | "all">(
    (params.get("category") as ComponentCategory | null) ?? "all"
  );
  const [statusFilter, setStatusFilter] = useState<"all" | "stable" | "planned">(
    (params.get("status") as "all" | "stable" | "planned" | null) ?? "all"
  );
  const [sort, setSort] = useState<SortKey>((params.get("sort") as SortKey) ?? "name");

  useEffect(() => {
    const sp = new URLSearchParams();
    if (search) sp.set("q", search);
    if (category !== "all") sp.set("category", category);
    if (statusFilter !== "all") sp.set("status", statusFilter);
    if (sort !== "name") sp.set("sort", sort);
    const qs = sp.toString();
    router.replace(qs ? `/components?${qs}` : "/components", { scroll: false });
  }, [search, category, statusFilter, sort, router]);

  const filtered = useMemo(() => {
    let list = REGISTRY;

    if (category !== "all") {
      list = list.filter((c) => c.category === category);
    }

    if (statusFilter === "stable") {
      list = list.filter((c) => c.status === "stable");
    } else if (statusFilter === "planned") {
      list = list.filter((c) => c.status !== "stable");
    }

    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.zhName.includes(q) ||
          c.description.toLowerCase().includes(q) ||
          c.zhDescription.includes(q) ||
          c.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    const sorted = [...list];
    if (sort === "name") sorted.sort((a, b) => a.name.localeCompare(b.name));
    else if (sort === "category") sorted.sort((a, b) => a.category.localeCompare(b.category));
    else if (sort === "status") sorted.sort((a, b) => a.status.localeCompare(b.status));
    return sorted;
  }, [search, category, statusFilter, sort]);

  const stableCount = REGISTRY.filter((c) => c.status === "stable").length;
  const plannedCount = REGISTRY.filter((c) => c.status !== "stable").length;

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold font-serif mb-2">
            元件庫
          </h1>
          <p className="text-[var(--muted)] text-sm">
            Browse {stableCount} production-ready components and {plannedCount} planned components for Taiwan digital services.
          </p>
        </div>

        {/* Search + Filters */}
        <div className="space-y-4 mb-8">
          {/* Search */}
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="搜尋元件 Search components..."
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-[var(--input-border)] bg-[var(--input-bg)] text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            />
          </div>

          {/* Category pills */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setCategory("all")}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                category === "all"
                  ? "bg-blue-500/15 text-blue-400"
                  : "text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface)]"
              }`}
            >
              All ({REGISTRY.length})
            </button>
            {CATEGORIES.filter((cat) => REGISTRY.some((c) => c.category === cat.key)).map((cat) => {
              const count = REGISTRY.filter((c) => c.category === cat.key).length;
              return (
                <button
                  key={cat.key}
                  onClick={() => setCategory(cat.key)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                    category === cat.key
                      ? "bg-blue-500/15 text-blue-400"
                      : "text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface)]"
                  }`}
                >
                  {cat.zhLabel} ({count})
                </button>
              );
            })}
          </div>

          {/* Status filter + Sort */}
          <div className="flex gap-2 items-center flex-wrap">
            <div className="flex gap-2">
              {([
                { key: "name", label: "Sort: Name" },
                { key: "category", label: "Sort: Category" },
                { key: "status", label: "Sort: Status" },
              ] as const).map((s) => (
                <button
                  key={s.key}
                  onClick={() => setSort(s.key)}
                  className={`px-3 py-1 rounded-md text-xs transition-colors ${
                    sort === s.key
                      ? "bg-[var(--card-bg)] text-[var(--foreground)] border border-[var(--card-border)]"
                      : "text-[var(--muted)] hover:text-[var(--foreground)]"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-2">
            {([
              { key: "all", label: "All" },
              { key: "stable", label: `Stable (${stableCount})` },
              { key: "planned", label: `Planned (${plannedCount})` },
            ] as const).map((f) => (
              <button
                key={f.key}
                onClick={() => setStatusFilter(f.key)}
                className={`px-3 py-1 rounded-md text-xs transition-colors ${
                  statusFilter === f.key
                    ? "bg-[var(--card-bg)] text-[var(--foreground)] border border-[var(--card-border)]"
                    : "text-[var(--muted)] hover:text-[var(--foreground)]"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Results count */}
        <p className="text-xs text-[var(--muted)] mb-4">
          {filtered.length} component{filtered.length !== 1 ? "s" : ""}
        </p>

        {/* Component Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((component) => {
            const isStable = component.status === "stable";
            return (
              <Link
                key={component.slug}
                href={isStable ? `/components/${component.slug}` : "#"}
                className={`group p-5 rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] transition-all ${
                  isStable
                    ? "hover:border-blue-500/40 hover:shadow-lg hover:shadow-blue-500/5"
                    : "opacity-60 cursor-default"
                }`}
                onClick={isStable ? undefined : (e) => e.preventDefault()}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className={`font-bold text-sm ${isStable ? "group-hover:text-blue-400" : ""} transition-colors`}>
                      {component.name}
                    </h3>
                    <p className="text-xs text-blue-400/80">{component.zhName}</p>
                  </div>
                  <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${STATUS_STYLES[component.status]}`}>
                    {component.status}
                  </span>
                </div>

                {/* Description */}
                <p className="text-xs text-[var(--muted)] leading-relaxed mb-4 line-clamp-2">
                  {component.zhDescription}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1">
                  {component.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="px-1.5 py-0.5 rounded text-[10px] bg-[var(--surface)] text-[var(--muted)] border border-[var(--card-border)]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between mt-4 pt-3 border-t border-[var(--card-border)]">
                  <span className="text-[10px] text-[var(--muted)] font-mono">v{component.version}</span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] bg-blue-500/10 text-blue-400">
                    {component.category}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <p className="text-[var(--muted)] text-sm">
              No components found matching your criteria.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ComponentsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[var(--background)]" />}>
      <ComponentsPageInner />
    </Suspense>
  );
}

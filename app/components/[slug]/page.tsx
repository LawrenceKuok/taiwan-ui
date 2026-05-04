import { notFound } from "next/navigation";
import Link from "next/link";
import { REGISTRY } from "@/lib/registry";
import { getComponentBySlug, getRelatedComponents, getAllSlugs } from "@/lib/registry-utils";
import PropsTable from "./PropsTable";
import ComponentDemo from "./ComponentDemo";
import CodeExamples from "./CodeExamples";
import Playground from "./Playground";

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const component = getComponentBySlug(slug);
  if (!component) return { title: "Not Found" };
  return {
    title: `${component.name} (${component.zhName}) | Forge`,
    description: component.description,
  };
}

const STATUS_STYLES = {
  stable: "bg-green-500/15 text-green-400 border-green-500/20",
  beta: "bg-yellow-500/15 text-yellow-400 border-yellow-500/20",
  planned: "bg-gray-500/15 text-gray-400 border-gray-500/20",
};

const STATUS_LABELS = {
  stable: "Stable",
  beta: "Beta",
  planned: "Planned",
};

async function loadCodeExamples(slug: string): Promise<Record<string, string>> {
  try {
    const mod = await import(`@/lib/code-examples/${slug}`);
    return { basic: mod.basic, fullProps: mod.fullProps, formIntegration: mod.formIntegration };
  } catch {
    return {};
  }
}

export default async function ComponentPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const component = getComponentBySlug(slug);
  if (!component) notFound();

  const related = getRelatedComponents(slug);
  const examples = await loadCodeExamples(slug);

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-[var(--muted)] mb-8">
          <Link href="/" className="hover:text-[var(--foreground)] transition-colors">首頁</Link>
          <span>/</span>
          <Link href="/components" className="hover:text-[var(--foreground)] transition-colors">元件庫</Link>
          <span>/</span>
          <span className="text-[var(--foreground)]">{component.name}</span>
        </nav>

        {/* Hero */}
        <div className="mb-10">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className={`inline-block px-2 py-0.5 text-[10px] font-medium rounded-full border ${STATUS_STYLES[component.status]}`}>
              {STATUS_LABELS[component.status]}
            </span>
            <span className="text-[10px] text-[var(--muted)] font-mono">v{component.version}</span>
            <span className="px-2 py-0.5 text-[10px] rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
              {component.category}
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold font-serif mb-1">
            {component.name}
          </h1>
          <p className="text-lg text-blue-400/80 mb-3">{component.zhName}</p>
          <p className="text-sm text-[var(--muted)] leading-relaxed max-w-2xl">
            {component.zhDescription}
          </p>
          <p className="text-sm text-[var(--muted)] leading-relaxed max-w-2xl mt-1">
            {component.description}
          </p>
        </div>

        {/* Installation */}
        <section className="mb-10">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 7.5l3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0021 18V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v12a2.25 2.25 0 002.25 2.25z" />
            </svg>
            Installation
          </h2>
          <div className="grid sm:grid-cols-2 gap-3">
            <div className="p-4 rounded-lg border border-[var(--card-border)] bg-[var(--surface)]">
              <p className="text-[10px] text-[var(--muted)] uppercase tracking-wider mb-2 font-semibold">CLI</p>
              <code className="text-xs font-mono text-[var(--foreground)]">npx taiwan-ui add {slug}</code>
            </div>
            <div className="p-4 rounded-lg border border-[var(--card-border)] bg-[var(--surface)]">
              <p className="text-[10px] text-[var(--muted)] uppercase tracking-wider mb-2 font-semibold">npm package</p>
              <code className="text-xs font-mono text-[var(--foreground)]">npm install @taiwan-ui/react</code>
            </div>
          </div>
          {component.dependencies.length > 0 && (
            <p className="text-xs text-[var(--muted)] mt-3">
              Requires: {component.dependencies.join(", ")}
            </p>
          )}
        </section>

        {/* Live Demo */}
        <section className="mb-10">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 010 1.972l-11.54 6.347a1.125 1.125 0 01-1.667-.986V5.653z" />
            </svg>
            Live Demo
          </h2>
          <ComponentDemo slug={slug} />
        </section>

        {/* Props API */}
        <section className="mb-10">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.298 1.476l-1.003.826c-.3.245-.467.616-.467 1.003v.134c0 .387.167.758.467 1.003l1.003.826c.424.35.534.955.298 1.476l-1.296 2.247a1.125 1.125 0 01-1.37.49l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.298-1.476l1.004-.826c.3-.245.466-.616.466-1.003v-.134c0-.387-.166-.758-.466-1.003l-1.004-.826a1.125 1.125 0 01-.298-1.476l1.297-2.247a1.125 1.125 0 011.37-.49l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.28z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Props API
          </h2>
          <PropsTable props={component.props} />
        </section>

        {/* Playground */}
        <section className="mb-10">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
            </svg>
            Playground
          </h2>
          <Playground component={component} />
        </section>

        {/* Code Examples */}
        {Object.keys(examples).length > 0 && (
          <section className="mb-10">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
              </svg>
              Code Examples
            </h2>
            <CodeExamples examples={examples} />
          </section>
        )}

        {/* Tags */}
        <section className="mb-10">
          <div className="flex flex-wrap gap-2">
            {component.tags.map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-1 rounded-full text-xs bg-[var(--surface)] text-[var(--muted)] border border-[var(--card-border)]"
              >
                {tag}
              </span>
            ))}
          </div>
        </section>

        {/* Related Components */}
        {related.length > 0 && (
          <section className="border-t border-[var(--card-border)] pt-10">
            <h2 className="text-lg font-bold mb-4">Related Components</h2>
            <div className="grid sm:grid-cols-3 gap-3">
              {related.map((r) => (
                <Link
                  key={r.slug}
                  href={`/components/${r.slug}`}
                  className="p-4 rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] hover:border-blue-500/30 transition-colors group"
                >
                  <h3 className="font-bold text-sm group-hover:text-blue-400 transition-colors">
                    {r.name}
                  </h3>
                  <p className="text-xs text-blue-400/80">{r.zhName}</p>
                  <p className="text-xs text-[var(--muted)] mt-1 line-clamp-2">
                    {r.zhDescription}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

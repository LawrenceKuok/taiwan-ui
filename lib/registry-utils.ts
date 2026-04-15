import { REGISTRY, type ComponentMeta, type ComponentCategory } from "./registry";

export function getComponentBySlug(slug: string): ComponentMeta | undefined {
  return REGISTRY.find((c) => c.slug === slug);
}

export function getComponentsByCategory(category: ComponentCategory): ComponentMeta[] {
  return REGISTRY.filter((c) => c.category === category);
}

export function getStableComponents(): ComponentMeta[] {
  return REGISTRY.filter((c) => c.status === "stable");
}

export function getPlannedComponents(): ComponentMeta[] {
  return REGISTRY.filter((c) => c.status !== "stable");
}

export function searchComponents(query: string): ComponentMeta[] {
  const q = query.toLowerCase();
  return REGISTRY.filter(
    (c) =>
      c.name.toLowerCase().includes(q) ||
      c.zhName.includes(q) ||
      c.description.toLowerCase().includes(q) ||
      c.zhDescription.includes(q) ||
      c.tags.some((t) => t.toLowerCase().includes(q))
  );
}

export function getRelatedComponents(slug: string, limit = 3): ComponentMeta[] {
  const component = getComponentBySlug(slug);
  if (!component) return [];
  return REGISTRY.filter(
    (c) => c.slug !== slug && c.category === component.category && c.status === "stable"
  ).slice(0, limit);
}

export function getAllSlugs(): string[] {
  return REGISTRY.filter((c) => c.status === "stable").map((c) => c.slug);
}

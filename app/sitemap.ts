import type { MetadataRoute } from "next";
import { REGISTRY } from "@/lib/registry";

const SITE = "https://taiwan-ui.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticRoutes = [
    "",
    "/components",
    "/compare",
    "/demo",
    "/form",
    "/changelog",
    "/contributing",
    "/submit",
    "/privacy",
    "/terms",
    "/security",
  ];

  const componentRoutes = REGISTRY.filter((c) => c.status !== "planned").map((c) => ({
    url: `${SITE}/components/${c.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [
    ...staticRoutes.map((path) => ({
      url: `${SITE}${path}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: path === "" ? 1.0 : 0.7,
    })),
    ...componentRoutes,
  ];
}

import type { NextRequest } from "next/server";
import { REGISTRY, type ComponentCategory, type ComponentStatus } from "@/lib/registry";

export const dynamic = "force-static";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const category = searchParams.get("category") as ComponentCategory | null;
  const status = searchParams.get("status") as ComponentStatus | null;
  const search = searchParams.get("search")?.toLowerCase() ?? "";

  let list = REGISTRY;
  if (category) list = list.filter((c) => c.category === category);
  if (status) list = list.filter((c) => c.status === status);
  if (search) {
    list = list.filter(
      (c) =>
        c.name.toLowerCase().includes(search) ||
        c.zhName.includes(search) ||
        c.description.toLowerCase().includes(search) ||
        c.zhDescription.includes(search) ||
        c.tags.some((t) => t.toLowerCase().includes(search))
    );
  }

  return Response.json(
    {
      count: list.length,
      components: list.map((c) => ({
        slug: c.slug,
        name: c.name,
        zhName: c.zhName,
        description: c.description,
        zhDescription: c.zhDescription,
        category: c.category,
        tags: c.tags,
        version: c.version,
        status: c.status,
        dependencies: c.dependencies,
      })),
    },
    {
      headers: {
        "Cache-Control": "public, max-age=300, s-maxage=3600",
        "Access-Control-Allow-Origin": "*",
        "X-Robots-Tag": "noindex, nofollow",
      },
    }
  );
}

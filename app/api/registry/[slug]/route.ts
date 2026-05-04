import { readFile } from "node:fs/promises";
import path from "node:path";
import { REGISTRY } from "@/lib/registry";
import { getComponentBySlug } from "@/lib/registry-utils";

export const dynamic = "force-static";

export async function generateStaticParams() {
  return REGISTRY.map((c) => ({ slug: c.slug }));
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const component = getComponentBySlug(slug);

  if (!component) {
    return Response.json({ error: "Component not found" }, { status: 404 });
  }

  let source = "";
  try {
    const filePath = path.join(process.cwd(), component.source);
    source = await readFile(filePath, "utf-8");
  } catch {
    // source unavailable
  }

  return Response.json(
    {
      ...component,
      files: [
        {
          path: component.source,
          content: source,
        },
      ],
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

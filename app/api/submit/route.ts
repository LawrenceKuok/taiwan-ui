import type { NextRequest } from "next/server";
import { checkRateLimit, getClientIP } from "@/lib/rate-limit";

const WINDOW_MS = 60_000;
const LIMIT = 3;

interface SubmitPayload {
  name?: string;
  zhName?: string;
  category?: string;
  description?: string;
  useCase?: string;
  contactEmail?: string;
}

function sanitize(v: unknown, maxLen = 500): string {
  if (typeof v !== "string") return "";
  return v.slice(0, maxLen).replace(/[\u0000-\u001F\u007F]/g, "").trim();
}

export async function POST(request: NextRequest) {
  const ip = getClientIP(request.headers);
  const rl = await checkRateLimit({
    scope: "submit",
    key: ip,
    limit: LIMIT,
    windowMs: WINDOW_MS,
  });
  if (!rl.allowed) {
    const retryAfter = Math.max(Math.ceil((rl.resetAt - Date.now()) / 1000), 1);
    return Response.json(
      { error: "Too many requests. Please wait a minute and try again." },
      {
        status: 429,
        headers: {
          "Retry-After": String(retryAfter),
          "X-RateLimit-Limit": String(LIMIT),
          "X-RateLimit-Remaining": "0",
          "X-RateLimit-Reset": String(Math.ceil(rl.resetAt / 1000)),
        },
      }
    );
  }

  let body: SubmitPayload;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const name = sanitize(body.name, 80);
  const zhName = sanitize(body.zhName, 80);
  const category = sanitize(body.category, 40);
  const description = sanitize(body.description, 1000);
  const useCase = sanitize(body.useCase, 1000);
  const contactEmail = sanitize(body.contactEmail, 120);

  if (!name || !description) {
    return Response.json(
      { error: "`name` and `description` are required." },
      { status: 400 }
    );
  }

  // Honeypot / basic email shape check (contact is optional, but if present must look valid)
  if (contactEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail)) {
    return Response.json({ error: "Invalid email format." }, { status: 400 });
  }

  const title = `[Component proposal] ${name}${zhName ? ` (${zhName})` : ""}`;
  const issueBody = [
    `### Proposed component`,
    `- **Name**: ${name}`,
    zhName ? `- **中文名稱**: ${zhName}` : null,
    category ? `- **Category**: ${category}` : null,
    ``,
    `### Description`,
    description,
    ``,
    useCase ? `### Use case\n${useCase}\n` : null,
    contactEmail ? `### Contact\n${contactEmail}\n` : null,
    `---`,
    `_Submitted via [taiwan-ui.vercel.app/submit](https://taiwan-ui.vercel.app/submit)_`,
  ]
    .filter(Boolean)
    .join("\n");

  const repo = process.env.GITHUB_REPO; // e.g. "taiwan-ui/taiwan-ui"
  const token = process.env.GITHUB_TOKEN;

  // Fallback: no GitHub credentials configured — just echo a preview and a mailto.
  if (!repo || !token) {
    return Response.json({
      ok: true,
      mode: "preview",
      message:
        "Submission received. GitHub integration not configured on this deployment — a maintainer will see this in analytics. For an immediate response, open a GitHub issue.",
      issueTitle: title,
      issueBody,
    });
  }

  try {
    const res = await fetch(`https://api.github.com/repos/${repo}/issues`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        body: issueBody,
        labels: ["component-proposal", "community"],
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      return Response.json(
        { error: `GitHub API error: ${res.status}`, details: errText.slice(0, 300) },
        { status: 502 }
      );
    }

    const data = (await res.json()) as { html_url?: string; number?: number };
    return Response.json({
      ok: true,
      mode: "github",
      issueUrl: data.html_url,
      issueNumber: data.number,
    });
  } catch (err) {
    return Response.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}

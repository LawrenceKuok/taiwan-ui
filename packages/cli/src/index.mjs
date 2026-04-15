import { mkdir, writeFile, access } from "node:fs/promises";
import path from "node:path";

const DEFAULT_REGISTRY = process.env.TAIWAN_UI_REGISTRY || "https://taiwan-ui.vercel.app";
const DEFAULT_TARGET = "components/taiwan";

const c = {
  reset: "\x1b[0m",
  dim: "\x1b[2m",
  bold: "\x1b[1m",
  blue: "\x1b[34m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  red: "\x1b[31m",
};

function help() {
  console.log(`
  ${c.bold}taiwan-ui${c.reset} ${c.dim}— Taiwan-specific UI components for your project${c.reset}

  ${c.bold}Usage:${c.reset}
    taiwan-ui <command> [options]

  ${c.bold}Commands:${c.reset}
    ${c.green}list${c.reset}                    List all available components
    ${c.green}add${c.reset} <component>         Add a component to your project
    ${c.green}init${c.reset}                    Create ${DEFAULT_TARGET}/ directory

  ${c.bold}Options:${c.reset}
    --dir <path>            Target directory (default: ${DEFAULT_TARGET})
    --registry <url>        Registry URL (default: ${DEFAULT_REGISTRY})
    --force                 Overwrite existing files

  ${c.bold}Examples:${c.reset}
    ${c.dim}$${c.reset} taiwan-ui list
    ${c.dim}$${c.reset} taiwan-ui add roc-date-picker
    ${c.dim}$${c.reset} taiwan-ui add twid-input --dir src/components
`);
}

function parseArgs(argv) {
  const positional = [];
  const opts = { dir: DEFAULT_TARGET, registry: DEFAULT_REGISTRY, force: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--dir") opts.dir = argv[++i];
    else if (a === "--registry") opts.registry = argv[++i];
    else if (a === "--force") opts.force = true;
    else if (a === "-h" || a === "--help") opts.help = true;
    else positional.push(a);
  }
  return { positional, opts };
}

async function fetchJSON(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Registry request failed: ${res.status} ${res.statusText} (${url})`);
  return res.json();
}

async function exists(p) {
  try {
    await access(p);
    return true;
  } catch {
    return false;
  }
}

async function cmdList(opts) {
  const data = await fetchJSON(`${opts.registry}/api/registry`);
  console.log(`\n  ${c.bold}Available components${c.reset} ${c.dim}(${data.count} total)${c.reset}\n`);
  const pad = Math.max(...data.components.map((c) => c.slug.length));
  for (const comp of data.components) {
    const tag =
      comp.status === "stable"
        ? `${c.green}stable${c.reset}`
        : comp.status === "beta"
        ? `${c.yellow}beta${c.reset}`
        : `${c.dim}planned${c.reset}`;
    console.log(
      `  ${c.blue}${comp.slug.padEnd(pad)}${c.reset}  ${tag}  ${c.dim}${comp.zhName}${c.reset}  ${comp.description}`
    );
  }
  console.log(`\n  Add one: ${c.bold}taiwan-ui add <slug>${c.reset}\n`);
}

async function cmdInit(opts) {
  const dir = path.resolve(process.cwd(), opts.dir);
  await mkdir(dir, { recursive: true });
  console.log(`  ${c.green}✓${c.reset} Created ${c.dim}${opts.dir}${c.reset}`);
}

async function cmdAdd(slug, opts) {
  if (!slug) throw new Error("Missing component slug. Run: taiwan-ui list");

  const data = await fetchJSON(`${opts.registry}/api/registry/${slug}`);
  if (data.error) throw new Error(data.error);
  if (data.status !== "stable") {
    console.log(`  ${c.yellow}⚠${c.reset}  ${slug} is ${data.status} — not yet stable.`);
  }

  const files = data.files || [];
  if (files.length === 0) throw new Error(`No source files available for ${slug}`);

  const targetDir = path.resolve(process.cwd(), opts.dir);
  await mkdir(targetDir, { recursive: true });

  console.log(`\n  Adding ${c.bold}${data.name}${c.reset} ${c.dim}(${data.zhName})${c.reset}`);

  for (const file of files) {
    // file.path looks like: components/taiwan/ROCDatePicker/index.tsx
    // Write to: {opts.dir}/ROCDatePicker/index.tsx
    const segments = file.path.split("/");
    const idx = segments.indexOf("taiwan");
    const rel = idx >= 0 ? segments.slice(idx + 1).join("/") : segments.slice(-2).join("/");
    const outPath = path.join(targetDir, rel);

    if ((await exists(outPath)) && !opts.force) {
      console.log(`  ${c.yellow}↷${c.reset}  skip  ${c.dim}${path.relative(process.cwd(), outPath)}${c.reset} ${c.dim}(exists, use --force to overwrite)${c.reset}`);
      continue;
    }
    await mkdir(path.dirname(outPath), { recursive: true });
    await writeFile(outPath, file.content, "utf-8");
    console.log(`  ${c.green}✓${c.reset}  write ${path.relative(process.cwd(), outPath)}`);
  }

  if (data.dependencies && data.dependencies.length) {
    console.log(`\n  ${c.bold}Dependencies:${c.reset} ${data.dependencies.join(", ")}`);
    console.log(`  ${c.dim}Install with: npm install ${data.dependencies.join(" ")}${c.reset}`);
  } else {
    console.log(`\n  ${c.dim}Zero runtime dependencies. Import and use.${c.reset}`);
  }

  console.log(
    `\n  Import in your code:\n    ${c.blue}import ${data.name} from "@/${opts.dir}/${data.name}";${c.reset}\n`
  );
}

export async function run(argv) {
  const { positional, opts } = parseArgs(argv);
  const cmd = positional[0];

  if (opts.help || !cmd) return help();

  switch (cmd) {
    case "list":
      return cmdList(opts);
    case "init":
      return cmdInit(opts);
    case "add":
      return cmdAdd(positional[1], opts);
    default:
      console.log(`\n  ${c.red}Unknown command:${c.reset} ${cmd}`);
      help();
      process.exit(1);
  }
}

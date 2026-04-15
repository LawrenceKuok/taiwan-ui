import type { ComponentMeta, PropDef } from "./registry";

export type PropValue = string | number | boolean | null | undefined;

/** Heuristic: is this prop editable via playground? */
export function isEditableProp(prop: PropDef): boolean {
  const t = prop.type.toLowerCase();
  if (t.includes("=>")) return false; // function/callback
  if (t.includes("date") && !t.includes("string")) return false; // Date objects
  if (t.includes("[]")) return false; // arrays
  if (t.includes("{")) return false; // object literals
  return true;
}

/** Classify prop control type from its TS type string. */
export function controlType(prop: PropDef): "boolean" | "select" | "number" | "string" | "unknown" {
  const raw = prop.type.trim();
  if (/\bboolean\b/.test(raw)) return "boolean";
  if (/\bnumber\b/.test(raw)) return "number";
  // union of string literals: "a" | "b" | "c"
  if (/^("[^"]+"\s*\|\s*)+"[^"]+"$/.test(raw)) return "select";
  if (/\bstring\b/.test(raw)) return "string";
  return "unknown";
}

export function selectOptions(prop: PropDef): string[] {
  return prop.type
    .split("|")
    .map((s) => s.trim().replace(/^"|"$/g, ""))
    .filter((s) => /^[A-Za-z0-9_\-]+$/.test(s));
}

function formatValue(v: PropValue, type: string): string {
  if (v === undefined || v === null) return "";
  if (typeof v === "boolean") return v ? "{true}" : "{false}";
  if (typeof v === "number") return `{${v}}`;
  if (/\bstring\b/.test(type) && !/\|/.test(type)) return `"${String(v).replace(/"/g, '\\"')}"`;
  // union of literals — quote as string attr
  return `"${v}"`;
}

/** Generate JSX usage snippet for a component with given props. */
export function generateSnippet(
  component: ComponentMeta,
  values: Record<string, PropValue>
): string {
  const propStrings: string[] = [];

  for (const p of component.props) {
    const v = values[p.name];
    if (v === undefined || v === null || v === "") continue;
    if (typeof v === "boolean" && v === false) continue;

    // callbacks — emit placeholder
    if (p.type.includes("=>")) {
      propStrings.push(`${p.name}={${p.name}}`);
      continue;
    }

    const formatted = formatValue(v, p.type);
    if (!formatted) continue;
    propStrings.push(`${p.name}=${formatted}`);
  }

  const propsBlock = propStrings.length
    ? "\n  " + propStrings.join("\n  ") + "\n"
    : " ";

  return `import ${component.name} from "@/components/taiwan/${component.name}";\n\nexport default function Example() {\n  return (\n    <${component.name}${propsBlock}/>\n  );\n}\n`;
}

/** Sensible defaults for each prop based on type. */
export function defaultPropValues(component: ComponentMeta): Record<string, PropValue> {
  const out: Record<string, PropValue> = {};
  for (const p of component.props) {
    if (p.default) {
      const d = p.default.replace(/^"|"$/g, "");
      if (d === "true") out[p.name] = true;
      else if (d === "false") out[p.name] = false;
      else if (/^-?\d+(\.\d+)?$/.test(d)) out[p.name] = Number(d);
      else out[p.name] = d;
    }
  }
  return out;
}

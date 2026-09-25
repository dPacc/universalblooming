/**
 * Tiny inline-markup parser for content strings: **bold** and [text](href).
 * Parsed into tokens so both the React renderer and plain-text consumers
 * (JSON-LD answers, llms.txt, word counts) share one grammar.
 */

export type InlineToken =
  | { t: "text"; v: string }
  | { t: "bold"; v: string }
  | { t: "link"; v: string; href: string };

const RE = /\*\*(.+?)\*\*|\[([^\]]+)\]\(([^)\s]+)\)/g;

export function tokenize(src: string): InlineToken[] {
  const out: InlineToken[] = [];
  let last = 0;
  for (const m of src.matchAll(RE)) {
    if (m.index! > last) out.push({ t: "text", v: src.slice(last, m.index) });
    if (m[1] !== undefined) out.push({ t: "bold", v: m[1] });
    else out.push({ t: "link", v: m[2], href: m[3] });
    last = m.index! + m[0].length;
  }
  if (last < src.length) out.push({ t: "text", v: src.slice(last) });
  return out;
}

export function stripInline(src: string): string {
  return tokenize(src)
    .map((t) => t.v)
    .join("")
    .replace(/\{year\}/g, String(new Date().getFullYear()));
}

export function wordCount(texts: string[]): number {
  return texts.join(" ").split(/\s+/).filter(Boolean).length;
}

import type { Block, Section } from "@/content/types";
import type { Linker } from "@/lib/autolink";
import { Inline } from "./Inline";

const CALLOUT = {
  tip: { bg: "bg-green-soft", border: "border-green", icon: "💡", label: "Parent tip" },
  note: { bg: "bg-sky-soft", border: "border-sky", icon: "📌", label: "Good to know" },
  warning: { bg: "bg-orange-soft", border: "border-orange", icon: "⚠️", label: "Heads up" },
} as const;

export function BlockView({ block, linker }: { block: Block; linker?: Linker }) {
  switch (block.type) {
    case "p":
      return <p><Inline text={block.text} linker={linker} /></p>;
    case "h3":
      return <h3>{block.text}</h3>;
    case "ul":
      return <ul>{block.items.map((it, i) => <li key={i}><Inline text={it} linker={linker} /></li>)}</ul>;
    case "ol":
      return <ol>{block.items.map((it, i) => <li key={i}><Inline text={it} linker={linker} /></li>)}</ol>;
    case "checklist":
      return (
        <ul className="!pl-0 grid gap-2">
          {block.items.map((it, i) => (
            <li key={i} className="!mt-0 flex gap-3 rounded-2xl bg-white border-2 border-ink/10 px-4 py-3 before:!hidden">
              <span aria-hidden className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-lg bg-green text-white text-sm font-black">✓</span>
              <span><Inline text={it} linker={linker} /></span>
            </li>
          ))}
        </ul>
      );
    case "table":
      return (
        <figure>
          {block.caption && <figcaption className="pb-2 text-sm font-bold text-ink-soft">{block.caption}</figcaption>}
          <div className="table-scroll -mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0" tabIndex={0} role="region" aria-label={block.caption ?? "Table"}>
            <table className="min-w-[34rem]">
              <thead><tr>{block.head.map((h, i) => <th key={i} scope="col">{h}</th>)}</tr></thead>
              <tbody>
                {block.rows.map((r, i) => (
                  <tr key={i}>{r.map((c, j) => j === 0
                    ? <th key={j} scope="row"><Inline text={c} /></th>
                    : <td key={j}><Inline text={c} linker={linker} /></td>)}</tr>
                ))}
              </tbody>
            </table>
          </div>
          <p aria-hidden className="table-hint mt-2 text-xs font-bold text-ink-soft min-[36rem]:hidden">Swipe sideways to see the whole table 👉</p>
        </figure>
      );
    case "callout": {
      const c = CALLOUT[block.tone];
      return (
        <aside className={`${c.bg} border-l-[6px] ${c.border} rounded-2xl rounded-l-md px-5 py-4`}>
          <p className="!mt-0 font-display font-semibold text-lg flex items-center gap-2">
            <span aria-hidden>{c.icon}</span> {block.title || c.label}
          </p>
          <p className="!mt-1"><Inline text={block.text} linker={linker} /></p>
        </aside>
      );
    }
    case "quote":
      return (
        <blockquote className="relative rounded-3xl bg-yellow-soft px-6 py-5 font-display text-xl leading-snug">
          <span aria-hidden className="absolute -top-5 left-4 text-6xl text-pink leading-none">“</span>
          <Inline text={block.text} />
          {block.cite && <footer className="mt-2 font-sans text-sm font-bold text-ink-soft">{block.cite}</footer>}
        </blockquote>
      );
  }
}

export function SectionsView({ sections, linker }: { sections: Section[]; linker?: Linker }) {
  return (
    <>
      {sections.map((s) => (
        <section key={s.id} id={s.id} className="scroll-mt-28 [&+section]:mt-14">
          <h2 className="mb-5 text-3xl font-semibold sm:text-[2.1rem]">{s.title}</h2>
          <div className="prose-ub">
            {s.blocks.map((b, i) => <BlockView key={i} block={b} linker={linker} />)}
          </div>
        </section>
      ))}
    </>
  );
}

export function sectionsText(sections: Section[]): string[] {
  const out: string[] = [];
  for (const s of sections) {
    out.push(s.title);
    for (const b of s.blocks) {
      if ("text" in b) out.push(b.text);
      if ("items" in b) out.push(...b.items);
      if (b.type === "table") out.push(...b.rows.flat());
    }
  }
  return out;
}

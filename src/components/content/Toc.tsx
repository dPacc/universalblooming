import type { Section } from "@/content/types";

export function Toc({ sections, extra = [] }: { sections: Section[]; extra?: { id: string; title: string }[] }) {
  const items = [...sections.map((s) => ({ id: s.id, title: s.title })), ...extra];
  return (
    <nav aria-label="On this page" className="rounded-3xl border-[2.5px] border-ink/10 bg-white p-5">
      <p className="font-display text-lg font-semibold">On this page</p>
      <ol className="mt-3 grid gap-1.5 text-[0.95rem]">
        {items.map((s, i) => (
          <li key={s.id} className="flex gap-2">
            <span className="font-display font-semibold text-pink">{i + 1}.</span>
            <a href={`#${s.id}`} className="text-ink-soft hover:text-ink hover:underline underline-offset-4">
              {s.title}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}

import Link from "next/link";
import { programs } from "@/content/programs";
import { activities } from "@/content/activities";
import { guides } from "@/content/guides";
import { accentSoft, accentVar } from "@/lib/accent";
import { CARD_ROW, cardCol, tileCol } from "@/lib/grid";

/** Cross-silo link blocks. Every spoke links sideways (siblings) and across (other silos). */
export function RelatedGuides({ slugs, title = "Helpful guides for parents" }: { slugs: string[]; title?: string }) {
  const items = slugs.map((s) => guides.find((g) => g.slug === s)).filter(Boolean) as typeof guides;
  if (!items.length) return null;
  return (
    <section aria-label={title}>
      <h2 className="text-2xl font-semibold sm:text-3xl">{title}</h2>
      <ul className={`mt-5 ${CARD_ROW}`}>
        {items.map((g) => (
          <li key={g.slug} className={cardCol(items.length)}>
            <Link href={`/parents-guide/${g.slug}`} className={`card-pop !shadow-pop-sm flex h-full flex-col p-5 ${accentSoft[g.accent]}`}>
              <span className="text-xs font-extrabold uppercase tracking-wider text-ink-soft">{g.category}</span>
              <span className="mt-1.5 font-display text-lg font-semibold leading-snug">{g.title}</span>
              <span className="mt-2 text-sm text-ink-soft line-clamp-2">{g.excerpt}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function RelatedPrograms({ slugs, title = "Programs" }: { slugs?: string[]; title?: string }) {
  const items = slugs ? programs.filter((p) => slugs.includes(p.slug)) : programs;
  return (
    <section aria-label={title}>
      <h2 className="text-2xl font-semibold sm:text-3xl">{title}</h2>
      <ul className={`mt-5 grid gap-4 ${items.length === 2 ? "sm:grid-cols-2 lg:max-w-4xl" : items.length === 1 ? "sm:max-w-md" : "sm:grid-cols-3"}`}>
        {items.map((p) => (
          <li key={p.slug}>
            <Link href={`/programs/${p.slug}`} className="card-pop !shadow-pop-sm group flex h-full items-center gap-4 p-4">
              <span className={`grid h-14 w-14 shrink-0 place-items-center rounded-2xl text-3xl ${accentSoft[p.accent]}`} aria-hidden>{p.emoji}</span>
              <span>
                <span className="block font-display text-lg font-semibold">{p.name}</span>
                {p.ageLabel && <span className="text-sm font-bold" style={{ color: accentVar[p.accent] }}>{p.ageLabel}</span>}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function RelatedActivities({ slugs, title = "Activities children love" }: { slugs: string[]; title?: string }) {
  const items = slugs.map((s) => activities.find((a) => a.slug === s)).filter(Boolean) as typeof activities;
  if (!items.length) return null;
  return (
    <section aria-label={title}>
      <h2 className="text-2xl font-semibold sm:text-3xl">{title}</h2>
      <ul className={`mt-5 ${CARD_ROW}`}>
        {items.map((a) => (
          <li key={a.slug} className={tileCol(items.length)}>
            <Link href={`/activities/${a.slug}`} className={`card-pop !shadow-pop-sm group flex h-full flex-col p-4 ${accentSoft[a.accent]}`}>
              <span className="text-3xl group-hover:animate-wiggle" aria-hidden>{a.icon}</span>
              <span className="mt-2 font-display font-semibold leading-tight">{a.name}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

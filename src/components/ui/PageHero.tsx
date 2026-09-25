import type { Crumb } from "@/lib/schema";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { Star, Cloud, Wave } from "@/components/art/Doodles";

/** Shared inner-page hero: breadcrumb, H1, lede and a slot for art/mascot. */
export function PageHero({
  crumbs,
  eyebrow,
  title,
  lede,
  children,
  art,
  tone = "bg-yellow-soft",
}: {
  crumbs: Crumb[];
  eyebrow?: string;
  title: React.ReactNode;
  lede?: React.ReactNode;
  children?: React.ReactNode;
  art?: React.ReactNode;
  tone?: string;
}) {
  return (
    <section className={`relative overflow-hidden ${tone}`}>
      {/* Doodles live only in the side gutters, so they can never sit on top of text. */}
      <div aria-hidden className="pointer-events-none absolute inset-0 hidden md:block">
        <Cloud className="absolute -left-10 top-24 hidden w-28 opacity-80 animate-float-slow min-[1400px]:block" />
        <Star className="absolute right-[3%] top-6 w-8 animate-float" />
      </div>
      <div className="container-x relative grid items-center gap-8 pt-8 pb-14 md:grid-cols-[1.5fr_1fr] md:pb-20">
        <div>
          <Breadcrumbs crumbs={crumbs} />
          {eyebrow && <p className="eyebrow mt-6">{eyebrow}</p>}
          <h1 className="mt-2 text-[2.4rem] font-semibold sm:text-5xl lg:text-[3.6rem]">{title}</h1>
          {lede && <div className="mt-5 max-w-2xl text-lg text-ink-soft sm:text-xl">{lede}</div>}
          {children && <div className="mt-7">{children}</div>}
        </div>
        {art && <div className="relative flex justify-center md:justify-end">{art}</div>}
      </div>
      <Wave />
    </section>
  );
}

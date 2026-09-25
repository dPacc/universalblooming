import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { programs } from "@/content/programs";
import { pageMetadata, clampDescription } from "@/lib/seo";
import { graph, breadcrumbNode, faqNode, webPageNode, serviceNode, type Crumb } from "@/lib/schema";
import { accentSoft, accentVar } from "@/lib/accent";
import { Linker } from "@/lib/autolink";
import { whatsappLink, placeLabel } from "@/config/site";
import { JsonLd } from "@/components/seo/JsonLd";
import { PageHero } from "@/components/ui/PageHero";
import { QuickAnswer } from "@/components/content/QuickAnswer";
import { SectionsView } from "@/components/content/Blocks";
import { FaqList } from "@/components/content/FaqList";
import { Toc } from "@/components/content/Toc";
import { RelatedGuides, RelatedActivities, RelatedPrograms } from "@/components/content/Related";
import { DayTimeline } from "@/components/interactive/DayTimeline";
import { VisitForm } from "@/components/lead/VisitForm";
import { BloomiBuddy } from "@/components/mascot/BloomiBuddy";
import { Bloomi } from "@/components/mascot/Bloomi";

export const dynamicParams = false;
export const generateStaticParams = () => programs.map((p) => ({ slug: p.slug }));

type Props = { params: Promise<{ slug: string }> };

/** What families get from a visit (mirrors the promise in the site-wide CTA band). */
const VISIT = [
  { icon: "👋", title: "Meet the teachers", text: "Say hello to the people who will care for your child." },
  { icon: "🏫", title: "See the classrooms", text: "Look around the rooms and play spaces your child will use." },
  { icon: "💬", title: "Ask anything", text: "Routines, settling in, fees: no question is too small." },
];

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const p = programs.find((x) => x.slug === slug);
  if (!p) return {};
  return pageMetadata({
    path: `/programs/${p.slug}`,
    titles: [p.seoTitle, p.ageLabel ? `${p.name} (${p.ageLabel})` : p.name],
    description: p.seoDescription,
    ogTitle: p.ageLabel ? `${p.name} in ${placeLabel()} · Ages ${p.ageLabel.replace(" years", "")}` : `${p.name} in ${placeLabel()}`,
    eyebrow: "Programs",
    keywords: p.keywords,
  });
}

export default async function ProgramPage({ params }: Props) {
  const { slug } = await params;
  const p = programs.find((x) => x.slug === slug);
  if (!p) notFound();
  const path = `/programs/${p.slug}`;
  const crumbs: Crumb[] = [
    { name: "Home", path: "/" },
    { name: "Programs", path: "/programs" },
    { name: p.name, path },
  ];
  const linker = new Linker(path);
  const others = programs.filter((x) => x.slug !== p.slug).map((x) => x.slug);
  // Ages in schema follow the displayed label: none for Day Care, no upper bound for "3+ years".
  const minAge = p.ageLabel ? Math.floor(p.ageMinMonths / 12) : undefined;
  const maxAge = p.ageLabel && !p.ageLabel.includes("+") ? Math.ceil(p.ageMaxMonths / 12) : undefined;

  return (
    <>
      <JsonLd
        data={graph(
          webPageNode({ path, name: p.seoTitle, description: clampDescription(p.seoDescription), speakable: true }),
          breadcrumbNode(crumbs),
          serviceNode({
            path,
            name: p.ageLabel ? `${p.name} (${p.ageLabel})` : p.name,
            description: p.seoDescription,
            minAge,
            maxAge,
            serviceType: p.slug === "after-school" ? "After-school program" : p.slug === "day-care" ? "Child day care" : "Preschool education",
          }),
          faqNode(p.faqs, path),
        )}
      />

      <PageHero
        crumbs={crumbs}
        eyebrow={p.ageLabel ?? "Our programs"}
        title={<>{p.name} <span className="text-3xl sm:text-4xl" aria-hidden>{p.emoji}</span></>}
        lede={<p>{p.tagline} In {placeLabel()}.</p>}
        tone={accentSoft[p.accent]}
        art={<BloomiBuddy mood={p.slug === "after-school" ? "cheer" : p.slug === "preschool" ? "read" : "love"} bubble={`Welcome to ${p.name}!`} bubbleSide="left" size="w-36 sm:w-48" />}
      >
        <div className="flex flex-wrap gap-3">
          <Link href={`/admissions?program=${p.slug}#book-a-visit`} className="btn btn-primary" data-cta={`program-hero-${p.slug}`}>Book a visit</Link>
          <a href={whatsappLink(`Hi! I'd like to know more about your ${p.name} program. (from: ${path})`)} className="btn btn-light" data-cta={`program-hero-wa-${p.slug}`}>💬 WhatsApp</a>
        </div>
      </PageHero>

      <div className="container-x mt-4">
        <QuickAnswer text={p.quickAnswer} label={`${p.name} in a nutshell`} />
      </div>

      <section className="container-x mt-16" aria-labelledby="hl-h">
        <h2 id="hl-h" className="text-3xl font-semibold sm:text-4xl">What makes our {p.name} special</h2>
        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {p.highlights.map((h, i) => (
            <li key={h.title} data-reveal={i % 3} className="card-pop is-hoverable p-6">
              <span className={`grid h-12 w-12 place-items-center rounded-2xl text-2xl ${accentSoft[p.accent]}`} aria-hidden>{h.icon}</span>
              <h3 className="mt-3 text-xl font-semibold">{h.title}</h3>
              <p className="mt-1 text-ink-soft">{h.text}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-20 bg-white/60 py-16" aria-labelledby="day-h">
        <div className="container-x">
          <p className="eyebrow">A day in {p.name}</p>
          <h2 id="day-h" className="mt-1 mb-8 text-3xl font-semibold sm:text-4xl">What does a typical day look like?</h2>
          <DayTimeline steps={p.day} title={`A typical ${p.name} day`} />
        </div>
      </section>

      <div className="container-x mt-16 grid gap-12 lg:grid-cols-[1fr_18rem]">
        <article className="min-w-0">
          <SectionsView sections={p.sections} linker={linker} />
          <div className="mt-16">
            <FaqList faqs={p.faqs} title={`${p.name}: questions parents ask`} />
          </div>
        </article>
        <aside className="hidden lg:block">
          <div className="sticky top-24 grid gap-5">
            <Toc sections={p.sections} extra={[{ id: "faq", title: "FAQs" }]} />
            <div className="card-pop p-5 text-center" style={{ background: `color-mix(in srgb, ${accentVar[p.accent]} 14%, white)` }}>
              <p className="font-display text-xl font-semibold">Come and see us</p>
              <p className="mt-1 text-sm text-ink-soft">Meet the teachers and see the classrooms.</p>
              <Link href={`/admissions?program=${p.slug}#book-a-visit`} className="btn btn-primary mt-4 w-full !text-base">Book a visit</Link>
            </div>
          </div>
        </aside>
      </div>

      <div className="container-x mt-20 grid gap-14">
        <RelatedActivities slugs={p.relatedActivities} />
        <RelatedGuides slugs={p.relatedGuides} />
        <RelatedPrograms slugs={others} title="Other programs" />
      </div>

      <section className="container-x mb-8 mt-20 grid scroll-mt-24 gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-center" id="book-a-visit">
        <div>
          <p className="eyebrow">Admissions open</p>
          <h2 className="mt-1 text-4xl font-semibold">Book a {p.name} visit</h2>
          <p className="mt-3 text-lg text-ink-soft">Three quick steps. We&apos;ll call or WhatsApp you to arrange a time that suits you.</p>
          <ul className="mt-7 grid gap-3" aria-label="On your visit">
            {VISIT.map((v) => (
              <li key={v.title} className="flex items-center gap-4 rounded-2xl border-[2.5px] border-ink/10 bg-white px-4 py-3">
                <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl text-2xl ${accentSoft[p.accent]}`} aria-hidden>{v.icon}</span>
                <span>
                  <span className="block font-display text-lg font-semibold leading-tight">{v.title}</span>
                  <span className="block text-[0.95rem] text-ink-soft">{v.text}</span>
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-8 hidden justify-center lg:flex">
            <Bloomi mood="wave" className="h-auto w-32" />
          </div>
        </div>
        <VisitForm source={`program-${p.slug}`} defaultProgram={p.slug} whatsappHref={whatsappLink(`Hi! I'd like to book a ${p.name} visit. (from: ${path})`)} />
      </section>
    </>
  );
}

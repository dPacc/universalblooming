import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { activities } from "@/content/activities";
import { pageMetadata, clampDescription } from "@/lib/seo";
import { graph, breadcrumbNode, faqNode, webPageNode, type Crumb } from "@/lib/schema";
import { accentSoft } from "@/lib/accent";
import { Linker } from "@/lib/autolink";
import { whatsappLink } from "@/config/site";
import { JsonLd } from "@/components/seo/JsonLd";
import { PageHero } from "@/components/ui/PageHero";
import { QuickAnswer } from "@/components/content/QuickAnswer";
import { SectionsView } from "@/components/content/Blocks";
import { FaqList } from "@/components/content/FaqList";
import { RelatedGuides, RelatedActivities, RelatedPrograms } from "@/components/content/Related";
import { CtaBand } from "@/components/lead/CtaBand";

export const dynamicParams = false;
export const generateStaticParams = () => activities.map((a) => ({ slug: a.slug }));

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const a = activities.find((x) => x.slug === slug);
  if (!a) return {};
  return pageMetadata({
    path: `/activities/${a.slug}`,
    titles: [a.seoTitle, a.name],
    description: a.seoDescription,
    ogTitle: a.name,
    eyebrow: "Activities",
    keywords: a.keywords,
  });
}

export default async function ActivityPage({ params }: Props) {
  const { slug } = await params;
  const a = activities.find((x) => x.slug === slug);
  if (!a) notFound();
  const path = `/activities/${a.slug}`;
  const crumbs: Crumb[] = [
    { name: "Home", path: "/" },
    { name: "Activities", path: "/activities" },
    { name: a.name, path },
  ];
  const siblings = activities.filter((x) => x.slug !== a.slug).map((x) => x.slug).slice(0, 4);

  return (
    <>
      <JsonLd
        data={graph(
          webPageNode({ path, name: a.seoTitle, description: clampDescription(a.seoDescription), speakable: true }),
          breadcrumbNode(crumbs),
          faqNode(a.faqs, path),
        )}
      />
      <PageHero
        crumbs={crumbs}
        eyebrow={a.ageLabel}
        title={a.name}
        lede={<p>{a.tagline}</p>}
        tone={accentSoft[a.accent]}
        art={<span className="text-[7rem] leading-none animate-float sm:text-[9rem]" aria-hidden>{a.icon}</span>}
      >
        <ul className="flex flex-wrap gap-2" aria-label="Skills children build">
          {a.skills.map((s) => (
            <li key={s} className="rounded-full border-2 border-ink bg-white px-3 py-1 text-sm font-bold">{s}</li>
          ))}
        </ul>
      </PageHero>

      <div className="container-x mt-4 max-w-4xl">
        <QuickAnswer text={a.quickAnswer} />
        <article className="mt-14">
          <SectionsView sections={a.sections} linker={new Linker(path)} />
          <div className="mt-16"><FaqList faqs={a.faqs} /></div>
        </article>
        <div className="mt-10 flex flex-wrap gap-3">
          <Link href="/admissions#book-a-visit" className="btn btn-primary" data-cta={`activity-${a.slug}`}>Book a visit</Link>
          <a href={whatsappLink(`Hi! I'd like to ask about ${a.name}. (from: ${path})`)} className="btn btn-light" data-cta={`activity-wa-${a.slug}`}>💬 Ask on WhatsApp</a>
        </div>
      </div>

      <div className="container-x mt-20 grid gap-14">
        <RelatedPrograms slugs={a.relatedPrograms} title="Where your child does this" />
        <RelatedGuides slugs={a.relatedGuides} />
        <RelatedActivities slugs={siblings} title="More activities" />
      </div>
      <CtaBand source={`activity-${a.slug}`} />
    </>
  );
}

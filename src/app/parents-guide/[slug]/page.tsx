import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { guides } from "@/content/guides";
import { pageMetadata, clampDescription, withYear } from "@/lib/seo";
import { graph, breadcrumbNode, faqNode, webPageNode, articleNode, type Crumb } from "@/lib/schema";
import { accentSoft } from "@/lib/accent";
import { Linker } from "@/lib/autolink";
import { stripInline, wordCount } from "@/lib/inline";
import { site, whatsappLink, asset } from "@/config/site";
import { JsonLd } from "@/components/seo/JsonLd";
import { PageHero } from "@/components/ui/PageHero";
import { QuickAnswer } from "@/components/content/QuickAnswer";
import { SectionsView, sectionsText } from "@/components/content/Blocks";
import { FaqList } from "@/components/content/FaqList";
import { Toc } from "@/components/content/Toc";
import { RelatedGuides, RelatedPrograms } from "@/components/content/Related";
import { CtaBand } from "@/components/lead/CtaBand";
import { Bloomi } from "@/components/mascot/Bloomi";

export const dynamicParams = false;
export const generateStaticParams = () => guides.map((g) => ({ slug: g.slug }));

type Props = { params: Promise<{ slug: string }> };

const TOOLS = {
  "nursery-age-calculator": { title: "Check your child's year group", text: "Enter a date of birth and see FS1, KG1 and school placement for the next three years.", href: "/tools/nursery-age-calculator", cta: "Open the age calculator", mood: "think" as const },
  "nursery-readiness-quiz": { title: "Is your child nursery-ready?", text: "Ten quick questions, instant friendly results and tips you can use at home.", href: "/tools/nursery-readiness-quiz", cta: "Take the 2-minute quiz", mood: "cheer" as const },
};

const fmtDate = (d: string) => new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const g = guides.find((x) => x.slug === slug);
  if (!g) return {};
  return pageMetadata({
    path: `/parents-guide/${g.slug}`,
    titles: [g.seoTitle, g.title],
    description: g.seoDescription,
    ogTitle: g.title,
    eyebrow: g.category,
    keywords: g.keywords,
    type: "article",
    published: g.published,
    modified: g.updated,
  });
}

export default async function GuidePage({ params }: Props) {
  const { slug } = await params;
  const g = guides.find((x) => x.slug === slug);
  if (!g) notFound();
  const path = `/parents-guide/${g.slug}`;
  const crumbs: Crumb[] = [
    { name: "Home", path: "/" },
    { name: "Parents' Guide", path: "/parents-guide" },
    { name: withYear(g.title).split(/[:?]/)[0], path },
  ];
  const words = wordCount([...sectionsText(g.sections), ...g.faqs.map((f) => f.a)].map(stripInline));
  const minutes = Math.max(3, Math.round(words / 220));
  const tool = g.tool ? TOOLS[g.tool] : null;

  return (
    <>
      <JsonLd
        data={graph(
          webPageNode({ path, name: withYear(g.title), description: clampDescription(g.seoDescription), published: g.published, modified: g.updated }),
          breadcrumbNode(crumbs),
          articleNode({
            path,
            headline: withYear(g.title),
            description: clampDescription(g.seoDescription),
            published: g.published,
            modified: g.updated,
            keywords: g.keywords,
            section: g.category,
            wordCount: words,
            citations: g.sources,
          }),
          faqNode(g.faqs, path),
        )}
      />

      <PageHero
        crumbs={crumbs}
        eyebrow={g.category}
        title={withYear(g.title)}
        lede={<p>{g.excerpt}</p>}
        tone={accentSoft[g.accent]}
      >
        <div className="flex items-center gap-3 text-sm font-bold text-ink-soft">
          <Image src={asset(site.founder.image)} alt="" width={40} height={40} className="h-10 w-10 shrink-0 rounded-full border-2 border-ink bg-white object-cover" />
          <div className="flex flex-wrap gap-x-4 gap-y-0.5">
            <span>
              Reviewed by <Link href="/about#founder" className="whitespace-nowrap text-ink underline-offset-4 hover:underline">{site.founder.name}</Link>, <span className="whitespace-nowrap">{site.founder.role}</span>
            </span>
            <span className="whitespace-nowrap">🗓️ Updated <time dateTime={g.updated}>{fmtDate(g.updated)}</time></span>
            <span className="whitespace-nowrap">⏱️ {minutes} min read</span>
          </div>
        </div>
      </PageHero>

      <div className="container-x mt-4 grid gap-12 lg:grid-cols-[1fr_18rem]">
        <article className="min-w-0">
          <QuickAnswer text={g.quickAnswer} />
          <details className="mt-8 lg:hidden rounded-3xl border-[2.5px] border-ink/10 bg-white p-5">
            <summary className="cursor-pointer font-display text-lg font-semibold">Jump to a section</summary>
            <div className="mt-3"><Toc sections={g.sections} /></div>
          </details>

          <div className="mt-12">
            <SectionsView sections={g.sections} linker={new Linker(path)} />
          </div>

          {tool && (
            <aside className="card-pop relative mt-14 overflow-hidden bg-sky p-7 pr-7 text-white sm:pr-40">
              <p className="chip bg-white text-sky">Free tool</p>
              <p className="mt-3 font-display text-2xl font-semibold">{tool.title}</p>
              <p className="mt-1 text-white/90">{tool.text}</p>
              <Link href={tool.href} className="btn btn-sun mt-5" data-cta={`guide-tool-${g.slug}`}>{tool.cta}</Link>
              <Bloomi mood={tool.mood} className="absolute -bottom-3 right-4 hidden w-32 h-auto sm:block" />
            </aside>
          )}

          <div className="mt-16"><FaqList faqs={g.faqs} /></div>

          {g.sources.length > 0 && (
            <section className="mt-14 rounded-3xl bg-white p-6" aria-labelledby="sources-h">
              <h2 id="sources-h" className="text-xl font-semibold">Sources</h2>
              <p className="mt-1 text-sm text-ink-soft">
                Rules change. We check official sources and update this guide regularly. Always confirm with your school or regulator.
              </p>
              <ol className="mt-4 grid gap-2 text-sm">
                {g.sources.map((s, i) => (
                  <li key={s.url} className="flex gap-2">
                    <span className="font-bold text-pink">{i + 1}.</span>
                    <a href={s.url} target="_blank" rel="noopener" className="link-ub break-words">{s.label}</a>
                  </li>
                ))}
              </ol>
            </section>
          )}

          <section id="author" className="mt-10 flex gap-5 rounded-3xl border-[2.5px] border-ink/10 bg-pink-soft p-6" aria-label="About the reviewer">
            <Image src={asset(site.founder.image)} alt={site.founder.name} width={80} height={80} className="h-20 w-20 shrink-0 rounded-full border-[2.5px] border-ink bg-white object-cover" />
            <div>
              <p className="font-display text-lg font-semibold">{site.founder.name}</p>
              <p className="text-sm font-bold text-ink-soft">{site.founder.role}, Universal Blooming</p>
              <p className="mt-2 text-ink-soft">
                Our guides are written for UAE parents by the Universal Blooming team and reviewed by our founder, with every rule checked against official sources.
              </p>
            </div>
          </section>
        </article>

        <aside className="hidden lg:block">
          <div className="sticky top-24 grid gap-5">
            <Toc sections={g.sections} extra={[{ id: "faq", title: "FAQs" }]} />
            <div className="card-pop bg-yellow-soft p-5 text-center">
              <Bloomi mood="wave" className="mx-auto w-20 h-auto" />
              <p className="mt-2 font-display text-lg font-semibold">Looking for a preschool or day care?</p>
              <Link href="/admissions#book-a-visit" className="btn btn-primary mt-3 w-full !text-base" data-cta={`guide-sidebar-${g.slug}`}>Book a visit</Link>
              <a href={whatsappLink(`Hi! I read your guide "${withYear(g.title)}" and have a question.`)} className="mt-2 block text-sm font-bold text-ink-soft hover:text-ink" data-cta={`guide-sidebar-wa-${g.slug}`}>or ask us on WhatsApp</a>
            </div>
          </div>
        </aside>
      </div>

      <div className="container-x mt-20 grid gap-14">
        <RelatedGuides slugs={g.related} title="Keep reading" />
        <RelatedPrograms slugs={g.relatedPrograms} title="Our programs" />
      </div>
      <CtaBand source={`guide-${g.slug}`} />
    </>
  );
}

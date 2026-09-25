import Link from "next/link";
import type { Metadata } from "next";
import { guides } from "@/content/guides";
import type { Guide } from "@/content/types";
import { pageMetadata, withYear } from "@/lib/seo";
import { graph, breadcrumbNode, webPageNode, itemListNode, type Crumb } from "@/lib/schema";
import { accentSoft } from "@/lib/accent";
import { JsonLd } from "@/components/seo/JsonLd";
import { PageHero } from "@/components/ui/PageHero";
import { CtaBand } from "@/components/lead/CtaBand";
import { BloomiBuddy } from "@/components/mascot/BloomiBuddy";

const path = "/parents-guide";

export const metadata: Metadata = pageMetadata({
  path,
  titles: ["Parents' Guide to Nurseries in the UAE ({year})"],
  description: "Clear, sourced guides for UAE parents: nursery age cut-offs, fees, documents, choosing a nursery, curricula, settling in, milestones and school readiness.",
  ogTitle: "The UAE parents' guide to nursery",
  eyebrow: "Parents' Guide",
});

const ORDER: Guide["category"][] = ["Admissions", "Fees & Costs", "Choosing a Nursery", "Child Development", "Everyday Parenting"];
const ICON: Record<Guide["category"], string> = {
  Admissions: "📝",
  "Fees & Costs": "💰",
  "Choosing a Nursery": "🔍",
  "Child Development": "🌱",
  "Everyday Parenting": "💛",
};

export default function GuidesHub() {
  const crumbs: Crumb[] = [{ name: "Home", path: "/" }, { name: "Parents' Guide", path }];
  const [featured, ...rest] = guides;
  return (
    <>
      <JsonLd data={graph(
        webPageNode({ path, name: "Parents' Guide", description: "Guides for UAE parents choosing a nursery.", type: "CollectionPage" }),
        breadcrumbNode(crumbs),
        itemListNode(path, guides.map((g) => ({ name: withYear(g.title), path: `/parents-guide/${g.slug}` }))),
      )} />
      <PageHero
        crumbs={crumbs}
        eyebrow="Parents' guide"
        title="Honest, sourced answers for UAE parents"
        lede={<p>Everything we get asked on visits, written down properly: age cut-offs, fees, documents, curricula, settling in and more. Checked against KHDA, ADEK and Ministry of Education sources.</p>}
        art={<BloomiBuddy mood="read" bubble="I love reading! 📚" bubbleSide="left" size="w-40 sm:w-52" />}
        tone="bg-sky-soft"
      />

      <section className="container-x mt-4">
        <Link href={`/parents-guide/${featured.slug}`} className={`card-pop group grid gap-6 p-7 sm:p-10 md:grid-cols-[1fr_auto] md:items-center ${accentSoft[featured.accent]}`}>
          <div>
            <p className="chip bg-white text-pink">⭐ Most read · {featured.category}</p>
            <h2 className="mt-4 text-3xl font-semibold sm:text-4xl">{withYear(featured.title)}</h2>
            <p className="mt-3 max-w-2xl text-lg text-ink-soft">{featured.excerpt}</p>
          </div>
          <span className="btn btn-primary justify-self-start">Read the guide →</span>
        </Link>
      </section>

      {/* Categories flow in two balanced columns, so a one-guide category is a short list, not an empty row. */}
      <div className="container-x mt-16 gap-10 lg:columns-2">
        {ORDER.map((cat) => {
          const items = rest.filter((g) => g.category === cat);
          if (!items.length) return null;
          return (
            <section key={cat} className="mb-14 break-inside-avoid" aria-labelledby={`cat-${cat}`}>
              <h2 id={`cat-${cat}`} className="flex items-center gap-3 text-2xl font-semibold sm:text-3xl">
                <span aria-hidden>{ICON[cat]}</span> {cat}
              </h2>
              <ul className="mt-5 grid gap-4">
                {items.map((g) => (
                  <li key={g.slug}>
                    <Link href={`/parents-guide/${g.slug}`} className="card-pop !shadow-pop-sm group flex h-full overflow-hidden">
                      <span aria-hidden className={`w-3 shrink-0 border-r-[2.5px] border-ink ${accentSoft[g.accent]}`} />
                      <span className="flex flex-1 flex-col p-5 sm:p-6">
                        <span className="font-display text-xl font-semibold leading-snug">{withYear(g.title)}</span>
                        <span className="mt-1.5 text-ink-soft">{g.excerpt}</span>
                        <span className="mt-3 font-display font-semibold text-pink">
                          Read the guide <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
                        </span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>
      <CtaBand source="guides-hub" />
    </>
  );
}

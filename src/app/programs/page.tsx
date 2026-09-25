import Link from "next/link";
import type { Metadata } from "next";
import { programs } from "@/content/programs";
import { pageMetadata } from "@/lib/seo";
import { graph, breadcrumbNode, webPageNode, itemListNode, faqNode, type Crumb } from "@/lib/schema";
import { accentSoft, accentVar } from "@/lib/accent";
import { placeLabel } from "@/config/site";
import { JsonLd } from "@/components/seo/JsonLd";
import { PageHero } from "@/components/ui/PageHero";
import { FaqList } from "@/components/content/FaqList";
import { CtaBand } from "@/components/lead/CtaBand";
import { Bloomi } from "@/components/mascot/Bloomi";
import type { Faq } from "@/content/types";

const path = "/programs";
const place = placeLabel();

export const metadata: Metadata = pageMetadata({
  path,
  titles: [`Preschool, Day Care & After School in ${place}`, "Preschool, Day Care & After School Programs"],
  description: `Preschool for 3–6 year olds, loving Day Care for little ones and After School Activities for ages 3+ in ${place}. Compare programs and book a visit.`,
  ogTitle: "Programs for every stage",
  eyebrow: "Preschool · Day Care · After School",
});

const faqs: Faq[] = [
  { q: "Which program is right for my child?", a: "It mostly depends on age: [Preschool](/programs/preschool) is for 3–6 year olds, younger children join [Day Care](/programs/day-care), and [After School Activities](/programs/after-school) welcome children aged 3 and up, so preschoolers can join too. Use the [nursery age calculator](/tools/nursery-age-calculator) to check which UAE school year group your child falls into too." },
  { q: "Can my child move from Day Care to Preschool?", a: "Yes. Children move up as they grow, so the familiar faces and routines stay the same while the learning grows with them." },
  { q: "Do you offer full-day and half-day options?", a: "Schedules vary by program. We'll share the current timings and options on your [visit](/admissions#book-a-visit) or on WhatsApp." },
  { q: "What is the difference between day care and preschool?", a: "Day care focuses on care, routine and play for younger children, while preschool adds more structured early learning to get children ready for FS1 or KG1. Read our [day care vs preschool vs nursery guide](/parents-guide/daycare-vs-preschool-vs-nursery)." },
];

export default function ProgramsHub() {
  const crumbs: Crumb[] = [{ name: "Home", path: "/" }, { name: "Programs", path }];
  return (
    <>
      <JsonLd data={graph(
        webPageNode({ path, name: "Programs", description: "Preschool, Day Care and After School Activities programs at Universal Blooming.", type: "CollectionPage" }),
        breadcrumbNode(crumbs),
        itemListNode(path, programs.map((p) => ({ name: p.name, path: `/programs/${p.slug}` }))),
        faqNode(faqs, path),
      )} />
      <PageHero
        crumbs={crumbs}
        eyebrow="Our programs"
        title="A program for every stage of growing up"
        lede={<p>From first steps to first friendships to first big hobbies, every Universal Blooming program is play-based, caring and built around your child.</p>}
        art={<Bloomi mood="cheer" className="w-44 h-auto sm:w-56" />}
      />

      <section className="container-x mt-4 grid gap-8">
        {programs.map((p, i) => (
          <article key={p.slug} data-reveal className={`card-pop grid overflow-hidden ${i % 2 ? "md:grid-cols-[1fr_18rem]" : "md:grid-cols-[18rem_1fr]"}`}>
            <div className={`${accentSoft[p.accent]} grid content-center justify-items-center gap-3 border-b-[2.5px] border-ink p-8 md:border-b-0 ${i % 2 ? "md:order-2 md:border-l-[2.5px]" : "md:border-r-[2.5px]"}`}>
              <span className="text-8xl" aria-hidden>{p.emoji}</span>
              {p.ageLabel && <span className="chip bg-white" style={{ color: accentVar[p.accent] }}>{p.ageLabel}</span>}
            </div>
            <div className="p-6 sm:p-9">
              <h2 className="text-3xl font-semibold sm:text-4xl">{p.name}</h2>
              <p className="mt-2 text-lg text-ink-soft">{p.cardText}</p>
              <ul className="mt-5 grid gap-2 sm:grid-cols-2">
                {p.highlights.slice(0, 4).map((h) => (
                  <li key={h.title} className="flex gap-2 font-bold"><span aria-hidden>{h.icon}</span>{h.title}</li>
                ))}
              </ul>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link href={`/programs/${p.slug}`} className="btn btn-light">Explore {p.name}</Link>
                <Link href={`/admissions?program=${p.slug}#book-a-visit`} className="btn btn-primary" data-cta={`programs-hub-${p.slug}`}>Book a visit</Link>
              </div>
            </div>
          </article>
        ))}
      </section>

      <section className="container-x mt-20 max-w-4xl">
        <FaqList faqs={faqs} />
      </section>
      <CtaBand source="programs-hub" />
    </>
  );
}

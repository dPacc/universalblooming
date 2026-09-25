import type { Metadata } from "next";
import Link from "next/link";
import { ageCalculatorPage as c } from "@/content/pages";
import { pageMetadata, clampDescription } from "@/lib/seo";
import { graph, breadcrumbNode, faqNode, webPageNode, webAppNode, type Crumb } from "@/lib/schema";
import { Linker } from "@/lib/autolink";
import { site } from "@/config/site";
import { JsonLd } from "@/components/seo/JsonLd";
import { PageHero } from "@/components/ui/PageHero";
import { QuickAnswer } from "@/components/content/QuickAnswer";
import { SectionsView } from "@/components/content/Blocks";
import { FaqList } from "@/components/content/FaqList";
import { RelatedGuides } from "@/components/content/Related";
import { AgeCalculator } from "@/components/interactive/AgeCalculator";
import { CtaBand } from "@/components/lead/CtaBand";
import { BloomiBuddy } from "@/components/mascot/BloomiBuddy";

const path = "/tools/nursery-age-calculator";

export const metadata: Metadata = pageMetadata({
  path,
  titles: [c.seoTitle, "Nursery Age Calculator UAE"],
  description: c.seoDescription,
  ogTitle: "UAE Nursery, FS1 & KG1 Age Calculator",
  eyebrow: "Free tool · New 31 Dec cut-off",
  keywords: ["nursery age calculator UAE", "FS1 age cut off Dubai", "KG1 age UAE 2026", "school age calculator Dubai", "31 December cut off UAE"],
});

export default function AgeCalculatorPage() {
  const crumbs: Crumb[] = [
    { name: "Home", path: "/" },
    { name: "Free Tools", path: "/tools" },
    { name: "Nursery Age Calculator", path },
  ];
  const waBase = site.whatsapp ? `https://wa.me/${site.whatsapp}?text=` : "/contact?message=";
  return (
    <>
      <JsonLd data={graph(
        webPageNode({ path, name: "UAE Nursery, FS1 & KG1 Age Calculator", description: clampDescription(c.seoDescription), speakable: true, modified: "2026-09-25" }),
        breadcrumbNode(crumbs),
        webAppNode({ path, name: "UAE Nursery & School Age Calculator", description: clampDescription(c.seoDescription) }),
        faqNode(c.faqs, path),
      )} />
      <PageHero
        crumbs={crumbs}
        eyebrow="Free tool · Updated for 2026-27"
        title="Which year group can my child join?"
        lede={<p>The UAE moved the age cut-off to <strong className="text-ink">31 December</strong> for September-start schools from 2026-27. Enter a date of birth to see Nursery, FS1/Pre-KG, FS2/KG1 and Grade 1 placement for the next three years.</p>}
        tone="bg-sky-soft"
        art={<BloomiBuddy mood="think" bubble="When's the birthday? 🎂" bubbleSide="left" size="w-36 sm:w-48" />}
      />
      <div className="container-x mt-2">
        <AgeCalculator whatsappBase={waBase} />
      </div>
      <div className="container-x mt-16 max-w-4xl">
        <QuickAnswer text={c.quickAnswer} />
        <article className="mt-14">
          <SectionsView sections={c.sections} linker={new Linker(path)} />
          <div className="mt-16"><FaqList faqs={c.faqs} /></div>
          <section className="mt-12 rounded-3xl bg-white p-6">
            <h2 className="text-xl font-semibold">Sources</h2>
            <ol className="mt-3 grid gap-2 text-sm">
              {c.sources.map((s, i) => (
                <li key={s.url} className="flex gap-2"><span className="font-bold text-pink">{i + 1}.</span><a className="link-ub break-words" href={s.url} target="_blank" rel="noopener">{s.label}</a></li>
              ))}
            </ol>
          </section>
        </article>
        <p className="mt-8 text-ink-soft">
          Want the full story? Read our guide to <Link className="link-ub" href="/parents-guide/nursery-age-uae">nursery and FS1 age rules in the UAE</Link>.
        </p>
      </div>
      <div className="container-x mt-16">
        <RelatedGuides slugs={["nursery-age-uae", "school-readiness-checklist", "nursery-registration-documents-uae"]} />
      </div>
      <CtaBand source="age-calculator" />
    </>
  );
}

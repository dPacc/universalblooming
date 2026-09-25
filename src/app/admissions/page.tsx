import type { Metadata } from "next";
import { admissions as a } from "@/content/pages";
import { pageMetadata } from "@/lib/seo";
import { graph, breadcrumbNode, faqNode, webPageNode, type Crumb } from "@/lib/schema";
import { Linker } from "@/lib/autolink";
import { placeLabel, whatsappLink } from "@/config/site";
import { JsonLd } from "@/components/seo/JsonLd";
import { PageHero } from "@/components/ui/PageHero";
import { QuickAnswer } from "@/components/content/QuickAnswer";
import { SectionsView, BlockView } from "@/components/content/Blocks";
import { FaqList } from "@/components/content/FaqList";
import { RelatedGuides, RelatedPrograms } from "@/components/content/Related";
import { VisitForm } from "@/components/lead/VisitForm";
import { BloomiBuddy } from "@/components/mascot/BloomiBuddy";

const path = "/admissions";

export const metadata: Metadata = pageMetadata({
  path,
  titles: [`Preschool Admissions ${placeLabel()} {year}: Book a Visit`, "Preschool Admissions {year}: Book a Visit"],
  description: `Admissions are open at Universal Blooming in ${placeLabel()}. See the 5 simple steps, the documents you need and book a campus visit for Preschool, Day Care or After School Activities.`,
  ogTitle: "Admissions open: book your visit",
  eyebrow: "Admissions",
});

export default function AdmissionsPage() {
  const crumbs: Crumb[] = [{ name: "Home", path: "/" }, { name: "Admissions", path }];
  const wa = whatsappLink("Hi Universal Blooming! I'd like to book a visit. (from: admissions)");
  return (
    <>
      <JsonLd data={graph(
        webPageNode({ path, name: "Admissions", description: "How to join Universal Blooming.", speakable: true }),
        breadcrumbNode(crumbs),
        {
          "@type": "HowTo",
          name: "How to enrol your child at Universal Blooming",
          step: a.steps.map((s, i) => ({ "@type": "HowToStep", position: i + 1, name: s.title, text: s.text })),
        },
        faqNode(a.faqs, path),
      )} />

      <PageHero
        crumbs={crumbs}
        eyebrow="Admissions open"
        title="Joining Universal Blooming is easy"
        lede={<p>Five friendly steps from hello to first day. Book a visit below or message us on WhatsApp. We&apos;re happy to answer every question.</p>}
        art={<BloomiBuddy mood="wave" bubble="Can't wait to meet you!" bubbleSide="left" size="w-40 sm:w-52" />}
        tone="bg-pink-soft"
      >
        <div className="flex flex-wrap gap-3">
          <a href="#book-a-visit" className="btn btn-primary" data-cta="admissions-hero">Book a visit</a>
          <a href={wa} className="btn btn-whatsapp" data-cta="admissions-hero-wa">💬 WhatsApp</a>
        </div>
      </PageHero>

      <div className="container-x mt-4 max-w-4xl">
        <QuickAnswer text={a.quickAnswer} label="How to join" />
      </div>

      <section className="container-x mt-16" aria-labelledby="steps-h">
        <h2 id="steps-h" className="text-3xl font-semibold sm:text-4xl">Five steps from hello to first day</h2>
        <ol className="mt-8 grid gap-4 md:grid-cols-5">
          {a.steps.map((s, i) => (
            <li key={s.title} data-reveal={i} className="card-pop relative p-5 pt-8">
              <span className="absolute -top-4 left-5 grid h-9 w-9 place-items-center rounded-full border-[2.5px] border-ink bg-yellow font-display font-semibold">{i + 1}</span>
              <span className="text-3xl" aria-hidden>{s.icon}</span>
              <h3 className="mt-2 text-lg font-semibold leading-tight">{s.title}</h3>
              <p className="mt-1.5 text-[0.95rem] text-ink-soft">{s.text}</p>
            </li>
          ))}
        </ol>
      </section>

      <section id="book-a-visit" className="container-x mt-20 grid scroll-mt-24 gap-10 lg:grid-cols-[1fr_1.15fr] lg:items-start">
        <div className="lg:col-start-1 lg:row-start-1">
          <p className="eyebrow">Admissions open</p>
          <h2 className="mt-1 text-4xl font-semibold">Book your visit</h2>
          <p className="mt-3 text-lg text-ink-soft">Tell us a little about your child and we&apos;ll arrange a time that works for you.</p>
        </div>
        <div className="lg:sticky lg:top-24 lg:col-start-2 lg:row-span-2 lg:row-start-1">
          <VisitForm source="admissions" whatsappHref={wa} />
        </div>
        <section className="rounded-3xl bg-white p-6 sm:p-8 lg:col-start-1 lg:row-start-2" aria-labelledby="docs-h">
          <p className="eyebrow">When you register</p>
          <h2 id="docs-h" className="mt-1 text-2xl font-semibold sm:text-3xl">📄 Documents checklist</h2>
          <p className="mt-1 text-ink-soft">What you&apos;ll typically need when you register. You don&apos;t need any of it for the visit.</p>
          <div className="prose-ub mt-5">
            <BlockView block={{ type: "checklist", items: a.documents }} />
          </div>
        </section>
      </section>

      <div className="container-x mt-20 max-w-4xl">
        <SectionsView sections={a.sections} linker={new Linker(path)} />
        <div className="mt-16"><FaqList faqs={a.faqs} title="Admissions FAQs" /></div>
      </div>

      <div className="container-x mt-20 grid gap-14">
        <RelatedPrograms />
        <RelatedGuides slugs={["nursery-registration-documents-uae", "nursery-age-uae", "settling-into-nursery"]} />
      </div>
    </>
  );
}

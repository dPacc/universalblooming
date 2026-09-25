import type { Metadata } from "next";
import { readinessQuiz as rq } from "@/content/pages";
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
import { ReadinessQuiz } from "@/components/interactive/ReadinessQuiz";
import { CtaBand } from "@/components/lead/CtaBand";

const path = "/tools/nursery-readiness-quiz";

export const metadata: Metadata = pageMetadata({
  path,
  titles: [rq.seoTitle, "Nursery Readiness Quiz"],
  description: rq.seoDescription,
  ogTitle: "Is my child ready for nursery?",
  eyebrow: "Free 2-minute quiz",
  keywords: ["is my child ready for nursery", "nursery readiness checklist", "preschool readiness quiz", "school readiness UAE"],
});

export default function QuizPage() {
  const crumbs: Crumb[] = [
    { name: "Home", path: "/" },
    { name: "Free Tools", path: "/tools" },
    { name: "Nursery Readiness Quiz", path },
  ];
  const waBase = site.whatsapp ? `https://wa.me/${site.whatsapp}?text=` : "/contact?message=";
  return (
    <>
      <JsonLd data={graph(
        webPageNode({ path, name: "Nursery Readiness Quiz", description: clampDescription(rq.seoDescription), speakable: true }),
        breadcrumbNode(crumbs),
        webAppNode({ path, name: "Nursery Readiness Quiz", description: clampDescription(rq.seoDescription) }),
        faqNode(rq.faqs, path),
      )} />
      <PageHero
        crumbs={crumbs}
        eyebrow="Free 2-minute quiz"
        title="Is my child ready for nursery?"
        lede={<p>Ten quick questions about everyday moments. You&apos;ll get a friendly result, your child&apos;s strengths and simple ideas to try at home. No sign-up needed.</p>}
        tone="bg-pink-soft"
      />
      <div className="container-x mt-2 max-w-4xl">
        <ReadinessQuiz questions={rq.questions} results={rq.results} whatsappBase={waBase} />
      </div>
      <div className="container-x mt-16 max-w-4xl">
        <QuickAnswer text={rq.quickAnswer} />
        <article className="mt-14">
          <SectionsView sections={rq.sections} linker={new Linker(path)} />
          <div className="mt-16"><FaqList faqs={rq.faqs} /></div>
        </article>
      </div>
      <div className="container-x mt-16">
        <RelatedGuides slugs={["settling-into-nursery", "child-development-milestones", "school-readiness-checklist"]} />
      </div>
      <CtaBand source="readiness-quiz" />
    </>
  );
}

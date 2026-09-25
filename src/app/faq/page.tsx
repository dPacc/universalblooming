import type { Metadata } from "next";
import { faqPage } from "@/content/pages";
import { pageMetadata } from "@/lib/seo";
import { graph, breadcrumbNode, faqNode, webPageNode, type Crumb } from "@/lib/schema";
import { JsonLd } from "@/components/seo/JsonLd";
import { PageHero } from "@/components/ui/PageHero";
import { FaqList } from "@/components/content/FaqList";
import { CtaBand } from "@/components/lead/CtaBand";
import { Bloomi } from "@/components/mascot/Bloomi";

const path = "/faq";
const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

export const metadata: Metadata = pageMetadata({
  path,
  titles: ["Preschool & Day Care FAQs: Ages, Admissions, Fees & Daily Life", "Preschool & Day Care FAQs"],
  description: "Answers to the questions UAE parents ask most about Universal Blooming: programs and ages, admissions and documents, fees, daily routines, health and safety.",
  ogTitle: "Questions parents ask",
  eyebrow: "FAQ",
});

export default function FaqPage() {
  const crumbs: Crumb[] = [{ name: "Home", path: "/" }, { name: "FAQ", path }];
  const all = faqPage.flatMap((g) => g.faqs);
  return (
    <>
      <JsonLd data={graph(webPageNode({ path, name: "FAQ", description: "Frequently asked questions" }), breadcrumbNode(crumbs), faqNode(all, path))} />
      <PageHero crumbs={crumbs} eyebrow="FAQ" title="Questions parents ask" lede={<p>Can&apos;t find your answer? Message us on WhatsApp. A real person will reply.</p>} art={<Bloomi mood="think" className="w-40 h-auto sm:w-48" />} />
      <div className="container-x mt-2 max-w-4xl">
        <nav aria-label="FAQ topics" className="-mx-4 overflow-x-auto px-4 [scrollbar-width:none] sm:mx-0 sm:overflow-visible sm:px-0 [&::-webkit-scrollbar]:hidden">
          <ul className="flex w-max gap-2 pb-1 sm:w-auto sm:flex-wrap">
            {faqPage.map((g) => (
              <li key={g.group}>
                <a href={`#${slug(g.group)}`} className="block whitespace-nowrap rounded-full border-2 border-ink bg-white px-4 py-1.5 font-bold hover:bg-yellow-soft">{g.group}</a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="mt-12 grid gap-16">
          {faqPage.map((g) => <FaqList key={g.group} id={slug(g.group)} faqs={g.faqs} title={g.group} />)}
        </div>
      </div>
      <CtaBand source="faq" />
    </>
  );
}

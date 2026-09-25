import Link from "next/link";
import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { graph, breadcrumbNode, webPageNode, itemListNode, type Crumb } from "@/lib/schema";
import { JsonLd } from "@/components/seo/JsonLd";
import { PageHero } from "@/components/ui/PageHero";
import { Bloomi, type BloomiMood } from "@/components/mascot/Bloomi";

const path = "/tools";
export const metadata: Metadata = pageMetadata({
  path,
  titles: ["Free Tools for UAE Parents"],
  description: "Free tools for UAE parents: work out your child's nursery, FS1 and KG1 year group under the new 31 December cut-off, and check nursery readiness in 2 minutes.",
  eyebrow: "Free tools",
});

const tools: { href: string; title: string; text: string; mood: BloomiMood; tone: string }[] = [
  { href: "/tools/nursery-age-calculator", title: "Nursery & School Age Calculator", text: "Enter a date of birth and see Nursery, FS1/Pre-KG, FS2/KG1 and Grade 1 placement for the next three years, using the new UAE cut-off rules.", mood: "think", tone: "bg-sky-soft" },
  { href: "/tools/nursery-readiness-quiz", title: "Nursery Readiness Quiz", text: "Ten everyday questions, a friendly result, your child's strengths and ideas to build readiness at home.", mood: "cheer", tone: "bg-pink-soft" },
];

export default function ToolsHub() {
  const crumbs: Crumb[] = [{ name: "Home", path: "/" }, { name: "Free Tools", path }];
  return (
    <>
      <JsonLd data={graph(
        webPageNode({ path, name: "Free tools for parents", description: "Free tools for UAE parents.", type: "CollectionPage" }),
        breadcrumbNode(crumbs),
        itemListNode(path, tools.map((t) => ({ name: t.title, path: t.href }))),
      )} />
      <PageHero crumbs={crumbs} eyebrow="Free tools" title="Free tools for UAE parents" lede={<p>Quick, private, no sign-up. Built by the Universal Blooming team to answer the questions we hear most.</p>} art={<Bloomi mood="think" className="h-auto w-40 sm:w-52" />} />
      <section className="container-x mt-4 grid gap-6 md:grid-cols-2">
        {tools.map((t) => (
          <Link key={t.href} href={t.href} className={`card-pop group relative overflow-hidden p-8 pr-8 sm:pr-40 ${t.tone}`}>
            <h2 className="text-3xl font-semibold">{t.title}</h2>
            <p className="mt-3 text-lg text-ink-soft">{t.text}</p>
            <span className="btn btn-primary mt-6">Open tool →</span>
            <Bloomi mood={t.mood} className="absolute -bottom-3 right-3 hidden w-32 h-auto transition-transform group-hover:-translate-y-2 sm:block" />
          </Link>
        ))}
      </section>
    </>
  );
}

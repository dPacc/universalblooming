import Image from "next/image";
import type { Metadata } from "next";
import { about as ab } from "@/content/pages";
import { pageMetadata } from "@/lib/seo";
import { graph, breadcrumbNode, faqNode, webPageNode, type Crumb } from "@/lib/schema";
import { Linker } from "@/lib/autolink";
import { site, placeLabel } from "@/config/site";
import { JsonLd } from "@/components/seo/JsonLd";
import { PageHero } from "@/components/ui/PageHero";
import { Inline } from "@/components/content/Inline";
import { SectionsView } from "@/components/content/Blocks";
import { FaqList } from "@/components/content/FaqList";
import { CtaBand } from "@/components/lead/CtaBand";
import { Bloomi, type BloomiMood } from "@/components/mascot/Bloomi";
import { BloomiBuddy } from "@/components/mascot/BloomiBuddy";
import { Flower } from "@/components/art/Doodles";

const path = "/about";

export const metadata: Metadata = pageMetadata({
  path,
  titles: [`About Universal Blooming: Preschool in ${placeLabel()}`, "About Universal Blooming"],
  description: `Meet Universal Blooming: Preschool, Day Care & After School Activities in ${placeLabel()}. Our mission, values, founder ${site.founder.name} and our mascot Bloomi.`,
  ogTitle: "Where every child blooms",
  eyebrow: "About us",
});

const MOODS: BloomiMood[] = ["wave", "read", "cheer", "think", "love", "sleep"];

export default function AboutPage() {
  const crumbs: Crumb[] = [{ name: "Home", path: "/" }, { name: "About", path }];
  const linker = new Linker(path);
  return (
    <>
      <JsonLd data={graph(
        webPageNode({ path, name: "About Universal Blooming", description: site.description, type: "AboutPage" }),
        breadcrumbNode(crumbs),
        faqNode(ab.faqs, path),
      )} />
      <PageHero
        crumbs={crumbs}
        eyebrow="About us"
        title="Nurturing every child's unique potential"
        lede={<p>{site.tagline}. A warm, safe place where children learn, play and grow through creativity and exploration.</p>}
        art={<Image src="/images/logo.webp" alt="Universal Blooming logo: two children reaching for the stars above a planet" width={300} height={282} className="w-56 h-auto sm:w-72" priority />}
      />

      <section className="container-x mt-4 grid gap-10 lg:grid-cols-[1.4fr_1fr]">
        <div className="prose-ub text-lg">
          {ab.intro.map((p, i) => <p key={i}><Inline text={p} linker={linker} /></p>)}
        </div>
        <div className="grid gap-4">
          <div className="card-pop bg-teal-soft p-6">
            <p className="chip text-teal">Our mission</p>
            <p className="mt-3 font-display text-xl leading-snug">{ab.mission}</p>
          </div>
          <div className="card-pop bg-orange-soft p-6">
            <p className="chip text-orange">Our vision</p>
            <p className="mt-3 font-display text-xl leading-snug">{ab.vision}</p>
          </div>
        </div>
      </section>

      <section className="container-x mt-20" aria-labelledby="values-h">
        <h2 id="values-h" className="text-3xl font-semibold sm:text-4xl">What we believe</h2>
        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {ab.values.map((v, i) => (
            <li key={v.title} data-reveal={i % 3} className="card-pop is-hoverable p-6">
              <span className="text-3xl" aria-hidden>{v.icon}</span>
              <h3 className="mt-2 text-xl font-semibold">{v.title}</h3>
              <p className="mt-1 text-ink-soft"><Inline text={v.text} /></p>
            </li>
          ))}
        </ul>
      </section>

      <section id="founder" className="container-x mt-20 scroll-mt-24">
        <div className="card-pop grid items-center gap-8 bg-pink-soft p-6 sm:p-10 md:grid-cols-[1fr_1.6fr]">
          <Image src={site.founder.image} alt={`${site.founder.name}, ${site.founder.role}`} width={520} height={509} className="mx-auto w-full max-w-xs rounded-[40%_60%_55%_45%/50%_45%_55%_50%] border-[3px] border-ink bg-white" />
          <div>
            <p className="eyebrow">Meet our founder</p>
            <h2 className="mt-1 text-3xl font-semibold sm:text-4xl">{site.founder.name}</h2>
            <p className="font-bold text-ink-soft">{site.founder.role}</p>
            <blockquote className="mt-5 font-display text-2xl leading-snug">“{site.founder.quote}”</blockquote>
            <div className="prose-ub mt-5">
              {ab.founderBio.map((p, i) => <p key={i}><Inline text={p} /></p>)}
            </div>
          </div>
        </div>
      </section>

      <div className="container-x mt-20 max-w-4xl">
        <SectionsView sections={ab.approach} linker={linker} />
      </div>

      {/* ───────────── BLOOMI ───────────── */}
      <section id="bloomi" className="relative mt-24 scroll-mt-24 overflow-hidden bg-yellow-soft py-20">
        <Flower className="absolute -left-6 top-10 hidden w-24 opacity-70 animate-float-slow md:block" petal="var(--color-sky)" />
        <Flower className="absolute right-6 bottom-2 hidden w-16 opacity-70 animate-float md:block" petal="var(--color-orange)" />
        <div className="container-x relative grid items-center gap-10 md:grid-cols-[1fr_1.3fr]">
          <div className="flex justify-center">
            <BloomiBuddy mood="wave" bubble="That's me! Tap me 🌸" bubbleSide="top" size="w-56 sm:w-72" />
          </div>
          <div>
            <p className="eyebrow">Meet our mascot</p>
            <h2 className="mt-1 text-4xl font-semibold sm:text-5xl">Say hello to Bloomi!</h2>
            <p className="mt-4 text-lg text-ink-soft"><Inline text={ab.bloomi.intro} /></p>
            <dl className="mt-6 grid gap-3">
              {ab.bloomi.facts.map((f) => (
                <div key={f.q} className="rounded-2xl border-[2.5px] border-ink bg-white p-4">
                  <dt className="font-display text-lg font-semibold">{f.q}</dt>
                  <dd className="mt-1 text-ink-soft"><Inline text={f.a} /></dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
        <ul className="container-x mt-14 grid grid-cols-3 gap-4 sm:grid-cols-6" aria-label="Bloomi's many moods">
          {MOODS.map((m) => (
            <li key={m} className="text-center">
              <Bloomi mood={m} className="mx-auto w-full max-w-[7rem] h-auto" title={`Bloomi feeling ${m}`} />
              <p className="mt-1 font-display font-medium capitalize">{m === "wave" ? "Hello!" : m === "love" ? "Lovely" : m}</p>
            </li>
          ))}
        </ul>
      </section>

      <div className="container-x mt-20 max-w-4xl">
        <FaqList faqs={ab.faqs} />
      </div>
      <CtaBand source="about" />
    </>
  );
}

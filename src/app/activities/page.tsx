import Link from "next/link";
import type { Metadata } from "next";
import { activities } from "@/content/activities";
import { pageMetadata } from "@/lib/seo";
import { graph, breadcrumbNode, webPageNode, itemListNode, type Crumb } from "@/lib/schema";
import { accentSoft } from "@/lib/accent";
import { placeLabel } from "@/config/site";
import { JsonLd } from "@/components/seo/JsonLd";
import { PageHero } from "@/components/ui/PageHero";
import { CtaBand } from "@/components/lead/CtaBand";
import { BloomiBuddy } from "@/components/mascot/BloomiBuddy";

const path = "/activities";

export const metadata: Metadata = pageMetadata({
  path,
  titles: [`Kids Activities in ${placeLabel()}: Art, Music & More`, "Kids Activities: Art, Music, Sports & Science"],
  description: `Creative arts, storytime and phonics, music, sports, outdoor play, science and social skills: the play-based activities at Universal Blooming in ${placeLabel()}.`,
  ogTitle: "A whole world of play and learning",
  eyebrow: "Activities",
});

export default function ActivitiesHub() {
  const crumbs: Crumb[] = [{ name: "Home", path: "/" }, { name: "Activities", path }];
  return (
    <>
      <JsonLd data={graph(
        webPageNode({ path, name: "Activities", description: "Play-based activities at Universal Blooming.", type: "CollectionPage" }),
        breadcrumbNode(crumbs),
        itemListNode(path, activities.map((a) => ({ name: a.name, path: `/activities/${a.slug}` }))),
      )} />
      <PageHero
        crumbs={crumbs}
        eyebrow="Our best activities"
        title="Discover our world of play and learning"
        lede={<p>We build creativity, confidence and early learning skills through fun, structured activities. Tap any activity to see what children actually do, and why it matters.</p>}
        art={<BloomiBuddy mood="cheer" bubble="Pick one! 🎨" bubbleSide="left" size="w-40 sm:w-52" />}
        tone="bg-green-soft"
      />
      <section className="container-x mt-4">
        {/* 7 activities: 4 + 3 on desktop, with the short row centred. */}
        <ul className="flex flex-wrap justify-center gap-6">
          {activities.map((a, i) => (
            <li key={a.slug} data-reveal={i % 4} className="w-full sm:w-[calc(50%-0.75rem)] lg:w-[calc(25%-1.125rem)]">
              <Link href={`/activities/${a.slug}`} className="card-pop group flex h-full flex-col overflow-hidden">
                <div className={`${accentSoft[a.accent]} grid h-36 place-items-center border-b-[2.5px] border-ink`}>
                  <span className="text-6xl transition-transform duration-500 group-hover:scale-125 group-hover:-rotate-12" aria-hidden>{a.icon}</span>
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <p className="text-xs font-extrabold uppercase tracking-wider text-ink-soft">{a.ageLabel}</p>
                  <h2 className="mt-1 text-2xl font-semibold">{a.name}</h2>
                  <p className="mt-2 flex-1 text-ink-soft">{a.cardText}</p>
                  <p className="mt-4 flex flex-wrap gap-1.5">
                    {a.skills.slice(0, 3).map((s) => (
                      <span key={s} className="rounded-full bg-cream px-2.5 py-0.5 text-xs font-bold">{s}</span>
                    ))}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>
      <CtaBand source="activities-hub" />
    </>
  );
}

import Link from "next/link";
import { whatsappLink, placeLabel } from "@/config/site";
import { BloomiBuddy } from "@/components/mascot/BloomiBuddy";
import { Star, Sparkle } from "@/components/art/Doodles";

/** Big closing CTA used at the bottom of every money page. `source` flows into lead attribution. */
export function CtaBand({
  source,
  title = "Come and see where your child will bloom",
  text,
  program,
}: {
  source: string;
  title?: string;
  text?: string;
  program?: string;
}) {
  const wa = whatsappLink(
    `Hi Universal Blooming! I'd like to book a visit${program ? ` for your ${program} program` : ""}. (from: ${source})`,
  );
  return (
    <section className="container-x my-20" data-reveal>
      <div className="relative overflow-hidden rounded-[2.5rem] border-[3px] border-ink bg-pink px-6 py-10 text-white shadow-pop sm:px-12 sm:py-14">
        <Star className="absolute right-6 top-6 hidden w-10 animate-float md:block" />
        <Sparkle className="absolute right-[38%] bottom-6 hidden w-8 animate-float-slow md:block" fill="var(--color-yellow)" />
        <div className="grid items-center gap-8 md:grid-cols-[1.6fr_1fr]">
          <div>
            <h2 className="text-4xl font-semibold sm:text-5xl">{title}</h2>
            <p className="mt-4 max-w-xl text-lg text-white/90">
              {text ??
                `Book a relaxed visit in ${placeLabel()}. Meet the teachers, see the classrooms and ask anything.`}
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href={`/admissions?from=${encodeURIComponent(source)}#book-a-visit`} className="btn btn-sun" data-cta={`band-visit-${source}`}>
                Book a visit
              </Link>
              <a href={wa} className="btn btn-whatsapp" data-cta={`band-whatsapp-${source}`}>
                💬 WhatsApp us
              </a>
            </div>
          </div>
          <div className="flex justify-center">
            <BloomiBuddy mood="wave" bubble="Tap me! 🌸" bubbleSide="left" size="w-36 sm:w-44" />
          </div>
        </div>
      </div>
    </section>
  );
}

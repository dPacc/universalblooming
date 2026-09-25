import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { site, placeLabel, whatsappLink, asset } from "@/config/site";
import { programs } from "@/content/programs";
import { activities } from "@/content/activities";
import { guides } from "@/content/guides";
import { homeFaqs, promises, joinSteps } from "@/content/home";
import { pageMetadata } from "@/lib/seo";
import { graph, faqNode, webPageNode, itemListNode } from "@/lib/schema";
import { accentSoft, accentVar } from "@/lib/accent";
import { JsonLd } from "@/components/seo/JsonLd";
import { FaqList } from "@/components/content/FaqList";
import { Planet, Sparkle, Squiggle, Star, Wave } from "@/components/art/Doodles";
import { BloomiBuddy } from "@/components/mascot/BloomiBuddy";
import { Bloomi } from "@/components/mascot/Bloomi";
import { ProgramFinder } from "@/components/interactive/ProgramFinder";
import { DayTimeline } from "@/components/interactive/DayTimeline";
import { VisitForm } from "@/components/lead/VisitForm";

const place = placeLabel();

export const metadata: Metadata = {
  ...pageMetadata({
    path: "/",
    titles: [
      `Preschool, Day Care & After School Activities in ${place}`,
      "Preschool, Day Care & After School Activities in the UAE",
    ],
    ogTitle: "Where young minds bloom",
    eyebrow: "Preschool · Day Care · After School Activities",
    description: `Preschool, Day Care & After School Activities in ${place}: play-based preschool for ages 3–6, loving day care and activities for 3+. Book a visit today.`,
  }),
  title: { absolute: `Universal Blooming | Preschool, Day Care & After School Activities in ${site.city || "the UAE"}` },
};

export default function Home() {
  const preschool = programs.find((p) => p.slug === "preschool")!;
  return (
    <>
      <JsonLd
        data={graph(
          webPageNode({ path: "/", name: `${site.name}: Preschool, Day Care & After School Activities`, description: site.description, speakable: true }),
          faqNode(homeFaqs, "/"),
          itemListNode("/", programs.map((p) => ({ name: p.ageLabel ? `${p.name} (${p.ageLabel})` : p.name, path: `/programs/${p.slug}` }))),
        )}
      />

      {/* ───────────── HERO ─────────────
          Calm on purpose: no ambient motion. The only movement is Bloomi
          blinking, following the cursor and reacting when tapped. */}
      <section className="relative overflow-hidden bg-yellow-soft">
        <div aria-hidden className="pointer-events-none absolute inset-0 dotted-bg opacity-30" />
        <div className="container-x relative grid items-center gap-10 pt-8 pb-10 sm:pt-10 lg:grid-cols-[1.25fr_1fr] lg:gap-10 lg:pb-12">
          <div className="max-w-2xl">
            <p className="chip bg-white text-teal">🌸 Admissions open<span className="hidden sm:inline">· Preschool, Day Care &amp; After School</span></p>
            <h1 className="mt-4 text-[2.4rem] font-semibold leading-[1.05] sm:text-[3.2rem] xl:text-[3.7rem]">
              A joyful preschool where{" "}
              <span className="relative inline-block text-pink">
                young minds
                <Squiggle className="absolute -bottom-1.5 left-0 h-2.5 w-full sm:h-3.5" color="var(--color-yellow)" />
              </span>{" "}
              bloom
            </h1>
            <p className="mt-4 max-w-xl text-lg text-ink-soft">
              Universal Blooming offers <strong className="text-ink">Preschool, Day Care &amp; After School Activities in {place}</strong>:
              a warm, safe place where children learn, play and grow through creativity and exploration.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/admissions#book-a-visit" className="btn btn-primary !px-5 sm:!px-6 sm:!text-lg" data-cta="hero-book-visit">
                Book a visit 🌸
              </Link>
              <a href={whatsappLink("Hi Universal Blooming! I'd like to know more about admissions. (from: home hero)")} className="btn btn-light !px-5 sm:!px-6 sm:!text-lg" data-cta="hero-whatsapp">
                💬 WhatsApp us
              </a>
            </div>

            <nav aria-label="Our programs" className="mt-7">
              <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-ink-soft">Choose a program</p>
              <ul className="mt-2.5 grid max-w-xl grid-cols-3 gap-2.5">
                {programs.map((p) => (
                  <li key={p.slug}>
                    <Link
                      href={`/programs/${p.slug}`}
                      data-cta={`hero-program-${p.slug}`}
                      className="group flex h-full items-center gap-2.5 rounded-2xl border-[2.5px] border-ink bg-white px-3 py-2.5 shadow-pop-sm transition-transform hover:-translate-y-0.5 max-sm:flex-col max-sm:items-start max-sm:gap-1"
                    >
                      <span className="text-2xl" aria-hidden>{p.emoji}</span>
                      <span className="leading-tight">
                        <span className="block font-display text-[0.95rem] font-semibold">{p.name.replace(" Activities", "")}</span>
                        {p.ageLabel && (
                          <span className="block text-xs font-extrabold" style={{ color: accentVar[p.accent] }}>{p.ageLabel}</span>
                        )}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <HeroArt />
        </div>
        <Wave />
      </section>

      {/* ───────────── PROMISES ───────────── */}
      <section className="container-x mt-10 grid grid-cols-2 gap-3 sm:mt-14 sm:gap-4 lg:grid-cols-4" aria-label="Why parents choose us">
        {promises.map((p, i) => (
          <div key={p.title} data-reveal={i} className="card-pop is-hoverable p-4 sm:p-6">
            <span className="grid h-11 w-11 place-items-center rounded-2xl border-[2.5px] border-ink text-xl sm:h-14 sm:w-14 sm:text-2xl" style={{ background: `color-mix(in srgb, ${p.color} 25%, white)` }} aria-hidden>
              {p.icon}
            </span>
            <h2 className="mt-3 text-lg font-semibold leading-tight sm:mt-4 sm:text-xl">{p.title}</h2>
            <p className="mt-1 text-[0.92rem] leading-snug text-ink-soft sm:text-base sm:leading-relaxed">{p.text}</p>
          </div>
        ))}
      </section>

      {/* ───────────── PROGRAM FINDER ───────────── */}
      <section className="container-x mt-24" data-reveal>
        <ProgramFinder
          programs={programs.map((p) => ({
            slug: p.slug,
            name: p.name,
            ageLabel: p.ageLabel,
            min: p.ageMinMonths,
            max: p.ageMaxMonths,
            emoji: p.emoji,
            tagline: p.tagline,
            color: accentVar[p.accent],
          }))}
        />
      </section>

      {/* ───────────── PROGRAMS ───────────── */}
      <section className="container-x mt-24" aria-labelledby="programs-h">
        <div className="text-center" data-reveal>
          <p className="eyebrow">Our programs</p>
          <h2 id="programs-h" className="mt-1 text-4xl font-semibold sm:text-5xl">We meet kids at their level to help them bloom</h2>
        </div>
        <div className="mt-12 grid gap-7 md:grid-cols-3">
          {programs.map((p, i) => (
            <Link key={p.slug} href={`/programs/${p.slug}`} data-reveal={i} className={`card-pop group relative flex flex-col overflow-hidden`}>
              <div className={`${accentSoft[p.accent]} relative grid h-44 place-items-center border-b-[2.5px] border-ink`}>
                <span className="text-7xl transition-transform duration-500 group-hover:scale-125 group-hover:rotate-12" aria-hidden>{p.emoji}</span>
                {p.ageLabel && (
                  <span className="absolute right-4 top-4 chip bg-white" style={{ color: accentVar[p.accent] }}>{p.ageLabel}</span>
                )}
              </div>
              <div className="flex flex-1 flex-col p-6">
                <h3 className="text-2xl font-semibold">{p.name}</h3>
                <p className="mt-2 flex-1 text-ink-soft">{p.cardText}</p>
                <span className="mt-5 inline-flex items-center gap-2 font-display font-semibold" style={{ color: accentVar[p.accent] }}>
                  Explore {p.name} <span className="transition-transform group-hover:translate-x-1.5">→</span>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ───────────── A DAY ───────────── */}
      <section className="relative mt-28 bg-teal-soft">
        <Wave flip={false} color="var(--color-teal-soft)" className="absolute -top-8 sm:-top-12" />
        <div className="container-x py-20">
          <div className="grid items-end gap-6 md:grid-cols-[1.5fr_1fr]" data-reveal>
            <div>
              <p className="eyebrow">A day at Universal Blooming</p>
              <h2 className="mt-1 text-4xl font-semibold sm:text-5xl">Every hour is a little adventure</h2>
              <p className="mt-3 max-w-xl text-lg text-ink-soft">Here&apos;s how a typical Preschool day flows. Tap any moment to peek inside.</p>
            </div>
            <Link href="/programs/preschool" className="btn btn-light justify-self-start md:justify-self-end">See the Preschool program</Link>
          </div>
          <div className="mt-10" data-reveal>
            <DayTimeline steps={preschool.day} title="A typical Preschool day" />
          </div>
        </div>
        <Wave color="var(--color-cream)" />
      </section>

      {/* ───────────── ACTIVITIES ───────────── */}
      <section className="container-x mt-16" aria-labelledby="act-h">
        <div className="grid items-end gap-4 md:grid-cols-2" data-reveal>
          <div>
            <p className="eyebrow">Our best activities</p>
            <h2 id="act-h" className="mt-1 text-4xl font-semibold sm:text-5xl">A whole world of play and learning</h2>
          </div>
          <p className="text-lg text-ink-soft">Creativity, confidence and early learning skills, built through fun, structured activities every single day.</p>
        </div>
        <ul className="mt-10 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {activities.map((a, i) => (
            <li key={a.slug} data-reveal={i % 4}>
              <Link href={`/activities/${a.slug}`} className={`card-pop group flex h-full flex-col p-5 ${accentSoft[a.accent]}`}>
                <span className="text-4xl transition-transform group-hover:animate-wiggle" aria-hidden>{a.icon}</span>
                <span className="mt-3 font-display text-xl font-semibold leading-tight">{a.name}</span>
                <span className="mt-1 text-sm text-ink-soft">{a.tagline}</span>
              </Link>
            </li>
          ))}
          <li data-reveal={3}>
            <Link href="/activities" className="card-pop flex h-full flex-col items-center justify-center bg-ink p-5 text-center text-white">
              <Sparkle className="w-8" fill="var(--color-yellow)" />
              <span className="mt-2 font-display text-xl font-semibold">See all activities →</span>
            </Link>
          </li>
        </ul>
      </section>

      {/* ───────────── HOW TO JOIN ───────────── */}
      <section className="container-x mt-28" aria-labelledby="join-h">
        <div className="text-center" data-reveal>
          <p className="eyebrow">Joining is easy</p>
          <h2 id="join-h" className="mt-1 text-4xl font-semibold sm:text-5xl">Three simple steps</h2>
        </div>
        <ol className="relative mt-12 grid gap-8 md:grid-cols-3">
          <svg aria-hidden viewBox="0 0 800 40" className="absolute left-[16%] right-[16%] top-8 hidden w-[68%] md:block" preserveAspectRatio="none">
            <path d="M0 20 Q 200 -10 400 20 T 800 20" fill="none" stroke="var(--color-ink)" strokeWidth="3" strokeDasharray="8 10" strokeLinecap="round" />
          </svg>
          {joinSteps.map((s, i) => (
            <li key={s.n} data-reveal={i} className="relative text-center">
              <span className="relative z-[1] mx-auto grid h-16 w-16 place-items-center rounded-full border-[3px] border-ink bg-yellow font-display text-2xl font-semibold shadow-pop-sm">{s.n}</span>
              <p className="mt-4 text-4xl" aria-hidden>{s.icon}</p>
              <h3 className="mt-2 text-2xl font-semibold">{s.title}</h3>
              <p className="mx-auto mt-2 max-w-xs text-ink-soft">{s.text}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* ───────────── FOUNDER ───────────── */}
      <section className="container-x mt-28" aria-labelledby="founder-h">
        <div className="card-pop grid items-center gap-8 overflow-hidden bg-pink-soft p-6 sm:p-10 md:grid-cols-[1fr_1.5fr]" data-reveal>
          <div className="relative mx-auto w-full max-w-xs">
            <div className="absolute inset-0 translate-x-3 translate-y-3 rounded-[40%_60%_55%_45%/50%_45%_55%_50%] bg-yellow border-[3px] border-ink" />
            <Image
              src={asset(site.founder.image)}
              alt={`${site.founder.name}, ${site.founder.role} of Universal Blooming`}
              width={520}
              height={509}
              className="relative rounded-[40%_60%_55%_45%/50%_45%_55%_50%] border-[3px] border-ink bg-white"
              sizes="(min-width: 768px) 320px, 80vw"
            />
          </div>
          <div>
            <p className="eyebrow">Founder&apos;s message</p>
            <h2 id="founder-h" className="mt-1 text-3xl font-semibold sm:text-4xl">Guided by love, inspired by children</h2>
            <blockquote className="relative mt-6 pl-9 font-display text-2xl leading-snug sm:pl-11 sm:text-[1.7rem]">
              <span className="absolute -top-2 left-0 text-6xl leading-none text-pink sm:text-7xl" aria-hidden>“</span>
              {site.founder.quote}
              <span className="text-pink" aria-hidden>”</span>
            </blockquote>
            <p className="mt-5 font-bold">
              {site.founder.name}
              <span className="block text-sm font-bold text-ink-soft">{site.founder.role}</span>
            </p>
            <Link href="/about" className="btn btn-light mt-6">Our story</Link>
          </div>
        </div>
      </section>

      {/* ───────────── TOOLS + GUIDES ───────────── */}
      <section className="container-x mt-28" aria-labelledby="guides-h">
        <div className="grid gap-6 lg:grid-cols-[1fr_2fr]">
          <div className="card-pop bg-sky p-7 text-white" data-reveal>
            <Bloomi mood="think" className="float-right -mr-1 -mt-1 mb-2 ml-3 h-auto w-24 sm:w-28" />
            <p className="chip bg-white text-sky">Free tool</p>
            <h2 className="mt-4 text-3xl font-semibold">Which year group can my child join?</h2>
            <p className="mt-2 text-white/90">
              The UAE moved the FS1/KG1 age cut-off to <strong>31 December</strong> from 2026-27. Check your child&apos;s year group in 10 seconds.
            </p>
            <Link href="/tools/nursery-age-calculator" className="btn btn-sun mt-6" data-cta="home-age-calculator">Try the age calculator</Link>
          </div>
          <div data-reveal={1}>
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="eyebrow">Parents&apos; guide</p>
                <h2 id="guides-h" className="mt-1 text-3xl font-semibold sm:text-4xl">Honest answers for UAE parents</h2>
              </div>
              <Link href="/parents-guide" className="hidden font-display font-semibold text-pink sm:block">All guides →</Link>
            </div>
            <ul className="mt-6 grid gap-4 sm:grid-cols-2">
              {guides.slice(0, 4).map((g) => (
                <li key={g.slug}>
                  <Link href={`/parents-guide/${g.slug}`} className={`card-pop !shadow-pop-sm block h-full p-5 ${accentSoft[g.accent]}`}>
                    <span className="text-xs font-extrabold uppercase tracking-wider text-ink-soft">{g.category}</span>
                    <span className="mt-1.5 block font-display text-lg font-semibold leading-snug">{g.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ───────────── FAQ + FORM ───────────── */}
      <section className="container-x mt-28 grid gap-12 lg:grid-cols-[1.2fr_1fr]">
        <div data-reveal>
          <FaqList faqs={homeFaqs} title="Questions parents ask us" />
        </div>
        <div id="book-a-visit" className="scroll-mt-24 lg:sticky lg:top-24 lg:self-start" data-reveal={1}>
          <p className="eyebrow">Admissions open</p>
          <h2 className="mt-1 mb-5 text-3xl font-semibold sm:text-4xl">Book your visit</h2>
          <VisitForm source="home" whatsappHref={whatsappLink("Hi Universal Blooming! I'd like to book a visit. (from: home form)")} />
        </div>
      </section>
    </>
  );
}

/** Static composition: Bloomi on a sunny disc with the logo's planet and two "stickers". */
function HeroArt() {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[22rem] lg:max-w-[25rem]">
      <div aria-hidden className="absolute inset-0 rounded-full border-[3px] border-dashed border-ink/20" />
      <div aria-hidden className="absolute inset-[7%] overflow-hidden rounded-full border-[3px] border-ink bg-white shadow-soft">
        <div className="absolute inset-x-0 bottom-0 h-[30%] border-t-[3px] border-dashed border-green/40 bg-green-soft" />
      </div>
      <Planet className="absolute right-[5%] top-[30%] w-[20%]" />
      <Star className="absolute left-[20%] top-[26%] w-[7%]" fill="var(--color-orange)" />

      {/* Bloomi stands on the "grass"; the tap bubble sits above the head. */}
      <div className="absolute bottom-[12%] left-1/2 w-[44%] -translate-x-1/2">
        <BloomiBuddy mood="wave" still bubble="Hi! I'm Bloomi 👋" bubbleSide="top" size="w-full" />
      </div>

      {/* Stickers live in the empty top-left and bottom-right corners of the circle. */}
      <p className="absolute left-0 top-[5%] -rotate-6 whitespace-nowrap rounded-2xl border-[2.5px] border-ink bg-white px-3 py-1.5 font-display text-sm font-semibold shadow-pop-sm sm:px-4 sm:py-2 sm:text-base">
        🎨 Play-based learning
      </p>
      <p className="absolute bottom-[4%] right-0 rotate-3 whitespace-nowrap rounded-2xl border-[2.5px] border-ink bg-white px-3 py-1.5 font-display text-sm font-semibold shadow-pop-sm sm:px-4 sm:py-2 sm:text-base">
        🎒 Ready for FS1 &amp; KG1
      </p>
    </div>
  );
}

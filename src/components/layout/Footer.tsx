import Image from "next/image";
import Link from "next/link";
import { site, hasPhone, placeLabel } from "@/config/site";
import { programs } from "@/content/programs";
import { activities } from "@/content/activities";
import { guides } from "@/content/guides";
import { Wave, Star } from "@/components/art/Doodles";
import { Bloomi } from "@/components/mascot/Bloomi";

/** Dense, crawlable link grid: every hub and every spoke is reachable from every page. */
export function Footer() {
  const year = new Date().getFullYear();
  const cols = [
    { title: "Programs", links: programs.map((p) => ({ label: p.ageLabel ? `${p.name} (${p.ageLabel})` : p.name, href: `/programs/${p.slug}` })) },
    { title: "Activities", links: activities.map((a) => ({ label: a.name, href: `/activities/${a.slug}` })) },
    {
      title: "Parents' Guide",
      links: guides.slice(0, 8).map((g) => ({ label: g.title.split(/[:?]/)[0].trim(), href: `/parents-guide/${g.slug}` })),
    },
    {
      title: "School",
      links: [
        { label: "Admissions", href: "/admissions" },
        { label: "Book a campus visit", href: "/admissions#book-a-visit" },
        { label: "Nursery age calculator", href: "/tools/nursery-age-calculator" },
        { label: "Nursery readiness quiz", href: "/tools/nursery-readiness-quiz" },
        { label: "About us", href: "/about" },
        { label: "Meet Bloomi", href: "/about#bloomi" },
        { label: "FAQ", href: "/faq" },
        { label: "Contact", href: "/contact" },
      ],
    },
  ];

  return (
    <footer className="relative mt-24 bg-ink text-white">
      <Wave color="var(--color-ink)" className="absolute -top-8 sm:-top-12 left-0" />
      <div className="container-x relative pt-14 pb-24">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_2.4fr]">
          <div>
            <Link href="/" className="inline-flex items-center gap-3">
              <span className="grid h-16 w-16 place-items-center rounded-full bg-white">
                <Image src="/images/logo.webp" alt="" width={52} height={49} className="h-12 w-auto" />
              </span>
              <span className="font-display text-2xl font-semibold leading-tight">
                Universal <span className="text-yellow">Blooming</span>
              </span>
            </Link>
            <p className="mt-4 max-w-sm text-white/80">
              Preschool, Day Care &amp; After School Activities in {placeLabel()}: a play-based preschool for ages 3 to 6,
              loving day care for little ones and after school activities for children aged 3 and up. {site.tagline}.
            </p>
            <ul className="mt-5 grid gap-2 text-white/90 font-bold">
              <li>
                ✉️ <a className="hover:text-yellow" href={`mailto:${site.email}`}>{site.email}</a>
              </li>
              {hasPhone && (
                <li>
                  📞 <a className="hover:text-yellow" href={`tel:${site.phone}`}>{site.phoneDisplay}</a>
                </li>
              )}
              {site.streetAddress && <li>📍 {[site.streetAddress, site.landmark, site.city].filter(Boolean).join(", ")}</li>}
            </ul>
            <div className="mt-6 flex items-end gap-3">
              <Bloomi mood="wave" className="w-20 h-auto" title="Bloomi waving goodbye" />
              <p className="mb-6 rounded-2xl rounded-bl-none bg-white px-3 py-2 font-display text-ink text-sm">See you soon! 🌸</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {cols.map((c) => (
              <nav key={c.title} aria-label={c.title}>
                <p className="flex items-start gap-1.5 font-display text-lg font-semibold leading-snug text-yellow">
                  <Star className="mt-[0.3em] h-4 w-4 shrink-0" /> {c.title}
                </p>
                <ul className="mt-2 grid text-[0.95rem] leading-snug">
                  {c.links.map((l) => (
                    <li key={l.href}>
                      <Link href={l.href} className="inline-block py-1.5 text-white/80 hover:text-white hover:underline underline-offset-4">
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-white/15 pt-6 text-sm text-white/60 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {site.legalName}.
            {site.licence.number && ` Licensed by ${site.licence.authority}, licence no. ${site.licence.number}.`}
          </p>
          <ul className="flex gap-4">
            <li><Link href="/privacy" className="inline-block py-1 hover:text-white">Privacy</Link></li>
            <li><Link href="/terms" className="inline-block py-1 hover:text-white">Terms</Link></li>
          </ul>
        </div>
      </div>
    </footer>
  );
}

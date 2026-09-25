import type { Metadata } from "next";
import { site, hasPhone, hasAddress, placeLabel, whatsappLink } from "@/config/site";
import { pageMetadata } from "@/lib/seo";
import { graph, breadcrumbNode, webPageNode, type Crumb } from "@/lib/schema";
import { JsonLd } from "@/components/seo/JsonLd";
import { PageHero } from "@/components/ui/PageHero";
import { VisitForm } from "@/components/lead/VisitForm";
import { BloomiBuddy } from "@/components/mascot/BloomiBuddy";

const path = "/contact";

export const metadata: Metadata = pageMetadata({
  path,
  titles: [`Contact Us: Khalifa Street, ${placeLabel()}`, "Contact Us"],
  description: `Contact Universal Blooming preschool, day care & after school activities in ${placeLabel()}. WhatsApp, call or email us, find directions and opening hours, or book a visit online.`,
  ogTitle: "Say hello!",
  eyebrow: "Contact",
});

/** Size the channel grid to the channels that actually exist, so there are never empty columns. */
const GRID: Record<number, string> = {
  1: "",
  2: "sm:grid-cols-2 lg:grid-cols-[1fr_1.1fr] lg:gap-10", // lines up with the visit/form columns below
  3: "sm:grid-cols-3",
  4: "sm:grid-cols-2 lg:grid-cols-4",
};

/** Lets a long address wrap at the "@" instead of mid-word. */
function EmailText({ email }: { email: string }) {
  const [user, domain] = email.split("@");
  return <span className="[overflow-wrap:anywhere]">{user}<wbr />@{domain}</span>;
}

export default function ContactPage() {
  const crumbs: Crumb[] = [{ name: "Home", path: "/" }, { name: "Contact", path }];
  const wa = whatsappLink("Hi Universal Blooming! (from: contact page)");
  const channels = [
    { icon: "💬", label: "WhatsApp", value: "Chat with the admissions team", href: wa, cta: "contact-whatsapp", tone: "bg-green-soft" },
    ...(hasPhone ? [{ icon: "📞", label: "Call us", value: site.phoneDisplay, href: `tel:${site.phone}`, cta: "contact-call", tone: "bg-sky-soft" }] : []),
    { icon: "✉️", label: "Email", value: <EmailText email={site.email} />, href: `mailto:${site.email}`, cta: "contact-email", tone: "bg-pink-soft" },
    ...(site.googleMapsUrl ? [{ icon: "📍", label: "Directions", value: "Open in Google Maps", href: site.googleMapsUrl, cta: "contact-directions", tone: "bg-yellow-soft" }] : []),
  ];

  return (
    <>
      <JsonLd data={graph(webPageNode({ path, name: "Contact Universal Blooming", description: "How to reach Universal Blooming.", type: "ContactPage" }), breadcrumbNode(crumbs))} />
      <PageHero
        crumbs={crumbs}
        eyebrow="Contact"
        title="We'd love to hear from you"
        lede={<p>Questions about programs, fees or a visit? Pick whatever is easiest for you. We usually reply fastest on WhatsApp.</p>}
        art={<BloomiBuddy mood="love" bubble="Say hi! 👋" bubbleSide="left" size="w-40 sm:w-48" />}
      />

      <section className={`container-x mt-4 grid gap-4 ${GRID[channels.length] ?? GRID[4]}`}>
        {channels.map((c) => (
          <a key={c.label} href={c.href} data-cta={c.cta} className={`card-pop flex items-center gap-4 p-5 sm:p-6 ${c.tone}`}>
            <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl border-[2.5px] border-ink bg-white text-3xl" aria-hidden>{c.icon}</span>
            <span className="min-w-0">
              <span className="block font-display text-xl font-semibold">{c.label}</span>
              <span className="block font-bold leading-snug text-ink-soft">{c.value}</span>
            </span>
          </a>
        ))}
      </section>

      <section className="container-x mt-16 grid gap-10 lg:grid-cols-[1fr_1.1fr]">
        <div className="grid content-start gap-6">
          <div className="card-pop p-6">
            <h2 className="text-2xl font-semibold">Visit us</h2>
            {hasAddress ? (
              <address className="mt-3 not-italic text-lg">
                {site.legalName}<br />
                {site.streetAddress}<br />
                {[site.landmark, site.city].filter(Boolean).join(", ")}<br />
                {site.country}
              </address>
            ) : (
              <p className="mt-3 text-lg text-ink-soft">We&apos;re in {placeLabel()}. Message us and we&apos;ll send you a pin with directions.</p>
            )}
            {site.hoursConfirmed && (
              <>
                <h3 className="mt-6 text-xl font-semibold">Opening hours</h3>
                <dl className="mt-2 grid gap-1">
                  {site.hours.map((h) => (
                    <div key={h.days.join()} className="flex justify-between gap-4 border-b border-dashed border-ink/15 py-1.5">
                      <dt className="font-bold">{h.days.length > 1 ? `${h.days[0]}–${h.days[h.days.length - 1]}` : h.days[0]}</dt>
                      <dd>{h.opens}–{h.closes}</dd>
                    </div>
                  ))}
                </dl>
              </>
            )}
          </div>
          {site.googleMapsEmbed && (
            <div className="card-pop overflow-hidden">
              <iframe src={site.googleMapsEmbed} title="Map to Universal Blooming" loading="lazy" className="block h-80 w-full border-0" referrerPolicy="no-referrer-when-downgrade" />
            </div>
          )}
        </div>
        <div id="book-a-visit" className="scroll-mt-24">
          <h2 className="mb-5 text-3xl font-semibold">Book a visit</h2>
          <VisitForm source="contact" whatsappHref={wa} />
        </div>
      </section>
    </>
  );
}

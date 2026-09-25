/**
 * Single source of truth for every business fact (NAP = name, address, phone).
 *
 * Google matches the site against the Google Business Profile on these exact
 * strings, so they must be copied from the GBP character for character.
 * Every field marked TODO is rendered only when filled in: an empty value is
 * omitted from the page and from the JSON-LD rather than shown as a placeholder.
 */

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.universalblooming.com").replace(/\/$/, "");

export const site = {
  name: "Universal Blooming",
  legalName: "Universal Blooming Kids Learning Center & Day Care",
  tagline: "Where Young Minds Bloom",
  description:
    "Universal Blooming offers Preschool, Day Care & After School Activities on Khalifa Street, Abu Dhabi: a play-based preschool for ages 3 to 6, loving day care for little ones and after school activities for children aged 3 and up.",
  country: "United Arab Emirates",
  countryCode: "AE",

  // TODO: confirm with the owner. These drive local SEO, the map and every CTA.
  emirate: "Abu Dhabi",
  city: "Abu Dhabi",
  area: "", // neighbourhood for titles; left empty so titles read "in Abu Dhabi"
  streetAddress: "1st Floor, Unit 013, Cairo Textile Showroom Building, Khalifa Street",
  landmark: "Near WTC Mall",
  postalCode: "",
  geo: null as null | { lat: number; lng: number }, // TODO: exact pin from the Google Business Profile
  googleMapsUrl: "", // the "Share" link from the Google Business Profile
  googleMapsEmbed: "", // the <iframe src> from GBP "Embed a map"

  phone: "", // E.164, e.g. "+97145551234"
  phoneDisplay: "", // e.g. "+971 4 555 1234"
  whatsapp: "", // digits only, e.g. "971501234567"
  email: "universalbloomingkids@gmail.com",

  // Mon=1 … Sun=7. Displayed on contact page and in OpeningHoursSpecification.
  hours: [
    { days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], opens: "07:30", closes: "18:00" },
  ] as { days: string[]; opens: string; closes: string }[],
  hoursConfirmed: false, // flip to true once the owner confirms; unconfirmed hours stay out of schema

  // Licence shown in the footer and in schema once confirmed (KHDA / ADEK / SPEA / MoE).
  licence: { authority: "ADEK", number: "" }, // TODO: ADEK licence number

  founder: {
    name: "G.B. Saravana Kumar",
    role: "Founder & Principal",
    image: "/images/founder.webp",
    quote:
      "Every child carries a seed of greatness within; through love, care, and joyful learning, we nurture it and help it blossom into its fullest potential.",
  },

  // Real profiles only. These become `sameAs`, which is how Google ties the site to its entity.
  sameAs: [] as string[], // e.g. GBP URL, Instagram, Facebook

  analytics: {
    ga4: process.env.NEXT_PUBLIC_GA4_ID || "",
  },
} as const;

export const hasAddress = Boolean(site.streetAddress && site.city);
export const hasPhone = Boolean(site.phone);
export const hasWhatsApp = Boolean(site.whatsapp);

/** "Al Barsha, Dubai" style label for copy; falls back to the country. */
export function placeLabel(): string {
  const parts = [site.area, site.city || site.emirate].filter(Boolean);
  return parts.length ? parts.join(", ") : "the UAE";
}

export function whatsappLink(message: string): string {
  const text = encodeURIComponent(message);
  return site.whatsapp ? `https://wa.me/${site.whatsapp}?text=${text}` : `/contact?via=whatsapp`;
}

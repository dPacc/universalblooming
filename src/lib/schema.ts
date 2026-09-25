/**
 * Central JSON-LD builders. Every node references the organisation and website
 * by @id, so Google sees one connected entity graph instead of loose islands.
 * Fields with unknown values (address, phone, geo, hours) are omitted rather
 * than faked; see src/config/site.ts.
 */
import { SITE_URL, site, hasAddress } from "@/config/site";
import type { Faq } from "@/content/types";
import { stripInline } from "@/lib/inline";
import { ogImageUrl } from "@/lib/seo";

export const ORG_ID = `${SITE_URL}/#organization`;
export const WEBSITE_ID = `${SITE_URL}/#website`;
export const FOUNDER_ID = `${SITE_URL}/about#founder`;

type Node = Record<string, unknown>;

const url = (path: string) => (path.startsWith("http") ? path : `${SITE_URL}${path === "/" ? "" : path}`);

export function organizationNode(): Node {
  const node: Node = {
    "@type": ["ChildCare", "Preschool"],
    "@id": ORG_ID,
    name: site.name,
    legalName: site.legalName,
    alternateName: "Universal Blooming Preschool, Day Care & After School Activities",
    slogan: site.tagline,
    description: site.description,
    url: SITE_URL,
    logo: { "@type": "ImageObject", url: `${SITE_URL}/images/logo-square.png`, width: 512, height: 512 },
    image: `${SITE_URL}/images/logo-square.png`,
    email: site.email,
    founder: { "@id": FOUNDER_ID },
    areaServed: site.city
      ? { "@type": "City", name: site.city, containedInPlace: { "@type": "Country", name: site.country } }
      : { "@type": "Country", name: site.country },
    audience: { "@type": "PeopleAudience", audienceType: "Children" },
    knowsAbout: [
      "Early childhood education",
      "Play-based learning",
      "Preschool",
      "Day care",
      "School readiness",
      "After-school activities",
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Programs",
      itemListElement: ["preschool", "day-care", "after-school"].map((s) => ({
        "@type": "Offer",
        itemOffered: { "@id": `${SITE_URL}/programs/${s}#service` },
      })),
    },
    currenciesAccepted: "AED",
  };
  if (hasAddress) {
    node.address = {
      "@type": "PostalAddress",
      streetAddress: site.streetAddress,
      addressLocality: site.city,
      addressRegion: site.emirate,
      postalCode: site.postalCode || undefined,
      addressCountry: site.countryCode,
    };
  }
  if (site.geo) node.geo = { "@type": "GeoCoordinates", latitude: site.geo.lat, longitude: site.geo.lng };
  if (site.googleMapsUrl) node.hasMap = site.googleMapsUrl;
  if (site.phone) node.telephone = site.phone;
  if (site.hoursConfirmed) {
    node.openingHoursSpecification = site.hours.map((h) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: h.days,
      opens: h.opens,
      closes: h.closes,
    }));
  }
  if (site.sameAs.length) node.sameAs = site.sameAs;
  if (site.licence.number) {
    node.hasCredential = {
      "@type": "EducationalOccupationalCredential",
      credentialCategory: "licence",
      recognizedBy: { "@type": "GovernmentOrganization", name: site.licence.authority },
      identifier: site.licence.number,
    };
  }
  return node;
}

export function founderNode(): Node {
  return {
    "@type": "Person",
    "@id": FOUNDER_ID,
    name: site.founder.name,
    jobTitle: site.founder.role,
    image: `${SITE_URL}${site.founder.image}`,
    worksFor: { "@id": ORG_ID },
  };
}

export function websiteNode(): Node {
  return {
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: SITE_URL,
    name: site.name,
    description: site.description,
    inLanguage: "en-AE",
    publisher: { "@id": ORG_ID },
  };
}

export interface Crumb {
  name: string;
  path: string;
}

export function breadcrumbNode(crumbs: Crumb[]): Node {
  return {
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: url(c.path),
    })),
  };
}

export function faqNode(faqs: Faq[], path: string): Node {
  return {
    "@type": "FAQPage",
    "@id": `${url(path)}#faq`,
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: stripInline(f.a) },
    })),
  };
}

export function webPageNode(opts: {
  path: string;
  name: string;
  description: string;
  type?: string;
  modified?: string;
  published?: string;
  speakable?: boolean;
}): Node {
  const node: Node = {
    "@type": opts.type || "WebPage",
    "@id": `${url(opts.path)}#webpage`,
    url: url(opts.path),
    name: opts.name,
    description: opts.description,
    isPartOf: { "@id": WEBSITE_ID },
    about: { "@id": ORG_ID },
    inLanguage: "en-AE",
  };
  if (opts.published) node.datePublished = opts.published;
  if (opts.modified) node.dateModified = opts.modified;
  if (opts.speakable) node.speakable = { "@type": "SpeakableSpecification", cssSelector: [".quick-answer", "h1"] };
  return node;
}

export function serviceNode(opts: {
  path: string;
  name: string;
  description: string;
  minAge?: number;
  maxAge?: number;
  serviceType: string;
}): Node {
  const audience: Node = { "@type": "PeopleAudience", audienceType: "Children" };
  if (opts.minAge !== undefined) audience.suggestedMinAge = opts.minAge;
  if (opts.maxAge !== undefined) audience.suggestedMaxAge = opts.maxAge;
  return {
    "@type": "Service",
    "@id": `${url(opts.path)}#service`,
    name: opts.name,
    serviceType: opts.serviceType,
    description: opts.description,
    url: url(opts.path),
    provider: { "@id": ORG_ID },
    areaServed: site.city ? { "@type": "City", name: site.city } : { "@type": "Country", name: site.country },
    audience,
    offers: {
      "@type": "Offer",
      availability: "https://schema.org/InStock",
      url: `${SITE_URL}/admissions`,
      priceCurrency: "AED",
      seller: { "@id": ORG_ID },
    },
  };
}

export function articleNode(opts: {
  path: string;
  headline: string;
  description: string;
  published: string;
  modified: string;
  keywords: string[];
  section: string;
  wordCount: number;
  citations: { label: string; url: string }[];
}): Node {
  return {
    "@type": "Article",
    "@id": `${url(opts.path)}#article`,
    headline: opts.headline,
    description: opts.description,
    mainEntityOfPage: { "@id": `${url(opts.path)}#webpage` },
    image: ogImageUrl(opts.headline, opts.section),
    datePublished: opts.published,
    dateModified: opts.modified,
    author: { "@id": FOUNDER_ID },
    reviewedBy: { "@id": FOUNDER_ID },
    publisher: { "@id": ORG_ID },
    articleSection: opts.section,
    keywords: opts.keywords.join(", "),
    wordCount: opts.wordCount,
    inLanguage: "en-AE",
    citation: opts.citations.map((c) => ({ "@type": "CreativeWork", name: c.label, url: c.url })),
    speakable: { "@type": "SpeakableSpecification", cssSelector: [".quick-answer"] },
  };
}

export function webAppNode(opts: { path: string; name: string; description: string }): Node {
  return {
    "@type": "WebApplication",
    "@id": `${url(opts.path)}#app`,
    name: opts.name,
    description: opts.description,
    url: url(opts.path),
    applicationCategory: "EducationalApplication",
    operatingSystem: "Any (web browser)",
    isAccessibleForFree: true,
    offers: { "@type": "Offer", price: "0", priceCurrency: "AED" },
    provider: { "@id": ORG_ID },
  };
}

export function itemListNode(path: string, items: { name: string; path: string }[]): Node {
  return {
    "@type": "ItemList",
    "@id": `${url(path)}#list`,
    itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.name, url: url(it.path) })),
  };
}

/** Wrap nodes in a single @graph. */
export function graph(...nodes: (Node | null | undefined | false)[]): Node {
  return { "@context": "https://schema.org", "@graph": nodes.filter(Boolean) };
}

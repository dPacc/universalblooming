/**
 * Content model. Every page is rendered from these typed objects, and the
 * sitemap, llms.txt, related-content blocks and JSON-LD are derived from the
 * same objects, so adding a guide automatically wires it everywhere.
 *
 * Inline strings support **bold** and [link text](/internal-or-https-url).
 * Use `{year}` for the current year in titles/descriptions.
 */

export type Inline = string;

export type Block =
  | { type: "p"; text: Inline }
  | { type: "h3"; text: string }
  | { type: "ul"; items: Inline[] }
  | { type: "ol"; items: Inline[] }
  | { type: "checklist"; items: Inline[] }
  | { type: "table"; caption?: string; head: string[]; rows: Inline[][] }
  | { type: "callout"; tone: "tip" | "note" | "warning"; title?: string; text: Inline }
  | { type: "quote"; text: Inline; cite?: string };

export interface Section {
  id: string; // kebab-case anchor, used in the table of contents
  title: string; // H2, question-form where natural ("How much does nursery cost in Dubai?")
  blocks: Block[];
}

export interface Faq {
  q: string;
  a: Inline;
}

export interface Source {
  label: string;
  url: string;
}

export type Accent = "pink" | "orange" | "yellow" | "green" | "teal" | "sky" | "blue" | "red";

export type ProgramSlug = "day-care" | "preschool" | "after-school";
export type ToolSlug = "nursery-age-calculator" | "nursery-readiness-quiz";

export interface Guide {
  slug: string;
  category: "Admissions" | "Fees & Costs" | "Choosing a Nursery" | "Child Development" | "Everyday Parenting";
  title: string; // H1
  seoTitle: string; // ≤ 50 chars incl. {year}; brand suffix is added automatically
  seoDescription: string; // 140–158 chars
  excerpt: string; // 1–2 sentences for cards
  quickAnswer: Inline; // 40–70 words; the snippet/AI-citation target, shown above the fold
  keywords: string[];
  published: string; // YYYY-MM-DD
  updated: string; // YYYY-MM-DD
  accent: Accent;
  sections: Section[];
  faqs: Faq[];
  sources: Source[];
  related: string[]; // other guide slugs
  relatedPrograms: ProgramSlug[];
  tool?: ToolSlug;
}

export interface Program {
  slug: ProgramSlug;
  name: string; // "Day Care"
  /** Displayed age range, e.g. "3–6 years". Omitted for Day Care, which never shows an age. */
  ageLabel?: string;
  ageMinMonths: number; // internal: used for program matching, never displayed on its own
  ageMaxMonths: number;
  accent: Accent;
  emoji: string;
  tagline: string;
  cardText: string;
  seoTitle: string;
  seoDescription: string;
  quickAnswer: Inline;
  keywords: string[];
  highlights: { title: string; text: string; icon: string }[];
  day: { time: string; title: string; text: string; icon: string }[];
  sections: Section[];
  faqs: Faq[];
  relatedGuides: string[];
  relatedActivities: string[];
}

export interface Activity {
  slug: string;
  name: string;
  accent: Accent;
  icon: string; // emoji
  ageLabel: string;
  tagline: string;
  cardText: string;
  seoTitle: string;
  seoDescription: string;
  quickAnswer: Inline;
  keywords: string[];
  skills: string[];
  sections: Section[];
  faqs: Faq[];
  relatedPrograms: ProgramSlug[];
  relatedGuides: string[];
}

/** Neighbourhood landing pages. Kept unpublished until the real address is known. */
export interface Area {
  slug: string;
  name: string;
  emirate: string;
  published: boolean;
  distanceNote: string; // e.g. "8 minutes by car via Umm Suqeim Street"
  intro: Inline[];
  landmarks: string[];
  commuteTips: Inline[];
  faqs: Faq[];
}

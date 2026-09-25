import type { Metadata } from "next";
import { SITE_URL, site } from "@/config/site";

/**
 * SERP-length helpers (ported from Wathim's seo-meta.ts).
 * The layout template appends " | Universal Blooming" to every title, so a
 * page's own title has TITLE_LIMIT - suffix characters to work with.
 */
export const TITLE_SUFFIX = ` | ${site.name}`;
export const TITLE_LIMIT = 62;
export const DESCRIPTION_LIMIT = 158;

export function titleFits(title: string): boolean {
  return title.length + TITLE_SUFFIX.length <= TITLE_LIMIT;
}

/** First candidate that fits with the brand suffix; otherwise the brand is dropped (absolute title). */
export function pickTitle(...candidates: string[]): Metadata["title"] {
  const usable = candidates.filter(Boolean).map(withYear);
  const fitting = usable.find(titleFits);
  if (fitting) return fitting;
  const bare = usable.find((t) => t.length <= TITLE_LIMIT);
  if (bare) return { absolute: bare };
  const last = usable[usable.length - 1] ?? site.name;
  const head = last.slice(0, TITLE_LIMIT);
  return { absolute: head.slice(0, head.lastIndexOf(" ")).replace(/[\s,;:\-—·&]+$/, "") };
}

const DANGLING = /\b(and|or|the|a|an|to|of|for|in|on|with|at|by|is|are|from|as|your|how|why|what)$/i;

export function clampDescription(text: string, limit = DESCRIPTION_LIMIT): string {
  const s = withYear(text).trim().replace(/\s+/g, " ");
  if (s.length <= limit) return s;
  let best = "";
  for (const part of s.split(/(?<=[.!?])\s+/)) {
    const next = best ? `${best} ${part}` : part;
    if (next.length <= limit) best = next;
    else break;
  }
  if (best.length >= limit - 40) return best;
  let cut = s.slice(0, limit);
  cut = cut.slice(0, cut.lastIndexOf(" ")).replace(/[\s,;:\-—·&]+$/, "");
  while (DANGLING.test(cut)) cut = cut.slice(0, cut.lastIndexOf(" ")).replace(/[\s,;:\-—·&]+$/, "");
  return `${cut}.`;
}

/** `{year}` → current year. Only tokens are replaced, so real dates in prose are safe. */
export function withYear(text: string): string {
  return text.replace(/\{year\}/g, String(new Date().getFullYear()));
}

export function absoluteUrl(path = "/"): string {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`.replace(/\/$/, "") || SITE_URL;
}

/** Static hosting (GitHub Pages) has no server, so per-page OG cards fall back to one pre-rendered card. */
export const STATIC_EXPORT = process.env.NEXT_PUBLIC_STATIC_EXPORT === "1";

export function ogImageUrl(title: string, eyebrow?: string): string {
  if (STATIC_EXPORT) return `${SITE_URL}/images/og-default.png`;
  const q = new URLSearchParams({ title: withYear(title) });
  if (eyebrow) q.set("eyebrow", eyebrow);
  return `${SITE_URL}/og?${q.toString()}`;
}

interface PageMetaInput {
  path: string;
  titles: string[]; // best first; see pickTitle
  description: string;
  ogTitle?: string;
  eyebrow?: string;
  keywords?: string[];
  type?: "website" | "article";
  published?: string;
  modified?: string;
  noindex?: boolean;
}

/** Every page's metadata goes through here so canonical, OG and Twitter can't drift. */
export function pageMetadata(input: PageMetaInput): Metadata {
  const title = pickTitle(...input.titles);
  const description = clampDescription(input.description);
  const ogTitle = withYear(input.ogTitle || input.titles[0]);
  const image = ogImageUrl(ogTitle, input.eyebrow);
  return {
    title,
    description,
    keywords: input.keywords,
    alternates: { canonical: absoluteUrl(input.path) },
    robots: input.noindex ? { index: false, follow: true } : undefined,
    openGraph: {
      type: input.type || "website",
      url: absoluteUrl(input.path),
      title: ogTitle,
      description,
      siteName: site.name,
      locale: "en_AE",
      images: [{ url: image, width: 1200, height: 630, alt: ogTitle }],
      ...(input.type === "article"
        ? { publishedTime: input.published, modifiedTime: input.modified || input.published }
        : {}),
    },
    twitter: { card: "summary_large_image", title: ogTitle, description, images: [image] },
  };
}

/** Resolve `{year}` in every string of a content object (token-only; literal dates untouched). */
export function resolveYears<T>(value: T): T {
  if (typeof value === "string") return withYear(value) as T;
  if (Array.isArray(value)) return value.map(resolveYears) as T;
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, resolveYears(v)])) as T;
  }
  return value;
}

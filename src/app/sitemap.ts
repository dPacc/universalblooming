import type { MetadataRoute } from "next";
import { SITE_URL } from "@/config/site";
import { programs } from "@/content/programs";
import { activities } from "@/content/activities";
import { guides } from "@/content/guides";

// Required for the static (GitHub Pages) export; harmless on a server build.
export const dynamic = "force-static";

/**
 * Built from the content registries. `lastModified` uses real content dates
 * (not build time, a weakness flagged in the Wathim GEO audit) so Google can
 * trust the signal. Bump SITE_UPDATED when page templates change.
 */
const SITE_UPDATED = "2026-09-25";

export default function sitemap(): MetadataRoute.Sitemap {
  const u = (path: string, lastModified = SITE_UPDATED, priority = 0.7, changeFrequency: "weekly" | "monthly" | "yearly" = "monthly") => ({
    url: `${SITE_URL}${path}`,
    lastModified,
    priority,
    changeFrequency,
  });
  return [
    u("/", SITE_UPDATED, 1, "weekly"),
    u("/admissions", SITE_UPDATED, 0.95, "weekly"),
    u("/programs", SITE_UPDATED, 0.9),
    ...programs.map((p) => u(`/programs/${p.slug}`, SITE_UPDATED, 0.9)),
    u("/contact", SITE_UPDATED, 0.8),
    u("/about", SITE_UPDATED, 0.6),
    u("/activities", SITE_UPDATED, 0.7),
    ...activities.map((a) => u(`/activities/${a.slug}`, SITE_UPDATED, 0.6)),
    u("/parents-guide", guides.map((g) => g.updated).sort().at(-1), 0.8, "weekly"),
    ...guides.map((g) => u(`/parents-guide/${g.slug}`, g.updated, 0.75)),
    u("/tools", SITE_UPDATED, 0.6),
    u("/tools/nursery-age-calculator", SITE_UPDATED, 0.85),
    u("/tools/nursery-readiness-quiz", SITE_UPDATED, 0.7),
    u("/faq", SITE_UPDATED, 0.6),
    u("/privacy", SITE_UPDATED, 0.1, "yearly"),
    u("/terms", SITE_UPDATED, 0.1, "yearly"),
  ];
}

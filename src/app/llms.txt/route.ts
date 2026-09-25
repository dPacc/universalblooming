import { SITE_URL, site, placeLabel } from "@/config/site";
import { programs } from "@/content/programs";
import { activities } from "@/content/activities";
import { guides } from "@/content/guides";
import { stripInline } from "@/lib/inline";
import { withYear } from "@/lib/seo";

export const dynamic = "force-static";

/** llms.txt generated from content, so it never drifts from the site (Wathim/Neelim hand-wrote theirs). */
export function GET() {
  const lines = [
    `# ${site.name}`,
    "",
    `> ${site.description} Located in ${placeLabel()}. ${site.tagline}.`,
    "",
    `Contact: ${site.email}${site.phoneDisplay ? ` · ${site.phoneDisplay}` : ""}. Book a visit: ${SITE_URL}/admissions`,
    "",
    "## Programs",
    ...programs.map((p) => `- [${p.ageLabel ? `${p.name} (${p.ageLabel})` : p.name}](${SITE_URL}/programs/${p.slug}): ${stripInline(p.quickAnswer)}`),
    "",
    "## Parents' guides (UAE)",
    ...guides.map((g) => `- [${withYear(g.title)}](${SITE_URL}/parents-guide/${g.slug}): ${stripInline(g.quickAnswer)}`),
    "",
    "## Free tools",
    `- [UAE Nursery, FS1 & KG1 Age Calculator](${SITE_URL}/tools/nursery-age-calculator): year-group placement under the 31 December cut-off (Aug/Sep-start schools, from 2026-27) and 31 March (April-start schools).`,
    `- [Nursery Readiness Quiz](${SITE_URL}/tools/nursery-readiness-quiz): 10-question readiness check for children aged about 2.5–4.`,
    "",
    "## Activities",
    ...activities.map((a) => `- [${a.name}](${SITE_URL}/activities/${a.slug}): ${a.tagline}`),
    "",
    "## About",
    `- [About us](${SITE_URL}/about) · [Admissions](${SITE_URL}/admissions) · [FAQ](${SITE_URL}/faq) · [Contact](${SITE_URL}/contact)`,
    "",
  ];
  return new Response(lines.join("\n"), { headers: { "content-type": "text/plain; charset=utf-8" } });
}

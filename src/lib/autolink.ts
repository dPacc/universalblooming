/**
 * Entity autolinker (after Wathim's autolinker.tsx).
 *
 * Per page, links the FIRST plain-text mention of each known entity to its hub,
 * never links a page to itself, skips targets the author already linked
 * explicitly, and caps the total so prose never turns into a link farm.
 */

interface Rule {
  term: string;
  href: string;
}

// Longer terms first so "Montessori nursery" beats "Montessori".
const RULES: Rule[] = [
  { term: "separation anxiety", href: "/parents-guide/settling-into-nursery" },
  { term: "settling-in", href: "/parents-guide/settling-into-nursery" },
  { term: "school readiness", href: "/parents-guide/school-readiness-checklist" },
  { term: "developmental milestones", href: "/parents-guide/child-development-milestones" },
  { term: "milestones", href: "/parents-guide/child-development-milestones" },
  { term: "age cut-off", href: "/tools/nursery-age-calculator" },
  { term: "cut-off date", href: "/tools/nursery-age-calculator" },
  { term: "nursery fees", href: "/parents-guide/nursery-fees-uae" },
  { term: "registration documents", href: "/parents-guide/nursery-registration-documents-uae" },
  { term: "vaccination record", href: "/parents-guide/nursery-registration-documents-uae" },
  { term: "Emirates ID", href: "/parents-guide/nursery-registration-documents-uae" },
  { term: "EYFS", href: "/parents-guide/nursery-curriculum-uae" },
  { term: "Montessori", href: "/parents-guide/nursery-curriculum-uae" },
  { term: "Reggio Emilia", href: "/parents-guide/nursery-curriculum-uae" },
  { term: "FS1", href: "/parents-guide/nursery-age-uae" },
  { term: "KG1", href: "/parents-guide/nursery-age-uae" },
  { term: "KHDA", href: "/parents-guide/nursery-age-uae" },
  { term: "after-school activities", href: "/programs/after-school" },
  { term: "after school activities", href: "/programs/after-school" },
  { term: "day care", href: "/programs/day-care" },
  { term: "daycare", href: "/programs/day-care" },
  { term: "preschool", href: "/programs/preschool" },
  { term: "fine motor", href: "/activities/creative-arts" },
  { term: "gross motor", href: "/activities/outdoor-play" },
  { term: "phonics", href: "/activities/storytime-and-phonics" },
  { term: "STEM", href: "/activities/little-scientists" },
].sort((a, b) => b.term.length - a.term.length);

export class Linker {
  private used = new Set<string>();
  private count = 0;
  constructor(
    private self: string,
    private max = 8,
  ) {
    this.used.add(self);
  }

  /** Register an explicit author link so we don't duplicate it. */
  claim(href: string) {
    this.used.add(href.split("#")[0]);
  }

  /** Split plain text into [text, {term, href}, text…] for the first unused matches. */
  split(text: string): (string | { v: string; href: string })[] {
    if (this.count >= this.max) return [text];
    for (const r of RULES) {
      if (this.used.has(r.href) || this.self.startsWith(r.href)) continue;
      const re = new RegExp(`(^|[^\\w-])(${escape(r.term)})(?![\\w-])`, "i");
      const m = re.exec(text);
      if (!m) continue;
      const start = m.index + m[1].length;
      this.used.add(r.href);
      this.count++;
      return [
        ...this.split(text.slice(0, start)),
        { v: m[2], href: r.href },
        ...this.split(text.slice(start + m[2].length)),
      ];
    }
    return [text];
  }
}

function escape(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

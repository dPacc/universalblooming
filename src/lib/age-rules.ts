/**
 * UAE year-group placement rules (pure functions, unit-testable).
 *
 * Sources (see docs/uae-factpack.md §2):
 *  - MoE, 17 Dec 2025: from AY 2026-27, Aug/Sep-start schools use a 31 December
 *    cut-off (was 31 August). April-start schools keep 31 March.
 *  - KHDA Student Placement Guidelines FAQ, Appendix 1 (24 Jun 2026): age 3 →
 *    FS1/Pre-KG, 4 → FS2/KG1, 5 → Year 1/KG2, 6 → Year 2/Grade 1 (Sept-start);
 *    April-start: age 3 → KG1, 4 → KG2, 5 → Grade 1, by 31 March of joining year.
 * Placement is driven by birth-date windows (age completed on the cut-off day),
 * which avoids the "3 by 31 March" vs "4 by 31 March" wording ambiguity.
 */

export type SchoolType = "september" | "april";

export interface Placement {
  academicYear: string; // "2026-27"
  startLabel: string; // "Aug/Sep 2026"
  cutoff: string; // "31 Dec 2026"
  ageOnCutoff: { years: number; months: number };
  group: string; // headline, e.g. "FS1 / Pre-KG"
  aliases: string; // other curricula names
  stage: "baby" | "nursery" | "kg" | "school";
  notes: string[];
}

const FIRST_NEW_RULE_YEAR = 2026;

function ageOn(dob: Date, on: Date) {
  let years = on.getFullYear() - dob.getFullYear();
  let months = on.getMonth() - dob.getMonth();
  if (on.getDate() < dob.getDate()) months--;
  if (months < 0) {
    years--;
    months += 12;
  }
  return { years, months };
}

const fmt = (d: Date) => d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });

const SEPT_GROUPS: Record<number, { group: string; aliases: string }> = {
  3: { group: "FS1 / Pre-KG", aliases: "British FS1 · American Pre-K · IB PYP Early Years · MoE Pre-KG · French PS" },
  4: { group: "FS2 / KG1", aliases: "British FS2 (Reception) · American KG1 · MoE KG1 · French MS" },
  5: { group: "Year 1 / KG2", aliases: "British Year 1 · American KG2 (Kindergarten) · MoE KG2 · French GS" },
  6: { group: "Year 2 / Grade 1", aliases: "British Year 2 · American & MoE Grade 1 · IB PYP Year 1 · French CP" },
};

const APRIL_GROUPS: Record<number, { group: string; aliases: string }> = {
  3: { group: "KG1 (LKG)", aliases: "Indian / Pakistani curriculum KG1, often called LKG" },
  4: { group: "KG2 (UKG)", aliases: "Indian / Pakistani curriculum KG2, often called UKG" },
  5: { group: "Grade 1", aliases: "Indian / Pakistani curriculum Grade 1" },
};

export function placements(dob: Date, type: SchoolType, fromYear = FIRST_NEW_RULE_YEAR, count = 3): Placement[] {
  const out: Placement[] = [];
  for (let y = fromYear; y < fromYear + count; y++) {
    const cutoff = type === "september" ? new Date(Date.UTC(y, 11, 31)) : new Date(Date.UTC(y, 2, 31));
    const start = type === "september" ? new Date(Date.UTC(y, 7, 25)) : new Date(Date.UTC(y, 3, 1));
    const age = ageOn(dob, cutoff);
    const ageAtStart = ageOn(dob, start);
    const table = type === "september" ? SEPT_GROUPS : APRIL_GROUPS;
    const minAge = type === "september" ? 3 : 3;
    const maxAge = type === "september" ? 6 : 5;
    const notes: string[] = [];
    let group: string;
    let aliases = "";
    let stage: Placement["stage"];

    if (age.years < 0 || (age.years === 0 && ageAtStart.years < 0)) {
      group = "Not born yet";
      stage = "baby";
    } else if (age.years < minAge) {
      const monthsAtStart = ageAtStart.years * 12 + ageAtStart.months;
      stage = monthsAtStart < 12 ? "baby" : "nursery";
      group = monthsAtStart < 12 ? "Baby room / infant care" : "Nursery / Day Care (before FS1)";
      aliases =
        type === "april" && age.years === 2
          ? "Some Indian-curriculum schools run a Pre-KG class at this age; most children are in nursery"
          : "Nursery rooms go by age, not a formal grade";
      if (monthsAtStart < 12) notes.push("UAE nurseries can accept babies from 45 days old. Ask the Universal Blooming team about Day Care availability for your little one.");
    } else if (age.years > maxAge) {
      group = type === "september" ? "Year 3 / Grade 2 or above" : "Grade 2 or above";
      stage = "school";
    } else {
      ({ group, aliases } = table[age.years]);
      stage = age.years >= (type === "september" ? 6 : 5) ? "school" : "kg";
    }

    // Transitional & flexibility notes (September-start only).
    if (type === "september") {
      const m = dob.getUTCMonth();
      const by = dob.getUTCFullYear();
      if (y === 2026 && by === 2022 && m >= 8) {
        notes.push(
          "Dubai one-off rule for 2026-27: children born 1 Sep–31 Dec 2022 who are not enrolled in any school or nursery may start in FS1 or FS2, agreed between parents and school.",
        );
      }
      if (y === 2026 && by === 2021 && m >= 8) {
        notes.push("Reported MoE flexibility for 2026-27: children born 1 Sep–31 Dec 2021 may be placed in KG1 or KG2 based on readiness. Confirm with the school.");
      }
      if (age.years === 3 && m >= 8 && by === y - 3) {
        notes.push("Born September to December: British-curriculum schools may assess FS1 readiness; otherwise your child joins FS1 the following year.");
      }
    } else if (age.years >= 2 && age.years <= 5) {
      notes.push("Some Indian-curriculum schools set their own admission policy. Always confirm with the school.");
    }

    out.push({
      academicYear: `${y}-${String((y + 1) % 100).padStart(2, "0")}`,
      startLabel: type === "september" ? `Aug/Sep ${y}` : `April ${y}`,
      cutoff: fmt(cutoff),
      ageOnCutoff: age,
      group,
      aliases,
      stage,
      notes,
    });
  }
  return out;
}

/** Which Universal Blooming program fits today. */
export function programForAge(dob: Date, today = new Date()): { slug: string; name: string } | null {
  const a = ageOn(dob, today);
  const m = a.years * 12 + a.months;
  if (m < 0) return null;
  if (m < 36) return { slug: "day-care", name: "Day Care" };
  if (m < 72) return { slug: "preschool", name: "Preschool" };
  return { slug: "after-school", name: "After School Activities" };
}

export function ageToday(dob: Date, today = new Date()) {
  return ageOn(dob, today);
}

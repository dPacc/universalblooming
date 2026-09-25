import type { Guide } from "../types";
import { resolveYears } from "@/lib/seo";
import nurseryAge from "./nursery-age-uae";
import nurseryFees from "./nursery-fees-uae";
import chooseNursery from "./how-to-choose-a-nursery-uae";
import documents from "./nursery-registration-documents-uae";
import daycareVs from "./daycare-vs-preschool-vs-nursery";
import curriculum from "./nursery-curriculum-uae";
import settling from "./settling-into-nursery";
import milestones from "./child-development-milestones";
import readiness from "./school-readiness-checklist";
import afterSchool from "./after-school-activities-guide";

/** Ordered by commercial intent: the first guides appear in the footer and home. */
export const guides: Guide[] = resolveYears([
  nurseryAge,
  nurseryFees,
  chooseNursery,
  documents,
  daycareVs,
  curriculum,
  settling,
  milestones,
  readiness,
  afterSchool,
]);

export const getGuide = (slug: string) => guides.find((g) => g.slug === slug);

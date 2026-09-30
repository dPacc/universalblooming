import type { Guide } from "../types";
import { resolveYears } from "@/lib/seo";
import preschoolAge from "./preschool-age-uae";
import preschoolFees from "./preschool-fees-uae";
import choosePreschool from "./how-to-choose-a-preschool-uae";
import documents from "./preschool-registration-documents-uae";
import daycareVs from "./daycare-vs-preschool-vs-kindergarten";
import curriculum from "./preschool-curriculum-uae";
import settling from "./settling-into-preschool";
import milestones from "./child-development-milestones";
import readiness from "./school-readiness-checklist";
import afterSchool from "./after-school-activities-guide";

/** Ordered by commercial intent: the first guides appear in the footer and home. */
export const guides: Guide[] = resolveYears([
  preschoolAge,
  preschoolFees,
  choosePreschool,
  documents,
  daycareVs,
  curriculum,
  settling,
  milestones,
  readiness,
  afterSchool,
]);

export const getGuide = (slug: string) => guides.find((g) => g.slug === slug);

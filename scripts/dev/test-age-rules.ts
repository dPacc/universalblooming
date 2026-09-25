import { placements } from "../../src/lib/age-rules";
const cases: [string, "september"|"april"][] = [["2023-05-10","september"],["2023-11-20","september"],["2022-10-02","september"],["2024-03-01","september"],["2022-06-01","april"],["2023-02-15","april"],["2025-12-01","september"]];
for (const [d,t] of cases) {
  console.log(d, t, placements(new Date(d+"T00:00:00Z"), t).map(p=>`${p.academicYear}:${p.group}${p.notes.length?` [${p.notes.length} notes]`:""}`).join(" | "));
}

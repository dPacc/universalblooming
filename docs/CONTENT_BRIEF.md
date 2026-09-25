# Universal Blooming content brief

Universal Blooming is a play-based nursery, preschool and day care in the **UAE** (emirate/neighbourhood not yet confirmed, so write UAE-wide; mention Dubai, Abu Dhabi and Sharjah specifics where rules differ). Brand line: "Where Young Minds Bloom". Founder & Principal: **G.B. Saravana Kumar**.

Programs (from the owner's current site):
- **Day Care**: 1–3 years. A warm, safe, caring environment where little ones feel loved.
- **Pre School**: 3–5 years. Creativity, confidence and basic learning skills through play.
- **After School Activities**: 5+ years. Exploring hobbies and discovering new talents after class.

Activities named by the owner: Creative Arts (painting, crafts, drawing), Storytime (language skills), Outdoor Play (motor skills), Social Skills (teamwork and kindness), Music, Sports & Games, Science.

Mission: a joyful learning space where children explore, discover and grow into confident learners. Vision: nurture young minds and help every child bloom with knowledge, creativity and happiness.

## Hard rules
1. **Never invent facts about the centre.** No specific fees, ratios, staff counts, qualifications, facilities (pool, garden, CCTV, bus), meal menus, opening hours, licence numbers, awards, years in operation, or student numbers. Describe the *approach* and what children *do*. When parents need centre specifics, tell them to ask on a visit / WhatsApp and link to [/admissions](/admissions) or [/contact](/contact).
2. **Never invent external figures.** Every UAE rule, fee range or statistic must come from the fact pack at `/tmp/claude-1000/-home-nmcd-rrod-wathim-dev/23ae1bb2-f774-482c-af4e-48b77b3f8890/scratchpad/uae-factpack.md` (when referenced) and be cited in `sources` with the URL. If the fact pack marks something uncertain, phrase it cautiously ("typically", "at the time of writing, check with KHDA") or leave it out.
3. No em dashes (—) or en dashes used as punctuation. Use commas, colons or full stops. Ranges like "1–3 years" may use an en dash.
4. British/UAE English spelling (programme is fine in prose but slugs/names use "program"; colour, centre, nursery, FS1, KG1).
5. Warm, plain, confident parent-to-parent tone. Short paragraphs (2–4 sentences). No fluff intros ("In today's fast-paced world"). Open every page with the answer.
6. Question-form H2s where natural, matching real searches ("What age can my child start nursery in Dubai?").
7. Concrete and useful: tables, checklists, numbers (with sources), examples, what-to-ask lists.
8. Internal links use inline syntax `[anchor text](/path)` with descriptive anchors (never "click here"). 6+ internal links per guide, 4+ per program/activity page, spread through the body, only to URLs in the map below.
9. Inline formatting available: `**bold**` and `[text](/path)`. Nothing else (no HTML, no markdown headings inside text).

## URL map (only link to these)
- `/` home
- `/programs` · `/programs/day-care` · `/programs/preschool` · `/programs/after-school`
- `/activities` · `/activities/creative-arts` · `/activities/storytime-and-phonics` · `/activities/outdoor-play` · `/activities/social-and-emotional-skills` · `/activities/music-and-movement` · `/activities/sports-and-games` · `/activities/little-scientists`
- `/parents-guide` (hub) and guides:
  - `/parents-guide/nursery-age-uae`: what age can a child start nursery / FS1 / KG1 in the UAE (age cut-offs by emirate)
  - `/parents-guide/nursery-fees-uae`: nursery fees in the UAE, what's included, hidden costs
  - `/parents-guide/how-to-choose-a-nursery-uae`: checklist + questions to ask on a visit
  - `/parents-guide/nursery-registration-documents-uae`: documents needed to register
  - `/parents-guide/daycare-vs-preschool-vs-nursery`: differences, which one when
  - `/parents-guide/nursery-curriculum-uae`: EYFS vs Montessori vs play-based vs Reggio Emilia
  - `/parents-guide/settling-into-nursery`: settling-in and separation anxiety plan
  - `/parents-guide/child-development-milestones`: milestones from 1 to 5 years
  - `/parents-guide/school-readiness-checklist`: is my child ready for FS1/KG1/school
  - `/parents-guide/after-school-activities-guide`: choosing after-school activities for 5–12 year olds
- `/tools/nursery-age-calculator` (enter date of birth → which nursery/FS/KG year group)
- `/tools/nursery-readiness-quiz` (10-question quiz)
- `/admissions` (process, documents, book a visit) · `/about` · `/contact` · `/faq`

## Output format
TypeScript files that import types from `@/content/types` (see `src/content/types.ts`). Must type-check. Use double-quoted strings; escape inner quotes. Dates `2026-09-25` for published/updated.

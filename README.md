# Universal Blooming: website

SEO-first, lead-generating site for Universal Blooming (nursery, preschool and day care, UAE). Same architecture as Neelim and Wathim: typed content → static pages → schema, sitemap and llms.txt generated from the content.

```bash
pnpm install
pnpm dev     # http://localhost:3002
pnpm build && pnpm start
```

## Before launch (blocking)
Everything below lives in `src/config/site.ts`. Empty fields are left out of the page and the schema rather than shown as placeholders.

- [ ] **Address, area, emirate, geo coordinates, Google Maps URL and embed.** Copy them exactly from the Google Business Profile (GBP).
- [ ] **UAE phone and WhatsApp number.** The old site had +91 and placeholder numbers. Until this is set, WhatsApp links fall back to `/contact`.
- [ ] **Opening hours.** Set `hoursConfirmed: true` once the owner confirms them.
- [ ] **Licence authority and number** (KHDA, ADEK, SPEA or MoE).
- [ ] **`sameAs`:** the GBP, Instagram and Facebook URLs.
- [ ] **Env vars** (see `.env.example`): `SMTP_*` and/or `LEAD_WEBHOOK_URL` (a Google Sheet or CRM), `NEXT_PUBLIC_GA4_ID` (the old site used `G-9Q6H0QETRF`), and `NEXT_PUBLIC_GSC_VERIFICATION`.
- [ ] **Owner review of `/privacy`.** The 24-month retention period is a proposed default.
- [ ] **Owner check of the program pages.** Confirm the "approach" wording (key person, parent updates, indoor active play) matches practice.
- [ ] **Real photos of the centre** (classrooms, art corner, outdoor area, team). The vendor's photos are watermarked stock and were not reused.
- [ ] **Testimonials.** Collect real Google reviews and add them. The old site's testimonials were not carried over.

## After launch
1. Point the DNS at Vercel and use `www` as the canonical host (the redirects are in `next.config.ts`).
2. Submit `/sitemap.xml` to Google Search Console and Bing Webmaster Tools.
3. **Google Business Profile:** set the website link to `/?utm_source=gbp&utm_medium=organic`, set the category to "Preschool" plus "Child care agency", add photos weekly, and ask every family for a review.
4. Once the address is known, add the neighbourhood landing pages. The `Area` type is already in `src/content/types.ts`. Each page needs real local detail; never publish thin copies that only swap the area name.
5. Consider an Arabic version (`/ar`, with hreflang) using the Neelim next-intl pattern.

## Architecture
| Concern | Where |
|---|---|
| Business facts | `src/config/site.ts` |
| Content (programs, activities, 10 guides, page copy) | `src/content/**` (brief: `docs/CONTENT_BRIEF.md`) |
| Metadata helpers (title/description budgets, canonical, OG) | `src/lib/seo.ts` |
| JSON-LD graph (ChildCare+Preschool org, Person, Service, Article, FAQPage, HowTo, WebApplication, BreadcrumbList) | `src/lib/schema.ts` |
| Entity autolinker | `src/lib/autolink.ts` |
| UAE age placement rules (31 Dec / 31 Mar) | `src/lib/age-rules.ts` |
| Lead capture (server action, email and webhook, honeypot) | `src/app/actions/lead.ts`, `src/components/lead/*` |
| First/last-touch UTM attribution and GA4 events | `src/components/tracking/Attribution.tsx` |
| Bloomi mascot (7 moods, interactive) | `src/components/mascot/*`; static exports in `public/images/bloomi/` via `scripts/generate-bloomi-assets.tsx` |
| OG images | `src/app/og/route.tsx` |

Facts in the guides come from the fact pack (official sources are KHDA, MoE and ADEK). Re-verify the age rules every academic year and bump `updated` in each guide.

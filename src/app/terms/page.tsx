import type { Metadata } from "next";
import { site } from "@/config/site";
import { pageMetadata } from "@/lib/seo";
import { PageHero } from "@/components/ui/PageHero";

export const metadata: Metadata = pageMetadata({
  path: "/terms",
  titles: ["Website Terms of Use"],
  description: "Terms of use for the Universal Blooming website, including how to use our free parent guides and tools and the limits of the information provided.",
});

export default function Terms() {
  return (
    <>
      <PageHero crumbs={[{ name: "Home", path: "/" }, { name: "Terms", path: "/terms" }]} title="Website terms of use" lede={<p>Last updated 25 September 2026.</p>} />
      <article className="container-x prose-ub max-w-3xl mt-4">
        <p>By using this website you agree to these terms. The website is operated by {site.legalName}.</p>
        <h3>Information, guides and tools</h3>
        <p>Our parent guides, age calculator and readiness quiz are general information to help families. UAE admission rules can change and schools make final placement decisions, so always confirm with the relevant school or regulator (KHDA, ADEK, SPEA or the Ministry of Education). The readiness quiz is not a developmental assessment. If you have concerns about your child&apos;s development, speak to your paediatrician.</p>
        <h3>Enrolment</h3>
        <p>Programs, schedules and fees are confirmed in writing at enrolment. Nothing on this website is an offer of a place.</p>
        <h3>Content</h3>
        <p>The Universal Blooming name, logo, the Bloomi mascot and website content belong to {site.legalName}. You&apos;re welcome to share links to our guides.</p>
        <h3>Contact</h3>
        <p>Questions? Email <a href={`mailto:${site.email}`}>{site.email}</a>.</p>
      </article>
    </>
  );
}

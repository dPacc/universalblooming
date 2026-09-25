import type { Metadata } from "next";
import { site } from "@/config/site";
import { pageMetadata } from "@/lib/seo";
import { PageHero } from "@/components/ui/PageHero";

export const metadata: Metadata = pageMetadata({
  path: "/privacy",
  titles: ["Privacy Policy"],
  description: "How Universal Blooming collects, uses and protects the personal information you share through this website, in line with UAE data protection law.",
});

export default function Privacy() {
  return (
    <>
      <PageHero crumbs={[{ name: "Home", path: "/" }, { name: "Privacy", path: "/privacy" }]} title="Privacy policy" lede={<p>Last updated 25 September 2026.</p>} />
      <article className="container-x prose-ub max-w-3xl mt-4">
        <p>{site.legalName} (&quot;we&quot;) respects your privacy. This policy explains what we collect through this website and why. We process personal data in line with UAE Federal Decree-Law No. 45 of 2021 on the Protection of Personal Data.</p>
        <h3>What we collect</h3>
        <ul>
          <li>Details you submit in our forms: your name, phone number, email, your child&apos;s age range, the program you&apos;re interested in and any message.</li>
          <li>How you found us: the page you started on, the referring website and campaign tags (for example utm_source), so we understand which information helps parents.</li>
          <li>Anonymous usage statistics through Google Analytics, if enabled.</li>
        </ul>
        <h3>How we use it</h3>
        <p>Only to respond to your enquiry, arrange visits and improve this website. We never sell your data. We do not collect information about your child beyond an age range through this website.</p>
        <h3>How long we keep it</h3>
        <p>Enquiries are kept for up to 24 months unless you become a Universal Blooming family, in which case our enrolment privacy notice applies.</p>
        <h3>Your rights</h3>
        <p>You can ask us to access, correct or delete your data at any time by emailing <a href={`mailto:${site.email}`}>{site.email}</a>.</p>
        <h3>Cookies and local storage</h3>
        <p>We store a small record of how you arrived at the site in your browser so that an enquiry can tell us which page helped you. Analytics cookies are set only if analytics is enabled.</p>
      </article>
    </>
  );
}

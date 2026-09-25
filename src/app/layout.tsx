import type { Metadata, Viewport } from "next";
import { Fredoka, Nunito, Caveat } from "next/font/google";
import "./globals.css";
import { SITE_URL, site } from "@/config/site";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppFloat } from "@/components/lead/WhatsAppFloat";
import { Attribution } from "@/components/tracking/Attribution";
import { RevealScript } from "@/components/ui/RevealScript";
import { JsonLd } from "@/components/seo/JsonLd";
import { graph, organizationNode, websiteNode, founderNode } from "@/lib/schema";
import { ogImageUrl } from "@/lib/seo";

const fredoka = Fredoka({ subsets: ["latin"], variable: "--font-fredoka", display: "swap", weight: ["400", "500", "600", "700"] });
const nunito = Nunito({ subsets: ["latin"], variable: "--font-nunito", display: "swap" });
const caveat = Caveat({ subsets: ["latin"], variable: "--font-caveat", display: "swap", weight: ["600"] });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Universal Blooming | Preschool, Day Care & After School Activities in the UAE",
    template: `%s | ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  authors: [{ name: site.founder.name, url: `${SITE_URL}/about` }],
  creator: site.name,
  publisher: site.name,
  formatDetection: { telephone: false },
  robots: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
  openGraph: {
    type: "website",
    siteName: site.name,
    locale: "en_AE",
    images: [{ url: ogImageUrl("Where young minds bloom", "Preschool · Day Care · After School Activities"), width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image" },
  verification: {
    google: process.env.NEXT_PUBLIC_GSC_VERIFICATION || undefined,
    other: process.env.NEXT_PUBLIC_BING_VERIFICATION ? { "msvalidate.01": process.env.NEXT_PUBLIC_BING_VERIFICATION } : undefined,
  },
};

export const viewport: Viewport = {
  themeColor: "#fff9f0",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-AE" className={`${fredoka.variable} ${nunito.variable} ${caveat.variable}`}>
      <head>
        {/* Opt into reveal animations before first paint (no flash). */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
        <JsonLd data={graph(organizationNode(), websiteNode(), founderNode())} />
      </head>
      <body className="min-h-dvh overflow-x-clip">
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 btn btn-sun">
          Skip to content
        </a>
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <WhatsAppFloat />
        <RevealScript />
        <Attribution ga4={site.analytics.ga4} />
      </body>
    </html>
  );
}

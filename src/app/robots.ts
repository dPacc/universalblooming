import type { MetadataRoute } from "next";
import { SITE_URL } from "@/config/site";

/**
 * Open to search and AI answer engines on purpose: parents increasingly ask
 * ChatGPT / Perplexity / Gemini "best nursery near me", and being citable
 * there is a lead channel. /_next/ is NOT blocked (Google needs CSS/JS to render).
 */
const AI_BOTS = ["GPTBot", "OAI-SearchBot", "ChatGPT-User", "ClaudeBot", "Claude-SearchBot", "PerplexityBot", "Google-Extended", "Applebot-Extended", "Bingbot"];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/api/"] },
      { userAgent: AI_BOTS, allow: "/" },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}

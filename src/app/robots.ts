import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/siteConfig";

/**
 * Next.js App Router Metadata Route: /robots.txt
 * Configures search engine crawler access and points to the dynamic sitemap.xml.
 * 
 * Note on Architecture:
 * The portfolio's SecurityGate operates client-side. Web crawlers parsing initial HTML
 * receive the entry layout and metadata, but deeper interactive views (Learning Diary,
 * Project Grid, Skills View) render upon client authentication.
 */
export default function robots(): MetadataRoute.Robots {
  const siteUrl = getSiteUrl();

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}

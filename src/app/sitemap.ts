import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/siteConfig";

/**
 * Next.js App Router Metadata Route: /sitemap.xml
 * Generates an XML sitemap referencing genuine public application routes.
 * 
 * Architectural Note:
 * The recruiter-ready public portfolio landing page (/) is the primary indexed destination.
 * The interactive workstation demo (/workspace) is omitted from the sitemap to ensure search
 * engines index the verified candidate profile data, projects, and skills at root.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl();

  return [
    {
      url: `${siteUrl}/`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
  ];
}

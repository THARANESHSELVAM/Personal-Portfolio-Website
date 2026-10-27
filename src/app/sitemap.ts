import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/siteConfig";

/**
 * Next.js App Router Metadata Route: /sitemap.xml
 * Generates an XML sitemap referencing genuine public application routes.
 * 
 * Architectural Note:
 * This application is a single-page reactive App Router application where
 * Home, Projects, Skills, Diary, and ATS Resume are managed via client-side
 * tab state and URL hash fragments (#home, #projects, #skills, #diary, #resume).
 * Only genuine HTTP GET server endpoints are published to prevent 404 crawl errors.
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

/**
 * Centralized Site Configuration & URL Normalization Utility
 * Phase 6.8: Centralizes base site URL resolution for Canonical, OpenGraph, Twitter, Robots, and Sitemap.
 */

const FALLBACK_DEV_URL = "http://localhost:3000";
// Vercel deployment fallback when NEXT_PUBLIC_SITE_URL has not yet been bound in environment settings.
const DEFAULT_PREVIEW_URL = "https://personal-portfolio-website-nine-lac.vercel.app";

/**
 * Normalizes any given URL string by ensuring a proper protocol and stripping trailing slashes.
 */
export function normalizeUrl(rawUrl: string): string {
  let trimmed = rawUrl.trim();
  if (!trimmed) return FALLBACK_DEV_URL;

  // Add https:// protocol if missing
  if (!/^https?:\/\//i.test(trimmed)) {
    trimmed = `https://${trimmed}`;
  }

  // Strip trailing slashes
  return trimmed.replace(/\/+$/, "");
}

/**
 * Resolves the primary site URL in priority order:
 * 1. NEXT_PUBLIC_SITE_URL (Explicit user custom domain or deployment URL)
 * 2. VERCEL_PROJECT_PRODUCTION_URL (Vercel production domain environment variable)
 * 3. VERCEL_URL (Vercel deployment URL environment variable)
 * 4. In development: http://localhost:3000
 * 5. Fallback preview URL
 */
export function getSiteUrl(): string {
  const envUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.VERCEL_PROJECT_PRODUCTION_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined);

  if (envUrl) {
    return normalizeUrl(envUrl);
  }

  if (process.env.NODE_ENV === "development") {
    return FALLBACK_DEV_URL;
  }

  return normalizeUrl(DEFAULT_PREVIEW_URL);
}

/**
 * Checks whether an explicit custom production domain was configured via environment variable.
 */
export function isCustomDomainConfigured(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_SITE_URL);
}

/**
 * Resolves an absolute URL for a given relative path.
 */
export function getAbsoluteUrl(path: string = "/"): string {
  const base = getSiteUrl();
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${base}${cleanPath}`;
}

export const SITE_METADATA = {
  authorName: "Tharanesh Selvam",
  siteName: "Tharanesh Selvam — Software Engineering Portfolio",
  titleTemplate: "%s | Tharanesh Selvam",
  defaultTitle: "Tharanesh Selvam | Software Engineer & Technical Portfolio",
  description:
    "Personal portfolio and engineering showcase of Tharanesh Selvam. Features full-stack web applications, GIS & cloud systems, applied data/AI implementations, verified learning milestones, and a dynamic ATS resume.",
  keywords: [
    "Tharanesh Selvam",
    "Software Engineer",
    "Full-Stack Developer",
    "Next.js App Router",
    "React 19",
    "TypeScript",
    "Tailwind CSS",
    "Geospatial Systems",
    "GIS",
    "Applied AI",
    "Engineering Learning Journal",
    "ATS Resume Generator",
    "Technical Portfolio",
  ],
  locale: "en_US",
} as const;

"use client";

import { useEffect } from "react";
import { PublicPortfolio } from "@/components/PublicPortfolio";

/**
 * Recruiter-Ready Public Portfolio Landing Page (Route: /)
 *
 * Provides immediate, unrestricted access to Tharanesh Selvam's engineering profile,
 * strongest projects, technical skills matrix, journey milestones, dynamic ATS résumé,
 * and verified contact links—with zero PIN or login required.
 */
export default function Home() {
  useEffect(() => {
    if (typeof document !== "undefined") {
      document.title = "Tharanesh Selvam | Software Developer | M.Tech CSE";
    }
  }, []);

  return <PublicPortfolio />;
}

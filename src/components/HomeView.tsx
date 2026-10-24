"use client";

import { Hero } from "@/components/Hero";
import { ResumeContactSettings } from "@/components/ResumeContactSettings";

/**
 * Isolated Home Tab View
 * Renders ONLY:
 * 1. Hero & Intro Section (Bio, Headline, CTAs, 3D Laptop/Code Card, Metrics, Quote)
 * 2. Resume Contact Header Settings Section (Target Role, Email, Phone, Location, GitHub, LinkedIn)
 * 
 * Strictly hides Technical Skills and About the Developer.
 */
export function HomeView() {
  return (
    <div className="space-y-10 sm:space-y-12 pb-20">
      {/* 1. Hero & Intro Section */}
      <Hero />

      {/* 2. Resume Contact Header Settings Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ResumeContactSettings />
      </div>
    </div>
  );
}

export default HomeView;

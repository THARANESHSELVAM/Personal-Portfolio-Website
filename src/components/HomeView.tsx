"use client";

import { useState, useEffect } from "react";
import { useProfile } from "@/context/ProfileContext";
import { Hero } from "@/components/Hero";
import { ResumeContactSettings } from "@/components/ResumeContactSettings";
import { 
  Globe2, 
  Compass, 
  Cpu, 
  ArrowRight, 
  Sliders, 
  ShieldCheck, 
  CheckCircle2, 
  Layers, 
  Sparkles, 
  ChevronDown, 
  ChevronUp,
  FileText,
  Zap,
  Terminal
} from "lucide-react";

/**
 * Editorial Home Tab View — Portfolio 2.0
 * 
 * 1. Hero & Interactive Engineering Workstation (Bio, Headline, CTAs, 3-Pillar Workstation, Evidence Ribbon)
 * 2. Engineering Pillars & Architecture Showcase (Web Platforms, Geospatial GIS, Applied AI)
 * 3. Architecture Principles & Craft Standards
 * 4. ATS Resume Coordinates Drawer (Clean, collapsible, zero public clutter, preserved functionality)
 */
export function HomeView() {
  const { setActiveTab, state } = useProfile();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Listen for the custom "open-contact-settings" event dispatched from Hero
  useEffect(() => {
    const handleOpenSettings = () => {
      setIsSettingsOpen(true);
      setTimeout(() => {
        document.getElementById("resume-contact-settings")?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    };

    window.addEventListener("open-contact-settings", handleOpenSettings);
    return () => window.removeEventListener("open-contact-settings", handleOpenSettings);
  }, []);

  const handleNavigateToProjects = () => {
    setActiveTab("projects");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNavigateToResume = () => {
    setActiveTab("resume");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="space-y-16 sm:space-y-20 lg:space-y-24 pb-24">
      {/* 1. Hero & Interactive Engineering Workstation */}
      <Hero />

      {/* 2. Engineering Pillars & Applied Disciplines Showcase */}
      <section 
        aria-label="Engineering Pillars"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10"
      >
        {/* Section Header with Apple-Style Confident Typography */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-200/80 dark:border-white/[0.08] pb-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-cyan-50 text-cyan-700 border border-cyan-200 dark:bg-cyan-500/10 dark:text-cyan-400 dark:border-cyan-500/20">
              <Sparkles className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
              <span>APPLIED SPECIALIZATIONS</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Three Pillars of Engineering Craft
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-2xl">
              Where scalable web architectures intersect with domain-specific geospatial engineering and data intelligence.
            </p>
          </div>

          <button
            type="button"
            onClick={handleNavigateToProjects}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 dark:bg-white/[0.04] dark:hover:bg-white/[0.08] dark:text-slate-200 border border-slate-200 dark:border-white/[0.08] transition-all cursor-pointer self-start md:self-auto group"
          >
            <span>Explore All Projects</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* 3 Pillar Cards with Specular Top Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          
          {/* Pillar 1: Web Platforms & Systems */}
          <div 
            onClick={handleNavigateToProjects}
            className="group relative rounded-2xl p-6 sm:p-7 glass-panel hover:border-cyan-500/40 transition-all duration-300 cursor-pointer flex flex-col justify-between space-y-6"
          >
            <div className="space-y-4">
              <div className="w-11 h-11 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-600 dark:text-cyan-400">
                <Globe2 className="w-5 h-5" />
              </div>

              <div className="space-y-1.5">
                <div className="text-[11px] font-mono uppercase tracking-wider text-cyan-600 dark:text-cyan-400 font-semibold">
                  Web Platforms
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-300 transition-colors">
                  Modern Web Platforms
                </h3>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Production-grade Next.js 16 &amp; React 19 platforms engineered with atomic state synchronization, multi-profile isolation, and Turbopack compiler acceleration.
              </p>
            </div>

            <div className="space-y-4 pt-2 border-t border-slate-100 dark:border-white/[0.06]">
              <div className="flex flex-wrap gap-1.5">
                {["Next.js 16", "React 19", "TypeScript", "Tailwind v4"].map((tag) => (
                  <span 
                    key={tag}
                    className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-white/[0.03] text-[10px] font-mono text-slate-600 dark:text-slate-400"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-1.5 text-xs font-semibold text-cyan-600 dark:text-cyan-400 group-hover:translate-x-1 transition-transform">
                <span>View Web Projects</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>

          {/* Pillar 2: Geospatial GIS Systems */}
          <div 
            onClick={handleNavigateToProjects}
            className="group relative rounded-2xl p-6 sm:p-7 glass-panel hover:border-emerald-500/40 transition-all duration-300 cursor-pointer flex flex-col justify-between space-y-6"
          >
            <div className="space-y-4">
              <div className="w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                <Compass className="w-5 h-5" />
              </div>

              <div className="space-y-1.5">
                <div className="text-[11px] font-mono uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-semibold">
                  GIS &amp; Cloud Systems
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-300 transition-colors">
                  Land Stack (GIS Records)
                </h3>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Solving fragmented Indian land record systems through tamper-evident cadastral parcel mapping, PostGIS vector queries, and transparent boundary indexing.
              </p>
            </div>

            <div className="space-y-4 pt-2 border-t border-slate-100 dark:border-white/[0.06]">
              <div className="flex flex-wrap gap-1.5">
                {["PostGIS", "PostgreSQL", "Spatial Polygons", "Node.js"].map((tag) => (
                  <span 
                    key={tag}
                    className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-white/[0.03] text-[10px] font-mono text-slate-600 dark:text-slate-400"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 group-hover:translate-x-1 transition-transform">
                <span>View Land Stack Case Study</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>

          {/* Pillar 3: Applied AI & ML Pipelines */}
          <div 
            onClick={handleNavigateToProjects}
            className="group relative rounded-2xl p-6 sm:p-7 glass-panel hover:border-violet-500/40 transition-all duration-300 cursor-pointer flex flex-col justify-between space-y-6"
          >
            <div className="space-y-4">
              <div className="w-11 h-11 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-600 dark:text-violet-400">
                <Cpu className="w-5 h-5" />
              </div>

              <div className="space-y-1.5">
                <div className="text-[11px] font-mono uppercase tracking-wider text-violet-600 dark:text-violet-400 font-semibold">
                  Applied AI &amp; Data
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-violet-600 dark:group-hover:text-violet-300 transition-colors">
                  Machine Learning Pipelines
                </h3>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                End-to-end classification models with automated feature normalization, Scikit-learn pipelines, and precision-recall trade-off validation.
              </p>
            </div>

            <div className="space-y-4 pt-2 border-t border-slate-100 dark:border-white/[0.06]">
              <div className="flex flex-wrap gap-1.5">
                {["Python", "Scikit-Learn", "Data Pipelines", "Evaluation"].map((tag) => (
                  <span 
                    key={tag}
                    className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-white/[0.03] text-[10px] font-mono text-slate-600 dark:text-slate-400"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-1.5 text-xs font-semibold text-violet-600 dark:text-violet-400 group-hover:translate-x-1 transition-transform">
                <span>View AI &amp; ML Models</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 3. Architecture Principles & Craft Standards */}
      <section 
        aria-label="Engineering Standards"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <div className="rounded-3xl p-8 sm:p-10 glass-panel-elevated relative overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 divide-y md:divide-y-0 md:divide-x divide-slate-200/80 dark:divide-white/[0.08]">
            
            <div className="space-y-2 md:pr-6">
              <div className="flex items-center gap-2 text-cyan-600 dark:text-cyan-400 text-xs font-mono font-semibold uppercase">
                <CheckCircle2 className="w-4 h-4" />
                <span>Type Safety &amp; Determinism</span>
              </div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white">
                Zero-Fallback Crash Immunity
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Strict TypeScript strict-mode enforcement prevents unhandled runtime exceptions. Every component mounts with deterministic hydration.
              </p>
            </div>

            <div className="pt-6 md:pt-0 md:px-6 space-y-2">
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-xs font-mono font-semibold uppercase">
                <ShieldCheck className="w-4 h-4" />
                <span>Multi-Profile Isolation</span>
              </div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white">
                Local-First State Isolation
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Decoupled multi-tenant storage schemas keep candidate identities and live edits sandboxed in isolated browser namespaces.
              </p>
            </div>

            <div className="pt-6 md:pt-0 md:pl-6 space-y-2">
              <div className="flex items-center gap-2 text-violet-600 dark:text-violet-400 text-xs font-mono font-semibold uppercase">
                <Zap className="w-4 h-4" />
                <span>ATS Synchronization</span>
              </div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white">
                One-Click Recruiter Export
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Project accomplishments and verified technical competencies sync dynamically into clean, parser-friendly ATS documents and print-ready PDFs.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 4. ATS Resume Coordinates Settings Drawer (Preserved & Cleaned) */}
      <section 
        id="resume-contact-settings"
        aria-label="ATS Coordinates Settings"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24"
      >
        <div className="rounded-2xl border border-slate-200 dark:border-white/[0.08] bg-slate-50/50 dark:bg-white/[0.02] overflow-hidden transition-all">
          {/* Collapsible Trigger Bar */}
          <button
            type="button"
            onClick={() => setIsSettingsOpen(!isSettingsOpen)}
            className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-slate-100/60 dark:hover:bg-white/[0.04] transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
                <Sliders className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <span>ATS Resume Contact Header Coordinates</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-200 dark:bg-white/[0.08] text-slate-700 dark:text-slate-300">
                    Administrative Drawer
                  </span>
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  {isSettingsOpen 
                    ? "Click to collapse administrative settings form" 
                    : "Click to expand & edit verified contact coordinates, target role, phone, and social links"
                  }
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs font-medium text-cyan-600 dark:text-cyan-400">
              <span>{isSettingsOpen ? "Hide Settings" : "Configure Coordinates"}</span>
              {isSettingsOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </div>
          </button>

          {/* Form Container (Rendered when open) */}
          {isSettingsOpen && (
            <div className="p-6 sm:p-8 border-t border-slate-200 dark:border-white/[0.08] bg-white dark:bg-[#07090e]">
              <ResumeContactSettings />
            </div>
          )}
        </div>
      </section>

    </div>
  );
}

export default HomeView;

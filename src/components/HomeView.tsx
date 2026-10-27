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
  ChevronDown, 
  ChevronUp,
  Zap
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
    <div id="home" className="space-y-16 sm:space-y-20 lg:space-y-24 pb-24">
      {/* 1. Hero & Interactive Engineering Workstation */}
      <Hero />

      {/* 2. Engineering Pillars & Applied Disciplines Showcase */}
      <section 
        aria-label="Engineering Pillars"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10"
      >
        {/* Section Header with Apple-Style Confident Typography */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-200/80 dark:border-white/[0.08] pb-6">
          <div className="space-y-2 text-left">
            <div className="text-xs font-semibold text-cyan-600 dark:text-cyan-400 tracking-wide">
              Applied Disciplines
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
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 dark:bg-white/[0.04] dark:hover:bg-white/[0.08] dark:text-slate-200 border border-slate-200 dark:border-white/[0.08] transition-all cursor-pointer self-start md:self-auto group focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-500"
          >
            <span>Explore All Projects</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
          </button>
        </div>
        {/* 3 Distinct Pillar Cards: Architecturally Differentiated */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 text-left">
          
          {/* Pillar 1: Web Platforms & Systems */}
          <div 
            onClick={handleNavigateToProjects}
            className="group relative rounded-2xl p-5 sm:p-7 glass-panel hover:border-cyan-500/40 transition-all duration-300 cursor-pointer flex flex-col justify-between space-y-6"
          >
            <div className="space-y-4">
              <div className="w-11 h-11 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-600 dark:text-cyan-400">
                <Globe2 className="w-5 h-5" aria-hidden="true" />
              </div>

              <div className="space-y-1">
                <div className="text-xs font-mono text-cyan-600 dark:text-cyan-400 font-medium">
                  Web Platforms
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-300 transition-colors">
                  Modern Web Platforms
                </h3>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Production-grade Next.js 16 &amp; React 19 platforms engineered with atomic state synchronization, multi-profile isolation, and Turbopack compiler acceleration.
              </p>

              {/* Distinctive Visual Feature: Topology Preview */}
              <div className="p-3 rounded-xl bg-slate-100/70 dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/[0.06] font-mono text-[11px] space-y-1">
                <div className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">
                  Architecture Topology
                </div>
                <div className="flex flex-wrap items-center gap-1.5 text-slate-700 dark:text-slate-300">
                  <span className="text-cyan-600 dark:text-cyan-400">App Router</span>
                  <span>→</span>
                  <span>Atomic Store</span>
                  <span>→</span>
                  <span className="text-sky-600 dark:text-sky-400">Hydrated Views</span>
                </div>
              </div>
            </div>

            <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-white/[0.06]">
              <div className="text-xs text-slate-500 dark:text-slate-400">
                <span>Next.js 16</span>
                <span className="mx-1.5 text-slate-300 dark:text-slate-700">•</span>
                <span>React 19</span>
                <span className="mx-1.5 text-slate-300 dark:text-slate-700">•</span>
                <span>TypeScript</span>
                <span className="mx-1.5 text-slate-300 dark:text-slate-700">•</span>
                <span>Tailwind v4</span>
              </div>

              <div className="flex items-center gap-1.5 text-xs font-semibold text-cyan-600 dark:text-cyan-400 group-hover:translate-x-1 transition-transform min-h-[44px]">
                <span>View Web Projects</span>
                <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
              </div>
            </div>
          </div>

          {/* Pillar 2: Geospatial GIS Systems */}
          <div 
            onClick={handleNavigateToProjects}
            className="group relative rounded-2xl p-5 sm:p-7 glass-panel hover:border-emerald-500/40 transition-all duration-300 cursor-pointer flex flex-col justify-between space-y-6"
          >
            <div className="space-y-4">
              <div className="w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                <Compass className="w-5 h-5" aria-hidden="true" />
              </div>

              <div className="space-y-1">
                <div className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-medium">
                  GIS &amp; Cloud Systems
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-300 transition-colors">
                  Land Stack (GIS Records)
                </h3>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Solving fragmented Indian land record systems through tamper-evident cadastral parcel mapping, PostGIS vector queries, and transparent boundary indexing.
              </p>

              {/* Distinctive Visual Feature: Spatial Query Metadata */}
              <div className="p-3 rounded-xl bg-slate-100/70 dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/[0.06] font-mono text-[11px] space-y-1">
                <div className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">
                  Spatial Index &amp; Coordinates
                </div>
                <div className="flex flex-wrap items-center justify-between gap-1 text-slate-700 dark:text-slate-300">
                  <span>EPSG:4326 PostGIS</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Boundary Index</span>
                </div>
              </div>
            </div>

            <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-white/[0.06]">
              <div className="text-xs text-slate-500 dark:text-slate-400">
                <span>PostGIS</span>
                <span className="mx-1.5 text-slate-300 dark:text-slate-700">•</span>
                <span>PostgreSQL</span>
                <span className="mx-1.5 text-slate-300 dark:text-slate-700">•</span>
                <span>Spatial Polygons</span>
                <span className="mx-1.5 text-slate-300 dark:text-slate-700">•</span>
                <span>Node.js</span>
              </div>

              <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 group-hover:translate-x-1 transition-transform min-h-[44px]">
                <span>View Land Stack Case Study</span>
                <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
              </div>
            </div>
          </div>

          {/* Pillar 3: Applied AI & ML Pipelines */}
          <div 
            onClick={handleNavigateToProjects}
            className="group relative rounded-2xl p-5 sm:p-7 glass-panel hover:border-violet-500/40 transition-all duration-300 cursor-pointer flex flex-col justify-between space-y-6 md:col-span-2 lg:col-span-1"
          >
            <div className="space-y-4">
              <div className="w-11 h-11 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-600 dark:text-violet-400">
                <Cpu className="w-5 h-5" aria-hidden="true" />
              </div>

              <div className="space-y-1">
                <div className="text-xs font-mono text-violet-600 dark:text-violet-400 font-medium">
                  Applied AI &amp; Data
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-violet-600 dark:group-hover:text-violet-300 transition-colors">
                  Machine Learning Pipelines
                </h3>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                End-to-end classification models with automated feature normalization, Scikit-learn pipelines, and precision-recall trade-off validation.
              </p>

              {/* Distinctive Visual Feature: Evaluation Pipeline */}
              <div className="p-3 rounded-xl bg-slate-100/70 dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/[0.06] font-mono text-[11px] space-y-1">
                <div className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">
                  Evaluation Protocol
                </div>
                <div className="flex flex-wrap items-center gap-1.5 text-slate-700 dark:text-slate-300">
                  <span>Preprocess</span>
                  <span>→</span>
                  <span className="text-violet-600 dark:text-violet-400">Pipeline</span>
                  <span>→</span>
                  <span>F1 / Latency</span>
                </div>
              </div>
            </div>

            <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-white/[0.06]">
              <div className="text-xs text-slate-500 dark:text-slate-400">
                <span>Python</span>
                <span className="mx-1.5 text-slate-300 dark:text-slate-700">•</span>
                <span>Scikit-Learn</span>
                <span className="mx-1.5 text-slate-300 dark:text-slate-700">•</span>
                <span>Data Pipelines</span>
                <span className="mx-1.5 text-slate-300 dark:text-slate-700">•</span>
                <span>Evaluation</span>
              </div>

              <div className="flex items-center gap-1.5 text-xs font-semibold text-violet-600 dark:text-violet-400 group-hover:translate-x-1 transition-transform min-h-[44px]">
                <span>View AI &amp; ML Models</span>
                <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
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
        <div className="rounded-3xl p-5 sm:p-8 lg:p-10 glass-panel-elevated relative overflow-hidden text-left">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 divide-y md:divide-y-0 md:divide-x divide-slate-200/80 dark:divide-white/[0.08]">
            
            <div className="space-y-2 md:pr-6">
              <div className="flex items-center gap-2 text-cyan-600 dark:text-cyan-400 text-xs font-medium">
                <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
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
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-xs font-medium">
                <ShieldCheck className="w-4 h-4" aria-hidden="true" />
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
              <div className="flex items-center gap-2 text-violet-600 dark:text-violet-400 text-xs font-medium">
                <Zap className="w-4 h-4" aria-hidden="true" />
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
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24 text-left"
      >
        <div className="rounded-2xl border border-slate-200 dark:border-white/[0.08] bg-slate-50/50 dark:bg-white/[0.02] overflow-hidden transition-all">
          {/* Collapsible Trigger Bar */}
          <button
            type="button"
            onClick={() => setIsSettingsOpen(!isSettingsOpen)}
            className="w-full px-4 sm:px-6 py-3.5 sm:py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-left hover:bg-slate-100/60 dark:hover:bg-white/[0.04] transition-colors cursor-pointer min-h-[44px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-500"
            aria-expanded={isSettingsOpen}
            aria-controls="ats-contact-settings-panel"
          >
            <div className="flex items-start sm:items-center gap-3 min-w-0">
              <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 shrink-0 mt-0.5 sm:mt-0">
                <Sliders className="w-4 h-4" aria-hidden="true" />
              </div>
              <div className="min-w-0">
                <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white flex flex-wrap items-center gap-x-2 gap-y-0.5">
                  <span>ATS Resume Contact Header Coordinates</span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 font-normal">
                    (Administrative Drawer)
                  </span>
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {isSettingsOpen 
                    ? "Click to collapse administrative settings form" 
                    : "Click to expand & edit verified contact coordinates, target role, phone, and social links"
                  }
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs font-medium text-cyan-600 dark:text-cyan-400 shrink-0 self-end sm:self-auto">
              <span>{isSettingsOpen ? "Hide Settings" : "Configure Coordinates"}</span>
              {isSettingsOpen ? <ChevronUp className="w-4 h-4" aria-hidden="true" /> : <ChevronDown className="w-4 h-4" aria-hidden="true" />}
            </div>
          </button>

          {/* Form Container (Rendered when open) */}
          {isSettingsOpen && (
            <div 
              id="ats-contact-settings-panel"
              className="p-3 sm:p-6 lg:p-8 border-t border-slate-200 dark:border-white/[0.08] bg-white dark:bg-[#07090e]"
            >
              <ResumeContactSettings />
            </div>
          )}
        </div>
      </section>

    </div>
  );
}

export default HomeView;

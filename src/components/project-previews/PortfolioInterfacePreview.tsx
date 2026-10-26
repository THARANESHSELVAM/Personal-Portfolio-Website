"use client";

import React from "react";
import { ExternalLink, Sparkles, Layout, Globe, Lock, CheckCircle2 } from "lucide-react";
import { Project } from "@/data/profile";

interface PortfolioInterfacePreviewProps {
  project: Project;
  onOpenCaseStudy: () => void;
}

/**
 * Personal Portfolio Website — Interactive Interface Preview
 * 
 * Renders a refined, self-contained miniature browser-style preview of the portfolio,
 * reflecting its actual navigation, editorial typography, and interactive workstation design system.
 * Clearly labeled as an illustrative UI preview.
 */
export function PortfolioInterfacePreview({ project, onOpenCaseStudy }: PortfolioInterfacePreviewProps) {
  return (
    <div className="flex flex-col justify-between rounded-2xl bg-slate-50/80 dark:bg-[#070a13] text-slate-900 dark:text-slate-100 p-4 sm:p-5 border border-slate-200/80 dark:border-white/10 shadow-sm dark:shadow-xl relative overflow-hidden transition-all duration-300">
      <div>
        {/* Browser Chrome Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200/70 dark:border-white/10 mb-3.5">
          {/* macOS Style Traffic Dots */}
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
          </div>

          {/* Browser Address Bar */}
          <div className="flex-1 max-w-[200px] sm:max-w-[240px] mx-2 px-2.5 py-1 rounded-md bg-white dark:bg-white/[0.04] border border-slate-200/80 dark:border-white/10 flex items-center justify-center gap-1.5 text-[11px] font-mono text-slate-500 dark:text-slate-400 truncate shadow-xs">
            <Lock className="w-3 h-3 text-cyan-600 dark:text-cyan-400 shrink-0" aria-hidden="true" />
            <span className="truncate">tharanesh.dev/portfolio</span>
          </div>

          {/* Illustrative Label */}
          <span className="text-[10px] font-mono font-medium text-cyan-600 dark:text-cyan-400 px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 shrink-0">
            UI Preview
          </span>
        </div>

        {/* Scaled Mini-Interface Representation */}
        <div className="rounded-xl bg-white dark:bg-[#0b101d] p-3.5 sm:p-4 border border-slate-200/70 dark:border-white/10 space-y-3 shadow-inner">
          {/* Mini-Navigation Strip */}
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-white/5 text-[10px]">
            <div className="flex items-center gap-1.5">
              <div className="w-5 h-5 rounded-md bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 font-bold flex items-center justify-center text-[9px]">
                TS
              </div>
              <span className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[10px]">
                Portfolio 2.0
              </span>
            </div>

            <div className="flex items-center gap-1 text-[9px] font-mono text-slate-500 dark:text-slate-400">
              <span className="px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-600 dark:text-cyan-300 font-semibold">Home</span>
              <span className="hidden xs:inline px-1.5 py-0.5">Projects</span>
              <span className="hidden xs:inline px-1.5 py-0.5">Resume</span>
            </div>
          </div>

          {/* Mini-Hero Typography Block */}
          <div className="space-y-1.5 pt-1">
            <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-mono text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Open to Opportunities</span>
            </div>

            <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white tracking-tight leading-snug">
              I turn complex problems into thoughtful digital experiences.
            </h4>
            
            <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2">
              Next.js 16 App Router &amp; React 19 architecture featuring atomic local-first persistence and Turbopack acceleration.
            </p>
          </div>

          {/* Mini Interactive Workstation Element */}
          <div className="rounded-lg bg-slate-50 dark:bg-black/30 p-2.5 border border-slate-200/60 dark:border-white/5 space-y-2">
            <div className="flex items-center justify-between text-[9px] font-mono">
              <span className="text-cyan-600 dark:text-cyan-400 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
                Workstation Simulator
              </span>
              <span className="text-slate-400">Web Engine Active</span>
            </div>

            <div className="grid grid-cols-3 gap-1 text-center font-mono text-[9px]">
              <div className="p-1 rounded bg-white dark:bg-white/[0.04] border border-slate-200/50 dark:border-white/5">
                <div className="text-[8px] text-slate-400">React 19</div>
                <div className="font-bold text-slate-800 dark:text-slate-200">SSR</div>
              </div>
              <div className="p-1 rounded bg-white dark:bg-white/[0.04] border border-slate-200/50 dark:border-white/5">
                <div className="text-[8px] text-slate-400">Turbopack</div>
                <div className="font-bold text-cyan-600 dark:text-cyan-400">Fast HMR</div>
              </div>
              <div className="p-1 rounded bg-white dark:bg-white/[0.04] border border-slate-200/50 dark:border-white/5">
                <div className="text-[8px] text-slate-400">TypeScript</div>
                <div className="font-bold text-emerald-600 dark:text-emerald-400">Strict</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Disclosures & Case Study Trigger */}
      <div className="mt-4 pt-3 border-t border-slate-200/70 dark:border-white/10 space-y-2">
        <p className="text-[10px] text-slate-500 dark:text-slate-400 font-mono leading-relaxed">
          * Scaled illustrative interface preview representing the actual Next.js 16 App Router design system.
        </p>

        <button
          type="button"
          onClick={onOpenCaseStudy}
          className="w-full flex items-center justify-between text-xs font-mono font-medium text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 transition-colors cursor-pointer py-1 focus-visible:outline-2 focus-visible:outline-cyan-500"
        >
          <span>Inspect Architecture &amp; State Specifications</span>
          <span className="text-cyan-500">→</span>
        </button>
      </div>
    </div>
  );
}

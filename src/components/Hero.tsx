"use client";

import { useState } from "react";
import { 
  ArrowRight, 
  FileText, 
  Mail, 
  Check, 
  GraduationCap, 
  Terminal,
  ChevronRight,
  Code2
} from "lucide-react";
import { LinkedinIcon, GithubIcon } from "@/components/Icons";
import { useProfile } from "@/context/ProfileContext";

export function Hero() {
  const { state, setActiveTab, extractedSkills } = useProfile();
  const [copied, setCopied] = useState(false);

  const isBlank = Boolean(state.isBlankSlate);
  const totalSkillsCount = Object.values(extractedSkills || {}).flat().length;
  const projectCountDisplay = isBlank 
    ? `${state.projects.length}` 
    : (state.projects.length > 0 ? `${state.projects.length}+` : "5+");
  const skillsCountDisplay = isBlank 
    ? `${totalSkillsCount}` 
    : (totalSkillsCount > 0 ? `${totalSkillsCount}+` : "20+");
  const activeDomainsCount = Object.values(extractedSkills || {}).filter((list) => list.length > 0).length || (isBlank ? 0 : 2);

  const copyEmail = () => {
    if (state.contact?.email) {
      navigator.clipboard.writeText(state.contact.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleNavigateToProjects = () => {
    setActiveTab("projects");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNavigateToResume = () => {
    setActiveTab("resume");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleJumpToContactSettings = (e: React.MouseEvent) => {
    e.preventDefault();
    setActiveTab("home");
    const el = document.getElementById("resume-contact-settings");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      setTimeout(() => {
        document.getElementById("resume-contact-settings")?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 80);
    }
  };

  return (
    <section 
      id="hero" 
      aria-label="Engineering Profile Overview"
      className="relative pt-6 pb-12 sm:pt-10 sm:pb-16 lg:pt-14 lg:pb-20 overflow-hidden"
    >
      {/* Ambient Radial Spotlight: Soft, non-neon top specular glow */}
      <div 
        aria-hidden="true" 
        className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-[380px] pointer-events-none -z-10 overflow-hidden opacity-40 dark:opacity-90"
      >
        <div className="w-full h-full bg-[radial-gradient(ellipse_at_top,rgba(0,210,240,0.06),transparent_65%)]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 lg:space-y-16">
        
        {/* ================= MAIN EDITORIAL STAGE (Dual Wing) ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* ================= LEFT WING: Editorial Typography & Actions (7 Cols) ================= */}
          <div className="lg:col-span-7 space-y-6 text-left">
            
            {/* Status & Credential Beacon (Quiet, restrained, non-cluttered) */}
            <div className="flex flex-wrap items-center gap-3 text-xs">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-200/50 dark:bg-white/[0.04] border border-slate-300/60 dark:border-white/[0.08] text-slate-800 dark:text-slate-200 text-xs font-medium backdrop-blur-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <span>{state.availability?.badgeText || "Open to Opportunities"}</span>
              </div>

              <span className="text-slate-300 dark:text-slate-700 hidden sm:inline">•</span>

              <div className="inline-flex items-center gap-1.5 text-slate-500 dark:text-slate-400 font-mono text-[11px] tracking-wide uppercase">
                <GraduationCap className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400 shrink-0" />
                <span>
                  {state.tagline || (state.resume?.education?.[0]?.degree || (isBlank ? "Engineering Portfolio" : "M.Tech CSE Student"))}
                </span>
              </div>
            </div>

            {/* Dominant Headline & Clear Identity */}
            <div className="space-y-3">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.08] text-balance">
                Architecting resilient web systems &amp; cloud engineering.
              </h1>
              
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-lg sm:text-xl font-medium text-slate-700 dark:text-slate-300 tracking-tight">
                <span className="font-semibold text-slate-900 dark:text-white">{state.name || "Tharanesh Selvam"}</span>
                <span className="text-slate-400 dark:text-slate-600 hidden sm:inline">—</span>
                <span className="text-cyan-700 dark:text-cyan-400 font-mono text-sm sm:text-base">
                  {state.title || "Full-Stack Software Engineer & Cloud Architect"}
                </span>
              </div>
            </div>

            {/* Editorial Value Proposition */}
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl font-normal text-pretty">
              {state.elevatorPitch || 
                "Focused on distributed systems, type-safe Next.js & React architectures, and end-to-end cloud infrastructure. Driven by clean code, high performance, and continuous technical growth."
              }
            </p>

            {/* Priority Actions: Clear Visual Distinction */}
            <div className="flex flex-wrap items-center gap-4 pt-1">
              {/* Primary Action */}
              <button
                type="button"
                onClick={handleNavigateToProjects}
                className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-slate-950 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-950 font-semibold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all duration-200 active:scale-[0.98] group cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-500"
              >
                <span>Explore Projects</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              {/* Secondary Action */}
              <button
                type="button"
                onClick={handleNavigateToResume}
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-white hover:bg-slate-50 dark:bg-white/[0.04] dark:hover:bg-white/[0.08] text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-white/[0.1] font-medium text-xs sm:text-sm shadow-sm transition-all duration-200 active:scale-[0.98] cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-500"
              >
                <FileText className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                <span>View ATS Resume</span>
              </button>
            </div>

            {/* Contact Coordinates & Direct Links (Inline, elegant, uncluttered) */}
            <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
              <button
                type="button"
                onClick={copyEmail}
                className="inline-flex items-center gap-1.5 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer group"
                title="Copy verified email to clipboard"
                aria-label="Copy email address"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Copied!</span>
                  </>
                ) : (
                  <>
                    <Mail className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400 group-hover:scale-110 transition-transform" />
                    <span className="font-mono text-[11px]">{state.contact?.email || "tharanesh.selvam@gmail.com"}</span>
                  </>
                )}
              </button>

              <span className="text-slate-300 dark:text-slate-700 hidden sm:inline">•</span>

              <a
                href={state.contact?.github || "https://github.com/THARANESHSELVAM"}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 hover:text-slate-900 dark:hover:text-white transition-colors"
                aria-label="GitHub Profile"
              >
                <GithubIcon className="w-3.5 h-3.5 text-slate-700 dark:text-slate-300" />
                <span>GitHub ↗</span>
              </a>

              <span className="text-slate-300 dark:text-slate-700 hidden sm:inline">•</span>

              <a
                href={state.contact?.linkedin || "https://linkedin.com/in/tharanesh-selvam"}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 hover:text-slate-900 dark:hover:text-white transition-colors"
                aria-label="LinkedIn Profile"
              >
                <LinkedinIcon className="w-3.5 h-3.5 text-slate-700 dark:text-slate-300" />
                <span>LinkedIn ↗</span>
              </a>

              <span className="text-slate-300 dark:text-slate-700 hidden sm:inline">•</span>

              <button
                type="button"
                onClick={handleJumpToContactSettings}
                className="text-slate-500 hover:text-cyan-600 dark:text-slate-400 dark:hover:text-cyan-300 font-mono text-[11px] inline-flex items-center gap-1 transition-colors cursor-pointer"
              >
                <span>Edit Coordinates ↓</span>
              </button>
            </div>

            {/* Core Stack Strip */}
            <div className="pt-2 flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 dark:text-slate-500 mr-1">
                Core Stack:
              </span>
              {["Next.js 16", "React 19", "TypeScript", "Node.js", "Cloud Architecture"].map((tech) => (
                <span
                  key={tech}
                  className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-white/[0.03] border border-slate-200/70 dark:border-white/[0.06] text-[11px] font-mono text-slate-700 dark:text-slate-300"
                >
                  {tech}
                </span>
              ))}
            </div>

          </div>

          {/* ================= RIGHT WING: Developer Studio Window (5 Cols) ================= */}
          <div className="lg:col-span-5">
            
            {/* macOS Developer Studio Window */}
            <div className="relative rounded-2xl p-1 bg-gradient-to-b from-slate-200 via-slate-100 to-slate-200 dark:from-white/[0.12] dark:via-white/[0.04] dark:to-white/[0.02] shadow-2xl">
              <div className="rounded-[14px] bg-slate-950 dark:bg-[#07090e] border border-slate-800 dark:border-white/[0.08] overflow-hidden text-left font-mono">
                
                {/* Titlebar with Traffic Lights & Active File */}
                <div className="px-4 py-3 bg-slate-900/90 dark:bg-[#05070a] border-b border-slate-800 dark:border-white/[0.06] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-[#ff5f56] border border-black/10" />
                    <span className="w-3 h-3 rounded-full bg-[#ffbd2e] border border-black/10" />
                    <span className="w-3 h-3 rounded-full bg-[#27c93f] border border-black/10" />
                  </div>

                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-white/[0.05] border border-white/[0.05] text-[11px] text-slate-300">
                    <Code2 className="w-3.5 h-3.5 text-cyan-400" />
                    <span>profile.config.ts</span>
                  </div>

                  <div className="flex items-center gap-1.5 text-[10px] text-emerald-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>READY</span>
                  </div>
                </div>

                {/* Code Body with Authentic Syntax Colors & Line Numbers */}
                <div className="p-4 sm:p-5 text-[11px] sm:text-xs leading-relaxed text-slate-300 space-y-1 overflow-x-auto">
                  <div className="flex">
                    <span className="w-6 text-slate-600 select-none text-[10px]">01</span>
                    <span>
                      <span className="text-cyan-400">import type</span> &#123; <span className="text-sky-300">Engineer</span> &#125; <span className="text-cyan-400">from</span> <span className="text-emerald-300">&quot;@workspace/core&quot;</span>;
                    </span>
                  </div>
                  <div className="flex">
                    <span className="w-6 text-slate-600 select-none text-[10px]">02</span>
                    <span className="text-slate-600">// Identity configuration</span>
                  </div>
                  <div className="flex">
                    <span className="w-6 text-slate-600 select-none text-[10px]">03</span>
                    <span>
                      <span className="text-cyan-400">export const</span> <span className="text-white font-semibold">developer</span>: <span className="text-sky-300">Engineer</span> = &#123;
                    </span>
                  </div>
                  <div className="flex pl-4">
                    <span className="w-6 text-slate-600 select-none text-[10px]">04</span>
                    <span>
                      <span className="text-slate-400">name:</span> <span className="text-emerald-300">&quot;{state.name || "Tharanesh Selvam"}&quot;</span>,
                    </span>
                  </div>
                  <div className="flex pl-4">
                    <span className="w-6 text-slate-600 select-none text-[10px]">05</span>
                    <span>
                      <span className="text-slate-400">role:</span> <span className="text-teal-300">&quot;{state.title ? (state.title.length > 26 ? state.title.slice(0, 24) + "..." : state.title) : "Full-Stack Engineer"}&quot;</span>,
                    </span>
                  </div>
                  <div className="flex pl-4">
                    <span className="w-6 text-slate-600 select-none text-[10px]">06</span>
                    <span>
                      <span className="text-slate-400">domain:</span> <span className="text-teal-300">&quot;Cloud &amp; Distributed Systems&quot;</span>,
                    </span>
                  </div>
                  <div className="flex pl-4">
                    <span className="w-6 text-slate-600 select-none text-[10px]">07</span>
                    <span>
                      <span className="text-slate-400">coreStack:</span> [<span className="text-sky-300">&quot;Next.js&quot;</span>, <span className="text-sky-300">&quot;React 19&quot;</span>, <span className="text-sky-300">&quot;TypeScript&quot;</span>],
                    </span>
                  </div>
                  <div className="flex pl-4">
                    <span className="w-6 text-slate-600 select-none text-[10px]">08</span>
                    <span>
                      <span className="text-slate-400">status:</span> <span className="text-emerald-400">&quot;Open to Opportunities&quot;</span>,
                    </span>
                  </div>
                  <div className="flex">
                    <span className="w-6 text-slate-600 select-none text-[10px]">09</span>
                    <span>&#125;;</span>
                  </div>
                </div>

                {/* Status Bar */}
                <div className="px-4 py-2 bg-slate-900/70 dark:bg-[#05070a]/90 border-t border-slate-800 dark:border-white/[0.06] flex items-center justify-between text-[10px] text-slate-400">
                  <div className="flex items-center gap-2">
                    <Terminal className="w-3 h-3 text-cyan-400" />
                    <span>git: main</span>
                    <span className="text-slate-600">•</span>
                    <span className="text-slate-300">0 errors</span>
                  </div>
                  <span className="text-slate-500">Next.js 16 • Turbopack</span>
                </div>

              </div>
            </div>

          </div>

        </div>

        {/* ================= EDITORIAL METRICS & CRAFT PHILOSOPHY RIBBON ================= */}
        {/* Replaces the repetitive 4-card SaaS dashboard with an integrated, cohesive metadata ribbon */}
        <div className="p-6 sm:p-8 rounded-2xl glass-panel text-left">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 divide-y sm:divide-y-0 sm:divide-x divide-slate-200/80 dark:divide-white/[0.08]">
            
            {/* Metric 1: Projects */}
            <div className="sm:pr-4 space-y-1">
              <div className="text-xs font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Applied Projects
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {projectCountDisplay}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                End-to-end full-stack &amp; cloud builds
              </div>
            </div>

            {/* Metric 2: Skills */}
            <div className="pt-4 sm:pt-0 sm:px-4 space-y-1">
              <div className="text-xs font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Technical Skills
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {skillsCountDisplay}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                Verified modern technologies &amp; tools
              </div>
            </div>

            {/* Metric 3: Major Domains */}
            <div className="pt-4 sm:pt-0 sm:px-4 space-y-1">
              <div className="text-xs font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Core Domains
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {activeDomainsCount}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                Full-Stack Web &amp; Cloud Systems
              </div>
            </div>

            {/* Metric 4: Continuous Learning as Craft Philosophy */}
            <div className="pt-4 sm:pt-0 sm:pl-4 space-y-1">
              <div className="text-xs font-mono uppercase tracking-wider text-cyan-600 dark:text-cyan-400">
                Engineering Philosophy
              </div>
              <div className="text-sm sm:text-base font-semibold text-slate-900 dark:text-slate-100 italic leading-snug">
                &quot;Continuous learning is the key to growth.&quot;
              </div>
              <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                — {state.name || "Tharanesh Selvam"}
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}

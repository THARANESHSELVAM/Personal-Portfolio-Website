"use client";

import { useState } from "react";
import { 
  ArrowRight, 
  Download, 
  FileText,
  Mail, 
  Check, 
  GraduationCap, 
  FolderKanban, 
  Sparkles, 
  Layers, 
  RefreshCw,
  Quote
} from "lucide-react";
import { LinkedinIcon, GithubIcon } from "@/components/Icons";
import { useProfile } from "@/context/ProfileContext";

export function Hero() {
  const { state, setActiveTab, extractedSkills } = useProfile();
  const [copied, setCopied] = useState(false);

  const isBlank = Boolean(state.isBlankSlate);
  const totalSkillsCount = Object.values(extractedSkills || {}).flat().length;
  const projectCountDisplay = isBlank ? `${state.projects.length}` : (state.projects.length > 0 ? `${state.projects.length}+` : "0");
  const skillsCountDisplay = isBlank ? `${totalSkillsCount}` : (totalSkillsCount > 0 ? `${totalSkillsCount}+` : "20+");
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

  return (
    <section id="hero" className="relative pt-6 pb-12 lg:pt-10 lg:pb-16 overflow-hidden">
      {/* Ambient background glow */}
      <div 
        aria-hidden="true" 
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -z-10 opacity-30 dark:opacity-100" 
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main 3-Column Hero Grid Matching Reference Image */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
          
          {/* ================= LEFT COLUMN: Bio & CTAs (5 Cols) ================= */}
          <div className="lg:col-span-5 space-y-5 text-left">
            {/* Top Badges */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-50 text-cyan-700 border border-cyan-200 dark:bg-cyan-950/70 dark:text-cyan-300 dark:border-cyan-500/30 shadow-sm shadow-cyan-500/10">
                <GraduationCap className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                <span>{state.tagline || (state.resume?.education?.[0]?.degree || (isBlank ? "Engineering Portfolio" : "M.Tech CSE Student"))}</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-teal-950/70 dark:text-teal-300 dark:border-teal-500/30">
                <span className="w-2 h-2 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse" />
                <span>Open to Opportunities</span>
              </span>
            </div>

            {/* Main Title & Subtitle */}
            <div className="space-y-2">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
                Hi, I&apos;m{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 via-cyan-600 to-teal-600 dark:from-teal-400 dark:via-cyan-400 dark:to-teal-300">
                  {state.name || "Portfolio Owner"}
                </span>
              </h1>
              <h2 className="text-base sm:text-lg lg:text-xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">
                {state.title || "Full-Stack Software Engineer & Cloud Architect"}
              </h2>
            </div>

            {/* Supporting Paragraph */}
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-lg font-normal">
              I build scalable web applications, work with modern technologies, and love solving real-world problems through code.
            </p>

            {/* Primary Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                type="button"
                onClick={handleNavigateToProjects}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-400 hover:to-cyan-500 dark:from-teal-400 dark:to-cyan-500 text-white dark:text-slate-950 font-bold text-xs sm:text-sm shadow-lg shadow-cyan-500/25 transition-all duration-200 active:scale-95 group focus-visible:ring-2 focus-visible:ring-cyan-400"
              >
                <span>Explore My Projects</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                type="button"
                onClick={handleNavigateToResume}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white hover:bg-slate-100 border border-slate-300 hover:border-cyan-500 text-slate-800 dark:bg-[#0a1122]/90 dark:hover:bg-slate-800 dark:border-slate-700/80 dark:hover:border-cyan-400/50 dark:text-white font-medium text-xs sm:text-sm shadow-sm transition-all duration-200 active:scale-95 focus-visible:ring-2 focus-visible:ring-cyan-400"
              >
                <FileText className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                <span>View ATS Resume</span>
              </button>
            </div>

            {/* Social Pills & Collaborate Cue */}
            <div className="pt-2 flex flex-wrap items-center justify-between gap-3 text-xs border-t border-slate-200 dark:border-slate-800/80">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={copyEmail}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-slate-700 hover:text-slate-900 hover:border-cyan-400 dark:bg-[#090f1d] dark:border-cyan-900/30 dark:text-slate-300 dark:hover:text-white transition-colors"
                  title="Copy email to clipboard"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" />
                      <span className="text-emerald-700 dark:text-emerald-300 text-[11px] font-semibold">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Mail className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                      <span className="text-[11px]">Email</span>
                    </>
                  )}
                </button>

                <a
                  href={state.contact?.github || "https://github.com/THARANESHSELVAM"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-slate-700 hover:text-slate-900 hover:border-cyan-400 dark:bg-[#090f1d] dark:border-cyan-900/30 dark:text-slate-300 dark:hover:text-white transition-colors"
                >
                  <GithubIcon className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                  <span className="text-[11px]">GitHub</span>
                </a>

                <a
                  href={state.contact?.linkedin || "https://linkedin.com/in/tharanesh-selvam"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-slate-700 hover:text-slate-900 hover:border-cyan-400 dark:bg-[#090f1d] dark:border-cyan-900/30 dark:text-slate-300 dark:hover:text-white transition-colors"
                >
                  <LinkedinIcon className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                  <span className="text-[11px]">LinkedIn</span>
                </a>
              </div>

              <button
                type="button"
                onClick={(e) => {
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
                }}
                className="text-[11px] font-mono text-slate-500 hover:text-cyan-600 dark:text-slate-400 dark:hover:text-cyan-300 transition-colors flex items-center gap-1 group font-medium cursor-pointer"
              >
                <span>Resume Header Settings</span>
                <span className="group-hover:translate-x-0.5 transition-transform text-cyan-600 dark:text-cyan-400">→</span>
              </button>
            </div>
          </div>

          {/* ================= CENTER COLUMN: 3D Laptop with Floating Tech Badges (4 Cols) ================= */}
          <div className="lg:col-span-4 relative flex items-center justify-center py-4 lg:py-0">
            {/* Ambient Cyan Radial Floor Glow */}
            <div className="absolute w-72 h-72 bg-gradient-to-b from-cyan-500/20 via-teal-500/10 to-transparent rounded-full blur-2xl -z-10 pointer-events-none opacity-40 dark:opacity-100" />

            {/* 3D Laptop Composition */}
            <div className="relative w-full max-w-[340px] aspect-[4/3] flex items-center justify-center">
              {/* Laptop Body Wrapper with 3D tilt */}
              <div className="relative w-64 sm:w-72 rounded-2xl p-2.5 bg-gradient-to-b from-slate-200 via-slate-300 to-slate-400 dark:from-slate-700 dark:via-slate-800 dark:to-slate-900 border border-slate-300 dark:border-slate-700/80 shadow-2xl shadow-cyan-500/10 transform -rotate-1 hover:rotate-0 transition-transform duration-500">
                {/* Laptop Screen */}
                <div className="relative w-full aspect-[16/10] rounded-xl bg-slate-950 border border-slate-800 overflow-hidden p-3 flex flex-col justify-between text-white">
                  {/* Top Bar with mock dots */}
                  <div className="flex items-center justify-between border-b border-slate-800/80 pb-1.5">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-rose-500/80" />
                      <span className="w-2 h-2 rounded-full bg-amber-500/80" />
                      <span className="w-2 h-2 rounded-full bg-emerald-500/80" />
                    </div>
                    <span className="text-[9px] font-mono text-cyan-400/80">portfolio.tsx</span>
                  </div>

                  {/* Mock Code / Visuals */}
                  <div className="space-y-1 font-mono text-[9px] text-slate-300 py-1">
                    <div className="text-cyan-400">const developer = &#123;</div>
                    <div className="pl-2 text-slate-400">name: <span className="text-teal-300">&quot;{state.name?.split(" ")[0] || "Developer"}&quot;</span>,</div>
                    <div className="pl-2 text-slate-400">role: <span className="text-cyan-300">&quot;{state.title ? (state.title.length > 18 ? state.title.slice(0, 16) + "..." : state.title) : "Software Engineer"}&quot;</span>,</div>
                    <div className="pl-2 text-slate-400">status: <span className="text-emerald-400">&quot;Available&quot;</span>,</div>
                    <div className="text-cyan-400">&#125;;</div>
                  </div>

                  {/* Pulsing prompt */}
                  <div className="flex items-center justify-between pt-1 border-t border-slate-800/80 text-[8px] font-mono text-slate-400">
                    <span className="flex items-center gap-1 text-teal-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-ping" />
                      <span>READY</span>
                    </span>
                    <span className="text-slate-500">Next.js + React 19</span>
                  </div>
                </div>

                {/* Laptop Keyboard Base / Hinge */}
                <div className="mt-1.5 h-3 bg-gradient-to-r from-slate-400 via-slate-300 to-slate-400 dark:from-slate-800 dark:via-slate-700 dark:to-slate-800 rounded-b-lg border-t border-slate-400 dark:border-slate-600 shadow-md flex items-center justify-center">
                  <div className="w-12 h-1 bg-slate-400 dark:bg-slate-600 rounded-full" />
                </div>
              </div>

              {/* FLOATING TECH BADGES */}
              {/* 1. React (Top-Left) */}
              <div className="absolute -top-1 -left-2 sm:-left-4 px-3 py-1 rounded-xl bg-white/95 dark:bg-[#090f1d]/95 border border-cyan-400/60 dark:border-cyan-500/40 text-cyan-700 dark:text-cyan-300 text-[11px] font-semibold flex items-center gap-1.5 shadow-lg shadow-cyan-500/15 animate-bounce [animation-duration:3.2s]">
                <span className="text-cyan-500">⚛</span>
                <span>React</span>
              </div>

              {/* 2. Next.js (Top-Right) */}
              <div className="absolute top-2 -right-2 sm:-right-4 px-3 py-1 rounded-xl bg-white/95 dark:bg-[#090f1d]/95 border border-slate-300 dark:border-cyan-500/40 text-slate-900 dark:text-white text-[11px] font-semibold flex items-center gap-1.5 shadow-lg shadow-cyan-500/15 animate-bounce [animation-duration:3.6s]">
                <span className="w-2 h-2 rounded-full bg-slate-900 dark:bg-white" />
                <span>Next.js</span>
              </div>

              {/* 3. TypeScript (Bottom-Left) */}
              <div className="absolute -bottom-2 -left-2 sm:-left-3 px-3 py-1 rounded-xl bg-white/95 dark:bg-[#090f1d]/95 border border-cyan-400/60 dark:border-cyan-500/40 text-cyan-800 dark:text-cyan-200 text-[11px] font-mono font-bold flex items-center gap-1.5 shadow-lg shadow-cyan-500/15 animate-bounce [animation-duration:4s]">
                <span className="text-[10px] text-cyan-600 dark:text-cyan-400 bg-cyan-100 dark:bg-cyan-950/80 px-1 rounded">TS</span>
                <span>TypeScript</span>
              </div>

              {/* 4. AWS (Bottom-Right) */}
              <div className="absolute -bottom-1 -right-2 sm:-right-3 px-3 py-1 rounded-xl bg-white/95 dark:bg-[#090f1d]/95 border border-amber-300 dark:border-cyan-500/40 text-amber-700 dark:text-amber-300 text-[11px] font-bold flex items-center gap-1.5 shadow-lg shadow-cyan-500/15 animate-bounce [animation-duration:3.8s]">
                <span className="text-amber-500 dark:text-amber-400 font-mono text-xs">☁</span>
                <span>AWS</span>
              </div>
            </div>
          </div>

          {/* ================= RIGHT COLUMN: 2x2 Stats & Quote Cards (3 Cols) ================= */}
          <div className="lg:col-span-3 space-y-4">
            {/* Top 2x2 Stats Matrix Card */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200 dark:bg-[#090f1d]/90 dark:border-cyan-900/30 backdrop-blur-md shadow-md dark:shadow-xl space-y-4 text-left">
              <div className="grid grid-cols-2 gap-4">
                {/* Stat 1: Projects */}
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5">
                    <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
                      <FolderKanban className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white">{projectCountDisplay}</span>
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Projects</div>
                </div>

                {/* Stat 2: Skills */}
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5">
                    <div className="p-1.5 rounded-lg bg-cyan-50 text-cyan-600 dark:bg-cyan-500/10 dark:text-cyan-400">
                      <Sparkles className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white">{skillsCountDisplay}</span>
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Skills</div>
                </div>

                {/* Stat 3: Major Domains */}
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5">
                    <div className="p-1.5 rounded-lg bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400">
                      <Layers className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white">{activeDomainsCount}</span>
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Major Domains</div>
                </div>

                {/* Stat 4: Learning Mode */}
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5">
                    <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                      <RefreshCw className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white">100%</span>
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Learning Mode</div>
                </div>
              </div>
            </div>

            {/* Bottom Quote Card */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200 dark:bg-[#090f1d]/90 dark:border-cyan-900/30 backdrop-blur-md shadow-md dark:shadow-xl text-left space-y-3 relative overflow-hidden">
              <div className="text-cyan-600 dark:text-cyan-400/40 text-3xl font-serif leading-none select-none">
                “
              </div>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 italic leading-snug">
                &quot;Continuous learning is the key to growth.&quot;
              </p>
              <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400 text-right">
                — {state.name || "Portfolio Owner"}
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

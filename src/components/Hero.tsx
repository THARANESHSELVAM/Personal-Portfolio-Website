"use client";

import { useState } from "react";
import { PROFILE } from "@/data/profile";
import { 
  ArrowRight, 
  FileText, 
  Mail, 
  Check, 
  Copy, 
  MapPin, 
  Terminal, 
  Sparkles,
  ShieldCheck,
  TrendingUp,
  Cpu
} from "lucide-react";
import { LinkedinIcon, TwitterIcon, GithubIcon } from "@/components/Icons";

export function Hero() {
  const [copied, setCopied] = useState(false);

  const copyEmail = () => {
    navigator.clipboard.writeText(PROFILE.contact.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="about" className="relative pt-12 pb-20 md:pt-20 md:pb-28 overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-gradient-to-tr from-cyan-500/15 via-indigo-500/15 to-violet-500/15 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-10 right-10 w-72 h-72 bg-cyan-400/10 rounded-full blur-2xl pointer-events-none -z-10" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto space-y-6">
          {/* Engineering Role Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-panel text-xs sm:text-sm font-mono text-cyan-600 dark:text-cyan-400 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
            <Terminal className="w-3.5 h-3.5" />
            <span>{PROFILE.title}</span>
          </div>

          {/* High-Impact Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.1]">
            Architecting <span className="bg-gradient-to-r from-cyan-500 via-indigo-500 to-violet-500 bg-clip-text text-transparent">Hyperscale Systems</span> & Mission-Critical Web Platforms
          </h1>

          {/* Elevator pitch */}
          <p className="text-base sm:text-xl text-slate-600 dark:text-slate-300 leading-relaxed font-normal max-w-3xl">
            {PROFILE.elevatorPitch}
          </p>

          {/* Location & Availability badge */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-cyan-500" />
              <span>{PROFILE.contact.location}</span>
            </div>
            <span className="hidden sm:inline text-slate-300 dark:text-slate-700">•</span>
            <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>{PROFILE.availability.type}</span>
            </div>
          </div>

          {/* Dual Primary CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 w-full sm:w-auto pt-2">
            <a
              href="#projects"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-600 hover:to-indigo-700 text-white font-semibold text-sm shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all duration-200 group active:scale-95"
            >
              <span>Explore Projects</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>

            <a
              href="#resume"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl glass-panel text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800/80 font-semibold text-sm border border-slate-300/70 dark:border-slate-700 shadow-sm transition-all duration-200 active:scale-95"
            >
              <FileText className="w-4 h-4 text-cyan-500" />
              <span>View ATS Resume</span>
            </a>

            <button
              type="button"
              onClick={copyEmail}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl glass-panel text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white font-medium text-xs border border-slate-300/70 dark:border-slate-700 shadow-sm transition-all duration-200"
              title="Copy email to clipboard"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-500" />
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Email Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Email</span>
                </>
              )}
            </button>
          </div>

          {/* Social Profiles Direct Links */}
          <div className="flex items-center gap-3 pt-3">
            <a
              href={PROFILE.contact.github}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-xl glass-panel text-slate-600 dark:text-slate-300 hover:text-cyan-500 dark:hover:text-cyan-400 hover:scale-110 border border-slate-200 dark:border-slate-800 transition-all duration-200"
              aria-label="GitHub Profile"
            >
              <GithubIcon className="w-4 h-4" />
            </a>
            <a
              href={PROFILE.contact.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-xl glass-panel text-slate-600 dark:text-slate-300 hover:text-cyan-500 dark:hover:text-cyan-400 hover:scale-110 border border-slate-200 dark:border-slate-800 transition-all duration-200"
              aria-label="LinkedIn Profile"
            >
              <LinkedinIcon className="w-4 h-4" />
            </a>
            <a
              href={PROFILE.contact.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-xl glass-panel text-slate-600 dark:text-slate-300 hover:text-cyan-500 dark:hover:text-cyan-400 hover:scale-110 border border-slate-200 dark:border-slate-800 transition-all duration-200"
              aria-label="Twitter Profile"
            >
              <TwitterIcon className="w-4 h-4" />
            </a>
            <a
              href={`mailto:${PROFILE.contact.email}`}
              className="p-2.5 rounded-xl glass-panel text-slate-600 dark:text-slate-300 hover:text-cyan-500 dark:hover:text-cyan-400 hover:scale-110 border border-slate-200 dark:border-slate-800 transition-all duration-200"
              aria-label="Email Directly"
            >
              <Mail className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Quantifiable Stats Ribbon */}
        <div className="mt-14 grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {PROFILE.stats.map((stat, idx) => (
            <div
              key={idx}
              className="glass-panel p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 hover:border-cyan-500/40 dark:hover:border-cyan-500/40 transition-all duration-300 group hover:-translate-y-1"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs uppercase tracking-wider font-mono text-slate-500 dark:text-slate-400">
                  {stat.label}
                </span>
                {idx === 0 && <TrendingUp className="w-4 h-4 text-cyan-500 opacity-80" />}
                {idx === 1 && <ShieldCheck className="w-4 h-4 text-emerald-500 opacity-80" />}
                {idx === 2 && <Sparkles className="w-4 h-4 text-indigo-500 opacity-80" />}
                {idx === 3 && <Cpu className="w-4 h-4 text-violet-500 opacity-80" />}
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                {stat.value}
              </div>
              <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
                {stat.detail}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

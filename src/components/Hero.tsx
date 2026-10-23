"use client";

import { useState } from "react";
import { 
  ArrowRight, 
  FileText, 
  Mail, 
  Check, 
  Copy, 
  MapPin, 
  Terminal, 
  Sparkles,
  Briefcase,
  ExternalLink
} from "lucide-react";
import { LinkedinIcon, GithubIcon } from "@/components/Icons";
import { useProfile } from "@/context/ProfileContext";

export function Hero() {
  const { state, setActiveTab } = useProfile();
  const [copied, setCopied] = useState(false);

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
    <section id="hero" className="relative pt-10 pb-16 md:pt-16 md:pb-24 overflow-hidden">
      {/* Subtle ambient glow in charcoal and restrained lime */}
      <div 
        aria-hidden="true" 
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[350px] bg-lime-500/5 rounded-full blur-3xl pointer-events-none -z-10" 
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center space-y-6">
          
          {/* Engineering Role Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-panel text-xs sm:text-sm font-mono text-lime-400 border border-lime-500/20 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-lime-400 animate-pulse" />
            <Terminal className="w-3.5 h-3.5 text-lime-400" />
            <span>{state.title || "Aspiring Full-Stack Software Engineer"}</span>
          </div>

          {/* High-Impact Headline with Crisp White Typography */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.15] max-w-4xl">
            Crafting <span className="text-lime-400 underline decoration-lime-500/40 decoration-2 underline-offset-8">modern, accessible web applications</span> & reliable software systems
          </h1>

          {/* Elevator Pitch / Supporting Text */}
          <p className="text-sm sm:text-lg text-slate-300 leading-relaxed font-normal max-w-2xl">
            {state.elevatorPitch || 
              "Computer Science student and full-stack software engineer passionate about clean component design, Next.js, React, TypeScript, and modern web architectures. Seeking student internship and entry-level software development roles."
            }
          </p>

          {/* Location & Availability Badge */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs sm:text-sm text-slate-400">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-lime-400 shrink-0" />
              <span>{state.contact?.location || "India / Remote"}</span>
            </div>
            <span className="hidden sm:inline text-slate-700">•</span>
            <div className="flex items-center gap-1.5 text-lime-400 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-lime-400" />
              <span>{state.availability?.badgeText || state.availability?.type || "Open to Internships"}</span>
            </div>
          </div>

          {/* Primary Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full sm:w-auto pt-2">
            <button
              type="button"
              onClick={handleNavigateToProjects}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-lime-400 hover:bg-lime-300 text-slate-950 font-bold text-sm shadow-lg shadow-lime-500/20 transition-all duration-200 group active:scale-95 focus-visible:ring-2 focus-visible:ring-lime-400"
            >
              <span>Explore Projects</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              type="button"
              onClick={handleNavigateToResume}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl glass-panel text-white hover:text-lime-300 hover:border-lime-500/40 font-semibold text-sm border border-slate-800 shadow-sm transition-all duration-200 active:scale-95 focus-visible:ring-2 focus-visible:ring-lime-400"
            >
              <FileText className="w-4 h-4 text-lime-400" />
              <span>View ATS Resume</span>
            </button>

            <button
              type="button"
              onClick={copyEmail}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl glass-panel text-slate-300 hover:text-white font-medium text-xs border border-slate-800 shadow-sm transition-all duration-200 focus-visible:ring-2 focus-visible:ring-lime-400"
              title="Copy email to clipboard"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-lime-400" />
                  <span className="text-lime-400 font-semibold">Email Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Email</span>
                </>
              )}
            </button>
          </div>

          {/* Direct Professional Social Links */}
          <div className="flex items-center gap-3 pt-2">
            {state.contact?.github && (
              <a
                href={state.contact.github}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl glass-panel text-slate-300 hover:text-lime-400 hover:border-lime-500/40 border border-slate-800 transition-all duration-200 focus-visible:ring-2 focus-visible:ring-lime-400"
                aria-label="GitHub Profile"
                title="GitHub Profile"
              >
                <GithubIcon className="w-4 h-4" />
              </a>
            )}
            {state.contact?.linkedin && (
              <a
                href={state.contact.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl glass-panel text-slate-300 hover:text-lime-400 hover:border-lime-500/40 border border-slate-800 transition-all duration-200 focus-visible:ring-2 focus-visible:ring-lime-400"
                aria-label="LinkedIn Profile"
                title="LinkedIn Profile"
              >
                <LinkedinIcon className="w-4 h-4" />
              </a>
            )}
            {state.contact?.email && (
              <a
                href={`mailto:${state.contact.email}`}
                className="p-2.5 rounded-xl glass-panel text-slate-300 hover:text-lime-400 hover:border-lime-500/40 border border-slate-800 transition-all duration-200 focus-visible:ring-2 focus-visible:ring-lime-400"
                aria-label="Send Email Directly"
                title="Send Email Directly"
              >
                <Mail className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>

        {/* Quantifiable Stats Ribbon in Dark Charcoal & Restrained Lime */}
        {state.stats && state.stats.length > 0 && (
          <div className="mt-12 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {state.stats.map((stat, idx) => (
              <div
                key={idx}
                className="glass-panel p-4 rounded-2xl border border-slate-800/80 hover:border-lime-500/30 transition-all duration-300 group text-left"
              >
                <span className="text-[11px] uppercase tracking-wider font-mono text-slate-400 block mb-1">
                  {stat.label}
                </span>
                <div className="text-xl sm:text-2xl font-extrabold text-white tracking-tight group-hover:text-lime-400 transition-colors">
                  {stat.value}
                </div>
                <p className="mt-1 text-xs text-slate-400 line-clamp-1">
                  {stat.detail}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

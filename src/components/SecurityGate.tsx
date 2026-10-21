"use client";

import { useState } from "react";
import { useProfile } from "@/context/ProfileContext";
import { 
  ShieldCheck, 
  Terminal, 
  Sparkles, 
  User, 
  Mail, 
  Briefcase, 
  MapPin, 
  ArrowRight, 
  Lock, 
  CheckCircle2,
  FileText,
  BookOpen,
  Cpu
} from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/Icons";

export function SecurityGate() {
  const { loginUser } = useProfile();

  const [formData, setFormData] = useState({
    userIdOrEmail: "tharanesh-selvam",
    name: "Tharanesh Selvam",
    title: "Full-Stack Software Engineer & Cloud Architect",
    location: "Remote / Hybrid",
    phone: "",
    github: "https://github.com/THARANESHSELVAM",
    linkedin: "https://linkedin.com/in/tharanesh-selvam",
    starterOption: "curated" as "curated" | "blank",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleQuickDemoLogin = () => {
    loginUser(
      {
        userId: "tharanesh-selvam",
        name: "Tharanesh Selvam",
        email: "tharanesh.selvam@gmail.com",
        title: "Full-Stack Software Engineer & Cloud Architect",
        location: "Remote / Hybrid",
        github: "https://github.com/THARANESHSELVAM",
        linkedin: "https://linkedin.com/in/tharanesh-selvam",
      },
      { loadStarterData: true }
    );
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};

    if (!formData.userIdOrEmail.trim()) {
      errs.userIdOrEmail = "User ID or Email is required for storage isolation.";
    }
    if (!formData.name.trim()) {
      errs.name = "Full Name is required.";
    }
    if (!formData.title.trim()) {
      errs.title = "Professional Title / Target Role is required.";
    }

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    loginUser(
      {
        userId: formData.userIdOrEmail.trim(),
        name: formData.name.trim(),
        email: formData.userIdOrEmail.includes("@") ? formData.userIdOrEmail.trim() : `${formData.userIdOrEmail.trim()}@gmail.com`,
        title: formData.title.trim(),
        location: formData.location.trim() || "Remote",
        phone: formData.phone.trim(),
        github: formData.github.trim(),
        linkedin: formData.linkedin.trim(),
      },
      { loadStarterData: formData.starterOption === "curated" }
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 md:p-10 relative overflow-hidden bg-slate-50 dark:bg-[#090d16]">
      {/* Background radial ambient lights */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-cyan-500/15 via-indigo-500/10 to-violet-500/15 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-10 right-10 w-80 h-80 bg-cyan-400/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="w-full max-w-4xl glass-panel bg-white/95 dark:bg-slate-900/90 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-10 z-10 space-y-8 animate-in fade-in duration-300">
        
        {/* Header Branding */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>SECURE IDENTITY GATE &amp; STORAGE ISOLATION</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Personal Engineering Diary &amp; ATS Engine
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl">
              &quot;This platform is my personal engineering diary where I log what I learn and what I build—and my ATS resume is dynamically generated from my actual entries, never from random placeholder text.&quot;
            </p>
          </div>

          <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 shrink-0">
            <span className="text-xs font-mono px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
              v2.0 Architecture
            </span>
          </div>
        </div>

        {/* Quick Start Hero Card (Tharanesh Selvam) */}
        <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white border border-indigo-500/30 shadow-lg shadow-indigo-500/10 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono font-bold uppercase tracking-wider">
                <Sparkles className="w-4 h-4" />
                <span>Recommended Instant Access</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white">
                Launch Workspace as Tharanesh Selvam
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
                Instantly initialize your verified engineering diary with curated architectural projects, learning milestones, and active ATS resume sync.
              </p>
            </div>

            <button
              type="button"
              onClick={handleQuickDemoLogin}
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold text-sm shadow-md shadow-cyan-500/30 transition-all hover:scale-105 active:scale-95 whitespace-nowrap"
            >
              <span>Quick Launch Diary</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-white/10 text-xs text-slate-300 font-mono">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
              <span>Identity Verified</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
              <span>Scoped Storage</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
              <span>Auto-ATS Generator</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
              <span>Dataset Ready</span>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="relative flex items-center justify-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200 dark:border-slate-800" />
          </div>
          <div className="relative px-4 bg-white dark:bg-slate-900 text-xs font-mono uppercase text-slate-400 tracking-wider">
            Or Configure Custom Identity &amp; Access Namespace
          </div>
        </div>

        {/* Custom User Access Form */}
        <form onSubmit={handleCustomSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            
            {/* User ID or Email */}
            <div className="space-y-1 sm:col-span-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-cyan-500" />
                <span>User ID or Email ID <span className="text-rose-500">*</span></span>
              </label>
              <input
                type="text"
                placeholder="e.g. tharanesh-selvam or email"
                value={formData.userIdOrEmail}
                onChange={(e) => setFormData({ ...formData, userIdOrEmail: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl glass-panel text-slate-900 dark:text-white placeholder-slate-400 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
              />
              <span className="text-[10px] text-slate-400 font-mono">
                Used to isolate your localStorage key (`myresume_workspace_*`)
              </span>
              {errors.userIdOrEmail && (
                <p className="text-[11px] text-rose-500 font-medium">{errors.userIdOrEmail}</p>
              )}
            </div>

            {/* Full Name */}
            <div className="space-y-1 sm:col-span-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-cyan-500" />
                <span>Full Name <span className="text-rose-500">*</span></span>
              </label>
              <input
                type="text"
                placeholder="e.g. Tharanesh Selvam"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl glass-panel text-slate-900 dark:text-white placeholder-slate-400 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
              />
              {errors.name && (
                <p className="text-[11px] text-rose-500 font-medium">{errors.name}</p>
              )}
            </div>

            {/* Title / Target Role */}
            <div className="space-y-1 sm:col-span-2 lg:col-span-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-cyan-500" />
                <span>Target Role / Title <span className="text-rose-500">*</span></span>
              </label>
              <input
                type="text"
                placeholder="e.g. Full-Stack Software Engineer"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl glass-panel text-slate-900 dark:text-white placeholder-slate-400 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
              />
              {errors.title && (
                <p className="text-[11px] text-rose-500 font-medium">{errors.title}</p>
              )}
            </div>

            {/* Location */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>Location (Optional)</span>
              </label>
              <input
                type="text"
                placeholder="e.g. San Francisco, CA / Remote"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl glass-panel text-slate-900 dark:text-white placeholder-slate-400 border border-slate-200 dark:border-slate-700"
              />
            </div>

            {/* GitHub Profile */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <GithubIcon className="w-3.5 h-3.5" />
                <span>GitHub URL (Optional)</span>
              </label>
              <input
                type="url"
                placeholder="https://github.com/..."
                value={formData.github}
                onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl glass-panel text-slate-900 dark:text-white placeholder-slate-400 border border-slate-200 dark:border-slate-700"
              />
            </div>

            {/* LinkedIn Profile */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <LinkedinIcon className="w-3.5 h-3.5" />
                <span>LinkedIn URL (Optional)</span>
              </label>
              <input
                type="url"
                placeholder="https://linkedin.com/in/..."
                value={formData.linkedin}
                onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl glass-panel text-slate-900 dark:text-white placeholder-slate-400 border border-slate-200 dark:border-slate-700"
              />
            </div>
          </div>

          {/* Initial Data Option */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 block font-mono">
              Initial Workspace Dataset
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label
                className={`p-3 rounded-xl border flex items-start gap-3 cursor-pointer transition-all ${
                  formData.starterOption === "curated"
                    ? "bg-cyan-500/10 border-cyan-500/40 text-slate-900 dark:text-white"
                    : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400"
                }`}
              >
                <input
                  type="radio"
                  name="starterOption"
                  checked={formData.starterOption === "curated"}
                  onChange={() => setFormData({ ...formData, starterOption: "curated" })}
                  className="mt-0.5 text-cyan-600 focus:ring-cyan-500"
                />
                <div>
                  <span className="text-xs font-bold block">Pre-load Verified Engineering Milestones</span>
                  <span className="text-[11px] leading-tight text-slate-500 dark:text-slate-400 block mt-0.5">
                    Starts with high-impact learning entries and project architectures ready to edit or extend.
                  </span>
                </div>
              </label>

              <label
                className={`p-3 rounded-xl border flex items-start gap-3 cursor-pointer transition-all ${
                  formData.starterOption === "blank"
                    ? "bg-cyan-500/10 border-cyan-500/40 text-slate-900 dark:text-white"
                    : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400"
                }`}
              >
                <input
                  type="radio"
                  name="starterOption"
                  checked={formData.starterOption === "blank"}
                  onChange={() => setFormData({ ...formData, starterOption: "blank" })}
                  className="mt-0.5 text-cyan-600 focus:ring-cyan-500"
                />
                <div>
                  <span className="text-xs font-bold block">100% Blank Slate</span>
                  <span className="text-[11px] leading-tight text-slate-500 dark:text-slate-400 block mt-0.5">
                    Start with empty diary and zero projects, ready for manual entry or custom JSON dataset import.
                  </span>
                </div>
              </label>
            </div>
          </div>

          {/* Submit Action */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <span className="text-xs text-slate-400 font-mono text-center sm:text-left">
              🔒 Scoped securely to your browser storage. No external servers receive your credentials.
            </span>

            <button
              type="submit"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-sm shadow-md hover:bg-slate-800 dark:hover:bg-slate-100 transition-all active:scale-95"
            >
              <span>Enter Workspace</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}

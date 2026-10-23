"use client";

import { useState } from "react";
import { useProfile } from "@/context/ProfileContext";
import { 
  ShieldCheck, 
  Sparkles, 
  User, 
  Briefcase, 
  MapPin, 
  ArrowRight, 
  Lock, 
  CheckCircle2,
  LockKeyhole
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
      errs.title = "Target Role / Title is required.";
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
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 md:p-10 relative overflow-hidden bg-[#040711] text-white">
      {/* Background ambient cosmic glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-gradient-to-tr from-cyan-500/10 via-teal-500/5 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-10 right-10 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Main Container: 2-Panel Split View Matching Reference Image Bottom Half */}
      <div className="w-full max-w-6xl rounded-3xl bg-[#090f1d]/90 border border-cyan-900/40 shadow-2xl overflow-hidden backdrop-blur-xl z-10 grid grid-cols-1 lg:grid-cols-12 animate-in fade-in duration-300">
        
        {/* ================= LEFT PANEL: Welcome Back & Concentric Avatar (4 Cols) ================= */}
        <div className="lg:col-span-4 p-8 sm:p-10 bg-gradient-to-b from-[#060b17] via-[#081021] to-[#040711] border-b lg:border-b-0 lg:border-r border-cyan-900/30 flex flex-col justify-between space-y-8">
          {/* Top Brand */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-500/20 to-cyan-500/10 border border-cyan-400/40 flex items-center justify-center text-cyan-400 font-extrabold text-xs shadow-md shadow-cyan-500/10">
              TS
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-extrabold tracking-wider text-white uppercase">
                THARANESH SELVAM
              </span>
              <span className="text-[10px] font-mono text-slate-400 -mt-0.5">
                Personal Workspace
              </span>
            </div>
          </div>

          {/* Center: Concentric Glowing Circle Avatar */}
          <div className="flex flex-col items-center text-center space-y-6 my-auto py-6">
            <div className="relative flex items-center justify-center">
              {/* Outer pulse ring */}
              <div className="w-36 h-36 rounded-full border border-cyan-500/20 flex items-center justify-center animate-pulse">
                {/* Middle ring */}
                <div className="w-28 h-28 rounded-full border border-cyan-500/40 flex items-center justify-center bg-cyan-950/20 shadow-2xl shadow-cyan-500/20">
                  {/* Inner TS Monogram */}
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-cyan-950 via-[#071328] to-slate-950 border-2 border-cyan-400 flex items-center justify-center text-cyan-300 font-extrabold text-2xl tracking-wider shadow-inner">
                    TS
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Welcome Back
              </h2>
              <p className="text-xs text-slate-400">
                Access your portfolio workspace
              </p>
            </div>
          </div>

          {/* Bottom Quote Card */}
          <div className="p-4 rounded-2xl bg-[#040711]/80 border border-cyan-900/30 text-center">
            <p className="text-xs italic text-slate-300 font-serif">
              &quot;Build. Learn. Grow.&quot;
            </p>
          </div>
        </div>

        {/* ================= RIGHT PANEL: Access Form & Architecture Setup (8 Cols) ================= */}
        <div className="lg:col-span-8 p-6 sm:p-10 space-y-6 text-left">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-cyan-900/30 pb-5">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Secure Identity Gate &amp; Storage Isolation</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                Personal Engineering Diary &amp; ATS Engine
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
                &quot;This platform is my personal engineering diary where I log what I learn and what I build—and my ATS resume is dynamically generated from my actual entries, never from random placeholder text.&quot;
              </p>
            </div>

            <span className="text-xs font-mono px-3 py-1 rounded-xl bg-cyan-950/60 text-cyan-300 border border-cyan-500/30 self-start sm:self-auto shrink-0">
              v2.0 Architecture
            </span>
          </div>

          {/* Recommended Instant Access Banner (Matches Reference Image) */}
          <div className="p-5 sm:p-6 rounded-2xl bg-[#060c18] border border-cyan-500/40 shadow-xl shadow-cyan-500/10 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-cyan-400 text-xs font-mono font-bold uppercase tracking-wider">
                  <Sparkles className="w-4 h-4" />
                  <span>RECOMMENDED INSTANT ACCESS</span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-white">
                  Launch Workspace as Tharanesh Selvam
                </h3>
                <p className="text-xs text-slate-300 max-w-xl">
                  Instantly initialize your verified engineering diary with curated architectural projects, learning milestones, and active ATS resume sync.
                </p>
              </div>

              <button
                type="button"
                onClick={handleQuickDemoLogin}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-teal-400 to-cyan-500 hover:from-teal-300 hover:to-cyan-400 text-slate-950 font-bold text-xs sm:text-sm shadow-md shadow-cyan-500/25 transition-all hover:scale-105 active:scale-95 whitespace-nowrap shrink-0"
              >
                <span>Quick Launch Diary</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* 4 Feature Pills */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3 border-t border-slate-800 text-[11px] text-slate-300 font-mono">
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

          {/* Form Fields: Configure Custom Identity & Access Namespace */}
          <form onSubmit={handleCustomSubmit} className="space-y-4 pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* User ID or Email */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-300 flex items-center gap-1">
                  <Lock className="w-3 h-3 text-cyan-400" />
                  <span>User ID or Email ID <span className="text-rose-500">*</span></span>
                </label>
                <input
                  type="text"
                  value={formData.userIdOrEmail}
                  onChange={(e) => setFormData({ ...formData, userIdOrEmail: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-[#040711] border border-cyan-900/40 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                />
                {errors.userIdOrEmail && (
                  <p className="text-[10px] text-rose-500">{errors.userIdOrEmail}</p>
                )}
              </div>

              {/* Full Name */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-300 flex items-center gap-1">
                  <User className="w-3 h-3 text-cyan-400" />
                  <span>Full Name <span className="text-rose-500">*</span></span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-[#040711] border border-cyan-900/40 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                />
                {errors.name && (
                  <p className="text-[10px] text-rose-500">{errors.name}</p>
                )}
              </div>

              {/* Target Role / Title */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-300 flex items-center gap-1">
                  <Briefcase className="w-3 h-3 text-cyan-400" />
                  <span>Target Role / Title <span className="text-rose-500">*</span></span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-[#040711] border border-cyan-900/40 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                />
                {errors.title && (
                  <p className="text-[10px] text-rose-500">{errors.title}</p>
                )}
              </div>

              {/* Location */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-300 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-slate-400" />
                  <span>Location (Optional)</span>
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-[#040711] border border-cyan-900/40 text-white placeholder-slate-500"
                />
              </div>

              {/* GitHub URL */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-300 flex items-center gap-1">
                  <GithubIcon className="w-3 h-3 text-slate-400" />
                  <span>GitHub URL (Optional)</span>
                </label>
                <input
                  type="url"
                  value={formData.github}
                  onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-[#040711] border border-cyan-900/40 text-white placeholder-slate-500"
                />
              </div>

              {/* LinkedIn URL */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-300 flex items-center gap-1">
                  <LinkedinIcon className="w-3 h-3 text-slate-400" />
                  <span>LinkedIn URL (Optional)</span>
                </label>
                <input
                  type="url"
                  value={formData.linkedin}
                  onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-[#040711] border border-cyan-900/40 text-white placeholder-slate-500"
                />
              </div>
            </div>

            {/* Initial Workspace Dataset Options (Matches Reference Image) */}
            <div className="p-3.5 rounded-2xl bg-[#060b17] border border-cyan-900/30 space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-300 block font-mono">
                INITIAL WORKSPACE DATASET
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <label
                  className={`p-2.5 rounded-xl border flex items-start gap-2.5 cursor-pointer transition-all ${
                    formData.starterOption === "curated"
                      ? "bg-cyan-950/40 border-cyan-500/50 text-white"
                      : "border-slate-800 text-slate-400 hover:border-slate-700"
                  }`}
                >
                  <input
                    type="radio"
                    name="starterOption"
                    checked={formData.starterOption === "curated"}
                    onChange={() => setFormData({ ...formData, starterOption: "curated" })}
                    className="mt-0.5 text-cyan-400 focus:ring-cyan-400"
                  />
                  <div>
                    <span className="text-xs font-bold block text-white">Pre-load Verified Engineering Milestones</span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">
                      Starts with high-impact learning entries and project architectures. Ready to edit or extend.
                    </span>
                  </div>
                </label>

                <label
                  className={`p-2.5 rounded-xl border flex items-start gap-2.5 cursor-pointer transition-all ${
                    formData.starterOption === "blank"
                      ? "bg-cyan-950/40 border-cyan-500/50 text-white"
                      : "border-slate-800 text-slate-400 hover:border-slate-700"
                  }`}
                >
                  <input
                    type="radio"
                    name="starterOption"
                    checked={formData.starterOption === "blank"}
                    onChange={() => setFormData({ ...formData, starterOption: "blank" })}
                    className="mt-0.5 text-cyan-400 focus:ring-cyan-400"
                  />
                  <div>
                    <span className="text-xs font-bold block text-white">100% Blank Slate</span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">
                      Start with empty diary and zero projects, ready for manual entry or custom JSON dataset import.
                    </span>
                  </div>
                </label>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
              <span className="text-[11px] text-slate-400 font-mono">
                🔒 Scoped securely to your browser storage.
              </span>

              <button
                type="submit"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 hover:border-cyan-400/40 transition-all active:scale-95"
              >
                <span>Enter Workspace</span>
                <ArrowRight className="w-3.5 h-3.5 text-cyan-400" />
              </button>
            </div>
          </form>

        </div>

      </div>
    </div>
  );
}

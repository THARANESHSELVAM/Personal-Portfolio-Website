"use client";

import { useState, useEffect } from "react";
import { useProfile } from "@/context/ProfileContext";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Check, 
  Save, 
  FileText, 
  Sparkles, 
  RefreshCw, 
  ShieldCheck,
  ArrowRight
} from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/Icons";

export function ResumeContactSettings() {
  const { state, updateProfile, setActiveTab } = useProfile();
  const contact = state.contact;

  const [formValues, setFormValues] = useState({
    email: contact?.email || "",
    phone: contact?.phone || "",
    location: contact?.location || "",
    linkedin: contact?.linkedin || "",
    github: contact?.github || "",
  });

  const [isSaved, setIsSaved] = useState(false);

  // Sync state whenever external updates occur (e.g., identity login or profile restore)
  useEffect(() => {
    setFormValues({
      email: contact?.email || "",
      phone: contact?.phone || "",
      location: contact?.location || "",
      linkedin: contact?.linkedin || "",
      github: contact?.github || "",
    });
  }, [contact?.email, contact?.phone, contact?.location, contact?.linkedin, contact?.github]);

  const handleInputChange = (field: keyof typeof formValues, val: string) => {
    setFormValues((prev) => ({ ...prev, [field]: val }));
    setIsSaved(false);
  };

  const handleSaveCoordinates = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    updateProfile({
      contact: {
        ...state.contact,
        email: formValues.email.trim(),
        phone: formValues.phone.trim(),
        location: formValues.location.trim(),
        linkedin: formValues.linkedin.trim(),
        github: formValues.github.trim(),
      },
    });

    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleNavigateToResume = () => {
    setActiveTab("resume");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <section 
      id="resume-contact-settings" 
      aria-label="Resume Contact Header Settings"
      className="rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 backdrop-blur-md space-y-6 dark:bg-[#090f1d]/80 dark:border-cyan-900/30 shadow-sm"
    >
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-cyan-50 text-cyan-700 border border-cyan-200 dark:bg-cyan-500/10 dark:text-cyan-400 dark:border-cyan-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse" />
            <span>ATS RESUME COORDINATES</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <span>Resume Contact Header Settings</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-2xl">
            Configure your verified contact coordinates. These values automatically synchronize to the top header of your <strong>ATS Resume</strong> and plain-text export.
          </p>
        </div>

        <button
          type="button"
          onClick={handleNavigateToResume}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200 transition-colors border border-slate-200 dark:border-slate-700 self-start sm:self-auto shrink-0 shadow-sm"
        >
          <FileText className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
          <span>View Live ATS Resume</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Settings Form */}
      <form onSubmit={handleSaveCoordinates} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          
          {/* Email Address */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
              <span>Email Address</span>
              <span className="text-rose-500">*</span>
            </label>
            <input
              type="email"
              value={formValues.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              placeholder="e.g. tharaneshselvam@gmail.com"
              required
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 dark:bg-[#060b17] dark:border-cyan-900/30 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all font-mono"
            />
          </div>

          {/* Direct Phone Number */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
              <span>Direct Phone Number</span>
            </label>
            <input
              type="tel"
              value={formValues.phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              placeholder="e.g. +91 98765 43210"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 dark:bg-[#060b17] dark:border-cyan-900/30 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all font-mono"
            />
          </div>

          {/* Location / Base */}
          <div className="space-y-1.5 md:col-span-2 lg:col-span-1">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
              <span>Location / Relocation Preferences</span>
            </label>
            <input
              type="text"
              value={formValues.location}
              onChange={(e) => handleInputChange("location", e.target.value)}
              placeholder="e.g. India / Open to Remote & Relocation"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 dark:bg-[#060b17] dark:border-cyan-900/30 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all"
            />
          </div>

          {/* LinkedIn URL */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <LinkedinIcon className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
              <span>LinkedIn Profile URL</span>
            </label>
            <input
              type="url"
              value={formValues.linkedin}
              onChange={(e) => handleInputChange("linkedin", e.target.value)}
              placeholder="e.g. https://linkedin.com/in/tharanesh-selvam"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 dark:bg-[#060b17] dark:border-cyan-900/30 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all font-mono"
            />
          </div>

          {/* GitHub URL */}
          <div className="space-y-1.5 md:col-span-2">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <GithubIcon className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
              <span>GitHub Profile URL</span>
            </label>
            <input
              type="url"
              value={formValues.github}
              onChange={(e) => handleInputChange("github", e.target.value)}
              placeholder="e.g. https://github.com/THARANESHSELVAM"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 dark:bg-[#060b17] dark:border-cyan-900/30 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all font-mono"
            />
          </div>
        </div>

        {/* Live Resume Header Preview Bar */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#060b17] border border-slate-200 dark:border-cyan-900/20 space-y-2">
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>Live ATS Header Preview:</span>
            </span>
            <span className="text-[10px] text-cyan-600 dark:text-cyan-400">
              Synced to PDF &amp; .txt exports
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs text-slate-700 dark:text-slate-300 font-sans">
            {formValues.location ? (
              <span className="font-medium text-slate-900 dark:text-white">{formValues.location}</span>
            ) : (
              <span className="italic text-slate-400">Location not set</span>
            )}
            <span>•</span>
            {formValues.email ? (
              <span className="text-cyan-600 dark:text-cyan-400 font-mono text-xs">{formValues.email}</span>
            ) : (
              <span className="italic text-slate-400">Email required</span>
            )}
            {formValues.phone && (
              <>
                <span>•</span>
                <span className="font-mono text-xs">{formValues.phone}</span>
              </>
            )}
            {formValues.linkedin && (
              <>
                <span>•</span>
                <span className="text-cyan-600 dark:text-cyan-400 underline underline-offset-2">LinkedIn</span>
              </>
            )}
            {formValues.github && (
              <>
                <span>•</span>
                <span className="text-cyan-600 dark:text-cyan-400 underline underline-offset-2">GitHub</span>
              </>
            )}
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
            {isSaved ? (
              <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                <Check className="w-3.5 h-3.5" />
                <span>Contact coordinates saved and synced to ATS Resume!</span>
              </span>
            ) : (
              <span>Coordinates are stored securely in your private workspace.</span>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-400 hover:to-cyan-500 text-white font-bold text-xs sm:text-sm shadow-md shadow-cyan-500/20 transition-all active:scale-95"
            >
              {isSaved ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Saved &amp; Synced!</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Coordinates</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </section>
  );
}

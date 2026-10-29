"use client";

import { useState, useMemo } from "react";
import { useProfile } from "@/context/ProfileContext";
import { 
  User, 
  Briefcase, 
  MapPin, 
  ArrowRight, 
  ArrowLeft,
  ShieldAlert,
  Eye,
  EyeOff,
  Mail,
  KeyRound,
  PlusCircle,
  Sparkles,
  UserCheck,
  Info,
  Lock
} from "lucide-react";
import Link from "next/link";
import { GithubIcon, LinkedinIcon } from "@/components/Icons";
import { ThemeToggle } from "./ThemeToggle";
import { verifyCredentials, findRegisteredProfile } from "@/lib/authConfig";

function getInitialFormData() {
  if (typeof window !== "undefined") {
    if (sessionStorage.getItem("myresume_onboarding_mode") === "new") {
      return {
        userIdOrEmail: "",
        email: "",
        passcode: "",
        name: "",
        title: "",
        location: "",
        phone: "",
        github: "",
        linkedin: "",
        starterOption: "new" as "existing" | "new",
      };
    }

    // Preserve the currently selected profile in the lock screen inputs if available
    const lastActiveUserId = localStorage.getItem("myresume_active_user_id");
    if (lastActiveUserId) {
      const profile = findRegisteredProfile(lastActiveUserId);
      if (profile && !profile.isOwner) {
        return {
          userIdOrEmail: profile.username || profile.userId,
          email: profile.email,
          passcode: profile.pin || "",
          name: profile.name,
          title: profile.title,
          location: profile.location || "",
          phone: profile.phone || "",
          github: profile.github || "",
          linkedin: profile.linkedin || "",
          starterOption: "existing" as "existing" | "new",
        };
      }
    }
  }

  return {
    userIdOrEmail: "THARANESHSELVAM",
    email: "",
    passcode: "2026",
    name: "Tharanesh Selvam",
    title: "Software Developer & Integrated M.Tech CSE Student",
    location: "India / Open to Remote & Relocation",
    phone: "",
    github: "https://github.com/THARANESHSELVAM",
    linkedin: "",
    starterOption: "existing" as "existing" | "new",
  };
}

export function SecurityGate() {
  const { loginUser } = useProfile();

  const [formData, setFormData] = useState(getInitialFormData);

  const [showPasscode, setShowPasscode] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isShaking, setIsShaking] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Compute dynamic monogram / avatar initials
  const dynamicInitials = useMemo(() => {
    if (formData.starterOption === "new") {
      const trimmed = formData.name.trim();
      if (!trimmed) return "+";
      const parts = trimmed.split(/\s+/).filter(Boolean);
      if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return "TS";
  }, [formData.name, formData.starterOption]);

  // Mode Selection: Switch to Existing Owner Profile (Tharanesh Selvam)
  const handleSelectExisting = () => {
    setFormData({
      userIdOrEmail: "THARANESHSELVAM",
      email: "",
      passcode: "2026",
      name: "Tharanesh Selvam",
      title: "Software Developer & Integrated M.Tech CSE Student",
      location: "India / Open to Remote & Relocation",
      phone: "",
      github: "https://github.com/THARANESHSELVAM",
      linkedin: "",
      starterOption: "existing",
    });
    setAuthError(null);
    setFieldErrors({});
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("myresume_onboarding_mode");
    }
  };

  // Mode Selection: Switch to ➕ Add New Profile Entry (100% Blank Slate)
  const handleSelectNewProfile = () => {
    // Immediately Clear Form Inputs on Selection
    setFormData({
      userIdOrEmail: "",
      email: "",
      passcode: "",
      name: "",
      title: "",
      location: "",
      phone: "",
      github: "",
      linkedin: "",
      starterOption: "new",
    });
    setAuthError(null);
    setFieldErrors({});
    if (typeof window !== "undefined") {
      sessionStorage.setItem("myresume_onboarding_mode", "new");
    }
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};

    if (!formData.userIdOrEmail.trim()) {
      errs.userIdOrEmail = "Username or User ID is required.";
    }
    if (!formData.email.trim()) {
      errs.email = "Email ID is required.";
    } else if (!formData.email.includes("@") || !formData.email.includes(".")) {
      errs.email = "Please enter a valid email address.";
    }
    if (!formData.passcode.trim()) {
      errs.passcode = "Demo passcode is required.";
    } else if (formData.passcode.trim().length < 3) {
      errs.passcode = "Passcode must be at least 3 digits.";
    }
    if (!formData.name.trim()) {
      errs.name = "Full Name is required.";
    }
    if (!formData.title.trim()) {
      errs.title = "Target Role / Title is required.";
    }

    if (Object.keys(errs).length > 0) {
      setFieldErrors(errs);
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 600);
      return;
    }

    const isNewProfile = formData.starterOption === "new";

    // CREDENTIAL VERIFICATION (supports new profile registration and registered profiles)
    const verification = verifyCredentials(
      formData.userIdOrEmail,
      formData.email,
      formData.passcode,
      isNewProfile
    );

    if (!verification.success) {
      setAuthError(
        verification.error ||
        "Verification failed. Please check your username and demo passcode."
      );
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 600);
      return;
    }

    // Access granted: clear error states
    setAuthError(null);
    setFieldErrors({});

    if (typeof window !== "undefined") {
      sessionStorage.removeItem("myresume_onboarding_mode");
    }

    loginUser(
      {
        userId: formData.userIdOrEmail.trim(),
        name: formData.name.trim(),
        email: formData.email.trim(),
        title: formData.title.trim(),
        location: formData.location.trim() || "Remote",
        phone: formData.phone.trim(),
        github: formData.github.trim(),
        linkedin: formData.linkedin.trim(),
      },
      { 
        loadStarterData: !isNewProfile,
        isBlankSlate: isNewProfile,
        pin: formData.passcode.trim() 
      }
    );
  };

  const isNewMode = formData.starterOption === "new";

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 md:p-10 relative overflow-hidden bg-slate-50 text-slate-900 dark:bg-[#040711] dark:text-white transition-colors duration-200">
      {/* Background ambient cosmic glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-gradient-to-tr from-cyan-500/10 via-teal-500/5 to-transparent rounded-full blur-3xl pointer-events-none -z-10 opacity-40 dark:opacity-100" />
      <div className="absolute top-10 right-10 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none -z-10 opacity-30 dark:opacity-100" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl pointer-events-none -z-10 opacity-30 dark:opacity-100" />

      {/* Floating Header Actions: Back to Public Portfolio & Theme Switcher */}
      <div className="fixed top-5 left-5 z-50">
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-white/90 dark:bg-slate-900/90 hover:bg-slate-100 dark:hover:bg-slate-800 backdrop-blur-md px-3.5 py-2 rounded-full border border-slate-200 dark:border-slate-800 shadow-md text-xs font-semibold text-slate-700 dark:text-slate-200 transition-all hover:scale-[1.02] active:scale-95"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
          <span>← Back to Public Portfolio</span>
        </Link>
      </div>

      <div className="fixed top-5 right-5 z-50 flex items-center gap-2 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-800 shadow-md">
        <span className="text-[11px] font-mono text-slate-600 dark:text-slate-400 font-semibold hidden sm:inline">
          Theme
        </span>
        <ThemeToggle />
      </div>

      {/* Main Container: 2-Panel Split View */}
      <div 
        className={`w-full max-w-6xl rounded-3xl bg-white dark:bg-[#090f1d]/90 border border-slate-200 dark:border-cyan-900/40 shadow-2xl overflow-hidden backdrop-blur-xl z-10 grid grid-cols-1 lg:grid-cols-12 animate-in fade-in duration-300 transition-colors ${
          isShaking ? "animate-shake" : ""
        }`}
      >
        
        {/* ================= LEFT PANEL: Welcome Back / Create New Profile & Concentric Avatar (4 Cols) ================= */}
        <div className="lg:col-span-4 p-8 sm:p-10 bg-gradient-to-b from-slate-100 via-slate-50 to-white dark:from-[#060b17] dark:via-[#081021] dark:to-[#040711] border-b lg:border-b-0 lg:border-r border-slate-200 dark:border-cyan-900/30 flex flex-col justify-between space-y-8 transition-colors">
          {/* Top Brand */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-500/20 to-cyan-500/10 border border-cyan-500/40 dark:border-cyan-400/40 flex items-center justify-center text-cyan-600 dark:text-cyan-400 font-extrabold text-xs shadow-md shadow-cyan-500/10">
              {dynamicInitials}
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-extrabold tracking-wider text-slate-900 dark:text-white uppercase truncate max-w-[190px]">
                {formData.name.trim() ? formData.name.trim() : (isNewMode ? "NEW PROFILE ENTRY" : "THARANESH SELVAM")}
              </span>
              <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 -mt-0.5">
                {isNewMode ? "Clean Slate Workspace" : "Personal Workspace"}
              </span>
            </div>
          </div>

          {/* Center: Concentric Glowing Circle Avatar */}
          <div className="flex flex-col items-center text-center space-y-6 my-auto py-6">
            <div className="relative flex items-center justify-center">
              {/* Outer pulse ring */}
              <div className="w-36 h-36 rounded-full border border-slate-300 dark:border-cyan-500/20 flex items-center justify-center animate-pulse">
                {/* Middle ring */}
                <div className="w-28 h-28 rounded-full border border-cyan-400/40 dark:border-cyan-500/40 flex items-center justify-center bg-cyan-50/50 dark:bg-cyan-950/20 shadow-xl shadow-cyan-500/10 dark:shadow-cyan-500/20">
                  {/* Inner Monogram */}
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-cyan-600 to-teal-600 dark:from-cyan-950 dark:via-[#071328] dark:to-slate-950 border-2 border-cyan-300 dark:border-cyan-400 flex items-center justify-center text-white dark:text-cyan-300 font-extrabold text-2xl tracking-wider shadow-md">
                    {dynamicInitials}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {isNewMode ? "Create New Profile" : "Welcome Back"}
              </h2>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                {isNewMode 
                  ? "Initialize your 100% blank workspace & engineering diary" 
                  : "Access your portfolio workspace"}
              </p>
            </div>
          </div>

          {/* Bottom Quote Card */}
          <div className="p-4 rounded-2xl bg-slate-100/80 border border-slate-200 dark:bg-[#040711]/80 dark:border-cyan-900/30 text-center transition-colors">
            <p className="text-xs italic text-slate-700 dark:text-slate-300 font-serif">
              {isNewMode 
                ? "\"Start Fresh. Document Every Milestone.\""
                : "\"Build. Learn. Grow.\""}
            </p>
          </div>
        </div>

        {/* ================= RIGHT PANEL: Access Form & Architecture Setup (8 Cols) ================= */}
        <div className="lg:col-span-8 p-6 sm:p-10 space-y-6 text-left bg-white dark:bg-[#090f1d] transition-colors">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-cyan-900/30 pb-5">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-cyan-50 text-cyan-700 border border-cyan-200 dark:bg-cyan-500/10 dark:text-cyan-400 dark:border-cyan-500/20">
                <Lock className="w-3.5 h-3.5" />
                <span>
                  {isNewMode
                    ? "➕ Add New Profile Entry • 100% Blank Slate Architecture"
                    : "Interactive Demo Workspace • Local Profile Storage"}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                Interactive Engineering Workspace &amp; ATS Engine
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
                {isNewMode
                  ? "Configure a custom demo engineering profile. Your ATS resume will compile dynamically from your actual entries in this session."
                  : "Explore the interactive engineering diary, milestone logger, GitHub API repository importer, and dynamic ATS resume generator."}
              </p>
            </div>

            <span className="text-xs font-mono px-3 py-1 rounded-xl bg-slate-100 text-slate-700 border border-slate-200 dark:bg-cyan-950/60 dark:text-cyan-300 dark:border-cyan-500/30 self-start sm:self-auto shrink-0">
              Demo Environment
            </span>
          </div>

          {/* Client-Side Demo Notice */}
          <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-900 dark:text-amber-200 text-xs flex items-start gap-3">
            <Info className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <p className="font-semibold text-[11px] uppercase tracking-wider font-mono text-amber-800 dark:text-amber-300">
                Client-Side Demo Workspace Notice
              </p>
              <p className="text-[11px] leading-relaxed text-slate-700 dark:text-slate-300">
                This workspace is an interactive demonstration stored locally in your browser (localStorage). The access passcode is a client-side presentation mechanism for demo profiles and storage isolation—<strong>not server-enforced authentication</strong>. Please do not enter confidential passwords or sensitive personal information.
              </p>
            </div>
          </div>

          {/* Access Denied Alert Banner */}
          {authError && (
            <div 
              role="alert" 
              className="p-4 rounded-2xl bg-rose-50 border-2 border-rose-400 text-rose-900 dark:bg-rose-950/50 dark:border-rose-500 dark:text-rose-200 flex items-start gap-3 shadow-lg shadow-rose-500/10 animate-in fade-in slide-in-from-top-1 duration-200"
            >
              <ShieldAlert className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
              <div className="space-y-1 text-xs">
                <p className="font-bold text-sm text-rose-950 dark:text-rose-100">
                  Passcode Verification Failed
                </p>
                <p className="leading-relaxed font-medium">
                  {authError}
                </p>
                {!isNewMode && (
                  <p className="text-[11px] text-rose-700 dark:text-rose-300 font-mono pt-1">
                    💡 Demo Profile: Username <span className="font-bold">THARANESHSELVAM</span> (Demo Passcode: 2026)
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Form Fields: Configure Custom Identity & Access Namespace */}
          <form onSubmit={handleCustomSubmit} className="space-y-4 pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              
              {/* Authorized Username / User ID */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <User className="w-3 h-3 text-cyan-600 dark:text-cyan-400" />
                    <span>Username / User ID <span className="text-rose-500">*</span></span>
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {isNewMode ? "Unique ID" : "THARANESHSELVAM"}
                  </span>
                </label>
                <input
                  type="text"
                  value={formData.userIdOrEmail}
                  onChange={(e) => {
                    setFormData({ ...formData, userIdOrEmail: e.target.value });
                    if (fieldErrors.userIdOrEmail) {
                      setFieldErrors({ ...fieldErrors, userIdOrEmail: "" });
                    }
                  }}
                  placeholder={isNewMode ? "e.g. sarah_chen" : "e.g. THARANESHSELVAM"}
                  className={`w-full px-3 py-2 text-xs rounded-xl border transition-colors ${
                    fieldErrors.userIdOrEmail 
                      ? "bg-rose-50 text-rose-900 border-rose-500 focus:ring-2 focus:ring-rose-500 dark:bg-rose-950/30 dark:text-rose-200 dark:border-rose-500" 
                      : "bg-slate-100 text-slate-900 placeholder:text-slate-400 border-slate-300 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500 dark:border-slate-800 focus:ring-2 focus:ring-cyan-500/50"
                  }`}
                />
                {fieldErrors.userIdOrEmail && (
                  <p className="text-[10px] text-rose-500 font-medium">{fieldErrors.userIdOrEmail}</p>
                )}
              </div>

              {/* Authorized Email ID */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <Mail className="w-3 h-3 text-cyan-600 dark:text-cyan-400" />
                    <span>Authorized Email <span className="text-rose-500">*</span></span>
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {isNewMode ? "Valid Email" : "owner@gmail.com"}
                  </span>
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => {
                    setFormData({ ...formData, email: e.target.value });
                    if (fieldErrors.email) {
                      setFieldErrors({ ...fieldErrors, email: "" });
                    }
                  }}
                  placeholder={isNewMode ? "e.g. sarah@engineer.io" : "e.g. tharaneshselvam@gmail.com"}
                  className={`w-full px-3 py-2 text-xs rounded-xl border transition-colors ${
                    fieldErrors.email 
                      ? "bg-rose-50 text-rose-900 border-rose-500 focus:ring-2 focus:ring-rose-500 dark:bg-rose-950/30 dark:text-rose-200 dark:border-rose-500" 
                      : "bg-slate-100 text-slate-900 placeholder:text-slate-400 border-slate-300 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500 dark:border-slate-800 focus:ring-2 focus:ring-cyan-500/50"
                  }`}
                />
                {fieldErrors.email && (
                  <p className="text-[10px] text-rose-500 font-medium">{fieldErrors.email}</p>
                )}
              </div>

              {/* Demo Passcode */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <KeyRound className="w-3 h-3 text-cyan-600 dark:text-cyan-400" />
                    <span>Demo Passcode <span className="text-rose-500">*</span></span>
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {isNewMode ? "Set Demo Passcode" : "Default: 2026"}
                  </span>
                </label>
                <div className="relative">
                  <input
                    type={showPasscode ? "text" : "password"}
                    value={formData.passcode}
                    onChange={(e) => {
                      setFormData({ ...formData, passcode: e.target.value });
                      if (fieldErrors.passcode) {
                        setFieldErrors({ ...fieldErrors, passcode: "" });
                      }
                    }}
                    placeholder={isNewMode ? "e.g. 1234 or 2026" : "2026"}
                    className={`w-full px-3 py-2 pr-10 text-xs rounded-xl border transition-colors ${
                      fieldErrors.passcode 
                        ? "bg-rose-50 text-rose-900 border-rose-500 focus:ring-2 focus:ring-rose-500 dark:bg-rose-950/30 dark:text-rose-200 dark:border-rose-500" 
                        : "bg-slate-100 text-slate-900 placeholder:text-slate-400 border-slate-300 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500 dark:border-slate-800 focus:ring-2 focus:ring-cyan-500/50"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasscode(!showPasscode)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                    aria-label={showPasscode ? "Hide Passcode" : "Show Passcode"}
                  >
                    {showPasscode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {fieldErrors.passcode && (
                  <p className="text-[10px] text-rose-500 font-medium">{fieldErrors.passcode}</p>
                )}
              </div>

              {/* Full Name */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                  <User className="w-3 h-3 text-cyan-600 dark:text-cyan-400" />
                  <span>Full Name <span className="text-rose-500">*</span></span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => {
                    setFormData({ ...formData, name: e.target.value });
                    if (fieldErrors.name) setFieldErrors({ ...fieldErrors, name: "" });
                  }}
                  placeholder={isNewMode ? "e.g. Sarah Chen" : "e.g. Tharanesh Selvam"}
                  className={`w-full px-3 py-2 text-xs rounded-xl border transition-colors ${
                    fieldErrors.name
                      ? "bg-rose-50 text-rose-900 border-rose-500 focus:ring-2 focus:ring-rose-500 dark:bg-rose-950/30 dark:text-rose-200 dark:border-rose-500"
                      : "bg-slate-100 text-slate-900 placeholder:text-slate-400 border-slate-300 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500 dark:border-slate-800 focus:ring-2 focus:ring-cyan-500/50"
                  }`}
                />
                {fieldErrors.name && (
                  <p className="text-[10px] text-rose-500 font-medium">{fieldErrors.name}</p>
                )}
              </div>

              {/* Target Role / Title */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                  <Briefcase className="w-3 h-3 text-cyan-600 dark:text-cyan-400" />
                  <span>Target Role / Title <span className="text-rose-500">*</span></span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => {
                    setFormData({ ...formData, title: e.target.value });
                    if (fieldErrors.title) setFieldErrors({ ...fieldErrors, title: "" });
                  }}
                  placeholder={isNewMode ? "e.g. Senior Frontend Architect" : "e.g. Full-Stack Software Engineer & Cloud Architect"}
                  className={`w-full px-3 py-2 text-xs rounded-xl border transition-colors ${
                    fieldErrors.title
                      ? "bg-rose-50 text-rose-900 border-rose-500 focus:ring-2 focus:ring-rose-500 dark:bg-rose-950/30 dark:text-rose-200 dark:border-rose-500"
                      : "bg-slate-100 text-slate-900 placeholder:text-slate-400 border-slate-300 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500 dark:border-slate-800 focus:ring-2 focus:ring-cyan-500/50"
                  }`}
                />
                {fieldErrors.title && (
                  <p className="text-[10px] text-rose-500 font-medium">{fieldErrors.title}</p>
                )}
              </div>

              {/* Location */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-slate-400" />
                  <span>Location (Optional)</span>
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder={isNewMode ? "e.g. San Francisco, CA / Remote" : "India / Open to Remote & Relocation"}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-100 text-slate-900 placeholder:text-slate-400 border-slate-300 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500 dark:border-slate-800"
                />
              </div>

              {/* GitHub URL */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                  <GithubIcon className="w-3 h-3 text-slate-400" />
                  <span>GitHub URL (Optional)</span>
                </label>
                <input
                  type="url"
                  value={formData.github}
                  onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                  placeholder={isNewMode ? "https://github.com/sarahchen" : "https://github.com/THARANESHSELVAM"}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-100 text-slate-900 placeholder:text-slate-400 border-slate-300 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500 dark:border-slate-800"
                />
              </div>

              {/* LinkedIn URL */}
              <div className="space-y-1 sm:col-span-2">
                <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                  <LinkedinIcon className="w-3 h-3 text-slate-400" />
                  <span>LinkedIn URL (Optional)</span>
                </label>
                <input
                  type="url"
                  value={formData.linkedin}
                  onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                  placeholder={isNewMode ? "https://linkedin.com/in/sarahchen" : "https://linkedin.com/in/tharanesh-selvam"}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-100 text-slate-900 placeholder:text-slate-400 border-slate-300 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500 dark:border-slate-800"
                />
              </div>
            </div>

            {/* INITIAL WORKSPACE DATASET: 2 Distinct Working Modes */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 dark:bg-[#060b17] dark:border-cyan-900/30 space-y-2.5 transition-colors">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 block font-mono">
                INITIAL WORKSPACE DATASET
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                
                {/* Option 1: Existing Owner Profile (Tharanesh Selvam) */}
                <label
                  onClick={handleSelectExisting}
                  className={`p-3 rounded-xl border flex items-start gap-2.5 cursor-pointer transition-all ${
                    formData.starterOption === "existing"
                      ? "bg-cyan-50/90 border-cyan-500/80 text-slate-900 dark:bg-cyan-950/50 dark:border-cyan-500/60 dark:text-white shadow-sm ring-1 ring-cyan-500/40"
                      : "border-slate-200 text-slate-600 hover:border-slate-300 dark:border-slate-800 dark:text-slate-400 dark:hover:border-slate-700"
                  }`}
                >
                  <input
                    type="radio"
                    name="starterOption"
                    checked={formData.starterOption === "existing"}
                    onChange={handleSelectExisting}
                    className="mt-1 text-cyan-600 focus:ring-cyan-500 dark:text-cyan-400 dark:focus:ring-cyan-400"
                  />
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5">
                      <UserCheck className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                      <span className="text-xs font-bold text-slate-900 dark:text-white">
                        Existing Owner Profile (Tharanesh Selvam)
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-600 dark:text-slate-400 block leading-normal">
                      Pre-fills verified credentials and loads curated engineering milestones, projects, and skills.
                    </span>
                  </div>
                </label>

                {/* Option 2: ➕ Add New Profile Entry (100% Blank Slate) */}
                <label
                  onClick={handleSelectNewProfile}
                  className={`p-3 rounded-xl border flex items-start gap-2.5 cursor-pointer transition-all ${
                    formData.starterOption === "new"
                      ? "bg-cyan-50/90 border-cyan-500/80 text-slate-900 dark:bg-cyan-950/50 dark:border-cyan-500/60 dark:text-white shadow-sm ring-1 ring-cyan-500/40"
                      : "border-slate-200 text-slate-600 hover:border-slate-300 dark:border-slate-800 dark:text-slate-400 dark:hover:border-slate-700"
                  }`}
                >
                  <input
                    type="radio"
                    name="starterOption"
                    checked={formData.starterOption === "new"}
                    onChange={handleSelectNewProfile}
                    className="mt-1 text-cyan-600 focus:ring-cyan-500 dark:text-cyan-400 dark:focus:ring-cyan-400"
                  />
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5">
                      <PlusCircle className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                      <span className="text-xs font-bold text-slate-900 dark:text-white">
                        ➕ Add New Profile Entry (100% Blank Slate)
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-600 dark:text-slate-400 block leading-normal">
                      Immediately clears form inputs so you can enter a brand-new profile with zero seed fallback.
                    </span>
                  </div>
                </label>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-cyan-500" />
                <span>
                  {isNewMode 
                    ? "Creates isolated workspace in localStorage with zero seed fallback."
                    : "Demo workspace with local browser storage isolation."}
                </span>
              </span>

              <button
                type="submit"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white dark:bg-cyan-600 dark:hover:bg-cyan-500 dark:text-slate-950 font-bold text-xs border border-slate-700 hover:border-cyan-400/40 transition-all active:scale-95 shadow-md shadow-cyan-500/20"
              >
                <span>
                  {isNewMode
                    ? "Create Profile & Launch Blank Workspace ->"
                    : "Enter Workspace ->"}
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-cyan-400 dark:text-slate-950" />
              </button>
            </div>
          </form>

        </div>

      </div>
    </div>
  );
}

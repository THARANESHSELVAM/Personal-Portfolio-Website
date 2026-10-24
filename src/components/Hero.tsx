"use client";

import { useState, useRef } from "react";
import { 
  ArrowRight, 
  FileText, 
  Mail, 
  Check, 
  GraduationCap, 
  Terminal,
  Code2,
  FolderKanban,
  Sparkles,
  Layers,
  ArrowUpRight,
  Database,
  Globe2,
  Cpu,
  Activity,
  Compass,
  Play,
  RotateCcw,
  Sliders,
  CheckCircle2,
  Layers3,
  MapPin,
  ShieldCheck,
  Zap
} from "lucide-react";
import { LinkedinIcon, GithubIcon } from "@/components/Icons";
import { useProfile } from "@/context/ProfileContext";

type WorkstationPillar = "web" | "gis" | "ai";

export function Hero() {
  const { state, setActiveTab, extractedSkills } = useProfile();
  const [copied, setCopied] = useState(false);
  const [activePillar, setActivePillar] = useState<WorkstationPillar>("web");

  // Interactive Workstation State
  const [simulatedMutationCount, setSimulatedMutationCount] = useState(1);
  const [isSimulating, setIsSimulating] = useState(false);
  const [selectedParcel, setSelectedParcel] = useState<"A" | "B" | "C" | "D">("A");
  const [confidenceThreshold, setConfidenceThreshold] = useState(0.85);
  const [mutationStatusMessage, setMutationStatusMessage] = useState<string>("");

  // Keyboard navigation for Workstation tabs
  const tabOrder: WorkstationPillar[] = ["web", "gis", "ai"];
  const tabRefs = useRef<Record<WorkstationPillar, HTMLButtonElement | null>>({
    web: null,
    gis: null,
    ai: null,
  });

  const isBlank = Boolean(state.isBlankSlate);
  // Actual counts derived directly from active profile state and deduplicated extracted skills
  const totalSkillsCount = Object.values(extractedSkills || {}).flat().length;
  const projectCount = state.projects?.length ?? 0;
  const projectCountDisplay = `${projectCount}`;
  const skillsCountDisplay = `${totalSkillsCount}`;
  const activeDomainsCount = new Set(
    (state.projects || []).map((p) => p.domainTag || p.category).filter(Boolean)
  ).size || (isBlank ? 0 : 3);

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

  const handleNavigateToSkills = () => {
    setActiveTab("skills");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNavigateToResume = () => {
    setActiveTab("resume");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleJumpToContactSettings = (e: React.MouseEvent) => {
    e.preventDefault();
    setActiveTab("home");
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("open-contact-settings"));
    }
    const el = document.getElementById("resume-contact-settings");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      setTimeout(() => {
        document.getElementById("resume-contact-settings")?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    }
  };

  // Synchronized keyboard navigation across tabs
  const handleTabKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const currentIndex = tabOrder.indexOf(activePillar);
    let nextIndex = -1;

    if (e.key === "ArrowRight") {
      e.preventDefault();
      nextIndex = (currentIndex + 1) % tabOrder.length;
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      nextIndex = (currentIndex - 1 + tabOrder.length) % tabOrder.length;
    } else if (e.key === "Home") {
      e.preventDefault();
      nextIndex = 0;
    } else if (e.key === "End") {
      e.preventDefault();
      nextIndex = tabOrder.length - 1;
    }

    if (nextIndex !== -1) {
      const nextPillar = tabOrder[nextIndex];
      setActivePillar(nextPillar);
      tabRefs.current[nextPillar]?.focus();
    }
  };

  const triggerSimulatedMutation = () => {
    setIsSimulating(true);
    const nextCount = simulatedMutationCount + 1;
    setSimulatedMutationCount(nextCount);
    setMutationStatusMessage(
      `Simulated state mutation #${nextCount} dispatched. Local-first atomic store hydrated across views.`
    );
    setTimeout(() => {
      setIsSimulating(false);
    }, 700);
  };

  // Cadastral Parcel Metadata for GIS tab (Sample Demonstration Data)
  const parcelData = {
    A: {
      id: "SAMPLE-TN-CHE-801",
      bBox: "13.0827° N, 80.2707° E",
      area: "2,400 sq.ft (sample)",
      status: "Cadastral Title Demo",
      zone: "Commercial R-2 (Simulated)",
      hash: "0x8fa3...b71e (Sample)"
    },
    B: {
      id: "SAMPLE-TN-CHE-802",
      bBox: "13.0841° N, 80.2721° E",
      area: "4,850 sq.ft (sample)",
      status: "Boundary Audit Demo",
      zone: "Mixed Density (Simulated)",
      hash: "0x4ce1...a90f (Sample)"
    },
    C: {
      id: "SAMPLE-TN-CHE-803",
      bBox: "13.0815° N, 80.2694° E",
      area: "1,200 sq.ft (sample)",
      status: "Spatial Polygon Demo",
      zone: "Residential Urban (Simulated)",
      hash: "0x7bd2...f338 (Sample)"
    },
    D: {
      id: "SAMPLE-TN-CHE-804",
      bBox: "13.0850° N, 80.2740° E",
      area: "3,600 sq.ft (sample)",
      status: "Encumbrance Check Demo",
      zone: "Civic Zone (Simulated)",
      hash: "0x1ea9...e24b (Sample)"
    }
  };

  // AI Pipeline dynamic metrics (Interactive validation simulation model)
  const calculatedAccuracy = (94.2 - (0.85 - confidenceThreshold) * 4.5).toFixed(1);
  const calculatedF1 = (0.92 - (0.85 - confidenceThreshold) * 0.05).toFixed(2);
  const calculatedLatency = (3.8 + (confidenceThreshold - 0.5) * 1.2).toFixed(1);

  return (
    <section 
      id="hero" 
      aria-label="Engineering Profile Overview"
      className="relative pt-6 pb-12 sm:pt-10 sm:pb-16 lg:pt-14 lg:pb-20 overflow-hidden"
    >
      {/* Persistent polite screen-reader announcement region */}
      <div 
        aria-live="polite" 
        aria-atomic="true" 
        className="sr-only"
      >
        {mutationStatusMessage}
      </div>

      {/* Specular Radial Spotlight: Restrained obsidian atmosphere */}
      <div 
        aria-hidden="true" 
        className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-[380px] pointer-events-none -z-10 overflow-hidden opacity-25 dark:opacity-70"
      >
        <div className="w-full h-full bg-[radial-gradient(ellipse_at_top,rgba(0,210,240,0.04),transparent_68%)]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 sm:space-y-14 lg:space-y-16">
        
        {/* ================= MAIN EDITORIAL STAGE (Dual Wing) ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 xl:gap-14 items-center">
          
          {/* ================= LEFT WING: Identity, Headline & Actions (7 Cols) ================= */}
          <div className="lg:col-span-7 space-y-6 text-left">
            
            {/* Status & Credential Beacon */}
            <div className="flex flex-wrap items-center gap-2.5 text-xs">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-200/50 dark:bg-white/[0.04] border border-slate-300/60 dark:border-white/[0.08] text-slate-800 dark:text-slate-200 text-xs font-medium backdrop-blur-sm shadow-xs">
                <span className="relative flex h-2 w-2" aria-hidden="true">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <span>{state.availability?.badgeText || "Open to Opportunities"}</span>
              </div>

              <span className="text-slate-300 dark:text-slate-700 hidden sm:inline" aria-hidden="true">•</span>

              <div className="inline-flex items-center gap-1.5 text-slate-600 dark:text-slate-400 font-mono text-[11px] tracking-wide uppercase">
                <GraduationCap className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400 shrink-0" aria-hidden="true" />
                <span>
                  {state.tagline || (state.resume?.education?.[0]?.degree || (isBlank ? "Engineering Portfolio" : "M.Tech CSE Scholar"))}
                </span>
              </div>
            </div>

            {/* Dominant Editorial Headline */}
            <div className="space-y-3">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[44px] xl:text-[48px] font-extrabold tracking-[-0.035em] text-slate-900 dark:text-white leading-[1.14] text-balance">
                I turn complex problems into thoughtful digital experiences.
              </h1>
              
              <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-base sm:text-lg font-medium text-slate-700 dark:text-slate-300 tracking-tight">
                <span className="font-semibold text-slate-900 dark:text-white">{state.name || "Tharanesh Selvam"}</span>
                <span className="text-slate-400 dark:text-slate-600 hidden sm:inline" aria-hidden="true">•</span>
                <span className="text-cyan-700 dark:text-cyan-400 font-mono text-sm sm:text-base">
                  {state.title || "Full-Stack Software Engineer & Cloud Architect"}
                </span>
              </div>
            </div>

            {/* Editorial Narrative Subtitle */}
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed max-w-xl font-normal text-pretty">
              {state.elevatorPitch || 
                "M.Tech CSE candidate architecting resilient web platforms, geospatial GIS infrastructure, and end-to-end data pipelines. Driven by clean types, distributed systems, and continuous learning."
              }
            </p>

            {/* Primary & Secondary Actions */}
            <div className="flex flex-wrap items-center gap-3.5 pt-1">
              <button
                type="button"
                onClick={handleNavigateToProjects}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-slate-950 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-950 font-semibold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all duration-200 active:scale-[0.98] group cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-500"
              >
                <span>Explore Selected Work</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
              </button>

              <button
                type="button"
                onClick={handleNavigateToResume}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white hover:bg-slate-50 dark:bg-white/[0.04] dark:hover:bg-white/[0.08] text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-white/[0.1] font-medium text-xs sm:text-sm shadow-xs transition-all duration-200 active:scale-[0.98] cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-500"
              >
                <FileText className="w-4 h-4 text-cyan-600 dark:text-cyan-400" aria-hidden="true" />
                <span>View ATS Resume</span>
              </button>
            </div>

            {/* Contact Coordinates & Direct Channels */}
            <div className="pt-2 flex flex-wrap items-center gap-3.5 text-xs text-slate-500 dark:text-slate-400">
              <button
                type="button"
                onClick={copyEmail}
                className="inline-flex items-center gap-1.5 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer group focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-500 rounded-sm"
                title="Copy verified email to clipboard"
                aria-label="Copy email address"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-500" aria-hidden="true" />
                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Copied!</span>
                  </>
                ) : (
                  <>
                    <Mail className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400 group-hover:scale-110 transition-transform" aria-hidden="true" />
                    <span className="font-mono text-[11px]">{state.contact?.email || "tharanesh.selvam@gmail.com"}</span>
                  </>
                )}
              </button>

              <span className="text-slate-300 dark:text-slate-700 hidden sm:inline" aria-hidden="true">•</span>

              <a
                href={state.contact?.github || "https://github.com/THARANESHSELVAM"}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 hover:text-slate-900 dark:hover:text-white transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-500 rounded-sm"
                aria-label="GitHub Profile (opens in new tab)"
              >
                <GithubIcon className="w-3.5 h-3.5 text-slate-700 dark:text-slate-300" />
                <span>GitHub ↗</span>
              </a>

              <span className="text-slate-300 dark:text-slate-700 hidden sm:inline" aria-hidden="true">•</span>

              <a
                href={state.contact?.linkedin || "https://linkedin.com/in/tharanesh-selvam"}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 hover:text-slate-900 dark:hover:text-white transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-500 rounded-sm"
                aria-label="LinkedIn Profile (opens in new tab)"
              >
                <LinkedinIcon className="w-3.5 h-3.5 text-slate-700 dark:text-slate-300" />
                <span>LinkedIn ↗</span>
              </a>

              <span className="text-slate-300 dark:text-slate-700 hidden sm:inline" aria-hidden="true">•</span>

              <button
                type="button"
                onClick={handleJumpToContactSettings}
                className="text-slate-500 hover:text-cyan-600 dark:text-slate-400 dark:hover:text-cyan-300 font-mono text-[11px] inline-flex items-center gap-1 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-500 rounded-sm"
                aria-label="Jump to ATS contact header coordinates editor"
              >
                <span>Edit Coordinates ↓</span>
              </button>
            </div>

            {/* Core Stack Strip */}
            <div className="pt-1 flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 dark:text-slate-500 mr-1">
                Engineering Pillars:
              </span>
              {[
                { label: "Next.js 16 / React 19", color: "text-sky-700 dark:text-sky-300" },
                { label: "TypeScript", color: "text-blue-700 dark:text-blue-300" },
                { label: "Geospatial GIS & PostGIS", color: "text-emerald-700 dark:text-emerald-300" },
                { label: "AI & Data Pipelines", color: "text-violet-700 dark:text-violet-300" }
              ].map((tech) => (
                <span
                  key={tech.label}
                  className={`px-2.5 py-1 rounded-md bg-slate-100 dark:bg-white/[0.03] border border-slate-200/70 dark:border-white/[0.06] text-[11px] font-mono ${tech.color}`}
                >
                  {tech.label}
                </span>
              ))}
            </div>

          </div>

          {/* ================= RIGHT WING: Interactive Engineering Workstation (5 Cols) ================= */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl p-1 bg-gradient-to-b from-slate-200 via-slate-100 to-slate-200 dark:from-white/[0.12] dark:via-white/[0.04] dark:to-white/[0.02] shadow-xl dark:shadow-2xl">
              <div className="rounded-[14px] bg-slate-950 dark:bg-[#07090e] border border-slate-800 dark:border-white/[0.08] overflow-hidden text-left font-mono">
                
                {/* Workstation Top Navigation Tabs with W3C ARIA Tablist */}
                <div className="px-3.5 py-2.5 bg-slate-900/90 dark:bg-[#05070a] border-b border-slate-800 dark:border-white/[0.06] flex items-center justify-between gap-2">
                  <div 
                    role="tablist"
                    aria-label="Workstation Engineering Modes"
                    onKeyDown={handleTabKeyDown}
                    className="flex items-center gap-1 p-0.5 rounded-lg bg-white/[0.04] border border-white/[0.06] overflow-x-auto"
                  >
                    <button
                      id="workstation-tab-web"
                      role="tab"
                      type="button"
                      aria-selected={activePillar === "web"}
                      aria-controls="workstation-panel-web"
                      tabIndex={activePillar === "web" ? 0 : -1}
                      ref={(el) => { tabRefs.current["web"] = el; }}
                      onClick={() => setActivePillar("web")}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-cyan-400 ${
                        activePillar === "web"
                          ? "bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-xs"
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      Web Engine
                    </button>
                    <button
                      id="workstation-tab-gis"
                      role="tab"
                      type="button"
                      aria-selected={activePillar === "gis"}
                      aria-controls="workstation-panel-gis"
                      tabIndex={activePillar === "gis" ? 0 : -1}
                      ref={(el) => { tabRefs.current["gis"] = el; }}
                      onClick={() => setActivePillar("gis")}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-emerald-400 ${
                        activePillar === "gis"
                          ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 shadow-xs"
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      GIS Spatial
                    </button>
                    <button
                      id="workstation-tab-ai"
                      role="tab"
                      type="button"
                      aria-selected={activePillar === "ai"}
                      aria-controls="workstation-panel-ai"
                      tabIndex={activePillar === "ai" ? 0 : -1}
                      ref={(el) => { tabRefs.current["ai"] = el; }}
                      onClick={() => setActivePillar("ai")}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-violet-400 ${
                        activePillar === "ai"
                          ? "bg-violet-500/15 text-violet-300 border border-violet-500/30 shadow-xs"
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      AI Pipeline
                    </button>
                  </div>

                  <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-mono shrink-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" aria-hidden="true" />
                    <span className="hidden sm:inline">INTERACTIVE SIMULATOR</span>
                  </div>
                </div>

                {/* ================= WORKSTATION BODY: PILLAR 1 (WEB ENGINE) ================= */}
                {activePillar === "web" && (
                  <div 
                    id="workstation-panel-web"
                    role="tabpanel"
                    aria-labelledby="workstation-tab-web"
                    tabIndex={0}
                    className="p-4 sm:p-5 space-y-4 focus-visible:outline-hidden"
                  >
                    <div className="flex items-center justify-between text-[11px] text-slate-300 border-b border-white/[0.06] pb-2">
                      <div className="flex items-center gap-1.5 text-cyan-400 font-semibold">
                        <Globe2 className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>Next.js 16 App Router &amp; State Isolation</span>
                      </div>
                      <span className="text-slate-400 text-[10px] bg-white/[0.04] px-2 py-0.5 rounded">Architecture Model</span>
                    </div>

                    {/* Architectural Pipeline Flow */}
                    <div className="space-y-2 text-[11px]">
                      <div className={`p-2.5 rounded-lg border transition-all ${
                        isSimulating 
                          ? "bg-cyan-950/40 border-cyan-500/50 text-cyan-200" 
                          : "bg-white/[0.02] border-white/[0.06] text-slate-300"
                      }`}>
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-slate-200">1. Client Interaction Event</span>
                          <span className="text-[10px] text-slate-400 font-mono">Simulated Event #{simulatedMutationCount}</span>
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          Atomic Action: <code className="text-cyan-300">UPDATE_PROFILE_COORDINATES</code>
                        </div>
                      </div>

                      <div className="flex justify-center -my-1 text-slate-600" aria-hidden="true">
                        ↓
                      </div>

                      <div className="p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.06] text-slate-300">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-slate-200">2. ProfileContext Atomic Store</span>
                          <span className="text-[10px] text-emerald-400 font-mono">Zero-Loss Fallback</span>
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          Multi-tenant localStorage isolation (<code className="text-teal-300">user_{state.name.toLowerCase().replace(/\s+/g, "_")}</code>)
                        </div>
                      </div>

                      <div className="flex justify-center -my-1 text-slate-600" aria-hidden="true">
                        ↓
                      </div>

                      <div className="p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.06] text-slate-300">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-slate-200">3. Synchronized Re-Render</span>
                          <span className="text-[10px] text-sky-400 font-mono">Target: &lt;14ms</span>
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          Hydrated across Home, ATS Resume &amp; Projects views
                        </div>
                      </div>
                    </div>

                    {/* Interactive Trigger */}
                    <div className="pt-1 flex items-center justify-between gap-3">
                      <button
                        type="button"
                        onClick={triggerSimulatedMutation}
                        disabled={isSimulating}
                        aria-label="Dispatch simulated state mutation across views"
                        className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[11px] font-semibold transition-all cursor-pointer active:scale-95 disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400"
                      >
                        <Play className="w-3 h-3 text-cyan-400" aria-hidden="true" />
                        <span>{isSimulating ? "Simulating Dispatch..." : "Test State Mutation Flow"}</span>
                      </button>

                      <div className="text-[10px] text-slate-400 font-mono text-right shrink-0">
                        Target HMR: <span className="text-slate-300">~20ms</span>
                      </div>
                    </div>

                    <div className="text-[10px] text-slate-400 italic">
                      * Interactive architecture diagram illustrating client-side atomic state propagation.
                    </div>
                  </div>
                )}

                {/* ================= WORKSTATION BODY: PILLAR 2 (GIS SPATIAL — LAND STACK) ================= */}
                {activePillar === "gis" && (
                  <div 
                    id="workstation-panel-gis"
                    role="tabpanel"
                    aria-labelledby="workstation-tab-gis"
                    tabIndex={0}
                    className="p-4 sm:p-5 space-y-3.5 focus-visible:outline-hidden"
                  >
                    <div className="flex items-center justify-between text-[11px] text-slate-300 border-b border-white/[0.06] pb-2">
                      <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                        <Compass className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>Land Stack: Cadastral Boundary Inspector</span>
                      </div>
                      <span className="text-slate-400 text-[10px] bg-white/[0.04] px-2 py-0.5 rounded">Sample PostGIS Dataset</span>
                    </div>

                    {/* Interactive Cadastral Map Visual with Enhanced Accessibility */}
                    <div className="grid grid-cols-2 gap-2 text-center text-[10px]">
                      {(["A", "B", "C", "D"] as const).map((key) => {
                        const isSelected = selectedParcel === key;
                        return (
                          <button
                            key={key}
                            type="button"
                            aria-label={`Select sample parcel ${key}, ${parcelData[key].area}, status: ${parcelData[key].status}`}
                            aria-pressed={isSelected}
                            onClick={() => setSelectedParcel(key)}
                            className={`p-3 rounded-lg border transition-all text-left cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-emerald-400 ${
                              isSelected
                                ? "bg-emerald-950/40 border-emerald-500/60 shadow-xs ring-1 ring-emerald-500/30"
                                : "bg-white/[0.02] border-white/[0.06] hover:border-white/[0.15]"
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className={`font-bold ${isSelected ? "text-emerald-300" : "text-slate-200"}`}>
                                Parcel #{key}
                              </span>
                              {isSelected ? (
                                <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                                  SELECTED
                                </span>
                              ) : (
                                <span className="text-[10px] font-mono text-slate-400">
                                  {parcelData[key].area}
                                </span>
                              )}
                            </div>
                            <div className="text-[10px] font-mono text-slate-300 truncate">
                              {parcelData[key].id}
                            </div>
                            <div className="mt-1 flex items-center gap-1 text-[10px] text-emerald-400">
                              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" aria-hidden="true" />
                              <span className="truncate">{parcelData[key].status}</span>
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    {/* Selected Parcel Telemetry */}
                    <div className="p-2.5 rounded-lg bg-black/40 border border-white/[0.06] text-[10px] space-y-1 text-slate-300 font-mono">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Sample Coordinate:</span>
                        <span className="text-slate-200">{parcelData[selectedParcel].bBox} (Chennai Zone)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Illustrative Hash:</span>
                        <span className="text-teal-300">{parcelData[selectedParcel].hash}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Zoning Designation:</span>
                        <span className="text-slate-300">{parcelData[selectedParcel].zone}</span>
                      </div>
                    </div>

                    <div className="text-[10px] text-slate-400 italic">
                      * Interactive demonstration of Land Stack&apos;s PostGIS spatial indexing &amp; cadastral boundary data structure.
                    </div>
                  </div>
                )}

                {/* ================= WORKSTATION BODY: PILLAR 3 (AI/ML PIPELINE) ================= */}
                {activePillar === "ai" && (
                  <div 
                    id="workstation-panel-ai"
                    role="tabpanel"
                    aria-labelledby="workstation-tab-ai"
                    tabIndex={0}
                    className="p-4 sm:p-5 space-y-3.5 focus-visible:outline-hidden"
                  >
                    <div className="flex items-center justify-between text-[11px] text-slate-300 border-b border-white/[0.06] pb-2">
                      <div className="flex items-center gap-1.5 text-violet-400 font-semibold">
                        <Cpu className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>Interactive Validation Simulation</span>
                      </div>
                      <span className="text-slate-400 text-[10px] bg-white/[0.04] px-2 py-0.5 rounded">Scikit-Learn Concept</span>
                    </div>

                    {/* Pipeline Telemetry Metric Cards */}
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="p-2 rounded-lg bg-white/[0.02] border border-white/[0.06]">
                        <div className="text-[9px] text-slate-400 uppercase font-semibold">Simulated Accuracy</div>
                        <div className="text-base font-extrabold text-violet-300 mt-0.5 font-mono">
                          {calculatedAccuracy}%
                        </div>
                      </div>
                      <div className="p-2 rounded-lg bg-white/[0.02] border border-white/[0.06]">
                        <div className="text-[9px] text-slate-400 uppercase font-semibold">Simulated F1</div>
                        <div className="text-base font-extrabold text-sky-300 mt-0.5 font-mono">
                          {calculatedF1}
                        </div>
                      </div>
                      <div className="p-2 rounded-lg bg-white/[0.02] border border-white/[0.06]">
                        <div className="text-[9px] text-slate-400 uppercase font-semibold">Target Latency</div>
                        <div className="text-base font-extrabold text-emerald-300 mt-0.5 font-mono">
                          ~{calculatedLatency}ms
                        </div>
                      </div>
                    </div>

                    {/* Dynamic Threshold Slider with Full ARIA Metadata */}
                    <div className="space-y-1.5 pt-1">
                      <div className="flex items-center justify-between text-[11px] text-slate-300">
                        <label htmlFor="confidence-threshold-slider" className="cursor-pointer font-medium">
                          Simulated Confidence Threshold:
                        </label>
                        <span className="text-violet-300 font-semibold font-mono">
                          {(confidenceThreshold * 100).toFixed(0)}%
                        </span>
                      </div>
                      <input
                        id="confidence-threshold-slider"
                        type="range"
                        min="0.5"
                        max="0.95"
                        step="0.05"
                        value={confidenceThreshold}
                        onChange={(e) => setConfidenceThreshold(parseFloat(e.target.value))}
                        aria-label="Simulated Decision Confidence Threshold"
                        aria-valuemin={0.5}
                        aria-valuemax={0.95}
                        aria-valuenow={confidenceThreshold}
                        aria-valuetext={`${Math.round(confidenceThreshold * 100)} percent confidence threshold`}
                        className="w-full accent-violet-500 cursor-pointer h-2 bg-slate-800 rounded-lg appearance-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-400"
                      />
                      <div className="text-[10px] text-slate-400 italic">
                        * Moving the slider demonstrates how confidence thresholds shift precision-recall trade-offs.
                      </div>
                    </div>

                    {/* Confusion Matrix Sample Row */}
                    <div className="p-2 rounded-lg bg-black/40 border border-white/[0.06] text-[10px] text-slate-300 font-mono space-y-1">
                      <div className="text-[9px] text-slate-400 uppercase tracking-wider font-semibold">
                        Illustrative Confusion Matrix (Sample Dataset):
                      </div>
                      <div className="flex items-center justify-between">
                        <span>True Positives: <strong className="text-emerald-400">924</strong></span>
                        <span>False Positives: <strong className="text-amber-400">32</strong></span>
                        <span>Precision: <strong className="text-violet-300">0.93</strong></span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Workstation Footer Status Bar */}
                <div className="px-4 py-2 bg-slate-900/70 dark:bg-[#05070a]/90 border-t border-slate-800 dark:border-white/[0.06] flex items-center justify-between text-[10px] text-slate-400 font-mono">
                  <div className="flex items-center gap-2">
                    <Terminal className="w-3 h-3 text-cyan-400" aria-hidden="true" />
                    <span>Architecture Simulator</span>
                    <span className="text-slate-600" aria-hidden="true">•</span>
                    <span className="text-slate-300">Next.js 16</span>
                  </div>
                  <span className="text-slate-400">Illustrative Demonstration</span>
                </div>

              </div>
            </div>
          </div>

        </div>

        {/* ================= EDITORIAL METRICS & EVIDENCE RIBBON ================= */}
        <div className="p-6 sm:p-7 rounded-2xl glass-panel text-left">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-7 divide-y sm:divide-y-0 sm:divide-x divide-slate-200/80 dark:divide-white/[0.08]">
            
            {/* Metric 1: Applied Projects */}
            <div 
              role="button"
              tabIndex={0}
              onClick={handleNavigateToProjects}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleNavigateToProjects();
                }
              }}
              className="sm:pr-4 space-y-1 group cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-500 rounded-xl"
              aria-label={`View ${projectCountDisplay} applied projects`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                  Applied Projects
                </span>
                <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-cyan-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" aria-hidden="true" />
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {projectCountDisplay}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                Full-stack web &amp; cloud builds <span className="text-cyan-600 dark:text-cyan-400 font-medium group-hover:underline">• View all →</span>
              </div>
            </div>

            {/* Metric 2: Technical Skills */}
            <div 
              role="button"
              tabIndex={0}
              onClick={handleNavigateToSkills}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleNavigateToSkills();
                }
              }}
              className="pt-4 sm:pt-0 sm:px-4 space-y-1 group cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-500 rounded-xl"
              aria-label={`View ${skillsCountDisplay} verified technical skills matrix`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                  Technical Skills
                </span>
                <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-cyan-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" aria-hidden="true" />
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {skillsCountDisplay}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                Verified tools &amp; stacks <span className="text-cyan-600 dark:text-cyan-400 font-medium group-hover:underline">• View matrix →</span>
              </div>
            </div>

            {/* Metric 3: Core Domains */}
            <div className="pt-4 sm:pt-0 sm:px-4 space-y-1">
              <div className="text-xs font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Core Domains
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {activeDomainsCount}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                Web Systems, GIS &amp; Applied AI
              </div>
            </div>

            {/* Metric 4: Continuous Learning as Craft */}
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

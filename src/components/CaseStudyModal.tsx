"use client";

import { useEffect, useState, useMemo } from "react";
import { Project } from "@/data/profile";
import { 
  X, 
  ExternalLink, 
  Cpu, 
  AlertTriangle, 
  Lightbulb, 
  ArrowLeftRight, 
  CheckCircle2, 
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Copy,
  Check,
  Target,
  Layers,
  Zap,
  TrendingUp,
  Terminal,
  ShieldAlert,
  ShieldCheck,
  Code2,
  Workflow,
  Edit3
} from "lucide-react";
import { GithubIcon } from "@/components/Icons";

interface CaseStudyModalProps {
  project: Project | null;
  projects?: Project[];
  isOpen: boolean;
  onClose: () => void;
  onSelectProject?: (project: Project) => void;
  onEditProject?: (project: Project) => void;
}

export function CaseStudyModal({ 
  project, 
  projects = [], 
  isOpen, 
  onClose,
  onSelectProject,
  onEditProject 
}: CaseStudyModalProps) {
  const [activeTab, setActiveTab] = useState<string>("all");
  const [copiedSummary, setCopiedSummary] = useState(false);
  const [copiedDiagram, setCopiedDiagram] = useState(false);

  // Find index of current project for Next/Prev navigation
  const currentIndex = useMemo(() => {
    if (!project || projects.length === 0) return -1;
    return projects.findIndex((p) => p.id === project.id);
  }, [project, projects]);

  const prevProject = currentIndex > 0 ? projects[currentIndex - 1] : null;
  const nextProject = currentIndex >= 0 && currentIndex < projects.length - 1 ? projects[currentIndex + 1] : null;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft" && prevProject && onSelectProject) {
        onSelectProject(prevProject);
      }
      if (e.key === "ArrowRight" && nextProject && onSelectProject) {
        onSelectProject(nextProject);
      }
    };

    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose, prevProject, nextProject, onSelectProject]);

  // Reset tab to "all" when project changes
  useEffect(() => {
    setActiveTab("all");
  }, [project?.id]);

  if (!isOpen || !project) return null;

  const caseStudy = project.caseStudy || {
    overview: project.solution,
    projectUse: project.domainTag,
    targetUsers: "Engineers, Architects & Engineering Leaders",
    problemStatement: project.problemSolved,
    expertSolution: project.solution,
    novelty: `Engineered an optimized implementation utilizing ${project.techStack.slice(0, 3).join(", ")} to solve the core performance bottleneck.`,
    noveltyHighlights: [
      `Custom architectural design in ${project.techStack[0]}`,
      "Zero-latency state synchronization and decoupled pipelines",
      "Measurable enterprise performance optimization"
    ],
    keyFeatures: [
      "Enterprise reliability and resilience",
      "Real-time monitoring and telemetry",
      "High-throughput concurrency handling"
    ],
    architectureNotes: "Client -> Application Gateway -> Microservice Layer -> Persistence / Event Log.",
    benchmarks: [],
    techStackRationale: project.techStack.map(t => ({
      name: t,
      role: "Core Technology",
      reason: `Selected for its industry-standard performance and scalability characteristics.`
    })),
    tradeoffs: ["Selected modern asynchronous design for high-throughput concurrency."],
    challenges: ["Maintaining low latency under peak concurrency."],
    keyLearnings: ["Decoupled microservices improve fault isolation."]
  };

  const handleCopySummary = () => {
    const text = `
PROJECT CASE STUDY: ${project.title}
Domain: ${project.domainTag}
Stack: ${project.techStack.join(", ")}

1. PRACTICAL USE & TARGET AUDIENCE:
${caseStudy.projectUse || caseStudy.overview}
Target Users: ${caseStudy.targetUsers || "Software Architects & Engineers"}

2. PROBLEM STATEMENT:
${caseStudy.problemStatement || project.problemSolved}

3. SOLVED EXPERT SOLUTION:
${caseStudy.expertSolution || project.solution}

4. NOVELTY & HOW I SOLVED THIS PROBLEM:
${caseStudy.novelty || caseStudy.overview}

5. KEY PERFORMANCE BENCHMARKS:
${project.metrics.join("\n")}
    `.trim();

    navigator.clipboard.writeText(text);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2200);
  };

  const handleCopyDiagram = () => {
    if (!caseStudy.architectureDiagram) return;
    navigator.clipboard.writeText(caseStudy.architectureDiagram);
    setCopiedDiagram(true);
    setTimeout(() => setCopiedDiagram(false), 2200);
  };

  const tabs = [
    { id: "all", label: "Full Deep Dive", icon: Layers },
    { id: "use", label: "Use Case & Purpose", icon: Target },
    { id: "problem", label: "Problem Statement", icon: AlertTriangle },
    { id: "solution", label: "Expert Architecture", icon: Cpu },
    { id: "novelty", label: "Novelty & Breakthrough", icon: Sparkles },
    { id: "benchmarks", label: "Impact & Benchmarks", icon: TrendingUp },
    { id: "tradeoffs", label: "Tradeoffs & Lessons", icon: ArrowLeftRight },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog Card */}
      <div className="relative w-full max-w-5xl max-h-[92vh] flex flex-col glass-panel bg-white/95 dark:bg-slate-900/95 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl z-10 text-slate-900 dark:text-white overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Sticky Header */}
        <div className="p-5 sm:p-6 border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  {project.domainTag}
                </span>
                {project.featured && (
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                    ★ Featured Architecture
                  </span>
                )}
                <span className="text-xs text-slate-400 font-mono hidden md:inline">
                  • Architectural Deep Dive &amp; Engineering Breakdown
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                {project.title}
              </h2>
            </div>

            {/* Header Action Controls */}
            <div className="flex items-center gap-2 self-end sm:self-center">
              {/* Project Navigation Switcher */}
              {projects.length > 1 && onSelectProject && (
                <div className="hidden sm:flex items-center bg-slate-100 dark:bg-slate-800/80 rounded-xl p-1 border border-slate-200 dark:border-slate-700">
                  <button
                    type="button"
                    onClick={() => prevProject && onSelectProject(prevProject)}
                    disabled={!prevProject}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    title={prevProject ? `Previous: ${prevProject.title}` : "First project"}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="text-[11px] font-mono px-2 text-slate-400">
                    {currentIndex + 1} / {projects.length}
                  </span>
                  <button
                    type="button"
                    onClick={() => nextProject && onSelectProject(nextProject)}
                    disabled={!nextProject}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    title={nextProject ? `Next: ${nextProject.title}` : "Last project"}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Edit Project Action Button */}
              {onEditProject && (
                <button
                  type="button"
                  onClick={() => onEditProject(project)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 border border-slate-700/60 shadow-sm transition-colors"
                  title="Edit this project's architecture, problem statement, metrics, and tech stack"
                >
                  <Edit3 className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Edit Project</span>
                </button>
              )}

              {/* Copy Interview Summary Button */}
              <button
                type="button"
                onClick={handleCopySummary}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold glass-panel text-slate-700 dark:text-slate-300 hover:text-cyan-400 border border-slate-200 dark:border-slate-700 transition-colors"
                title="Copy structured summary to clipboard for interview / recruiter briefing"
              >
                {copiedSummary ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                    <span className="text-emerald-600 dark:text-emerald-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-400" />
                    <span className="hidden md:inline">Copy Summary</span>
                  </>
                )}
              </button>

              {/* Close Button */}
              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Tab Navigation Pill Bar */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 no-scrollbar text-xs font-medium">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all whitespace-nowrap shrink-0 ${
                    isActive
                      ? "bg-gradient-to-r from-teal-400 to-cyan-500 text-slate-950 font-bold shadow-sm shadow-cyan-500/25"
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/80"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-8 space-y-8">

          {/* =========================================================================
              SECTION 1: PRACTICAL USE & TARGET AUDIENCE ("and its use")
              ========================================================================= */}
          {(activeTab === "all" || activeTab === "use") && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-bold tracking-tight text-slate-900 dark:text-white uppercase font-mono">
                <Target className="w-4 h-4 text-cyan-400" />
                <span>1. Practical Use Case &amp; Real-World Value</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2 p-5 rounded-2xl bg-cyan-50/70 dark:bg-cyan-500/10 border border-cyan-200 dark:border-cyan-500/20 space-y-3">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-cyan-700 dark:text-cyan-400 font-bold block">
                    Core Mission &amp; Operational Workflow
                  </span>
                  <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                    {caseStudy.projectUse || caseStudy.overview}
                  </p>
                  {caseStudy.overview && caseStudy.projectUse && (
                    <p className="text-xs text-slate-600 dark:text-slate-400 pt-1 border-t border-cyan-200/60 dark:border-cyan-500/10 leading-relaxed">
                      {caseStudy.overview}
                    </p>
                  )}
                </div>

                <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-3">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold block">
                    Target Users &amp; Stakeholders
                  </span>
                  <p className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 leading-relaxed">
                    {caseStudy.targetUsers || "Platform Engineers, System Architects, DevOps, Engineering Leadership."}
                  </p>
                  
                  <div className="pt-2 border-t border-slate-200 dark:border-slate-700/60">
                    <span className="text-[10px] font-mono uppercase text-slate-400 block mb-1">
                      System Class
                    </span>
                    <span className="inline-block px-2.5 py-1 rounded-lg text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300">
                      Enterprise Tier-1 Production
                    </span>
                  </div>
                </div>
              </div>

              {/* Key Features Pill Matrix */}
              {caseStudy.keyFeatures && caseStudy.keyFeatures.length > 0 && (
                <div className="p-4 rounded-2xl bg-slate-100/60 dark:bg-slate-800/30 border border-slate-200/80 dark:border-slate-800 space-y-2.5">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold block">
                    Standout Platform Capabilities
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                    {caseStudy.keyFeatures.map((feat, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300 font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* =========================================================================
              SECTION 2: PROBLEM STATEMENT & ROOT CAUSE ANALYSIS ("problem statement")
              ========================================================================= */}
          {(activeTab === "all" || activeTab === "problem") && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-bold tracking-tight text-slate-900 dark:text-white uppercase font-mono">
                <AlertTriangle className="w-4 h-4 text-rose-500" />
                <span>2. The Problem Statement &amp; Production Bottleneck</span>
              </div>

              <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-rose-500/10 via-amber-500/5 to-transparent border border-rose-500/20 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-rose-700 dark:text-rose-400 font-bold text-xs uppercase tracking-wider">
                    <ShieldAlert className="w-4 h-4 text-rose-500" />
                    <span>Why Existing / Legacy Solutions Failed</span>
                  </div>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                    High Business Risk
                  </span>
                </div>

                <p className="text-sm sm:text-base text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                  {caseStudy.problemStatement || project.problemSolved}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  <div className="p-3 rounded-xl bg-white/60 dark:bg-slate-950/40 border border-rose-500/15">
                    <span className="text-[10px] font-mono uppercase text-slate-400 block mb-1">
                      System Symptom
                    </span>
                    <span className="text-xs font-semibold text-rose-600 dark:text-rose-400">
                      Latency Spikes &amp; Packet Queuing
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-white/60 dark:bg-slate-950/40 border border-rose-500/15">
                    <span className="text-[10px] font-mono uppercase text-slate-400 block mb-1">
                      Failure Mode
                    </span>
                    <span className="text-xs font-semibold text-amber-600 dark:text-amber-400">
                      Thread Starvation &amp; Cascade
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-white/60 dark:bg-slate-950/40 border border-rose-500/15">
                    <span className="text-[10px] font-mono uppercase text-slate-400 block mb-1">
                      Financial / User Cost
                    </span>
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Severe SLA Violations &amp; Churn
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              SECTION 3: SOLVED EXPERT SOLUTION & ARCHITECTURE ("solved expert solution")
              ========================================================================= */}
          {(activeTab === "all" || activeTab === "solution") && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-bold tracking-tight text-slate-900 dark:text-white uppercase font-mono">
                <Cpu className="w-4 h-4 text-cyan-400" />
                <span>3. Solved Expert Architecture &amp; Mechanics</span>
              </div>

              <div className="p-5 sm:p-6 rounded-2xl bg-cyan-50/70 dark:bg-cyan-500/10 border border-cyan-200 dark:border-cyan-500/20 space-y-3">
                <div className="flex items-center gap-2 text-cyan-700 dark:text-cyan-400 font-bold text-xs uppercase tracking-wider">
                  <Workflow className="w-4 h-4" />
                  <span>Technical Design &amp; Architectural Blueprint</span>
                </div>
                <p className="text-sm sm:text-base text-slate-800 dark:text-slate-200 leading-relaxed">
                  {caseStudy.expertSolution || project.solution}
                </p>
                <div className="text-xs text-slate-600 dark:text-slate-400 pt-2 border-t border-cyan-200/60 dark:border-cyan-500/10">
                  <strong className="text-cyan-700 dark:text-cyan-400 font-semibold">End-to-End Pipeline: </strong>
                  {caseStudy.architectureNotes}
                </div>
              </div>

              {/* ASCII Interactive Architecture Diagram */}
              {caseStudy.architectureDiagram && (
                <div className="relative rounded-2xl bg-slate-950 p-4 sm:p-5 border border-slate-800 text-cyan-300 font-mono text-xs leading-relaxed shadow-xl overflow-hidden">
                  <div className="flex items-center justify-between text-[11px] text-slate-400 border-b border-slate-800 pb-2.5 mb-3">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" />
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
                      <span className="ml-2 font-mono text-slate-300">system-topology-blueprint.txt</span>
                    </span>
                    
                    <button
                      type="button"
                      onClick={handleCopyDiagram}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-[10px] text-slate-300 transition-colors"
                      title="Copy ASCII Architecture Diagram"
                    >
                      {copiedDiagram ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span className="text-emerald-400">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy Diagram</span>
                        </>
                      )}
                    </button>
                  </div>
                  <pre className="font-mono overflow-x-auto p-1 leading-relaxed text-[11px] sm:text-xs">
                    {caseStudy.architectureDiagram}
                  </pre>
                </div>
              )}
            </div>
          )}

          {/* =========================================================================
              SECTION 4: NOVELTY & "HOW I SOLVED THIS PROBLEM" ("novality (how i solved this problem )")
              ========================================================================= */}
          {(activeTab === "all" || activeTab === "novelty") && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-bold tracking-tight text-slate-900 dark:text-white uppercase font-mono">
                <Sparkles className="w-4 h-4 text-violet-500" />
                <span>4. Novelty &amp; Innovation: How I Solved This Problem</span>
              </div>

              {/* VIP Breakthrough Card */}
              <div className="relative p-6 sm:p-7 rounded-3xl bg-indigo-50/70 border-2 border-indigo-200 text-slate-900 dark:bg-gradient-to-br dark:from-indigo-950 dark:via-slate-900 dark:to-slate-950 dark:text-white dark:border-indigo-500/40 shadow-xl shadow-indigo-500/5 dark:shadow-indigo-500/10 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-indigo-200 dark:border-indigo-500/30 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 rounded-lg bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-cyan-400 border border-indigo-200 dark:border-indigo-500/30">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xs font-mono font-bold tracking-wider text-indigo-700 dark:text-cyan-400 uppercase">
                        The Core Engineering Secret Sauce
                      </span>
                      <h4 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                        Unique Technical Breakthrough
                      </h4>
                    </div>
                  </div>

                  <span className="px-3 py-1 rounded-full text-[11px] font-mono font-bold bg-indigo-100 text-indigo-800 dark:bg-cyan-500/20 dark:text-cyan-300 border border-indigo-200 dark:border-cyan-500/30">
                    Bespoke Innovation
                  </span>
                </div>

                <p className="text-sm sm:text-base text-slate-700 dark:text-slate-200 leading-relaxed font-medium">
                  {caseStudy.novelty || caseStudy.overview}
                </p>

                {/* Novelty Highlight Bullets */}
                {caseStudy.noveltyHighlights && caseStudy.noveltyHighlights.length > 0 && (
                  <div className="pt-2 space-y-2">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-indigo-800 dark:text-indigo-300 font-semibold block">
                      Key Technical Innovations Implemented:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {caseStudy.noveltyHighlights.map((highlight, idx) => (
                        <div
                          key={idx}
                          className="flex items-start gap-2.5 p-3 rounded-xl bg-white dark:bg-white/5 border border-indigo-200 dark:border-indigo-500/20 text-xs sm:text-sm text-slate-800 dark:text-slate-200 shadow-sm"
                        >
                          <Zap className="w-4 h-4 text-indigo-600 dark:text-cyan-400 shrink-0 mt-0.5" />
                          <span>{highlight}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* =========================================================================
              SECTION 5: QUANTIFIABLE IMPACT & BENCHMARKS ("extra stuff...")
              ========================================================================= */}
          {(activeTab === "all" || activeTab === "benchmarks") && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-bold tracking-tight text-slate-900 dark:text-white uppercase font-mono">
                <TrendingUp className="w-4 h-4 text-emerald-500" />
                <span>5. Quantifiable Impact &amp; Before vs. After Benchmarks</span>
              </div>

              {/* Verified Metrics Hero Block */}
              <div className="p-5 sm:p-6 rounded-2xl bg-slate-100 border border-slate-200 text-slate-900 dark:bg-gradient-to-r dark:from-slate-950 dark:to-slate-900 dark:border-slate-800 dark:text-white space-y-3">
                <span className="text-[11px] font-mono uppercase tracking-wider text-cyan-700 dark:text-cyan-400 font-bold block">
                  Production Verified Results
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {project.metrics.map((metric, i) => (
                    <div
                      key={i}
                      className="bg-white dark:bg-white/5 p-3 rounded-xl border border-slate-200 dark:border-white/10 text-xs sm:text-sm font-semibold flex items-center gap-2 text-slate-800 dark:text-white shadow-sm"
                    >
                      <span>{metric}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Before vs After Benchmark Comparison Table / Cards */}
              {caseStudy.benchmarks && caseStudy.benchmarks.length > 0 && (
                <div className="space-y-2">
                  <span className="text-xs font-mono uppercase text-slate-500 dark:text-slate-400 tracking-wider block">
                    Telemetry Benchmark Delta (Measured Before vs. After)
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {caseStudy.benchmarks.map((bm, i) => (
                      <div
                        key={i}
                        className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-2"
                      >
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block truncate">
                          {bm.metric}
                        </span>
                        
                        <div className="flex items-center justify-between text-xs font-mono">
                          <div className="text-slate-400">
                            <span className="block text-[10px] uppercase">Before</span>
                            <span className="font-semibold text-rose-500 dark:text-rose-400">{bm.before}</span>
                          </div>
                          <span className="text-slate-400">→</span>
                          <div className="text-right">
                            <span className="block text-[10px] uppercase">After</span>
                            <span className="font-bold text-emerald-600 dark:text-emerald-400">{bm.after}</span>
                          </div>
                        </div>

                        <div className="pt-1.5 border-t border-slate-200 dark:border-slate-700/60 flex items-center justify-between">
                          <span className="text-[10px] font-mono text-slate-400 uppercase">Delta</span>
                          <span className="px-2 py-0.5 rounded-md text-[11px] font-mono font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                            {bm.improvement}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* =========================================================================
              SECTION 6: ARCHITECTURAL TRADEOFFS & CRITICAL DECISIONS
              ========================================================================= */}
          {(activeTab === "all" || activeTab === "tradeoffs") && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-bold tracking-tight text-slate-900 dark:text-white uppercase font-mono">
                <ArrowLeftRight className="w-4 h-4 text-indigo-500" />
                <span>6. Architectural Trade-offs &amp; Hard Engineering Decisions</span>
              </div>

              {caseStudy.tradeoffs && caseStudy.tradeoffs.length > 0 && (
                <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-3">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-cyan-400 font-semibold block">
                    Evaluated Trade-offs (CAP Theorem / Latency vs. Storage / CPU Overhead)
                  </span>
                  <ul className="space-y-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                    {caseStudy.tradeoffs.map((item, i) => (
                      <li key={i} className="flex items-start gap-2.5">
                        <span className="w-2 h-2 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Challenges & Learnings Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 sm:p-5 rounded-2xl bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/20 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Real-World Edge Cases Encountered</span>
                  </div>
                  <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
                    {caseStudy.challenges.map((c, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-amber-500 font-bold">•</span>
                        <span>{c}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 sm:p-5 rounded-2xl bg-lime-500/5 dark:bg-cyan-500/10 border border-cyan-500/20 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-cyan-400">
                    <Lightbulb className="w-4 h-4" />
                    <span>Key Architectural Lessons Learned</span>
                  </div>
                  <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
                    {caseStudy.keyLearnings.map((l, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-cyan-400 font-bold">•</span>
                        <span>{l}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              SECTION 7: TECH STACK RATIONALE ("why this tech?")
              ========================================================================= */}
          {(activeTab === "all" || activeTab === "solution" || activeTab === "tradeoffs") && (
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-2 text-sm font-bold tracking-tight text-slate-900 dark:text-white uppercase font-mono">
                <Code2 className="w-4 h-4 text-cyan-400" />
                <span>7. Technology Stack &amp; Architectural Rationale</span>
              </div>

              {caseStudy.techStackRationale && caseStudy.techStackRationale.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {caseStudy.techStackRationale.map((tech, i) => (
                    <div
                      key={i}
                      className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-cyan-400">
                          {tech.name}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400 uppercase">
                          {tech.role}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                        {tech.reason}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {project.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1.5 rounded-xl text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>

        {/* Modal Sticky Footer Bar */}
        <div className="p-4 sm:p-5 border-t border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-teal-400 to-cyan-500 hover:from-teal-300 hover:to-cyan-400 text-slate-950 font-bold shadow-sm shadow-cyan-500/25 transition-all active:scale-95"
              >
                <span>Live Demo</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}

            {project.repoUrl && (
              <a
                href={project.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold glass-panel text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700 transition-colors"
              >
                <GithubIcon className="w-3.5 h-3.5" />
                <span>Source Code</span>
              </a>
            )}

            {/* Quick Switch Buttons for Mobile */}
            {projects.length > 1 && onSelectProject && (
              <div className="flex sm:hidden items-center bg-slate-100 dark:bg-slate-800 rounded-xl p-1 border border-slate-200 dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => prevProject && onSelectProject(prevProject)}
                  disabled={!prevProject}
                  className="p-1 rounded text-slate-500 disabled:opacity-30"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-[10px] font-mono px-1.5 text-slate-400">
                  {currentIndex + 1}/{projects.length}
                </span>
                <button
                  type="button"
                  onClick={() => nextProject && onSelectProject(nextProject)}
                  disabled={!nextProject}
                  className="p-1 rounded text-slate-500 disabled:opacity-30"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopySummary}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-cyan-400 transition-colors"
            >
              {copiedSummary ? "✓ Copied Summary" : "Copy Brief"}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-white transition-colors"
            >
              Close
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

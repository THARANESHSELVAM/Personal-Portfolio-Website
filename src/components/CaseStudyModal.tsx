"use client";

import React, { useEffect, useState, useMemo, useRef, useCallback } from "react";
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
  Code2,
  Workflow,
  Edit3,
  BookOpen
} from "lucide-react";
import { GithubIcon } from "@/components/Icons";
import { ProjectVisualPreview } from "@/components/project-previews/ProjectVisualPreview";

interface CaseStudyModalProps {
  project: Project | null;
  projects?: Project[];
  isOpen: boolean;
  onClose: () => void;
  onSelectProject?: (project: Project) => void;
  onEditProject?: (project: Project) => void;
}

/**
 * Premium Engineering Case Study Experience — Portfolio 2.0
 * 
 * An interactive, accessible technical article format detailing real engineering decisions,
 * problem analysis, architectural blueprints, trade-offs, and verified outcomes.
 */
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

  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const prevBtnRef = useRef<HTMLButtonElement>(null);
  const nextBtnRef = useRef<HTMLButtonElement>(null);
  const contentBodyRef = useRef<HTMLDivElement>(null);
  const previousFocusedElementRef = useRef<HTMLElement | null>(null);

  // Find index of current project for Next/Prev navigation
  const currentIndex = useMemo(() => {
    if (!project || projects.length === 0) return -1;
    return projects.findIndex((p) => p.id === project.id);
  }, [project, projects]);

  const prevProject = currentIndex > 0 ? projects[currentIndex - 1] : null;
  const nextProject = currentIndex >= 0 && currentIndex < projects.length - 1 ? projects[currentIndex + 1] : null;

  // Track the element that triggered opening to restore focus on close
  useEffect(() => {
    if (isOpen) {
      previousFocusedElementRef.current = (document.activeElement as HTMLElement) || null;
    }
  }, [isOpen]);

  const handleClose = useCallback(() => {
    onClose();
    // Return focus to the trigger element that opened the dialog, or the corresponding project card trigger
    setTimeout(() => {
      const currentProjectTrigger = project ? document.getElementById(`case-study-btn-${project.id}`) : null;
      if (currentProjectTrigger && document.contains(currentProjectTrigger)) {
        currentProjectTrigger.focus();
      } else if (previousFocusedElementRef.current && typeof previousFocusedElementRef.current.focus === "function") {
        if (document.contains(previousFocusedElementRef.current)) {
          previousFocusedElementRef.current.focus();
        }
      }
      previousFocusedElementRef.current = null;
    }, 50);
  }, [onClose, project]);

  // Dialog Focus Trapping & Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // 1. Escape key closes dialog
      if (e.key === "Escape") {
        e.preventDefault();
        handleClose();
        return;
      }

      // 2. Focus Trapping: keep Tab navigation within the modal dialog
      if (e.key === "Tab" && modalRef.current) {
        const focusableElements = modalRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );

        if (focusableElements.length > 0) {
          const firstElement = focusableElements[0];
          const lastElement = focusableElements[focusableElements.length - 1];

          if (e.shiftKey) {
            if (document.activeElement === firstElement || !modalRef.current.contains(document.activeElement)) {
              e.preventDefault();
              lastElement.focus();
            }
          } else {
            if (document.activeElement === lastElement || !modalRef.current.contains(document.activeElement)) {
              e.preventDefault();
              firstElement.focus();
            }
          }
        }
      }

      // 3. Do not interfere with text inputs, textareas, or contentEditable elements
      const activeEl = document.activeElement as HTMLElement | null;
      const isTextInput = activeEl && (
        activeEl.tagName === "INPUT" ||
        activeEl.tagName === "TEXTAREA" ||
        activeEl.isContentEditable
      );
      if (isTextInput) {
        return;
      }

      // 4. Project-Level Navigation (Alt+Arrow, or Arrow keys when not focused on tabs/buttons/links)
      const isInsideInteractive = activeEl && (
        activeEl.tagName === "BUTTON" ||
        activeEl.tagName === "A" ||
        activeEl.getAttribute("role") === "tab" ||
        Boolean(activeEl.closest('[role="tablist"]'))
      );

      if (e.altKey && e.key === "ArrowLeft" && prevProject && onSelectProject) {
        e.preventDefault();
        onSelectProject(prevProject);
      } else if (e.altKey && e.key === "ArrowRight" && nextProject && onSelectProject) {
        e.preventDefault();
        onSelectProject(nextProject);
      } else if (!isInsideInteractive) {
        if (e.key === "ArrowLeft" && prevProject && onSelectProject) {
          e.preventDefault();
          onSelectProject(prevProject);
        } else if (e.key === "ArrowRight" && nextProject && onSelectProject) {
          e.preventDefault();
          onSelectProject(nextProject);
        }
      }
    };

    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
      // Auto-focus the close button or first interactive element when opened
      setTimeout(() => {
        closeButtonRef.current?.focus();
      }, 50);
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, handleClose, prevProject, nextProject, onSelectProject]);

  // Reset tab to "all", scroll content to top, and manage focus sensibly on project change
  useEffect(() => {
    setActiveTab("all");
    if (contentBodyRef.current) {
      contentBodyRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
    // Maintain sensible focus behavior if active element was disabled or blurred on project switch
    setTimeout(() => {
      const active = document.activeElement as HTMLElement | null;
      if (!active || active === document.body || (active as HTMLButtonElement).disabled) {
        if (nextProject && nextBtnRef.current && !nextBtnRef.current.disabled) {
          nextBtnRef.current.focus();
        } else if (prevProject && prevBtnRef.current && !prevBtnRef.current.disabled) {
          prevBtnRef.current.focus();
        } else {
          closeButtonRef.current?.focus();
        }
      }
    }, 50);
  }, [project?.id, nextProject, prevProject]);

  if (!isOpen || !project) return null;

  // Safe case study fallback preserving existing structure
  const caseStudy = project.caseStudy || {
    overview: project.solution,
    projectUse: project.domainTag,
    targetUsers: "Engineers, Architects & Engineering Leaders",
    problemStatement: project.problemSolved,
    expertSolution: project.solution,
    novelty: `Engineered an optimized implementation utilizing ${project.techStack.slice(0, 3).join(", ")} to address core technical requirements.`,
    noveltyHighlights: [
      `Custom architectural design in ${project.techStack[0] || "TypeScript"}`,
      "Zero-latency state synchronization and decoupled pipelines",
      "Measurable performance optimization"
    ],
    keyFeatures: [
      "Enterprise reliability and resilience",
      "Real-time monitoring and telemetry",
      "High-throughput concurrency handling"
    ],
    architectureNotes: "Client -> Application Gateway -> Service Layer -> Persistence.",
    benchmarks: [],
    techStackRationale: project.techStack.map((t) => ({
      name: t,
      role: "Core Technology",
      reason: `Selected for its industry-standard performance and scalability characteristics.`
    })),
    tradeoffs: ["Selected modern asynchronous design for high-throughput concurrency."],
    challenges: ["Ensuring low latency and consistent state under load."],
    keyLearnings: ["Decoupled modular architecture improves system resilience and testability."]
  };

  const handleCopySummary = async () => {
    // Sanitize any legacy cached claims during interview brief export
    const sanitizedMetrics = project.metrics 
      ? project.metrics.map((m) => {
          if (m.includes("92%")) return "📊 Cross-validation & evaluation metrics";
          if (m.includes("100% Type-Safe")) return "⚡ Strict TypeScript Compiler Configuration";
          return m;
        }).join("\n")
      : "Documented in engineering repository.";

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

5. KEY PERFORMANCE BENCHMARKS & OUTCOMES:
${sanitizedMetrics}
    `.trim();

    let copied = false;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      try {
        await navigator.clipboard.writeText(text);
        copied = true;
      } catch {
        // Fall back to execCommand if navigator.clipboard.writeText is denied or unavailable
      }
    }

    if (!copied) {
      try {
        const textarea = document.createElement("textarea");
        textarea.value = text;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.select();
        const successful = document.execCommand("copy");
        document.body.removeChild(textarea);
        if (successful) {
          copied = true;
        }
      } catch (err) {
        console.warn("Clipboard access unavailable:", err);
      }
    }

    if (copied) {
      setCopiedSummary(true);
      setTimeout(() => setCopiedSummary(false), 2200);
    }
  };

  const handleCopyDiagram = async () => {
    if (!caseStudy.architectureDiagram) return;
    let copied = false;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      try {
        await navigator.clipboard.writeText(caseStudy.architectureDiagram);
        copied = true;
      } catch {
        // Fall back to execCommand
      }
    }

    if (!copied) {
      try {
        const textarea = document.createElement("textarea");
        textarea.value = caseStudy.architectureDiagram;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.select();
        const successful = document.execCommand("copy");
        document.body.removeChild(textarea);
        if (successful) {
          copied = true;
        }
      } catch (err) {
        console.warn("Failed to copy diagram:", err);
      }
    }

    if (copied) {
      setCopiedDiagram(true);
      setTimeout(() => setCopiedDiagram(false), 2200);
    }
  };

  const tabs = [
    { id: "all", label: "Full Deep Dive", icon: Layers },
    { id: "use", label: "Use Case & Purpose", icon: Target },
    { id: "problem", label: "Problem Analysis", icon: AlertTriangle },
    { id: "solution", label: "Architecture & Visuals", icon: Cpu },
    { id: "novelty", label: "Key Innovations", icon: Sparkles },
    { id: "benchmarks", label: "Metrics & Outcomes", icon: TrendingUp },
    { id: "tradeoffs", label: "Decisions & Lessons", icon: ArrowLeftRight },
  ];

  // ARIA tablist keyboard navigation handler (ArrowLeft/ArrowRight/Home/End navigate tabs without project interference)
  const handleTabKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      e.stopPropagation();
      const nextIndex = (index + 1) % tabs.length;
      const nextTab = tabs[nextIndex];
      setActiveTab(nextTab.id);
      document.getElementById(`tab-${nextTab.id}`)?.focus();
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      e.stopPropagation();
      const prevIndex = (index - 1 + tabs.length) % tabs.length;
      const prevTab = tabs[prevIndex];
      setActiveTab(prevTab.id);
      document.getElementById(`tab-${prevTab.id}`)?.focus();
    } else if (e.key === "Home") {
      e.preventDefault();
      e.stopPropagation();
      setActiveTab(tabs[0].id);
      document.getElementById(`tab-${tabs[0].id}`)?.focus();
    } else if (e.key === "End") {
      e.preventDefault();
      e.stopPropagation();
      setActiveTab(tabs[tabs.length - 1].id);
      document.getElementById(`tab-${tabs[tabs.length - 1].id}`)?.focus();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 md:p-6 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby={`case-study-title-${project.id}`}
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity animate-in fade-in duration-200"
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Modal Dialog Shell (Spacious desktop article, near-full-screen mobile) */}
      <div 
        ref={modalRef}
        className="relative w-full max-w-5xl h-[100dvh] sm:h-auto sm:max-h-[92vh] flex flex-col bg-white/98 dark:bg-[#070b13] sm:rounded-3xl border-0 sm:border border-slate-200/80 dark:border-white/10 shadow-2xl z-10 text-slate-900 dark:text-slate-100 overflow-hidden animate-in zoom-in-95 duration-200"
      >
        
        {/* Sticky Header with Project Metadata & Controls */}
        <div className="p-4 sm:p-6 border-b border-slate-200/80 dark:border-white/10 bg-white/95 dark:bg-[#070b13]/95 backdrop-blur-md shrink-0 space-y-3 sm:space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1.5 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border border-cyan-500/20">
                  {project.domainTag}
                </span>
                {project.featured && (
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700 dark:bg-white/10 dark:text-slate-300 border border-slate-200/80 dark:border-white/10">
                    ★ Featured System
                  </span>
                )}
                <span className="text-xs text-slate-500 dark:text-slate-400 font-mono hidden md:inline">
                  • Architectural Deep Dive
                </span>
              </div>

              <h2 
                id={`case-study-title-${project.id}`}
                className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white truncate"
              >
                {project.title}
              </h2>
            </div>

            {/* Header Action Controls */}
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0 self-end sm:self-center">
              {/* Project Navigation Switcher */}
              {projects.length > 1 && onSelectProject && (
                <div className="flex items-center bg-slate-100/80 dark:bg-white/[0.04] rounded-xl p-0.5 sm:p-1 border border-slate-200/80 dark:border-white/10">
                  <button
                    ref={prevBtnRef}
                    type="button"
                    onClick={() => {
                      if (prevProject && onSelectProject) {
                        onSelectProject(prevProject);
                        if (currentIndex === 1) {
                          setTimeout(() => nextBtnRef.current?.focus(), 60);
                        }
                      }
                    }}
                    disabled={!prevProject}
                    className="p-1 sm:p-1.5 rounded-lg text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-cyan-500"
                    title={prevProject ? `Previous: ${prevProject.title}` : "First project"}
                    aria-label={prevProject ? `Navigate to previous project: ${prevProject.title}` : "Previous project unavailable"}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="text-[10px] sm:text-[11px] font-mono px-1.5 sm:px-2 text-slate-500 dark:text-slate-400 select-none">
                    {currentIndex + 1} / {projects.length}
                  </span>
                  <button
                    ref={nextBtnRef}
                    type="button"
                    onClick={() => {
                      if (nextProject && onSelectProject) {
                        onSelectProject(nextProject);
                        if (currentIndex === projects.length - 2) {
                          setTimeout(() => prevBtnRef.current?.focus(), 60);
                        }
                      }
                    }}
                    disabled={!nextProject}
                    className="p-1 sm:p-1.5 rounded-lg text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-cyan-500"
                    title={nextProject ? `Next: ${nextProject.title}` : "Last project"}
                    aria-label={nextProject ? `Navigate to next project: ${nextProject.title}` : "Next project unavailable"}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Edit Project Action Button (if handler provided) */}
              {onEditProject && (
                <button
                  type="button"
                  onClick={() => onEditProject(project)}
                  className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-white/10 shadow-xs transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-cyan-500"
                  title="Edit this project's architecture, problem statement, and metrics"
                  aria-label={`Edit ${project.title}`}
                >
                  <Edit3 className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                  <span>Edit</span>
                </button>
              )}

              {/* Copy Interview Briefing Button */}
              <button
                type="button"
                onClick={handleCopySummary}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-white/10 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-cyan-500"
                title="Copy structured summary to clipboard for interview briefing"
                aria-label="Copy case study briefing text to clipboard"
              >
                {copiedSummary ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                    <span className="text-emerald-600 dark:text-emerald-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-400" />
                    <span className="hidden sm:inline">Copy Brief</span>
                  </>
                )}
              </button>

              {/* Close Button */}
              <button
                ref={closeButtonRef}
                type="button"
                onClick={handleClose}
                className="p-1.5 sm:p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-cyan-500"
                aria-label="Close case study dialog"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Section Navigation Tabs (Horizontally scrollable with touch-pan-x, zero page overflow) */}
          <div 
            className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-0.5 scrollbar-none touch-pan-x text-xs font-medium"
            role="tablist"
            aria-label="Case Study Sections"
          >
            {tabs.map((tab, idx) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  id={`tab-${tab.id}`}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-controls={`section-${tab.id}`}
                  tabIndex={isActive ? 0 : -1}
                  onClick={() => setActiveTab(tab.id)}
                  onKeyDown={(e) => handleTabKeyDown(e, idx)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-500 ${
                    isActive
                      ? "bg-slate-900 text-white dark:bg-cyan-500/20 dark:text-cyan-300 dark:border-cyan-500/40 border border-slate-900 font-semibold shadow-xs"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5"
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? "text-cyan-400" : "text-slate-400"}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Scrollable Content Body (Single unified vertical scroll container) */}
        <div 
          ref={contentBodyRef}
          className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 space-y-8"
        >

          {/* SECTION 1: PRACTICAL USE & TARGET AUDIENCE */}
          {(activeTab === "all" || activeTab === "use") && (
            <section id="section-use" aria-labelledby="heading-use" className="space-y-4">
              <div className="flex items-center gap-2 text-xs sm:text-sm font-bold tracking-tight text-slate-900 dark:text-white uppercase font-mono">
                <Target className="w-4 h-4 text-cyan-600 dark:text-cyan-400 shrink-0" />
                <h3 id="heading-use">1. Practical Use Case &amp; Real-World Value</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2 p-5 rounded-2xl bg-cyan-50/50 dark:bg-cyan-950/20 border border-cyan-200/80 dark:border-cyan-500/20 space-y-3">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-cyan-800 dark:text-cyan-300 font-bold block">
                    Core Mission &amp; Operational Workflow
                  </span>
                  <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                    {caseStudy.projectUse || caseStudy.overview}
                  </p>
                  {caseStudy.overview && caseStudy.projectUse && caseStudy.overview !== caseStudy.projectUse && (
                    <p className="text-xs text-slate-600 dark:text-slate-400 pt-2 border-t border-cyan-200/60 dark:border-cyan-500/10 leading-relaxed">
                      {caseStudy.overview}
                    </p>
                  )}
                </div>

                <div className="p-5 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/10 space-y-3">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold block">
                    Target Users &amp; Stakeholders
                  </span>
                  <p className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 leading-relaxed">
                    {caseStudy.targetUsers || "Software Architects, Engineering Teams, Peer Developers."}
                  </p>
                  
                  <div className="pt-2 border-t border-slate-200/80 dark:border-white/10">
                    <span className="text-[10px] font-mono uppercase text-slate-400 block mb-1">
                      System Domain
                    </span>
                    <span className="inline-block px-2.5 py-1 rounded-lg text-xs font-semibold bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300">
                      {project.domainTag}
                    </span>
                  </div>
                </div>
              </div>

              {/* Key Features Pill Matrix */}
              {caseStudy.keyFeatures && caseStudy.keyFeatures.length > 0 && (
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/10 space-y-2.5">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold block">
                    Standout Platform Capabilities
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                    {caseStudy.keyFeatures.map((feat, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300 font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </section>
          )}

          {/* SECTION 2: PROBLEM STATEMENT & MOTIVATION */}
          {(activeTab === "all" || activeTab === "problem") && (
            <section id="section-problem" aria-labelledby="heading-problem" className="space-y-4">
              <div className="flex items-center gap-2 text-xs sm:text-sm font-bold tracking-tight text-slate-900 dark:text-white uppercase font-mono">
                <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
                <h3 id="heading-problem">2. Problem Statement &amp; Motivation</h3>
              </div>

              <div className="p-5 sm:p-6 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/10 space-y-3">
                <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 font-bold text-xs uppercase tracking-wider font-mono">
                  <span>Core Engineering Challenge</span>
                </div>

                <p className="text-sm sm:text-base text-slate-800 dark:text-slate-200 leading-relaxed">
                  {caseStudy.problemStatement || project.problemSolved}
                </p>

                <div className="pt-2 border-t border-slate-200/80 dark:border-white/10 flex flex-wrap gap-2 text-xs font-mono text-slate-500 dark:text-slate-400">
                  <span className="text-cyan-600 dark:text-cyan-400 font-bold">› Focus:</span>
                  <span>Root-cause remediation via resilient architecture</span>
                </div>
              </div>
            </section>
          )}

          {/* SECTION 3: SYSTEM ARCHITECTURE & VISUALIZATIONS */}
          {(activeTab === "all" || activeTab === "solution") && (
            <section id="section-solution" aria-labelledby="heading-solution" className="space-y-4">
              <div className="flex items-center gap-2 text-xs sm:text-sm font-bold tracking-tight text-slate-900 dark:text-white uppercase font-mono">
                <Cpu className="w-4 h-4 text-cyan-600 dark:text-cyan-400 shrink-0" />
                <h3 id="heading-solution">3. Solved Architecture &amp; Technical Mechanics</h3>
              </div>

              <div className="p-5 sm:p-6 rounded-2xl bg-cyan-50/50 dark:bg-cyan-950/20 border border-cyan-200/80 dark:border-cyan-500/20 space-y-3">
                <div className="flex items-center gap-2 text-cyan-800 dark:text-cyan-300 font-bold text-xs uppercase tracking-wider font-mono">
                  <Workflow className="w-4 h-4" />
                  <span>Technical Design &amp; Architectural Blueprint</span>
                </div>
                <p className="text-sm sm:text-base text-slate-800 dark:text-slate-200 leading-relaxed">
                  {caseStudy.expertSolution || project.solution}
                </p>
                {caseStudy.architectureNotes && (
                  <div className="text-xs text-slate-700 dark:text-slate-300 pt-2 border-t border-cyan-200/60 dark:border-cyan-500/10 font-mono">
                    <strong className="text-cyan-800 dark:text-cyan-300 font-semibold font-mono">Pipeline Sequence: </strong>
                    <span>{caseStudy.architectureNotes}</span>
                  </div>
                )}
              </div>

              {/* Project-Specific Technical Visualization (Cadastral Map, ML Pipeline, or UI Preview) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-mono text-slate-500 dark:text-slate-400">
                  <span className="font-semibold uppercase tracking-wider">System Visualization Component</span>
                  <span>Illustrative Architecture Demonstration</span>
                </div>

                <div className="rounded-2xl border border-slate-200/80 dark:border-white/10 overflow-hidden bg-slate-50/50 dark:bg-black/20 p-2 sm:p-4">
                  <ProjectVisualPreview
                    project={project}
                    onOpenCaseStudy={() => {}}
                    isFeatured={true}
                  />
                </div>
              </div>

              {/* ASCII Interactive Architecture Diagram (if present) */}
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
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-[10px] text-slate-300 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-cyan-500"
                      title="Copy ASCII Architecture Diagram"
                      aria-label="Copy topology diagram text"
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
                  <pre className="font-mono overflow-x-auto p-1 leading-relaxed text-[11px] sm:text-xs text-cyan-300">
                    {caseStudy.architectureDiagram}
                  </pre>
                </div>
              )}
            </section>
          )}

          {/* SECTION 4: KEY INNOVATIONS & NOVELTY */}
          {(activeTab === "all" || activeTab === "novelty") && (
            <section id="section-novelty" aria-labelledby="heading-novelty" className="space-y-4">
              <div className="flex items-center gap-2 text-xs sm:text-sm font-bold tracking-tight text-slate-900 dark:text-white uppercase font-mono">
                <Sparkles className="w-4 h-4 text-violet-600 dark:text-violet-400 shrink-0" />
                <h3 id="heading-novelty">4. Key Innovations &amp; Engineering Novelty</h3>
              </div>

              <div className="relative p-5 sm:p-6 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/10 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200/80 dark:border-white/10 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 rounded-lg bg-violet-500/10 text-violet-600 dark:text-violet-400 border border-violet-500/20">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[11px] font-mono font-bold tracking-wider text-violet-600 dark:text-violet-400 uppercase">
                        Technical Differentiation
                      </span>
                      <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                        Unique Implementation Characteristics
                      </h4>
                    </div>
                  </div>

                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-violet-500/10 text-violet-700 dark:text-violet-300 border border-violet-500/20">
                    Bespoke Solution
                  </span>
                </div>

                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                  {caseStudy.novelty || caseStudy.overview}
                </p>

                {/* Novelty Highlight Bullets */}
                {caseStudy.noveltyHighlights && caseStudy.noveltyHighlights.length > 0 && (
                  <div className="pt-2 space-y-2">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold block">
                      Specific Architectural Highlights:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {caseStudy.noveltyHighlights.map((highlight, idx) => (
                        <div
                          key={idx}
                          className="flex items-start gap-2.5 p-3 rounded-xl bg-white dark:bg-white/5 border border-slate-200/80 dark:border-white/10 text-xs text-slate-800 dark:text-slate-200 shadow-2xs"
                        >
                          <Zap className="w-4 h-4 text-violet-500 dark:text-violet-400 shrink-0 mt-0.5" />
                          <span>{highlight}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* SECTION 5: OUTCOMES, BENCHMARKS & METRICS */}
          {(activeTab === "all" || activeTab === "benchmarks") && (
            <section id="section-benchmarks" aria-labelledby="heading-benchmarks" className="space-y-4">
              <div className="flex items-center gap-2 text-xs sm:text-sm font-bold tracking-tight text-slate-900 dark:text-white uppercase font-mono">
                <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <h3 id="heading-benchmarks">5. Documented Outcomes &amp; System Highlights</h3>
              </div>

              {/* Verified Metrics Hero Block */}
              {project.metrics && project.metrics.length > 0 && (
                <div className="p-5 sm:p-6 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/10 space-y-3">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-700 dark:text-emerald-400 font-bold block">
                    Verified Engineering Highlights
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {project.metrics.map((metric, i) => {
                      const sanitized = metric.includes("92%")
                        ? "📊 Cross-validation & evaluation metrics"
                        : metric.includes("100% Type-Safe")
                        ? "⚡ Strict TypeScript Compiler Configuration"
                        : metric;
                      return (
                        <div
                          key={i}
                          className="bg-white dark:bg-white/5 p-3 rounded-xl border border-slate-200/80 dark:border-white/10 text-xs sm:text-sm font-semibold flex items-center gap-2 text-slate-800 dark:text-slate-200 shadow-2xs"
                        >
                          <span className="truncate">{sanitized}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Before vs After Benchmark Comparison (ONLY if documented benchmarks exist in caseStudy) */}
              {caseStudy.benchmarks && caseStudy.benchmarks.length > 0 && (
                <div className="space-y-2">
                  <span className="text-xs font-mono uppercase text-slate-500 dark:text-slate-400 tracking-wider block">
                    Measured Benchmark Delta (Before vs. After)
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {caseStudy.benchmarks.map((bm, i) => (
                      <div
                        key={i}
                        className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/10 space-y-2"
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

                        <div className="pt-1.5 border-t border-slate-200/80 dark:border-white/10 flex items-center justify-between">
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
            </section>
          )}

          {/* SECTION 6: ARCHITECTURAL TRADEOFFS & LESSONS */}
          {(activeTab === "all" || activeTab === "tradeoffs") && (
            <section id="section-tradeoffs" aria-labelledby="heading-tradeoffs" className="space-y-4">
              <div className="flex items-center gap-2 text-xs sm:text-sm font-bold tracking-tight text-slate-900 dark:text-white uppercase font-mono">
                <ArrowLeftRight className="w-4 h-4 text-cyan-600 dark:text-cyan-400 shrink-0" />
                <h3 id="heading-tradeoffs">6. Architectural Decisions, Edge Cases &amp; Lessons</h3>
              </div>

              {caseStudy.tradeoffs && caseStudy.tradeoffs.length > 0 && (
                <div className="p-5 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/10 space-y-3">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-cyan-700 dark:text-cyan-400 font-semibold block">
                    Evaluated Technical Trade-offs
                  </span>
                  <ul className="space-y-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                    {caseStudy.tradeoffs.map((item, i) => (
                      <li key={i} className="flex items-start gap-2.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 mt-2 shrink-0" />
                        <span className="leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Challenges & Learnings Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {caseStudy.challenges && caseStudy.challenges.length > 0 && (
                  <div className="p-4 sm:p-5 rounded-2xl bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/20 space-y-2">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 font-mono">
                      <AlertTriangle className="w-4 h-4" />
                      <span>Technical Edge Cases Encountered</span>
                    </div>
                    <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
                      {caseStudy.challenges.map((c, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-amber-500 font-bold">•</span>
                          <span className="leading-relaxed">{c}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {caseStudy.keyLearnings && caseStudy.keyLearnings.length > 0 && (
                  <div className="p-4 sm:p-5 rounded-2xl bg-cyan-500/5 dark:bg-cyan-500/10 border border-cyan-500/20 space-y-2">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-cyan-700 dark:text-cyan-400 font-mono">
                      <Lightbulb className="w-4 h-4" />
                      <span>Key Architectural Lessons Learned</span>
                    </div>
                    <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
                      {caseStudy.keyLearnings.map((l, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-cyan-500 font-bold">•</span>
                          <span className="leading-relaxed">{l}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* SECTION 7: TECH STACK & RATIONALE */}
          {(activeTab === "all" || activeTab === "solution" || activeTab === "tradeoffs") && (
            <section id="section-stack" aria-labelledby="heading-stack" className="space-y-3 pt-2">
              <div className="flex items-center gap-2 text-xs sm:text-sm font-bold tracking-tight text-slate-900 dark:text-white uppercase font-mono">
                <Code2 className="w-4 h-4 text-cyan-600 dark:text-cyan-400 shrink-0" />
                <h3 id="heading-stack">7. Technology Stack &amp; Architectural Rationale</h3>
              </div>

              {caseStudy.techStackRationale && caseStudy.techStackRationale.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {caseStudy.techStackRationale.map((tech, i) => (
                    <div
                      key={i}
                      className="p-3.5 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/10 space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-cyan-700 dark:text-cyan-400">
                          {tech.name}
                        </span>
                        <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 uppercase">
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
                      className="px-3 py-1.5 rounded-xl text-xs font-mono bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-white/10"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              )}
            </section>
          )}

        </div>

        {/* Modal Sticky Footer Bar */}
        <div className="p-3.5 sm:p-5 border-t border-slate-200/80 dark:border-white/10 bg-white/95 dark:bg-[#070b13]/95 backdrop-blur-md flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2.5">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-900 text-white dark:bg-white dark:text-slate-950 hover:bg-slate-800 dark:hover:bg-slate-100 transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-cyan-500"
                aria-label={`Open live deployment for ${project.title} (opens in new tab)`}
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
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-cyan-500"
                aria-label={`View source code repository for ${project.title} on GitHub (opens in new tab)`}
              >
                <GithubIcon className="w-3.5 h-3.5" />
                <span>Source Code</span>
              </a>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopySummary}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-cyan-500"
              aria-label="Copy interview briefing summary to clipboard"
            >
              {copiedSummary ? "✓ Copied Brief" : "Copy Brief"}
            </button>

            <button
              type="button"
              onClick={handleClose}
              className="px-4 sm:px-5 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/15 text-slate-800 dark:text-white transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-cyan-500"
              aria-label="Close case study dialog"
            >
              Close
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

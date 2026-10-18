"use client";

import { useEffect } from "react";
import { Project } from "@/data/profile";
import { 
  X, 
  ExternalLink, 
  Layers, 
  Cpu, 
  AlertTriangle, 
  Lightbulb, 
  ArrowLeftRight, 
  CheckCircle2, 
  Sparkles
} from "lucide-react";
import { GithubIcon } from "@/components/Icons";

interface CaseStudyModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
}

export function CaseStudyModal({ project, isOpen, onClose }: CaseStudyModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
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
  }, [isOpen, onClose]);

  if (!isOpen || !project || !project.caseStudy) return null;

  const { caseStudy } = project;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-md transition-opacity animate-in fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog Card */}
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto glass-panel bg-white/95 dark:bg-slate-900/95 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 z-10 space-y-6 text-slate-900 dark:text-white">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
                {project.domainTag}
              </span>
              <span className="text-xs text-slate-400 font-mono">
                Architectural Deep Dive
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {project.title}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Overview & Bottleneck */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/20">
            <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 font-semibold text-xs uppercase tracking-wider mb-2">
              <AlertTriangle className="w-4 h-4" />
              <span>The Production Bottleneck</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              {project.problemSolved}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-cyan-500/5 dark:bg-cyan-500/10 border border-cyan-500/20">
            <div className="flex items-center gap-2 text-cyan-700 dark:text-cyan-400 font-semibold text-xs uppercase tracking-wider mb-2">
              <Sparkles className="w-4 h-4" />
              <span>Architected Solution</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              {project.solution}
            </p>
          </div>
        </div>

        {/* Quantifiable Impact Block */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 to-indigo-950 dark:from-slate-950 dark:to-slate-900 text-white border border-slate-800">
          <span className="text-[11px] font-mono uppercase tracking-wider text-cyan-400 font-semibold block mb-2">
            Proven Performance &amp; Business Metrics
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {project.metrics.map((metric, i) => (
              <div key={i} className="bg-white/5 p-2.5 rounded-xl border border-white/10 text-xs sm:text-sm font-semibold">
                {metric}
              </div>
            ))}
          </div>
        </div>

        {/* Architecture Notes & ASCII Diagram */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
            <Cpu className="w-4 h-4 text-cyan-500" />
            <span>System Architecture Flow</span>
          </div>
          
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            {caseStudy.architectureNotes}
          </p>

          {caseStudy.architectureDiagram && (
            <div className="relative rounded-2xl bg-slate-950 p-4 border border-slate-800 overflow-x-auto text-cyan-300 font-mono text-xs leading-relaxed shadow-inner">
              <div className="flex items-center justify-between text-[11px] text-slate-500 border-b border-slate-800 pb-2 mb-3">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
                  <span className="ml-2">system-topology-diagram.txt</span>
                </span>
                <span>ASCII Topology View</span>
              </div>
              <pre className="font-mono">{caseStudy.architectureDiagram}</pre>
            </div>
          )}
        </div>

        {/* Tradeoffs & Design Decisions */}
        {caseStudy.tradeoffs && caseStudy.tradeoffs.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
              <ArrowLeftRight className="w-4 h-4 text-indigo-500" />
              <span>Architectural Trade-offs Evaluated</span>
            </div>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
              {caseStudy.tradeoffs.map((item, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Challenges & Key Learnings */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <span>Critical Challenges</span>
            </div>
            <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
              {caseStudy.challenges.map((c, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-amber-500 font-bold">•</span>
                  <span>{c}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              <Lightbulb className="w-4 h-4 text-cyan-500" />
              <span>Key Technical Learnings</span>
            </div>
            <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
              {caseStudy.keyLearnings.map((l, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-cyan-500 font-bold">•</span>
                  <span>{l}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Tech Stack Badges */}
        <div className="pt-2">
          <div className="text-xs font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
            Technology Stack &amp; Infrastructure
          </div>
          <div className="flex flex-wrap gap-2">
            {project.techStack.map((tech) => (
              <span
                key={tech}
                className="px-3 py-1 rounded-lg text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-cyan-500 hover:bg-cyan-600 text-white shadow-sm transition-colors"
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
                <span>GitHub Repository</span>
              </a>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition-colors"
          >
            Close Deep Dive
          </button>
        </div>
      </div>
    </div>
  );
}

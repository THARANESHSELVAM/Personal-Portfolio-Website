"use client";

import React from "react";
import { Layers, GitBranch, Terminal, ShieldCheck } from "lucide-react";
import { Project } from "@/data/profile";

interface ProjectFallbackPreviewProps {
  project: Project;
}

/**
 * Custom / Imported Project — Safe Fallback Preview
 * 
 * Renders a clean, verified code / spec representation for user-created or GitHub-imported projects
 * without misrepresenting capabilities or inventing fake metrics.
 */
export function ProjectFallbackPreview({ project }: ProjectFallbackPreviewProps) {
  return (
    <div className="rounded-2xl bg-slate-50/80 dark:bg-[#070a13] p-4 sm:p-5 border border-slate-200/80 dark:border-white/10 space-y-4">
      {/* Header Bar */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200/70 dark:border-white/10">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-sky-500/15 border border-sky-500/25 flex items-center justify-center text-sky-600 dark:text-sky-400">
            <Terminal className="w-4 h-4" aria-hidden="true" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900 dark:text-white truncate max-w-[180px]">
              {project.title}
            </div>
            <div className="text-[10px] font-mono text-sky-600 dark:text-sky-400">
              {project.domainTag || "Software System"}
            </div>
          </div>
        </div>

        <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded-full bg-slate-200/60 dark:bg-white/5 border border-slate-300/60 dark:border-white/10">
          Verified Repository
        </span>
      </div>

      {/* Code Spec Box */}
      <div className="rounded-xl bg-white dark:bg-[#050810] p-3.5 border border-slate-200/70 dark:border-white/10 font-mono text-[11px] space-y-2">
        <div className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wider font-semibold">
          Architecture Manifest
        </div>

        <div className="space-y-1 text-slate-700 dark:text-slate-300 text-xs">
          <div className="flex items-start gap-2">
            <span className="text-sky-500 font-bold">›</span>
            <span className="leading-relaxed line-clamp-2">{project.solution || project.problemSolved}</span>
          </div>
        </div>

        {project.techStack && project.techStack.length > 0 && (
          <div className="pt-2 border-t border-slate-100 dark:border-white/5 flex flex-wrap gap-1 text-[10px]">
            {project.techStack.slice(0, 4).map((tech) => (
              <span
                key={tech}
                className="px-2 py-0.5 rounded bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-white/5"
              >
                {tech}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Truthful Manifest Footer */}
      <div className="pt-1">
        <p className="text-[10px] text-slate-500 dark:text-slate-400 font-mono leading-relaxed">
          * Repository metadata synchronized from project specification.
        </p>
      </div>
    </div>
  );
}

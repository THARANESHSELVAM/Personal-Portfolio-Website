"use client";

import { useState } from "react";
import { PROFILE, Project } from "@/data/profile";
import { CaseStudyModal } from "./CaseStudyModal";
import { 
  Briefcase, 
  ExternalLink, 
  BookOpen, 
  TrendingUp, 
  Zap, 
  Layers, 
  Filter
} from "lucide-react";
import { GithubIcon } from "@/components/Icons";

export function ProjectGrid() {
  const [selectedFilter, setSelectedFilter] = useState<string>("All");
  const [activeCaseStudyProject, setActiveCaseStudyProject] = useState<Project | null>(null);

  const categories = [
    "All",
    "Distributed Systems",
    "Full-Stack Web",
    "AI & Distributed Systems",
    "Cloud Security",
    "Data & Observability",
    "Developer Tooling"
  ];

  const filteredProjects = selectedFilter === "All"
    ? PROFILE.projects
    : PROFILE.projects.filter((p) => p.category === selectedFilter);

  return (
    <section id="projects" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold text-cyan-600 dark:text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 mb-3">
            <Briefcase className="w-3.5 h-3.5" />
            <span>PRODUCTION CASE STUDIES</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Impact-Driven Engineering Projects
          </h2>
          <p className="mt-3 text-slate-600 dark:text-slate-400 text-sm sm:text-base">
            Every project demonstrates a tangible bottleneck solved, measurable financial or performance impact, and enterprise-grade reliability.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mr-2 font-mono">
            <Filter className="w-3.5 h-3.5" />
            <span>Filter Domain:</span>
          </div>
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedFilter(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 border ${
                selectedFilter === cat
                  ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-slate-900 dark:border-white shadow-sm"
                  : "glass-panel text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border-slate-200 dark:border-slate-800"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Projects Multi-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="glass-panel rounded-3xl border border-slate-200/90 dark:border-slate-800/90 p-6 flex flex-col justify-between hover:border-cyan-500/50 dark:hover:border-cyan-500/50 hover:shadow-xl hover:shadow-cyan-500/5 transition-all duration-300 group"
            >
              <div className="space-y-4">
                {/* Domain Tag & Featured Badge */}
                <div className="flex items-center justify-between gap-2">
                  <span className="px-3 py-1 rounded-full text-[11px] font-mono font-semibold bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
                    {project.domainTag}
                  </span>
                  {project.featured && (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                      ★ Featured
                    </span>
                  )}
                </div>

                {/* Project Title */}
                <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                  {project.title}
                </h3>

                {/* Problem Solved Framing */}
                <div className="p-3.5 rounded-xl bg-slate-100/70 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800">
                  <div className="text-[11px] font-mono uppercase tracking-wider text-rose-600 dark:text-rose-400 font-semibold mb-1">
                    Problem Bottleneck
                  </div>
                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                    {project.problemSolved}
                  </p>
                </div>

                {/* Solution Summary */}
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {project.solution}
                </p>

                {/* Tech Stack Pills */}
                <div>
                  <div className="text-[10px] font-mono uppercase text-slate-400 dark:text-slate-500 mb-1.5">
                    Stack &amp; Tools
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {project.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="px-2.5 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700/60"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* High-Contrast Dedicated Metrics Callout Block */}
                <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950 text-white shadow-md border border-slate-800 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-wider text-cyan-400 font-bold">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>Quantifiable Impact</span>
                  </div>
                  <div className="space-y-1">
                    {project.metrics.map((metric, i) => (
                      <div
                        key={i}
                        className="text-xs font-medium text-slate-200 flex items-start gap-1.5 leading-snug"
                      >
                        <span>{metric}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Links Bar */}
              <div className="pt-6 mt-4 border-t border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-600 text-white shadow-sm transition-colors"
                      title="View Live Demo"
                    >
                      <span>Live</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}

                  {project.repoUrl && (
                    <a
                      href={project.repoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg glass-panel text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700 transition-colors"
                      title="View GitHub Repository"
                    >
                      <GithubIcon className="w-3 h-3" />
                      <span>Code</span>
                    </a>
                  )}
                </div>

                {project.caseStudy && (
                  <button
                    type="button"
                    onClick={() => setActiveCaseStudyProject(project)}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 border border-indigo-200 dark:border-indigo-800 transition-colors"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Case Study</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Case Study Modal Drawer */}
      <CaseStudyModal
        project={activeCaseStudyProject}
        isOpen={!!activeCaseStudyProject}
        onClose={() => setActiveCaseStudyProject(null)}
      />
    </section>
  );
}

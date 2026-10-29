"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  FileText,
  Mail,
  Check,
  GraduationCap,
  ExternalLink,
  Code2,
  Server,
  Cloud,
  Cpu,
  Layers,
  Download,
  Printer,
  Copy,
  ArrowUp,
  MapPin,
  BookOpen,
  Menu,
  X,
  Terminal
} from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/Icons";
import { ThemeToggle } from "@/components/ThemeToggle";
import { CaseStudyModal } from "@/components/CaseStudyModal";
import {
  Project,
  INITIAL_PROFILE_STATE,
  INITIAL_PROJECTS,
  INITIAL_LEARNINGS,
  generateDynamicPlainTextResume
} from "@/data/profile";

export function PublicPortfolio() {
  const profile = INITIAL_PROFILE_STATE;
  const projects = profile.projects && profile.projects.length > 0 ? profile.projects : INITIAL_PROJECTS;
  const learnings = profile.learnings && profile.learnings.length > 0 ? profile.learnings : INITIAL_LEARNINGS;

  const [activeCaseStudyProject, setActiveCaseStudyProject] = useState<Project | null>(null);
  const [copiedResume, setCopiedResume] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleDownloadTxt = () => {
    const textContent = generateDynamicPlainTextResume(profile);
    const blob = new Blob([textContent], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Tharanesh_Selvam_Software_Developer_Resume.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handlePrintPdf = () => {
    window.print();
  };

  const handleCopyResumeText = () => {
    const textContent = generateDynamicPlainTextResume(profile);
    navigator.clipboard.writeText(textContent);
    setCopiedResume(true);
    setTimeout(() => setCopiedResume(false), 2500);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 dark:bg-[#060b14] dark:text-slate-100 transition-colors duration-200">

      {/* ================= STICKY HEADER & PUBLIC NAVIGATION ================= */}
      <header className="sticky top-0 z-40 glass-nav py-3 border-b border-slate-200/80 dark:border-white/[0.08] transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">

            {/* Identity & Monogram */}
            <Link
              href="/"
              className="flex items-center gap-2.5 group text-left cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-500 rounded-lg"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-500/20 to-cyan-500/10 border border-cyan-500/40 dark:border-cyan-400/40 flex items-center justify-center text-cyan-700 dark:text-cyan-400 font-extrabold text-xs shadow-sm shadow-cyan-500/10 group-hover:border-cyan-400 transition-colors">
                TS
              </div>
              <div className="flex flex-col">
                <span className="text-xs sm:text-sm font-extrabold tracking-wider text-slate-900 group-hover:text-cyan-600 dark:text-white dark:group-hover:text-cyan-300 transition-colors uppercase">
                  THARANESH SELVAM
                </span>
                <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 -mt-0.5 hidden sm:block">
                  Software Developer | M.Tech CSE
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav
              aria-label="Public Portfolio Navigation"
              className="hidden md:flex items-center gap-1 bg-slate-100/90 dark:bg-[#090f1d]/90 px-3 py-1.5 rounded-full border border-slate-200 dark:border-cyan-900/30 backdrop-blur-md shadow-inner text-xs font-medium"
            >
              <a
                href="#projects"
                className="px-3 py-1.5 rounded-full text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800/50 transition-colors"
              >
                Projects
              </a>
              <a
                href="#skills"
                className="px-3 py-1.5 rounded-full text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800/50 transition-colors"
              >
                Skills
              </a>
              <a
                href="#journey"
                className="px-3 py-1.5 rounded-full text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800/50 transition-colors"
              >
                Journey
              </a>
              <a
                href="#resume"
                className="px-3 py-1.5 rounded-full text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800/50 transition-colors"
              >
                Résumé
              </a>
              <a
                href="#contact"
                className="px-3 py-1.5 rounded-full text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800/50 transition-colors"
              >
                Contact
              </a>
            </nav>

            {/* Right Action Cluster: Interactive Workspace & Theme */}
            <div className="flex items-center gap-2.5">
              <Link
                href="/workspace"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-cyan-50 hover:bg-cyan-100 text-cyan-800 border border-cyan-200 dark:bg-cyan-950/50 dark:hover:bg-cyan-900/60 dark:text-cyan-300 dark:border-cyan-500/30 transition-all shadow-xs hover:scale-[1.02] active:scale-95"
                title="Explore the interactive demo workspace (learning diary logger, profile switcher, GitHub API sync)"
              >
                <Terminal className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                <span className="hidden sm:inline">Workspace Demo</span>
                <span className="sm:hidden">Demo</span>
                <span className="text-[10px] text-cyan-600 dark:text-cyan-400">↗</span>
              </Link>

              <ThemeToggle />

              {/* Mobile Menu Button */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </button>
            </div>

          </div>

          {/* Mobile Dropdown Nav */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-3 pt-3 border-t border-slate-200 dark:border-slate-800/80 space-y-2 pb-2 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="grid grid-cols-2 gap-2 text-xs font-medium">
                <a
                  href="#projects"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800"
                >
                  Projects
                </a>
                <a
                  href="#skills"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800"
                >
                  Skills
                </a>
                <a
                  href="#journey"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800"
                >
                  Journey
                </a>
                <a
                  href="#resume"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800"
                >
                  Résumé
                </a>
              </div>
              <a
                href="#contact"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-center px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 text-xs font-medium"
              >
                Contact
              </a>
              <Link
                href="/workspace"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-cyan-600 text-white dark:text-slate-950 font-bold text-xs shadow-md shadow-cyan-500/20"
              >
                <Terminal className="w-3.5 h-3.5" />
                <span>Launch Interactive Workspace Demo →</span>
              </Link>
            </div>
          )}

        </div>
      </header>

      {/* ================= MAIN CONTENT ================= */}
      <main className="flex-1">

        {/* 1. HERO SECTION */}
        <section
          aria-label="Introduction & Overview"
          className="relative pt-12 pb-16 sm:pt-20 sm:pb-24 overflow-hidden border-b border-slate-200/80 dark:border-white/[0.06]"
        >
          {/* Subtle cosmic glow background */}
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-gradient-to-tr from-cyan-500/10 via-teal-500/5 to-transparent rounded-full blur-3xl pointer-events-none -z-10 opacity-50 dark:opacity-100" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl space-y-6 text-left">

              {/* Status Beacon & Academic Badge */}
              <div className="flex flex-wrap items-center gap-3 text-xs">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/[0.08] dark:bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 dark:text-emerald-300 font-medium">
                  <span className="relative flex h-2 w-2" aria-hidden="true">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                  </span>
                  <span>Open to Software Development Roles</span>
                </div>

                <span className="text-slate-300 dark:text-slate-700 hidden sm:inline" aria-hidden="true">•</span>

                <div className="inline-flex items-center gap-1.5 text-slate-600 dark:text-slate-400 font-medium">
                  <GraduationCap className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400 shrink-0" />
                  <span>Integrated M.Tech CSE (2025–2030) • Pursuing</span>
                </div>
              </div>

              {/* Dominant Headline: Identity & Mission */}
              <div className="space-y-2">
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.1]">
                  THARANESH SELVAM
                </h1>
                <p className="text-lg sm:text-xl md:text-2xl font-bold text-cyan-700 dark:text-cyan-400 tracking-tight">
                  Software Developer | M.Tech CSE
                </p>
              </div>

              {/* Value Proposition */}
              <p className="text-base sm:text-lg md:text-xl text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
                I build interactive web applications and explore software engineering through hands-on projects, experimentation, and continuous learning.
              </p>

              {/* Professional Narrative Subtitle */}
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl font-normal">
                Pursuing a 5-year Integrated M.Tech in Computer Science and Engineering at Sri Krishna College of Engineering and Technology with a focus on modern web architectures, GIS spatial platforms, and applied machine learning pipelines. Driven by type safety, clean systems, and evidence-backed problem solving.
              </p>

              {/* Primary Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <a
                  href="#projects"
                  className="min-h-[46px] inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-slate-950 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-950 font-semibold text-xs sm:text-sm shadow-md transition-all active:scale-[0.98] group"
                >
                  <span>Explore My Projects</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>

                <a
                  href="#resume"
                  className="min-h-[46px] inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white hover:bg-slate-50 dark:bg-white/[0.04] dark:hover:bg-white/[0.08] text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-white/[0.1] font-medium text-xs sm:text-sm shadow-xs transition-all active:scale-[0.98]"
                >
                  <FileText className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                  <span>View My Resume</span>
                </a>

                <a
                  href="https://github.com/THARANESHSELVAM"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="min-h-[46px] inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-900/90 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-800 font-medium text-xs sm:text-sm transition-all"
                >
                  <GithubIcon className="w-4 h-4 text-slate-700 dark:text-slate-300" />
                  <span>GitHub Profile ↗</span>
                </a>
              </div>

              {/* Verified Coordinates Strip */}
              <div className="pt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-600 dark:text-slate-400">
                <a
                  href={profile.contact?.github || "https://github.com/THARANESHSELVAM"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  <GithubIcon className="w-3.5 h-3.5 text-slate-700 dark:text-slate-300" />
                  <span className="font-mono text-[11px]">github.com/THARANESHSELVAM ↗</span>
                </a>

                <span className="text-slate-300 dark:text-slate-700 hidden sm:inline">•</span>

                <div className="inline-flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                  <MapPin className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400 shrink-0" />
                  <span>India / Open to Remote &amp; Relocation</span>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* 2. STRONGEST PROJECTS SECTION */}
        <section
          id="projects"
          aria-label="Strongest Projects & Case Studies"
          className="py-16 sm:py-24 border-b border-slate-200/80 dark:border-white/[0.06]"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">

            {/* Section Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200/80 dark:border-white/[0.08] pb-6 text-left">
              <div className="space-y-2">
                <div className="text-xs font-mono font-semibold uppercase tracking-wider text-cyan-600 dark:text-cyan-400">
                  Engineering Portfolio
                </div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                  Featured Work &amp; Concepts
                </h2>
                <p className="text-xs sm:text-sm md:text-base text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
                  Active software applications, early architectural concepts, and exploratory study areas documenting practical skills and learning progress.
                </p>
              </div>

              <span className="text-xs font-mono px-3 py-1 rounded-full bg-slate-100 dark:bg-white/[0.04] text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-white/[0.08] self-start md:self-auto shrink-0">
                Featured Work &amp; Concepts
              </span>
            </div>

            {/* Project Cards Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-left">
              {projects.map((project) => {
                const caseStudy = project.caseStudy;
                return (
                  <article
                    key={project.id}
                    className="rounded-3xl p-6 sm:p-7 bg-white dark:bg-[#080d19] border border-slate-200 dark:border-cyan-950/60 shadow-lg shadow-slate-100 dark:shadow-none flex flex-col justify-between space-y-6 hover:border-cyan-500/40 transition-all duration-300"
                  >
                    <div className="space-y-5">
                      {/* Top Badges */}
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-cyan-50 text-cyan-700 border border-cyan-200 dark:bg-cyan-950/60 dark:text-cyan-300 dark:border-cyan-500/30">
                          {project.domainTag || project.category}
                        </span>
                        {project.id === "personal-portfolio" && (
                          <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            Live Application
                          </span>
                        )}
                        {project.id !== "personal-portfolio" && (
                          <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 font-medium">
                            {project.id === "land-stack" ? "Early-Stage Concept" : "Learning Focus"}
                          </span>
                        )}
                      </div>

                      {/* Title & One-line Novelty */}
                      <div className="space-y-1">
                        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                          {project.title}
                        </h3>
                        {project.noveltySnippet && (
                          <p className="text-xs font-medium text-cyan-600 dark:text-cyan-400 font-mono">
                            {project.noveltySnippet}
                          </p>
                        )}
                      </div>

                      {/* Problem Statement */}
                      <div className="space-y-1.5 text-xs sm:text-sm">
                        <span className="font-semibold text-slate-800 dark:text-slate-200 block text-[11px] uppercase tracking-wider font-mono">
                          Problem Addressed:
                        </span>
                        <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                          {project.problemSolved}
                        </p>
                      </div>

                      {/* What I Implemented */}
                      <div className="space-y-1.5 text-xs sm:text-sm">
                        <span className="font-semibold text-slate-800 dark:text-slate-200 block text-[11px] uppercase tracking-wider font-mono">
                          {project.id === "personal-portfolio" ? "What I Implemented:" : (project.id === "land-stack" ? "Conceptual Architecture:" : "Study Focus:")}
                        </span>
                        <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                          {project.solution}
                        </p>
                      </div>

                      {/* Technical Challenge / Design Decision */}
                      {caseStudy?.challenges && caseStudy.challenges.length > 0 && (
                        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/[0.06] space-y-1">
                          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                            Key Technical Challenge &amp; Decision:
                          </span>
                          <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                            {caseStudy.challenges[0]}
                          </p>
                        </div>
                      )}

                      {/* Technologies Used */}
                      <div className="space-y-2">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                          {project.id === "personal-portfolio" ? "Technologies Used:" : "Focus Areas / Concepts:"}
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {project.techStack.map((tech) => (
                            <span
                              key={tech}
                              className="px-2 py-0.5 rounded-md text-[11px] font-mono bg-slate-100 text-slate-800 dark:bg-slate-900 dark:text-slate-300 border border-slate-200 dark:border-slate-800"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Action Footers: Case Study Modal & Working Links */}
                    <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-white/[0.06]">
                      {caseStudy && (
                        <button
                          type="button"
                          id={`case-study-btn-${project.id}`}
                          onClick={() => setActiveCaseStudyProject(project)}
                          className="w-full min-h-[42px] inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white dark:bg-white/[0.08] dark:hover:bg-white/[0.14] dark:text-white text-xs font-semibold transition-all cursor-pointer shadow-xs active:scale-95 group"
                        >
                          <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
                          <span>View Full Case Study</span>
                          <ArrowRight className="w-3.5 h-3.5 text-cyan-400 group-hover:translate-x-1 transition-transform" />
                        </button>
                      )}

                      <div className="flex items-center justify-between gap-3 text-xs pt-1">
                        {project.liveUrl && project.liveUrl !== project.repoUrl && (
                          <a
                            href={project.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-cyan-700 hover:text-cyan-800 dark:text-cyan-400 dark:hover:text-cyan-300 font-semibold transition-colors"
                          >
                            <span>Live Demo</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}

                        {project.repoUrl && (
                          <a
                            href={project.repoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white font-medium transition-colors ml-auto"
                          >
                            <GithubIcon className="w-3.5 h-3.5" />
                            <span>Repository ↗</span>
                          </a>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>

          </div>
        </section>

        {/* 3. TECHNICAL SKILLS SECTION */}
        <section
          id="skills"
          aria-label="Verified Technical Skills"
          className="py-16 sm:py-24 border-b border-slate-200/80 dark:border-white/[0.06] bg-slate-100/50 dark:bg-[#040812]"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">

            {/* Section Header */}
            <div className="space-y-2 text-left">
              <div className="text-xs font-mono font-semibold uppercase tracking-wider text-cyan-600 dark:text-cyan-400">
                Core Competencies
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                Technical Skills Matrix
              </h2>
              <p className="text-xs sm:text-sm md:text-base text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
                Categorized engineering capabilities supported by hands-on project implementation and documented milestones.
              </p>
            </div>

            {/* Skills Domains Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">

              {/* Frontend */}
              <div className="p-6 rounded-3xl bg-white dark:bg-[#080d19] border border-slate-200 dark:border-cyan-950/50 space-y-4 shadow-sm">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
                    <Code2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">Frontend Engineering</h3>
                    <p className="text-[10px] text-slate-500 font-mono">Used in this portfolio application</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    "Next.js 16",
                    "React 19",
                    "TypeScript",
                    "Tailwind CSS v4",
                    "JavaScript (ES6+)",
                    "HTML5 & CSS3",
                    "Web Accessibility (WCAG)"
                  ].map((s) => (
                    <span
                      key={s}
                      className="px-2.5 py-1 rounded-xl text-xs font-medium bg-slate-100 text-slate-800 dark:bg-slate-900/90 dark:text-slate-200 border border-slate-200 dark:border-slate-800"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Backend & APIs */}
              <div className="p-6 rounded-3xl bg-white dark:bg-[#080d19] border border-slate-200 dark:border-cyan-950/50 space-y-4 shadow-sm">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                    <Server className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">Backend &amp; Systems (Foundations)</h3>
                    <p className="text-[10px] text-slate-500 font-mono">API communication &amp; database basics</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    "GitHub REST API (Used in project)",
                    "RESTful APIs (Concepts)",
                    "Node.js (Foundations)",
                    "SQL & Relational Databases (Learning)",
                    "Client-Server Protocols"
                  ].map((s) => (
                    <span
                      key={s}
                      className="px-2.5 py-1 rounded-xl text-xs font-medium bg-slate-100 text-slate-800 dark:bg-slate-900/90 dark:text-slate-200 border border-slate-200 dark:border-slate-800"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Cloud & DevOps */}
              <div className="p-6 rounded-3xl bg-white dark:bg-[#080d19] border border-slate-200 dark:border-cyan-950/50 space-y-4 shadow-sm">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center">
                    <Cloud className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">Tools &amp; Workflows</h3>
                    <p className="text-[10px] text-slate-500 font-mono">AI-assisted version control &amp; platforms</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    "Git & GitHub (AI-assisted)",
                    "Antigravity (AI environment)",
                    "VS Code & Developer Tools",
                    "Vercel Edge & npm"
                  ].map((s) => (
                    <span
                      key={s}
                      className="px-2.5 py-1 rounded-xl text-xs font-medium bg-slate-100 text-slate-800 dark:bg-slate-900/90 dark:text-slate-200 border border-slate-200 dark:border-slate-800"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Data & AI */}
              <div className="p-6 rounded-3xl bg-white dark:bg-[#080d19] border border-slate-200 dark:border-cyan-950/50 space-y-4 shadow-sm">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                    <Cpu className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">Data Science &amp; AI (Study Areas)</h3>
                    <p className="text-[10px] text-slate-500 font-mono">Academic coursework &amp; study topics</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    "Python Fundamentals (Learning)",
                    "Data Analysis Concepts (Exploring)",
                    "Machine Learning Principles (Study)",
                    "NumPy & Pandas Foundations",
                    "Statistical Principles (Coursework)",
                    "Algorithm Concepts (Foundations)"
                  ].map((s) => (
                    <span
                      key={s}
                      className="px-2.5 py-1 rounded-xl text-xs font-medium bg-slate-100 text-slate-800 dark:bg-slate-900/90 dark:text-slate-200 border border-slate-200 dark:border-slate-800"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* System Design & Geospatial */}
              <div className="p-6 rounded-3xl bg-white dark:bg-[#080d19] border border-slate-200 dark:border-cyan-950/50 space-y-4 shadow-sm md:col-span-2 lg:col-span-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                    <Layers className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">System Design &amp; Conceptual Studies</h3>
                    <p className="text-[10px] text-slate-500 font-mono">Architectural research &amp; component design</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    "Component-Driven Architecture (Used in project)",
                    "Local State Persistence (Used in project)",
                    "Geospatial GIS Concepts (Exploration)",
                    "Spatial Data Structures (Study)",
                    "Land Governance Workflows (Concept)"
                  ].map((s) => (
                    <span
                      key={s}
                      className="px-2.5 py-1 rounded-xl text-xs font-medium bg-slate-100 text-slate-800 dark:bg-slate-900/90 dark:text-slate-200 border border-slate-200 dark:border-slate-800"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>

            </div>

          </div>
        </section>

        {/* 4. ENGINEERING JOURNEY / MILESTONES SECTION */}
        <section
          id="journey"
          aria-label="Engineering Journey & Continuous Learning"
          className="py-16 sm:py-24 border-b border-slate-200/80 dark:border-white/[0.06]"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">

            {/* Section Header */}
            <div className="space-y-2 text-left">
              <div className="text-xs font-mono font-semibold uppercase tracking-wider text-cyan-600 dark:text-cyan-400">
                Continuous Learning
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                Engineering Journey
              </h2>
              <p className="text-xs sm:text-sm md:text-base text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
                Tangible proof of continuous experimentation, technical milestones, and practical takeaways logged across software engineering domains.
              </p>
            </div>

            {/* Milestones Timeline Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
              {learnings.map((item) => (
                <div
                  key={item.id}
                  className="rounded-3xl p-6 bg-white dark:bg-[#080d19] border border-slate-200 dark:border-cyan-950/50 shadow-sm flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2 text-[10px] font-mono">
                      <span className="px-2 py-0.5 rounded-full bg-cyan-50 text-cyan-700 dark:bg-cyan-950/60 dark:text-cyan-300 font-semibold border border-cyan-200 dark:border-cyan-500/30">
                        {item.category}
                      </span>
                      <span className="text-slate-400">
                        {item.dateLogged}
                      </span>
                    </div>

                    <h3 className="font-bold text-base text-slate-900 dark:text-white leading-snug">
                      {item.technology}
                    </h3>

                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      {item.keyTakeaway}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 dark:border-white/[0.06] flex items-center justify-between text-[11px]">
                    <div className="flex flex-wrap gap-1">
                      {item.tags.slice(0, 3).map((tag) => (
                        <span key={tag} className="text-[10px] font-mono text-slate-500 dark:text-slate-400">
                          #{tag}
                        </span>
                      ))}
                    </div>
                    <span className="text-[10px] font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                      ✓ {item.masteryLevel}
                    </span>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* 5. DYNAMIC ATS RÉSUMÉ SECTION */}
        <section
          id="resume"
          aria-label="ATS Resume Showcase"
          className="py-16 sm:py-24 border-b border-slate-200/80 dark:border-white/[0.06] bg-slate-100/50 dark:bg-[#040812]"
        >
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">

            {/* Section Header */}
            <div className="space-y-2 text-center max-w-2xl mx-auto">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold text-cyan-700 bg-cyan-50 border border-cyan-200 dark:text-cyan-400 dark:bg-cyan-500/10 dark:border-cyan-500/20">
                <FileText className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                <span>Applicant Tracking System Ready</span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                Dynamic ATS Résumé
              </h2>
              <p className="text-xs sm:text-sm md:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
                Clean, formatted résumé compiled directly from verified projects, technical competencies, and academic credentials.
              </p>
            </div>

            {/* Resume Action Bar */}
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={handleDownloadTxt}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-white dark:bg-white dark:hover:bg-slate-100 dark:text-slate-950 text-xs font-semibold shadow-sm transition-all active:scale-95 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Plain-Text (.txt)</span>
              </button>

              <button
                type="button"
                onClick={handlePrintPdf}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-800 text-xs font-medium transition-all active:scale-95 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                <span>Print / Save PDF</span>
              </button>

              <button
                type="button"
                onClick={handleCopyResumeText}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-800 text-xs font-medium transition-all active:scale-95 cursor-pointer"
              >
                {copiedResume ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                    <span>Copy Résumé Text</span>
                  </>
                )}
              </button>
            </div>

            {/* Visual ATS Document Card */}
            <div className="rounded-3xl bg-white dark:bg-[#070c18] border border-slate-200 dark:border-cyan-950/60 p-6 sm:p-10 text-left space-y-8 shadow-xl">

              {/* Document Header */}
              <div className="border-b border-slate-200 dark:border-white/[0.08] pb-6 space-y-2">
                <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white uppercase">
                  {profile.name}
                </h3>
                <p className="text-sm font-semibold text-cyan-700 dark:text-cyan-400">
                  Software Developer | Integrated M.Tech CSE
                </p>
                <div className="text-xs font-mono text-slate-500 dark:text-slate-400 pt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
                  {profile.contact?.email ? (
                    <>
                      <span>{profile.contact.email}</span>
                      <span>•</span>
                    </>
                  ) : null}
                  <span>{profile.contact?.location || "India / Open to Remote & Relocation"}</span>
                  {profile.contact?.linkedin ? (
                    <>
                      <span>•</span>
                      <a href={profile.contact.linkedin} target="_blank" rel="noopener noreferrer" className="hover:underline">
                        LinkedIn
                      </a>
                    </>
                  ) : null}
                  {profile.contact?.github ? (
                    <>
                      <span>•</span>
                      <a href={profile.contact.github} target="_blank" rel="noopener noreferrer" className="hover:underline">
                        github.com/THARANESHSELVAM
                      </a>
                    </>
                  ) : null}
                </div>
              </div>

              {/* Summary */}
              <div className="space-y-2">
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-900 dark:text-white border-b border-slate-100 dark:border-white/[0.06] pb-1">
                  Professional Summary
                </h4>
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  {profile.resume?.summary ||
                    "Integrated M.Tech in Computer Science and Engineering candidate at Sri Krishna College of Engineering and Technology (2025–2030) with hands-on experience building modern, responsive web applications using Next.js, React, TypeScript, Node.js, and cloud platforms. Eager to solve real-world problems through clean code, robust architecture, and continuous learning."}
                </p>
              </div>

              {/* Education */}
              <div className="space-y-3">
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-900 dark:text-white border-b border-slate-100 dark:border-white/[0.06] pb-1">
                  Education
                </h4>
                <div className="space-y-3 text-xs sm:text-sm">
                  {profile.resume?.education?.map((edu, idx) => (
                    <div key={idx} className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white">{edu.degree}</div>
                        <div className="text-slate-500 dark:text-slate-400">{edu.institution}</div>
                      </div>
                      <div className="font-mono text-xs text-slate-500 dark:text-slate-400 shrink-0">
                        {edu.year}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Technical Skills Summary */}
              <div className="space-y-2 text-xs sm:text-sm">
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-900 dark:text-white border-b border-slate-100 dark:border-white/[0.06] pb-1">
                  Technical Skills
                </h4>
                <div className="space-y-1.5 text-slate-700 dark:text-slate-300">
                  <p>
                    <strong className="text-slate-900 dark:text-white">Languages &amp; Core:</strong> TypeScript, JavaScript (ES6+), Python, HTML5, CSS3, SQL
                  </p>
                  <p>
                    <strong className="text-slate-900 dark:text-white">Frameworks &amp; Libraries:</strong> Next.js 16 (App Router), React 19, Tailwind CSS v4, Node.js, Express, Pandas, Scikit-learn, NumPy
                  </p>
                  <p>
                    <strong className="text-slate-900 dark:text-white">Tools &amp; Databases:</strong> Git, GitHub, PostgreSQL, PostGIS, Docker, REST APIs, Vercel
                  </p>
                </div>
              </div>

              {/* Featured Projects Highlight */}
              <div className="space-y-3 text-xs sm:text-sm">
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-900 dark:text-white border-b border-slate-100 dark:border-white/[0.06] pb-1">
                  Featured Projects
                </h4>
                <div className="space-y-4">
                  {projects.map((proj) => (
                    <div key={proj.id} className="space-y-1">
                      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                        <span className="font-bold text-slate-900 dark:text-white">
                          {proj.title}
                        </span>
                        <span className="font-mono text-[11px] text-cyan-600 dark:text-cyan-400">
                          {proj.techStack.join(" • ")}
                        </span>
                      </div>
                      <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-xs">
                        {proj.solution}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Certifications */}
              <div className="space-y-2 text-xs sm:text-sm">
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-900 dark:text-white border-b border-slate-100 dark:border-white/[0.06] pb-1">
                  Certifications &amp; Training
                </h4>
                <ul className="list-disc list-inside space-y-1 text-slate-700 dark:text-slate-300">
                  {profile.resume?.certifications?.map((cert, idx) => (
                    <li key={idx}>{cert}</li>
                  ))}
                </ul>
              </div>

            </div>

          </div>
        </section>

        {/* 6. INTERACTIVE DEMO WORKSPACE CALLOUT */}
        <section
          aria-label="Interactive Demo Workspace Exploration"
          className="py-12 border-b border-slate-200/80 dark:border-white/[0.06]"
        >
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-slate-100 via-white to-cyan-50/50 dark:from-[#070e1c] dark:via-[#091122] dark:to-[#050a14] border border-cyan-500/30 flex flex-col sm:flex-row items-center justify-between gap-6 text-left">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-cyan-100 text-cyan-800 dark:bg-cyan-950 dark:text-cyan-300">
                  <Terminal className="w-3 h-3" />
                  <span>Interactive Demonstration Environment</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                  Looking for the interactive demo workspace?
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-xl leading-relaxed">
                  Test the client-side profile creation, log new engineering diary milestones, and explore the 1-click GitHub REST API synchronizer in a dedicated sandbox.
                </p>
              </div>

              <Link
                href="/workspace"
                className="shrink-0 min-h-[46px] inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white dark:bg-cyan-600 dark:hover:bg-cyan-500 dark:text-slate-950 font-bold text-xs shadow-md shadow-cyan-500/20 transition-all active:scale-95"
              >
                <span>Launch Workspace Demo</span>
                <ArrowRight className="w-4 h-4 text-cyan-400 dark:text-slate-950" />
              </Link>
            </div>
          </div>
        </section>

        {/* 7. CONTACT & INQUIRIES SECTION */}
        <section
          id="contact"
          aria-label="Contact Information"
          className="py-16 sm:py-24"
        >
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-10">

            <div className="space-y-3">
              <div className="text-xs font-mono font-semibold uppercase tracking-wider text-cyan-600 dark:text-cyan-400">
                Let&apos;s Connect
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                Get In Touch
              </h2>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-xl mx-auto leading-relaxed">
                I am actively seeking software development internships, graduate software engineering opportunities, and technical interview discussions.
              </p>
            </div>

            {/* Contact Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">

              {/* GitHub */}
              <div className="p-5 rounded-2xl bg-white dark:bg-[#080d19] border border-slate-200 dark:border-cyan-950/50 space-y-2 shadow-xs">
                <div className="w-8 h-8 rounded-lg bg-slate-500/10 text-slate-700 dark:text-slate-300 flex items-center justify-center">
                  <GithubIcon className="w-4 h-4" />
                </div>
                <div className="text-xs font-bold text-slate-900 dark:text-white">GitHub</div>
                <a
                  href={profile.contact?.github || "https://github.com/THARANESHSELVAM"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-mono text-cyan-700 dark:text-cyan-400 hover:underline block truncate"
                >
                  github.com/THARANESHSELVAM ↗
                </a>
                <p className="text-[11px] text-slate-500">Public repositories, commits &amp; open source code</p>
              </div>

              {/* Education & Campus */}
              <div className="p-5 rounded-2xl bg-white dark:bg-[#080d19] border border-slate-200 dark:border-cyan-950/50 space-y-2 shadow-xs">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <div className="text-xs font-bold text-slate-900 dark:text-white">Education &amp; Campus</div>
                <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                  Sri Krishna College of Engineering and Technology
                </div>
                <p className="text-[11px] text-slate-500">Integrated M.Tech in CSE (2025–2030) • Coimbatore, Tamil Nadu</p>
              </div>

              {/* Location & Availability */}
              <div className="p-5 rounded-2xl bg-white dark:bg-[#080d19] border border-slate-200 dark:border-cyan-950/50 space-y-2 shadow-xs">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <MapPin className="w-4 h-4" />
                </div>
                <div className="text-xs font-bold text-slate-900 dark:text-white">Location &amp; Availability</div>
                <div className="text-xs font-mono text-slate-800 dark:text-slate-200">
                  {profile.contact?.location || "India / Open to Remote & Relocation"}
                </div>
                <p className="text-[11px] text-slate-500">Open to internships, remote roles &amp; technical interviews</p>
              </div>

            </div>

          </div>
        </section>

      </main>

      {/* ================= FOOTER ================= */}
      <footer className="border-t border-slate-200 dark:border-cyan-950/40 bg-slate-100 dark:bg-[#040711] py-10 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-600 dark:text-slate-400">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 font-extrabold text-[10px] flex items-center justify-center">
                TS
              </div>
              <span>&copy; 2026 Tharanesh Selvam. All rights reserved.</span>
            </div>

            <div className="flex items-center gap-4">
              <a
                href={profile.contact?.github || "https://github.com/THARANESHSELVAM"}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
                aria-label="GitHub Profile"
              >
                <GithubIcon className="w-4 h-4" />
              </a>
              {profile.contact?.linkedin ? (
                <a
                  href={profile.contact.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
                  aria-label="LinkedIn Profile"
                >
                  <LinkedinIcon className="w-4 h-4" />
                </a>
              ) : null}
              {profile.contact?.email ? (
                <a
                  href={`mailto:${profile.contact.email}`}
                  className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
                  aria-label="Email Tharanesh"
                >
                  <Mail className="w-4 h-4" />
                </a>
              ) : null}
              <button
                type="button"
                onClick={scrollToTop}
                className="ml-2 inline-flex items-center gap-1 text-slate-700 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors cursor-pointer"
                aria-label="Back to top"
              >
                <ArrowUp className="w-3.5 h-3.5" />
                <span>Top</span>
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* ================= MODAL: CASE STUDY DEEP DIVE ================= */}
      {activeCaseStudyProject && (
        <CaseStudyModal
          project={activeCaseStudyProject}
          projects={projects}
          isOpen={Boolean(activeCaseStudyProject)}
          onClose={() => setActiveCaseStudyProject(null)}
          onSelectProject={(p) => setActiveCaseStudyProject(p)}
        />
      )}

    </div>
  );
}

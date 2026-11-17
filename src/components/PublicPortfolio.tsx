"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  FileText,
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
  Terminal,
  Briefcase,
  Award,
  Sparkles,
  Database
} from "lucide-react";
import { GithubIcon } from "@/components/Icons";
import { ThemeToggle } from "@/components/ThemeToggle";
import { CaseStudyModal } from "@/components/CaseStudyModal";
import {
  Project,
  INITIAL_PROFILE_STATE,
  INITIAL_PROJECTS,
  generateDynamicPlainTextResume
} from "@/data/profile";

export function PublicPortfolio() {
  const profile = INITIAL_PROFILE_STATE;
  const projects = profile.projects && profile.projects.length > 0 ? profile.projects : INITIAL_PROJECTS;

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

  // 7 Primary Navigation Links
  const navLinks = [
    { label: "Home", href: "#home" },
    { label: "About", href: "#about" },
    { label: "Projects", href: "#projects" },
    { label: "Skills", href: "#skills" },
    { label: "Experience", href: "#experience" },
    { label: "Résumé", href: "#resume" },
    { label: "Contact", href: "#contact" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 dark:bg-[#07090e] dark:text-slate-100 transition-colors duration-200">

      {/* ================= STICKY HEADER & REFINED NAVIGATION ================= */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-[#090d14]/85 backdrop-blur-md border-b border-slate-200/80 dark:border-white/[0.07] transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-4">

            {/* Brand Monogram & Name */}
            <Link
              href="#home"
              className="flex items-center gap-3 group text-left cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-500 rounded-lg shrink-0"
              aria-label="Tharanesh Selvam Home"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-slate-900 to-slate-800 text-white dark:from-white/10 dark:to-white/5 dark:text-cyan-400 border border-slate-300 dark:border-white/15 flex items-center justify-center font-bold text-xs tracking-wider shadow-sm group-hover:border-cyan-500/50 transition-colors">
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

            {/* Desktop Navigation Links (7 Core Sections) */}
            <nav
              aria-label="Primary Portfolio Navigation"
              className="hidden lg:flex items-center gap-1 bg-slate-100/90 dark:bg-white/[0.04] px-2.5 py-1 rounded-full border border-slate-200/80 dark:border-white/[0.08] backdrop-blur-md text-xs font-medium"
            >
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="px-3 py-1.5 rounded-full text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 dark:text-slate-400 dark:hover:text-white dark:hover:bg-white/[0.08] transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </nav>

            {/* Right Action Cluster: Theme Toggle & Mobile Toggle */}
            <div className="flex items-center gap-2.5 shrink-0">
              <ThemeToggle />

              {/* Mobile Menu Button */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/[0.05] dark:hover:bg-white/[0.1] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/[0.08]"
                aria-label="Toggle navigation menu"
                aria-expanded={mobileMenuOpen}
              >
                {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </button>
            </div>

          </div>

          {/* Mobile Dropdown Nav */}
          {mobileMenuOpen && (
            <div className="lg:hidden py-3 border-t border-slate-200 dark:border-white/[0.08] space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="grid grid-cols-2 gap-1.5 text-xs font-medium">
                {navLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-white/[0.04] text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/[0.08] transition-colors"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
              <div className="pt-2 border-t border-slate-100 dark:border-white/[0.06]">
                <Link
                  href="/workspace"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 dark:bg-white/[0.04] text-slate-600 dark:text-slate-400 text-xs font-mono hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
                >
                  <Terminal className="w-3.5 h-3.5" />
                  <span>Developer Workspace Demo ↗</span>
                </Link>
              </div>
            </div>
          )}

        </div>
      </header>

      {/* ================= MAIN CONTENT ================= */}
      <main className="flex-1">

        {/* ================= 1. HOME SECTION ================= */}
        <section
          id="home"
          aria-label="Home & Overview"
          className="relative pt-16 pb-20 sm:pt-24 sm:pb-28 border-b border-slate-200/80 dark:border-white/[0.06] overflow-hidden"
        >
          {/* Subtle Ambient Gradient Surface */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[320px] bg-gradient-to-tr from-cyan-500/10 via-slate-400/5 to-transparent rounded-full blur-3xl pointer-events-none -z-10 opacity-60 dark:opacity-40" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-start">

              {/* Left Column: Hero Narrative (7 cols) */}
              <div className="lg:col-span-7 space-y-6 text-left">

                {/* Status Beacon & Academic Badge */}
                <div className="flex flex-wrap items-center gap-2.5 text-xs">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/[0.08] dark:bg-emerald-500/10 border border-emerald-500/25 text-emerald-800 dark:text-emerald-300 font-medium">
                    <span className="relative flex h-2 w-2" aria-hidden="true">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                    </span>
                    <span>Open to Software Development Roles</span>
                  </div>

                  <span className="text-slate-300 dark:text-slate-700 hidden sm:inline" aria-hidden="true">•</span>

                  <div className="inline-flex items-center gap-1.5 text-slate-600 dark:text-slate-400 font-medium">
                    <GraduationCap className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400 shrink-0" aria-hidden="true" />
                    <span>Integrated M.Tech CSE (2025–2030) · Pursuing</span>
                  </div>
                </div>

                {/* Dominant Headline: Identity & Subtitle */}
                <div className="space-y-2">
                  <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.1]">
                    THARANESH SELVAM
                  </h1>
                  <p className="text-lg sm:text-xl font-bold text-cyan-700 dark:text-cyan-400 tracking-tight">
                    Software Developer | M.Tech CSE
                  </p>
                </div>

                {/* Intro Value Proposition */}
                <p className="text-base sm:text-lg text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
                  I build interactive web applications and explore software engineering through hands-on projects, experimentation, and continuous learning.
                </p>

                {/* Academic Context Statement */}
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-xl font-normal">
                  Student at Sri Krishna College of Engineering and Technology pursuing a Five-Year Integrated M.Tech in Computer Science and Engineering. Dedicated to component-driven UI architecture, strict type safety, and foundational computing fundamentals with AI-assisted engineering workflows.
                </p>

                {/* Action CTA Buttons */}
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
                    className="min-h-[46px] inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/[0.04] dark:hover:bg-white/[0.08] text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-white/[0.08] font-medium text-xs sm:text-sm transition-all"
                  >
                    <GithubIcon className="w-4 h-4 text-slate-700 dark:text-slate-300" />
                    <span>GitHub Profile ↗</span>
                  </a>
                </div>

                {/* Verified Location Strip */}
                <div className="pt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-600 dark:text-slate-400">
                  <div className="inline-flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                    <MapPin className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400 shrink-0" />
                    <span>Tamil Nadu, India · Open to Remote &amp; Relocation</span>
                  </div>
                </div>

              </div>

              {/* Right Column: Recruiter Snapshot Card (5 cols) */}
              <div className="lg:col-span-5 text-left">
                <div className="rounded-3xl p-6 sm:p-7 bg-white dark:bg-[#0c101a] border border-slate-200/90 dark:border-white/[0.08] shadow-lg shadow-slate-100/50 dark:shadow-none space-y-5">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-white/[0.06]">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                      <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                        Recruiter Snapshot
                      </span>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-50 dark:bg-cyan-950/60 text-cyan-700 dark:text-cyan-300 border border-cyan-200/60 dark:border-cyan-500/30">
                      Verified
                    </span>
                  </div>

                  <dl className="space-y-3.5 text-xs">
                    <div>
                      <dt className="text-[11px] font-mono text-slate-400 dark:text-slate-500 uppercase">Degree &amp; Institution</dt>
                      <dd className="font-semibold text-slate-900 dark:text-white pt-0.5">
                        Five-Year Integrated M.Tech in Computer Science and Engineering
                      </dd>
                      <dd className="text-slate-600 dark:text-slate-400 text-[11px]">
                        Sri Krishna College of Engineering and Technology (2025–2030)
                      </dd>
                    </div>

                    <div className="pt-2 border-t border-slate-100 dark:border-white/[0.04]">
                      <dt className="text-[11px] font-mono text-slate-400 dark:text-slate-500 uppercase">Target Roles</dt>
                      <dd className="font-semibold text-slate-900 dark:text-white pt-0.5">
                        Software Development Internships · Full-Stack Web Engineering
                      </dd>
                    </div>

                    <div className="pt-2 border-t border-slate-100 dark:border-white/[0.04]">
                      <dt className="text-[11px] font-mono text-slate-400 dark:text-slate-500 uppercase">Primary Tech Stack</dt>
                      <dd className="text-slate-700 dark:text-slate-300 pt-0.5">
                        Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4
                      </dd>
                    </div>

                    <div className="pt-2 border-t border-slate-100 dark:border-white/[0.04]">
                      <dt className="text-[11px] font-mono text-slate-400 dark:text-slate-500 uppercase">Development Methodology</dt>
                      <dd className="text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed pt-0.5">
                        Hands-on application development with AI-assisted engineering (Antigravity), focusing on architecture, testing, and continuous learning.
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ================= 2. ABOUT SECTION ================= */}
        <section
          id="about"
          aria-label="About Me & Engineering Journey"
          className="py-16 sm:py-24 border-b border-slate-200/80 dark:border-white/[0.06]"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">

            {/* Section Header */}
            <div className="space-y-2 text-left max-w-2xl">
              <div className="text-xs font-mono font-semibold uppercase tracking-wider text-cyan-600 dark:text-cyan-400">
                Background &amp; Focus
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                About Me
              </h2>
              <p className="text-xs sm:text-sm md:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
                Student, software developer, and continuous learner exploring computer science fundamentals and modern web architectures.
              </p>
            </div>

            {/* Personal Intro & Education Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start text-left">

              {/* Personal Intro Narrative (7 cols) */}
              <div className="lg:col-span-7 space-y-4 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                <p>
                  I am a computer science student pursuing a <strong className="text-slate-900 dark:text-white font-semibold">Five-Year Integrated M.Tech in Computer Science and Engineering</strong> at <strong className="text-slate-900 dark:text-white font-semibold">Sri Krishna College of Engineering and Technology</strong> (2025–2030).
                </p>
                <p>
                  My engineering journey focuses on building practical web software, strengthening algorithmic problem-solving skills, and understanding the systems behind the user interface. I enjoy turning complex problem statements into clean, component-driven user experiences.
                </p>
                <p>
                  I approach development as a rigorous, iterative discipline. Using AI-assisted development environments like <strong className="text-slate-900 dark:text-white font-semibold">Antigravity</strong>, I prototype, test state persistence, review generated code, and study modern framework patterns, continuously deepening my independent understanding of the underlying technology stack.
                </p>

                {/* Academic Credentials Banner */}
                <div className="pt-2">
                  <div className="p-5 rounded-2xl bg-white dark:bg-[#0c101a] border border-slate-200 dark:border-white/[0.08] space-y-2 shadow-xs">
                    <div className="flex items-center gap-2 text-xs font-mono font-bold text-cyan-700 dark:text-cyan-400">
                      <GraduationCap className="w-4 h-4" />
                      <span>Academic Foundation</span>
                    </div>
                    <div className="text-sm font-bold text-slate-900 dark:text-white">
                      Sri Krishna College of Engineering and Technology
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      Five-Year Integrated M.Tech in Computer Science and Engineering (2025–2030) · Pursuing
                    </p>
                    <p className="text-[11px] text-slate-500 font-mono">
                      Coimbatore, Tamil Nadu · Department of Computer Science &amp; Engineering
                    </p>
                  </div>
                </div>
              </div>

              {/* Three Career Interests Cards (5 cols) */}
              <div className="lg:col-span-5 space-y-3.5 text-left">
                <div className="text-xs font-mono font-bold uppercase tracking-wider text-slate-900 dark:text-white pb-1">
                  Active Areas of Exploration
                </div>

                {/* Interest 1: Software Engineering */}
                <div className="p-4 rounded-2xl bg-white dark:bg-[#0c101a] border border-slate-200 dark:border-white/[0.08] space-y-1 shadow-xs">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white">
                    <Code2 className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                    <span>1. Software Engineering</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    Building structured problem-solving fundamentals, debugging techniques, version control with Git, and clean software architecture.
                  </p>
                </div>

                {/* Interest 2: Full-Stack Development */}
                <div className="p-4 rounded-2xl bg-white dark:bg-[#0c101a] border border-slate-200 dark:border-white/[0.08] space-y-1 shadow-xs">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white">
                    <Layers className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span>2. Full-Stack Development</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    Exploring how user interfaces, backend services, RESTful APIs, and browser data persistence interact across modern web applications.
                  </p>
                </div>

                {/* Interest 3: AI/ML & Data Science */}
                <div className="p-4 rounded-2xl bg-white dark:bg-[#0c101a] border border-slate-200 dark:border-white/[0.08] space-y-1 shadow-xs">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white">
                    <Cpu className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                    <span>3. AI/ML &amp; Data Science</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    Developing a foundational understanding of Python, statistical analysis, mathematical concepts, and core machine learning principles.
                  </p>
                </div>

                <p className="text-[11px] text-slate-500 font-mono leading-relaxed pt-1">
                  * These represent current areas of academic exploration as I build my foundation across computer science disciplines.
                </p>
              </div>

            </div>

            {/* Concise Engineering Journey */}
            <div className="pt-8 border-t border-slate-200/80 dark:border-white/[0.06] space-y-6 text-left">
              <div className="space-y-1">
                <div className="text-xs font-mono font-semibold uppercase tracking-wider text-cyan-600 dark:text-cyan-400">
                  Chronological Progression
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                  Engineering Journey
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-5 rounded-2xl bg-white dark:bg-[#0c101a] border border-slate-200 dark:border-white/[0.08] space-y-2">
                  <div className="text-xs font-mono font-bold text-cyan-600 dark:text-cyan-400">
                    2025 · Academic Foundation
                  </div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                    Core Computer Science Studies
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    Commenced Five-Year Integrated M.Tech in CSE at SKCET. Focused on core programming fundamentals, discrete mathematics, and software design principles.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-white dark:bg-[#0c101a] border border-slate-200 dark:border-white/[0.08] space-y-2">
                  <div className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    2026 · Applied Web Engineering
                  </div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                    Personal Portfolio Application
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    Engineered personal portfolio using Next.js 16 App Router, React 19, TypeScript, and Tailwind CSS v4 with client-side state persistence and dynamic ATS résumé export.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-white dark:bg-[#0c101a] border border-slate-200 dark:border-white/[0.08] space-y-2">
                  <div className="text-xs font-mono font-bold text-purple-600 dark:text-purple-400">
                    2026 &amp; Future · Systems &amp; AI Focus
                  </div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                    Architectural Research &amp; Internships
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    Explored GIS land governance concepts (Land Stack) and study of machine learning mathematics, actively seeking software development internship opportunities.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* ================= 3. PROJECTS SECTION ================= */}
        <section
          id="projects"
          aria-label="Featured Projects & Conceptual Studies"
          className="py-16 sm:py-24 border-b border-slate-200/80 dark:border-white/[0.06]"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">

            {/* Section Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200/80 dark:border-white/[0.08] pb-6 text-left">
              <div className="space-y-2 max-w-2xl">
                <div className="text-xs font-mono font-semibold uppercase tracking-wider text-cyan-600 dark:text-cyan-400">
                  Portfolio Showcase
                </div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                  Featured Work &amp; Concepts
                </h2>
                <p className="text-xs sm:text-sm md:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
                  Active software applications, early architectural concepts, and exploratory study areas documenting practical skills and learning progress.
                </p>
              </div>

              <span className="text-xs font-mono px-3 py-1 rounded-full bg-slate-100 dark:bg-white/[0.04] text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-white/[0.08] self-start md:self-auto shrink-0">
                Featured Work
              </span>
            </div>

            {/* Project Cards Grid (Priority Order) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-left">
              {projects.map((project) => {
                const caseStudy = project.caseStudy;
                const isLive = project.id === "personal-portfolio";
                const isConcept = project.id === "land-stack";

                return (
                  <article
                    key={project.id}
                    className="rounded-3xl p-6 sm:p-7 bg-white dark:bg-[#0c101a] border border-slate-200/90 dark:border-white/[0.08] shadow-md shadow-slate-100/50 dark:shadow-none flex flex-col justify-between space-y-6 hover:border-cyan-500/40 dark:hover:border-cyan-400/30 transition-all duration-300"
                  >
                    <div className="space-y-5">
                      {/* Status & Domain Badges */}
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-100 dark:bg-white/[0.05] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/[0.08]">
                          {project.domainTag || project.category}
                        </span>

                        {isLive && (
                          <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            Live Application
                          </span>
                        )}
                        {isConcept && (
                          <span className="text-[10px] font-mono text-amber-600 dark:text-amber-400 font-semibold flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                            Early-Stage Concept
                          </span>
                        )}
                        {!isLive && !isConcept && (
                          <span className="text-[10px] font-mono text-purple-600 dark:text-purple-400 font-semibold flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/20">
                            <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                            Learning Focus
                          </span>
                        )}
                      </div>

                      {/* Title & Snippet */}
                      <div className="space-y-1">
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                          {project.title}
                        </h3>
                        {project.noveltySnippet && (
                          <p className="text-xs text-cyan-700 dark:text-cyan-400 font-mono">
                            {project.noveltySnippet}
                          </p>
                        )}
                      </div>

                      {/* Problem Statement */}
                      <div className="space-y-1 text-xs">
                        <span className="font-semibold text-slate-800 dark:text-slate-200 uppercase tracking-wider font-mono text-[10px] block">
                          Problem Context:
                        </span>
                        <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                          {project.problemSolved}
                        </p>
                      </div>

                      {/* Solution Scope */}
                      <div className="space-y-1 text-xs">
                        <span className="font-semibold text-slate-800 dark:text-slate-200 uppercase tracking-wider font-mono text-[10px] block">
                          {isLive ? "Implementation:" : isConcept ? "Conceptual Architecture:" : "Study Scope:"}
                        </span>
                        <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                          {project.solution}
                        </p>
                      </div>

                      {/* Technologies Supported by Actual Implementation */}
                      <div className="space-y-2 pt-1">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
                          {isLive ? "Demonstrated Technologies:" : "Focus Areas / Concepts:"}
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {project.techStack.map((tech) => (
                            <span
                              key={tech}
                              className="px-2 py-0.5 rounded-md text-[11px] font-mono bg-slate-100 text-slate-800 dark:bg-white/[0.05] dark:text-slate-300 border border-slate-200/80 dark:border-white/[0.08]"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Action Footers: View Details & Links */}
                    <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-white/[0.06]">
                      {caseStudy && (
                        <button
                          type="button"
                          id={`case-study-btn-${project.id}`}
                          onClick={() => setActiveCaseStudyProject(project)}
                          className="w-full min-h-[42px] inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white dark:bg-white/[0.08] dark:hover:bg-white/[0.14] dark:text-white text-xs font-semibold transition-all cursor-pointer shadow-xs active:scale-95 group"
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

        {/* ================= 4. SKILLS SECTION ================= */}
        <section
          id="skills"
          aria-label="Technical Skills Matrix"
          className="py-16 sm:py-24 border-b border-slate-200/80 dark:border-white/[0.06] bg-slate-100/50 dark:bg-[#05070c]"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">

            {/* Section Header */}
            <div className="space-y-2 text-left max-w-2xl">
              <div className="text-xs font-mono font-semibold uppercase tracking-wider text-cyan-600 dark:text-cyan-400">
                Core Competencies
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                Technical Skills Matrix
              </h2>
              <p className="text-xs sm:text-sm md:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
                Organized into technologies demonstrably used in projects and foundational academic study areas.
              </p>
            </div>

            {/* 5 Distinct Skill Categories Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">

              {/* 1. Programming Languages */}
              <div className="p-6 rounded-3xl bg-white dark:bg-[#0c101a] border border-slate-200/90 dark:border-white/[0.08] space-y-4 shadow-xs">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
                    <Code2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">Programming Languages</h3>
                    <p className="text-[10px] text-slate-500 font-mono">Core languages &amp; typing</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { name: "TypeScript", used: true },
                    { name: "JavaScript (ES6+)", used: true },
                    { name: "Python", used: false, label: "Learning" },
                    { name: "HTML5 & CSS3", used: true },
                    { name: "SQL", used: false, label: "Foundations" },
                  ].map((s) => (
                    <span
                      key={s.name}
                      className={`px-2.5 py-1 rounded-xl text-xs font-medium border ${
                        s.used
                          ? "bg-cyan-50/70 text-cyan-900 border-cyan-200 dark:bg-cyan-950/40 dark:text-cyan-300 dark:border-cyan-500/30"
                          : "bg-slate-100 text-slate-700 border-slate-200 dark:bg-white/[0.04] dark:text-slate-300 dark:border-white/[0.08]"
                      }`}
                    >
                      {s.name} {s.label && <span className="text-[10px] font-mono opacity-70">({s.label})</span>}
                    </span>
                  ))}
                </div>
              </div>

              {/* 2. Frontend Development */}
              <div className="p-6 rounded-3xl bg-white dark:bg-[#0c101a] border border-slate-200/90 dark:border-white/[0.08] space-y-4 shadow-xs">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                    <Layers className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">Frontend Development</h3>
                    <p className="text-[10px] text-slate-500 font-mono">Modern component frameworks</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { name: "Next.js 16 (App Router)", used: true },
                    { name: "React 19", used: true },
                    { name: "Tailwind CSS v4", used: true },
                    { name: "Responsive Layouts", used: true },
                    { name: "Web Accessibility (WCAG)", used: true },
                  ].map((s) => (
                    <span
                      key={s.name}
                      className="px-2.5 py-1 rounded-xl text-xs font-medium bg-cyan-50/70 text-cyan-900 border-cyan-200 dark:bg-cyan-950/40 dark:text-cyan-300 dark:border-cyan-500/30 border"
                    >
                      {s.name}
                    </span>
                  ))}
                </div>
              </div>

              {/* 3. Backend Development */}
              <div className="p-6 rounded-3xl bg-white dark:bg-[#0c101a] border border-slate-200/90 dark:border-white/[0.08] space-y-4 shadow-xs">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center">
                    <Server className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">Backend Development</h3>
                    <p className="text-[10px] text-slate-500 font-mono">APIs &amp; protocol integration</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { name: "GitHub REST API", used: true },
                    { name: "RESTful APIs", used: false, label: "Concepts" },
                    { name: "Node.js", used: false, label: "Foundations" },
                    { name: "Client-Server Protocols", used: false, label: "Concepts" },
                  ].map((s) => (
                    <span
                      key={s.name}
                      className={`px-2.5 py-1 rounded-xl text-xs font-medium border ${
                        s.used
                          ? "bg-cyan-50/70 text-cyan-900 border-cyan-200 dark:bg-cyan-950/40 dark:text-cyan-300 dark:border-cyan-500/30"
                          : "bg-slate-100 text-slate-700 border-slate-200 dark:bg-white/[0.04] dark:text-slate-300 dark:border-white/[0.08]"
                      }`}
                    >
                      {s.name} {s.label && <span className="text-[10px] font-mono opacity-70">({s.label})</span>}
                    </span>
                  ))}
                </div>
              </div>

              {/* 4. Database Management */}
              <div className="p-6 rounded-3xl bg-white dark:bg-[#0c101a] border border-slate-200/90 dark:border-white/[0.08] space-y-4 shadow-xs">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                    <Database className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">Database Management</h3>
                    <p className="text-[10px] text-slate-500 font-mono">Schemas &amp; state persistence</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { name: "LocalStorage Persistence", used: true },
                    { name: "Relational Modeling", used: false, label: "Foundations" },
                    { name: "Spatial Data Concepts", used: false, label: "Exploration" },
                  ].map((s) => (
                    <span
                      key={s.name}
                      className={`px-2.5 py-1 rounded-xl text-xs font-medium border ${
                        s.used
                          ? "bg-cyan-50/70 text-cyan-900 border-cyan-200 dark:bg-cyan-950/40 dark:text-cyan-300 dark:border-cyan-500/30"
                          : "bg-slate-100 text-slate-700 border-slate-200 dark:bg-white/[0.04] dark:text-slate-300 dark:border-white/[0.08]"
                      }`}
                    >
                      {s.name} {s.label && <span className="text-[10px] font-mono opacity-70">({s.label})</span>}
                    </span>
                  ))}
                </div>
              </div>

              {/* 5. Development Tools */}
              <div className="p-6 rounded-3xl bg-white dark:bg-[#0c101a] border border-slate-200/90 dark:border-white/[0.08] space-y-4 shadow-xs md:col-span-2 lg:col-span-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                    <Cloud className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">Development Tools &amp; Workflows</h3>
                    <p className="text-[10px] text-slate-500 font-mono">Version control, AI tooling &amp; hosting</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { name: "Git & GitHub", used: true, label: "AI-assisted guidance" },
                    { name: "Antigravity IDE", used: true, label: "AI environment" },
                    { name: "VS Code", used: true },
                    { name: "Vercel Edge Platform", used: true },
                    { name: "npm", used: true },
                  ].map((s) => (
                    <span
                      key={s.name}
                      className="px-2.5 py-1 rounded-xl text-xs font-medium bg-cyan-50/70 text-cyan-900 border-cyan-200 dark:bg-cyan-950/40 dark:text-cyan-300 dark:border-cyan-500/30 border"
                    >
                      {s.name} {s.label && <span className="text-[10px] font-mono opacity-70">({s.label})</span>}
                    </span>
                  ))}
                </div>
              </div>

            </div>

            {/* Skills Legend & Workspace Callout */}
            <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500 font-mono">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-500" />
                  <span>Used in Projects</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-400 dark:bg-slate-600" />
                  <span>Foundational / In Progress</span>
                </span>
              </div>
              <p>
                Full interactive evidence matrix preserved in the developer workspace.
              </p>
            </div>

          </div>
        </section>

        {/* ================= 5. EXPERIENCE SECTION ================= */}
        <section
          id="experience"
          aria-label="Education & Experience"
          className="py-16 sm:py-24 border-b border-slate-200/80 dark:border-white/[0.06]"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">

            {/* Section Header */}
            <div className="space-y-2 text-left max-w-2xl">
              <div className="text-xs font-mono font-semibold uppercase tracking-wider text-cyan-600 dark:text-cyan-400">
                Background &amp; Credentials
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                Education &amp; Experience
              </h2>
              <p className="text-xs sm:text-sm md:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
                Academic qualifications, hands-on software development roles, and verified technical training.
              </p>
            </div>

            {/* 3 Genuine Experience Blocks Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">

              {/* 1. Academic Qualification */}
              <div className="p-6 rounded-3xl bg-white dark:bg-[#0c101a] border border-slate-200/90 dark:border-white/[0.08] space-y-4 shadow-xs flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs font-mono text-cyan-700 dark:text-cyan-400">
                    <span className="flex items-center gap-1.5">
                      <GraduationCap className="w-4 h-4" />
                      <span>Academic Degree</span>
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-cyan-50 dark:bg-cyan-950/60 border border-cyan-200/60 dark:border-cyan-500/30">
                      2025–2030
                    </span>
                  </div>

                  <div>
                    <h3 className="font-bold text-base text-slate-900 dark:text-white">
                      Five-Year Integrated M.Tech in Computer Science and Engineering
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400 pt-0.5">
                      Sri Krishna College of Engineering and Technology (SKCET)
                    </p>
                    <p className="text-[11px] text-slate-400 font-mono">
                      Coimbatore, Tamil Nadu · Pursuing
                    </p>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    Integrated postgraduate curriculum spanning foundational computer science, discrete mathematics, data structures, algorithms, and software engineering principles.
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-white/[0.06] text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                  ✓ Verified Enrollment
                </div>
              </div>

              {/* 2. Engineering Project Roles */}
              <div className="p-6 rounded-3xl bg-white dark:bg-[#0c101a] border border-slate-200/90 dark:border-white/[0.08] space-y-4 shadow-xs flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs font-mono text-emerald-700 dark:text-emerald-400">
                    <span className="flex items-center gap-1.5">
                      <Briefcase className="w-4 h-4" />
                      <span>Engineering Roles</span>
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/60 dark:border-emerald-500/30">
                      2026
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                        Lead Developer — Portfolio Application
                      </h3>
                      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed pt-0.5">
                        Architected Next.js 16 web application with React 19, strict TypeScript, responsive Tailwind CSS, client persistence, and ATS export using Antigravity AI assistance.
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-100 dark:border-white/[0.04]">
                      <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                        Project Researcher — Land Stack Concept
                      </h3>
                      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed pt-0.5">
                        Conceptualized GIS land governance workflows, spatial data schemas, and cadastral parcel boundary models.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-white/[0.06] text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                  ✓ Applied Implementation
                </div>
              </div>

              {/* 3. Verified Certifications & Training */}
              <div className="p-6 rounded-3xl bg-white dark:bg-[#0c101a] border border-slate-200/90 dark:border-white/[0.08] space-y-4 shadow-xs flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs font-mono text-purple-700 dark:text-purple-400">
                    <span className="flex items-center gap-1.5">
                      <Award className="w-4 h-4" />
                      <span>Technical Training</span>
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-purple-50 dark:bg-purple-950/60 border border-purple-200/60 dark:border-purple-500/30">
                      Verified
                    </span>
                  </div>

                  <div>
                    <h3 className="font-bold text-base text-slate-900 dark:text-white">
                      Verified Technical Certifications
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400 pt-0.5">
                      Independent course completions and hands-on skill validation.
                    </p>
                  </div>

                  <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-500 shrink-0 mt-1.5" />
                      <div>
                        <strong className="text-slate-900 dark:text-white">Modern Web Development:</strong> Next.js, React, TypeScript component architecture and hooks.
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-500 shrink-0 mt-1.5" />
                      <div>
                        <strong className="text-slate-900 dark:text-white">Version Control:</strong> Git &amp; GitHub fundamentals, branching, commits, and synchronization.
                      </div>
                    </li>
                  </ul>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-white/[0.06] text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                  ✓ Genuine Credentials Only
                </div>
              </div>

            </div>

          </div>
        </section>

        {/* ================= 6. RESUME SECTION ================= */}
        <section
          id="resume"
          aria-label="ATS Resume Showcase & Download"
          className="py-16 sm:py-24 border-b border-slate-200/80 dark:border-white/[0.06] bg-slate-100/50 dark:bg-[#05070c]"
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

            {/* Resume Action Bar (PDF Print as Primary Action) */}
            <div className="flex flex-wrap items-center justify-center gap-3">
              {/* PRIMARY: Print / Save PDF */}
              <button
                type="button"
                onClick={handlePrintPdf}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-950 hover:bg-slate-800 text-white dark:bg-white dark:hover:bg-slate-100 dark:text-slate-950 text-xs sm:text-sm font-semibold shadow-md transition-all active:scale-95 cursor-pointer"
              >
                <Printer className="w-4 h-4 text-cyan-400 dark:text-cyan-600" />
                <span>Print / Save as PDF</span>
              </button>

              {/* SECONDARY: Download TXT */}
              <button
                type="button"
                onClick={handleDownloadTxt}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 dark:bg-white/[0.05] dark:hover:bg-white/[0.1] text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-white/[0.1] text-xs font-medium transition-all active:scale-95 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Plain-Text (.txt)</span>
              </button>

              {/* SECONDARY: Copy Text */}
              <button
                type="button"
                onClick={handleCopyResumeText}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 dark:bg-white/[0.05] dark:hover:bg-white/[0.1] text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-white/[0.1] text-xs font-medium transition-all active:scale-95 cursor-pointer"
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

            {/* Visual ATS Document Card (Target for Print via id="resume-document-container") */}
            <div
              id="resume-document-container"
              className="rounded-3xl bg-white dark:bg-[#0c101a] border border-slate-200/90 dark:border-white/[0.08] p-6 sm:p-10 text-left space-y-8 shadow-xl"
            >

              {/* Document Header */}
              <div className="border-b border-slate-200 dark:border-white/[0.08] pb-6 space-y-2">
                <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white uppercase">
                  {profile.name}
                </h3>
                <p className="text-sm font-semibold text-cyan-700 dark:text-cyan-400">
                  Integrated M.Tech CSE Student | Aspiring Software Engineer
                </p>
                <div className="text-xs font-mono text-slate-500 dark:text-slate-400 pt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
                  <span>Tamil Nadu, India</span>
                  <span>•</span>
                  <a
                    href="https://github.com/THARANESHSELVAM"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline text-cyan-700 dark:text-cyan-400"
                  >
                    github.com/THARANESHSELVAM
                  </a>
                </div>
              </div>

              {/* Professional Summary */}
              <div className="space-y-2">
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-900 dark:text-white border-b border-slate-100 dark:border-white/[0.06] pb-1">
                  Professional Summary
                </h4>
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  {profile.resume?.summary ||
                    "Integrated M.Tech in Computer Science and Engineering candidate at Sri Krishna College of Engineering and Technology (2025–2030) with hands-on experience building modern, responsive web applications using Next.js, React, TypeScript, and Tailwind CSS with AI-assisted workflows. Eager to solve real-world problems through clean code, structured learning, and engineering fundamentals."}
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
                        <div className="text-slate-600 dark:text-slate-400">{edu.institution}</div>
                      </div>
                      <div className="font-mono text-xs text-slate-500 dark:text-slate-400 shrink-0">
                        {edu.year} · {edu.honors || "Pursuing"}
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
                    <strong className="text-slate-900 dark:text-white">Programming Languages:</strong> TypeScript, JavaScript (ES6+), Python (Foundations), HTML5, CSS3, SQL
                  </p>
                  <p>
                    <strong className="text-slate-900 dark:text-white">Frameworks &amp; Libraries:</strong> Next.js 16 (App Router), React 19, Tailwind CSS v4
                  </p>
                  <p>
                    <strong className="text-slate-900 dark:text-white">Tools &amp; Workflows:</strong> Git, GitHub, Antigravity (AI environment), VS Code, Vercel Edge Platform, npm
                  </p>
                  <p>
                    <strong className="text-slate-900 dark:text-white">Conceptual Study Areas:</strong> RESTful APIs, Relational Data Modeling, Geospatial GIS Concepts, Machine Learning Fundamentals
                  </p>
                </div>
              </div>

              {/* Featured Projects Highlight */}
              <div className="space-y-3 text-xs sm:text-sm">
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-900 dark:text-white border-b border-slate-100 dark:border-white/[0.06] pb-1">
                  Featured Projects &amp; Conceptual Studies
                </h4>
                <div className="space-y-4">
                  {projects.map((proj) => (
                    <div key={proj.id} className="space-y-1">
                      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                        <span className="font-bold text-slate-900 dark:text-white">
                          {proj.title} <span className="font-mono text-xs font-normal text-slate-400">[{proj.domainTag}]</span>
                        </span>
                        <span className="font-mono text-[11px] text-cyan-600 dark:text-cyan-400">
                          {proj.techStack.join(" · ")}
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
                  Certifications &amp; Technical Training
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

        {/* ================= 7. CONTACT SECTION ================= */}
        <section
          id="contact"
          aria-label="Contact Information & Verified Coordinates"
          className="py-16 sm:py-24"
        >
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-10">

            <div className="space-y-3">
              <div className="text-xs font-mono font-semibold uppercase tracking-wider text-cyan-600 dark:text-cyan-400">
                Let&apos;s Connect
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                Contact &amp; Inquiries
              </h2>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-xl mx-auto leading-relaxed">
                I am actively seeking software development internships, engineering discussions, and peer collaboration.
              </p>
            </div>

            {/* Verified Public Channels Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">

              {/* GitHub */}
              <div className="p-5 rounded-2xl bg-white dark:bg-[#0c101a] border border-slate-200 dark:border-white/[0.08] space-y-2 shadow-xs">
                <div className="w-8 h-8 rounded-lg bg-slate-500/10 text-slate-700 dark:text-slate-300 flex items-center justify-center">
                  <GithubIcon className="w-4 h-4" />
                </div>
                <div className="text-xs font-bold text-slate-900 dark:text-white">GitHub</div>
                <a
                  href="https://github.com/THARANESHSELVAM"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-mono text-cyan-700 dark:text-cyan-400 hover:underline block truncate"
                >
                  github.com/THARANESHSELVAM ↗
                </a>
                <p className="text-[11px] text-slate-500">Public repositories, commits &amp; open source code</p>
              </div>

              {/* Education & Campus */}
              <div className="p-5 rounded-2xl bg-white dark:bg-[#0c101a] border border-slate-200 dark:border-white/[0.08] space-y-2 shadow-xs">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <div className="text-xs font-bold text-slate-900 dark:text-white">Education &amp; Campus</div>
                <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                  Sri Krishna College of Engineering and Technology
                </div>
                <p className="text-[11px] text-slate-500">Integrated M.Tech in CSE (2025–2030) · Coimbatore, Tamil Nadu</p>
              </div>

              {/* Location & Availability */}
              <div className="p-5 rounded-2xl bg-white dark:bg-[#0c101a] border border-slate-200 dark:border-white/[0.08] space-y-2 shadow-xs">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <MapPin className="w-4 h-4" />
                </div>
                <div className="text-xs font-bold text-slate-900 dark:text-white">Location &amp; Availability</div>
                <div className="text-xs font-mono text-slate-800 dark:text-slate-200">
                  Tamil Nadu, India
                </div>
                <p className="text-[11px] text-slate-500">Open to internships, remote roles &amp; relocation</p>
              </div>

            </div>

            {/* Inquiries Note regarding unverified email/LinkedIn */}
            <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
              * Direct email and LinkedIn channels will be published upon verification. Inquiries can currently be directed via GitHub.
            </p>

          </div>
        </section>

      </main>

      {/* ================= MINIMAL PREMIUM FOOTER ================= */}
      <footer className="border-t border-slate-200/80 dark:border-white/[0.06] bg-slate-100/60 dark:bg-[#05070c] py-12 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-slate-600 dark:text-slate-400">

            {/* Brand & Copyright */}
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-slate-900 text-white dark:bg-white/10 dark:text-cyan-400 font-bold text-xs flex items-center justify-center border border-slate-300 dark:border-white/10">
                TS
              </div>
              <span>&copy; 2026 Tharanesh Selvam. All rights reserved.</span>
            </div>

            {/* Navigation Anchor Links */}
            <nav
              aria-label="Footer Navigation"
              className="flex flex-wrap items-center justify-center gap-4 text-xs font-medium"
            >
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </nav>

            {/* Right Group: GitHub, Workspace & Back to Top */}
            <div className="flex items-center gap-4">
              <a
                href="https://github.com/THARANESHSELVAM"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
                aria-label="GitHub Profile"
              >
                <GithubIcon className="w-4 h-4" />
              </a>

              {/* Discreet Link to Developer Workspace Demo */}
              <Link
                href="/workspace"
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-medium bg-slate-200/70 hover:bg-slate-300/70 dark:bg-white/[0.05] dark:hover:bg-white/[0.1] text-slate-700 dark:text-slate-300 border border-slate-300/60 dark:border-white/[0.08] transition-colors"
                title="Open the interactive developer workspace (client-side demo sandbox)"
              >
                <Terminal className="w-3 h-3 text-cyan-600 dark:text-cyan-400" />
                <span>Developer Workspace Demo ↗</span>
              </Link>

              <button
                type="button"
                onClick={scrollToTop}
                className="inline-flex items-center gap-1 text-slate-700 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors cursor-pointer"
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

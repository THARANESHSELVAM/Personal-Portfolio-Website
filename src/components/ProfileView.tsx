"use client";

import { useState, useRef } from "react";
import { useProfile } from "@/context/ProfileContext";
import { Hero } from "@/components/Hero";
import { 
  User, 
  Mail, 
  MapPin, 
  ExternalLink, 
  Edit3, 
  Sparkles, 
  Download, 
  Upload, 
  Trash2, 
  RotateCcw, 
  CheckCircle2, 
  BookOpen, 
  Briefcase, 
  FileText, 
  X, 
  Database,
  TrendingUp,
  AlertTriangle,
  Code2,
  GraduationCap,
  Target,
  Layers,
  Wrench
} from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/Icons";

export function ProfileView() {
  const { 
    state, 
    updateProfile, 
    setActiveTab,
    clearWorkspaceData,
    loadCuratedDataset,
    exportProfileJSON,
    importProfileJSON,
    competencyCounts,
    extractedSkills
  } = useProfile();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: state.name,
    title: state.title,
    email: state.contact?.email || "",
    location: state.contact?.location || "",
    phone: state.contact?.phone || "",
    github: state.contact?.github || "",
    linkedin: state.contact?.linkedin || "",
    availabilityType: state.availability?.type || "",
    tagline: state.tagline || "",
    elevatorPitch: state.elevatorPitch || "",
  });

  // Dataset ingestion state
  const [jsonInput, setJsonInput] = useState("");
  const [isJsonModalOpen, setIsJsonModalOpen] = useState(false);
  const [datasetStatus, setDatasetStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name: profileForm.name.trim(),
      preferredName: profileForm.name.split(" ")[0],
      title: profileForm.title.trim(),
      tagline: profileForm.tagline.trim(),
      elevatorPitch: profileForm.elevatorPitch.trim(),
      availability: {
        status: "available",
        type: profileForm.availabilityType,
        badgeText: profileForm.availabilityType,
      },
      contact: {
        ...state.contact,
        email: profileForm.email.trim(),
        location: profileForm.location.trim(),
        phone: profileForm.phone.trim(),
        github: profileForm.github.trim(),
        linkedin: profileForm.linkedin.trim(),
      },
    });
    setIsEditModalOpen(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const success = importProfileJSON(content);
        if (success) {
          setDatasetStatus({ type: "success", message: "Dataset imported successfully! Workspace refreshed." });
          setTimeout(() => setDatasetStatus(null), 4000);
        } else {
          setDatasetStatus({ type: "error", message: "Failed to parse JSON dataset. Please verify schema." });
        }
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handlePasteJsonImport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!jsonInput.trim()) return;

    const success = importProfileJSON(jsonInput);
    if (success) {
      setDatasetStatus({ type: "success", message: "Custom JSON dataset imported successfully!" });
      setJsonInput("");
      setIsJsonModalOpen(false);
      setTimeout(() => setDatasetStatus(null), 4000);
    } else {
      setDatasetStatus({ type: "error", message: "Invalid JSON format. Must contain 'learnings' or 'projects' array." });
    }
  };

  const categories = ["Frontend", "Backend", "Cloud & DevOps", "Data & AI", "System Design"] as const;

  // Grounded technical skill categories for student/entry-level full-stack engineer
  const skillCategories = [
    {
      title: "Frontend Engineering",
      icon: Layers,
      skills: ["React 19", "Next.js 16 (App Router)", "TypeScript", "JavaScript (ES6+)", "Tailwind CSS", "HTML5", "CSS3", "Framer Motion", "Responsive Layouts"],
      description: "Building accessible, performant component architectures with sub-100ms LCP."
    },
    {
      title: "Backend & APIs",
      icon: Code2,
      skills: ["Node.js", "RESTful APIs", "GitHub REST API", "Python", "JSON Data Modeling", "Async Handlers"],
      description: "Developing robust client-server interfaces, external API consumers, and typed data pipelines."
    },
    {
      title: "Developer Tools & Platforms",
      icon: Wrench,
      skills: ["Git", "GitHub", "Vercel", "VS Code", "npm", "Chrome DevTools"],
      description: "Collaborative Git branching, automated continuous deployments, and debugging workflows."
    },
    {
      title: "Engineering Practices",
      icon: Sparkles,
      skills: ["Web Accessibility (WCAG AA)", "Component Architecture", "Semantic HTML", "Strict Type Checking", "Agile Collaboration"],
      description: "Writing maintainable, clean code focused on user experience and reliable software delivery."
    }
  ];

  return (
    <div className="space-y-12 animate-in fade-in duration-200">
      
      {/* 1. Hero Section */}
      <Hero />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Status Feedback Toast */}
        {datasetStatus && (
          <div
            className={`p-4 rounded-2xl flex items-center justify-between gap-3 text-xs sm:text-sm font-semibold border ${
              datasetStatus.type === "success"
                ? "bg-lime-500/10 text-lime-400 border-lime-500/20"
                : "bg-rose-500/10 text-rose-400 border-rose-500/20"
            }`}
          >
            <div className="flex items-center gap-2">
              {datasetStatus.type === "success" ? (
                <CheckCircle2 className="w-4 h-4 shrink-0" />
              ) : (
                <AlertTriangle className="w-4 h-4 shrink-0" />
              )}
              <span>{datasetStatus.message}</span>
            </div>
            <button
              type="button"
              onClick={() => setDatasetStatus(null)}
              className="p-1 rounded-lg hover:bg-white/10"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* 2. About Section: Background, Interests, and Career Goals */}
        <section id="about" className="glass-panel p-6 sm:p-10 rounded-3xl border border-slate-800 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-lime-500/10 text-lime-400 border border-lime-500/20">
                <User className="w-3.5 h-3.5" />
                <span>ABOUT THE DEVELOPER</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Background &amp; Career Aspirations
              </h2>
            </div>

            <button
              type="button"
              onClick={() => {
                setProfileForm({
                  name: state.name,
                  title: state.title,
                  email: state.contact?.email || "",
                  location: state.contact?.location || "",
                  phone: state.contact?.phone || "",
                  github: state.contact?.github || "",
                  linkedin: state.contact?.linkedin || "",
                  availabilityType: state.availability?.type || "",
                  tagline: state.tagline || "",
                  elevatorPitch: state.elevatorPitch || "",
                });
                setIsEditModalOpen(true);
              }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs border border-slate-700 shadow-sm transition-all active:scale-95 self-start sm:self-auto focus-visible:ring-2 focus-visible:ring-lime-400"
            >
              <Edit3 className="w-3.5 h-3.5 text-lime-400" />
              <span>Edit Details</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Story & Background */}
            <div className="lg:col-span-2 space-y-4 text-slate-300 text-sm sm:text-base leading-relaxed">
              <p>
                Hello! I am <strong className="text-white font-semibold">{state.name}</strong>, a Computer Science student and aspiring full-stack software engineer based in {state.contact?.location || "India"}. I specialize in building modern, responsive web applications using React, Next.js, TypeScript, and Tailwind CSS.
              </p>
              <p>
                My focus centers on frontend engineering best practices: creating intuitive user interfaces, maintaining strict type safety, optimizing web performance, and adhering to WCAG accessibility guidelines. I also build backend integration logic and RESTful services with Node.js and TypeScript.
              </p>
              <p>
                I am actively seeking <strong className="text-lime-400 font-semibold">software engineering internships and entry-level developer roles</strong> where I can collaborate with talented engineering teams, contribute high-quality code, and tackle challenging real-world problems.
              </p>
            </div>

            {/* Quick Education & Availability Card */}
            <div className="space-y-4">
              <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
                <div className="flex items-center gap-2 text-xs font-mono font-semibold text-lime-400">
                  <GraduationCap className="w-4 h-4" />
                  <span>EDUCATION</span>
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-white text-sm">
                    B.Tech / B.E. in Computer Science
                  </h4>
                  <p className="text-xs text-slate-400">
                    Graduation Expected: 2026
                  </p>
                  <p className="text-xs text-slate-400">
                    Core: Data Structures, Algorithms, Web Development, Database Systems, Software Engineering.
                  </p>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
                <div className="flex items-center gap-2 text-xs font-mono font-semibold text-lime-400">
                  <Target className="w-4 h-4" />
                  <span>TARGET ROLES</span>
                </div>
                <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
                  <li>Software Development Engineer Intern</li>
                  <li>Frontend Engineer (React / Next.js)</li>
                  <li>Full-Stack Software Engineer (Junior)</li>
                  <li>Web Application Developer</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Skills Section: Meaningfully Organized Categories */}
        <section id="skills" className="glass-panel p-6 sm:p-10 rounded-3xl border border-slate-800 space-y-8">
          <div className="space-y-1 border-b border-slate-800 pb-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-lime-500/10 text-lime-400 border border-lime-500/20">
              <Code2 className="w-3.5 h-3.5" />
              <span>TECHNICAL COMPETENCIES</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Categorized Technical Skills
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
              Organized directly by engineering discipline. Supported by verified repository code and continuous learning logs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {skillCategories.map((group, idx) => {
              const Icon = group.icon;
              return (
                <div
                  key={idx}
                  className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-lime-500/30 transition-all duration-200 space-y-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-lime-500/10 text-lime-400 border border-lime-500/20">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-base">
                        {group.title}
                      </h3>
                      <p className="text-xs text-slate-400">
                        {group.description}
                      </p>
                    </div>
                  </div>

                  {/* Skills Tag Cloud */}
                  <div className="flex flex-wrap gap-2 pt-1">
                    {group.skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-3 py-1.5 rounded-xl text-xs font-medium bg-slate-800/90 text-slate-200 border border-slate-700/80 hover:border-lime-400/50 hover:text-white transition-colors"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* 4. Quick Section Jumps */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div
            onClick={() => {
              setActiveTab("projects");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                setActiveTab("projects");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }
            }}
            className="cursor-pointer glass-panel p-6 rounded-2xl border border-slate-800 hover:border-lime-500/40 hover:shadow-xl hover:shadow-lime-500/5 transition-all group focus-visible:ring-2 focus-visible:ring-lime-400"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-semibold">
                Project Showcase
              </span>
              <div className="p-2 rounded-xl bg-lime-500/10 text-lime-400 group-hover:scale-110 transition-transform">
                <Briefcase className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-extrabold text-white">
              {state.projects.length} Projects
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Live demos, GitHub source code &amp; case studies
            </p>
            <div className="text-xs text-lime-400 font-bold font-mono mt-3 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              <span>View Projects</span>
              <span>→</span>
            </div>
          </div>

          <div
            onClick={() => {
              setActiveTab("diary");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                setActiveTab("diary");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }
            }}
            className="cursor-pointer glass-panel p-6 rounded-2xl border border-slate-800 hover:border-lime-500/40 hover:shadow-xl hover:shadow-lime-500/5 transition-all group focus-visible:ring-2 focus-visible:ring-lime-400"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-semibold">
                Learning Diary
              </span>
              <div className="p-2 rounded-xl bg-lime-500/10 text-lime-400 group-hover:scale-110 transition-transform">
                <BookOpen className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-extrabold text-white">
              {state.learnings.length} Milestones
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Verified concept logs &amp; proof-of-work
            </p>
            <div className="text-xs text-lime-400 font-bold font-mono mt-3 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              <span>Open Diary</span>
              <span>→</span>
            </div>
          </div>

          <div
            onClick={() => {
              setActiveTab("resume");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                setActiveTab("resume");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }
            }}
            className="cursor-pointer glass-panel p-6 rounded-2xl border border-slate-800 hover:border-lime-500/40 hover:shadow-xl hover:shadow-lime-500/5 transition-all group focus-visible:ring-2 focus-visible:ring-lime-400"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-semibold">
                ATS Resume
              </span>
              <div className="p-2 rounded-xl bg-lime-500/10 text-lime-400 group-hover:scale-110 transition-transform">
                <FileText className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-extrabold text-white">
              Dynamic Sync
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Plain-text ATS compliant export &amp; print view
            </p>
            <div className="text-xs text-lime-400 font-bold font-mono mt-3 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              <span>Inspect Resume</span>
              <span>→</span>
            </div>
          </div>
        </div>

        {/* 5. Dataset Ingestion & Workspace Tools */}
        <section className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-lime-400" />
                <h3 className="font-bold text-lg text-white">
                  Workspace Data Management
                </h3>
              </div>
              <p className="text-xs text-slate-400 max-w-xl">
                Import custom JSON datasets, export your portfolio data, or reset to a clean blank slate.
              </p>
            </div>

            <span className="text-[11px] font-mono px-3 py-1 rounded-xl bg-slate-900 text-lime-400 border border-slate-800 self-start sm:self-center">
              Active Storage Ready
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Upload JSON File */}
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-white block">
                  1. Upload JSON Dataset
                </span>
                <p className="text-[11px] text-slate-400 mt-1">
                  Upload a structured `.json` dataset to populate portfolio data.
                </p>
              </div>

              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".json,application/json"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload-dataset"
                />
                <label
                  htmlFor="file-upload-dataset"
                  className="cursor-pointer inline-flex items-center justify-center gap-1.5 w-full px-3 py-2 rounded-xl text-xs font-semibold bg-slate-800 text-slate-200 hover:text-lime-400 border border-slate-700 transition-colors shadow-sm focus-visible:ring-2 focus-visible:ring-lime-400"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload .json</span>
                </label>
              </div>
            </div>

            {/* Paste Raw JSON */}
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-white block">
                  2. Paste Raw JSON
                </span>
                <p className="text-[11px] text-slate-400 mt-1">
                  Paste JSON schema directly in modal with validation.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsJsonModalOpen(true)}
                className="inline-flex items-center justify-center gap-1.5 w-full px-3 py-2 rounded-xl text-xs font-semibold bg-slate-800 text-slate-200 hover:text-lime-400 border border-slate-700 transition-colors shadow-sm focus-visible:ring-2 focus-visible:ring-lime-400"
              >
                <Code2 className="w-3.5 h-3.5" />
                <span>Paste JSON</span>
              </button>
            </div>

            {/* Export Current State */}
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-white block">
                  3. Export Portfolio
                </span>
                <p className="text-[11px] text-slate-400 mt-1">
                  Download your portfolio state as a JSON file.
                </p>
              </div>

              <button
                type="button"
                onClick={exportProfileJSON}
                className="inline-flex items-center justify-center gap-1.5 w-full px-3 py-2 rounded-xl text-xs font-semibold bg-slate-800 text-slate-200 hover:text-lime-400 border border-slate-700 transition-colors shadow-sm focus-visible:ring-2 focus-visible:ring-lime-400"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export JSON</span>
              </button>
            </div>

            {/* Clear or Restore */}
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-white block">
                  4. Reset Data
                </span>
                <p className="text-[11px] text-slate-400 mt-1">
                  Start with a 100% blank slate or restore sample data.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm("Are you sure you want to clear all data? You can start with an empty diary or import a dataset.")) {
                      clearWorkspaceData();
                      setDatasetStatus({ type: "success", message: "Workspace cleared to 100% blank slate." });
                      setTimeout(() => setDatasetStatus(null), 3500);
                    }
                  }}
                  className="flex-1 inline-flex items-center justify-center gap-1 px-2.5 py-2 rounded-xl text-[11px] font-semibold text-rose-400 hover:bg-rose-950/40 border border-rose-800/50 transition-colors"
                  title="Wipe entries to 0"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Blank</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm("Restore sample projects and verified learning milestones?")) {
                      loadCuratedDataset();
                      setDatasetStatus({ type: "success", message: "Sample portfolio data restored successfully." });
                      setTimeout(() => setDatasetStatus(null), 3500);
                    }
                  }}
                  className="flex-1 inline-flex items-center justify-center gap-1 px-2.5 py-2 rounded-xl text-[11px] font-semibold text-lime-400 hover:bg-lime-950/40 border border-lime-800/50 transition-colors"
                  title="Load sample dataset"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Sample</span>
                </button>
              </div>
            </div>

          </div>
        </section>
      </div>

      {/* Edit Profile Details Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-md"
            onClick={() => setIsEditModalOpen(false)}
          />
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto glass-panel bg-slate-900 rounded-3xl border border-slate-800 shadow-2xl p-6 sm:p-8 z-10 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-lime-500/10 text-lime-400">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-white">
                    Edit Profile Details
                  </h3>
                  <p className="text-xs text-slate-400">
                    Updates your identity across the portfolio and ATS resume header.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={profileForm.name}
                    onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl bg-slate-950 text-white border border-slate-800 focus:outline-none focus:border-lime-400"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">
                    Professional Title / Target Role
                  </label>
                  <input
                    type="text"
                    value={profileForm.title}
                    onChange={(e) => setProfileForm({ ...profileForm, title: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl bg-slate-950 text-white border border-slate-800 focus:outline-none focus:border-lime-400"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={profileForm.email}
                    onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl bg-slate-950 text-white border border-slate-800 focus:outline-none focus:border-lime-400"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">
                    Location
                  </label>
                  <input
                    type="text"
                    value={profileForm.location}
                    onChange={(e) => setProfileForm({ ...profileForm, location: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl bg-slate-950 text-white border border-slate-800 focus:outline-none focus:border-lime-400"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">
                    Phone (Optional)
                  </label>
                  <input
                    type="text"
                    value={profileForm.phone}
                    onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl bg-slate-950 text-white border border-slate-800 focus:outline-none focus:border-lime-400"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">
                    Availability Status
                  </label>
                  <input
                    type="text"
                    value={profileForm.availabilityType}
                    onChange={(e) => setProfileForm({ ...profileForm, availabilityType: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl bg-slate-950 text-white border border-slate-800 focus:outline-none focus:border-lime-400"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">
                    GitHub URL
                  </label>
                  <input
                    type="url"
                    value={profileForm.github}
                    onChange={(e) => setProfileForm({ ...profileForm, github: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl bg-slate-950 text-white border border-slate-800 focus:outline-none focus:border-lime-400"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">
                    LinkedIn URL
                  </label>
                  <input
                    type="url"
                    value={profileForm.linkedin}
                    onChange={(e) => setProfileForm({ ...profileForm, linkedin: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl bg-slate-950 text-white border border-slate-800 focus:outline-none focus:border-lime-400"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">
                  Elevator Pitch &amp; Summary
                </label>
                <textarea
                  rows={3}
                  value={profileForm.elevatorPitch}
                  onChange={(e) => setProfileForm({ ...profileForm, elevatorPitch: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl bg-slate-950 text-white border border-slate-800 focus:outline-none focus:border-lime-400 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-lime-400 hover:bg-lime-300 text-slate-950 font-bold text-xs shadow-md transition-all"
                >
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Paste Raw JSON Modal */}
      {isJsonModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-md"
            onClick={() => setIsJsonModalOpen(false)}
          />
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto glass-panel bg-slate-900 rounded-3xl border border-slate-800 shadow-2xl p-6 sm:p-8 z-10 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Code2 className="w-5 h-5 text-lime-400" />
                <h3 className="font-bold text-lg text-white">
                  Paste Raw JSON Dataset
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsJsonModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handlePasteJsonImport} className="space-y-4">
              <p className="text-xs text-slate-400">
                Paste an exported dataset or raw JSON schema with <code>learnings</code> and <code>projects</code> arrays.
              </p>

              <textarea
                rows={10}
                placeholder={`{\n  "learnings": [\n    {\n      "id": "1",\n      "technology": "Next.js",\n      "category": "Frontend",\n      "keyTakeaway": "...",\n      "masteryLevel": "Production Ready",\n      "tags": ["React"]\n    }\n  ],\n  "projects": []\n}`}
                value={jsonInput}
                onChange={(e) => setJsonInput(e.target.value)}
                className="w-full p-3 font-mono text-xs rounded-xl bg-slate-950 text-lime-300 border border-slate-800 focus:outline-none focus:ring-2 focus:ring-lime-400"
                required
              />

              <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsJsonModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-lime-400 hover:bg-lime-300 text-slate-950 font-bold text-xs shadow-md transition-all"
                >
                  Ingest &amp; Apply Dataset
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

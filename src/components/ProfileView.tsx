"use client";

import { useState, useRef } from "react";
import { useProfile, WorkspaceTab } from "@/context/ProfileContext";
import { 
  User, 
  Mail, 
  MapPin, 
  Phone, 
  ExternalLink, 
  Edit3, 
  Sparkles, 
  Download, 
  Upload, 
  Trash2, 
  RotateCcw, 
  CheckCircle2, 
  Layers, 
  BookOpen, 
  Briefcase, 
  FileText, 
  Check, 
  X, 
  Database,
  ShieldCheck,
  TrendingUp,
  AlertTriangle,
  Code2
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
    email: state.contact.email,
    location: state.contact.location,
    phone: state.contact.phone,
    github: state.contact.github,
    linkedin: state.contact.linkedin,
    availabilityType: state.availability.type,
    tagline: state.tagline,
    elevatorPitch: state.elevatorPitch,
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
        ...state.availability,
        type: profileForm.availabilityType,
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
      setDatasetStatus({ type: "error", message: "Invalid JSON dataset format. Must contain 'learnings' or 'projects' array." });
    }
  };

  const categories = ["Frontend", "Backend", "Cloud & DevOps", "Data & AI", "System Design"] as const;

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      
      {/* Status Feedback Toast */}
      {datasetStatus && (
        <div
          className={`p-4 rounded-2xl flex items-center justify-between gap-3 text-xs sm:text-sm font-semibold border ${
            datasetStatus.type === "success"
              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
              : "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20"
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
            className="p-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/5"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Identity Banner Card */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/5 dark:bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
                ACTIVE IDENTITY
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>{state.availability.type}</span>
              </span>
            </div>

            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {state.name}
              </h1>
              <p className="text-base sm:text-lg font-semibold text-cyan-600 dark:text-cyan-400 font-mono mt-1">
                {state.title}
              </p>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
              {state.elevatorPitch}
            </p>

            {/* Contact Pills */}
            <div className="flex flex-wrap items-center gap-3 pt-2 text-xs text-slate-600 dark:text-slate-400">
              {state.contact.email && (
                <a
                  href={`mailto:${state.contact.email}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl glass-panel hover:text-cyan-600 dark:hover:text-cyan-400 border border-slate-200 dark:border-slate-700 transition-colors"
                >
                  <Mail className="w-3.5 h-3.5 text-cyan-500" />
                  <span>{state.contact.email}</span>
                </a>
              )}

              {state.contact.location && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl glass-panel border border-slate-200 dark:border-slate-700">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{state.contact.location}</span>
                </div>
              )}

              {state.contact.github && (
                <a
                  href={state.contact.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl glass-panel hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700 transition-colors"
                >
                  <GithubIcon className="w-3.5 h-3.5" />
                  <span>GitHub</span>
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </a>
              )}

              {state.contact.linkedin && (
                <a
                  href={state.contact.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl glass-panel hover:text-indigo-600 dark:hover:text-indigo-400 border border-slate-200 dark:border-slate-700 transition-colors"
                >
                  <LinkedinIcon className="w-3.5 h-3.5" />
                  <span>LinkedIn</span>
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </a>
              )}
            </div>
          </div>

          {/* Edit Profile CTA */}
          <div className="shrink-0 flex sm:flex-col gap-2">
            <button
              type="button"
              onClick={() => {
                setProfileForm({
                  name: state.name,
                  title: state.title,
                  email: state.contact.email,
                  location: state.contact.location,
                  phone: state.contact.phone,
                  github: state.contact.github,
                  linkedin: state.contact.linkedin,
                  availabilityType: state.availability.type,
                  tagline: state.tagline,
                  elevatorPitch: state.elevatorPitch,
                });
                setIsEditModalOpen(true);
              }}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xs shadow-md hover:bg-slate-800 dark:hover:bg-slate-100 transition-all active:scale-95"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Profile Details</span>
            </button>
          </div>
        </div>
      </div>

      {/* Quick Navigation & Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Diary Card */}
        <div
          onClick={() => setActiveTab("diary")}
          className="cursor-pointer glass-panel p-5 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-cyan-500/50 hover:shadow-lg transition-all group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold">
              Learning Diary
            </span>
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 group-hover:scale-110 transition-transform">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
            {state.learnings.length} Milestones
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Verified concept &amp; prototype logs
          </p>
          <div className="text-[11px] text-cyan-600 dark:text-cyan-400 font-bold font-mono mt-3 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
            <span>Open Diary</span>
            <span>→</span>
          </div>
        </div>

        {/* Projects Card */}
        <div
          onClick={() => setActiveTab("projects")}
          className="cursor-pointer glass-panel p-5 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-indigo-500/50 hover:shadow-lg transition-all group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold">
              Projects Lab
            </span>
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
            {state.projects.length} Architectures
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Applied work with novelty breakdowns
          </p>
          <div className="text-[11px] text-indigo-600 dark:text-indigo-400 font-bold font-mono mt-3 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
            <span>Explore Projects</span>
            <span>→</span>
          </div>
        </div>

        {/* Technical Breadth Card */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold">
              Skill Domains
            </span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <Code2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
            {Object.values(extractedSkills).flat().length} Skills
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Derived live from actual diary entries
          </p>
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-mono mt-3">
            5 Domains Represented
          </div>
        </div>

        {/* ATS Resume Engine Card */}
        <div
          onClick={() => setActiveTab("resume")}
          className="cursor-pointer glass-panel p-5 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-violet-500/50 hover:shadow-lg transition-all group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold">
              Live ATS Resume
            </span>
            <div className="p-2 rounded-xl bg-violet-500/10 text-violet-600 dark:text-violet-400 group-hover:scale-110 transition-transform">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
            Auto-Synced
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Updated live from real logs &amp; code
          </p>
          <div className="text-[11px] text-violet-600 dark:text-violet-400 font-bold font-mono mt-3 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
            <span>View Resume</span>
            <span>→</span>
          </div>
        </div>

      </div>

      {/* Competencies Breakdown Matrix */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-cyan-500" />
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              Dynamic Competency Distribution (Derived from Active Diary)
            </h3>
          </div>
          <span className="text-xs font-mono text-slate-400">
            Real-Time Audit
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {categories.map((cat) => {
            const count = competencyCounts[cat] || 0;
            const skills = extractedSkills[cat] || [];
            return (
              <div
                key={cat}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-2"
              >
                <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                  <span>{cat}</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
                    {count} {count === 1 ? "entry" : "entries"}
                  </span>
                </div>

                <div className="flex flex-wrap gap-1 min-h-[36px]">
                  {skills.length > 0 ? (
                    skills.slice(0, 3).map((sk) => (
                      <span
                        key={sk}
                        className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
                      >
                        {sk}
                      </span>
                    ))
                  ) : (
                    <span className="text-[10px] text-slate-400 italic">No entries yet</span>
                  )}
                  {skills.length > 3 && (
                    <span className="px-1.5 py-0.5 text-[9px] font-mono text-slate-400">
                      +{skills.length - 3}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Dataset Ingestion & Bulk Loader Panel (Requirement #5) */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-cyan-500" />
              <h3 className="font-bold text-lg text-slate-900 dark:text-white">
                Dataset Ingestion &amp; Workspace Storage Manager
              </h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xl">
              Import custom JSON datasets, export your verified engineering diary, or reset data to start with a clean blank slate.
            </p>
          </div>

          <span className="text-[11px] font-mono px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-700 self-start sm:self-center">
            Dataset Hook Ready
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Action 1: Upload JSON File */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-3 flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold text-slate-900 dark:text-white block">
                1. Upload JSON File
              </span>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                Upload a structured `.json` dataset to populate diary entries &amp; projects.
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
                className="cursor-pointer inline-flex items-center justify-center gap-1.5 w-full px-3 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-400 border border-slate-200 dark:border-slate-700 transition-colors shadow-sm"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload Dataset .json</span>
              </label>
            </div>
          </div>

          {/* Action 2: Paste Raw JSON */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-3 flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold text-slate-900 dark:text-white block">
                2. Paste Raw JSON
              </span>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                Directly paste JSON schema in an editor modal with instant schema validation.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsJsonModalOpen(true)}
              className="inline-flex items-center justify-center gap-1.5 w-full px-3 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-400 border border-slate-200 dark:border-slate-700 transition-colors shadow-sm"
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>Paste JSON String</span>
            </button>
          </div>

          {/* Action 3: Export Current State */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-3 flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold text-slate-900 dark:text-white block">
                3. Export Dataset
              </span>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                Download your current engineering diary and projects as a standard JSON dataset.
              </p>
            </div>

            <button
              type="button"
              onClick={exportProfileJSON}
              className="inline-flex items-center justify-center gap-1.5 w-full px-3 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 border border-slate-200 dark:border-slate-700 transition-colors shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Workspace JSON</span>
            </button>
          </div>

          {/* Action 4: Clear or Load Curated */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-3 flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold text-slate-900 dark:text-white block">
                4. Reset Controls
              </span>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                Start with a 100% clean blank slate or restore curated sample milestones.
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
                className="flex-1 inline-flex items-center justify-center gap-1 px-2.5 py-2 rounded-xl text-[11px] font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-rose-200 dark:border-rose-800/50 transition-colors"
                title="Wipe all entries to 0"
              >
                <Trash2 className="w-3 h-3" />
                <span>Blank Slate</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (window.confirm("Load curated engineering diary samples and architectural case studies?")) {
                    loadCuratedDataset();
                    setDatasetStatus({ type: "success", message: "Curated dataset loaded successfully." });
                    setTimeout(() => setDatasetStatus(null), 3500);
                  }
                }}
                className="flex-1 inline-flex items-center justify-center gap-1 px-2.5 py-2 rounded-xl text-[11px] font-semibold text-cyan-600 dark:text-cyan-400 hover:bg-cyan-50 dark:hover:bg-cyan-950/40 border border-cyan-200 dark:border-cyan-800/50 transition-colors"
                title="Load curated dataset"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Sample Data</span>
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-md"
            onClick={() => setIsEditModalOpen(false)}
          />
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto glass-panel bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 z-10 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-slate-900 dark:text-white">
                    Edit Profile &amp; Contact Details
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Updates your identity across the diary and auto-generates your ATS resume header.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={profileForm.name}
                    onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl glass-panel text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Professional Title / Target Role
                  </label>
                  <input
                    type="text"
                    value={profileForm.title}
                    onChange={(e) => setProfileForm({ ...profileForm, title: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl glass-panel text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={profileForm.email}
                    onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl glass-panel text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Location
                  </label>
                  <input
                    type="text"
                    value={profileForm.location}
                    onChange={(e) => setProfileForm({ ...profileForm, location: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl glass-panel text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Phone (Optional)
                  </label>
                  <input
                    type="text"
                    value={profileForm.phone}
                    onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl glass-panel text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Availability Status
                  </label>
                  <input
                    type="text"
                    value={profileForm.availabilityType}
                    onChange={(e) => setProfileForm({ ...profileForm, availabilityType: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl glass-panel text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    GitHub URL
                  </label>
                  <input
                    type="url"
                    value={profileForm.github}
                    onChange={(e) => setProfileForm({ ...profileForm, github: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl glass-panel text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    LinkedIn URL
                  </label>
                  <input
                    type="url"
                    value={profileForm.linkedin}
                    onChange={(e) => setProfileForm({ ...profileForm, linkedin: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl glass-panel text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Elevator Pitch &amp; Engineering Philosophy
                </label>
                <textarea
                  rows={3}
                  value={profileForm.elevatorPitch}
                  onChange={(e) => setProfileForm({ ...profileForm, elevatorPitch: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl glass-panel text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-white font-bold text-xs shadow-md transition-all"
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
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-md"
            onClick={() => setIsJsonModalOpen(false)}
          />
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto glass-panel bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 z-10 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Code2 className="w-5 h-5 text-cyan-500" />
                <h3 className="font-bold text-lg text-slate-900 dark:text-white">
                  Paste Raw JSON Dataset
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsJsonModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handlePasteJsonImport} className="space-y-4">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Paste an exported dataset or raw JSON schema with <code>learnings</code> and <code>projects</code> arrays.
              </p>

              <textarea
                rows={10}
                placeholder={`{\n  "learnings": [\n    {\n      "id": "1",\n      "technology": "Next.js",\n      "category": "Frontend",\n      "keyTakeaway": "...",\n      "masteryLevel": "Production Ready",\n      "tags": ["React"]\n    }\n  ],\n  "projects": []\n}`}
                value={jsonInput}
                onChange={(e) => setJsonInput(e.target.value)}
                className="w-full p-3 font-mono text-xs rounded-xl bg-slate-950 text-cyan-300 border border-slate-800 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                required
              />

              <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsJsonModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-white font-bold text-xs shadow-md transition-all"
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

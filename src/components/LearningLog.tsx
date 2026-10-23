"use client";

import { useState, useMemo, useRef } from "react";
import { useProfile } from "@/context/ProfileContext";
import { CompetencyArea, MasteryLevel } from "@/data/profile";
import confetti from "canvas-confetti";
import { 
  BookOpen, 
  PlusCircle, 
  Search, 
  ExternalLink, 
  Trash2, 
  Download, 
  Upload, 
  RotateCcw, 
  CheckCircle2, 
  Zap, 
  Compass, 
  Sparkles, 
  Filter, 
  Layers, 
  Calendar, 
  Check, 
  X,
  Tag,
  Loader2,
  AlertCircle
} from "lucide-react";
import { GithubIcon } from "@/components/Icons";
import { GitHubRepoBrowserModal } from "./GitHubRepoBrowserModal";
import { parseGitHubUrl, fetchGitHubRepo, FetchedRepoData, toTitleCase } from "@/lib/github";

export function LearningLog() {
  const {
    state,
    addLearning,
    addLearnings,
    deleteLearning,
    exportProfileJSON,
    importProfileJSON,
    resetToDefaults,
    currentUser,
  } = useProfile();

  // Filter state
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedMastery, setSelectedMastery] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // GitHub Modal & Quick-Fetch state for Learning Diary
  const [isGitHubModalOpen, setIsGitHubModalOpen] = useState<boolean>(false);
  const [repoFetchUrl, setRepoFetchUrl] = useState<string>("");
  const [isFetchingRepo, setIsFetchingRepo] = useState<boolean>(false);
  const [repoFetchError, setRepoFetchError] = useState<string | null>(null);
  const [repoFetchSuccess, setRepoFetchSuccess] = useState<string | null>(null);

  // Form input state
  const [formState, setFormState] = useState({
    technology: "",
    category: "Backend" as CompetencyArea,
    masteryLevel: "Production Ready" as MasteryLevel,
    keyTakeaway: "",
    repoOrDemoUrl: "",
    tagsInput: "",
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const fileInputRef = useRef<HTMLInputElement>(null);

  const categories = [
    "All",
    "Frontend",
    "Backend",
    "Cloud & DevOps",
    "Data & AI",
    "System Design",
  ];

  const masteryLevels = [
    "All",
    "Production Ready",
    "Built Demo",
    "Learned Concept",
  ];

  // Filtered learning entries
  const filteredLearnings = useMemo(() => {
    return state.learnings.filter((entry) => {
      const matchesCategory =
        selectedCategory === "All" || entry.category === selectedCategory;
      const matchesMastery =
        selectedMastery === "All" || entry.masteryLevel === selectedMastery;
      const matchesSearch =
        searchQuery.trim() === "" ||
        entry.technology.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.keyTakeaway.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchesCategory && matchesMastery && matchesSearch;
    });
  }, [state.learnings, selectedCategory, selectedMastery, searchQuery]);

  // 1-Click Repo Fetch inside Learning Diary Form
  const handleQuickFetchRepoForDiary = async () => {
    const parsed = parseGitHubUrl(repoFetchUrl);
    if (!parsed) {
      setRepoFetchError("Please enter a valid GitHub repository URL (e.g. https://github.com/THARANESHSELVAM/Personal-Portfolio-Website) or shorthand (owner/repo).");
      setRepoFetchSuccess(null);
      return;
    }

    setIsFetchingRepo(true);
    setRepoFetchError(null);
    setRepoFetchSuccess(null);

    try {
      const data = await fetchGitHubRepo(parsed.owner, parsed.repo);

      // Auto-populate formState
      setFormState({
        technology: data.primaryLanguage || toTitleCase(data.name),
        category: data.competencyArea,
        masteryLevel: "Production Ready",
        keyTakeaway: data.description
          ? `Engineered and verified ${data.name}: ${data.description}`
          : `Implemented production-grade ${data.primaryLanguage} architecture with modular components in ${data.name}.`,
        repoOrDemoUrl: data.html_url,
        tagsInput: [
          data.competencyArea.replace(/\s+/g, ""),
          data.primaryLanguage,
          ...data.languages.slice(1, 3),
          ...data.topics.slice(0, 2),
        ].filter(Boolean).join(", "),
      });

      setRepoFetchSuccess(
        `✓ Fetched "${data.name}"! Auto-filled technology (${data.primaryLanguage}), ${data.competencyArea} domain, and repository proof-of-work link.`
      );
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to fetch repository from GitHub.";
      setRepoFetchError(msg);
      setRepoFetchSuccess(null);
    } finally {
      setIsFetchingRepo(false);
    }
  };

  // From GitHub Browser: 1-Click import repo into Diary
  const handleSelectRepoForDiary = (data: FetchedRepoData) => {
    setFormState({
      technology: data.primaryLanguage || toTitleCase(data.name),
      category: data.competencyArea,
      masteryLevel: "Production Ready",
      keyTakeaway: data.description
        ? `Engineered and verified ${data.name}: ${data.description}`
        : `Implemented production-grade ${data.primaryLanguage} architecture in repository ${data.name}.`,
      repoOrDemoUrl: data.html_url,
      tagsInput: [
        data.competencyArea.replace(/\s+/g, ""),
        data.primaryLanguage,
        ...data.languages.slice(1, 3),
        ...data.topics.slice(0, 2),
      ].filter(Boolean).join(", "),
    });
    setRepoFetchUrl(data.html_url);
    setRepoFetchSuccess(`✓ Auto-filled from "${data.name}"! Review below and click "Ingest Milestone".`);
    setIsFormOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};

    if (!formState.technology.trim()) {
      errs.technology = "Technology or concept name is required.";
    }
    if (!formState.keyTakeaway.trim() || formState.keyTakeaway.trim().length < 10) {
      errs.keyTakeaway = "Please provide a concise takeaway / proof of work (at least 10 chars).";
    }

    if (Object.keys(errs).length > 0) {
      setFormErrors(errs);
      return;
    }

    const tags = formState.tagsInput
      .split(",")
      .map((t) => t.trim().replace(/^#/, ""))
      .filter((t) => t.length > 0);

    if (tags.length === 0) {
      tags.push(formState.category.replace(/\s+/g, ""));
    }

    addLearning({
      technology: formState.technology.trim(),
      category: formState.category,
      masteryLevel: formState.masteryLevel,
      keyTakeaway: formState.keyTakeaway.trim(),
      repoOrDemoUrl: formState.repoOrDemoUrl.trim() || undefined,
      tags,
    });

    // Reset form
    setFormState({
      technology: "",
      category: "Backend",
      masteryLevel: "Production Ready",
      keyTakeaway: "",
      repoOrDemoUrl: "",
      tagsInput: "",
    });
    setFormErrors({});
    setIsFormOpen(false);

    // Show temporary feedback toast
    setStatusMessage("Milestone logged! ATS Resume and Profile metrics updated in real time.");
    setTimeout(() => setStatusMessage(null), 4000);

    // Confetti celebration
    try {
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.7 },
      });
    } catch (err) {}
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const success = importProfileJSON(content);
      if (success) {
        setStatusMessage("Profile JSON successfully imported and synchronized!");
      } else {
        setStatusMessage("Error: Invalid profile JSON structure.");
      }
      setTimeout(() => setStatusMessage(null), 4000);
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const getMasteryBadge = (level: MasteryLevel) => {
    switch (level) {
      case "Production Ready":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
            <CheckCircle2 className="w-3 h-3 text-emerald-500" />
            <span>Production Ready</span>
          </span>
        );
      case "Built Demo":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
            <Zap className="w-3 h-3 text-cyan-400" />
            <span>Built Demo</span>
          </span>
        );
      case "Learned Concept":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-violet-500/10 text-violet-700 dark:text-violet-300 border border-violet-500/30">
            <Compass className="w-3 h-3 text-violet-500" />
            <span>Learned Concept</span>
          </span>
        );
    }
  };

  return (
    <section id="learning-log" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 mb-3">
            <BookOpen className="w-3.5 h-3.5" />
            <span>DYNAMIC INGESTION ENGINE</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            What I Learnt &amp; Growth Feed
          </h2>
          <p className="mt-3 text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
            &ldquo;I log what I learn to continuously enhance my profile, and the platform dynamically synchronizes and rebuilds my ATS resume in real time.&rdquo;
          </p>
        </div>

        {/* Global Toast Notification */}
        {statusMessage && (
          <div className="mb-6 p-4 rounded-2xl bg-cyan-950/60 border border-cyan-500/30 text-cyan-200 text-xs sm:text-sm font-semibold flex items-center justify-between shadow-lg animate-in fade-in slide-in-from-top-2">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>{statusMessage}</span>
            </div>
            <button
              type="button"
              onClick={() => setStatusMessage(null)}
              className="text-cyan-400 hover:opacity-75"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Action Bar: Log Milestone Button + JSON Import/Export */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl glass-panel border border-slate-200 dark:border-slate-800 mb-8 shadow-sm">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setIsFormOpen(!isFormOpen)}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-teal-400 to-cyan-500 hover:from-teal-300 hover:to-cyan-400 text-slate-950 font-bold text-xs sm:text-sm shadow-md shadow-cyan-500/25 transition-all active:scale-95"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{isFormOpen ? "Close Quick-Entry" : "Log New Learning Milestone"}</span>
            </button>

            <button
              type="button"
              onClick={() => setIsGitHubModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white font-semibold text-xs border border-slate-700/80 shadow-sm transition-all active:scale-95 whitespace-nowrap"
              title="Browse public GitHub repositories to auto-import proof-of-work into diary"
            >
              <GithubIcon className="w-3.5 h-3.5 text-cyan-400" />
              <span>Browse GitHub</span>
            </button>

            <span className="text-xs text-slate-500 font-mono hidden md:inline">
              {state.learnings.length} verified entries in feed
            </span>
          </div>

          {/* Backup / Export / Import Controls */}
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={exportProfileJSON}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold glass-panel text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700 transition-colors"
              title="Export complete profile state as JSON"
            >
              <Download className="w-3.5 h-3.5 text-cyan-400" />
              <span>Export JSON</span>
            </button>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold glass-panel text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700 transition-colors"
              title="Import previously exported profile JSON"
            >
              <Upload className="w-3.5 h-3.5 text-slate-400" />
              <span>Import JSON</span>
            </button>

            <button
              type="button"
              onClick={() => {
                if (window.confirm("Reset all learnings and state back to default initial seed data?")) {
                  resetToDefaults();
                  setStatusMessage("Profile state restored to initial starter milestones.");
                  setTimeout(() => setStatusMessage(null), 3000);
                }
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 transition-colors"
              title="Reset state to default seed data"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset</span>
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>
        </div>

        {/* Quick-Entry Ingestion Form Drawer/Card */}
        {isFormOpen && (
          <div className="mb-10 p-6 sm:p-8 rounded-3xl glass-panel bg-white/95 dark:bg-slate-900/95 border border-cyan-500/40 shadow-xl animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-slate-900 dark:text-white">
                    Ingest Learning Milestone
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Your entry immediately synchronizes into the Profile Health Auditor and ATS Resume skills section.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Auto-Fill from GitHub Banner */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 text-white border border-slate-800 shadow-md space-y-2.5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="p-1 rounded-lg bg-cyan-500/20 text-cyan-400">
                    <GithubIcon className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                      <span>Auto-Fill Milestone from GitHub</span>
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                        1-Click Sync
                      </span>
                    </h4>
                    <p className="text-[11px] text-slate-300">
                      Extracts primary language, competency domain, takeaway summary, and proof-of-work link.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsGitHubModalOpen(true)}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium bg-white/10 hover:bg-white/20 text-white transition-colors self-start sm:self-auto"
                >
                  <Search className="w-3 h-3 text-cyan-400" />
                  <span>Browse My Repos</span>
                </button>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={repoFetchUrl}
                  onChange={(e) => {
                    setRepoFetchUrl(e.target.value);
                    if (repoFetchError) setRepoFetchError(null);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleQuickFetchRepoForDiary();
                    }
                  }}
                  placeholder="https://github.com/THARANESHSELVAM/your-repo or owner/repo"
                  className="flex-1 px-3 py-1.5 text-xs font-mono rounded-xl bg-slate-950/80 border border-slate-700 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                />
                <button
                  type="button"
                  onClick={handleQuickFetchRepoForDiary}
                  disabled={isFetchingRepo || !repoFetchUrl.trim()}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-teal-400 to-cyan-500 hover:from-teal-300 hover:to-cyan-400 text-slate-950 font-bold text-xs transition-all disabled:opacity-50 shrink-0 shadow-sm"
                >
                  {isFetchingRepo ? (
                    <>
                      <Loader2 className="w-3 h-3 animate-spin" />
                      <span>Fetching...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3 h-3" />
                      <span>Auto-Fill Form</span>
                    </>
                  )}
                </button>
              </div>

              {repoFetchError && (
                <div className="p-2 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0 text-rose-400" />
                  <span>{repoFetchError}</span>
                </div>
              )}

              {repoFetchSuccess && (
                <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-emerald-400" />
                  <span>{repoFetchSuccess}</span>
                </div>
              )}
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Technology Name */}
                <div className="space-y-1 md:col-span-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Technology / Concept Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Distributed Caching with Redis"
                    value={formState.technology}
                    onChange={(e) => {
                      setFormState({ ...formState, technology: e.target.value });
                      if (formErrors.technology) setFormErrors({ ...formErrors, technology: "" });
                    }}
                    className={`w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl glass-panel text-slate-900 dark:text-white placeholder-slate-400 border focus:outline-none focus:ring-2 ${
                      formErrors.technology
                        ? "border-rose-500 focus:ring-rose-500/50"
                        : "border-slate-200 dark:border-slate-700 focus:ring-cyan-500/50"
                    }`}
                  />
                  {formErrors.technology && (
                    <p className="text-[11px] text-rose-500 mt-0.5">{formErrors.technology}</p>
                  )}
                </div>

                {/* Core Competency Area */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Core Competency Area
                  </label>
                  <select
                    value={formState.category}
                    onChange={(e) =>
                      setFormState({ ...formState, category: e.target.value as CompetencyArea })
                    }
                    className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl glass-panel text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 bg-white dark:bg-slate-900"
                  >
                    <option value="Frontend">Frontend</option>
                    <option value="Backend">Backend</option>
                    <option value="Cloud & DevOps">Cloud &amp; DevOps</option>
                    <option value="Data & AI">Data &amp; AI</option>
                    <option value="System Design">System Design</option>
                  </select>
                </div>

                {/* Mastery Level */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Mastery Level
                  </label>
                  <select
                    value={formState.masteryLevel}
                    onChange={(e) =>
                      setFormState({ ...formState, masteryLevel: e.target.value as MasteryLevel })
                    }
                    className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl glass-panel text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 bg-white dark:bg-slate-900"
                  >
                    <option value="Production Ready">Production Ready (Deployed / Battle-Tested)</option>
                    <option value="Built Demo">Built Demo (Working PoC)</option>
                    <option value="Learned Concept">Learned Concept (Theory &amp; Syntax)</option>
                  </select>
                </div>
              </div>

              {/* Key Takeaway / Proof of Work */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Key Takeaway / Proof of Work <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={2}
                  placeholder="Explain in 1-2 concise sentences what was built, understood, or benchmarked (e.g. 'Configured Redlock distributed mutex to prevent race conditions during checkout surges.')..."
                  value={formState.keyTakeaway}
                  onChange={(e) => {
                    setFormState({ ...formState, keyTakeaway: e.target.value });
                    if (formErrors.keyTakeaway) setFormErrors({ ...formErrors, keyTakeaway: "" });
                  }}
                  className={`w-full px-4 py-2 text-xs sm:text-sm rounded-xl glass-panel text-slate-900 dark:text-white placeholder-slate-400 border focus:outline-none focus:ring-2 resize-none ${
                    formErrors.keyTakeaway
                      ? "border-rose-500 focus:ring-rose-500/50"
                      : "border-slate-200 dark:border-slate-700 focus:ring-cyan-500/50"
                  }`}
                />
                {formErrors.keyTakeaway && (
                  <p className="text-[11px] text-rose-500 mt-0.5">{formErrors.keyTakeaway}</p>
                )}
              </div>

              {/* URL and Tags */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Associated Repo or Demo URL (Optional)
                  </label>
                  <input
                    type="url"
                    placeholder="https://github.com/..."
                    value={formState.repoOrDemoUrl}
                    onChange={(e) => setFormState({ ...formState, repoOrDemoUrl: e.target.value })}
                    className="w-full px-4 py-2 text-xs sm:text-sm rounded-xl glass-panel text-slate-900 dark:text-white placeholder-slate-400 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Tags (Comma-separated)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Redis, DistributedLocks, Cache"
                    value={formState.tagsInput}
                    onChange={(e) => setFormState({ ...formState, tagsInput: e.target.value })}
                    className="w-full px-4 py-2 text-xs sm:text-sm rounded-xl glass-panel text-slate-900 dark:text-white placeholder-slate-400 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-teal-400 to-cyan-500 hover:from-teal-300 hover:to-cyan-400 text-slate-950 font-bold text-xs sm:text-sm shadow-md shadow-cyan-500/25 transition-all active:scale-95"
                >
                  <Check className="w-4 h-4" />
                  <span>Log Milestone &amp; Sync Resume</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Filter Controls & Search */}
        <div className="space-y-4 mb-8">
          <div className="flex flex-wrap items-center justify-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 border ${
                  selectedCategory === cat
                    ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-slate-900 dark:border-white shadow-sm"
                    : "glass-panel text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border-slate-200 dark:border-slate-800"
                }`}
              >
                <span>{cat}</span>
              </button>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 max-w-4xl mx-auto pt-2">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search technologies, concepts, tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl glass-panel text-slate-900 dark:text-white placeholder-slate-400 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
              <span className="text-xs text-slate-500 dark:text-slate-400 mr-1 hidden lg:inline font-mono">
                Mastery:
              </span>
              {masteryLevels.map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setSelectedMastery(lvl)}
                  className={`text-xs px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors border ${
                    selectedMastery === lvl
                      ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/40"
                      : "text-slate-600 dark:text-slate-400 border-transparent hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Chronological Learning Velocity Feed */}
        {filteredLearnings.length === 0 ? (
          <div className="text-center py-16 glass-panel rounded-3xl border border-slate-200 dark:border-slate-800 max-w-md mx-auto">
            <BookOpen className="w-8 h-8 text-slate-400 mx-auto mb-2 opacity-50" />
            <p className="text-slate-600 dark:text-slate-400 text-sm">
              No learning milestones match this filter.
            </p>
            <button
              type="button"
              onClick={() => {
                setSelectedCategory("All");
                setSelectedMastery("All");
                setSearchQuery("");
              }}
              className="mt-4 text-xs font-semibold text-cyan-400 hover:underline"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredLearnings.map((entry) => (
              <div
                key={entry.id}
                className="glass-panel p-5 sm:p-6 rounded-3xl border border-slate-200/90 dark:border-slate-800/90 hover:border-cyan-400/50 shadow-sm hover:shadow-lg transition-all duration-200 flex flex-col justify-between group"
              >
                <div className="space-y-3">
                  {/* Top Bar: Category, Mastery, Date */}
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold uppercase bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                        {entry.category}
                      </span>
                      {getMasteryBadge(entry.masteryLevel)}
                    </div>

                    <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-400">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      <span>{entry.dateLogged}</span>
                    </div>
                  </div>

                  {/* Technology / Concept Title */}
                  <h3 className="font-extrabold text-base sm:text-lg text-slate-900 dark:text-white group-hover:text-cyan-400 transition-colors">
                    {entry.technology}
                  </h3>

                  {/* Key Takeaway / Proof of Work */}
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/40 p-3 rounded-2xl border border-slate-200/60 dark:border-slate-800">
                    {entry.keyTakeaway}
                  </p>
                </div>

                {/* Bottom Bar: Tags, Repo Link, Delete Button */}
                <div className="pt-4 mt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-1.5">
                    {entry.tags.map((t) => (
                      <span
                        key={t}
                        className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-2">
                    {entry.repoOrDemoUrl && (
                      <a
                        href={entry.repoOrDemoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-lg text-slate-500 hover:text-cyan-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        title="View Proof of Work / Repository"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}

                    <button
                      type="button"
                      onClick={() => {
                        if (window.confirm(`Delete milestone "${entry.technology}"?`)) {
                          deleteLearning(entry.id);
                        }
                      }}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                      title="Delete this milestone"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-8 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-2 font-mono">
          <span>Showing {filteredLearnings.length} of {state.learnings.length} logged milestones</span>
          <span className="hidden sm:inline">Persisted via React Context + LocalStorage</span>
        </div>
      </div>

      {/* GitHub Repository Browser Modal */}
      <GitHubRepoBrowserModal
        isOpen={isGitHubModalOpen}
        onClose={() => setIsGitHubModalOpen(false)}
        onSelectRepoForImport={(data) => handleSelectRepoForDiary(data)}
        onResyncRepo={(_proj, data) => handleSelectRepoForDiary(data)}
        savedProjects={state.projects}
        defaultUsername={
          (state.contact?.github || currentUser?.github)
            ? (state.contact?.github || currentUser?.github || "").split("/").filter(Boolean).pop() || "THARANESHSELVAM"
            : "THARANESHSELVAM"
        }
      />
    </section>
  );
}

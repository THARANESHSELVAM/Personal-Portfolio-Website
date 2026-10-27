"use client";

import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { CompetencyArea, MasteryLevel, LearningEntry } from "@/data/profile";
import { 
  X, 
  Sparkles, 
  Save, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  Search, 
  Tag, 
  Calendar, 
  Layers, 
  Award 
} from "lucide-react";
import { GithubIcon } from "@/components/Icons";
import { parseGitHubUrl, fetchGitHubRepo, FetchedRepoData, toTitleCase } from "@/lib/github";

export interface MilestoneDrawerProps {
  isOpen: boolean;
  mode: "create" | "edit";
  initialEntry?: LearningEntry | null;
  onClose: () => void;
  onSaveCreate: (entry: Omit<LearningEntry, "id" | "dateLogged">) => void;
  onSaveEdit: (id: string, updates: Partial<LearningEntry>) => void;
  onOpenGitHubBrowser: () => void;
  prefilledFromGitHub?: FetchedRepoData | null;
  onClearPrefilledGitHub?: () => void;
}

const CATEGORIES: CompetencyArea[] = [
  "Frontend",
  "Backend",
  "Cloud & DevOps",
  "Data & AI",
  "System Design",
];

const MASTERY_LEVELS: MasteryLevel[] = [
  "Production Ready",
  "Built Demo",
  "Learned Concept",
];

function isValidUrl(urlStr: string): boolean {
  if (!urlStr || !urlStr.trim()) return true;
  try {
    const parsed = new URL(urlStr.trim());
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

export function MilestoneDrawer({
  isOpen,
  mode,
  initialEntry,
  onClose,
  onSaveCreate,
  onSaveEdit,
  onOpenGitHubBrowser,
  prefilledFromGitHub,
  onClearPrefilledGitHub,
}: MilestoneDrawerProps) {
  // Form input state
  const [technology, setTechnology] = useState("");
  const [category, setCategory] = useState<CompetencyArea>("Backend");
  const [masteryLevel, setMasteryLevel] = useState<MasteryLevel>("Production Ready");
  const [keyTakeaway, setKeyTakeaway] = useState("");
  const [repoOrDemoUrl, setRepoOrDemoUrl] = useState("");
  const [tagsInput, setTagsInput] = useState("");

  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Quick GitHub fetch state inside drawer
  const [repoFetchUrl, setRepoFetchUrl] = useState("");
  const [isFetchingRepo, setIsFetchingRepo] = useState(false);
  const [repoFetchError, setRepoFetchError] = useState<string | null>(null);
  const [repoFetchSuccess, setRepoFetchSuccess] = useState<string | null>(null);
  const [isGitHubPanelExpanded, setIsGitHubPanelExpanded] = useState(false);

  // Focus management refs
  const drawerRef = useRef<HTMLDivElement>(null);
  const technologyInputRef = useRef<HTMLInputElement>(null);
  const triggerElementRef = useRef<HTMLElement | null>(null);

  // Compute clean initial values from props
  const initialValues = useMemo(() => {
    if (mode === "edit" && initialEntry) {
      return {
        technology: initialEntry.technology || "",
        category: initialEntry.category || ("Backend" as CompetencyArea),
        masteryLevel: initialEntry.masteryLevel || ("Production Ready" as MasteryLevel),
        keyTakeaway: initialEntry.keyTakeaway || "",
        repoOrDemoUrl: initialEntry.repoOrDemoUrl || "",
        tagsInput: Array.isArray(initialEntry.tags) ? initialEntry.tags.join(", ") : "",
      };
    }
    return {
      technology: "",
      category: "Backend" as CompetencyArea,
      masteryLevel: "Production Ready" as MasteryLevel,
      keyTakeaway: "",
      repoOrDemoUrl: "",
      tagsInput: "",
    };
  }, [mode, initialEntry]);

  // Capture triggering active element on open
  useEffect(() => {
    if (isOpen) {
      triggerElementRef.current = document.activeElement as HTMLElement;
    }
  }, [isOpen]);

  // Adjust form fields during render when isOpen opens or initialValues change
  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);
  const [prevInitialEntryId, setPrevInitialEntryId] = useState(initialEntry?.id);
  const [prevMode, setPrevMode] = useState(mode);

  if (isOpen !== prevIsOpen || initialEntry?.id !== prevInitialEntryId || mode !== prevMode) {
    setPrevIsOpen(isOpen);
    setPrevInitialEntryId(initialEntry?.id);
    setPrevMode(mode);
    if (isOpen) {
      setTechnology(initialValues.technology);
      setCategory(initialValues.category);
      setMasteryLevel(initialValues.masteryLevel);
      setKeyTakeaway(initialValues.keyTakeaway);
      setRepoOrDemoUrl(initialValues.repoOrDemoUrl);
      setTagsInput(initialValues.tagsInput);
      setIsGitHubPanelExpanded(false);
      setErrors({});
      setRepoFetchUrl("");
      setRepoFetchError(null);
      setRepoFetchSuccess(null);
    }
  }

  // Adjust fields if prefilled metadata is passed from GitHub Browser Modal
  const [prevPrefilledGitHub, setPrevPrefilledGitHub] = useState(prefilledFromGitHub);
  if (isOpen && prefilledFromGitHub && prefilledFromGitHub !== prevPrefilledGitHub) {
    setPrevPrefilledGitHub(prefilledFromGitHub);
    const data = prefilledFromGitHub;
    const tech = data.primaryLanguage || toTitleCase(data.name);
    const cat = data.competencyArea;
    const takeaway = data.description
      ? `Engineered and verified ${data.name}: ${data.description}`
      : `Implemented production-grade ${data.primaryLanguage} architecture with modular components in ${data.name}.`;
    const url = data.html_url;
    const tags = [
      data.competencyArea.replace(/\s+/g, ""),
      data.primaryLanguage,
      ...data.languages.slice(1, 3),
      ...data.topics.slice(0, 2),
    ].filter(Boolean).join(", ");

    setTechnology(tech);
    setCategory(cat);
    setMasteryLevel("Production Ready");
    setKeyTakeaway(takeaway);
    setRepoOrDemoUrl(url);
    setTagsInput(tags);
    setRepoFetchSuccess(`✓ Auto-filled from repository "${data.name}"`);
  }

  // Initial focus on technology input after short tick
  useEffect(() => {
    if (!isOpen) return;
    const timer = setTimeout(() => {
      technologyInputRef.current?.focus();
    }, 100);
    return () => clearTimeout(timer);
  }, [isOpen]);

  // Clear prefilled prop in parent once consumed
  useEffect(() => {
    if (isOpen && prefilledFromGitHub && onClearPrefilledGitHub) {
      onClearPrefilledGitHub();
    }
  }, [isOpen, prefilledFromGitHub, onClearPrefilledGitHub]);

  // Dirty check: has user modified any field compared to initial values?
  const isDirty = useMemo(() => {
    return (
      technology.trim() !== initialValues.technology.trim() ||
      category !== initialValues.category ||
      masteryLevel !== initialValues.masteryLevel ||
      keyTakeaway.trim() !== initialValues.keyTakeaway.trim() ||
      repoOrDemoUrl.trim() !== initialValues.repoOrDemoUrl.trim() ||
      tagsInput.trim() !== initialValues.tagsInput.trim()
    );
  }, [technology, category, masteryLevel, keyTakeaway, repoOrDemoUrl, tagsInput, initialValues]);

  // Safe close handler with unsaved changes prompt
  const handleAttemptClose = useCallback(() => {
    if (isDirty) {
      const confirmDiscard = window.confirm(
        "You have unsaved changes in this milestone. Are you sure you want to discard them?"
      );
      if (!confirmDiscard) return;
    }
    onClose();
    // Restore focus to triggering element
    setTimeout(() => {
      triggerElementRef.current?.focus();
    }, 50);
  }, [isDirty, onClose]);

  // Keyboard navigation & Focus trapping
  useEffect(() => {
    if (!isOpen) return;

    // Prevent body background scroll while drawer is open
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      // Escape key with unsaved changes safeguard
      if (e.key === "Escape") {
        e.preventDefault();
        handleAttemptClose();
        return;
      }

      // Focus trap on Tab
      if (e.key === "Tab" && drawerRef.current) {
        const focusable = drawerRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [href], [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;

        const firstElement = focusable[0];
        const lastElement = focusable[focusable.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen, handleAttemptClose]);

  // Quick Fetch Repo by URL / Shorthand inside drawer
  const handleQuickFetchRepo = async () => {
    const parsed = parseGitHubUrl(repoFetchUrl);
    if (!parsed) {
      setRepoFetchError(
        "Please enter a valid GitHub URL (e.g. https://github.com/THARANESHSELVAM/Personal-Portfolio-Website) or shorthand (owner/repo)."
      );
      setRepoFetchSuccess(null);
      return;
    }

    setIsFetchingRepo(true);
    setRepoFetchError(null);
    setRepoFetchSuccess(null);

    try {
      const data = await fetchGitHubRepo(parsed.owner, parsed.repo);
      setTechnology(data.primaryLanguage || toTitleCase(data.name));
      setCategory(data.competencyArea);
      setMasteryLevel("Production Ready");
      setKeyTakeaway(
        data.description
          ? `Engineered and verified ${data.name}: ${data.description}`
          : `Implemented production-grade ${data.primaryLanguage} architecture with modular components in ${data.name}.`
      );
      setRepoOrDemoUrl(data.html_url);
      setTagsInput(
        [
          data.competencyArea.replace(/\s+/g, ""),
          data.primaryLanguage,
          ...data.languages.slice(1, 3),
          ...data.topics.slice(0, 2),
        ]
          .filter(Boolean)
          .join(", ")
      );
      setRepoFetchSuccess(`✓ Auto-filled from "${data.name}"! Review fields below.`);
      if (errors.technology || errors.keyTakeaway || errors.repoOrDemoUrl) {
        setErrors({});
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to fetch repository from GitHub.";
      setRepoFetchError(msg);
      setRepoFetchSuccess(null);
    } finally {
      setIsFetchingRepo(false);
    }
  };

  // Form submission & Validation
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    const trimmedTech = technology.trim();
    const trimmedTakeaway = keyTakeaway.trim();
    const trimmedUrl = repoOrDemoUrl.trim();

    if (!trimmedTech) {
      newErrors.technology = "Technology or concept name is required.";
    }

    if (!trimmedTakeaway) {
      newErrors.keyTakeaway = "Key takeaway / proof of work is required.";
    } else if (trimmedTakeaway.length < 10) {
      newErrors.keyTakeaway = "Please provide a more descriptive takeaway (at least 10 characters).";
    }

    if (trimmedUrl && !isValidUrl(trimmedUrl)) {
      newErrors.repoOrDemoUrl = "Please enter a valid URL (starting with http:// or https://) or leave blank.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      // Focus first error field
      if (newErrors.technology && technologyInputRef.current) {
        technologyInputRef.current.focus();
      }
      return;
    }

    // Process tags
    const processedTags = tagsInput
      .split(",")
      .map((t) => t.trim().replace(/^#/, ""))
      .filter((t) => t.length > 0);

    if (processedTags.length === 0) {
      processedTags.push(category.replace(/\s+/g, ""));
    }

    if (mode === "create") {
      onSaveCreate({
        technology: trimmedTech,
        category,
        masteryLevel,
        keyTakeaway: trimmedTakeaway,
        repoOrDemoUrl: trimmedUrl || undefined,
        tags: processedTags,
      });
    } else if (mode === "edit" && initialEntry) {
      onSaveEdit(initialEntry.id, {
        technology: trimmedTech,
        category,
        masteryLevel,
        keyTakeaway: trimmedTakeaway,
        repoOrDemoUrl: trimmedUrl || undefined,
        tags: processedTags,
      });
    }

    onClose();
    setTimeout(() => {
      triggerElementRef.current?.focus();
    }, 50);
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 overflow-hidden" 
      aria-labelledby="drawer-title" 
      role="dialog" 
      aria-modal="true"
    >
      {/* Semi-transparent backdrop with blur */}
      <div
        className="fixed inset-0 bg-slate-900/60 dark:bg-black/80 backdrop-blur-xs transition-opacity duration-300 animate-in fade-in"
        onClick={handleAttemptClose}
        aria-hidden="true"
      />

      {/* Slide-over Drawer Panel */}
      <div 
        ref={drawerRef}
        className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10"
      >
        <div className="w-screen max-w-xl bg-white dark:bg-[#070c18] border-l border-slate-200 dark:border-white/[0.1] shadow-2xl flex flex-col justify-between overflow-hidden animate-in slide-in-from-right duration-300">
          
          {/* Drawer Header */}
          <div className="p-6 border-b border-slate-200 dark:border-white/[0.08] flex items-center justify-between shrink-0 bg-slate-50/70 dark:bg-white/[0.02]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-50 dark:bg-cyan-500/10 text-cyan-700 dark:text-cyan-400 border border-cyan-200 dark:border-cyan-500/20 flex items-center justify-center shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h2 id="drawer-title" className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                  {mode === "create" ? "Log Learning Milestone" : "Edit Learning Milestone"}
                </h2>
                <p id="drawer-subtitle" className="text-xs text-slate-500 dark:text-slate-400">
                  {mode === "create" 
                    ? "Add a verified technical accomplishment to power your Competency Matrix & dynamic ATS resume."
                    : `Updating milestone "${initialEntry?.technology || ""}" (Original date: ${initialEntry?.dateLogged || "preserved"}).`}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleAttemptClose}
              aria-label="Close milestone drawer"
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/[0.06] transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-cyan-500"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Body - Scrollable Form */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            
            {/* Quick Auto-Fill from GitHub Expandable Section (Create Mode or Edit) */}
            <div className="rounded-2xl border border-slate-200 dark:border-white/[0.08] bg-slate-50/60 dark:bg-white/[0.02] p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <GithubIcon className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                  <span className="text-xs font-bold text-slate-900 dark:text-white">
                    Auto-Fill from GitHub
                  </span>
                  <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-cyan-50 text-cyan-700 dark:bg-cyan-500/10 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-500/30">
                    1-Click
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      onOpenGitHubBrowser();
                    }}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium bg-slate-200 hover:bg-slate-300 text-slate-800 dark:bg-white/10 dark:hover:bg-white/20 dark:text-white transition-colors cursor-pointer"
                  >
                    <Search className="w-3 h-3 text-cyan-600 dark:text-cyan-400" />
                    <span>Browse Repos</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsGitHubPanelExpanded(!isGitHubPanelExpanded)}
                    aria-expanded={isGitHubPanelExpanded}
                    className="text-[11px] font-medium text-cyan-600 dark:text-cyan-400 hover:underline cursor-pointer"
                  >
                    {isGitHubPanelExpanded ? "Hide URL Bar" : "Paste URL"}
                  </button>
                </div>
              </div>

              {isGitHubPanelExpanded && (
                <div className="space-y-2 pt-1 animate-in fade-in slide-in-from-top-1">
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
                          handleQuickFetchRepo();
                        }
                      }}
                      placeholder="https://github.com/THARANESHSELVAM/repo or owner/repo"
                      className="flex-1 px-3 py-1.5 text-xs font-mono rounded-xl bg-white border border-slate-300 text-slate-900 placeholder-slate-400 dark:bg-[#040711] dark:border-white/[0.1] dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                    />
                    <button
                      type="button"
                      onClick={handleQuickFetchRepo}
                      disabled={isFetchingRepo || !repoFetchUrl.trim()}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-400 hover:to-cyan-500 text-white font-bold text-xs transition-all disabled:opacity-50 shrink-0 shadow-xs cursor-pointer"
                    >
                      {isFetchingRepo ? (
                        <>
                          <Loader2 className="w-3 h-3 animate-spin" />
                          <span>Fetching...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-3 h-3" />
                          <span>Fetch</span>
                        </>
                      )}
                    </button>
                  </div>

                  {repoFetchError && (
                    <div className="p-2 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 dark:bg-rose-500/10 dark:border-rose-500/30 dark:text-rose-300 text-xs flex items-center gap-2">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0 text-rose-500" />
                      <span>{repoFetchError}</span>
                    </div>
                  )}

                  {repoFetchSuccess && (
                    <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 dark:bg-emerald-500/10 dark:border-emerald-500/30 dark:text-emerald-300 text-xs flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-emerald-500" />
                      <span>{repoFetchSuccess}</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Main Form Fields */}
            <form id="milestone-drawer-form" onSubmit={handleSubmit} noValidate className="space-y-5">
              
              {/* Technology Name */}
              <div className="space-y-1.5">
                <label 
                  htmlFor="drawer-technology-input" 
                  className="text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center justify-between"
                >
                  <span>Technology / Concept Name <span className="text-rose-500">*</span></span>
                  <span className="text-[11px] text-slate-400 font-normal">Primary skill identifier</span>
                </label>
                <input
                  id="drawer-technology-input"
                  ref={technologyInputRef}
                  type="text"
                  placeholder="e.g. Next.js 15 App Router & Server Actions"
                  value={technology}
                  aria-invalid={!!errors.technology}
                  aria-describedby={errors.technology ? "err-drawer-tech" : undefined}
                  onChange={(e) => {
                    setTechnology(e.target.value);
                    if (errors.technology) setErrors({ ...errors, technology: "" });
                  }}
                  className={`w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-50 dark:bg-[#040711] text-slate-900 dark:text-white placeholder-slate-400 border focus:outline-none focus:ring-2 transition-colors ${
                    errors.technology
                      ? "border-rose-500 focus:ring-rose-500/50"
                      : "border-slate-300 dark:border-white/[0.1] focus:ring-cyan-500/50"
                  }`}
                />
                {errors.technology && (
                  <p id="err-drawer-tech" className="text-xs text-rose-500 flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{errors.technology}</span>
                  </p>
                )}
              </div>

              {/* Category & Mastery Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Core Competency Area */}
                <div className="space-y-1.5">
                  <label 
                    htmlFor="drawer-category-select"
                    className="text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5"
                  >
                    <Layers className="w-3.5 h-3.5 text-slate-400" />
                    <span>Competency Domain <span className="text-rose-500">*</span></span>
                  </label>
                  <select
                    id="drawer-category-select"
                    value={category}
                    onChange={(e) => setCategory(e.target.value as CompetencyArea)}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-50 dark:bg-[#040711] text-slate-900 dark:text-white border border-slate-300 dark:border-white/[0.1] focus:outline-none focus:ring-2 focus:ring-cyan-500/50 cursor-pointer"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Mastery Level */}
                <div className="space-y-1.5">
                  <label 
                    htmlFor="drawer-mastery-select"
                    className="text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5"
                  >
                    <Award className="w-3.5 h-3.5 text-slate-400" />
                    <span>Recorded Mastery <span className="text-rose-500">*</span></span>
                  </label>
                  <select
                    id="drawer-mastery-select"
                    value={masteryLevel}
                    onChange={(e) => setMasteryLevel(e.target.value as MasteryLevel)}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-50 dark:bg-[#040711] text-slate-900 dark:text-white border border-slate-300 dark:border-white/[0.1] focus:outline-none focus:ring-2 focus:ring-cyan-500/50 cursor-pointer"
                  >
                    {MASTERY_LEVELS.map((lvl) => (
                      <option key={lvl} value={lvl}>
                        {lvl}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Key Takeaway / Proof of Work */}
              <div className="space-y-1.5">
                <label 
                  htmlFor="drawer-takeaway-textarea"
                  className="text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center justify-between"
                >
                  <span>Key Takeaway &amp; Proof-of-Work <span className="text-rose-500">*</span></span>
                  <span className="text-[11px] text-slate-400 font-normal">Min 10 characters</span>
                </label>
                <textarea
                  id="drawer-takeaway-textarea"
                  rows={3}
                  placeholder="Describe the architectural patterns implemented, performance optimizations, or hands-on lessons learned..."
                  value={keyTakeaway}
                  aria-invalid={!!errors.keyTakeaway}
                  aria-describedby={errors.keyTakeaway ? "err-drawer-takeaway" : undefined}
                  onChange={(e) => {
                    setKeyTakeaway(e.target.value);
                    if (errors.keyTakeaway) setErrors({ ...errors, keyTakeaway: "" });
                  }}
                  className={`w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-50 dark:bg-[#040711] text-slate-900 dark:text-white placeholder-slate-400 border focus:outline-none focus:ring-2 transition-colors ${
                    errors.keyTakeaway
                      ? "border-rose-500 focus:ring-rose-500/50"
                      : "border-slate-300 dark:border-white/[0.1] focus:ring-cyan-500/50"
                  }`}
                />
                {errors.keyTakeaway && (
                  <p id="err-drawer-takeaway" className="text-xs text-rose-500 flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{errors.keyTakeaway}</span>
                  </p>
                )}
              </div>

              {/* Repository or Demo URL */}
              <div className="space-y-1.5">
                <label 
                  htmlFor="drawer-url-input"
                  className="text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center justify-between"
                >
                  <span className="flex items-center gap-1.5">
                    <GithubIcon className="w-3.5 h-3.5 text-slate-400" />
                    <span>Proof-of-Work / Repository URL (Optional)</span>
                  </span>
                  <span className="text-[11px] text-slate-400 font-normal">GitHub, Demo or Docs</span>
                </label>
                <input
                  id="drawer-url-input"
                  type="url"
                  placeholder="https://github.com/THARANESHSELVAM/Personal-Portfolio-Website"
                  value={repoOrDemoUrl}
                  aria-invalid={!!errors.repoOrDemoUrl}
                  aria-describedby={errors.repoOrDemoUrl ? "err-drawer-url" : undefined}
                  onChange={(e) => {
                    setRepoOrDemoUrl(e.target.value);
                    if (errors.repoOrDemoUrl) setErrors({ ...errors, repoOrDemoUrl: "" });
                  }}
                  className={`w-full px-3.5 py-2.5 text-xs sm:text-sm font-mono rounded-xl bg-slate-50 dark:bg-[#040711] text-slate-900 dark:text-white placeholder-slate-400 border focus:outline-none focus:ring-2 transition-colors ${
                    errors.repoOrDemoUrl
                      ? "border-rose-500 focus:ring-rose-500/50"
                      : "border-slate-300 dark:border-white/[0.1] focus:ring-cyan-500/50"
                  }`}
                />
                {errors.repoOrDemoUrl && (
                  <p id="err-drawer-url" className="text-xs text-rose-500 flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{errors.repoOrDemoUrl}</span>
                  </p>
                )}
              </div>

              {/* Tags Input */}
              <div className="space-y-1.5">
                <label 
                  htmlFor="drawer-tags-input"
                  className="text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center justify-between"
                >
                  <span className="flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-slate-400" />
                    <span>Tags (Comma-separated)</span>
                  </span>
                  <span className="text-[11px] text-slate-400 font-normal">e.g. Next.js, React19, SSR</span>
                </label>
                <input
                  id="drawer-tags-input"
                  type="text"
                  placeholder="Next.js, React19, AppRouter, SSR"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm font-mono rounded-xl bg-slate-50 dark:bg-[#040711] text-slate-900 dark:text-white placeholder-slate-400 border border-slate-300 dark:border-white/[0.1] focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                />
                <p className="text-[11px] text-slate-400 leading-normal">
                  Tags are extracted for search, evidence indexing, and dynamic skills derivation.
                </p>
              </div>

              {/* Metadata preservation notice in edit mode */}
              {mode === "edit" && initialEntry && (
                <div className="p-3 rounded-xl bg-cyan-50/70 dark:bg-cyan-950/30 border border-cyan-200 dark:border-cyan-500/20 text-xs text-cyan-800 dark:text-cyan-300 flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 shrink-0 text-cyan-600 dark:text-cyan-400" />
                  <span>
                    Original record ID <code className="font-mono font-bold">{initialEntry.id}</code> and dateLogged <code className="font-mono font-bold">{initialEntry.dateLogged}</code> will be preserved.
                  </span>
                </div>
              )}
            </form>
          </div>

          {/* Drawer Footer Actions - Sticky */}
          <div className="p-4 sm:p-6 border-t border-slate-200 dark:border-white/[0.08] bg-slate-50/90 dark:bg-[#050913] flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3 shrink-0">
            <button
              type="button"
              id="drawer-cancel-btn"
              onClick={handleAttemptClose}
              className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-white/[0.1] text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/[0.06] text-xs font-semibold transition-colors cursor-pointer text-center focus-visible:outline-2 focus-visible:outline-cyan-500"
            >
              Cancel
            </button>

            <div className="flex items-center gap-2 justify-end">
              <button
                type="submit"
                form="milestone-drawer-form"
                id="drawer-save-btn"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-400 hover:to-cyan-500 text-white font-bold text-xs shadow-md shadow-cyan-500/20 transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-cyan-500"
              >
                <Save className="w-4 h-4" />
                <span>{mode === "create" ? "Log Milestone" : "Save Changes"}</span>
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default MilestoneDrawer;

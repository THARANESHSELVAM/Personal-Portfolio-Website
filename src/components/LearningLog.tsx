"use client";

import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { useProfile } from "@/context/ProfileContext";
import { CompetencyArea, MasteryLevel, LearningEntry, getProfileSkillsEvidence, ProjectEvidenceRef } from "@/data/profile";
import { importWorkspaceFromJSON } from "@/lib/datasetLoader";
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
  AlertCircle,
  MoreHorizontal,
  ChevronDown,
  Edit3,
  ArrowUpRight,
  FolderGit2
} from "lucide-react";
import { GithubIcon } from "@/components/Icons";
import { GitHubRepoBrowserModal } from "./GitHubRepoBrowserModal";
import { MilestoneDrawer } from "./MilestoneDrawer";
import { FetchedRepoData } from "@/lib/github";

interface MonthGroup {
  monthKey: string;
  monthTitle: string;
  entries: LearningEntry[];
}

/**
 * Robust date parser for chronological grouping without SSR/locale hydration mismatch.
 */
function parseYearMonth(dateStr: string): { key: string; label: string } {
  if (!dateStr || typeof dateStr !== "string") {
    return { key: "earlier", label: "Earlier Milestones" };
  }
  const parts = dateStr.trim().split("-");
  if (parts.length >= 2) {
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10);
    if (!isNaN(year) && !isNaN(month) && month >= 1 && month <= 12) {
      const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
      ];
      return {
        key: `${year}-${String(month).padStart(2, "0")}`,
        label: `${monthNames[month - 1]} ${year}`,
      };
    }
  }
  return { key: "earlier", label: "Earlier Milestones" };
}

/**
 * Formats ISO date (e.g. "2026-10-18") to a clean date string ("Oct 18, 2026").
 */
function formatTimelineDate(dateStr: string): string {
  if (!dateStr || typeof dateStr !== "string") return "";
  const parts = dateStr.trim().split("-");
  if (parts.length >= 3) {
    const year = parts[0];
    const month = parseInt(parts[1], 10);
    const day = parseInt(parts[2], 10);
    const shortMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    if (month >= 1 && month <= 12 && !isNaN(day)) {
      return `${shortMonths[month - 1]} ${day}, ${year}`;
    }
  }
  return dateStr;
}

export function LearningLog() {
  const {
    state,
    addLearning,
    addLearnings,
    updateLearning,
    deleteLearning,
    exportProfileJSON,
    importProfileJSON,
    resetToDefaults,
    currentUser,
    setActiveTab,
  } = useProfile();

  // ---------------------------------------------------------------------------
  // Phase 5.4: Bidirectional Evidence Linking (Learning Milestone -> Projects)
  // Maps learning entries back to applied projects via canonical skill identity
  // ---------------------------------------------------------------------------
  const profileSkillsEvidence = useMemo(() => {
    return getProfileSkillsEvidence(state);
  }, [state]);

  const appliedProjectsByLearningId = useMemo(() => {
    const map = new Map<string, ProjectEvidenceRef[]>();
    if (!state?.learnings || !state?.projects) return map;

    const activeProjectIds = new Set(state.projects.map((p) => p.id));

    profileSkillsEvidence.skills.forEach((skill) => {
      if (skill.projectRefs.length === 0 || skill.learningRefs.length === 0) return;

      skill.learningRefs.forEach((lRef) => {
        let existing = map.get(lRef.id);
        if (!existing) {
          existing = [];
          map.set(lRef.id, existing);
        }
        skill.projectRefs.forEach((pRef) => {
          // Verify that destination project actually belongs to the active profile
          if (activeProjectIds.has(pRef.id) && !existing.some((p) => p.id === pRef.id)) {
            existing.push(pRef);
          }
        });
      });
    });

    return map;
  }, [state, profileSkillsEvidence]);

  // Filter state
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedMastery, setSelectedMastery] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [highlightedEntryId, setHighlightedEntryId] = useState<string | null>(null);

  // Milestone Create / Edit Drawer State (Phase 5.3)
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [drawerMode, setDrawerMode] = useState<"create" | "edit">("create");
  const [editingEntry, setEditingEntry] = useState<LearningEntry | null>(null);
  const [prefilledFromGitHub, setPrefilledFromGitHub] = useState<FetchedRepoData | null>(null);

  // Secondary utilities menu state ("More Options" dropdown)
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState<boolean>(false);
  const moreMenuRef = useRef<HTMLDivElement>(null);

  // GitHub Modal state for Learning Diary
  const [isGitHubModalOpen, setIsGitHubModalOpen] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Direct case-study navigation from "Applied in" links
  const handleNavigateToCaseStudy = useCallback((projectId: string) => {
    const targetProject = state.projects?.find((p) => p.id === projectId);
    if (!targetProject) return;

    if (typeof window !== "undefined") {
      sessionStorage.setItem("portfolio_target_case_study", projectId);
      window.dispatchEvent(new CustomEvent("open-case-study", { detail: { projectId } }));
    }

    setIsDrawerOpen(false);
    setIsMoreMenuOpen(false);
    setActiveTab("projects");
  }, [state.projects, setActiveTab]);

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

  // Close "More Options" dropdown on outside click or Escape key
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (moreMenuRef.current && !moreMenuRef.current.contains(e.target as Node)) {
        setIsMoreMenuOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isMoreMenuOpen) {
        setIsMoreMenuOpen(false);
      }
    };
    if (isMoreMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isMoreMenuOpen]);

  // Compute live counts per category from current profile state
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {
      All: state.learnings.length,
      Frontend: 0,
      Backend: 0,
      "Cloud & DevOps": 0,
      "Data & AI": 0,
      "System Design": 0,
    };
    state.learnings.forEach((entry) => {
      if (entry.category && counts[entry.category] !== undefined) {
        counts[entry.category]++;
      }
    });
    return counts;
  }, [state.learnings]);

  // Filtered learning entries
  const filteredLearnings = useMemo(() => {
    return state.learnings.filter((entry) => {
      const matchesCategory =
        selectedCategory === "All" || entry.category === selectedCategory;
      const matchesMastery =
        selectedMastery === "All" || entry.masteryLevel === selectedMastery;
      
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        q === "" ||
        (entry.technology && entry.technology.toLowerCase().includes(q)) ||
        (entry.keyTakeaway && entry.keyTakeaway.toLowerCase().includes(q)) ||
        (Array.isArray(entry.tags) && entry.tags.some((t) => t.toLowerCase().includes(q)));

      return matchesCategory && matchesMastery && matchesSearch;
    });
  }, [state.learnings, selectedCategory, selectedMastery, searchQuery]);

  // Group filtered entries chronologically (newest to oldest)
  const groupedEntries = useMemo(() => {
    const sorted = [...filteredLearnings].sort((a, b) => {
      const dateA = a.dateLogged || "";
      const dateB = b.dateLogged || "";
      return dateB.localeCompare(dateA);
    });

    const groups: MonthGroup[] = [];
    const map = new Map<string, MonthGroup>();

    sorted.forEach((entry) => {
      const { key, label } = parseYearMonth(entry.dateLogged);
      let group = map.get(key);
      if (!group) {
        group = { monthKey: key, monthTitle: label, entries: [] };
        map.set(key, group);
        groups.push(group);
      }
      group.entries.push(entry);
    });

    return groups;
  }, [filteredLearnings]);

  // Listen for direct learning entry navigation requests (e.g. from Skills Evidence Inspector)
  useEffect(() => {
    const focusAndHighlightEntry = (targetId: string) => {
      setSelectedCategory("All");
      setSelectedMastery("All");
      setSearchQuery("");
      setHighlightedEntryId(targetId);

      setTimeout(() => {
        const el = document.getElementById(`learning-entry-${targetId}`);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "center" });
          el.focus();
        }
      }, 150);

      const timer = setTimeout(() => {
        setHighlightedEntryId((current) => (current === targetId ? null : current));
      }, 4000);
      return () => clearTimeout(timer);
    };

    const handleHighlightEvent = (e: CustomEvent<{ entryId?: string }>) => {
      const targetId = e.detail?.entryId;
      if (targetId) {
        focusAndHighlightEntry(targetId);
      }
    };

    if (typeof window !== "undefined") {
      const pendingId = sessionStorage.getItem("portfolio_target_learning_entry");
      if (pendingId) {
        sessionStorage.removeItem("portfolio_target_learning_entry");
        focusAndHighlightEntry(pendingId);
      }
    }

    window.addEventListener("highlight-learning-entry", handleHighlightEvent as EventListener);
    return () => {
      window.removeEventListener("highlight-learning-entry", handleHighlightEvent as EventListener);
    };
  }, []);

  // From GitHub Browser: 1-Click prefill repo into Drawer
  const handleSelectRepoForDiary = (data: FetchedRepoData) => {
    setPrefilledFromGitHub(data);
    setDrawerMode("create");
    setEditingEntry(null);
    setIsDrawerOpen(true);
    setStatusMessage(`Imported "${data.name}" metadata from GitHub. Review values and click Save.`);
    setTimeout(() => setStatusMessage(null), 4000);
  };

  // Handlers for Drawer submission
  const handleSaveCreate = (entryData: Omit<LearningEntry, "id" | "dateLogged">) => {
    addLearning(entryData);
    setStatusMessage(`Milestone "${entryData.technology}" logged! ATS Resume & Skills Matrix updated.`);
    setTimeout(() => setStatusMessage(null), 4000);
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
      });
    } catch {}
  };

  const handleSaveEdit = (id: string, updates: Partial<LearningEntry>) => {
    updateLearning(id, updates);
    setStatusMessage(`✓ Milestone "${updates.technology || 'entry'}" updated! Changes synchronized.`);
    setTimeout(() => setStatusMessage(null), 4000);
    try {
      confetti({
        particleCount: 40,
        spread: 50,
        origin: { y: 0.7 },
      });
    } catch {}
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const validation = importWorkspaceFromJSON(content, currentUser || undefined);
      if (validation.success && validation.state) {
        const success = importProfileJSON(content);
        if (success) {
          setStatusMessage("✓ Workspace JSON successfully validated, imported, and synchronized!");
        } else {
          setStatusMessage("Error: Failed to apply imported workspace data.");
        }
      } else {
        setStatusMessage(`Import rejected: ${validation.error || "Invalid workspace data structure."}`);
      }
      setTimeout(() => setStatusMessage(null), 5000);
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const getMasteryBadge = (level: MasteryLevel) => {
    switch (level) {
      case "Production Ready":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:border-emerald-500/30">
            <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>Production Ready</span>
          </span>
        );
      case "Built Demo":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-cyan-50 text-cyan-800 border border-cyan-200 dark:bg-cyan-500/10 dark:text-cyan-300 dark:border-cyan-500/30">
            <Zap className="w-3 h-3 text-cyan-600 dark:text-cyan-400 shrink-0" />
            <span>Built Demo</span>
          </span>
        );
      case "Learned Concept":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-violet-50 text-violet-800 border border-violet-200 dark:bg-violet-500/10 dark:text-violet-300 dark:border-violet-500/30">
            <Compass className="w-3 h-3 text-violet-600 dark:text-violet-400 shrink-0" />
            <span>Learned Concept</span>
          </span>
        );
    }
  };

  const isFilterActive =
    selectedCategory !== "All" ||
    selectedMastery !== "All" ||
    searchQuery.trim() !== "";

  const handleResetFilters = () => {
    setSelectedCategory("All");
    setSelectedMastery("All");
    setSearchQuery("");
  };

  return (
    <section id="diary" data-section="learning-log" aria-labelledby="journal-heading" className="py-8 sm:py-12 relative pb-24">
      <div id="learning-log" className="sr-only" aria-hidden="true" />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* 1. Editorial Page Header */}
        <div className="space-y-3 border-b border-slate-200/80 dark:border-white/[0.08] pb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-cyan-50 text-cyan-700 border border-cyan-200 dark:bg-cyan-500/10 dark:text-cyan-400 dark:border-cyan-500/20">
            <BookOpen className="w-3.5 h-3.5" />
            <span>ENGINEERING CHANGELOG</span>
          </div>
          <div className="space-y-1.5">
            <h1 id="journal-heading" className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Engineering Learning Journal
            </h1>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl">
              A chronological record of technical architectures explored, implementation milestones achieved, and key takeaways verified through hands-on codebases.
            </p>
          </div>
        </div>

        {/* Global Toast Notification */}
        {statusMessage && (
          <div 
            role="status"
            className="p-4 rounded-2xl bg-cyan-50 text-cyan-900 border border-cyan-200 dark:bg-cyan-950/70 dark:border-cyan-500/30 dark:text-cyan-200 text-xs sm:text-sm font-semibold flex items-center justify-between shadow-md animate-in fade-in slide-in-from-top-2"
          >
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-600 dark:text-cyan-400 shrink-0" />
              <span>{statusMessage}</span>
            </div>
            <button
              type="button"
              onClick={() => setStatusMessage(null)}
              aria-label="Dismiss message"
              className="text-cyan-600 dark:text-cyan-400 hover:opacity-75 cursor-pointer p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* 2. Restructured Management Toolbar: Primary Actions + Secondary Utilities */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3.5 sm:p-4 rounded-2xl bg-white border border-slate-200 dark:bg-[#070c18] dark:border-white/[0.08] shadow-xs">
          
          {/* Primary Actions Area */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              type="button"
              id="log-new-milestone-btn"
              onClick={() => {
                setDrawerMode("create");
                setEditingEntry(null);
                setPrefilledFromGitHub(null);
                setIsDrawerOpen(true);
              }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-400 hover:to-cyan-500 text-white font-bold text-xs sm:text-sm shadow-md shadow-cyan-500/20 transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-cyan-500 shrink-0"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Log New Learning Milestone</span>
            </button>

            <button
              type="button"
              onClick={() => setIsGitHubModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/[0.06] dark:hover:bg-white/[0.1] text-slate-800 dark:text-slate-200 font-semibold text-xs border border-slate-200 dark:border-white/[0.08] shadow-xs transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-cyan-500 shrink-0"
              title="Browse public GitHub repositories to auto-import proof-of-work into diary"
            >
              <GithubIcon className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
              <span>Browse GitHub</span>
            </button>

            <span className="text-xs text-slate-500 dark:text-slate-400 font-mono hidden md:inline pl-1">
              • {state.learnings.length} verified entries
            </span>
          </div>

          {/* Secondary Utilities Area: Compact More Options Menu */}
          <div className="relative self-end sm:self-auto shrink-0" ref={moreMenuRef}>
            <button
              type="button"
              id="more-options-btn"
              onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)}
              aria-haspopup="menu"
              aria-expanded={isMoreMenuOpen}
              aria-label="More options (Export, Import, Reset)"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-white/[0.04] hover:bg-slate-200 dark:hover:bg-white/[0.08] border border-slate-200 dark:border-white/[0.08] transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-cyan-500"
            >
              <MoreHorizontal className="w-4 h-4 text-slate-500 dark:text-slate-400" />
              <span className="text-xs font-medium">Data Options</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isMoreMenuOpen ? "rotate-180" : ""}`} />
            </button>

            {/* Dropdown Menu */}
            {isMoreMenuOpen && (
              <div 
                role="menu"
                aria-labelledby="more-options-btn"
                className="absolute right-0 top-full mt-2 w-56 rounded-2xl bg-white dark:bg-[#0b1220] border border-slate-200 dark:border-white/[0.1] shadow-xl p-1.5 z-30 space-y-1 animate-in fade-in slide-in-from-top-1 text-xs"
              >
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    exportProfileJSON();
                    setIsMoreMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/[0.06] transition-colors text-left cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                  <span>Export JSON Backup</span>
                </button>

                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    fileInputRef.current?.click();
                    setIsMoreMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/[0.06] transition-colors text-left cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                  <span>Import JSON File</span>
                </button>

                <div className="border-t border-slate-100 dark:border-white/[0.06] my-1" />

                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    setIsMoreMenuOpen(false);
                    if (window.confirm("Reset all learnings and state back to default initial seed data? This cannot be undone.")) {
                      resetToDefaults();
                      setStatusMessage("Profile state restored to initial starter milestones.");
                      setTimeout(() => setStatusMessage(null), 3000);
                    }
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors text-left cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-rose-500" />
                  <span>Reset to Starter Seed</span>
                </button>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>
        </div>

        {/* 3. Search and Multi-Tier Category / Mastery Filters */}
        <div className="space-y-3.5">
          {/* Category Filter Strip with Live Counts */}
          <div className="overflow-x-auto pb-1 -mx-4 px-4 sm:mx-0 sm:px-0">
            <div className="flex items-center gap-2 min-w-max">
              {categories.map((cat) => {
                const isSelected = selectedCategory === cat;
                const count = categoryCounts[cat] ?? 0;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all duration-200 cursor-pointer focus-visible:outline-2 focus-visible:outline-cyan-500 ${
                      isSelected
                        ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs"
                        : "bg-white text-slate-700 hover:bg-slate-100 dark:bg-[#070c18] dark:text-slate-300 dark:hover:bg-white/[0.06] border border-slate-200 dark:border-white/[0.08]"
                    }`}
                  >
                    <span>{cat}</span>
                    <span className={`px-1.5 py-0.2 rounded-md text-[10px] font-mono ${
                      isSelected
                        ? "bg-slate-800 text-slate-200 dark:bg-slate-200 dark:text-slate-800"
                        : count > 0
                        ? "bg-cyan-50 text-cyan-700 dark:bg-cyan-500/10 dark:text-cyan-300"
                        : "bg-slate-100 text-slate-400 dark:bg-white/[0.06] dark:text-slate-500"
                    }`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Search + Mastery Row */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search technologies, takeaways, tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-xl bg-white border border-slate-200 text-slate-900 placeholder-slate-400 dark:bg-[#070c18] dark:border-white/[0.08] dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
              />
            </div>

            <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
              <span className="text-[11px] text-slate-400 font-mono mr-1 hidden lg:inline">
                Mastery:
              </span>
              {masteryLevels.map((lvl) => {
                const isSelected = selectedMastery === lvl;
                return (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setSelectedMastery(lvl)}
                    className={`text-xs px-2.5 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors cursor-pointer border ${
                      isSelected
                        ? "bg-cyan-50 text-cyan-800 border-cyan-200 dark:bg-cyan-500/20 dark:text-cyan-300 dark:border-cyan-500/40"
                        : "text-slate-600 dark:text-slate-400 border-transparent hover:bg-slate-100 dark:hover:bg-white/[0.04]"
                    }`}
                  >
                    {lvl}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Filter Status Bar */}
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-1 pt-1">
            <span>
              Showing <strong className="text-slate-900 dark:text-white">{filteredLearnings.length}</strong> of {state.learnings.length} milestones
              {selectedCategory !== "All" && ` in ${selectedCategory}`}
              {selectedMastery !== "All" && ` (${selectedMastery})`}
            </span>
            {isFilterActive && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="text-cyan-600 dark:text-cyan-400 hover:underline font-medium cursor-pointer"
              >
                Clear all filters
              </button>
            )}
          </div>
        </div>

        {/* 4. Chronological Engineering Timeline Feed */}
        {state.learnings.length === 0 ? (
          /* Blank Slate Profile Empty State */
          <div className="text-center py-16 px-6 rounded-3xl bg-white border border-slate-200 dark:bg-[#070c18] dark:border-white/[0.08] max-w-lg mx-auto space-y-4 shadow-xs">
            <div className="w-14 h-14 rounded-2xl bg-cyan-50 text-cyan-700 dark:bg-cyan-500/10 dark:text-cyan-400 flex items-center justify-center mx-auto border border-cyan-200 dark:border-cyan-500/20">
              <BookOpen className="w-7 h-7" />
            </div>
            <div className="space-y-1.5">
              <h4 className="text-lg font-bold text-slate-900 dark:text-white">
                Engineering Learning Journal is Clean &amp; Ready
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 max-w-sm mx-auto leading-relaxed">
                You are on a clean blank slate. Document technical architectures, tools, and prototypes you explore to automatically power your Skills Competency Matrix and ATS resume.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setDrawerMode("create");
                setEditingEntry(null);
                setPrefilledFromGitHub(null);
                setIsDrawerOpen(true);
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-400 hover:to-cyan-500 text-white font-bold text-xs shadow-md shadow-cyan-500/20 transition-all cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>+ Log First Learning Milestone</span>
            </button>
          </div>
        ) : filteredLearnings.length === 0 ? (
          /* Filtered Results Empty State */
          <div className="text-center py-16 rounded-3xl bg-white border border-dashed border-slate-200 dark:bg-[#070c18] dark:border-white/[0.08] max-w-md mx-auto space-y-3">
            <BookOpen className="w-8 h-8 text-slate-400 mx-auto opacity-50" />
            <p className="text-slate-600 dark:text-slate-400 text-sm">
              No learning milestones match the active filters.
            </p>
            <button
              type="button"
              onClick={handleResetFilters}
              className="text-xs font-semibold text-cyan-600 dark:text-cyan-400 hover:underline cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          /* Chronological Timeline Stream grouped by Month & Year */
          <div className="relative border-l-2 border-slate-200 dark:border-white/[0.08] ml-4 sm:ml-6 pl-5 sm:pl-8 space-y-12">
            {groupedEntries.map((group) => (
              <div key={group.monthKey} className="space-y-4">
                
                {/* Month Group Timeline Marker */}
                <div className="relative -ml-[29px] sm:-ml-[41px] flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-white dark:bg-[#070c18] border-2 border-cyan-500 text-cyan-600 dark:text-cyan-400 flex items-center justify-center shrink-0 shadow-xs">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white tracking-tight">
                      {group.monthTitle}
                    </h3>
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 dark:bg-white/[0.04] dark:text-slate-400 border border-slate-200 dark:border-white/[0.06]">
                      {group.entries.length} {group.entries.length === 1 ? "milestone" : "milestones"}
                    </span>
                  </div>
                </div>

                {/* Milestones inside Month */}
                <div className="space-y-4 pt-1">
                  {group.entries.map((entry) => {
                    const isHighlighted = highlightedEntryId === entry.id;
                    const appliedProjects = appliedProjectsByLearningId.get(entry.id);
                    return (
                      <article
                        key={entry.id}
                        id={`learning-entry-${entry.id}`}
                        tabIndex={isHighlighted ? 0 : undefined}
                        className={`rounded-2xl sm:rounded-3xl p-5 sm:p-6 transition-all duration-300 space-y-4 border ${
                          isHighlighted
                            ? "border-cyan-500 ring-4 ring-cyan-500/40 shadow-xl shadow-cyan-500/25 bg-cyan-500/[0.04] dark:bg-cyan-500/[0.06]"
                            : "bg-white dark:bg-[#070c18] border-slate-200 dark:border-white/[0.08] shadow-xs hover:border-slate-300 dark:hover:border-white/[0.16]"
                        }`}
                      >
                        {/* Top Metadata Header: Date, Category, Mastery */}
                        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-white/[0.04] pb-3">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold uppercase bg-slate-100 dark:bg-white/[0.04] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/[0.08]">
                              {entry.category}
                            </span>
                            {getMasteryBadge(entry.masteryLevel)}
                          </div>

                          <time className="flex items-center gap-1.5 text-xs font-mono text-slate-500 dark:text-slate-400">
                            <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span>{formatTimelineDate(entry.dateLogged)}</span>
                          </time>
                        </div>

                        {/* Technology Title */}
                        <div>
                          <h4 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight leading-snug">
                            {entry.technology}
                          </h4>
                        </div>

                        {/* Key Takeaway / Proof of Work Box */}
                        <div className="p-3.5 sm:p-4 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/70 dark:border-white/[0.04] space-y-1">
                          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
                            Verified Proof-of-Work &amp; Takeaway:
                          </span>
                          <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 italic leading-relaxed">
                            &ldquo;{entry.keyTakeaway}&rdquo;
                          </p>
                        </div>

                        {/* Reciprocal Project Evidence: Applied In (Phase 5.4) */}
                        {appliedProjects && appliedProjects.length > 0 && (
                          <div className="pt-0.5 space-y-1.5" id={`applied-in-section-${entry.id}`}>
                            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 dark:text-slate-500 font-semibold block">
                              Applied in
                            </span>
                            <div className="flex flex-wrap items-center gap-2">
                              {appliedProjects.map((proj) => (
                                <button
                                  key={proj.id}
                                  type="button"
                                  id={`applied-project-btn-${entry.id}-${proj.id}`}
                                  onClick={() => handleNavigateToCaseStudy(proj.id)}
                                  aria-label={`Open case study for applied project ${proj.title}`}
                                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-200 bg-slate-100/90 hover:bg-cyan-50 dark:bg-white/[0.04] dark:hover:bg-cyan-500/10 border border-slate-200/80 dark:border-white/[0.08] hover:border-cyan-300 dark:hover:border-cyan-500/30 transition-all duration-150 cursor-pointer group focus-visible:outline-2 focus-visible:outline-cyan-500"
                                  title={`View Case Study: ${proj.title}`}
                                >
                                  <FolderGit2 className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400 shrink-0" />
                                  <span className="font-semibold text-slate-800 dark:text-slate-100 group-hover:text-cyan-700 dark:group-hover:text-cyan-300 transition-colors">
                                    {proj.title}
                                  </span>
                                  <ArrowUpRight className="w-3 h-3 text-slate-400 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors shrink-0" />
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Bottom Row: Tags, Code Proof, Edit Action, Delete Action */}
                        <div className="pt-2 flex flex-wrap items-center justify-between gap-2">
                          <div className="flex flex-wrap items-center gap-1.5">
                            {Array.isArray(entry.tags) && entry.tags.map((t) => (
                              <span
                                key={t}
                                className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-slate-100 dark:bg-white/[0.04] text-slate-600 dark:text-slate-400 border border-slate-200/60 dark:border-white/[0.04]"
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
                                aria-label={`View repository or demo for ${entry.technology}`}
                                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold text-cyan-700 dark:text-cyan-300 bg-cyan-50 dark:bg-cyan-500/10 hover:bg-cyan-100 dark:hover:bg-cyan-500/20 border border-cyan-200 dark:border-cyan-500/30 transition-colors"
                                title="View Proof of Work / Repository"
                              >
                                <GithubIcon className="w-3.5 h-3.5" />
                                <span>Code Proof</span>
                                <ExternalLink className="w-3 h-3 opacity-60" />
                              </a>
                            )}

                            {/* Phase 5.3: Accessible Edit Button */}
                            <button
                              type="button"
                              id={`edit-milestone-btn-${entry.id}`}
                              onClick={() => {
                                setDrawerMode("edit");
                                setEditingEntry(entry);
                                setPrefilledFromGitHub(null);
                                setIsDrawerOpen(true);
                              }}
                              aria-label={`Edit milestone ${entry.technology}`}
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-cyan-700 dark:hover:text-cyan-300 bg-slate-100 hover:bg-cyan-50 dark:bg-white/[0.04] dark:hover:bg-cyan-500/10 border border-slate-200 dark:border-white/[0.08] transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-cyan-500"
                              title="Edit this milestone"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                              <span>Edit</span>
                            </button>

                            {/* Preserved Delete Action with Confirmation */}
                            <button
                              type="button"
                              id={`delete-milestone-btn-${entry.id}`}
                              onClick={() => {
                                if (window.confirm(`Delete milestone "${entry.technology}"?`)) {
                                  deleteLearning(entry.id);
                                }
                              }}
                              aria-label={`Delete milestone ${entry.technology}`}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
                              title="Delete this milestone"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Timeline Summary Ribbon */}
        <div className="pt-6 border-t border-slate-200/80 dark:border-white/[0.08] flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-mono gap-2">
          <span>Showing {filteredLearnings.length} of {state.learnings.length} milestones across {groupedEntries.length} timeline {groupedEntries.length === 1 ? "period" : "periods"}</span>
          <span>Persisted atomically via ProfileContext</span>
        </div>
      </div>

      {/* Phase 5.3: Reusable Create/Edit Milestone Drawer */}
      <MilestoneDrawer
        isOpen={isDrawerOpen}
        mode={drawerMode}
        initialEntry={editingEntry}
        onClose={() => {
          setIsDrawerOpen(false);
          setEditingEntry(null);
          setPrefilledFromGitHub(null);
        }}
        onSaveCreate={handleSaveCreate}
        onSaveEdit={handleSaveEdit}
        onOpenGitHubBrowser={() => setIsGitHubModalOpen(true)}
        prefilledFromGitHub={prefilledFromGitHub}
        onClearPrefilledGitHub={() => setPrefilledFromGitHub(null)}
      />

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

export default LearningLog;

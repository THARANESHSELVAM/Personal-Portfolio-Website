"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { Project, CompetencyArea } from "@/data/profile";
import {
  fetchUserRepos,
  fetchGitHubRepo,
  toTitleCase,
  GitHubRepoResponse,
  FetchedRepoData,
} from "@/lib/github";
import { GithubIcon } from "@/components/Icons";
import {
  X,
  Search,
  RefreshCw,
  ExternalLink,
  Star,
  GitFork,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sparkles,
  BookOpen,
  ArrowRight,
  Filter,
  Check,
  Calendar,
  Layers,
  Code2,
} from "lucide-react";

interface GitHubRepoBrowserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectRepoForImport: (repoData: FetchedRepoData, autoLogToDiary: boolean) => void;
  onResyncRepo: (existingProject: Project, repoData: FetchedRepoData, autoLogToDiary: boolean) => void;
  savedProjects: Project[];
  defaultUsername?: string;
}

export function GitHubRepoBrowserModal({
  isOpen,
  onClose,
  onSelectRepoForImport,
  onResyncRepo,
  savedProjects,
  defaultUsername = "THARANESHSELVAM",
}: GitHubRepoBrowserModalProps) {
  const [username, setUsername] = useState<string>(defaultUsername);
  const [repos, setRepos] = useState<GitHubRepoResponse[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedLanguage, setSelectedLanguage] = useState<string>("All");
  const [autoLogToDiary, setAutoLogToDiary] = useState<boolean>(true);
  const [actionInProgressRepo, setActionInProgressRepo] = useState<string | null>(null);
  const [hasLoaded, setHasLoaded] = useState<boolean>(false);

  // Adjust username if defaultUsername prop changes
  const [prevDefaultUsername, setPrevDefaultUsername] = useState(defaultUsername);
  if (defaultUsername !== prevDefaultUsername) {
    setPrevDefaultUsername(defaultUsername);
    if (!hasLoaded) {
      setUsername(defaultUsername);
    }
  }

  const handleLoadRepositories = useCallback(async (targetUsername?: string) => {
    const userToFetch = (targetUsername || username || "THARANESHSELVAM").trim();
    if (!userToFetch) return;

    setIsLoading(true);
    setError(null);

    try {
      const fetched = await fetchUserRepos(userToFetch, 1, 60);
      setRepos(fetched);
      setHasLoaded(true);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to load repositories from GitHub.";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  }, [username]);

  // Load repositories on initial modal open if not yet loaded
  useEffect(() => {
    let ignore = false;
    if (isOpen && !hasLoaded && repos.length === 0) {
      const timer = setTimeout(() => {
        if (!ignore) {
          handleLoadRepositories();
        }
      }, 0);
      return () => {
        ignore = true;
        clearTimeout(timer);
      };
    }
  }, [isOpen, hasLoaded, repos.length, handleLoadRepositories]);

  // ESC key to close
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

  // Find if a repo is already in saved projects
  const findMatchingProject = useCallback((repo: GitHubRepoResponse): Project | undefined => {
    const cleanHtmlUrl = repo.html_url.toLowerCase().replace(/\/+$/, "");
    const cleanRepoName = repo.name.toLowerCase();

    return savedProjects.find((p) => {
      if (p.repoUrl) {
        const pCleanUrl = p.repoUrl.toLowerCase().replace(/\/+$/, "");
        if (pCleanUrl === cleanHtmlUrl) return true;
        if (pCleanUrl.endsWith(`/${cleanRepoName}`)) return true;
      }
      // Check title match
      if (p.title.toLowerCase() === toTitleCase(repo.name).toLowerCase()) return true;
      if (p.id.toLowerCase() === cleanRepoName) return true;
      return false;
    });
  }, [savedProjects]);

  // Unique languages for filter tabs
  const availableLanguages = useMemo(() => {
    const set = new Set<string>();
    repos.forEach((r) => {
      if (r.language) set.add(r.language);
    });
    return ["All", ...Array.from(set).sort()];
  }, [repos]);

  // Filtered repositories based on search query and language filter
  const filteredRepos = useMemo(() => {
    return repos.filter((r) => {
      const matchesLang = selectedLanguage === "All" || r.language === selectedLanguage;
      const q = searchQuery.toLowerCase().trim();
      const matchesQuery =
        !q ||
        r.name.toLowerCase().includes(q) ||
        (r.description && r.description.toLowerCase().includes(q)) ||
        (r.language && r.language.toLowerCase().includes(q)) ||
        (r.topics && r.topics.some((t) => t.toLowerCase().includes(q)));

      return matchesLang && matchesQuery;
    });
  }, [repos, selectedLanguage, searchQuery]);

  // Statistics
  const stats = useMemo(() => {
    let importedCount = 0;
    repos.forEach((r) => {
      if (findMatchingProject(r)) importedCount++;
    });
    return {
      total: repos.length,
      imported: importedCount,
      available: repos.length - importedCount,
    };
  }, [repos, savedProjects, findMatchingProject]);

  // Handle Import Click (fetches full repo data with languages and opens editor)
  const handleImport = async (repo: GitHubRepoResponse) => {
    setActionInProgressRepo(repo.name);
    setError(null);

    try {
      const fullData = await fetchGitHubRepo(repo.owner.login, repo.name);
      onSelectRepoForImport(fullData, autoLogToDiary);
      onClose();
    } catch (err) {
      const msg = err instanceof Error ? err.message : `Failed to fetch details for ${repo.name}`;
      setError(msg);
    } finally {
      setActionInProgressRepo(null);
    }
  };

  // Handle Re-sync Click
  const handleResync = async (repo: GitHubRepoResponse, existingProject: Project) => {
    setActionInProgressRepo(repo.name);
    setError(null);

    try {
      const fullData = await fetchGitHubRepo(repo.owner.login, repo.name);
      onResyncRepo(existingProject, fullData, autoLogToDiary);
      onClose();
    } catch (err) {
      const msg = err instanceof Error ? err.message : `Failed to re-sync ${repo.name}`;
      setError(msg);
    } finally {
      setActionInProgressRepo(null);
    }
  };

  // Language badge color helper
  const getLanguageColor = (lang: string | null) => {
    if (!lang) return "bg-slate-500";
    switch (lang.toLowerCase()) {
      case "typescript":
        return "bg-blue-500";
      case "javascript":
        return "bg-yellow-400";
      case "python":
        return "bg-emerald-500";
      case "go":
        return "bg-cyan-500";
      case "rust":
        return "bg-amber-600";
      case "html":
        return "bg-orange-500";
      case "css":
        return "bg-pink-500";
      case "c++":
      case "cpp":
        return "bg-rose-500";
      case "java":
        return "bg-amber-700";
      default:
        return "bg-indigo-500";
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/75 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Drawer Container */}
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col glass-panel bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl z-10 overflow-hidden">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40">
          <div className="flex items-center justify-between gap-4 mb-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-md">
                <GithubIcon className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                    Sync from My GitHub
                  </h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                    REST API v3
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Browse and 1-click import public repositories directly into your Projects Lab &amp; Learning Diary.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Account Input Bar + Stats */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
            <div className="flex items-center gap-2 flex-1 max-w-md">
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-mono text-slate-400">
                  @
                </span>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleLoadRepositories();
                    }
                  }}
                  placeholder="GitHub username (e.g. THARANESHSELVAM)"
                  className="w-full pl-7 pr-3 py-2 text-xs sm:text-sm font-mono rounded-xl glass-panel text-slate-900 dark:text-white placeholder-slate-400 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                />
              </div>
              <button
                type="button"
                onClick={() => handleLoadRepositories()}
                disabled={isLoading}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 font-semibold text-xs shadow-sm transition-all disabled:opacity-60 shrink-0"
              >
                {isLoading ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <RefreshCw className="w-3.5 h-3.5" />
                )}
                <span>Load Repos</span>
              </button>
            </div>

            {/* Auto-Log Toggle */}
            <label className="flex items-center gap-2 cursor-pointer select-none px-3 py-1.5 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-[11px] sm:text-xs text-cyan-200 font-medium">
              <input
                type="checkbox"
                checked={autoLogToDiary}
                onChange={(e) => setAutoLogToDiary(e.target.checked)}
                className="w-3.5 h-3.5 rounded text-cyan-400 focus:ring-cyan-500/30 border-slate-300 dark:border-slate-700"
              />
              <BookOpen className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span>Auto-log new skills to Verified Learning Diary</span>
            </label>
          </div>

          {/* Quick Stats Pill Strip */}
          {repos.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-slate-200/60 dark:border-slate-800/60 text-xs">
              <span className="text-slate-500 dark:text-slate-400 font-mono text-[11px]">
                Showing {filteredRepos.length} of {stats.total} repositories:
              </span>
              <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium text-[11px]">
                {stats.available} Available
              </span>
              <span className="px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200/50 dark:border-emerald-800/50 font-medium text-[11px]">
                ✓ {stats.imported} In Portfolio
              </span>
            </div>
          )}
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mx-6 mt-4 p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-rose-700 dark:text-rose-300 flex items-start gap-2.5 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-500" />
            <div className="flex-1">
              <p className="font-semibold">GitHub Sync Notice</p>
              <p className="mt-0.5 text-rose-600 dark:text-rose-400">{error}</p>
            </div>
          </div>
        )}

        {/* Search & Language Filter Bar */}
        {repos.length > 0 && (
          <div className="px-6 py-3 border-b border-slate-200/70 dark:border-slate-800/70 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-50/30 dark:bg-slate-900/40">
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Filter repos by name, topic, or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl glass-panel text-slate-900 dark:text-white placeholder-slate-400 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-1 focus:ring-cyan-500/50"
              />
            </div>

            {/* Language filter pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-none">
              <span className="text-[11px] font-mono text-slate-400 mr-1 shrink-0">Lang:</span>
              {availableLanguages.map((lang) => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => setSelectedLanguage(lang)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all shrink-0 ${
                    selectedLanguage === lang
                      ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold shadow-sm"
                      : "glass-panel text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700"
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Repository Cards Grid / List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3">
          {isLoading && repos.length === 0 ? (
            <div className="text-center py-20 space-y-3">
              <Loader2 className="w-8 h-8 text-cyan-400 animate-spin mx-auto" />
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Fetching public repositories for @{username}...
              </p>
              <p className="text-xs text-slate-400 font-mono">
                Connecting to GitHub REST API endpoint https://api.github.com/users/{username}/repos
              </p>
            </div>
          ) : filteredRepos.length === 0 ? (
            <div className="text-center py-16 px-4 space-y-3 glass-panel rounded-2xl border border-slate-200 dark:border-slate-800 max-w-md mx-auto">
              <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto text-slate-500">
                <GithubIcon className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                {repos.length === 0 ? "No Public Repositories Found" : "No Matching Repositories"}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {repos.length === 0
                  ? `We could not find any public repositories for @${username}. Please check spelling or verify your public visibility on GitHub.`
                  : "No repositories matched your current filter criteria. Try clearing search or selecting 'All' languages."}
              </p>
              {repos.length === 0 && (
                <button
                  type="button"
                  onClick={() => handleLoadRepositories("THARANESHSELVAM")}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-teal-400 to-cyan-500 hover:from-teal-300 hover:to-cyan-400 text-slate-950 font-bold shadow-sm shadow-cyan-500/25 transition-all"
                >
                  Load @THARANESHSELVAM Repos
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {filteredRepos.map((repo) => {
                const existingProject = findMatchingProject(repo);
                const isImported = !!existingProject;
                const isWorking = actionInProgressRepo === repo.name;
                const formattedTitle = toTitleCase(repo.name);
                const updatedDate = new Date(repo.updated_at).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                });

                return (
                  <div
                    key={repo.id}
                    className={`p-4 rounded-2xl border transition-all flex flex-col justify-between gap-3 text-left ${
                      isImported
                        ? "bg-slate-50/70 dark:bg-slate-800/40 border-emerald-500/30 dark:border-emerald-500/20 shadow-sm"
                        : "glass-panel bg-white dark:bg-slate-900 border-slate-200/90 dark:border-slate-800/90 hover:border-cyan-400/50 hover:shadow-md"
                    }`}
                  >
                    <div className="space-y-2">
                      {/* Top Row: Title, Status Badge & GitHub External Link */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                              {formattedTitle}
                            </h4>
                            {isImported && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shrink-0">
                                <CheckCircle2 className="w-2.5 h-2.5" />
                                <span>In Portfolio</span>
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] font-mono text-slate-400 block truncate">
                            {repo.full_name}
                          </span>
                        </div>

                        <a
                          href={repo.html_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 shrink-0"
                          title="Open on GitHub"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>

                      {/* Description */}
                      <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                        {repo.description || (
                          <span className="italic text-slate-400">
                            No description provided. Fallback will extract README summary upon import.
                          </span>
                        )}
                      </p>

                      {/* Topics Chips */}
                      {repo.topics && repo.topics.length > 0 && (
                        <div className="flex flex-wrap gap-1 pt-0.5">
                          {repo.topics.slice(0, 4).map((topic) => (
                            <span
                              key={topic}
                              className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                            >
                              #{topic}
                            </span>
                          ))}
                          {repo.topics.length > 4 && (
                            <span className="text-[10px] font-mono text-slate-400 self-center">
                              +{repo.topics.length - 4}
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Bottom Metadata & Action Buttons */}
                    <div className="pt-3 border-t border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-3 text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                        {/* Primary Language */}
                        {repo.language && (
                          <span className="flex items-center gap-1.5">
                            <span
                              className={`w-2 h-2 rounded-full ${getLanguageColor(repo.language)}`}
                            />
                            <span>{repo.language}</span>
                          </span>
                        )}

                        {/* Stars */}
                        {repo.stargazers_count > 0 && (
                          <span className="flex items-center gap-1">
                            <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                            <span>{repo.stargazers_count}</span>
                          </span>
                        )}

                        {/* Forks */}
                        {repo.forks_count > 0 && (
                          <span className="flex items-center gap-1">
                            <GitFork className="w-3 h-3" />
                            <span>{repo.forks_count}</span>
                          </span>
                        )}

                        {/* Updated date */}
                        <span className="hidden sm:inline text-slate-400">
                          {updatedDate}
                        </span>
                      </div>

                      {/* Smart Status Action Button */}
                      <div>
                        {isImported && existingProject ? (
                          <button
                            type="button"
                            onClick={() => handleResync(repo, existingProject)}
                            disabled={isWorking}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 transition-all disabled:opacity-60"
                            title="Re-synchronize tech stack, languages, and metrics while preserving case study notes"
                          >
                            {isWorking ? (
                              <Loader2 className="w-3 h-3 animate-spin" />
                            ) : (
                              <RefreshCw className="w-3 h-3" />
                            )}
                            <span>Already Imported ( Re-sync )</span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleImport(repo)}
                            disabled={isWorking}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-teal-400 to-cyan-500 hover:from-teal-300 hover:to-cyan-400 text-slate-950 font-bold shadow-sm shadow-cyan-500/25 transition-all disabled:opacity-60"
                            title="Fetch repository metadata, languages, and open in Project Editor"
                          >
                            {isWorking ? (
                              <Loader2 className="w-3 h-3 animate-spin" />
                            ) : (
                              <Sparkles className="w-3 h-3" />
                            )}
                            <span>Import to Portfolio</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 flex items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Connected to GitHub Public API • Auto-detects 5 Core Competency Domains</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

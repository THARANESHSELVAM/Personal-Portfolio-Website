"use client";

import { useState } from "react";
import { useProfile } from "@/context/ProfileContext";
import { Project, CompetencyArea } from "@/data/profile";
import { CaseStudyModal } from "./CaseStudyModal";
import { GitHubRepoBrowserModal } from "./GitHubRepoBrowserModal";
import confetti from "canvas-confetti";
import {
  parseGitHubUrl,
  fetchGitHubRepo,
  FetchedRepoData,
  SuggestedLearning,
  toTitleCase,
} from "@/lib/github";
import { 
  Briefcase, 
  ExternalLink, 
  BookOpen, 
  TrendingUp, 
  Zap, 
  Layers, 
  Filter, 
  PlusCircle, 
  X, 
  Check, 
  Trash2,
  Sparkles,
  Target,
  ArrowRight,
  Edit3,
  Loader2,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  Star,
  GitFork,
  Globe
} from "lucide-react";
import { GithubIcon } from "@/components/Icons";

export function ProjectGrid() {
  const {
    state,
    addProject,
    importProjectWithDiarySync,
    resyncProjectFromGitHub,
    addLearnings,
    updateProject,
    deleteProject,
    currentUser,
  } = useProfile();

  const [selectedFilter, setSelectedFilter] = useState<string>("All");
  const [activeCaseStudyProject, setActiveCaseStudyProject] = useState<Project | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  // GitHub Repository Browser Modal state
  const [isGitHubBrowserOpen, setIsGitHubBrowserOpen] = useState(false);
  const [statusToast, setStatusToast] = useState<{ message: string; type: "success" | "info" } | null>(null);

  // Quick Import from GitHub in Add Project Modal
  const [quickRepoUrl, setQuickRepoUrl] = useState("");
  const [isFetchingRepo, setIsFetchingRepo] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [fetchSuccessMessage, setFetchSuccessMessage] = useState<string | null>(null);
  const [autoLogToDiary, setAutoLogToDiary] = useState<boolean>(true);
  const [pendingDiscoveredSkills, setPendingDiscoveredSkills] = useState<SuggestedLearning[]>([]);

  // Quick Sync with GitHub in Edit Project Modal
  const [editQuickRepoUrl, setEditQuickRepoUrl] = useState("");
  const [isEditFetchingRepo, setIsEditFetchingRepo] = useState(false);
  const [editFetchError, setEditFetchError] = useState<string | null>(null);
  const [editFetchSuccessMessage, setEditFetchSuccessMessage] = useState<string | null>(null);
  const [editAutoLogToDiary, setEditAutoLogToDiary] = useState<boolean>(true);
  const [editPendingDiscoveredSkills, setEditPendingDiscoveredSkills] = useState<SuggestedLearning[]>([]);

  // Edit Project Form State
  const [editProjectData, setEditProjectData] = useState({
    id: "",
    title: "",
    category: "Full-Stack Web",
    domainTag: "Full-Stack & Cloud",
    projectUse: "",
    targetUsers: "",
    problemSolved: "",
    solution: "",
    architectureNotes: "",
    novelty: "",
    tagInput: "",
    techStackList: [] as string[],
    metric1: "",
    metric2: "",
    metric3: "",
    liveUrl: "",
    repoUrl: "",
    challenges: "",
    keyLearnings: "",
  });

  // New Project Form State
  const [newProject, setNewProject] = useState({
    title: "",
    category: "Full-Stack Web",
    domainTag: "Full-Stack & Cloud",
    projectUse: "",
    problemSolved: "",
    solution: "",
    novelty: "",
    techStackInput: "",
    metric1: "⚡ 100% TypeScript typed with strict compiler mode",
    metric2: "🎯 95+ Lighthouse score across performance & accessibility",
    metric3: "♿ WCAG 2.1 AA keyboard navigable design system",
    liveUrl: "",
    repoUrl: "",
    challenges: "",
    keyLearnings: "",
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const categories = [
    "All",
    "Full-Stack Web",
    "Developer Tooling",
    "UI / UX Engineering",
    "Open Source Tools"
  ];

  const filteredProjects = selectedFilter === "All"
    ? state.projects
    : state.projects.filter((p) => p.category === selectedFilter);

  // 1-Click Repo Fetch inside Add Project Modal
  const handleFetchQuickRepo = async () => {
    const parsed = parseGitHubUrl(quickRepoUrl);
    if (!parsed) {
      setFetchError("Please enter a valid GitHub URL (e.g. https://github.com/THARANESHSELVAM/Personal-Portfolio-Website) or shorthand (THARANESHSELVAM/repo).");
      setFetchSuccessMessage(null);
      return;
    }

    setIsFetchingRepo(true);
    setFetchError(null);
    setFetchSuccessMessage(null);

    try {
      const data = await fetchGitHubRepo(parsed.owner, parsed.repo);

      // Auto-populate form fields
      setNewProject({
        title: data.title,
        category: data.category,
        domainTag: data.domainTag,
        projectUse: data.description,
        problemSolved: newProject.problemSolved.trim() || `Production architecture designed with ${data.primaryLanguage} to address scalability, high concurrency, and reliable distributed state management.`,
        solution: data.description,
        novelty: data.suggestedNovelty,
        techStackInput: Array.from(new Set([...data.languages, ...data.topics])).join(", "),
        metric1: data.suggestedMetrics[0] || "⚡ 100% Type-Safe Architecture",
        metric2: data.suggestedMetrics[1] || "📈 High Concurrent Throughput",
        metric3: data.suggestedMetrics[2] || "💰 Optimized Cloud Infrastructure",
        liveUrl: data.homepage || "",
        repoUrl: data.html_url,
        challenges: "Ensuring low latency, zero packet loss, and seamless distributed state synchronization.",
        keyLearnings: `Production mastery of ${data.languages.slice(0, 3).join(", ")} and modern modular software architecture.`,
      });

      setPendingDiscoveredSkills(data.suggestedLearnings);
      setFetchSuccessMessage(
        `✓ Loaded "${data.name}"! (${data.languages.length} languages detected, ${data.stars} stars, domain classified as ${data.category}).`
      );
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to fetch repository from GitHub.";
      setFetchError(msg);
      setFetchSuccessMessage(null);
    } finally {
      setIsFetchingRepo(false);
    }
  };

  // 1-Click Repo Fetch inside Edit Project Modal
  const handleEditQuickFetchRepo = async () => {
    const targetUrl = editQuickRepoUrl || editProjectData.repoUrl;
    const parsed = parseGitHubUrl(targetUrl);
    if (!parsed) {
      setEditFetchError("Please enter a valid GitHub repository URL or shorthand.");
      setEditFetchSuccessMessage(null);
      return;
    }

    setIsEditFetchingRepo(true);
    setEditFetchError(null);
    setEditFetchSuccessMessage(null);

    try {
      const data = await fetchGitHubRepo(parsed.owner, parsed.repo);

      // Merge new languages and topics into techStackList
      const incomingTechs = Array.from(new Set([...data.languages, ...data.topics]));
      const existingLower = new Set(editProjectData.techStackList.map((t) => t.toLowerCase()));
      const mergedList = [...editProjectData.techStackList];
      incomingTechs.forEach((t) => {
        if (!existingLower.has(t.toLowerCase())) {
          existingLower.add(t.toLowerCase());
          mergedList.push(t);
        }
      });

      setEditProjectData((prev) => ({
        ...prev,
        techStackList: mergedList,
        liveUrl: data.homepage || prev.liveUrl,
        repoUrl: data.html_url,
        metric1: data.suggestedMetrics[0] || prev.metric1,
      }));

      setEditPendingDiscoveredSkills(data.suggestedLearnings);
      setEditFetchSuccessMessage(
        `✓ Synchronized with "${data.name}"! Merged ${incomingTechs.length} technologies from GitHub.`
      );
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to sync repository from GitHub.";
      setEditFetchError(msg);
      setEditFetchSuccessMessage(null);
    } finally {
      setIsEditFetchingRepo(false);
    }
  };

  // From GitHub Browser Modal: Select repo to import -> opens Add Modal prefilled
  const handleSelectRepoForImport = (data: FetchedRepoData, autoLog: boolean) => {
    setQuickRepoUrl(data.html_url);
    setAutoLogToDiary(autoLog);
    setPendingDiscoveredSkills(data.suggestedLearnings);

    setNewProject({
      title: data.title,
      category: data.category,
      domainTag: data.domainTag,
      projectUse: data.description,
      problemSolved: `Engineered an optimized ${data.primaryLanguage} architecture to overcome concurrency bottlenecks and deliver verified enterprise reliability.`,
      solution: data.description,
      novelty: data.suggestedNovelty,
      techStackInput: Array.from(new Set([...data.languages, ...data.topics])).join(", "),
      metric1: data.suggestedMetrics[0] || "⚡ 100% Type-Safe Architecture",
      metric2: data.suggestedMetrics[1] || "📈 High Concurrent Throughput",
      metric3: data.suggestedMetrics[2] || "💰 Optimized Cloud Infrastructure",
      liveUrl: data.homepage || "",
      repoUrl: data.html_url,
      challenges: "Ensuring low latency, zero packet loss, and seamless distributed state synchronization.",
      keyLearnings: `Production mastery of ${data.languages.slice(0, 3).join(", ")} and modern modular software architecture.`,
    });

    setFetchSuccessMessage(`✓ Loaded "${data.name}"! Review fields and save below.`);
    setFetchError(null);
    setIsAddModalOpen(true);
  };

  // From GitHub Browser Modal: 1-Click Re-sync existing project
  const handleResyncRepo = (
    existingProject: Project,
    data: FetchedRepoData,
    autoLog: boolean
  ) => {
    const { updatedProject, addedLearningsCount } = resyncProjectFromGitHub(
      existingProject.id,
      {
        techStack: Array.from(new Set([...existingProject.techStack, ...data.languages, ...data.topics])),
        liveUrl: data.homepage || existingProject.liveUrl,
        repoUrl: data.html_url,
        metrics: data.suggestedMetrics.length > 0 ? data.suggestedMetrics : existingProject.metrics,
      },
      {
        syncToDiary: autoLog,
        newSkills: data.suggestedLearnings,
        projectTitle: existingProject.title,
        repoUrl: data.html_url,
      }
    );

    try {
      confetti({
        particleCount: 60,
        spread: 50,
        origin: { y: 0.65 },
      });
    } catch (e) {}

    const toastMsg = addedLearningsCount > 0
      ? `Re-synced "${updatedProject.title}"! Tech stack updated from GitHub and +${addedLearningsCount} new skills logged to Learning Diary without overwriting custom case study notes.`
      : `Re-synced "${updatedProject.title}"! Tech stack & metrics updated from GitHub without overwriting custom case study notes.`;

    setStatusToast({ message: toastMsg, type: "success" });
    setTimeout(() => setStatusToast(null), 5000);
  };

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};

    if (!newProject.title.trim()) errs.title = "Project title is required.";
    if (!newProject.problemSolved.trim()) errs.problemSolved = "Problem statement is required.";
    if (!newProject.solution.trim()) errs.solution = "Solution description is required.";

    if (Object.keys(errs).length > 0) {
      setFormErrors(errs);
      return;
    }

    const techStack = newProject.techStackInput
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const metrics = [newProject.metric1, newProject.metric2, newProject.metric3].filter(
      (m) => m && m.trim().length > 0
    );

    const projectPayload = {
      title: newProject.title.trim(),
      category: newProject.category,
      domainTag: newProject.domainTag.trim() || newProject.category,
      noveltySnippet: newProject.novelty.trim() || undefined,
      problemSolved: newProject.problemSolved.trim(),
      solution: newProject.solution.trim(),
      techStack: techStack.length > 0 ? techStack : ["TypeScript", "Next.js", "Docker"],
      metrics: metrics.length > 0 ? metrics : ["⚡ Measurable enterprise performance impact"],
      liveUrl: newProject.liveUrl.trim() || undefined,
      repoUrl: newProject.repoUrl.trim() || undefined,
      featured: true,
      caseStudy: {
        overview: newProject.solution.trim(),
        projectUse: newProject.projectUse.trim() || newProject.domainTag.trim() || newProject.category,
        targetUsers: "Software Architects & Engineers",
        problemStatement: newProject.problemSolved.trim(),
        expertSolution: newProject.solution.trim(),
        novelty: newProject.novelty.trim() || `Engineered a custom architectural solution using ${(techStack.length > 0 ? techStack : ["Modern Web Tech"]).slice(0, 3).join(", ")}.`,
        noveltyHighlights: newProject.novelty.trim() 
          ? [newProject.novelty.trim()] 
          : ["Custom high-throughput architecture", "Decoupled state synchronization"],
        keyFeatures: [
          "Enterprise high availability",
          "Scalable concurrent throughput",
          "Real-time telemetry integration"
        ],
        architectureNotes: "Dynamic architectural implementation.",
        challenges: newProject.challenges
          ? newProject.challenges.split(";").map((c) => c.trim())
          : ["Maintaining low latency under peak concurrency."],
        keyLearnings: newProject.keyLearnings
          ? newProject.keyLearnings.split(";").map((l) => l.trim())
          : ["Decoupled microservices improve fault isolation."],
      },
    };

    const { project: created, addedLearningsCount } = importProjectWithDiarySync(
      projectPayload,
      {
        syncToDiary: autoLogToDiary,
        newSkills: pendingDiscoveredSkills,
      }
    );

    try {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 },
      });
    } catch (e) {}

    const toastText = addedLearningsCount > 0
      ? `Project "${created.title}" saved! +${addedLearningsCount} new verified skill${addedLearningsCount === 1 ? "" : "s"} logged to Learning Diary & Live ATS Resume.`
      : `Project "${created.title}" saved and Live ATS Resume updated!`;

    setStatusToast({ message: toastText, type: "success" });
    setTimeout(() => setStatusToast(null), 5000);

    setIsAddModalOpen(false);
    setNewProject({
      title: "",
      category: "Full-Stack Web",
      domainTag: "Full-Stack & Cloud",
      projectUse: "",
      problemSolved: "",
      solution: "",
      novelty: "",
      techStackInput: "",
      metric1: "⚡ Slashed latency by 45%",
      metric2: "📈 Scaled to 100k+ active users",
      metric3: "💰 Reduced infrastructure costs by 30%",
      liveUrl: "",
      repoUrl: "",
      challenges: "",
      keyLearnings: "",
    });
    setQuickRepoUrl("");
    setFetchError(null);
    setFetchSuccessMessage(null);
    setPendingDiscoveredSkills([]);
    setFormErrors({});
  };

  const handleOpenEditModal = (project: Project) => {
    setEditingProject(project);
    setEditQuickRepoUrl(project.repoUrl || "");
    setEditFetchError(null);
    setEditFetchSuccessMessage(null);
    setEditPendingDiscoveredSkills([]);
    setEditProjectData({
      id: project.id,
      title: project.title,
      category: project.category,
      domainTag: project.domainTag || project.category,
      projectUse: project.caseStudy?.projectUse || "",
      targetUsers: project.caseStudy?.targetUsers || "Engineers & Architects",
      problemSolved: project.problemSolved || project.caseStudy?.problemStatement || "",
      solution: project.solution || project.caseStudy?.overview || "",
      architectureNotes: project.caseStudy?.architectureNotes || "",
      novelty: project.noveltySnippet || project.caseStudy?.novelty || (project.caseStudy?.noveltyHighlights?.[0] || ""),
      tagInput: "",
      techStackList: [...project.techStack],
      metric1: project.metrics[0] || "",
      metric2: project.metrics[1] || "",
      metric3: project.metrics[2] || "",
      liveUrl: project.liveUrl || "",
      repoUrl: project.repoUrl || "",
      challenges: project.caseStudy?.challenges?.join("; ") || "",
      keyLearnings: project.caseStudy?.keyLearnings?.join("; ") || "",
    });
    setFormErrors({});
    setIsEditModalOpen(true);
  };

  const handleAddEditTag = () => {
    if (!editProjectData.tagInput.trim()) return;
    const newTags = editProjectData.tagInput
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0 && !editProjectData.techStackList.includes(t));
    if (newTags.length > 0) {
      setEditProjectData((prev) => ({
        ...prev,
        techStackList: [...prev.techStackList, ...newTags],
        tagInput: "",
      }));
    }
  };

  const handleRemoveEditTag = (tagToRemove: string) => {
    setEditProjectData((prev) => ({
      ...prev,
      techStackList: prev.techStackList.filter((t) => t !== tagToRemove),
    }));
  };

  const handleUpdateProjectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject) return;

    const errs: Record<string, string> = {};
    if (!editProjectData.title.trim()) errs.title = "Project title is required.";
    if (!editProjectData.problemSolved.trim()) errs.problemSolved = "Problem statement is required.";
    if (!editProjectData.solution.trim()) errs.solution = "Solution description is required.";

    if (Object.keys(errs).length > 0) {
      setFormErrors(errs);
      return;
    }

    const metrics = [editProjectData.metric1, editProjectData.metric2, editProjectData.metric3].filter(
      (m) => m && m.trim().length > 0
    );

    const updatedData: Partial<Project> = {
      title: editProjectData.title.trim(),
      category: editProjectData.category,
      domainTag: editProjectData.domainTag.trim() || editProjectData.category,
      problemSolved: editProjectData.problemSolved.trim(),
      solution: editProjectData.solution.trim(),
      noveltySnippet: editProjectData.novelty.trim() || undefined,
      techStack: editProjectData.techStackList.length > 0 ? editProjectData.techStackList : ["TypeScript", "Next.js"],
      metrics: metrics.length > 0 ? metrics : ["⚡ Measurable enterprise performance impact"],
      liveUrl: editProjectData.liveUrl.trim() || undefined,
      repoUrl: editProjectData.repoUrl.trim() || undefined,
      caseStudy: {
        ...(editingProject.caseStudy || {}),
        overview: editProjectData.solution.trim(),
        projectUse: editProjectData.projectUse.trim() || editProjectData.domainTag.trim() || editProjectData.category,
        targetUsers: editProjectData.targetUsers.trim() || "Engineers & Architects",
        problemStatement: editProjectData.problemSolved.trim(),
        expertSolution: editProjectData.solution.trim(),
        architectureNotes: editProjectData.architectureNotes.trim() || editProjectData.solution.trim(),
        novelty: editProjectData.novelty.trim() || `Optimized implementation utilizing ${editProjectData.techStackList.slice(0, 3).join(", ")}.`,
        noveltyHighlights: editProjectData.novelty.trim()
          ? [editProjectData.novelty.trim()]
          : (editingProject.caseStudy?.noveltyHighlights || ["Engineered custom decoupled pipeline"]),
        challenges: editProjectData.challenges ? editProjectData.challenges.split(";").map((c) => c.trim()) : (editingProject.caseStudy?.challenges || []),
        keyLearnings: editProjectData.keyLearnings ? editProjectData.keyLearnings.split(";").map((l) => l.trim()) : (editingProject.caseStudy?.keyLearnings || []),
      },
    };

    updateProject(editingProject.id, updatedData);

    // If there were pending discovered skills from GitHub re-fetch and autoLog is enabled
    let loggedCount = 0;
    if (editAutoLogToDiary && editPendingDiscoveredSkills.length > 0) {
      const existingTechs = new Set(state.learnings.map((l) => l.technology.toLowerCase().trim()));
      const skillsToLog = editPendingDiscoveredSkills
        .filter((s) => !existingTechs.has(s.technology.toLowerCase().trim()))
        .map((s) => ({
          technology: s.technology,
          category: s.category,
          masteryLevel: "Production Ready" as const,
          keyTakeaway: `Implemented and verified in updated repository "${updatedData.title}" (${updatedData.repoUrl || ""}).`,
          repoOrDemoUrl: updatedData.repoUrl,
          tags: s.tags,
        }));

      if (skillsToLog.length > 0) {
        loggedCount = addLearnings(skillsToLog);
      }
    }

    if (activeCaseStudyProject?.id === editingProject.id) {
      setActiveCaseStudyProject({
        ...editingProject,
        ...updatedData,
        caseStudy: updatedData.caseStudy as any,
      });
    }

    const toastMsg = loggedCount > 0
      ? `Changes saved for "${updatedData.title}"! +${loggedCount} new skills logged to Learning Diary.`
      : `Changes saved for "${updatedData.title}"! Live ATS Resume re-compiled.`;

    setStatusToast({ message: toastMsg, type: "success" });
    setTimeout(() => setStatusToast(null), 5000);

    setIsEditModalOpen(false);
    setEditingProject(null);
  };

  return (
    <section id="projects" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold text-lime-400 bg-lime-500/10 border border-lime-500/20 mb-3">
            <Briefcase className="w-3.5 h-3.5" />
            <span>APPLIED WORK &amp; IMPACT</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Featured Projects &amp; Engineering Work
          </h2>
          <p className="mt-3 text-slate-400 text-sm sm:text-base leading-relaxed">
            Explore real-world software applications featuring problem breakdowns, architecture decisions, live deployments, and measurable results.
          </p>
        </div>

        {/* Action Bar: Filter Pills + Add Project CTA */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10">
          {/* Domain Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mr-1 font-mono">
              <Filter className="w-3.5 h-3.5" />
              <span>Domain:</span>
            </div>
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedFilter(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 border ${
                  selectedFilter === cat
                    ? "bg-lime-400 text-slate-950 border-lime-400 font-bold shadow-sm shadow-lime-400/20"
                    : "glass-panel text-slate-400 hover:text-white border-slate-800 hover:border-slate-700"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Action CTAs: Browse GitHub Repos + Add Project */}
          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={() => setIsGitHubBrowserOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 hover:text-white font-medium text-xs border border-slate-800 hover:border-lime-500/40 shadow-sm transition-all active:scale-95 whitespace-nowrap"
              title="Browse public GitHub repos and 1-click import into portfolio"
            >
              <GithubIcon className="w-4 h-4 text-lime-400" />
              <span>Browse GitHub Repos</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setQuickRepoUrl("");
                setFetchError(null);
                setFetchSuccessMessage(null);
                setPendingDiscoveredSkills([]);
                setIsAddModalOpen(true);
              }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-lime-400 hover:bg-lime-300 text-slate-950 font-bold text-xs shadow-md shadow-lime-400/20 transition-all active:scale-95 whitespace-nowrap"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Add Project Entry</span>
            </button>
          </div>
        </div>

        {/* Real-time Status Notification Toast */}
        {statusToast && (
          <div className="mb-8 p-4 rounded-2xl bg-lime-950/60 border border-lime-500/30 text-lime-200 flex items-center justify-between gap-3 shadow-lg shadow-lime-500/5 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="flex items-center gap-2.5 text-xs sm:text-sm font-medium">
              <CheckCircle2 className="w-4 h-4 text-lime-400 shrink-0" />
              <span>{statusToast.message}</span>
            </div>
            <button
              type="button"
              onClick={() => setStatusToast(null)}
              className="p-1 rounded-lg hover:bg-lime-500/20 text-lime-400 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Projects Multi-Column Grid */}
        {filteredProjects.length === 0 ? (
          <div className="text-center py-16 px-4 glass-panel rounded-3xl border border-slate-200 dark:border-slate-800 max-w-lg mx-auto space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-lime-500/10 text-lime-400 flex items-center justify-center mx-auto">
              <Briefcase className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h4 className="text-lg font-bold text-slate-900 dark:text-white">
                No Projects Available
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
                No projects found for the selected category. You can add a new project entry or reset data anytime.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-lime-400 hover:bg-lime-300 text-slate-950 font-bold text-xs shadow-md shadow-lime-400/20 transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Add New Project</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                onClick={() => setActiveCaseStudyProject(project)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setActiveCaseStudyProject(project);
                  }
                }}
                className="cursor-pointer glass-panel rounded-3xl border border-slate-800/90 p-6 flex flex-col justify-between hover:border-lime-400/50 hover:shadow-2xl hover:shadow-lime-400/10 hover:-translate-y-1 transition-all duration-300 group relative text-left bg-[#0e1320]/80"
              >
                <div className="space-y-4">
                  {/* Domain Tag, Featured Badge & Delete Action */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 rounded-full text-[11px] font-mono font-semibold bg-lime-500/10 text-lime-400 border border-lime-500/20">
                        {project.domainTag}
                      </span>
                      {project.featured && (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                          ★ Featured
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenEditModal(project);
                        }}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-700 border border-slate-700/60 shadow-sm transition-colors"
                        title={`Edit "${project.title}"`}
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (window.confirm(`Are you sure you want to delete "${project.title}"?`)) {
                            deleteProject(project.id);
                          }
                        }}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-transparent hover:border-rose-200 dark:hover:border-rose-800/50 transition-all duration-200"
                        title={`Delete "${project.title}"`}
                        aria-label={`Delete "${project.title}"`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Project Title with Interactive Arrow Cue */}
                  <div>
                    <h3 className="text-xl font-bold text-white group-hover:text-lime-400 transition-colors flex items-start justify-between gap-2">
                      <span>{project.title}</span>
                      <ArrowRight className="w-4 h-4 text-lime-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all shrink-0 mt-1" />
                    </h3>
                    <div className="text-[11px] text-lime-400/80 font-mono font-medium mt-1">
                      Click to inspect deep dive &amp; architecture ↗
                    </div>
                  </div>

                  {/* Practical Use Case Snip */}
                  {project.caseStudy?.projectUse && (
                    <div className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                      <span className="font-semibold text-slate-700 dark:text-slate-300 font-mono text-[10px] uppercase block mb-0.5">
                        Practical Use:
                      </span>
                      {project.caseStudy.projectUse}
                    </div>
                  )}

                  {/* Problem Solved Framing */}
                  <div className="p-3.5 rounded-xl bg-slate-100/70 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800">
                    <div className="text-[11px] font-mono uppercase tracking-wider text-rose-600 dark:text-rose-400 font-semibold mb-1">
                      Problem Bottleneck
                    </div>
                    <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed line-clamp-3">
                      {project.problemSolved}
                    </p>
                  </div>

                  {/* Novelty Highlight Chip ("How I Solved It") */}
                  {(project.noveltySnippet || project.caseStudy?.noveltyHighlights?.[0]) && (
                    <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-start gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-lime-400 shrink-0 mt-0.5" />
                      <div className="text-[11px] text-slate-300 leading-snug">
                        <span className="font-bold text-lime-400 font-mono">Novelty: </span>
                        <span>{project.noveltySnippet || project.caseStudy?.noveltyHighlights?.[0]}</span>
                      </div>
                    </div>
                  )}

                  {/* Solution Summary */}
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-2">
                    {project.solution}
                  </p>

                  {/* Tech Stack Pills */}
                  <div>
                    <div className="text-[10px] font-mono uppercase text-slate-400 dark:text-slate-500 mb-1.5">
                      Stack &amp; Tools (Synchronized to Resume)
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {project.techStack.slice(0, 5).map((tech) => (
                        <span
                          key={tech}
                          className="px-2.5 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700/60"
                        >
                          {tech}
                        </span>
                      ))}
                      {project.techStack.length > 5 && (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-mono text-slate-400 bg-slate-100 dark:bg-slate-800/40">
                          +{project.techStack.length - 5}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* High-Contrast Dedicated Metrics Callout Block */}
                  <div className="p-4 rounded-2xl bg-slate-900/90 text-white shadow-md border border-slate-800/90 space-y-1.5">
                    <div className="flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-wider text-lime-400 font-bold">
                      <TrendingUp className="w-3.5 h-3.5" />
                      <span>Key Benchmarks &amp; Impact</span>
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
                <div className="pt-5 mt-4 border-t border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-lg bg-lime-400 hover:bg-lime-300 text-slate-950 shadow-sm transition-colors"
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
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg glass-panel text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700 transition-colors"
                        title="View GitHub Repository"
                      >
                        <GithubIcon className="w-3 h-3" />
                        <span>Code</span>
                      </a>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenEditModal(project);
                      }}
                      className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:text-lime-400 hover:border-lime-500/40 transition-colors"
                      title="Edit project details"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveCaseStudyProject(project);
                      }}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-900 text-slate-300 hover:text-lime-400 border border-slate-800 hover:border-lime-500/40 transition-all"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>Case Study &amp; Novelty</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Case Study Detailed Explanation Modal Drawer */}
      <CaseStudyModal
        project={activeCaseStudyProject}
        projects={filteredProjects}
        isOpen={!!activeCaseStudyProject}
        onClose={() => setActiveCaseStudyProject(null)}
        onSelectProject={setActiveCaseStudyProject}
        onEditProject={handleOpenEditModal}
      />

      {/* Add Project Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-md"
            onClick={() => setIsAddModalOpen(false)}
          />
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto glass-panel bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 z-10 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-lime-500/10 text-lime-400">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-slate-900 dark:text-white">
                    Add Applied Project Entry
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Add detailed explanations for practical use, problem statement, expert solution, and novelty.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Import from GitHub Banner */}
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 text-white border border-slate-800 shadow-xl space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-lime-500/20 text-lime-400 border border-lime-500/30">
                    <GithubIcon className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
                      <span>Quick Import from GitHub</span>
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold bg-lime-500/20 text-lime-300 border border-lime-500/30">
                        1-Click Fetch
                      </span>
                    </h4>
                    <p className="text-[11px] text-slate-300">
                      Auto-populates title, languages, category, live demo, and verified benchmarks.
                    </p>
                  </div>
                </div>

                {/* Auto-log toggle */}
                <label className="flex items-center gap-1.5 text-[11px] font-medium text-slate-200 cursor-pointer select-none bg-white/5 hover:bg-white/10 px-2.5 py-1.5 rounded-xl border border-white/10 transition-colors">
                  <input
                    type="checkbox"
                    checked={autoLogToDiary}
                    onChange={(e) => setAutoLogToDiary(e.target.checked)}
                    className="w-3.5 h-3.5 rounded text-lime-400 focus:ring-lime-400/40 border-slate-600"
                  />
                  <span>Auto-log new skills to Diary</span>
                </label>
              </div>

              {/* Input & Fetch Trigger */}
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={quickRepoUrl}
                    onChange={(e) => {
                      setQuickRepoUrl(e.target.value);
                      if (fetchError) setFetchError(null);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleFetchQuickRepo();
                      }
                    }}
                    placeholder="https://github.com/THARANESHSELVAM/your-repo or owner/repo"
                    className="w-full px-3.5 py-2 text-xs font-mono rounded-xl bg-slate-950/80 border border-slate-700 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-lime-400/50"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleFetchQuickRepo}
                  disabled={isFetchingRepo || !quickRepoUrl.trim()}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r bg-lime-400 hover:bg-lime-300 text-slate-950 font-bold text-xs shadow-md shadow-lime-400/20 transition-all disabled:opacity-50 shrink-0"
                >
                  {isFetchingRepo ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Fetching...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Fetch Repo</span>
                    </>
                  )}
                </button>
              </div>

              {/* Error notice */}
              {fetchError && (
                <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5 text-rose-400" />
                  <span>{fetchError}</span>
                </div>
              )}

              {/* Success notice */}
              {fetchSuccessMessage && (
                <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>{fetchSuccessMessage}</span>
                  </div>
                  {pendingDiscoveredSkills.length > 0 && autoLogToDiary && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-200">
                      +{pendingDiscoveredSkills.length} new skill{pendingDiscoveredSkills.length === 1 ? "" : "s"} ready to log
                    </span>
                  )}
                </div>
              )}
            </div>

            <form onSubmit={handleCreateProject} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Project Title <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Distributed Task Queue"
                    value={newProject.title}
                    onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                    className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl glass-panel text-slate-900 dark:text-white placeholder-slate-400 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-lime-400/50"
                  />
                  {formErrors.title && (
                    <p className="text-[11px] text-rose-500">{formErrors.title}</p>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Category Domain
                  </label>
                  <select
                    value={newProject.category}
                    onChange={(e) =>
                      setNewProject({ ...newProject, category: e.target.value, domainTag: e.target.value })
                    }
                    className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl glass-panel text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-lime-400/50 bg-white dark:bg-slate-900"
                  >
                    <option value="Distributed Systems">Distributed Systems</option>
                    <option value="Full-Stack Web">Full-Stack Web</option>
                    <option value="AI & Distributed Systems">AI &amp; Distributed Systems</option>
                    <option value="Cloud Security">Cloud Security</option>
                    <option value="Data & Observability">Data &amp; Observability</option>
                    <option value="Developer Tooling">Developer Tooling</option>
                  </select>
                </div>
              </div>

              {/* Practical Use */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Project Practical Use &amp; Target Audience
                </label>
                <textarea
                  rows={2}
                  placeholder="What is this project used for in production, and who uses it?"
                  value={newProject.projectUse}
                  onChange={(e) => setNewProject({ ...newProject, projectUse: e.target.value })}
                  className="w-full px-4 py-2 text-xs sm:text-sm rounded-xl glass-panel text-slate-900 dark:text-white placeholder-slate-400 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 resize-none"
                />
              </div>

              {/* Problem Solved */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Problem Statement (Bottleneck Framing) <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={2}
                  placeholder="Describe the production bottleneck, legacy failure mode, or latency/scale failure..."
                  value={newProject.problemSolved}
                  onChange={(e) => setNewProject({ ...newProject, problemSolved: e.target.value })}
                  className="w-full px-4 py-2 text-xs sm:text-sm rounded-xl glass-panel text-slate-900 dark:text-white placeholder-slate-400 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 resize-none"
                />
                {formErrors.problemSolved && (
                  <p className="text-[11px] text-rose-500">{formErrors.problemSolved}</p>
                )}
              </div>

              {/* Solved Expert Solution */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Solved Expert Solution &amp; Architecture <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={2}
                  placeholder="Architectural design, step-by-step pipeline, and engineering patterns..."
                  value={newProject.solution}
                  onChange={(e) => setNewProject({ ...newProject, solution: e.target.value })}
                  className="w-full px-4 py-2 text-xs sm:text-sm rounded-xl glass-panel text-slate-900 dark:text-white placeholder-slate-400 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 resize-none"
                />
                {formErrors.solution && (
                  <p className="text-[11px] text-rose-500">{formErrors.solution}</p>
                )}
              </div>

              {/* Novelty ("How I Solved This Problem") */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-lime-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Novelty &amp; Breakthrough: How I Solved This Problem</span>
                </label>
                <textarea
                  rows={2}
                  placeholder="The secret sauce, custom algorithms, non-obvious optimizations, or unique techniques you invented..."
                  value={newProject.novelty}
                  onChange={(e) => setNewProject({ ...newProject, novelty: e.target.value })}
                  className="w-full px-4 py-2 text-xs sm:text-sm rounded-xl glass-panel text-slate-900 dark:text-white placeholder-slate-400 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-lime-400/50 resize-none"
                />
              </div>

              {/* Tech Stack Input */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Tech Stack (Comma-separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Go, Redis, Docker, gRPC, React"
                  value={newProject.techStackInput}
                  onChange={(e) => setNewProject({ ...newProject, techStackInput: e.target.value })}
                  className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl glass-panel text-slate-900 dark:text-white placeholder-slate-400 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-lime-400/50"
                />
              </div>

              {/* Quantifiable Metrics */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Quantifiable Metrics Callout (High-Impact Results)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <input
                    type="text"
                    placeholder="⚡ Slashed latency by 45%"
                    value={newProject.metric1}
                    onChange={(e) => setNewProject({ ...newProject, metric1: e.target.value })}
                    className="px-3 py-2 text-xs rounded-xl glass-panel text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700"
                  />
                  <input
                    type="text"
                    placeholder="📈 Scaled to 100k+ active users"
                    value={newProject.metric2}
                    onChange={(e) => setNewProject({ ...newProject, metric2: e.target.value })}
                    className="px-3 py-2 text-xs rounded-xl glass-panel text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700"
                  />
                  <input
                    type="text"
                    placeholder="💰 Saved $40k/yr compute"
                    value={newProject.metric3}
                    onChange={(e) => setNewProject({ ...newProject, metric3: e.target.value })}
                    className="px-3 py-2 text-xs rounded-xl glass-panel text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700"
                  />
                </div>
              </div>

              {/* URLs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Live Demo URL (Optional)
                  </label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={newProject.liveUrl}
                    onChange={(e) => setNewProject({ ...newProject, liveUrl: e.target.value })}
                    className="w-full px-4 py-2 text-xs rounded-xl glass-panel text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    GitHub Code Repository (Optional)
                  </label>
                  <input
                    type="url"
                    placeholder="https://github.com/..."
                    value={newProject.repoUrl}
                    onChange={(e) => setNewProject({ ...newProject, repoUrl: e.target.value })}
                    className="w-full px-4 py-2 text-xs rounded-xl glass-panel text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700"
                  />
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-lime-400 hover:bg-lime-300 text-slate-950 font-bold font-semibold text-xs sm:text-sm shadow-md transition-all"
                >
                  <Check className="w-4 h-4" />
                  <span>Save Project &amp; Sync Resume</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Project Modal */}
      {isEditModalOpen && editingProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-md"
            onClick={() => setIsEditModalOpen(false)}
          />
          <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto glass-panel bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 z-10 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-lime-500/10 text-lime-400">
                  <Edit3 className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-lg text-slate-900 dark:text-white">
                      Edit Applied Project
                    </h3>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-lime-500/10 text-lime-400 border border-lime-500/20">
                      ID: {editingProject.id}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Modify problem statement, architectural solution, novelty, tech stack, and impact metrics.
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

            {/* Quick Re-sync with GitHub Banner */}
            <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-2.5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-lime-500/10 text-lime-400">
                    <GithubIcon className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <span>Sync Latest from GitHub</span>
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-lime-500/10 text-lime-400 border border-lime-500/20">
                        Safe Re-Sync
                      </span>
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Refreshes tech stack, links &amp; metrics without overwriting your custom case study notes.
                    </p>
                  </div>
                </div>

                <label className="flex items-center gap-1.5 text-[11px] text-slate-700 dark:text-slate-300 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={editAutoLogToDiary}
                    onChange={(e) => setEditAutoLogToDiary(e.target.checked)}
                    className="w-3.5 h-3.5 rounded text-lime-400 focus:ring-lime-400/30"
                  />
                  <span>Auto-log new skills to Diary</span>
                </label>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={editQuickRepoUrl}
                  onChange={(e) => {
                    setEditQuickRepoUrl(e.target.value);
                    if (editFetchError) setEditFetchError(null);
                  }}
                  placeholder="https://github.com/THARANESHSELVAM/your-repo"
                  className="flex-1 px-3 py-1.5 text-xs font-mono rounded-xl glass-panel text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-lime-400/50"
                />
                <button
                  type="button"
                  onClick={handleEditQuickFetchRepo}
                  disabled={isEditFetchingRepo || !editQuickRepoUrl.trim()}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 font-semibold text-xs shadow-sm disabled:opacity-50 transition-all shrink-0"
                >
                  {isEditFetchingRepo ? (
                    <>
                      <Loader2 className="w-3 h-3 animate-spin" />
                      <span>Syncing...</span>
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-3 h-3" />
                      <span>Re-fetch Metadata</span>
                    </>
                  )}
                </button>
              </div>

              {editFetchError && (
                <p className="text-[11px] text-rose-500 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3 shrink-0" />
                  <span>{editFetchError}</span>
                </p>
              )}

              {editFetchSuccessMessage && (
                <p className="text-[11px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 shrink-0" />
                  <span>{editFetchSuccessMessage}</span>
                </p>
              )}
            </div>

            <form onSubmit={handleUpdateProjectSubmit} className="space-y-5">
              {/* Title & Category */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Project Title <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Distributed Task Queue"
                    value={editProjectData.title}
                    onChange={(e) => setEditProjectData({ ...editProjectData, title: e.target.value })}
                    className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl glass-panel text-slate-900 dark:text-white placeholder-slate-400 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-lime-400/50"
                  />
                  {formErrors.title && (
                    <p className="text-[11px] text-rose-500">{formErrors.title}</p>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Category Domain
                  </label>
                  <select
                    value={editProjectData.category}
                    onChange={(e) =>
                      setEditProjectData({ ...editProjectData, category: e.target.value, domainTag: e.target.value })
                    }
                    className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl glass-panel text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-lime-400/50 bg-white dark:bg-slate-900"
                  >
                    <option value="Distributed Systems">Distributed Systems</option>
                    <option value="Full-Stack Web">Full-Stack Web</option>
                    <option value="AI & Distributed Systems">AI &amp; Distributed Systems</option>
                    <option value="Cloud Security">Cloud Security</option>
                    <option value="Data & Observability">Data &amp; Observability</option>
                    <option value="Developer Tooling">Developer Tooling</option>
                  </select>
                </div>
              </div>

              {/* Practical Use & Target Users */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Practical Use &amp; Purpose
                  </label>
                  <textarea
                    rows={2}
                    placeholder="What is this project used for in production?"
                    value={editProjectData.projectUse}
                    onChange={(e) => setEditProjectData({ ...editProjectData, projectUse: e.target.value })}
                    className="w-full px-4 py-2 text-xs sm:text-sm rounded-xl glass-panel text-slate-900 dark:text-white placeholder-slate-400 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 resize-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Target Users / Audience
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Who uses this project?"
                    value={editProjectData.targetUsers}
                    onChange={(e) => setEditProjectData({ ...editProjectData, targetUsers: e.target.value })}
                    className="w-full px-4 py-2 text-xs sm:text-sm rounded-xl glass-panel text-slate-900 dark:text-white placeholder-slate-400 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 resize-none"
                  />
                </div>
              </div>

              {/* Problem Solved */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Problem Statement (Bottleneck, Failure Mode, Cost) <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={3}
                  placeholder="Describe the production bottleneck, legacy failure mode, or latency/scale failure..."
                  value={editProjectData.problemSolved}
                  onChange={(e) => setEditProjectData({ ...editProjectData, problemSolved: e.target.value })}
                  className="w-full px-4 py-2 text-xs sm:text-sm rounded-xl glass-panel text-slate-900 dark:text-white placeholder-slate-400 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 resize-none"
                />
                {formErrors.problemSolved && (
                  <p className="text-[11px] text-rose-500">{formErrors.problemSolved}</p>
                )}
              </div>

              {/* Solved Expert Solution */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Solved Expert Solution &amp; Architecture <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={3}
                  placeholder="Architectural design, step-by-step pipeline, and engineering patterns..."
                  value={editProjectData.solution}
                  onChange={(e) => setEditProjectData({ ...editProjectData, solution: e.target.value })}
                  className="w-full px-4 py-2 text-xs sm:text-sm rounded-xl glass-panel text-slate-900 dark:text-white placeholder-slate-400 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 resize-none"
                />
                {formErrors.solution && (
                  <p className="text-[11px] text-rose-500">{formErrors.solution}</p>
                )}
              </div>

              {/* Novelty ("How I Solved This Problem") */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-lime-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Novelty &amp; Breakthrough: How I Solved This Problem</span>
                </label>
                <textarea
                  rows={2}
                  placeholder="The secret sauce, custom algorithms, non-obvious optimizations, or unique techniques you invented..."
                  value={editProjectData.novelty}
                  onChange={(e) => setEditProjectData({ ...editProjectData, novelty: e.target.value })}
                  className="w-full px-4 py-2 text-xs sm:text-sm rounded-xl glass-panel text-slate-900 dark:text-white placeholder-slate-400 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-lime-400/50 resize-none"
                />
              </div>

              {/* Tech Stack Pills Manager */}
              <div className="space-y-2 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                  <span>Tech Stack Pills (Syncs to Resume Engine)</span>
                  <span className="text-[11px] font-mono text-slate-400">
                    {editProjectData.techStackList.length} technologies
                  </span>
                </label>

                {/* Current Tag Pills */}
                <div className="flex flex-wrap gap-1.5 min-h-[32px] p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                  {editProjectData.techStackList.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700"
                    >
                      <span>{tag}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveEditTag(tag)}
                        className="hover:text-rose-500 rounded p-0.5"
                        title={`Remove ${tag}`}
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                  {editProjectData.techStackList.length === 0 && (
                    <span className="text-xs text-slate-400 italic">No tags added yet. Add below.</span>
                  )}
                </div>

                {/* Add Tag Input */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Type technology name (e.g. Kafka, Redis, WebAssembly) and click Add"
                    value={editProjectData.tagInput}
                    onChange={(e) => setEditProjectData({ ...editProjectData, tagInput: e.target.value })}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddEditTag();
                      }
                    }}
                    className="flex-1 px-3 py-2 text-xs rounded-xl glass-panel text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-lime-400/50"
                  />
                  <button
                    type="button"
                    onClick={handleAddEditTag}
                    className="px-3 py-2 rounded-xl text-xs font-semibold bg-slate-200 dark:bg-slate-700 hover:bg-lime-400 hover:text-slate-950 text-slate-800 dark:text-slate-200 transition-colors"
                  >
                    + Add Tag
                  </button>
                </div>
              </div>

              {/* Quantifiable Impact Metrics */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Quantifiable Telemetry Benchmarks &amp; Impact Metrics
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <input
                    type="text"
                    placeholder="⚡ Slashed latency by 45%"
                    value={editProjectData.metric1}
                    onChange={(e) => setEditProjectData({ ...editProjectData, metric1: e.target.value })}
                    className="px-3 py-2 text-xs rounded-xl glass-panel text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700"
                  />
                  <input
                    type="text"
                    placeholder="📈 Scaled to 100k+ active users"
                    value={editProjectData.metric2}
                    onChange={(e) => setEditProjectData({ ...editProjectData, metric2: e.target.value })}
                    className="px-3 py-2 text-xs rounded-xl glass-panel text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700"
                  />
                  <input
                    type="text"
                    placeholder="💰 Saved $40k/yr compute"
                    value={editProjectData.metric3}
                    onChange={(e) => setEditProjectData({ ...editProjectData, metric3: e.target.value })}
                    className="px-3 py-2 text-xs rounded-xl glass-panel text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700"
                  />
                </div>
              </div>

              {/* URLs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Live Demo URL (Optional)
                  </label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={editProjectData.liveUrl}
                    onChange={(e) => setEditProjectData({ ...editProjectData, liveUrl: e.target.value })}
                    className="w-full px-4 py-2 text-xs rounded-xl glass-panel text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    GitHub Code Repository (Optional)
                  </label>
                  <input
                    type="url"
                    placeholder="https://github.com/..."
                    value={editProjectData.repoUrl}
                    onChange={(e) => setEditProjectData({ ...editProjectData, repoUrl: e.target.value })}
                    className="w-full px-4 py-2 text-xs rounded-xl glass-panel text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700"
                  />
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-lime-400 hover:bg-lime-300 text-slate-950 font-bold font-semibold text-xs sm:text-sm shadow-md transition-all"
                >
                  <Check className="w-4 h-4" />
                  <span>Save Changes &amp; Recompute Resume</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* GitHub Repo Browser Drawer Modal */}
      <GitHubRepoBrowserModal
        isOpen={isGitHubBrowserOpen}
        onClose={() => setIsGitHubBrowserOpen(false)}
        onSelectRepoForImport={handleSelectRepoForImport}
        onResyncRepo={handleResyncRepo}
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

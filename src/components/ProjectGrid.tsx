"use client";

import { useState, useEffect } from "react";
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
import { ProjectVisualPreview } from "./project-previews/ProjectVisualPreview";

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

  // Listen for direct case-study navigation requests (e.g. from Evidence Inspector)
  useEffect(() => {
    const checkAndOpenTargetProject = (targetId: string) => {
      const match = state.projects.find((p) => p.id === targetId);
      if (match) {
        if (selectedFilter !== "All" && match.category !== selectedFilter) {
          setSelectedFilter("All");
        }
        setActiveCaseStudyProject(match);
      }
    };

    const handleOpenCaseStudyEvent = (e: CustomEvent<{ projectId?: string }>) => {
      const targetId = e.detail?.projectId;
      if (targetId) {
        checkAndOpenTargetProject(targetId);
      }
    };

    // Check pending target from cross-tab navigation in sessionStorage
    if (typeof window !== "undefined") {
      const pendingId = sessionStorage.getItem("portfolio_target_case_study");
      if (pendingId) {
        sessionStorage.removeItem("portfolio_target_case_study");
        checkAndOpenTargetProject(pendingId);
      }
    }

    window.addEventListener("open-case-study", handleOpenCaseStudyEvent as EventListener);
    return () => {
      window.removeEventListener("open-case-study", handleOpenCaseStudyEvent as EventListener);
    };
  }, [state.projects, selectedFilter]);

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
    metric1: "⚡ Strict TypeScript compiler configuration",
    metric2: "🎯 95+ Lighthouse score across performance & accessibility",
    metric3: "♿ WCAG 2.1 AA keyboard navigable design system",
    liveUrl: "",
    repoUrl: "",
    challenges: "",
    keyLearnings: "",
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const baseCategories = [
    "All",
    "Full-Stack Web",
    "AI & Data Science",
    "Developer Tooling",
    "UI / UX Engineering",
    "Open Source Tools",
  ];

  const categories = Array.from(
    new Set([...baseCategories, ...state.projects.map((p) => p.category).filter(Boolean)])
  );

  const filteredProjects = selectedFilter === "All"
    ? state.projects
    : state.projects.filter((p) => p.category === selectedFilter);

  // Featured flagship project resolution
  const featuredProject = filteredProjects.find((p) => p.id === "personal-portfolio")
    || (filteredProjects.length > 2 ? filteredProjects.find((p) => p.featured) : undefined);

  // Supporting projects excluding the featured card when active in view
  const supportingProjects = featuredProject
    ? filteredProjects.filter((p) => p.id !== featuredProject.id)
    : filteredProjects;

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
        metric1: data.suggestedMetrics[0] || "⚡ Strict TypeScript Architecture",
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
      metric1: data.suggestedMetrics[0] || "⚡ Strict TypeScript Architecture",
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
        caseStudy: updatedData.caseStudy,
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
    <section id="projects" className="pt-8 pb-12 sm:pt-12 sm:pb-16 lg:pt-16 lg:pb-20 scroll-mt-20 relative bg-[#fbfbfd] dark:bg-[#07090e] transition-colors duration-250">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header: Editorial & Balanced */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-semibold text-cyan-600 dark:text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 mb-3.5">
              <Briefcase className="w-3.5 h-3.5 text-cyan-500" aria-hidden="true" />
              <span className="tracking-wider uppercase">Selected Engineering Work</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Featured Projects
            </h1>
            <p className="mt-3 text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
              Real-world web applications, geospatial systems, and machine learning models showcasing system architecture, problem solving, and verified implementations.
            </p>
          </div>

          {/* Management Controls: Visually de-emphasized so engineering content leads */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={() => setIsGitHubBrowserOpen(true)}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white bg-slate-100 hover:bg-slate-200/80 dark:bg-white/5 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-500"
              title="Browse public GitHub repos and 1-click import into portfolio"
              aria-label="Browse public GitHub repos and 1-click import into portfolio"
            >
              <GithubIcon className="w-3.5 h-3.5 text-slate-600 dark:text-slate-400" aria-hidden="true" />
              <span>Browse GitHub</span>
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
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium text-cyan-800 dark:text-cyan-300 hover:text-cyan-950 dark:hover:text-white bg-cyan-50 hover:bg-cyan-100 dark:bg-cyan-500/10 dark:hover:bg-cyan-500/20 border border-cyan-200 dark:border-cyan-500/30 hover:border-cyan-300 dark:hover:border-cyan-500/50 transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-500"
              aria-label="Add project entry"
            >
              <PlusCircle className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" aria-hidden="true" />
              <span>Add Entry</span>
            </button>
          </div>
        </div>

        {/* Minimal Segmented Filter Controls */}
        <div className="overflow-x-auto pb-2 mb-8 sm:mb-10 max-w-full scrollbar-none touch-pan-x">
          <div className="p-1 rounded-2xl bg-slate-100/90 dark:bg-white/[0.04] border border-slate-200/80 dark:border-white/10 inline-flex items-center gap-1.5 min-w-max">
            {categories.map((cat) => {
              const isActive = selectedFilter === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedFilter(cat)}
                  aria-pressed={isActive}
                  className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-500 ${
                    isActive
                      ? "bg-slate-900 text-white shadow-sm border border-slate-900 dark:bg-cyan-500/20 dark:text-cyan-300 dark:border-cyan-500/40 font-semibold"
                      : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-black/[0.03] dark:hover:bg-white/[0.03]"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Real-time Status Notification Toast */}
        {statusToast && (
          <div className="mb-8 p-4 rounded-2xl bg-cyan-950/60 border border-cyan-500/30 text-cyan-200 flex items-center justify-between gap-3 shadow-lg shadow-cyan-500/10 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="flex items-center gap-2.5 text-xs sm:text-sm font-medium">
              <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" aria-hidden="true" />
              <span>{statusToast.message}</span>
            </div>
            <button
              type="button"
              onClick={() => setStatusToast(null)}
              aria-label="Dismiss status notification"
              className="p-1 rounded-lg hover:bg-cyan-500/20 text-cyan-400 transition-colors focus-visible:outline-2 focus-visible:outline-cyan-500"
            >
              <X className="w-3.5 h-3.5" aria-hidden="true" />
            </button>
          </div>
        )}

        {/* Empty States */}
        {state.projects.length === 0 ? (
          <div className="text-center py-16 px-6 rounded-3xl border border-slate-200 dark:border-white/10 bg-white/95 dark:bg-[#090d16] max-w-lg mx-auto space-y-4 shadow-sm">
            <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center mx-auto border border-cyan-500/20">
              <Briefcase className="w-7 h-7" aria-hidden="true" />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                No Projects Yet
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 max-w-sm mx-auto leading-relaxed">
                Your workspace is on a blank slate. Add your first full-stack application, system architecture, or open-source tool.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-800 dark:text-cyan-300 font-semibold text-xs border border-cyan-500/30 transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-cyan-500"
            >
              <PlusCircle className="w-4 h-4" aria-hidden="true" />
              <span>Add First Project</span>
            </button>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="text-center py-16 px-4 rounded-3xl border border-slate-200 dark:border-white/10 bg-white/95 dark:bg-[#090d16] max-w-lg mx-auto space-y-4 shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center mx-auto">
              <Briefcase className="w-6 h-6" aria-hidden="true" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                No Projects Found
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
                No projects found for category &quot;{selectedFilter}&quot;. Reset filter to view all projects.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setSelectedFilter("All")}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/15 text-slate-700 dark:text-slate-200 font-semibold text-xs transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-cyan-500"
            >
              Reset Filter
            </button>
          </div>
        ) : (
          <div className="space-y-12">
            {/* FEATURED FLAGSHIP PROJECT: Asymmetric Presentation */}
            {featuredProject && (
              <article
                aria-labelledby={`featured-title-${featuredProject.id}`}
                className="rounded-3xl p-5 sm:p-8 lg:p-10 border border-slate-200/80 dark:border-white/10 hover:border-cyan-500/30 transition-all duration-300 relative group bg-white/95 dark:bg-[#090d16] shadow-sm dark:shadow-xl"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-10 items-stretch">
                  {/* Left Column: Editorial Information & Actions */}
                  <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
                    <div>
                      {/* Meta Row: Domain Tag, Featured Badge, Discreet Management with Dedicated Breathing Room */}
                      <div className="flex items-start justify-between gap-3 mb-4">
                        <div className="flex flex-wrap items-center gap-2 min-w-0">
                          <span className="px-2.5 py-1 rounded-full text-xs font-mono font-semibold bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border border-cyan-500/20 whitespace-nowrap">
                            {featuredProject.domainTag}
                          </span>
                          <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700 dark:bg-white/10 dark:text-slate-300 border border-slate-200/80 dark:border-white/10 whitespace-nowrap">
                            Flagship Project
                          </span>
                        </div>

                        {/* Discreet Management Controls: Dedicated spacing & touch target */}
                        <div className="flex items-center gap-1 shrink-0 p-1 rounded-xl bg-slate-100/70 dark:bg-white/[0.04] border border-slate-200/60 dark:border-white/5">
                          <button
                            type="button"
                            onClick={() => handleOpenEditModal(featuredProject)}
                            title={`Edit ${featuredProject.title}`}
                            aria-label={`Edit details for ${featuredProject.title}`}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-white dark:hover:bg-white/10 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-cyan-500"
                          >
                            <Edit3 className="w-3.5 h-3.5" aria-hidden="true" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              if (window.confirm(`Are you sure you want to delete "${featuredProject.title}"?`)) {
                                deleteProject(featuredProject.id);
                              }
                            }}
                            title={`Delete ${featuredProject.title}`}
                            aria-label={`Delete ${featuredProject.title}`}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-rose-500"
                          >
                            <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                          </button>
                        </div>
                      </div>

                      {/* Project Title with Interactive Trigger & Safe Wrapping */}
                      <div className="mb-4">
                        <h3 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                          <button
                            type="button"
                            id={`featured-title-${featuredProject.id}`}
                            onClick={() => setActiveCaseStudyProject(featuredProject)}
                            aria-label={`View architectural case study for ${featuredProject.title}`}
                            className="text-left hover:text-cyan-600 dark:hover:text-cyan-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-500 transition-colors cursor-pointer group/title inline-flex items-center justify-between gap-3 w-full break-words"
                          >
                            <span className="break-words">{featuredProject.title}</span>
                            <ArrowRight className="w-4 h-4 text-cyan-500 opacity-60 group-hover/title:opacity-100 group-hover/title:translate-x-1.5 transition-all shrink-0 mt-0.5" aria-hidden="true" />
                          </button>
                        </h3>
                        <p className="text-xs sm:text-sm font-mono text-cyan-600 dark:text-cyan-400 mt-2">
                          Interactive case study, architecture specs &amp; source code ↗
                        </p>
                      </div>

                      {/* Editorial Narrative: Problem & Solution (High contrast, comfortable line-height) */}
                      <div className="space-y-3.5 text-sm sm:text-base leading-relaxed mb-4">
                        <p className="text-slate-600 dark:text-slate-300">
                          <strong className="font-semibold text-slate-900 dark:text-white mr-1.5 font-sans">Problem:</strong>
                          {featuredProject.problemSolved}
                        </p>

                        <p className="text-slate-700 dark:text-slate-200">
                          <strong className="font-semibold text-slate-900 dark:text-white mr-1.5 font-sans">Architecture:</strong>
                          {featuredProject.solution}
                        </p>
                      </div>

                      {/* Key Innovation Highlight */}
                      {(featuredProject.noveltySnippet || featuredProject.caseStudy?.novelty) && (
                        <div className="p-3.5 sm:p-4 rounded-2xl bg-cyan-500/[0.04] dark:bg-cyan-500/[0.06] border border-cyan-500/15 flex items-start gap-3 mb-4">
                          <Sparkles className="w-4 h-4 text-cyan-600 dark:text-cyan-400 shrink-0 mt-0.5" aria-hidden="true" />
                          <div className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                            <strong className="font-semibold text-slate-900 dark:text-white font-mono text-xs uppercase tracking-wider block sm:inline sm:mr-2">
                              Key Innovation:
                            </strong>
                            <span>{featuredProject.noveltySnippet || featuredProject.caseStudy?.novelty}</span>
                          </div>
                        </div>
                      )}

                      {/* Tech Stack Pills */}
                      <div className="mb-2">
                        <div className="text-xs font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold mb-2">
                          Technologies &amp; Architecture
                        </div>
                        <div className="flex flex-wrap items-center gap-1.5">
                          {featuredProject.techStack.map((tech) => (
                            <span
                              key={tech}
                              className="px-2.5 py-1 rounded-lg text-xs font-mono font-medium bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-white/10"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Action Links Bar */}
                    <div className="pt-4 mt-6 border-t border-slate-200/80 dark:border-white/10 flex flex-wrap items-center gap-2.5">
                      <button
                        type="button"
                        id={`case-study-btn-${featuredProject.id}`}
                        onClick={() => setActiveCaseStudyProject(featuredProject)}
                        aria-label={`View architectural case study for ${featuredProject.title}`}
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:hover:bg-slate-100 dark:text-slate-950 font-semibold text-xs sm:text-sm shadow-sm hover:shadow transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-500"
                      >
                        <BookOpen className="w-4 h-4 text-cyan-400 dark:text-cyan-600" aria-hidden="true" />
                        <span>Case Study &amp; Architecture</span>
                      </button>

                      {featuredProject.liveUrl && (
                        <a
                          href={featuredProject.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`Open live deployment for ${featuredProject.title} (opens in new tab)`}
                          className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200/90 text-slate-900 dark:bg-white/5 dark:hover:bg-white/10 dark:text-white font-medium text-xs sm:text-sm border border-slate-200/80 dark:border-white/10 transition-all focus-visible:outline-2 focus-visible:outline-cyan-500"
                        >
                          <span>Live Demo</span>
                          <ExternalLink className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" aria-hidden="true" />
                        </a>
                      )}

                      {featuredProject.repoUrl && (
                        <a
                          href={featuredProject.repoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`View source code repository for ${featuredProject.title} on GitHub (opens in new tab)`}
                          className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 font-medium text-xs sm:text-sm transition-all focus-visible:outline-2 focus-visible:outline-cyan-500"
                        >
                          <GithubIcon className="w-4 h-4" aria-hidden="true" />
                          <span>Source Code</span>
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Right Column: Distinctive Interface Preview */}
                  <div className="lg:col-span-5 flex flex-col justify-between">
                    <ProjectVisualPreview
                      project={featuredProject}
                      onOpenCaseStudy={() => setActiveCaseStudyProject(featuredProject)}
                      isFeatured={true}
                    />
                  </div>
                </div>
              </article>
            )}

            {/* SUPPORTING PROJECTS SECTION */}
            {supportingProjects.length > 0 && (
              <div className="space-y-6">
                {featuredProject && (
                  <div className="flex items-center gap-3 pt-4 pb-2 border-t border-slate-200/60 dark:border-white/5">
                    <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      More Engineering Systems &amp; Work
                    </h3>
                    <div className="h-px flex-1 bg-slate-200/60 dark:border-white/5" />
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                  {supportingProjects.map((project) => (
                    <article
                      key={project.id}
                      aria-labelledby={`project-title-${project.id}`}
                      className="rounded-3xl p-5 sm:p-8 flex flex-col justify-between border border-slate-200/80 dark:border-white/10 hover:border-cyan-500/30 hover:-translate-y-0.5 transition-all duration-250 group relative bg-white/95 dark:bg-[#090d16] shadow-sm dark:shadow-md"
                    >
                      <div className="space-y-4">
                        {/* Domain Tag & Discreet Management Controls with Dedicated Breathing Room */}
                        <div className="flex items-start justify-between gap-2 mb-3">
                          <span className="px-2.5 py-1 rounded-full text-xs font-mono font-semibold bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border border-cyan-500/20 whitespace-nowrap">
                            {project.domainTag}
                          </span>

                          <div className="flex items-center gap-1 shrink-0 p-1 rounded-xl bg-slate-100/70 dark:bg-white/[0.04] border border-slate-200/60 dark:border-white/5">
                            <button
                              type="button"
                              onClick={() => handleOpenEditModal(project)}
                              title={`Edit ${project.title}`}
                              aria-label={`Edit project ${project.title}`}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-white dark:hover:bg-white/10 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-cyan-500"
                            >
                              <Edit3 className="w-3.5 h-3.5" aria-hidden="true" />
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                if (window.confirm(`Are you sure you want to delete "${project.title}"?`)) {
                                  deleteProject(project.id);
                                }
                              }}
                              title={`Delete ${project.title}`}
                              aria-label={`Delete ${project.title}`}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-rose-500"
                            >
                              <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                            </button>
                          </div>
                        </div>

                        {/* Project Title with Interactive Trigger & Safe Wrapping */}
                        <div className="mb-3">
                          <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                            <button
                              type="button"
                              id={`project-title-${project.id}`}
                              onClick={() => setActiveCaseStudyProject(project)}
                              aria-label={`View case study and architecture for ${project.title}`}
                              className="text-left font-bold text-slate-900 dark:text-white hover:text-cyan-600 dark:hover:text-cyan-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-500 transition-colors cursor-pointer group/title inline-flex items-center justify-between gap-2.5 w-full break-words"
                            >
                              <span className="break-words">{project.title}</span>
                              <ArrowRight className="w-4 h-4 text-cyan-500 opacity-50 group-hover/title:opacity-100 group-hover/title:translate-x-1 transition-all shrink-0 mt-0.5" aria-hidden="true" />
                            </button>
                          </h3>
                        </div>

                        {/* Distinctive Project Visual Storytelling Presentation */}
                        <div className="my-4">
                          <ProjectVisualPreview
                            project={project}
                            onOpenCaseStudy={() => setActiveCaseStudyProject(project)}
                            isFeatured={false}
                          />
                        </div>

                        {/* Problem & Solution (Clean editorial styling, readable typography) */}
                        <div className="space-y-3 text-sm leading-relaxed">
                          <div>
                            <span className="font-semibold text-slate-900 dark:text-white font-mono text-xs uppercase tracking-wider block mb-1">
                              Problem Addressed
                            </span>
                            <p className="text-slate-600 dark:text-slate-300">
                              {project.problemSolved}
                            </p>
                          </div>

                          <div>
                            <span className="font-semibold text-slate-900 dark:text-white font-mono text-xs uppercase tracking-wider block mb-1">
                              Solution &amp; Implementation
                            </span>
                            <p className="text-slate-700 dark:text-slate-200">
                              {project.solution}
                            </p>
                          </div>
                        </div>

                        {/* Verified Highlights / Benchmarks from data */}
                        {project.metrics && project.metrics.length > 0 && (
                          <div className="pt-3 border-t border-slate-100 dark:border-white/5 space-y-1.5">
                            {project.metrics.slice(0, 2).map((metric, i) => {
                              const displayMetric = metric.includes("92%")
                                ? "📊 Cross-validation & metric evaluation"
                                : metric.includes("100% Type-Safe")
                                ? "⚡ Strict TypeScript Compiler Configuration"
                                : metric;
                              return (
                                <div
                                  key={i}
                                  className="text-xs text-slate-600 dark:text-slate-400 flex items-center gap-2 font-mono"
                                >
                                  <span className="text-cyan-500 shrink-0 font-bold">›</span>
                                  <span className="truncate">{displayMetric}</span>
                                </div>
                              );
                            })}
                          </div>
                        )}

                        {/* Tech Stack Pills */}
                        <div className="pt-1">
                          <div className="flex flex-wrap gap-1.5">
                            {project.techStack.map((tech) => (
                              <span
                                key={tech}
                                className="px-3 py-1 rounded-lg text-xs font-mono bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-white/10"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Card Footer: External Links & Case Study Trigger */}
                      <div className="pt-4 mt-6 border-t border-slate-200/80 dark:border-white/10 flex flex-wrap sm:flex-nowrap items-center justify-between gap-2.5">
                        <div className="flex items-center gap-2">
                          {project.liveUrl && (
                            <a
                              href={project.liveUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              aria-label={`Open live deployment for ${project.title} (opens in new tab)`}
                              className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg text-cyan-700 dark:text-cyan-400 hover:text-cyan-800 dark:hover:text-cyan-300 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/20 transition-colors focus-visible:outline-2 focus-visible:outline-cyan-500"
                            >
                              <span>Live</span>
                              <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                            </a>
                          )}

                          {project.repoUrl && (
                            <a
                              href={project.repoUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              aria-label={`View source code repository for ${project.title} on GitHub (opens in new tab)`}
                              className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 border border-slate-200/80 dark:border-white/10 transition-colors focus-visible:outline-2 focus-visible:outline-cyan-500"
                            >
                              <GithubIcon className="w-3.5 h-3.5" aria-hidden="true" />
                              <span>Code</span>
                            </a>
                          )}
                        </div>

                        <button
                          type="button"
                          id={`case-study-btn-${project.id}`}
                          onClick={() => setActiveCaseStudyProject(project)}
                          aria-label={`View architectural case study for ${project.title}`}
                          className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg text-slate-700 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-slate-100 dark:hover:bg-white/5 transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-cyan-500"
                        >
                          <BookOpen className="w-3.5 h-3.5 text-cyan-500" aria-hidden="true" />
                          <span>Case Study</span>
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            )}
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
                <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400">
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
                  <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                    <GithubIcon className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
                      <span>Quick Import from GitHub</span>
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
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
                    className="w-3.5 h-3.5 rounded text-cyan-400 focus:ring-cyan-500/40 border-slate-600"
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
                    className="w-full px-3.5 py-2 text-xs font-mono rounded-xl bg-slate-950/80 border border-slate-700 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleFetchQuickRepo}
                  disabled={isFetchingRepo || !quickRepoUrl.trim()}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r bg-gradient-to-r from-teal-400 to-cyan-500 hover:from-teal-300 hover:to-cyan-400 text-slate-950 font-bold text-xs shadow-md shadow-cyan-500/25 transition-all disabled:opacity-50 shrink-0"
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
                    className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl glass-panel text-slate-900 dark:text-white placeholder-slate-400 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
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
                    className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl glass-panel text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 bg-white dark:bg-slate-900"
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
                <label className="text-xs font-semibold text-cyan-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Novelty &amp; Breakthrough: How I Solved This Problem</span>
                </label>
                <textarea
                  rows={2}
                  placeholder="The secret sauce, custom algorithms, non-obvious optimizations, or unique techniques you invented..."
                  value={newProject.novelty}
                  onChange={(e) => setNewProject({ ...newProject, novelty: e.target.value })}
                  className="w-full px-4 py-2 text-xs sm:text-sm rounded-xl glass-panel text-slate-900 dark:text-white placeholder-slate-400 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 resize-none"
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
                  className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl glass-panel text-slate-900 dark:text-white placeholder-slate-400 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
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
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-teal-400 to-cyan-500 hover:from-teal-300 hover:to-cyan-400 text-slate-950 font-bold font-semibold text-xs sm:text-sm shadow-md transition-all"
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
                <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400">
                  <Edit3 className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-lg text-slate-900 dark:text-white">
                      Edit Applied Project
                    </h3>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
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
                  <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400">
                    <GithubIcon className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <span>Sync Latest from GitHub</span>
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
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
                    className="w-3.5 h-3.5 rounded text-cyan-400 focus:ring-cyan-500/30"
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
                  className="flex-1 px-3 py-1.5 text-xs font-mono rounded-xl glass-panel text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
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
                    className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl glass-panel text-slate-900 dark:text-white placeholder-slate-400 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
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
                    className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl glass-panel text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 bg-white dark:bg-slate-900"
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
                <label className="text-xs font-semibold text-cyan-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Novelty &amp; Breakthrough: How I Solved This Problem</span>
                </label>
                <textarea
                  rows={2}
                  placeholder="The secret sauce, custom algorithms, non-obvious optimizations, or unique techniques you invented..."
                  value={editProjectData.novelty}
                  onChange={(e) => setEditProjectData({ ...editProjectData, novelty: e.target.value })}
                  className="w-full px-4 py-2 text-xs sm:text-sm rounded-xl glass-panel text-slate-900 dark:text-white placeholder-slate-400 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 resize-none"
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
                    className="flex-1 px-3 py-2 text-xs rounded-xl glass-panel text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                  />
                  <button
                    type="button"
                    onClick={handleAddEditTag}
                    className="px-3 py-2 rounded-xl text-xs font-semibold bg-slate-200 dark:bg-slate-700 hover:bg-gradient-to-r from-teal-400 to-cyan-500 hover:text-slate-950 text-slate-800 dark:text-slate-200 transition-colors"
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
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-teal-400 to-cyan-500 hover:from-teal-300 hover:to-cyan-400 text-slate-950 font-bold font-semibold text-xs sm:text-sm shadow-md transition-all"
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

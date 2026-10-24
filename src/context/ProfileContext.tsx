"use client";

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from "react";
import {
  ProfileState,
  LearningEntry,
  Project,
  GoalItem,
  CompetencyArea,
  INITIAL_PROFILE_STATE,
  INITIAL_PROJECTS,
  extractSkillsFromState,
  generateDynamicPlainTextResume,
} from "@/data/profile";
import {
  UserIdentity,
  ACTIVE_USER_KEY,
  getWorkspaceStorageKey,
  sanitizeUserId,
  exportWorkspaceToJSON,
  importWorkspaceFromJSON,
  createBlankWorkspace,
  createStarterWorkspace,
} from "@/lib/datasetLoader";
import {
  AUTH_SESSION_KEY,
  createSessionToken,
  validateSessionToken,
  clearAuthSession,
  RegisteredProfile,
  getRegisteredProfiles,
  findRegisteredProfile,
  registerNewProfile,
} from "@/lib/authConfig";

export type WorkspaceTab = "home" | "profile" | "diary" | "projects" | "skills" | "resume" | "live-ats";

export interface SkillGapInsight {
  type: "tip" | "warning" | "achievement";
  title: string;
  message: string;
}

export interface ProfileContextType {
  activeUserId: string | null;
  currentUser: UserIdentity | null;
  activeTab: WorkspaceTab;
  setActiveTab: (tab: WorkspaceTab) => void;
  state: ProfileState;
  isHydrated: boolean;
  extractedSkills: Record<CompetencyArea, string[]>;
  healthScore: number;
  competencyCounts: Record<CompetencyArea, number>;
  skillGapInsights: SkillGapInsight[];
  registeredProfiles: RegisteredProfile[];
  refreshRegisteredProfiles: () => void;
  switchProfile: (userId: string) => void;
  promptCreateProfile: () => void;
  loginUser: (
    identity: UserIdentity,
    options?: { loadStarterData?: boolean; isBlankSlate?: boolean; pin?: string }
  ) => void;
  logoutUser: () => void;
  updateProfile: (updates: Partial<ProfileState>) => void;
  addLearning: (entry: Omit<LearningEntry, "id" | "dateLogged">) => void;
  addLearnings: (entries: Array<Omit<LearningEntry, "id" | "dateLogged">>) => number;
  updateLearning: (id: string, entry: Partial<LearningEntry>) => void;
  deleteLearning: (id: string) => void;
  addProject: (project: Omit<Project, "id">) => void;
  importProjectWithDiarySync: (
    project: Omit<Project, "id">,
    options?: {
      syncToDiary?: boolean;
      newSkills?: Array<{ technology: string; category: CompetencyArea; tags: string[] }>;
    }
  ) => { project: Project; addedLearningsCount: number };
  resyncProjectFromGitHub: (
    projectId: string,
    updates: {
      techStack: string[];
      liveUrl?: string;
      repoUrl?: string;
      metrics?: string[];
    },
    options?: {
      syncToDiary?: boolean;
      newSkills?: Array<{ technology: string; category: CompetencyArea; tags: string[] }>;
      projectTitle?: string;
      repoUrl?: string;
    }
  ) => { updatedProject: Project; addedLearningsCount: number };
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  clearWorkspaceData: () => void;
  loadCuratedDataset: () => void;
  exportProfileJSON: () => void;
  importProfileJSON: (jsonString: string) => boolean;
  resetToDefaults: () => void;
  getPlainTextResume: () => string;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const [activeUserId, setActiveUserId] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<UserIdentity | null>(null);
  const [activeTab, setActiveTabState] = useState<WorkspaceTab>("home");
  const [state, setState] = useState<ProfileState>(INITIAL_PROFILE_STATE);
  const [isHydrated, setIsHydrated] = useState(false);
  const [registeredProfiles, setRegisteredProfiles] = useState<RegisteredProfile[]>([]);

  // Refresh registered profiles from localStorage
  const refreshRegisteredProfiles = useCallback(() => {
    if (typeof window !== "undefined") {
      setRegisteredProfiles(getRegisteredProfiles());
    }
  }, []);

  // Sync tab with URL hash if present
  const setActiveTab = useCallback((tab: WorkspaceTab) => {
    setActiveTabState(tab);
    if (typeof window !== "undefined") {
      window.history.replaceState(null, "", `#${tab}`);
    }
  }, []);

  // Initial client hydration from user-scoped localStorage
  useEffect(() => {
    try {
      refreshRegisteredProfiles();

      // 1. Check if hash specifies a tab
      if (typeof window !== "undefined" && window.location.hash) {
        const hash = window.location.hash.replace("#", "").toLowerCase();
        if (hash === "home" || hash === "profile") {
          setActiveTabState("home");
        } else if (hash === "diary" || hash === "projects" || hash === "skills" || hash === "resume") {
          setActiveTabState(hash as WorkspaceTab);
        } else if (hash === "live-ats" || hash === "ats" || hash === "ats-resume") {
          setActiveTabState("resume");
        } else if (hash === "learning-log") {
          setActiveTabState("diary");
        } else if (hash === "about") {
          setActiveTabState("skills");
        }
      }

      // 2. Strict Session Validation: verify active session against authorized credentials
      const sessionToken = localStorage.getItem(AUTH_SESSION_KEY);
      const isSessionValid = validateSessionToken(sessionToken);

      if (!isSessionValid) {
        // Not authenticated: clear stored credentials and force Authentication Gate
        clearAuthSession();
        localStorage.removeItem(ACTIVE_USER_KEY);
        setActiveUserId(null);
        setCurrentUser(null);
        setIsHydrated(true);
        return;
      }

      // Valid session authenticated
      const storedUserId = localStorage.getItem(ACTIVE_USER_KEY) || "tharanesh-selvam";
      setActiveUserId(storedUserId);

      const storageKey = getWorkspaceStorageKey(storedUserId);
      const saved = localStorage.getItem(storageKey);

      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && Array.isArray(parsed.learnings) && Array.isArray(parsed.projects)) {
          // If parsed.isBlankSlate is true, strictly do NOT merge INITIAL_PROJECTS, keep parsed.projects as-is
          let resolvedProjects = parsed.projects;
          if (!parsed.isBlankSlate) {
            resolvedProjects = parsed.projects.map((proj: Project) => {
              const initial = INITIAL_PROJECTS.find((p: Project) => p.id === proj.id);
              if (initial && initial.caseStudy) {
                return {
                  ...initial,
                  ...proj,
                  noveltySnippet: initial.noveltySnippet || proj.noveltySnippet,
                  caseStudy: {
                    ...initial.caseStudy,
                    ...(proj.caseStudy || {}),
                    projectUse: proj.caseStudy?.projectUse || initial.caseStudy.projectUse,
                    problemStatement: proj.caseStudy?.problemStatement || initial.caseStudy.problemStatement,
                    expertSolution: proj.caseStudy?.expertSolution || initial.caseStudy.expertSolution,
                    novelty: proj.caseStudy?.novelty || initial.caseStudy.novelty,
                    noveltyHighlights: (proj.caseStudy?.noveltyHighlights && proj.caseStudy.noveltyHighlights.length > 0)
                      ? proj.caseStudy.noveltyHighlights
                      : initial.caseStudy.noveltyHighlights,
                    benchmarks: (proj.caseStudy?.benchmarks && proj.caseStudy.benchmarks.length > 0)
                      ? proj.caseStudy.benchmarks
                      : initial.caseStudy.benchmarks,
                  },
                };
              }
              return proj;
            });
          }

          setState({ ...parsed, projects: resolvedProjects });
          setCurrentUser({
            userId: storedUserId,
            name: parsed.name || "Portfolio Owner",
            fullName: parsed.name || "Portfolio Owner",
            email: parsed.contact?.email || "",
            title: parsed.title || "Software Engineer",
            location: parsed.contact?.location || "Remote",
            phone: parsed.contact?.phone || "",
            github: parsed.contact?.github || "",
            linkedin: parsed.contact?.linkedin || "",
          });
        }
      } else {
        // No saved workspace for this active user yet
        const foundProfile = findRegisteredProfile(storedUserId);
        if (foundProfile && foundProfile.isBlankSlate) {
          const blankIdentity: UserIdentity = {
            userId: foundProfile.userId,
            name: foundProfile.name,
            fullName: foundProfile.name,
            email: foundProfile.email,
            title: foundProfile.title,
            location: foundProfile.location || "",
            github: foundProfile.github || "",
            linkedin: foundProfile.linkedin || "",
          };
          const blankWs = createBlankWorkspace(blankIdentity);
          setState(blankWs);
          setCurrentUser(blankIdentity);
          localStorage.setItem(storageKey, JSON.stringify(blankWs));
        } else {
          // Default to Tharanesh Selvam starter workspace
          const defaultIdentity: UserIdentity = {
            userId: storedUserId,
            name: "Tharanesh Selvam",
            fullName: "Tharanesh Selvam",
            email: storedUserId.includes("@") ? storedUserId : "tharanesh.selvam@gmail.com",
            title: "Aspiring Full-Stack Software Engineer",
            location: "India / Open to Remote & Relocation",
            github: "https://github.com/THARANESHSELVAM",
            linkedin: "https://linkedin.com/in/tharanesh-selvam",
          };
          const starter = createStarterWorkspace(defaultIdentity);
          setState(starter);
          setCurrentUser(defaultIdentity);
          localStorage.setItem(storageKey, JSON.stringify(starter));
          localStorage.setItem(ACTIVE_USER_KEY, storedUserId);
        }
      }
    } catch (e) {
      console.error("Failed to hydrate user workspace from localStorage:", e);
    } finally {
      setIsHydrated(true);
    }
  }, [refreshRegisteredProfiles]);

  // Save to user-scoped localStorage whenever state changes
  useEffect(() => {
    if (isHydrated && activeUserId) {
      try {
        const storageKey = getWorkspaceStorageKey(activeUserId);
        localStorage.setItem(storageKey, JSON.stringify(state));
      } catch (e) {
        console.error("Failed to save workspace state to localStorage:", e);
      }
    }
  }, [state, activeUserId, isHydrated]);

  // Login / Switch to user workspace
  const loginUser = useCallback(
    (
      identity: UserIdentity,
      options?: { loadStarterData?: boolean; isBlankSlate?: boolean; pin?: string }
    ) => {
      const rawId = identity.userId.trim() || identity.email.trim();
      if (!rawId) return;

      const isBlank = options?.isBlankSlate ?? (options?.loadStarterData === false);

      // Register profile in registered profiles list
      registerNewProfile({
        userId: rawId,
        email: identity.email.trim(),
        pin: options?.pin?.trim() || "2026",
        name: identity.name.trim(),
        title: identity.title.trim(),
        location: identity.location?.trim() || "",
        github: identity.github?.trim() || "",
        linkedin: identity.linkedin?.trim() || "",
        isBlankSlate: isBlank,
      });

      refreshRegisteredProfiles();

      // Create and persist verified session token
      const token = createSessionToken(rawId, identity.email);
      localStorage.setItem(AUTH_SESSION_KEY, token);

      setActiveUserId(rawId);
      setCurrentUser(identity);
      localStorage.setItem(ACTIVE_USER_KEY, rawId);

      const storageKey = getWorkspaceStorageKey(rawId);
      const existing = localStorage.getItem(storageKey);

      if (existing && !options?.loadStarterData && !options?.isBlankSlate) {
        try {
          const parsed = JSON.parse(existing);
          if (parsed && Array.isArray(parsed.learnings)) {
            setState({
              ...parsed,
              name: identity.name || parsed.name,
              title: identity.title || parsed.title,
              contact: {
                ...parsed.contact,
                email: identity.email || parsed.contact.email,
                location: identity.location || parsed.contact.location,
                github: identity.github || parsed.contact.github,
                linkedin: identity.linkedin || parsed.contact.linkedin,
                phone: identity.phone || parsed.contact.phone,
              },
            });
            return;
          }
        } catch (err) {
          console.warn("Could not parse existing workspace, initializing fresh.", err);
        }
      }

      // Initialize workspace
      const newWorkspace = isBlank
        ? createBlankWorkspace(identity)
        : createStarterWorkspace(identity);

      setState(newWorkspace);
      localStorage.setItem(storageKey, JSON.stringify(newWorkspace));
    },
    [refreshRegisteredProfiles]
  );

  // Switch active profile seamlessly
  const switchProfile = useCallback(
    (userId: string) => {
      const target = findRegisteredProfile(userId);
      if (!target) return;

      const identity: UserIdentity = {
        userId: target.userId,
        name: target.name,
        fullName: target.name,
        email: target.email,
        title: target.title,
        location: target.location || "",
        github: target.github || "",
        linkedin: target.linkedin || "",
      };

      const token = createSessionToken(target.userId, target.email);
      localStorage.setItem(AUTH_SESSION_KEY, token);
      localStorage.setItem(ACTIVE_USER_KEY, target.userId);

      setActiveUserId(target.userId);
      setCurrentUser(identity);

      const storageKey = getWorkspaceStorageKey(target.userId);
      const saved = localStorage.getItem(storageKey);

      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed && Array.isArray(parsed.learnings) && Array.isArray(parsed.projects)) {
            let resolvedProjects = parsed.projects;
            if (!parsed.isBlankSlate) {
              resolvedProjects = parsed.projects.map((proj: Project) => {
                const initial = INITIAL_PROJECTS.find((p: Project) => p.id === proj.id);
                return initial && initial.caseStudy ? { ...initial, ...proj } : proj;
              });
            }
            setState({ ...parsed, projects: resolvedProjects });
          }
        } catch (e) {
          console.error("Error loading workspace for switched user:", e);
        }
      } else {
        const freshWorkspace = target.isBlankSlate
          ? createBlankWorkspace(identity)
          : createStarterWorkspace(identity);
        setState(freshWorkspace);
        localStorage.setItem(storageKey, JSON.stringify(freshWorkspace));
      }

      setActiveTabState("home");
      if (typeof window !== "undefined") {
        window.history.replaceState(null, "", "#home");
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    },
    []
  );

  // Prompt onboarding in "Add New Profile Entry" mode
  const promptCreateProfile = useCallback(() => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("myresume_onboarding_mode", "new");
    }
    clearAuthSession();
    setActiveUserId(null);
    setCurrentUser(null);
    localStorage.removeItem(ACTIVE_USER_KEY);
    setActiveTabState("home");
  }, []);

  // Logout / Lock Diary
  const logoutUser = useCallback(() => {
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("myresume_onboarding_mode");
    }
    clearAuthSession();
    setActiveUserId(null);
    setCurrentUser(null);
    localStorage.removeItem(ACTIVE_USER_KEY);
    setActiveTabState("home");
  }, []);

  // Update profile attributes (name, title, contact, bio)
  const updateProfile = useCallback((updates: Partial<ProfileState>) => {
    setState((prev) => {
      const next = { ...prev, ...updates };
      // Also update currentUser identity if name or contact changed
      if (currentUser && (updates.name || updates.title || updates.contact)) {
        setCurrentUser({
          ...currentUser,
          name: updates.name || currentUser.name,
          title: updates.title || currentUser.title,
          email: updates.contact?.email || currentUser.email,
          location: updates.contact?.location || currentUser.location,
          github: updates.contact?.github || currentUser.github,
          linkedin: updates.contact?.linkedin || currentUser.linkedin,
          phone: updates.contact?.phone || currentUser.phone,
        });
      }
      return next;
    });
  }, [currentUser]);

  // Dynamically extract categorized skills from verified diary entries & project stacks
  const extractedSkills = useMemo(() => {
    return extractSkillsFromState(state);
  }, [state]);

  // Competency counts
  const competencyCounts = useMemo(() => {
    const counts: Record<CompetencyArea, number> = {
      Frontend: 0,
      Backend: 0,
      "Cloud & DevOps": 0,
      "Data & AI": 0,
      "System Design": 0,
    };
    state.learnings.forEach((l) => {
      if (counts[l.category] !== undefined) {
        counts[l.category] += 1;
      }
    });
    return counts;
  }, [state.learnings]);

  // Health Score calculation (0 - 100)
  const healthScore = useMemo(() => {
    let score = 0;
    // 1. Competency breadth across 5 areas (up to 40 pts)
    const representedAreas = Object.values(competencyCounts).filter((c) => c > 0).length;
    score += representedAreas * 8;

    // 2. Production ready mastery depth (up to 30 pts)
    const prodReadyCount = state.learnings.filter((l) => l.masteryLevel === "Production Ready").length;
    score += Math.min(30, prodReadyCount * 6);

    // 3. Projects linked & applied work (up to 20 pts)
    score += Math.min(20, state.projects.length * 5);

    // 4. Contact & Identity completeness (up to 10 pts)
    if (state.contact.email) score += 3;
    if (state.contact.github) score += 3;
    if (state.contact.linkedin) score += 2;
    if (state.name) score += 2;

    return Math.min(100, score);
  }, [competencyCounts, state.learnings, state.projects, state.contact, state.name]);

  // Automated Skill Gap Insights
  const skillGapInsights = useMemo(() => {
    const insights: SkillGapInsight[] = [];
    const areas: CompetencyArea[] = ["Frontend", "Backend", "Cloud & DevOps", "Data & AI", "System Design"];
    const unrepresented = areas.filter((area) => (competencyCounts[area] || 0) === 0);

    if (unrepresented.length > 0) {
      insights.push({
        type: "warning",
        title: `Unrepresented Area: ${unrepresented[0]}`,
        message: `You haven't logged any ${unrepresented[0]} milestones yet. Adding a verified proof-of-work in this area will boost your profile breadth!`,
      });
    }

    const prodReadyCount = state.learnings.filter((l) => l.masteryLevel === "Production Ready").length;
    if (prodReadyCount < 3) {
      insights.push({
        type: "tip",
        title: "Level Up Mastery",
        message: "Promote logged concepts to 'Production Ready' once you have deployed code or benchmarks to strengthen your ATS score.",
      });
    } else {
      insights.push({
        type: "achievement",
        title: "Strong Production Depth",
        message: `Outstanding! You have ${prodReadyCount} Production-Ready verified milestones backing up your portfolio projects.`,
      });
    }

    return insights;
  }, [competencyCounts, state.learnings]);

  // Learning Diary Actions
  const addLearning = useCallback((entry: Omit<LearningEntry, "id" | "dateLogged">) => {
    const newEntry: LearningEntry = {
      ...entry,
      id: `learn-${Date.now()}`,
      dateLogged: new Date().toISOString().split("T")[0],
    };
    setState((prev) => ({
      ...prev,
      learnings: [newEntry, ...prev.learnings],
      stats: prev.stats.map((s) =>
        s.label.includes("Milestones")
          ? { ...s, value: `${prev.learnings.length + 1} Logged` }
          : s
      ),
    }));
  }, []);

  const addLearnings = useCallback((entries: Array<Omit<LearningEntry, "id" | "dateLogged">>): number => {
    if (!entries || entries.length === 0) return 0;
    const nowStr = new Date().toISOString().split("T")[0];
    const newItems: LearningEntry[] = entries.map((entry, idx) => ({
      ...entry,
      id: `learn-${Date.now()}-${idx}-${Math.random().toString(36).substring(2, 6)}`,
      dateLogged: nowStr,
    }));

    setState((prev) => ({
      ...prev,
      learnings: [...newItems, ...prev.learnings],
      stats: prev.stats.map((s) =>
        s.label.includes("Milestones")
          ? { ...s, value: `${prev.learnings.length + newItems.length} Logged` }
          : s
      ),
    }));

    return newItems.length;
  }, []);

  const updateLearning = useCallback((id: string, updates: Partial<LearningEntry>) => {
    setState((prev) => ({
      ...prev,
      learnings: prev.learnings.map((l) => (l.id === id ? { ...l, ...updates } : l)),
    }));
  }, []);

  const deleteLearning = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      learnings: prev.learnings.filter((l) => l.id !== id),
      stats: prev.stats.map((s) =>
        s.label.includes("Milestones")
          ? { ...s, value: `${Math.max(0, prev.learnings.length - 1)} Logged` }
          : s
      ),
    }));
  }, []);

  // Project Lab Actions
  const addProject = useCallback((project: Omit<Project, "id">) => {
    const newProject: Project = {
      ...project,
      id: `proj-${Date.now()}`,
    };
    setState((prev) => ({
      ...prev,
      projects: [newProject, ...prev.projects],
      stats: prev.stats.map((s) =>
        s.label.includes("Projects")
          ? { ...s, value: `${prev.projects.length + 1} Built` }
          : s
      ),
    }));
  }, []);

  const importProjectWithDiarySync = useCallback((
    project: Omit<Project, "id">,
    options?: {
      syncToDiary?: boolean;
      newSkills?: Array<{ technology: string; category: CompetencyArea; tags: string[] }>;
    }
  ): { project: Project; addedLearningsCount: number } => {
    const newProject: Project = {
      ...project,
      id: `proj-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    };

    let newLearningsToAppend: LearningEntry[] = [];

    if (options?.syncToDiary && options.newSkills && options.newSkills.length > 0) {
      const existingTechs = new Set(state.learnings.map((l) => l.technology.toLowerCase().trim()));
      const nowStr = new Date().toISOString().split("T")[0];

      options.newSkills.forEach((skill, idx) => {
        const norm = skill.technology.toLowerCase().trim();
        if (!existingTechs.has(norm)) {
          existingTechs.add(norm); // avoid duplicates in same batch
          newLearningsToAppend.push({
            id: `learn-gh-${Date.now()}-${idx}-${Math.random().toString(36).substring(2, 6)}`,
            technology: skill.technology,
            category: skill.category,
            masteryLevel: "Production Ready",
            keyTakeaway: `Implemented and verified in portfolio repository "${project.title}" (${project.repoUrl || "GitHub"}).`,
            repoOrDemoUrl: project.repoUrl,
            dateLogged: nowStr,
            tags: skill.tags && skill.tags.length > 0 ? skill.tags : [skill.category.replace(/\s+/g, ""), "GitHubImport"],
          });
        }
      });
    }

    setState((prev) => ({
      ...prev,
      projects: [newProject, ...prev.projects],
      learnings: newLearningsToAppend.length > 0 ? [...newLearningsToAppend, ...prev.learnings] : prev.learnings,
      stats: prev.stats.map((s) => {
        if (s.label.includes("Projects")) return { ...s, value: `${prev.projects.length + 1} Built` };
        if (s.label.includes("Milestones")) return { ...s, value: `${prev.learnings.length + newLearningsToAppend.length} Logged` };
        return s;
      }),
    }));

    return {
      project: newProject,
      addedLearningsCount: newLearningsToAppend.length,
    };
  }, [state.learnings]);

  const resyncProjectFromGitHub = useCallback((
    projectId: string,
    updates: {
      techStack: string[];
      liveUrl?: string;
      repoUrl?: string;
      metrics?: string[];
    },
    options?: {
      syncToDiary?: boolean;
      newSkills?: Array<{ technology: string; category: CompetencyArea; tags: string[] }>;
      projectTitle?: string;
      repoUrl?: string;
    }
  ): { updatedProject: Project; addedLearningsCount: number } => {
    let updatedProjResult: Project | null = null;
    let newLearningsToAppend: LearningEntry[] = [];

    if (options?.syncToDiary && options.newSkills && options.newSkills.length > 0) {
      const existingTechs = new Set(state.learnings.map((l) => l.technology.toLowerCase().trim()));
      const nowStr = new Date().toISOString().split("T")[0];

      options.newSkills.forEach((skill, idx) => {
        const norm = skill.technology.toLowerCase().trim();
        if (!existingTechs.has(norm)) {
          existingTechs.add(norm);
          newLearningsToAppend.push({
            id: `learn-gh-${Date.now()}-${idx}-${Math.random().toString(36).substring(2, 6)}`,
            technology: skill.technology,
            category: skill.category,
            masteryLevel: "Production Ready",
            keyTakeaway: `Implemented and verified in re-synchronized repository "${options.projectTitle || "Portfolio Project"}" (${options.repoUrl || ""}).`,
            repoOrDemoUrl: options.repoUrl,
            dateLogged: nowStr,
            tags: skill.tags && skill.tags.length > 0 ? skill.tags : [skill.category.replace(/\s+/g, ""), "GitHubSync"],
          });
        }
      });
    }

    setState((prev) => {
      const nextProjects = prev.projects.map((p) => {
        if (p.id !== projectId) return p;

        // Merge tech stacks without duplicates, preserving existing casing
        const existingLower = new Set(p.techStack.map((t) => t.toLowerCase()));
        const mergedStack = [...p.techStack];
        updates.techStack.forEach((t) => {
          if (!existingLower.has(t.toLowerCase())) {
            existingLower.add(t.toLowerCase());
            mergedStack.push(t);
          }
        });

        // Merge metrics or update if new ones exist
        const updatedMetrics = updates.metrics && updates.metrics.length > 0 ? updates.metrics : p.metrics;

        const updatedProj: Project = {
          ...p,
          techStack: mergedStack,
          liveUrl: updates.liveUrl !== undefined ? updates.liveUrl : p.liveUrl,
          repoUrl: updates.repoUrl || p.repoUrl,
          metrics: updatedMetrics,
          // CRITICAL: Preserve custom architectural case study notes 100%!
          caseStudy: p.caseStudy,
        };
        updatedProjResult = updatedProj;
        return updatedProj;
      });

      return {
        ...prev,
        projects: nextProjects,
        learnings: newLearningsToAppend.length > 0 ? [...newLearningsToAppend, ...prev.learnings] : prev.learnings,
        stats: prev.stats.map((s) =>
          s.label.includes("Milestones") && newLearningsToAppend.length > 0
            ? { ...s, value: `${prev.learnings.length + newLearningsToAppend.length} Logged` }
            : s
        ),
      };
    });

    return {
      updatedProject: updatedProjResult || (state.projects.find((p) => p.id === projectId) as Project),
      addedLearningsCount: newLearningsToAppend.length,
    };
  }, [state.learnings, state.projects]);

  const updateProject = useCallback((id: string, updates: Partial<Project>) => {
    setState((prev) => ({
      ...prev,
      projects: prev.projects.map((p) => {
        if (p.id !== id) return p;
        const mergedCaseStudy = p.caseStudy
          ? {
              ...p.caseStudy,
              ...(updates.caseStudy || {}),
              overview: (updates.caseStudy?.overview ?? p.caseStudy.overview) || updates.solution || p.solution,
              architectureNotes: (updates.caseStudy?.architectureNotes ?? p.caseStudy.architectureNotes) || updates.solution || p.solution,
              challenges: updates.caseStudy?.challenges ?? p.caseStudy.challenges,
              keyLearnings: updates.caseStudy?.keyLearnings ?? p.caseStudy.keyLearnings,
            }
          : undefined;

        return {
          ...p,
          ...updates,
          caseStudy: mergedCaseStudy,
        } as Project;
      }),
    }));
  }, []);

  const deleteProject = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      projects: prev.projects.filter((p) => p.id !== id),
      stats: prev.stats.map((s) =>
        s.label.includes("Projects")
          ? { ...s, value: `${Math.max(0, prev.projects.length - 1)} Built` }
          : s
      ),
    }));
  }, []);

  // Dataset Ingestion Actions (Requirement #5)
  const clearWorkspaceData = useCallback(() => {
    setState((prev) => ({
      ...prev,
      learnings: [],
      projects: [],
      resume: {
        ...prev.resume,
        experience: [],
        education: [],
        certifications: [],
      },
      stats: [
        { label: "Engineering Milestones", value: "0 Logged", detail: "Clean blank diary ready for entries" },
        { label: "Applied Projects", value: "0 Built", detail: "Ready to add new architectural work" },
        { label: "Competency Areas", value: "0 Logged", detail: "Logs will populate skills dynamically" },
        { label: "Resume Status", value: "Awaiting Entries", detail: "Will compile live from your logs" },
      ],
    }));
  }, []);

  const loadCuratedDataset = useCallback(() => {
    if (!currentUser) return;
    const curated = createStarterWorkspace(currentUser);
    setState(curated);
  }, [currentUser]);

  const exportProfileJSON = useCallback(() => {
    const dataStr = exportWorkspaceToJSON(state);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${state.name.replace(/\s+/g, "_")}_Engineering_Diary_Dataset.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [state]);

  const importProfileJSON = useCallback((jsonString: string): boolean => {
    const result = importWorkspaceFromJSON(jsonString, currentUser || undefined);
    if (result.success && result.state) {
      setState(result.state);
      return true;
    }
    return false;
  }, [currentUser]);

  const resetToDefaults = useCallback(() => {
    if (currentUser) {
      const reset = createStarterWorkspace(currentUser);
      setState(reset);
    } else {
      setState(INITIAL_PROFILE_STATE);
    }
  }, [currentUser]);

  const getPlainTextResume = useCallback(() => {
    return generateDynamicPlainTextResume(state);
  }, [state]);

  return (
    <ProfileContext.Provider
      value={{
        activeUserId,
        currentUser,
        activeTab,
        setActiveTab,
        state,
        isHydrated,
        extractedSkills,
        healthScore,
        competencyCounts,
        skillGapInsights,
        registeredProfiles,
        refreshRegisteredProfiles,
        switchProfile,
        promptCreateProfile,
        loginUser,
        logoutUser,
        updateProfile,
        addLearning,
        addLearnings,
        updateLearning,
        deleteLearning,
        addProject,
        importProjectWithDiarySync,
        resyncProjectFromGitHub,
        updateProject,
        deleteProject,
        clearWorkspaceData,
        loadCuratedDataset,
        exportProfileJSON,
        importProfileJSON,
        resetToDefaults,
        getPlainTextResume,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error("useProfile must be used within a ProfileProvider");
  }
  return context;
}

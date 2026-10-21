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

export type WorkspaceTab = "profile" | "diary" | "projects" | "resume";

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
  loginUser: (identity: UserIdentity, options?: { loadStarterData?: boolean }) => void;
  logoutUser: () => void;
  updateProfile: (updates: Partial<ProfileState>) => void;
  addLearning: (entry: Omit<LearningEntry, "id" | "dateLogged">) => void;
  updateLearning: (id: string, entry: Partial<LearningEntry>) => void;
  deleteLearning: (id: string) => void;
  addProject: (project: Omit<Project, "id">) => void;
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
  const [activeTab, setActiveTabState] = useState<WorkspaceTab>("profile");
  const [state, setState] = useState<ProfileState>(INITIAL_PROFILE_STATE);
  const [isHydrated, setIsHydrated] = useState(false);

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
      // 1. Check if hash specifies a tab
      if (typeof window !== "undefined" && window.location.hash) {
        const hash = window.location.hash.replace("#", "").toLowerCase();
        if (hash === "profile" || hash === "diary" || hash === "projects" || hash === "resume") {
          setActiveTabState(hash as WorkspaceTab);
        } else if (hash === "learning-log") {
          setActiveTabState("diary");
        } else if (hash === "about") {
          setActiveTabState("profile");
        }
      }

      // 2. Load active user
      const storedUserId = localStorage.getItem(ACTIVE_USER_KEY);
      if (storedUserId) {
        setActiveUserId(storedUserId);

        const storageKey = getWorkspaceStorageKey(storedUserId);
        const saved = localStorage.getItem(storageKey);

        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed && Array.isArray(parsed.learnings) && Array.isArray(parsed.projects)) {
            // Merge initial rich case studies into projects matching initial IDs if needed
            const mergedProjects = parsed.projects.map((proj: Project) => {
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

            setState({ ...parsed, projects: mergedProjects });
            setCurrentUser({
              userId: storedUserId,
              name: parsed.name || "Tharanesh Selvam",
              email: parsed.contact?.email || storedUserId,
              title: parsed.title || "Full-Stack Software Engineer",
              location: parsed.contact?.location || "",
              phone: parsed.contact?.phone || "",
              github: parsed.contact?.github || "",
              linkedin: parsed.contact?.linkedin || "",
            });
          }
        } else {
          // No saved workspace for this active user yet, initialize default
          const defaultIdentity: UserIdentity = {
            userId: storedUserId,
            name: "Tharanesh Selvam",
            email: storedUserId.includes("@") ? storedUserId : `${storedUserId}@gmail.com`,
            title: "Full-Stack Software Engineer & Cloud Architect",
          };
          const starter = createStarterWorkspace(defaultIdentity);
          setState(starter);
          setCurrentUser(defaultIdentity);
          localStorage.setItem(storageKey, JSON.stringify(starter));
        }
      }
    } catch (e) {
      console.error("Failed to hydrate user workspace from localStorage:", e);
    } finally {
      setIsHydrated(true);
    }
  }, []);

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
  const loginUser = useCallback((identity: UserIdentity, options?: { loadStarterData?: boolean }) => {
    const rawId = identity.userId.trim() || identity.email.trim();
    if (!rawId) return;

    setActiveUserId(rawId);
    setCurrentUser(identity);
    localStorage.setItem(ACTIVE_USER_KEY, rawId);

    const storageKey = getWorkspaceStorageKey(rawId);
    const existing = localStorage.getItem(storageKey);

    if (existing && !options?.loadStarterData) {
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
    const newWorkspace = options?.loadStarterData === false
      ? createBlankWorkspace(identity)
      : createStarterWorkspace(identity);

    setState(newWorkspace);
    localStorage.setItem(storageKey, JSON.stringify(newWorkspace));
  }, []);

  // Logout / Lock Diary
  const logoutUser = useCallback(() => {
    setActiveUserId(null);
    setCurrentUser(null);
    localStorage.removeItem(ACTIVE_USER_KEY);
    setActiveTabState("profile");
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
        loginUser,
        logoutUser,
        updateProfile,
        addLearning,
        updateLearning,
        deleteLearning,
        addProject,
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

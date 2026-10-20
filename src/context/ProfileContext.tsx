"use client";

import React, { createContext, useContext, useState, useEffect, useMemo } from "react";
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

const STORAGE_KEY = "MYRESUME_PROFILE_STATE_V1";

export interface SkillGapInsight {
  type: "tip" | "warning" | "achievement";
  title: string;
  message: string;
}

export interface ProfileContextType {
  state: ProfileState;
  extractedSkills: Record<CompetencyArea, string[]>;
  healthScore: number;
  competencyCounts: Record<CompetencyArea, number>;
  skillGapInsights: SkillGapInsight[];
  addLearning: (entry: Omit<LearningEntry, "id" | "dateLogged">) => void;
  deleteLearning: (id: string) => void;
  updateLearning: (id: string, entry: Partial<LearningEntry>) => void;
  addProject: (project: Omit<Project, "id">) => void;
  deleteProject: (id: string) => void;
  updateGoal: (id: string, goal: Partial<GoalItem>) => void;
  exportProfileJSON: () => void;
  importProfileJSON: (jsonString: string) => boolean;
  resetToDefaults: () => void;
  getPlainTextResume: () => string;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<ProfileState>(INITIAL_PROFILE_STATE);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load from localStorage on client mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && Array.isArray(parsed.learnings) && Array.isArray(parsed.projects)) {
          // Merge initial project case studies if saved project has old schema or lacks novelty/useCase
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
                  keyFeatures: (proj.caseStudy?.keyFeatures && proj.caseStudy.keyFeatures.length > 0)
                    ? proj.caseStudy.keyFeatures
                    : initial.caseStudy.keyFeatures,
                  benchmarks: (proj.caseStudy?.benchmarks && proj.caseStudy.benchmarks.length > 0)
                    ? proj.caseStudy.benchmarks
                    : initial.caseStudy.benchmarks,
                  techStackRationale: (proj.caseStudy?.techStackRationale && proj.caseStudy.techStackRationale.length > 0)
                    ? proj.caseStudy.techStackRationale
                    : initial.caseStudy.techStackRationale,
                },
              };
            }
            return proj;
          });
          setState({ ...parsed, projects: mergedProjects });
        }
      }
    } catch (e) {
      console.error("Failed to load saved state from localStorage:", e);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  // Save to localStorage whenever state changes after initial hydration
  useEffect(() => {
    if (isHydrated) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      } catch (e) {
        console.error("Failed to save profile state:", e);
      }
    }
  }, [state, isHydrated]);

  // Dynamically extract categorized skills from learnings & project stacks
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

  // Profile Health Score (0 - 100)
  const healthScore = useMemo(() => {
    let score = 0;

    // 1. Breadth across categories (up to 40 pts)
    const activeCategories = Object.values(competencyCounts).filter((c) => c > 0).length;
    score += Math.min(40, activeCategories * 8);

    // 2. Production Ready depth (up to 30 pts)
    const prodReadyCount = state.learnings.filter((l) => l.masteryLevel === "Production Ready").length;
    score += Math.min(30, prodReadyCount * 6);

    // 3. Projects linked & applied work (up to 20 pts)
    score += Math.min(20, state.projects.length * 4);

    // 4. Goals & active sprints (up to 10 pts)
    const activeGoals = state.goals.filter((g) => g.status === "In Progress" || g.status === "Completed").length;
    score += Math.min(10, activeGoals * 3);

    return Math.min(100, Math.max(10, score));
  }, [competencyCounts, state.learnings, state.projects, state.goals]);

  // Skill Gap Insights
  const skillGapInsights = useMemo(() => {
    const insights: SkillGapInsight[] = [];

    // Check for categories with low count
    const areas: CompetencyArea[] = ["Frontend", "Backend", "Cloud & DevOps", "Data & AI", "System Design"];
    const emptyAreas = areas.filter((a) => competencyCounts[a] === 0);
    const lowAreas = areas.filter((a) => competencyCounts[a] > 0 && competencyCounts[a] < 2);

    if (emptyAreas.length > 0) {
      insights.push({
        type: "warning",
        title: `Unrepresented Area: ${emptyAreas[0]}`,
        message: `You haven't logged any ${emptyAreas[0]} milestones yet. Adding a verified proof-of-work in this area will boost your profile breadth!`,
      });
    }

    if (lowAreas.length > 0) {
      insights.push({
        type: "tip",
        title: `Deepen ${lowAreas[0]} Competency`,
        message: `You currently have ${competencyCounts[lowAreas[0]]} ${lowAreas[0]} milestone. Consider advancing a concept into a "Production Ready" demo.`,
      });
    }

    // High mastery achievement
    const prodReadyCount = state.learnings.filter((l) => l.masteryLevel === "Production Ready").length;
    if (prodReadyCount >= 4) {
      insights.push({
        type: "achievement",
        title: "High Production Velocity",
        message: `Outstanding! You have ${prodReadyCount} Production-Ready verified milestones backing up your portfolio projects.`,
      });
    } else {
      insights.push({
        type: "tip",
        title: "Level Up Mastery",
        message: "Promote logged concepts to 'Production Ready' once you have deployed code or benchmarks to strengthen your ATS score.",
      });
    }

    return insights;
  }, [competencyCounts, state.learnings]);

  // Actions
  const addLearning = (entry: Omit<LearningEntry, "id" | "dateLogged">) => {
    const newEntry: LearningEntry = {
      ...entry,
      id: `learn-${Date.now()}`,
      dateLogged: new Date().toISOString().split("T")[0],
    };
    setState((prev) => ({
      ...prev,
      learnings: [newEntry, ...prev.learnings],
    }));
  };

  const deleteLearning = (id: string) => {
    setState((prev) => ({
      ...prev,
      learnings: prev.learnings.filter((l) => l.id !== id),
    }));
  };

  const updateLearning = (id: string, updates: Partial<LearningEntry>) => {
    setState((prev) => ({
      ...prev,
      learnings: prev.learnings.map((l) => (l.id === id ? { ...l, ...updates } : l)),
    }));
  };

  const addProject = (project: Omit<Project, "id">) => {
    const newProject: Project = {
      ...project,
      id: `proj-${Date.now()}`,
    };
    setState((prev) => ({
      ...prev,
      projects: [newProject, ...prev.projects],
    }));
  };

  const deleteProject = (id: string) => {
    setState((prev) => ({
      ...prev,
      projects: prev.projects.filter((p) => p.id !== id),
    }));
  };

  const updateGoal = (id: string, updates: Partial<GoalItem>) => {
    setState((prev) => ({
      ...prev,
      goals: prev.goals.map((g) => (g.id === id ? { ...g, ...updates } : g)),
    }));
  };

  const exportProfileJSON = () => {
    const dataStr = JSON.stringify(state, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `MYRESUME_Profile_Backup_${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const importProfileJSON = (jsonString: string): boolean => {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed && Array.isArray(parsed.learnings) && Array.isArray(parsed.projects)) {
        setState(parsed);
        return true;
      }
      return false;
    } catch (e) {
      console.error("Invalid JSON provided for import:", e);
      return false;
    }
  };

  const resetToDefaults = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEY);
    }
    setState(INITIAL_PROFILE_STATE);
  };

  const getPlainTextResume = () => {
    return generateDynamicPlainTextResume(state);
  };

  return (
    <ProfileContext.Provider
      value={{
        state,
        extractedSkills,
        healthScore,
        competencyCounts,
        skillGapInsights,
        addLearning,
        deleteLearning,
        updateLearning,
        addProject,
        deleteProject,
        updateGoal,
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

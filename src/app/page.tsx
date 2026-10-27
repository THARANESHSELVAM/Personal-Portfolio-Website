"use client";

import { useEffect } from "react";
import { useProfile } from "@/context/ProfileContext";
import { SecurityGate } from "@/components/SecurityGate";
import { Navbar } from "@/components/Navbar";
import { HomeView } from "@/components/HomeView";
import { SkillsView } from "@/components/SkillsView";
import { LearningLog } from "@/components/LearningLog";
import { ProjectGrid } from "@/components/ProjectGrid";
import { ResumeHub } from "@/components/ResumeHub";
import { Footer } from "@/components/Footer";

export default function Home() {
  const { isUnlocked, activeUserId, activeTab, state } = useProfile();

  // Dynamically update document title based on the active user identity
  useEffect(() => {
    if (typeof document !== "undefined") {
      const userName = state.name || "Tharanesh Selvam";
      const userTitle = state.title || "Software Engineer & Technical Portfolio";
      document.title = `${userName} | ${userTitle}`;
    }
  }, [state.name, state.title]);

  // If no user is authenticated / workspace is locked, show Security Gate
  if (!isUnlocked || !activeUserId) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-[#060b14] dark:text-slate-100 transition-colors duration-200">
        <SecurityGate />
      </div>
    );
  }

  // Authenticated workspace: Render Navbar + active tab view + Footer
  return (
    <div className="flex min-h-screen flex-col bg-transparent text-foreground selection:bg-cyan-500/30 selection:text-cyan-900 dark:selection:text-cyan-200 transition-colors duration-200">
      <Navbar />

      <main className="flex-1">
        {(activeTab === "home" || activeTab === "profile") && <HomeView />}
        {activeTab === "diary" && <LearningLog />}
        {activeTab === "projects" && <ProjectGrid />}
        {activeTab === "skills" && <SkillsView />}
        {(activeTab === "resume" || activeTab === "live-ats") && <ResumeHub />}
      </main>

      <Footer />
    </div>
  );
}


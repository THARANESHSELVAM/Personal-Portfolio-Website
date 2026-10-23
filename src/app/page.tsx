"use client";

import { useEffect } from "react";
import { useProfile } from "@/context/ProfileContext";
import { SecurityGate } from "@/components/SecurityGate";
import { Navbar } from "@/components/Navbar";
import { ProfileView } from "@/components/ProfileView";
import { LearningLog } from "@/components/LearningLog";
import { ProjectGrid } from "@/components/ProjectGrid";
import { ResumeHub } from "@/components/ResumeHub";
import { Footer } from "@/components/Footer";
import { Terminal } from "lucide-react";

export default function Home() {
  const { isHydrated, activeUserId, activeTab, state } = useProfile();

  // Dynamically update document title based on the active user identity
  useEffect(() => {
    if (typeof document !== "undefined") {
      const userName = state.name || "Tharanesh Selvam";
      document.title = `${userName} — Aspiring Full-Stack Software Engineer | Portfolio`;
    }
  }, [state.name]);

  // Prevent hydration flash before localStorage user state is resolved
  if (!isHydrated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#040711] text-white p-6 space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-teal-400 to-cyan-500 flex items-center justify-center text-slate-950 shadow-xl shadow-cyan-500/25 animate-pulse font-mono font-bold">
          <Terminal className="w-6 h-6" />
        </div>
        <div className="flex items-center gap-2 text-sm font-mono text-cyan-400">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <span>INITIALIZING DEVELOPER PORTFOLIO...</span>
        </div>
      </div>
    );
  }

  // If no user is authenticated / workspace is locked, show Security Gate
  if (!activeUserId) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-[#060b14] dark:text-slate-100 transition-colors duration-200">
        <SecurityGate />
      </div>
    );
  }

  // Authenticated workspace: Render Navbar + active tab view + Footer
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900 dark:bg-[#060b14] dark:text-slate-100 selection:bg-cyan-500/30 selection:text-cyan-900 dark:selection:text-cyan-200 transition-colors duration-200">
      <Navbar />

      <main className="flex-1">
        {activeTab === "profile" && <ProfileView />}
        {activeTab === "diary" && <LearningLog />}
        {activeTab === "projects" && <ProjectGrid />}
        {activeTab === "skills" && <ProfileView initialSection="skills" />}
        {(activeTab === "resume" || activeTab === "live-ats") && <ResumeHub />}
      </main>

      <Footer />
    </div>
  );
}


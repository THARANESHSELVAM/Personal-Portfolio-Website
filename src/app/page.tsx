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
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#090d16] text-white p-6 space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-lime-500 to-lime-400 flex items-center justify-center text-slate-950 shadow-xl shadow-lime-500/20 animate-pulse font-mono font-bold">
          <Terminal className="w-6 h-6" />
        </div>
        <div className="flex items-center gap-2 text-sm font-mono text-lime-400">
          <span className="w-2 h-2 rounded-full bg-lime-400 animate-ping" />
          <span>INITIALIZING DEVELOPER PORTFOLIO...</span>
        </div>
      </div>
    );
  }

  // If no user is authenticated / workspace is locked, show Security Gate
  if (!activeUserId) {
    return (
      <div className="min-h-screen bg-[#090d16] text-white transition-colors duration-300">
        <SecurityGate />
      </div>
    );
  }

  // Authenticated workspace: Render Navbar + strictly the single active tab page + Footer
  return (
    <div className="flex min-h-screen flex-col bg-[#090d16] text-slate-100 selection:bg-lime-400 selection:text-slate-950 transition-colors duration-300">
      <Navbar />

      <main className="flex-1">
        {activeTab === "profile" && <ProfileView />}
        {activeTab === "diary" && <LearningLog />}
        {activeTab === "projects" && <ProjectGrid />}
        {activeTab === "resume" && <ResumeHub />}
      </main>

      <Footer />
    </div>
  );
}


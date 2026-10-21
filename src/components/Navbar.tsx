"use client";

import { useState } from "react";
import { ThemeToggle } from "./ThemeToggle";
import { useProfile, WorkspaceTab } from "@/context/ProfileContext";
import { 
  Menu, 
  X, 
  Briefcase, 
  FileText, 
  User, 
  Terminal,
  BookOpen,
  LogOut,
  Sparkles,
  ShieldCheck,
  CheckCircle2
} from "lucide-react";

export function Navbar() {
  const { activeTab, setActiveTab, currentUser, state, logoutUser } = useProfile();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navTabs: { id: WorkspaceTab; name: string; icon: typeof User; count?: number; badge?: string }[] = [
    { 
      id: "profile", 
      name: "Profile & Identity", 
      icon: User 
    },
    { 
      id: "diary", 
      name: "Learning Diary", 
      icon: BookOpen,
      count: state.learnings.length
    },
    { 
      id: "projects", 
      name: "Projects Lab", 
      icon: Briefcase,
      count: state.projects.length
    },
    { 
      id: "resume", 
      name: "Live ATS Resume", 
      icon: FileText,
      badge: "Auto-Synced"
    },
  ];

  const handleTabClick = (tabId: WorkspaceTab) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <header className="sticky top-0 z-50 glass-nav shadow-lg shadow-black/5 dark:shadow-black/25 py-2.5 border-b border-slate-200/60 dark:border-slate-800/80 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo & Philosophy Branding */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => handleTabClick("profile")}
              className="group flex items-center gap-2.5 font-bold tracking-tight text-slate-900 dark:text-white text-left"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-md shadow-cyan-500/20 group-hover:scale-105 transition-transform duration-200">
                <Terminal className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="text-base font-extrabold tracking-wider bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-800 dark:from-white dark:via-slate-200 dark:to-cyan-200 bg-clip-text text-transparent">
                    MYRESUME<span className="text-cyan-500">.</span>
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded font-mono font-semibold bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border border-cyan-500/20">
                    DIARY v2
                  </span>
                </div>
                <span className="text-[10px] font-mono tracking-tight text-slate-500 dark:text-slate-400 -mt-0.5 hidden sm:block">
                  Engineering Diary & ATS Engine
                </span>
              </div>
            </button>
          </div>

          {/* Desktop Tab Navigation */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-100/90 dark:bg-slate-900/80 p-1.5 rounded-full border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-md shadow-inner">
            {navTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => handleTabClick(tab.id)}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
                    isActive
                      ? "bg-white dark:bg-slate-800 text-cyan-600 dark:text-cyan-400 shadow-sm border border-slate-200/60 dark:border-slate-700/60"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-slate-800/50"
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? "text-cyan-500" : "text-slate-400 dark:text-slate-500"}`} />
                  <span>{tab.name}</span>
                  {typeof tab.count === "number" && (
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                      isActive 
                        ? "bg-cyan-500/15 text-cyan-700 dark:text-cyan-300 font-bold" 
                        : "bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                    }`}>
                      {tab.count}
                    </span>
                  )}
                  {tab.badge && (
                    <span className="flex items-center gap-1 text-[10px] font-mono text-emerald-600 dark:text-emerald-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="hidden xl:inline">{tab.badge}</span>
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Side: Active User Identity & Actions */}
          <div className="flex items-center gap-2.5">
            <ThemeToggle />

            {/* Active User Identity Pill */}
            {currentUser && (
              <div 
                onClick={() => handleTabClick("profile")}
                className="hidden lg:flex items-center gap-2 px-2.5 py-1 rounded-full bg-slate-100/90 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/70 text-xs cursor-pointer hover:border-cyan-500/40 transition-colors"
                title={`Active Diary Workspace: ${currentUser.email || currentUser.userId}`}
              >
                <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-cyan-500 to-indigo-600 text-white flex items-center justify-center font-bold text-[11px] shadow-sm">
                  {(currentUser.fullName || currentUser.name || "U").charAt(0).toUpperCase()}
                </div>
                <div className="flex flex-col text-left pr-1">
                  <span className="font-semibold text-slate-800 dark:text-slate-200 text-[11px] leading-tight max-w-[120px] truncate">
                    {currentUser.fullName || currentUser.name || "Diary User"}
                  </span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono leading-tight max-w-[120px] truncate">
                    {currentUser.email || currentUser.userId}
                  </span>
                </div>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              </div>
            )}

            {/* Lock / Switch User Button */}
            <button
              type="button"
              onClick={logoutUser}
              className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-rose-50 dark:hover:bg-rose-950/30 hover:text-rose-600 dark:hover:text-rose-400 hover:border-rose-300 dark:hover:border-rose-800/60 transition-colors"
              title="Lock diary workspace and switch user"
            >
              <LogOut className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400 group-hover:text-rose-500" />
              <span className="hidden sm:inline">Lock / Switch User</span>
            </button>

            {/* Mobile menu button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 md:hidden rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-3 p-4 rounded-2xl glass-panel shadow-xl border border-slate-200 dark:border-slate-800 space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
            {currentUser && (
              <div className="flex items-center gap-2.5 p-2.5 mb-2 rounded-xl bg-slate-100/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800">
                <div className="w-8 h-8 rounded-full bg-cyan-600 text-white flex items-center justify-center font-bold text-xs">
                  {(currentUser.fullName || currentUser.name || "U").charAt(0).toUpperCase()}
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                    {currentUser.fullName || currentUser.name}
                  </span>
                  <span className="text-[11px] text-slate-500 font-mono">
                    {currentUser.email || currentUser.userId}
                  </span>
                </div>
              </div>
            )}

            {navTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => handleTabClick(tab.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-cyan-50 dark:bg-cyan-950/40 text-cyan-600 dark:text-cyan-400 font-semibold"
                      : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 text-cyan-500" />
                    <span>{tab.name}</span>
                  </div>
                  {typeof tab.count === "number" && (
                    <span className="text-xs px-2 py-0.5 rounded-full font-mono bg-slate-200 dark:bg-slate-800">
                      {tab.count}
                    </span>
                  )}
                  {tab.badge && (
                    <span className="text-[10px] px-2 py-0.5 rounded font-mono bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}

            <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex justify-center">
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  logoutUser();
                }}
                className="w-full flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Lock Diary & Switch User</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}


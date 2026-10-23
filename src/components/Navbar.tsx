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
  CheckCircle2
} from "lucide-react";

export function Navbar() {
  const { activeTab, setActiveTab, currentUser, state, logoutUser } = useProfile();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navTabs: { id: WorkspaceTab; name: string; icon: typeof User; count?: number; badge?: string }[] = [
    { 
      id: "profile", 
      name: "About & Overview", 
      icon: User 
    },
    { 
      id: "projects", 
      name: "Projects Lab", 
      icon: Briefcase,
      count: state.projects.length
    },
    { 
      id: "diary", 
      name: "Learning Diary", 
      icon: BookOpen,
      count: state.learnings.length
    },
    { 
      id: "resume", 
      name: "Live ATS Resume", 
      icon: FileText,
      badge: "Verified"
    },
  ];

  const handleTabClick = (tabId: WorkspaceTab) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <header className="sticky top-0 z-50 glass-nav shadow-lg shadow-black/25 py-3 border-b border-slate-800 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Logo & Portfolio Branding */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => handleTabClick("profile")}
              className="group flex items-center gap-2.5 font-bold tracking-tight text-white text-left focus-visible:ring-2 focus-visible:ring-lime-400 rounded-lg p-1"
            >
              <div className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-lime-400 shadow-md group-hover:border-lime-500/40 group-hover:scale-105 transition-all duration-200">
                <Terminal className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="text-base font-extrabold tracking-wider text-white">
                    THARANESH<span className="text-lime-400">.</span>
                  </span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded font-mono font-semibold bg-lime-500/10 text-lime-400 border border-lime-500/20">
                    PORTFOLIO
                  </span>
                </div>
                <span className="text-[10px] font-mono tracking-tight text-slate-400 -mt-0.5 hidden sm:block">
                  Aspiring Full-Stack Software Engineer
                </span>
              </div>
            </button>
          </div>

          {/* Desktop Navigation Tabs */}
          <nav 
            aria-label="Main Navigation"
            className="hidden md:flex items-center gap-1 bg-slate-900/90 p-1.5 rounded-full border border-slate-800 backdrop-blur-md shadow-inner"
          >
            {navTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => handleTabClick(tab.id)}
                  aria-current={isActive ? "page" : undefined}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 focus-visible:ring-2 focus-visible:ring-lime-400 ${
                    isActive
                      ? "bg-slate-800 text-lime-400 shadow-sm border border-lime-500/30"
                      : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? "text-lime-400" : "text-slate-500"}`} />
                  <span>{tab.name}</span>
                  {typeof tab.count === "number" && (
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                      isActive 
                        ? "bg-lime-500/20 text-lime-300 font-bold" 
                        : "bg-slate-800 text-slate-400"
                    }`}>
                      {tab.count}
                    </span>
                  )}
                  {tab.badge && (
                    <span className="flex items-center gap-1 text-[10px] font-mono text-lime-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-lime-400 animate-pulse" />
                      <span className="hidden xl:inline">{tab.badge}</span>
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Actions: Identity Pill & Mobile Toggle */}
          <div className="flex items-center gap-2.5">
            <ThemeToggle />

            {/* Active User Identity Pill */}
            {currentUser && (
              <div 
                onClick={() => handleTabClick("profile")}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") handleTabClick("profile");
                }}
                className="hidden lg:flex items-center gap-2 px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs cursor-pointer hover:border-lime-500/40 transition-colors focus-visible:ring-2 focus-visible:ring-lime-400"
                title={`Active Profile: ${currentUser.name}`}
              >
                <div className="w-6 h-6 rounded-full bg-lime-400 text-slate-950 flex items-center justify-center font-bold text-[11px] shadow-sm">
                  {(currentUser.fullName || currentUser.name || "T").charAt(0).toUpperCase()}
                </div>
                <div className="flex flex-col text-left pr-1">
                  <span className="font-semibold text-slate-200 text-[11px] leading-tight max-w-[120px] truncate">
                    {currentUser.fullName || currentUser.name}
                  </span>
                  <span className="text-[9px] text-lime-400 font-mono leading-tight">
                    Verified
                  </span>
                </div>
                <CheckCircle2 className="w-3.5 h-3.5 text-lime-400 shrink-0" />
              </div>
            )}

            {/* Switch User Button */}
            <button
              type="button"
              onClick={logoutUser}
              className="flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-lg border border-slate-800 text-slate-400 hover:bg-slate-900 hover:text-white hover:border-slate-700 transition-colors focus-visible:ring-2 focus-visible:ring-lime-400"
              title="Switch user workspace"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Workspace</span>
            </button>

            {/* Accessible Mobile Menu Button (min 44px touch target) */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 md:hidden rounded-lg text-slate-300 hover:bg-slate-800 border border-slate-800 focus-visible:ring-2 focus-visible:ring-lime-400 min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-lime-400" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-3 p-4 rounded-2xl glass-panel shadow-2xl border border-slate-800 space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
            {currentUser && (
              <div className="flex items-center gap-2.5 p-3 mb-2 rounded-xl bg-slate-900 border border-slate-800">
                <div className="w-8 h-8 rounded-full bg-lime-400 text-slate-950 flex items-center justify-center font-bold text-xs">
                  {(currentUser.fullName || currentUser.name || "T").charAt(0).toUpperCase()}
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-white">
                    {currentUser.fullName || currentUser.name}
                  </span>
                  <span className="text-[11px] text-lime-400 font-mono">
                    {currentUser.title || "Aspiring Full-Stack Software Engineer"}
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
                  aria-current={isActive ? "page" : undefined}
                  className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-medium transition-colors min-h-[44px] focus-visible:ring-2 focus-visible:ring-lime-400 ${
                    isActive
                      ? "bg-slate-800 text-lime-400 font-semibold border border-lime-500/30"
                      : "text-slate-300 hover:bg-slate-800/60"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? "text-lime-400" : "text-slate-400"}`} />
                    <span>{tab.name}</span>
                  </div>
                  {typeof tab.count === "number" && (
                    <span className="text-xs px-2 py-0.5 rounded-full font-mono bg-slate-800 text-slate-300">
                      {tab.count}
                    </span>
                  )}
                  {tab.badge && (
                    <span className="text-[10px] px-2 py-0.5 rounded font-mono bg-lime-500/10 text-lime-400 border border-lime-500/20">
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}

            <div className="pt-2 border-t border-slate-800 flex justify-center">
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  logoutUser();
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800/80 border border-slate-800 transition-colors min-h-[44px]"
              >
                <LogOut className="w-4 h-4" />
                <span>Switch Workspace User</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

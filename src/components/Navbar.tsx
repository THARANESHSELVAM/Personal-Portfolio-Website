"use client";

import { useState } from "react";
import { ThemeToggle } from "./ThemeToggle";
import { useProfile, WorkspaceTab } from "@/context/ProfileContext";
import { 
  Menu, 
  X, 
  Briefcase, 
  FileText, 
  Home, 
  BookOpen, 
  Code2, 
  Activity, 
  ChevronDown, 
  LogOut,
  FolderKanban
} from "lucide-react";

export function Navbar() {
  const { activeTab, setActiveTab, currentUser, state, logoutUser } = useProfile();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const navTabs: { id: WorkspaceTab; name: string; icon: any; isLive?: boolean }[] = [
    { 
      id: "profile", 
      name: "Home", 
      icon: Home 
    },
    { 
      id: "diary", 
      name: "Diary", 
      icon: BookOpen 
    },
    { 
      id: "projects", 
      name: "Projects", 
      icon: FolderKanban 
    },
    { 
      id: "skills", 
      name: "Skills", 
      icon: Code2 
    },
    { 
      id: "resume", 
      name: "ATS Resume", 
      icon: FileText,
      isLive: true
    },
  ];

  const handleTabClick = (tabId: WorkspaceTab) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <header className="sticky top-0 z-50 glass-nav shadow-sm dark:shadow-lg dark:shadow-black/40 py-2.5 border-b border-slate-200/80 dark:border-cyan-950/40 bg-white/85 dark:bg-[#040711]/90 backdrop-blur-md transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Logo & Portfolio Branding */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => handleTabClick("profile")}
              className="group flex items-center gap-2.5 font-bold tracking-tight text-slate-900 dark:text-white text-left focus-visible:ring-2 focus-visible:ring-cyan-400 rounded-lg p-1"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-500/20 to-cyan-500/10 border border-cyan-500/40 dark:border-cyan-400/40 flex items-center justify-center text-cyan-600 dark:text-cyan-400 font-extrabold text-xs shadow-sm dark:shadow-md dark:shadow-cyan-500/10 group-hover:border-cyan-400 transition-all duration-200">
                TS
              </div>
              <div className="flex flex-col">
                <span className="text-xs sm:text-sm font-extrabold tracking-wider text-slate-900 group-hover:text-cyan-600 dark:text-white dark:group-hover:text-cyan-300 transition-colors uppercase">
                  THARANESH SELVAM
                </span>
                <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 -mt-0.5 hidden sm:block">
                  Software Engineer &amp; Cloud Architect
                </span>
              </div>
            </button>
          </div>

          {/* Desktop Navigation Tabs */}
          <nav 
            aria-label="Main Navigation"
            className="hidden md:flex items-center gap-1 bg-slate-100/90 dark:bg-[#090f1d]/90 px-2 py-1 rounded-full border border-slate-200 dark:border-cyan-900/30 backdrop-blur-md shadow-inner"
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
                  className={`relative flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200 focus-visible:ring-2 focus-visible:ring-cyan-400 ${
                    isActive
                      ? "text-cyan-700 font-semibold bg-cyan-100/80 border border-cyan-300 dark:text-cyan-300 dark:bg-cyan-950/60 dark:border-cyan-500/40 shadow-sm shadow-cyan-500/10"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800/50"
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? "text-cyan-600 dark:text-cyan-400" : "text-slate-500 dark:text-slate-400"}`} />
                  <span>{tab.name}</span>
                  {tab.isLive && (
                    <span className="flex items-center gap-1 text-[10px] text-emerald-600 dark:text-emerald-400 font-mono ml-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse" />
                      <span className="hidden lg:inline text-[9px] text-emerald-700 dark:text-emerald-300">Online</span>
                    </span>
                  )}
                  {isActive && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-gradient-to-r from-teal-500 to-cyan-500 dark:from-teal-400 dark:to-cyan-400 rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Actions: Theme Toggle, User Profile Pill, Mobile Hamburger */}
          <div className="flex items-center gap-2 sm:gap-3">
            <ThemeToggle />

            {/* User Profile Pill */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="hidden sm:flex items-center gap-2 px-2.5 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-xs text-slate-700 hover:border-cyan-500 hover:text-slate-900 dark:bg-[#0a1122] dark:border-cyan-900/30 dark:text-slate-200 dark:hover:border-cyan-400/40 dark:hover:text-white transition-all focus-visible:ring-2 focus-visible:ring-cyan-400 shadow-sm"
              >
                <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-teal-500 to-cyan-500 dark:from-teal-400 dark:to-cyan-500 text-white dark:text-slate-950 font-bold text-[10px] flex items-center justify-center">
                  TS
                </div>
                <span className="font-medium text-xs hidden md:inline">Tharanesh Selvam</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-52 rounded-2xl bg-white dark:bg-[#090f1d] border border-slate-200 dark:border-cyan-900/40 shadow-2xl p-2 z-50 text-xs space-y-1">
                  <div className="p-2 border-b border-slate-100 dark:border-slate-800">
                    <div className="font-semibold text-slate-900 dark:text-white">Tharanesh Selvam</div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">tharaneshselvam@gmail.com</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleTabClick("profile")}
                    className="w-full text-left px-3 py-2 rounded-xl text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60"
                  >
                    View Portfolio Overview
                  </button>
                  <button
                    type="button"
                    onClick={() => handleTabClick("resume")}
                    className="w-full text-left px-3 py-2 rounded-xl text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60"
                  >
                    ATS Resume Hub
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setUserDropdownOpen(false);
                      logoutUser();
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 flex items-center gap-1.5 font-medium"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Lock Diary / Logout</span>
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Menu Hamburger Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl border border-slate-200 dark:border-cyan-900/30 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:border-cyan-400/40 bg-slate-100 dark:bg-[#090f1d] focus-visible:ring-2 focus-visible:ring-cyan-400 md:hidden"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-cyan-600 dark:text-cyan-400" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-3 pt-3 border-t border-slate-200 dark:border-slate-800/80 space-y-1.5 pb-2 animate-in fade-in slide-in-from-top-2 duration-200">
            {navTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => handleTabClick(tab.id)}
                  className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-cyan-100/80 text-cyan-800 border border-cyan-300 dark:bg-cyan-950/60 dark:text-cyan-300 dark:border-cyan-500/40"
                      : "text-slate-700 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800/50"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? "text-cyan-600 dark:text-cyan-400" : "text-slate-500 dark:text-slate-400"}`} />
                    <span>{tab.name}</span>
                  </div>
                  {tab.isLive && (
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse" />
                      <span>Online</span>
                    </span>
                  )}
                </button>
              );
            })}
            
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                logoutUser();
              }}
              className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-all border border-rose-200 dark:border-rose-900/30 mt-2"
            >
              <div className="flex items-center gap-2.5">
                <LogOut className="w-4 h-4" />
                <span>Lock Diary / Logout</span>
              </div>
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

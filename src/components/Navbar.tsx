"use client";

import { useState, useMemo } from "react";
import { ThemeToggle } from "./ThemeToggle";
import { useProfile, WorkspaceTab } from "@/context/ProfileContext";
import { 
  Menu, 
  X, 
  FileText, 
  Home, 
  BookOpen, 
  Code2, 
  ChevronDown, 
  LogOut,
  FolderKanban,
  PlusCircle,
  Check,
  ArrowLeft
} from "lucide-react";
import Link from "next/link";

interface NavbarProps {
  isWorkspace?: boolean;
}

export function Navbar({ isWorkspace = false }: NavbarProps = {}) {
  const { 
    activeTab, 
    setActiveTab, 
    currentUser, 
    state, 
    logoutUser,
    registeredProfiles,
    switchProfile,
    promptCreateProfile,
    activeUserId
  } = useProfile();
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const displayName = currentUser?.name || state.name || "Portfolio Owner";
  const displayEmail = currentUser?.email || state.contact?.email || "";

  // Dynamic user initials
  const initials = useMemo(() => {
    const trimmed = displayName.trim();
    if (!trimmed) return "TS";
    const parts = trimmed.split(/\s+/).filter(Boolean);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }, [displayName]);

  const navTabs: { id: WorkspaceTab; name: string; icon: React.ComponentType<{ className?: string }>; isLive?: boolean }[] = [
    { 
      id: "home", 
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
    <header className="sticky top-0 z-40 glass-nav py-2.5 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-2 md:gap-2.5 xl:gap-4 min-w-0">
          
          {/* Logo & Portfolio Branding */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => handleTabClick("home")}
              className="group flex items-center gap-2 font-bold tracking-tight text-slate-900 dark:text-white text-left focus-visible:ring-2 focus-visible:ring-cyan-400 rounded-lg p-0.5 sm:p-1 cursor-pointer"
            >
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-teal-500/20 to-cyan-500/10 border border-cyan-500/40 dark:border-cyan-400/40 flex items-center justify-center text-cyan-600 dark:text-cyan-400 font-extrabold text-xs shadow-sm dark:shadow-md dark:shadow-cyan-500/10 group-hover:border-cyan-400 transition-all duration-200 shrink-0">
                {initials}
              </div>
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs sm:text-sm font-extrabold tracking-wider text-slate-900 group-hover:text-cyan-600 dark:text-white dark:group-hover:text-cyan-300 transition-colors uppercase truncate max-w-[110px] xs:max-w-[130px] md:max-w-[140px] xl:max-w-[220px]">
                    {displayName}
                  </span>
                  {isWorkspace && (
                    <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-md bg-cyan-100 text-cyan-800 dark:bg-cyan-950/60 dark:text-cyan-300 border border-cyan-300 dark:border-cyan-500/30 hidden xs:inline">
                      Workspace
                    </span>
                  )}
                </div>
                <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 -mt-0.5 hidden xl:block truncate max-w-[220px]">
                  {currentUser?.title || state.title || "Software Engineer & Cloud Architect"}
                </span>
              </div>
            </button>
          </div>

          {/* Desktop Navigation Tabs */}
          <nav 
            aria-label="Main Navigation"
            className="hidden md:flex items-center gap-0.5 xl:gap-1 bg-slate-100/90 dark:bg-[#090f1d]/90 px-1 xl:px-2 py-1 rounded-full border border-slate-200 dark:border-cyan-900/30 backdrop-blur-md shadow-inner shrink-0"
          >
            {navTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id || (tab.id === "home" && activeTab === "profile");
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => handleTabClick(tab.id)}
                  aria-current={isActive ? "page" : undefined}
                  className={`relative flex items-center gap-1 sm:gap-1.5 px-2 lg:px-2.5 xl:px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200 whitespace-nowrap cursor-pointer focus-visible:ring-2 focus-visible:ring-cyan-400 ${
                    isActive
                      ? "text-cyan-700 font-semibold bg-cyan-100/80 border border-cyan-300 dark:text-cyan-300 dark:bg-cyan-950/60 dark:border-cyan-500/40 shadow-sm shadow-cyan-500/10"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800/50"
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? "text-cyan-600 dark:text-cyan-400" : "text-slate-500 dark:text-slate-400"}`} />
                  <span>{tab.name}</span>
                  {tab.isLive && (
                    <span 
                      className="flex items-center gap-1 text-[10px] text-cyan-700 dark:text-cyan-300 font-mono ml-0.5"
                      title="Dynamically compiled from active diary entries & projects"
                      aria-label="Dynamic resume generation"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 dark:bg-cyan-400 shrink-0" aria-hidden="true" />
                      <span className="hidden xl:inline text-[9px] text-cyan-700 dark:text-cyan-300 font-medium">Dynamic</span>
                    </span>
                  )}
                  {isActive && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-gradient-to-r from-teal-500 to-cyan-500 dark:from-teal-400 dark:to-cyan-400 rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Actions: Back to Public Portfolio, Theme Toggle, User Profile Switcher Pill, Mobile Hamburger */}
          <div className="flex items-center gap-2 xl:gap-3 shrink-0">
            {/* Link back to public portfolio */}
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-white/[0.06] dark:hover:bg-white/[0.12] text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-white/[0.1] transition-all hover:scale-[1.02] active:scale-95 shadow-xs"
              title="Return to the recruiter-ready public portfolio"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
              <span className="hidden sm:inline">Public Portfolio</span>
              <span className="sm:hidden">Public</span>
            </Link>

            <ThemeToggle />

            {/* User Profile Pill & Dropdown Switcher */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="hidden sm:flex items-center gap-2 px-2.5 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-xs text-slate-700 hover:border-cyan-500 hover:text-slate-900 dark:bg-[#0a1122] dark:border-cyan-900/30 dark:text-slate-200 dark:hover:border-cyan-400/40 dark:hover:text-white transition-all focus-visible:ring-2 focus-visible:ring-cyan-400 shadow-sm cursor-pointer"
              >
                <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-teal-500 to-cyan-500 dark:from-teal-400 dark:to-cyan-500 text-white dark:text-slate-950 font-bold text-[10px] flex items-center justify-center shrink-0">
                  {initials}
                </div>
                <span className="font-medium text-xs hidden xl:inline truncate max-w-[130px]">{displayName}</span>
                <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform duration-200 ${userDropdownOpen ? "rotate-180" : ""}`} />
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white dark:bg-[#090f1d] border border-slate-200 dark:border-cyan-900/40 shadow-2xl p-2 z-50 text-xs space-y-1 animate-in fade-in slide-in-from-top-1 duration-150">
                  {/* Current Active User Info */}
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800/80">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 font-bold flex items-center justify-center text-xs shrink-0">
                        {initials}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-bold text-slate-900 dark:text-white truncate">{displayName}</div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono truncate">{displayEmail}</div>
                      </div>
                    </div>
                  </div>

                  {/* Registered Profiles List for Fast Profile Switching */}
                  {registeredProfiles && registeredProfiles.length > 0 && (
                    <div className="pt-1.5 pb-1 border-t border-slate-100 dark:border-slate-800">
                      <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-slate-400 dark:text-slate-500 px-2 block mb-1">
                        Switch Profile ({registeredProfiles.length})
                      </span>
                      <div className="max-h-40 overflow-y-auto space-y-0.5 pr-0.5">
                        {registeredProfiles.map((p) => {
                          const isActive = p.userId.toLowerCase() === (activeUserId || "").toLowerCase();
                          return (
                            <button
                              key={p.userId}
                              type="button"
                              onClick={() => {
                                setUserDropdownOpen(false);
                                if (!isActive) {
                                  switchProfile(p.userId);
                                }
                              }}
                              className={`w-full text-left px-2.5 py-1.5 rounded-xl flex items-center justify-between gap-2 transition-colors ${
                                isActive
                                  ? "bg-cyan-50 text-cyan-800 font-semibold dark:bg-cyan-950/50 dark:text-cyan-300"
                                  : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60"
                              }`}
                            >
                              <div className="min-w-0 flex-1">
                                <div className="text-xs font-medium truncate">{p.name}</div>
                                <div className="text-[10px] text-slate-400 font-mono truncate">{p.userId}</div>
                              </div>
                              {isActive ? (
                                <span className="flex items-center gap-1 text-[10px] font-mono text-cyan-600 dark:text-cyan-400 font-bold shrink-0">
                                  <Check className="w-3 h-3" />
                                  <span>Active</span>
                                </span>
                              ) : (
                                <span className="text-[10px] text-slate-400 hover:text-slate-600 shrink-0">
                                  Switch
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* ➕ Add New Profile Entry Action */}
                  <div className="pt-1 border-t border-slate-100 dark:border-slate-800">
                    <button
                      type="button"
                      onClick={() => {
                        setUserDropdownOpen(false);
                        promptCreateProfile();
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl text-cyan-700 dark:text-cyan-300 hover:bg-cyan-50 dark:hover:bg-cyan-950/40 flex items-center gap-2 font-semibold transition-colors"
                    >
                      <PlusCircle className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400 shrink-0" />
                      <span>➕ Add New Profile Entry</span>
                    </button>
                  </div>

                  {/* Navigation Shortcuts */}
                  <div className="pt-1 border-t border-slate-100 dark:border-slate-800">
                    <Link
                      href="/"
                      className="w-full text-left px-3 py-1.5 rounded-xl text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60 flex items-center gap-1.5"
                    >
                      <ArrowLeft className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                      <span>Back to Public Portfolio</span>
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleTabClick("home")}
                      className="w-full text-left px-3 py-1.5 rounded-xl text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60"
                    >
                      View Workspace Overview
                    </button>
                    <button
                      type="button"
                      onClick={() => handleTabClick("resume")}
                      className="w-full text-left px-3 py-1.5 rounded-xl text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60"
                    >
                      ATS Resume Hub
                    </button>
                  </div>

                  {/* Logout / Lock Diary */}
                  <div className="pt-1 border-t border-slate-100 dark:border-slate-800">
                    <button
                      type="button"
                      onClick={() => {
                        setUserDropdownOpen(false);
                        logoutUser();
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 flex items-center gap-1.5 font-medium transition-colors"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Lock Diary / Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Menu Hamburger Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl border border-slate-200 dark:border-cyan-900/30 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:border-cyan-400/40 bg-slate-100 dark:bg-[#090f1d] focus-visible:ring-2 focus-visible:ring-cyan-400 md:hidden cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-cyan-600 dark:text-cyan-400" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-3 pt-3 border-t border-slate-200 dark:border-slate-800/80 space-y-2 pb-2 max-h-[calc(100dvh-5rem)] overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-200">
            {/* Active Mobile Profile Badge */}
            <div className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 font-bold flex items-center justify-center text-xs">
                  {initials}
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-900 dark:text-white block truncate max-w-[160px]">{displayName}</span>
                  <span className="text-[10px] text-slate-500 font-mono">{activeUserId}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  promptCreateProfile();
                }}
                className="text-[11px] font-semibold text-cyan-600 dark:text-cyan-400 hover:underline min-h-[36px] flex items-center"
              >
                + New Profile
              </button>
            </div>

            {/* Mobile Navigation Tabs */}
            <div className="space-y-1">
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-semibold text-cyan-700 dark:text-cyan-300 bg-cyan-50 dark:bg-cyan-950/40 border border-cyan-200 dark:border-cyan-500/30 min-h-[44px]"
              >
                <ArrowLeft className="w-4 h-4 text-cyan-600 dark:text-cyan-400 shrink-0" />
                <span>← Back to Public Portfolio</span>
              </Link>
              {navTabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id || (tab.id === "home" && activeTab === "profile");
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => handleTabClick(tab.id)}
                    className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-semibold min-h-[44px] transition-all cursor-pointer ${
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
                      <span 
                        className="text-[10px] text-cyan-700 dark:text-cyan-300 font-mono flex items-center gap-1.5 font-medium"
                        title="Dynamically compiled from active diary entries & projects"
                        aria-label="Dynamic resume generation"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 dark:bg-cyan-400 shrink-0" aria-hidden="true" />
                        <span>Dynamic</span>
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Mobile Switch Profiles Section */}
            {registeredProfiles && registeredProfiles.length > 1 && (
              <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 px-3 block mb-1">
                  Saved Profiles:
                </span>
                <div className="space-y-1">
                  {registeredProfiles.map((p) => {
                    const isActive = p.userId.toLowerCase() === (activeUserId || "").toLowerCase();
                    return (
                      <button
                        key={p.userId}
                        type="button"
                        onClick={() => {
                          setMobileMenuOpen(false);
                          if (!isActive) switchProfile(p.userId);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between min-h-[40px] cursor-pointer ${
                          isActive
                            ? "bg-cyan-50 text-cyan-800 font-bold dark:bg-cyan-950/40 dark:text-cyan-300"
                            : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                        }`}
                      >
                        <span className="truncate">{p.name}</span>
                        {isActive && <Check className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
            
            {/* Mobile Logout */}
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                logoutUser();
              }}
              className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-all border border-rose-200 dark:border-rose-900/30 mt-2 min-h-[44px] cursor-pointer"
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

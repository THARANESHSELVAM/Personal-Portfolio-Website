"use client";

import { ArrowUp, Mail } from "lucide-react";
import { LinkedinIcon, GithubIcon } from "@/components/Icons";
import { useProfile, WorkspaceTab } from "@/context/ProfileContext";
import { useMemo } from "react";

export function Footer() {
  const { state, currentUser, setActiveTab } = useProfile();
  const currentYear = new Date().getFullYear();

  const displayName = (currentUser?.name || state.name || "").trim() || "Portfolio Owner";
  const displayTitle = (currentUser?.title || state.title || "").trim() || "Software Developer";

  // Dynamic user initials matching Navbar convention
  const initials = useMemo(() => {
    const trimmed = displayName.trim();
    if (!trimmed) return "PO";
    const parts = trimmed.split(/\s+/).filter(Boolean);
    if (parts.length === 0) return "PO";
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }, [displayName]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const navTabs: { id: WorkspaceTab; name: string }[] = [
    { id: "home", name: "Home" },
    { id: "diary", name: "Diary" },
    { id: "projects", name: "Projects" },
    { id: "skills", name: "Skills" },
    { id: "resume", name: "ATS Resume" },
  ];

  return (
    <footer className="border-t border-slate-200 dark:border-cyan-950/40 bg-slate-100 dark:bg-[#040711] pt-14 pb-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 pb-10 border-b border-slate-200 dark:border-cyan-900/20">
          {/* Brand Info */}
          <div className="space-y-2 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-teal-500/20 to-cyan-500/10 border border-cyan-500/40 dark:border-cyan-400/40 flex items-center justify-center text-cyan-600 dark:text-cyan-400 font-extrabold text-xs shadow-sm dark:shadow-md dark:shadow-cyan-500/10">
                {initials}
              </div>
              <span className="font-extrabold text-sm tracking-wider text-slate-900 dark:text-white uppercase">
                {displayName}
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 max-w-sm">
              {displayTitle}. Built with Next.js, React 19, TypeScript, and Tailwind CSS.
            </p>
          </div>

          {/* Quick Tab Links */}
          <nav className="flex flex-wrap items-center justify-center gap-6 text-xs font-semibold text-slate-600 dark:text-slate-400">
            {navTabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setActiveTab(tab.id);
                  scrollToTop();
                }}
                className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
              >
                {tab.name}
              </button>
            ))}
          </nav>

          {/* Back to top button */}
          <div>
            <button
              type="button"
              onClick={scrollToTop}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-[#090f1d] text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-400 border border-slate-200 dark:border-cyan-900/30 hover:border-cyan-400/40 shadow-sm transition-all duration-200 active:scale-95"
              aria-label="Back to top"
            >
              <span>Back to Top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Socials */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <div>
            &copy; {currentYear} {displayName}. All rights reserved.
          </div>

          <div className="flex items-center gap-4">
            {state.contact?.github && (
              <a
                href={state.contact.github}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
                aria-label="GitHub"
              >
                <GithubIcon className="w-4 h-4" />
              </a>
            )}
            {state.contact?.linkedin && (
              <a
                href={state.contact.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
                aria-label="LinkedIn"
              >
                <LinkedinIcon className="w-4 h-4" />
              </a>
            )}
            {state.contact?.email && (
              <a
                href={`mailto:${state.contact.email}`}
                className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
                aria-label="Email"
              >
                <Mail className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}

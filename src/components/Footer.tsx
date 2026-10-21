"use client";

import { ArrowUp, Terminal, Mail } from "lucide-react";
import { LinkedinIcon, GithubIcon } from "@/components/Icons";
import { useProfile, WorkspaceTab } from "@/context/ProfileContext";
import { useState, useEffect } from "react";

export function Footer() {
  const { state, setActiveTab } = useProfile();
  const [currentYear, setCurrentYear] = useState(2026);

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const navTabs: { id: WorkspaceTab; name: string }[] = [
    { id: "profile", name: "Profile & Identity" },
    { id: "diary", name: "Learning Diary" },
    { id: "projects", name: "Projects Lab" },
    { id: "resume", name: "Live ATS Resume" },
  ];

  return (
    <footer className="border-t border-slate-200/80 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-950/60 pt-16 pb-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 pb-12 border-b border-slate-200/60 dark:border-slate-800/60">
          {/* Brand Info */}
          <div className="space-y-3 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-white shadow-sm">
                <Terminal className="w-3.5 h-3.5" />
              </div>
              <span className="font-extrabold text-base tracking-wider bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                MYRESUME<span className="text-cyan-500">.</span>
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm">
              Personal Engineering Diary &amp; Auto-Updating ATS Resume Engine. Built with Next.js 16, React 19, TypeScript, and Tailwind CSS.
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
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl glass-panel text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-cyan-500 dark:hover:text-cyan-400 hover:border-cyan-500/50 shadow-sm transition-all duration-200 active:scale-95"
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
            &copy; {currentYear} {state.name}. All rights reserved.
          </div>

          <div className="flex items-center gap-4">
            {state.contact.github && (
              <a
                href={state.contact.github}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-cyan-500 transition-colors"
                aria-label="GitHub"
              >
                <GithubIcon className="w-4 h-4" />
              </a>
            )}
            {state.contact.linkedin && (
              <a
                href={state.contact.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-cyan-500 transition-colors"
                aria-label="LinkedIn"
              >
                <LinkedinIcon className="w-4 h-4" />
              </a>
            )}
            {state.contact.email && (
              <a
                href={`mailto:${state.contact.email}`}
                className="hover:text-cyan-500 transition-colors"
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


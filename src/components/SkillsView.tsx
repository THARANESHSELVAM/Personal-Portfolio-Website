"use client";

import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import { useProfile } from "@/context/ProfileContext";
import { 
  User, 
  Edit3, 
  Code2, 
  GraduationCap, 
  Cpu, 
  Server, 
  Cloud,
  Layers,
  CheckCircle2,
  PlusCircle,
  BookOpen,
  FolderGit2,
  Info,
  Calendar,
  X,
  RotateCcw,
  ArrowRight,
  ExternalLink,
  Briefcase,
  Globe
} from "lucide-react";
import { GithubIcon } from "@/components/Icons";
import { 
  getProfileSkillsEvidence, 
  CompetencyArea, 
  NormalizedSkillRecord 
} from "@/data/profile";

/**
 * Formats ISO date (e.g. "2026-10-18") to a clean month-year string ("Oct 2026")
 * without locale-dependent hydration mismatches.
 */
function formatEvidenceDate(dateStr: string): string {
  if (!dateStr) return "";
  try {
    const parts = dateStr.split("-");
    if (parts.length >= 2) {
      const year = parts[0];
      const month = parseInt(parts[1], 10);
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      if (month >= 1 && month <= 12) {
        return `${months[month - 1]} ${year}`;
      }
    }
    return dateStr;
  } catch {
    return dateStr;
  }
}

interface CompetencyAreaConfig {
  key: CompetencyArea;
  displayTitle: string;
  icon: typeof Code2;
  description: string;
}

const COMPETENCY_AREAS: CompetencyAreaConfig[] = [
  {
    key: "Frontend",
    displayTitle: "Frontend Engineering",
    icon: Code2,
    description: "Client-side platforms, responsive interfaces, state management, and modern component architectures.",
  },
  {
    key: "Backend",
    displayTitle: "Backend & Systems (Foundations)",
    icon: Server,
    description: "Server concepts, API communication, foundational database querying, and backend protocols.",
  },
  {
    key: "Cloud & DevOps",
    displayTitle: "Tools, Version Control & Cloud",
    icon: Cloud,
    description: "Git version control with AI assistance, edge deployment, package management, and developer tools.",
  },
  {
    key: "Data & AI",
    displayTitle: "Data Science & AI/ML (Study Areas)",
    icon: Cpu,
    description: "Exploratory studies in Python, basic statistics, machine learning principles, and mathematical foundations.",
  },
  {
    key: "System Design",
    displayTitle: "System Design & Architecture Concepts",
    icon: Layers,
    description: "Conceptual architecture exploration, component design, state sync patterns, and geospatial data concepts.",
  },
];

type EvidenceFilter = "all" | "both" | "project" | "learning";
type DomainFilter = "All" | CompetencyArea;

/**
 * Step 4.4: Accessible Evidence Inspector & Skills Competency Matrix
 * 
 * 1. Editorial Section Header with live dynamic evidence metrics (unique, project-backed, learning-documented, both).
 * 2. Multi-tier filter controls for Evidence Type and Competency Domain.
 * 3. 5 verified Competency Areas with real project names and verified learning takeaways.
 * 4. Accessible Evidence Inspector Side Drawer linking skills directly to project case studies and diary logs.
 * 5. Honest empty states for unpopulated domains (System Design) and blank-slate profiles.
 * 6. Cleanly separated secondary section for editable biography narrative and academic credentials.
 */
export function SkillsView() {
  const { state, updateProfile, setActiveTab } = useProfile();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Inspector state
  const [selectedSkillId, setSelectedSkillId] = useState<string | null>(null);
  const triggerElementRef = useRef<HTMLElement | null>(null);
  const inspectorRef = useRef<HTMLDivElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);

  // Filter state
  const [evidenceFilter, setEvidenceFilter] = useState<EvidenceFilter>("all");
  const [domainFilter, setDomainFilter] = useState<DomainFilter>("All");

  const isBlank = Boolean(state.isBlankSlate);

  // Profile and bio form state
  const [profileForm, setProfileForm] = useState({
    name: state.name || "",
    title: state.title || "",
    email: state.contact?.email || "",
    phone: state.contact?.phone || "",
    location: state.contact?.location || "",
    github: state.contact?.github || "",
    linkedin: state.contact?.linkedin || "",
    tagline: state.tagline || "",
    elevatorPitch: state.elevatorPitch || "",
    degree: state.resume?.education?.[0]?.degree || "",
    institution: state.resume?.education?.[0]?.institution || "",
    year: state.resume?.education?.[0]?.year || "",
    honors: state.resume?.education?.[0]?.honors || "",
  });

  const openEditModal = useCallback(() => {
    setProfileForm({
      name: state.name || "",
      title: state.title || "",
      email: state.contact?.email || "",
      phone: state.contact?.phone || "",
      location: state.contact?.location || "",
      github: state.contact?.github || "",
      linkedin: state.contact?.linkedin || "",
      tagline: state.tagline || "",
      elevatorPitch: state.elevatorPitch || "",
      degree: state.resume?.education?.[0]?.degree || "",
      institution: state.resume?.education?.[0]?.institution || "",
      year: state.resume?.education?.[0]?.year || "",
      honors: state.resume?.education?.[0]?.honors || "",
    });
    setIsEditModalOpen(true);
  }, [state]);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const isOwner = (state.name || "").trim().toLowerCase() === "tharanesh selvam";

    // Filter out any obsolete records from secondary entries
    const filteredRemaining = (state.resume?.education?.slice(1) || []).filter(
      (edu) =>
        !edu.degree.toLowerCase().includes("bachelor") &&
        !edu.degree.toLowerCase().includes("b.tech") &&
        !edu.degree.toLowerCase().includes("b.e.") &&
        !edu.year.includes("2020") &&
        !edu.year.includes("2024 - 2026") &&
        !edu.year.includes("2024–2026") &&
        !edu.institution.toLowerCase().includes("engineering college")
    );

    const updatedEducation = profileForm.degree.trim()
      ? [
          {
            degree: profileForm.degree.trim(),
            institution:
              profileForm.institution.trim() ||
              (isOwner ? "Sri Krishna College of Engineering and Technology" : "University / College"),
            year: profileForm.year.trim() || (isOwner ? "2025–2030" : "2026"),
            ...(profileForm.honors.trim() ? { honors: profileForm.honors.trim() } : {}),
          },
          ...(isOwner ? [] : filteredRemaining),
        ]
      : [];

    updateProfile({
      name: profileForm.name.trim(),
      title: profileForm.title.trim(),
      tagline: profileForm.tagline.trim(),
      elevatorPitch: profileForm.elevatorPitch.trim(),
      contact: {
        ...state.contact,
        email: profileForm.email.trim(),
        phone: profileForm.phone.trim(),
        location: profileForm.location.trim(),
        github: profileForm.github.trim(),
        linkedin: profileForm.linkedin.trim(),
      },
      resume: {
        ...state.resume,
        education: updatedEducation,
      },
    });
    setIsEditModalOpen(false);
  };

  // Close bio modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isEditModalOpen) {
        setIsEditModalOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isEditModalOpen]);

  // Derive verified skill records and evidence directly from active profile state
  const skillsEvidence = useMemo(() => {
    return getProfileSkillsEvidence(state);
  }, [state]);

  // Selected skill derived directly from skillsEvidence and active ID during render
  const selectedSkillForInspection = useMemo(() => {
    if (!selectedSkillId) return null;
    return skillsEvidence.skills.find((s) => s.id === selectedSkillId) || null;
  }, [selectedSkillId, skillsEvidence]);

  // Open evidence inspector
  const handleOpenInspection = useCallback((skill: NormalizedSkillRecord) => {
    const activeEl = (document.activeElement as HTMLElement) || null;
    triggerElementRef.current = (activeEl && activeEl !== document.body)
      ? activeEl
      : (document.getElementById(`inspect-btn-${skill.id}`) || activeEl);
    setSelectedSkillId(skill.id);
  }, []);

  // Close evidence inspector and restore focus
  const handleCloseInspection = useCallback(() => {
    const targetTrigger = triggerElementRef.current;
    setSelectedSkillId(null);
    setTimeout(() => {
      if (targetTrigger && document.contains(targetTrigger)) {
        targetTrigger.focus();
      }
      triggerElementRef.current = null;
    }, 50);
  }, []);

  // Direct navigation: Inspect Case Study for a project reference
  const handleInspectCaseStudy = useCallback((projectId: string) => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("portfolio_target_case_study", projectId);
      window.dispatchEvent(new CustomEvent("open-case-study", { detail: { projectId } }));
    }
    setSelectedSkillId(null);
    setActiveTab("projects");
  }, [setActiveTab]);

  // Direct navigation: View Learning Entry in Diary
  const handleViewLearningEntry = useCallback((entryId: string) => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("portfolio_target_learning_entry", entryId);
      window.dispatchEvent(new CustomEvent("highlight-learning-entry", { detail: { entryId } }));
    }
    setSelectedSkillId(null);
    setActiveTab("diary");
  }, [setActiveTab]);

  // Focus trap, body scroll lock, and Escape-to-close for Evidence Inspector
  useEffect(() => {
    if (!selectedSkillForInspection) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    setTimeout(() => {
      closeButtonRef.current?.focus();
    }, 50);

    const handleInspectorKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        handleCloseInspection();
        return;
      }

      if (e.key === "Tab" && inspectorRef.current) {
        const focusableElements = inspectorRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        if (focusableElements.length === 0) return;

        const first = focusableElements[0];
        const last = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === first || !inspectorRef.current.contains(document.activeElement)) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last || !inspectorRef.current.contains(document.activeElement)) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    };

    window.addEventListener("keydown", handleInspectorKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleInspectorKeyDown);
    };
  }, [selectedSkillForInspection, handleCloseInspection]);

  // Filter matcher
  const isSkillMatchingEvidence = useCallback(
    (skill: NormalizedSkillRecord, filter: EvidenceFilter): boolean => {
      switch (filter) {
        case "both":
          return skill.evidenceType === "project-and-learning";
        case "project":
          return skill.projectRefs.length > 0;
        case "learning":
          return skill.learningRefs.length > 0;
        case "all":
        default:
          return true;
      }
    },
    []
  );

  // Dynamic counts for domain categories under current evidence filter
  const domainCounts = useMemo(() => {
    const counts: Record<CompetencyArea, number> = {
      Frontend: 0,
      Backend: 0,
      "Cloud & DevOps": 0,
      "Data & AI": 0,
      "System Design": 0,
    };
    (Object.keys(counts) as CompetencyArea[]).forEach((cat) => {
      counts[cat] = (skillsEvidence.byCategory[cat] || []).filter((s) =>
        isSkillMatchingEvidence(s, evidenceFilter)
      ).length;
    });
    return counts;
  }, [skillsEvidence, evidenceFilter, isSkillMatchingEvidence]);

  // Total matching skills under both active filters
  const totalMatchingSkills = useMemo(() => {
    return skillsEvidence.skills.filter((s) => {
      const matchesEvidence = isSkillMatchingEvidence(s, evidenceFilter);
      const matchesDomain = domainFilter === "All" || s.category === domainFilter;
      return matchesEvidence && matchesDomain;
    }).length;
  }, [skillsEvidence, evidenceFilter, domainFilter, isSkillMatchingEvidence]);

  // Determine if a non-default filter is active
  const isFilterActive = evidenceFilter !== "all" || domainFilter !== "All";

  const handleResetFilters = () => {
    setEvidenceFilter("all");
    setDomainFilter("All");
  };

  // Render an individual skill competency record card
  const renderSkillRecord = (skill: NormalizedSkillRecord) => {
    const primaryLearning = skill.learningRefs[0];

    return (
      <div
        key={skill.id}
        className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#070c18] border border-slate-200/80 dark:border-white/[0.06] hover:border-cyan-500/30 transition-all duration-200 space-y-3 shadow-xs"
      >
        {/* Top line: Name, Version label, Evidence Tag */}
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-0.5 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white tracking-tight break-words">
                {skill.displayName}
              </h4>
              {skill.versionLabel && (
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 dark:bg-white/[0.06] text-slate-600 dark:text-slate-400 font-medium">
                  v{skill.versionLabel}
                </span>
              )}
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
              {skill.projectRefs.length > 0 && skill.learningRefs.length > 0 ? (
                <span>
                  {skill.projectRefs.length} {skill.projectRefs.length === 1 ? "project" : "projects"} · {skill.learningRefs.length} {skill.learningRefs.length === 1 ? "diary record" : "diary records"}
                </span>
              ) : skill.projectRefs.length > 0 ? (
                <span>
                  {skill.projectRefs.length} active {skill.projectRefs.length === 1 ? "project" : "projects"}
                </span>
              ) : (
                <span>
                  {skill.learningRefs.length} verified {skill.learningRefs.length === 1 ? "diary log" : "diary logs"}
                </span>
              )}
            </div>
          </div>

          {/* Evidence Classification Badge */}
          <div className="shrink-0">
            {skill.evidenceType === "project-and-learning" && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-teal-50 text-teal-800 border border-teal-200 dark:bg-teal-500/10 dark:text-teal-300 dark:border-teal-500/20 whitespace-nowrap">
                <CheckCircle2 className="w-3 h-3 text-teal-600 dark:text-teal-400 shrink-0" />
                <span>Projects &amp; Diary</span>
              </span>
            )}
            {skill.evidenceType === "project-backed" && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-800 border border-blue-200 dark:bg-blue-500/10 dark:text-blue-300 dark:border-blue-500/20 whitespace-nowrap">
                <FolderGit2 className="w-3 h-3 text-blue-600 dark:text-blue-400 shrink-0" />
                <span>Project-Backed</span>
              </span>
            )}
            {skill.evidenceType === "learning-documented" && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-indigo-50 text-indigo-800 border border-indigo-200 dark:bg-indigo-500/10 dark:text-indigo-300 dark:border-indigo-500/20 whitespace-nowrap">
                <BookOpen className="w-3 h-3 text-indigo-600 dark:text-indigo-400 shrink-0" />
                <span>Diary-Documented</span>
              </span>
            )}
          </div>
        </div>

        {/* Tangible Evidence Summary */}
        <div className="space-y-2 pt-1 text-xs">
          {/* Active Project References */}
          {skill.projectRefs.length > 0 && (
            <div className="space-y-1">
              <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <FolderGit2 className="w-3 h-3 text-slate-400 shrink-0" />
                <span>Applied in Project Stacks:</span>
              </div>
              <div className="flex flex-wrap gap-1.5 pl-4">
                {skill.projectRefs.map((proj) => (
                  <span
                    key={proj.id}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-white/[0.04] text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-white/[0.06] text-xs font-medium"
                  >
                    <span>{proj.title}</span>
                    {proj.domainTag && (
                      <span className="text-[10px] text-slate-400 dark:text-slate-500">
                        ({proj.domainTag})
                      </span>
                    )}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Verified Learning Diary Reference */}
          {primaryLearning && (
            <div className="space-y-1">
              <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <BookOpen className="w-3 h-3 text-slate-400 shrink-0" />
                <span>
                  Verified Diary Log
                  {primaryLearning.dateLogged && (
                    <span className="text-slate-400 dark:text-slate-500">
                      {" "}• {formatEvidenceDate(primaryLearning.dateLogged)}
                    </span>
                  )}
                  {primaryLearning.masteryLevel && (
                    <span className="text-slate-400 dark:text-slate-500">
                      {" "}• Logged: {primaryLearning.masteryLevel}
                    </span>
                  )}:
                </span>
              </div>
              <div className="pl-4 border-l-2 border-slate-200 dark:border-slate-800 ml-1 py-0.5">
                <p className="text-[11px] sm:text-xs text-slate-600 dark:text-slate-400 italic leading-relaxed line-clamp-2">
                  &ldquo;{primaryLearning.keyTakeaway}&rdquo;
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Card Footer: Dedicated Evidence Inspector Action */}
        <div className="pt-3 mt-1 border-t border-slate-100 dark:border-white/[0.04] flex items-center justify-between gap-2">
          <span className="text-[11px] font-mono text-slate-400 dark:text-slate-500">
            {skill.projectRefs.length} projects • {skill.learningRefs.length} logs
          </span>

          <button
            type="button"
            id={`inspect-btn-${skill.id}`}
            onClick={() => handleOpenInspection(skill)}
            aria-haspopup="dialog"
            aria-label={`Inspect evidence for ${skill.displayName}`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-cyan-50 hover:bg-cyan-100 text-cyan-800 dark:bg-cyan-500/10 dark:hover:bg-cyan-500/20 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-500/30 transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-cyan-500 shrink-0"
          >
            <span>Inspect Evidence</span>
            <ArrowRight className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div id="skills" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10 sm:space-y-12 pb-24">
      
      {/* 1. Primary Section: Engineering Competencies Matrix */}
      <section 
        id="competency-matrix" 
        aria-labelledby="matrix-heading"
        className="rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 backdrop-blur-md space-y-8 dark:bg-[#090f1d]/80 dark:border-white/[0.08] shadow-sm"
      >
        {/* Editorial Section Header */}
        <div className="space-y-4 border-b border-slate-200/80 dark:border-white/[0.08] pb-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-cyan-50 text-cyan-700 border border-cyan-200 dark:bg-cyan-500/10 dark:text-cyan-400 dark:border-cyan-500/20">
              <Code2 className="w-3.5 h-3.5" />
              <span>EVIDENCE-BASED VERIFICATION</span>
            </div>
            <h1 id="matrix-heading" className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Engineering Competencies
            </h1>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-3xl leading-relaxed">
              An evidence-backed technology matrix connecting verified competencies directly to active project repositories, architectural implementations, and structured learning diary entries.
            </p>
          </div>

          {/* Dynamic Evidence Summary Ribbon */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/[0.06] space-y-1">
              <div className="text-[11px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Total Unique Skills
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                {skillsEvidence.totalCount}
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">
                Canonical technologies
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/[0.06] space-y-1">
              <div className="text-[11px] font-mono uppercase tracking-wider text-teal-600 dark:text-teal-400 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                <span>Dual-Evidenced</span>
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                {skillsEvidence.bothCount}
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">
                Projects &amp; learning logs
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/[0.06] space-y-1">
              <div className="text-[11px] font-mono uppercase tracking-wider text-blue-600 dark:text-blue-400 flex items-center gap-1">
                <FolderGit2 className="w-3 h-3" />
                <span>Project-Backed</span>
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                {skillsEvidence.projectBackedCount}
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">
                In active project stacks
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/[0.06] space-y-1">
              <div className="text-[11px] font-mono uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
                <BookOpen className="w-3 h-3" />
                <span>Diary-Documented</span>
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                {skillsEvidence.learningDocumentedCount}
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">
                Verified diary records
              </div>
            </div>
          </div>

          {/* Informational Context Notice */}
          <div className="flex items-start gap-2 pt-1 text-xs text-slate-500 dark:text-slate-400">
            <Info className="w-4 h-4 text-cyan-600 dark:text-cyan-400 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              Evidence counts represent verifiable implementation references in this portfolio workspace, not arbitrary self-assigned proficiency ratings.
            </p>
          </div>
        </div>

        {/* Global Empty State for Blank Slate Profiles */}
        {skillsEvidence.totalCount === 0 ? (
          <div className="text-center py-12 px-6 rounded-2xl bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 max-w-lg mx-auto space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center mx-auto">
              <Code2 className="w-6 h-6" />
            </div>
            <div className="space-y-1.5">
              <h4 className="text-base font-bold text-slate-900 dark:text-white">
                No Technical Skills Evidenced Yet
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-sm mx-auto">
                Engineering competencies in this portfolio are compiled directly from tangible project repositories and Learning Diary entries. Add your first project or log a learning record to generate your competency matrix.
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setActiveTab("diary")}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-400 hover:to-cyan-500 text-white font-bold text-xs shadow-md shadow-cyan-500/20 transition-all cursor-pointer"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>+ Log First Learning Entry</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("projects")}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold transition-all cursor-pointer"
              >
                <span>+ Add First Project</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Filter Controls Toolbar */}
            <div 
              role="toolbar" 
              aria-label="Filter competency matrix"
              className="space-y-3 bg-slate-50/80 dark:bg-white/[0.02] p-4 rounded-2xl border border-slate-200/80 dark:border-white/[0.06]"
            >
              {/* Evidence Type Filter Strip */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                  Filter by Evidence Source:
                </span>
                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
                  <button
                    type="button"
                    aria-pressed={evidenceFilter === "all"}
                    onClick={() => setEvidenceFilter("all")}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-cyan-500 ${
                      evidenceFilter === "all"
                        ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs"
                        : "bg-white text-slate-700 hover:bg-slate-100 dark:bg-[#0b1220] dark:text-slate-300 dark:hover:bg-white/[0.06] border border-slate-200 dark:border-white/[0.08]"
                    }`}
                  >
                    <span>All Evidence</span>
                    <span className="px-1.5 py-0.2 rounded-md bg-slate-200/60 dark:bg-white/10 text-[10px]">
                      {skillsEvidence.totalCount}
                    </span>
                  </button>

                  <button
                    type="button"
                    aria-pressed={evidenceFilter === "both"}
                    onClick={() => setEvidenceFilter("both")}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-cyan-500 ${
                      evidenceFilter === "both"
                        ? "bg-teal-600 text-white dark:bg-teal-500/20 dark:text-teal-300 dark:border dark:border-teal-500/40 shadow-xs"
                        : "bg-white text-slate-700 hover:bg-slate-100 dark:bg-[#0b1220] dark:text-slate-300 dark:hover:bg-white/[0.06] border border-slate-200 dark:border-white/[0.08]"
                    }`}
                  >
                    <CheckCircle2 className="w-3 h-3 text-teal-500" />
                    <span>Projects &amp; Diary</span>
                    <span className="px-1.5 py-0.2 rounded-md bg-teal-100 dark:bg-teal-500/20 text-[10px]">
                      {skillsEvidence.bothCount}
                    </span>
                  </button>

                  <button
                    type="button"
                    aria-pressed={evidenceFilter === "project"}
                    onClick={() => setEvidenceFilter("project")}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-cyan-500 ${
                      evidenceFilter === "project"
                        ? "bg-blue-600 text-white dark:bg-blue-500/20 dark:text-blue-300 dark:border dark:border-blue-500/40 shadow-xs"
                        : "bg-white text-slate-700 hover:bg-slate-100 dark:bg-[#0b1220] dark:text-slate-300 dark:hover:bg-white/[0.06] border border-slate-200 dark:border-white/[0.08]"
                    }`}
                  >
                    <FolderGit2 className="w-3 h-3 text-blue-500" />
                    <span>Project-Backed</span>
                    <span className="px-1.5 py-0.2 rounded-md bg-blue-100 dark:bg-blue-500/20 text-[10px]">
                      {skillsEvidence.projectBackedCount}
                    </span>
                  </button>

                  <button
                    type="button"
                    aria-pressed={evidenceFilter === "learning"}
                    onClick={() => setEvidenceFilter("learning")}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-cyan-500 ${
                      evidenceFilter === "learning"
                        ? "bg-indigo-600 text-white dark:bg-indigo-500/20 dark:text-indigo-300 dark:border dark:border-indigo-500/40 shadow-xs"
                        : "bg-white text-slate-700 hover:bg-slate-100 dark:bg-[#0b1220] dark:text-slate-300 dark:hover:bg-white/[0.06] border border-slate-200 dark:border-white/[0.08]"
                    }`}
                  >
                    <BookOpen className="w-3 h-3 text-indigo-500" />
                    <span>Diary-Documented</span>
                    <span className="px-1.5 py-0.2 rounded-md bg-indigo-100 dark:bg-indigo-500/20 text-[10px]">
                      {skillsEvidence.learningDocumentedCount}
                    </span>
                  </button>
                </div>
              </div>

              {/* Competency Area Domain Filter Strip */}
              <div className="space-y-1.5 pt-2 border-t border-slate-200/60 dark:border-white/[0.04]">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                    Filter by Competency Area:
                  </span>
                  {isFilterActive && (
                    <button
                      type="button"
                      onClick={handleResetFilters}
                      className="inline-flex items-center gap-1 text-[11px] font-medium text-cyan-600 dark:text-cyan-400 hover:underline cursor-pointer"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Reset all filters</span>
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
                  <button
                    type="button"
                    aria-pressed={domainFilter === "All"}
                    onClick={() => setDomainFilter("All")}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-cyan-500 ${
                      domainFilter === "All"
                        ? "bg-cyan-600 text-white dark:bg-cyan-500/20 dark:text-cyan-300 dark:border dark:border-cyan-500/40 shadow-xs"
                        : "bg-white text-slate-700 hover:bg-slate-100 dark:bg-[#0b1220] dark:text-slate-300 dark:hover:bg-white/[0.06] border border-slate-200 dark:border-white/[0.08]"
                    }`}
                  >
                    <span>All Domains</span>
                    <span className="px-1.5 py-0.2 rounded-md bg-slate-200/60 dark:bg-white/10 text-[10px]">
                      {totalMatchingSkills}
                    </span>
                  </button>

                  {COMPETENCY_AREAS.map((area) => {
                    const count = domainCounts[area.key];
                    const isSelected = domainFilter === area.key;
                    return (
                      <button
                        key={area.key}
                        type="button"
                        aria-pressed={isSelected}
                        onClick={() => setDomainFilter(area.key)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-cyan-500 ${
                          isSelected
                            ? "bg-cyan-600 text-white dark:bg-cyan-500/20 dark:text-cyan-300 dark:border dark:border-cyan-500/40 shadow-xs"
                            : "bg-white text-slate-700 hover:bg-slate-100 dark:bg-[#0b1220] dark:text-slate-300 dark:hover:bg-white/[0.06] border border-slate-200 dark:border-white/[0.08]"
                        }`}
                      >
                        <span>{area.displayTitle}</span>
                        <span className={`px-1.5 py-0.2 rounded-md text-[10px] ${
                          count > 0 ? "bg-cyan-100 dark:bg-cyan-500/20 text-cyan-800 dark:text-cyan-300" : "bg-slate-200/60 dark:bg-white/10 text-slate-400"
                        }`}>
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Filter Result Status Bar */}
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-1">
              <span>
                Showing <strong className="text-slate-900 dark:text-white">{totalMatchingSkills}</strong> of {skillsEvidence.totalCount} evidenced competencies
                {evidenceFilter !== "all" && ` (${evidenceFilter.replace("-", " ")})`}
                {domainFilter !== "All" && ` in ${domainFilter}`}
              </span>
              {isFilterActive && (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="text-cyan-600 dark:text-cyan-400 hover:underline font-medium"
                >
                  Clear filters
                </button>
              )}
            </div>

            {/* 5 Competency Areas Matrix Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {COMPETENCY_AREAS.filter((area) => domainFilter === "All" || domainFilter === area.key).map((area) => {
                const Icon = area.icon;
                const allAreaSkills = skillsEvidence.byCategory[area.key] || [];
                const matchingSkills = allAreaSkills.filter((s) => isSkillMatchingEvidence(s, evidenceFilter));
                const isSystemDesign = area.key === "System Design";
                const isSingleSelected = domainFilter === area.key;

                return (
                  <div
                    key={area.key}
                    className={`rounded-2xl bg-slate-50 border border-slate-200 p-5 sm:p-6 space-y-4 dark:bg-[#060b17] dark:border-white/[0.06] shadow-xs flex flex-col justify-between ${
                      isSystemDesign && domainFilter === "All" ? "lg:col-span-2" : isSingleSelected ? "lg:col-span-2" : ""
                    }`}
                  >
                    <div className="space-y-4">
                      {/* Competency Area Header */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/80 dark:border-white/[0.06] pb-3">
                        <div className="flex items-center gap-2.5">
                          <div className="p-2 rounded-xl bg-cyan-50 text-cyan-700 border border-cyan-200 dark:bg-cyan-500/10 dark:text-cyan-400 dark:border-cyan-500/20 shrink-0">
                            <Icon className="w-4 h-4" />
                          </div>
                          <div>
                            <h3 className="font-bold text-slate-900 dark:text-white text-base">
                              {area.displayTitle}
                            </h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                              {area.description}
                            </p>
                          </div>
                        </div>

                        <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-white text-slate-700 border border-slate-200 dark:bg-white/[0.04] dark:text-slate-300 dark:border-white/[0.08] self-start sm:self-auto shrink-0 font-medium">
                          {matchingSkills.length} {matchingSkills.length === 1 ? "Evidenced Skill" : "Evidenced Skills"}
                        </span>
                      </div>

                      {/* Skills Content / Honest Empty States */}
                      {matchingSkills.length === 0 ? (
                        allAreaSkills.length === 0 ? (
                          /* Genuine Empty State for Unpopulated Domains (System Design) */
                          <div className="p-6 rounded-2xl bg-white/60 dark:bg-white/[0.02] border border-dashed border-slate-200 dark:border-white/[0.08] text-center space-y-3">
                            <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-white/[0.05] text-slate-400 dark:text-slate-500 flex items-center justify-center mx-auto">
                              <Layers className="w-5 h-5" />
                            </div>
                            <div className="space-y-1 max-w-md mx-auto">
                              <h5 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200">
                                No Verifiable Evidence Logged Yet
                              </h5>
                              <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                                No project tech stacks or learning diary records currently reference {area.displayTitle} competencies in this profile. Skills appear here automatically once tangible evidence is logged in the Learning Diary or tagged in project architectures.
                              </p>
                            </div>
                            <div className="pt-1">
                              <button
                                type="button"
                                onClick={() => setActiveTab("diary")}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/[0.06] dark:hover:bg-white/[0.1] text-slate-700 dark:text-slate-200 text-xs font-semibold transition-colors cursor-pointer"
                              >
                                <PlusCircle className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                                <span>+ Log {area.key} Milestone</span>
                              </button>
                            </div>
                          </div>
                        ) : (
                          /* Empty State because active filter excluded all skills in this domain */
                          <div className="p-5 rounded-2xl bg-white/40 dark:bg-white/[0.01] border border-dashed border-slate-200 dark:border-white/[0.06] text-center space-y-2">
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                              No skills in {area.displayTitle} match the current filter (&ldquo;{evidenceFilter}&rdquo;).
                            </p>
                            <button
                              type="button"
                              onClick={() => setEvidenceFilter("all")}
                              className="text-xs font-semibold text-cyan-600 dark:text-cyan-400 hover:underline cursor-pointer"
                            >
                              Show all {allAreaSkills.length} skills in this domain
                            </button>
                          </div>
                        )
                      ) : (
                        <div className="grid grid-cols-1 gap-3">
                          {matchingSkills.map((skill) => renderSkillRecord(skill))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </section>

      {/* 2. Accessible Evidence Inspector Side Drawer / Modal */}
      {selectedSkillForInspection && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="evidence-inspector-title"
          aria-describedby="evidence-inspector-desc"
          className="fixed inset-0 z-50 flex justify-end"
        >
          {/* Backdrop with Blur */}
          <div
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-md transition-opacity duration-300"
            onClick={handleCloseInspection}
            aria-hidden="true"
          />

          {/* Drawer Container */}
          <div
            ref={inspectorRef}
            className="relative w-full sm:max-w-xl md:max-w-2xl h-full bg-white dark:bg-[#070c18] border-l border-slate-200 dark:border-white/[0.08] shadow-2xl flex flex-col justify-between z-10 overflow-hidden"
          >
            {/* Top Inspector Header */}
            <div className="p-6 border-b border-slate-200 dark:border-white/[0.08] space-y-3 bg-slate-50/50 dark:bg-white/[0.02] shrink-0">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold uppercase bg-slate-100 text-slate-700 dark:bg-white/[0.06] dark:text-slate-300 border border-slate-200 dark:border-white/[0.08]">
                    {selectedSkillForInspection.category}
                  </span>
                  {selectedSkillForInspection.evidenceType === "project-and-learning" && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-teal-50 text-teal-800 border border-teal-200 dark:bg-teal-500/10 dark:text-teal-300 dark:border-teal-500/20">
                      <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                      <span>Projects &amp; Diary</span>
                    </span>
                  )}
                  {selectedSkillForInspection.evidenceType === "project-backed" && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-800 border border-blue-200 dark:bg-blue-500/10 dark:text-blue-300 dark:border-blue-500/20">
                      <FolderGit2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                      <span>Project-Backed</span>
                    </span>
                  )}
                  {selectedSkillForInspection.evidenceType === "learning-documented" && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-800 border border-indigo-200 dark:bg-indigo-500/10 dark:text-indigo-300 dark:border-indigo-500/20">
                      <BookOpen className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                      <span>Diary-Documented</span>
                    </span>
                  )}
                </div>

                <button
                  ref={closeButtonRef}
                  type="button"
                  onClick={handleCloseInspection}
                  aria-label="Close evidence inspector"
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.06] transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-cyan-500"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 id="evidence-inspector-title" className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                    {selectedSkillForInspection.displayName}
                  </h3>
                  {selectedSkillForInspection.versionLabel && (
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-white/[0.06] text-slate-600 dark:text-slate-400 font-medium">
                      Version {selectedSkillForInspection.versionLabel}
                    </span>
                  )}
                </div>
                <p id="evidence-inspector-desc" className="text-xs text-slate-500 dark:text-slate-400">
                  Canonical Skill Evidence Inspector • {selectedSkillForInspection.projectRefs.length} {selectedSkillForInspection.projectRefs.length === 1 ? "Project Implementation" : "Project Implementations"} • {selectedSkillForInspection.learningRefs.length} {selectedSkillForInspection.learningRefs.length === 1 ? "Learning Diary Log" : "Learning Diary Logs"}
                </p>
              </div>
            </div>

            {/* Drawer Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              {/* Summary Info Banner */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.06] flex items-start gap-3">
                <Info className="w-4 h-4 text-cyan-600 dark:text-cyan-400 shrink-0 mt-0.5" />
                <div className="text-xs text-slate-600 dark:text-slate-400 space-y-1 leading-relaxed">
                  <p>
                    This inspector provides transparent evidence linking <strong className="text-slate-900 dark:text-white">{selectedSkillForInspection.displayName}</strong> directly to verified project codebases and documented technical learning logs in the active profile.
                  </p>
                  <p className="text-[11px] text-slate-500 font-mono">
                    Canonical ID: <code className="text-cyan-600 dark:text-cyan-400 font-semibold">{selectedSkillForInspection.id}</code>
                    {selectedSkillForInspection.sourceLabels.length > 0 && ` • Sourced from: ${selectedSkillForInspection.sourceLabels.join(", ")}`}
                  </p>
                </div>
              </div>

              {/* 1. Project Evidence Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/[0.06] pb-2">
                  <div className="flex items-center gap-2">
                    <FolderGit2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                      Project Implementations ({selectedSkillForInspection.projectRefs.length})
                    </h4>
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono">
                    {selectedSkillForInspection.projectRefs.length > 0 ? "Production & System Stacks" : "No project stacks"}
                  </span>
                </div>

                {selectedSkillForInspection.projectRefs.length === 0 ? (
                  <div className="p-5 rounded-2xl bg-slate-50/60 dark:bg-white/[0.01] border border-dashed border-slate-200 dark:border-white/[0.06] text-xs text-slate-500 dark:text-slate-400">
                    No direct project tech stack references are currently tagged with {selectedSkillForInspection.displayName} in this profile.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {selectedSkillForInspection.projectRefs.map((projRef) => {
                      const fullProject = state.projects.find((p) => p.id === projRef.id);
                      return (
                        <div
                          key={projRef.id}
                          className="p-5 rounded-2xl bg-white dark:bg-[#0c1322] border border-slate-200 dark:border-white/[0.06] space-y-3.5 shadow-xs"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="space-y-0.5">
                              <div className="flex items-center gap-2 flex-wrap">
                                <h5 className="font-bold text-slate-900 dark:text-white text-sm">
                                  {projRef.title}
                                </h5>
                                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300 border border-blue-200 dark:border-blue-500/20">
                                  {projRef.domainTag || fullProject?.category || "Full-Stack"}
                                </span>
                              </div>
                              <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                                Matched in stack as: <span className="font-semibold text-cyan-600 dark:text-cyan-400">{projRef.matchedTech}</span>
                              </div>
                            </div>

                            {/* External Project Links */}
                            <div className="flex items-center gap-1.5 shrink-0">
                              {(projRef.repoUrl || fullProject?.repoUrl) && (
                                <a
                                  href={projRef.repoUrl || fullProject?.repoUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  aria-label={`View ${projRef.title} repository`}
                                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.06] transition-colors"
                                >
                                  <GithubIcon className="w-4 h-4" />
                                </a>
                              )}
                              {(projRef.liveUrl || fullProject?.liveUrl) && (
                                <a
                                  href={projRef.liveUrl || fullProject?.liveUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  aria-label={`View ${projRef.title} live deployment`}
                                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.06] transition-colors"
                                >
                                  <Globe className="w-4 h-4" />
                                </a>
                              )}
                            </div>
                          </div>

                          {fullProject?.problemSolved && (
                            <div className="text-xs text-slate-600 dark:text-slate-300 space-y-1">
                              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                                Problem Solved:
                              </span>
                              <p className="line-clamp-2 leading-relaxed">
                                {fullProject.problemSolved}
                              </p>
                            </div>
                          )}

                          {fullProject?.solution && (
                            <div className="text-xs text-slate-600 dark:text-slate-300 space-y-1">
                              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                                Implementation Solution:
                              </span>
                              <p className="line-clamp-2 leading-relaxed">
                                {fullProject.solution}
                              </p>
                            </div>
                          )}

                          {/* Action: Inspect Case Study */}
                          <div className="pt-2 border-t border-slate-100 dark:border-white/[0.04] flex items-center justify-end">
                            <button
                              type="button"
                              onClick={() => handleInspectCaseStudy(projRef.id)}
                              aria-label={`Inspect case study for ${projRef.title}`}
                              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-800 dark:bg-blue-500/10 dark:hover:bg-blue-500/20 dark:text-blue-300 border border-blue-200 dark:border-blue-500/30 text-xs font-semibold transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-blue-500"
                            >
                              <Briefcase className="w-3.5 h-3.5" />
                              <span>Inspect Case Study</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* 2. Learning Diary Evidence Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/[0.06] pb-2">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                      Learning Diary Records ({selectedSkillForInspection.learningRefs.length})
                    </h4>
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono">
                    {selectedSkillForInspection.learningRefs.length > 0 ? "Technical Diary Logs" : "No diary logs"}
                  </span>
                </div>

                {selectedSkillForInspection.learningRefs.length === 0 ? (
                  <div className="p-5 rounded-2xl bg-slate-50/60 dark:bg-white/[0.01] border border-dashed border-slate-200 dark:border-white/[0.06] text-xs text-slate-500 dark:text-slate-400">
                    No technical learning diary records are currently logged for {selectedSkillForInspection.displayName}.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {selectedSkillForInspection.learningRefs.map((learnRef) => (
                      <div
                        key={learnRef.id}
                        className="p-5 rounded-2xl bg-white dark:bg-[#0c1322] border border-slate-200 dark:border-white/[0.06] space-y-3.5 shadow-xs"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h5 className="font-bold text-slate-900 dark:text-white text-sm">
                                {learnRef.technology}
                              </h5>
                              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/20">
                                {learnRef.category}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono flex-wrap">
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                <span>Logged {formatEvidenceDate(learnRef.dateLogged)}</span>
                              </span>
                              {learnRef.masteryLevel && (
                                <>
                                  <span>•</span>
                                  <span>Recorded Milestone: <strong className="text-slate-700 dark:text-slate-300">{learnRef.masteryLevel}</strong></span>
                                </>
                              )}
                            </div>
                          </div>

                          {learnRef.repoOrDemoUrl && (
                            <a
                              href={learnRef.repoOrDemoUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              aria-label={`View demo for ${learnRef.technology}`}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.06] transition-colors shrink-0"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          )}
                        </div>

                        {/* Key Takeaway / Proof of Work */}
                        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/[0.04]">
                          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block mb-1">
                            Verified Learning Takeaway:
                          </span>
                          <p className="text-xs text-slate-700 dark:text-slate-300 italic leading-relaxed">
                            &ldquo;{learnRef.keyTakeaway}&rdquo;
                          </p>
                        </div>

                        {/* Tags */}
                        {learnRef.tags && learnRef.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1.5">
                            {learnRef.tags.map((t) => (
                              <span
                                key={t}
                                className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-white/[0.04] text-slate-600 dark:text-slate-400 text-[10px] font-mono"
                              >
                                #{t}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Action: View Learning Entry */}
                        <div className="pt-2 border-t border-slate-100 dark:border-white/[0.04] flex items-center justify-end">
                          <button
                            type="button"
                            onClick={() => handleViewLearningEntry(learnRef.id)}
                            aria-label={`View learning diary entry for ${learnRef.technology}`}
                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-800 dark:bg-indigo-500/10 dark:hover:bg-indigo-500/20 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/30 text-xs font-semibold transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-indigo-500"
                          >
                            <BookOpen className="w-3.5 h-3.5" />
                            <span>View Learning Entry</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Footer */}
            <div className="p-4 sm:p-5 border-t border-slate-200 dark:border-white/[0.08] bg-slate-50 dark:bg-white/[0.02] flex items-center justify-between shrink-0">
              <span className="text-[11px] text-slate-500 font-mono">
                Active Profile: <strong className="text-slate-800 dark:text-slate-200">{state.name || "Developer"}</strong>
              </span>
              <button
                type="button"
                onClick={handleCloseInspection}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-200/80 hover:bg-slate-300 dark:bg-white/[0.06] dark:hover:bg-white/[0.1] text-slate-800 dark:text-white transition-colors cursor-pointer"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. Secondary Section: About the Developer & Academic Credentials */}
      <section 
        id="developer-background"
        aria-labelledby="bio-heading"
        className="rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 backdrop-blur-md space-y-6 dark:bg-[#090f1d]/80 dark:border-white/[0.08] shadow-sm"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/80 dark:border-white/[0.08] pb-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-slate-100 text-slate-700 border border-slate-200 dark:bg-white/[0.04] dark:text-slate-300 dark:border-white/[0.08]">
              <User className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
              <span>BACKGROUND &amp; CREDENTIALS</span>
            </div>
            <h3 id="bio-heading" className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Engineering Focus &amp; Academic Background
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              Professional engineering narrative, software trajectory, and formal degree qualifications.
            </p>
          </div>

          <button
            type="button"
            onClick={openEditModal}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 hover:text-slate-950 font-medium text-xs border border-slate-200 dark:bg-white/[0.06] dark:hover:bg-white/[0.1] dark:text-slate-200 dark:hover:text-white dark:border-white/[0.08] transition-all self-start sm:self-auto shadow-xs cursor-pointer focus-visible:outline-2 focus-visible:outline-cyan-500"
          >
            <Edit3 className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
            <span>Edit Bio / Education</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-slate-700 dark:text-slate-300 text-xs sm:text-sm leading-relaxed">
          {/* Engineering Narrative */}
          <div className="lg:col-span-2 space-y-3">
            {state.elevatorPitch ? (
              <p className="whitespace-pre-line leading-relaxed">{state.elevatorPitch}</p>
            ) : isBlank ? (
              <div className="space-y-2 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800">
                <p>
                  Welcome! I am <strong className="text-slate-900 dark:text-white font-semibold">{state.name || "the developer"}</strong>, specializing in <strong className="text-cyan-700 dark:text-cyan-400">{state.title || "Software Engineering"}</strong>.
                </p>
                <p className="text-slate-500 dark:text-slate-400 text-xs">
                  This workspace is initialized on a clean slate. Click &quot;Edit Bio / Education&quot; to customize your bio narrative, educational milestones, and career goals.
                </p>
              </div>
            ) : (
              <>
                <p>
                  Hello! I am <strong className="text-slate-900 dark:text-white font-semibold">{state.name || "Tharanesh Selvam"}</strong>, a computer science student pursuing a Five-Year Integrated M.Tech in Computer Science and Engineering at Sri Krishna College of Engineering and Technology (2025–2030). I am passionate about software engineering, modern web applications, and foundational computer science principles.
                </p>
                <p>
                  My current focus spans Next.js, React, TypeScript, and Tailwind CSS developed with AI-assisted engineering workflows. I am also exploring early architectural concepts (such as Land Stack) and studying core mathematical and machine learning fundamentals.
                </p>
                <p>
                  I am actively seeking <strong className="text-cyan-700 dark:text-cyan-300 font-semibold">software development internships and engineering opportunities</strong> where I can apply my skills and continue learning.
                </p>
              </>
            )}
          </div>

          {/* Academic Credentials Box */}
          <div className="space-y-3 p-4 rounded-2xl bg-slate-50 border border-slate-200 dark:bg-[#060b17] dark:border-white/[0.06]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-cyan-600 dark:text-cyan-400">
                <GraduationCap className="w-4 h-4" />
                <span>EDUCATION</span>
              </div>
              <button
                type="button"
                onClick={openEditModal}
                className="text-[10px] text-cyan-600 dark:text-cyan-400 font-semibold hover:underline cursor-pointer"
              >
                + Add / Edit
              </button>
            </div>

            {state.resume?.education && state.resume.education.length > 0 ? (
              <div className="space-y-3">
                {state.resume.education.map((edu, idx) => (
                  <div key={idx} className={idx > 0 ? "pt-2 border-t border-slate-200 dark:border-slate-800/80 space-y-1" : "space-y-1"}>
                    <div className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm">
                      {edu.degree}
                    </div>
                    <div className="text-[11px] text-slate-600 dark:text-slate-400">
                      {edu.institution} • {edu.year}
                      {edu.honors && ` • ${edu.honors}`}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 space-y-2">
                <p className="text-xs text-slate-500">No education milestones added yet.</p>
                <button
                  type="button"
                  onClick={openEditModal}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-cyan-600 dark:text-cyan-400 hover:underline cursor-pointer"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>+ Add Education / Bio</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Edit Bio / Education Modal */}
      {isEditModalOpen && (
        <div 
          role="dialog"
          aria-modal="true"
          aria-labelledby="edit-profile-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
        >
          <div 
            className="fixed inset-0 bg-slate-950/60 dark:bg-slate-950/80 backdrop-blur-md" 
            onClick={() => setIsEditModalOpen(false)} 
          />
          <div className="relative w-full max-w-lg rounded-3xl bg-white border border-slate-200 dark:bg-[#090f1d] dark:border-white/[0.1] shadow-2xl p-6 z-10 space-y-5 text-slate-900 dark:text-white max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 id="edit-profile-modal-title" className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                <span>Edit Profile, Bio &amp; Education</span>
              </h3>
              <button 
                type="button" 
                aria-label="Close dialog"
                onClick={() => setIsEditModalOpen(false)} 
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white text-lg p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-slate-700 dark:text-slate-300 font-semibold">Full Name</label>
                <input
                  type="text"
                  value={profileForm.name}
                  onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-100 text-slate-900 border border-slate-300 dark:bg-[#040711] dark:border-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-700 dark:text-slate-300 font-semibold">Professional Headline / Target Role</label>
                <input
                  type="text"
                  value={profileForm.title}
                  onChange={(e) => setProfileForm({ ...profileForm, title: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-100 text-slate-900 border border-slate-300 dark:bg-[#040711] dark:border-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-700 dark:text-slate-300 font-semibold">Elevator Pitch &amp; Focus Narrative</label>
                <textarea
                  rows={3}
                  value={profileForm.elevatorPitch}
                  onChange={(e) => setProfileForm({ ...profileForm, elevatorPitch: e.target.value })}
                  placeholder="Summarize your engineering background, favorite tech stacks, and career trajectory..."
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-100 text-slate-900 border border-slate-300 dark:bg-[#040711] dark:border-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 resize-none"
                />
              </div>

              {/* Education Inputs */}
              <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-2.5">
                <span className="font-bold text-[11px] font-mono uppercase text-slate-400 block">Education Overview</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-slate-600 dark:text-slate-400">Degree</label>
                    <input
                      type="text"
                      name="degree"
                      placeholder="e.g. Integrated M.Tech in Computer Science"
                      value={profileForm.degree}
                      onChange={(e) => setProfileForm({ ...profileForm, degree: e.target.value })}
                      className="w-full px-3 py-1.5 rounded-xl bg-slate-100 text-slate-900 border border-slate-300 dark:bg-[#040711] dark:border-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-slate-600 dark:text-slate-400">Institution</label>
                    <input
                      type="text"
                      name="institution"
                      placeholder="e.g. Sri Krishna College of Engineering and Technology"
                      value={profileForm.institution}
                      onChange={(e) => setProfileForm({ ...profileForm, institution: e.target.value })}
                      className="w-full px-3 py-1.5 rounded-xl bg-slate-100 text-slate-900 border border-slate-300 dark:bg-[#040711] dark:border-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-slate-600 dark:text-slate-400">Year / Duration</label>
                    <input
                      type="text"
                      name="year"
                      placeholder="e.g. 2025–2030"
                      value={profileForm.year}
                      onChange={(e) => setProfileForm({ ...profileForm, year: e.target.value })}
                      className="w-full px-3 py-1.5 rounded-xl bg-slate-100 text-slate-900 border border-slate-300 dark:bg-[#040711] dark:border-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-slate-600 dark:text-slate-400">Status / Programme Type</label>
                    <input
                      type="text"
                      name="honors"
                      placeholder="e.g. Pursuing • Five-Year Integrated Programme"
                      value={profileForm.honors}
                      onChange={(e) => setProfileForm({ ...profileForm, honors: e.target.value })}
                      className="w-full px-3 py-1.5 rounded-xl bg-slate-100 text-slate-900 border border-slate-300 dark:bg-[#040711] dark:border-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                    />
                  </div>
                </div>
              </div>

              {/* Contact Inputs */}
              <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-2.5">
                <span className="font-bold text-[11px] font-mono uppercase text-slate-400 block">Contact &amp; Links</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-slate-600 dark:text-slate-400">Email</label>
                    <input
                      type="email"
                      placeholder="name@domain.com"
                      value={profileForm.email}
                      onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                      className="w-full px-3 py-1.5 rounded-xl bg-slate-100 text-slate-900 border border-slate-300 dark:bg-[#040711] dark:border-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-slate-600 dark:text-slate-400">Location</label>
                    <input
                      type="text"
                      placeholder="e.g. San Francisco, CA"
                      value={profileForm.location}
                      onChange={(e) => setProfileForm({ ...profileForm, location: e.target.value })}
                      className="w-full px-3 py-1.5 rounded-xl bg-slate-100 text-slate-900 border border-slate-300 dark:bg-[#040711] dark:border-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-slate-600 dark:text-slate-400">GitHub URL</label>
                    <input
                      type="text"
                      placeholder="https://github.com/username"
                      value={profileForm.github}
                      onChange={(e) => setProfileForm({ ...profileForm, github: e.target.value })}
                      className="w-full px-3 py-1.5 rounded-xl bg-slate-100 text-slate-900 border border-slate-300 dark:bg-[#040711] dark:border-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-slate-600 dark:text-slate-400">LinkedIn URL</label>
                    <input
                      type="text"
                      placeholder="https://linkedin.com/in/username"
                      value={profileForm.linkedin}
                      onChange={(e) => setProfileForm({ ...profileForm, linkedin: e.target.value })}
                      className="w-full px-3 py-1.5 rounded-xl bg-slate-100 text-slate-900 border border-slate-300 dark:bg-[#040711] dark:border-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:text-white transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-400 hover:to-cyan-500 text-white font-bold shadow-md shadow-cyan-500/20 cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default SkillsView;

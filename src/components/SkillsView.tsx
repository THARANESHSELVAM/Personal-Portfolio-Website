"use client";

import { useState, useMemo } from "react";
import { useProfile } from "@/context/ProfileContext";
import { 
  User, 
  Edit3, 
  Code2, 
  GraduationCap, 
  Cpu, 
  Server, 
  Cloud,
  CheckCircle2,
  PlusCircle,
  BookOpen
} from "lucide-react";

/**
 * Isolated Skills Tab View
 * Renders:
 * 1. Technical Skills & Architecture (</> TECHNICAL COMPETENCIES)
 *    - 4 Domain cards dynamically synchronized with the Learning Diary and Projects.
 * 2. About the Developer (Background & Engineering Focus & Education)
 *    - Bio narrative, Edit Bio action modal, and Education timeline.
 */
export function SkillsView() {
  const { state, updateProfile, extractedSkills, setActiveTab } = useProfile();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const isBlank = Boolean(state.isBlankSlate);

  const [profileForm, setProfileForm] = useState({
    name: state.name,
    title: state.title,
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
  });

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedEducation = profileForm.degree.trim()
      ? [
          {
            degree: profileForm.degree.trim(),
            institution: profileForm.institution.trim() || "University / College",
            year: profileForm.year.trim() || "2026",
          },
          ...(state.resume?.education?.slice(1) || []),
        ]
      : state.resume?.education || [];

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

  // Helper to merge default production tools with verified skills extracted dynamically from Diary & Projects
  const mergeSkills = (defaults: string[], dynamicList: string[] = []) => {
    const set = new Set<string>();
    const seenLower = new Set<string>();

    const add = (skill: string) => {
      const clean = skill.trim();
      if (!clean) return;
      const lower = clean.toLowerCase();
      if (!seenLower.has(lower)) {
        seenLower.add(lower);
        set.add(clean);
      }
    };

    defaults.forEach(add);
    dynamicList.forEach(add);
    return Array.from(set);
  };

  // 4 Domain cards dynamically synchronized with live Learning Diary & Project stacks
  const skillCategories = useMemo(() => [
    {
      title: "Frontend Engineering",
      icon: Code2,
      skills: mergeSkills(
        isBlank ? [] : ["React 19", "Next.js", "TypeScript", "Tailwind CSS", "HTML5 & CSS3", "State Management", "Responsive UI"],
        extractedSkills?.Frontend || []
      ),
    },
    {
      title: "Backend & Systems",
      icon: Server,
      skills: mergeSkills(
        isBlank ? [] : ["Node.js", "Express", "REST APIs", "PostgreSQL", "GIS / PostGIS", "Python", "Microservices"],
        extractedSkills?.Backend || []
      ),
    },
    {
      title: "Cloud & DevOps",
      icon: Cloud,
      skills: mergeSkills(
        isBlank ? [] : ["AWS", "Vercel", "Docker", "Git & GitHub", "CI/CD Workflows", "Turbopack", "Edge Deployments"],
        extractedSkills?.["Cloud & DevOps"] || []
      ),
    },
    {
      title: "Data & AI / ML",
      icon: Cpu,
      skills: mergeSkills(
        isBlank ? [] : ["Python", "Pandas", "NumPy", "Scikit-learn", "Data Pipelines", "Model Evaluation", "EDA"],
        extractedSkills?.["Data & AI"] || []
      ),
    },
  ], [extractedSkills, isBlank]);

  const totalSkills = skillCategories.reduce((acc, cat) => acc + cat.skills.length, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10 sm:space-y-12 pb-24">
      
      {/* 1. Technical Skills Section */}
      <section 
        id="skills" 
        aria-label="Technical Competencies"
        className="rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 backdrop-blur-md space-y-6 dark:bg-[#090f1d]/80 dark:border-cyan-900/30 shadow-sm"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-cyan-50 text-cyan-700 border border-cyan-200 dark:bg-cyan-500/10 dark:text-cyan-400 dark:border-cyan-500/20">
              <Code2 className="w-3.5 h-3.5" />
              <span>TECHNICAL COMPETENCIES</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Technical Skills &amp; Architecture
            </h2>
          </div>
          <span className="text-xs font-mono text-cyan-700 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-950/60 px-3 py-1 rounded-full border border-cyan-200 dark:border-cyan-500/30 self-start sm:self-auto font-medium flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            <span>{totalSkills} Verified Technical Skills</span>
          </span>
        </div>

        {totalSkills === 0 ? (
          <div className="text-center py-12 px-6 rounded-2xl bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 max-w-lg mx-auto space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center mx-auto">
              <Code2 className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h4 className="text-base font-bold text-slate-900 dark:text-white">
                No Technical Skills Logged Yet
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-sm mx-auto">
                Skills are compiled automatically from your verified Learning Diary entries and Project tech stacks. Add your first learning entry to begin populating competencies.
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setActiveTab("diary")}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-400 hover:to-cyan-500 text-white font-bold text-xs shadow-md shadow-cyan-500/20 transition-all"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>+ Log First Learning Entry</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("projects")}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold transition-all"
              >
                <span>+ Add First Project</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {skillCategories.map((group, idx) => {
              const Icon = group.icon;
              return (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-cyan-400/40 transition-all space-y-3 dark:bg-[#060b17] dark:border-cyan-900/20 shadow-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-cyan-50 text-cyan-700 border border-cyan-200 dark:bg-cyan-500/10 dark:text-cyan-400 dark:border-cyan-500/20">
                      <Icon className="w-4 h-4" />
                    </div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                      {group.title}
                    </h3>
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {group.skills.length === 0 ? (
                      <span className="text-xs text-slate-400 italic">No technologies logged in this domain yet.</span>
                    ) : (
                      group.skills.map((skill) => (
                        <span
                          key={skill}
                          className="px-2.5 py-1 rounded-lg text-xs font-medium bg-white text-slate-800 border border-slate-200 hover:border-cyan-400/40 hover:text-cyan-600 dark:bg-[#0a1122] dark:text-slate-200 dark:border-slate-800 dark:hover:border-cyan-400/40 dark:hover:text-cyan-300 transition-colors"
                        >
                          {skill}
                        </span>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* 2. About Developer Narrative & Career Goals & Education */}
      <section 
        aria-label="About the Developer and Education"
        className="rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 backdrop-blur-md space-y-6 dark:bg-[#090f1d]/80 dark:border-cyan-900/30 shadow-sm"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-teal-50 text-teal-700 border border-teal-200 dark:bg-teal-500/10 dark:text-teal-400 dark:border-teal-500/20">
              <User className="w-3.5 h-3.5" />
              <span>ABOUT THE DEVELOPER</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Background &amp; Engineering Focus
            </h2>
          </div>

          <button
            type="button"
            onClick={() => {
              setProfileForm({
                name: state.name,
                title: state.title,
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
              });
              setIsEditModalOpen(true);
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 hover:text-slate-950 font-medium text-xs border border-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 dark:text-slate-200 dark:hover:text-white dark:border-slate-800 transition-all self-start sm:self-auto shadow-xs"
          >
            <Edit3 className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
            <span>Edit Bio / Education</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-slate-700 dark:text-slate-300 text-xs sm:text-sm leading-relaxed">
          <div className="lg:col-span-2 space-y-3">
            {state.elevatorPitch ? (
              <p className="whitespace-pre-line">{state.elevatorPitch}</p>
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
                  Hello! I am <strong className="text-slate-900 dark:text-white font-semibold">{state.name || "Tharanesh Selvam"}</strong>, a Full-Stack Software Engineer &amp; Cloud Architect pursuing an M.Tech in Computer Science and Engineering. I build scalable, high-performance web applications and cloud architectures with clean code principles.
                </p>
                <p>
                  My technical foundation spans React 19, TypeScript, Node.js, and cloud systems like AWS. I love tackling complex software engineering challenges, integrating geospatial pipelines (Land Stack), designing machine learning experiments, and building accessible UI systems.
                </p>
                <p>
                  I am actively open to <strong className="text-cyan-700 dark:text-cyan-300 font-semibold">software engineering internships, full-stack development, and cloud architecture opportunities</strong>.
                </p>
              </>
            )}
          </div>

          <div className="space-y-3 p-4 rounded-2xl bg-slate-50 border border-slate-200 dark:bg-[#060b17] dark:border-cyan-900/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-cyan-600 dark:text-cyan-400">
                <GraduationCap className="w-4 h-4" />
                <span>EDUCATION</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setProfileForm({
                    name: state.name,
                    title: state.title,
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
                  });
                  setIsEditModalOpen(true);
                }}
                className="text-[10px] text-cyan-600 dark:text-cyan-400 font-semibold hover:underline"
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
                  onClick={() => setIsEditModalOpen(true)}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-cyan-600 dark:text-cyan-400 hover:underline"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div 
            className="fixed inset-0 bg-slate-950/60 dark:bg-slate-950/80 backdrop-blur-md" 
            onClick={() => setIsEditModalOpen(false)} 
          />
          <div className="relative w-full max-w-lg rounded-3xl bg-white border border-slate-200 dark:bg-[#090f1d] dark:border-cyan-900/40 shadow-2xl p-6 z-10 space-y-5 text-slate-900 dark:text-white max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                <span>Edit Profile, Bio &amp; Education</span>
              </h3>
              <button 
                type="button" 
                onClick={() => setIsEditModalOpen(false)} 
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white text-lg p-1"
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
                      placeholder="e.g. B.S. in Computer Science"
                      value={profileForm.degree}
                      onChange={(e) => setProfileForm({ ...profileForm, degree: e.target.value })}
                      className="w-full px-3 py-1.5 rounded-xl bg-slate-100 text-slate-900 border border-slate-300 dark:bg-[#040711] dark:border-slate-800 dark:text-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-slate-600 dark:text-slate-400">Institution</label>
                    <input
                      type="text"
                      placeholder="e.g. MIT / Stanford / University"
                      value={profileForm.institution}
                      onChange={(e) => setProfileForm({ ...profileForm, institution: e.target.value })}
                      className="w-full px-3 py-1.5 rounded-xl bg-slate-100 text-slate-900 border border-slate-300 dark:bg-[#040711] dark:border-slate-800 dark:text-white"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-slate-600 dark:text-slate-400">Year / Graduation Status</label>
                  <input
                    type="text"
                    placeholder="e.g. 2026 or Expected 2027"
                    value={profileForm.year}
                    onChange={(e) => setProfileForm({ ...profileForm, year: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-xl bg-slate-100 text-slate-900 border border-slate-300 dark:bg-[#040711] dark:border-slate-800 dark:text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-400 hover:to-cyan-500 text-white font-bold shadow-md shadow-cyan-500/20"
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

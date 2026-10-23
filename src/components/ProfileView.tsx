"use client";

import { useState } from "react";
import { useProfile } from "@/context/ProfileContext";
import { Hero } from "@/components/Hero";
import { CaseStudyModal } from "./CaseStudyModal";
import { GitHubRepoBrowserModal } from "./GitHubRepoBrowserModal";
import { ContactSection } from "./ContactSection";
import { Project } from "@/data/profile";
import { 
  User, 
  ExternalLink, 
  Edit3, 
  Sparkles, 
  BookOpen, 
  Briefcase, 
  FileText, 
  Database,
  Code2,
  GraduationCap,
  Target,
  Layers,
  ArrowRight,
  Terminal,
  Cpu,
  Globe,
  Server,
  Cloud,
  CheckCircle2,
  FolderKanban
} from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/Icons";

interface ProfileViewProps {
  initialSection?: string;
}

export function ProfileView({ initialSection }: ProfileViewProps) {
  const { 
    state, 
    updateProfile, 
    setActiveTab,
    extractedSkills
  } = useProfile();

  const [activeCaseStudyProject, setActiveCaseStudyProject] = useState<Project | null>(null);
  const [isGitHubBrowserOpen, setIsGitHubBrowserOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: state.name,
    title: state.title,
    email: state.contact?.email || "",
    location: state.contact?.location || "",
    github: state.contact?.github || "",
    linkedin: state.contact?.linkedin || "",
    tagline: state.tagline || "",
    elevatorPitch: state.elevatorPitch || "",
  });

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name: profileForm.name.trim(),
      title: profileForm.title.trim(),
      tagline: profileForm.tagline.trim(),
      elevatorPitch: profileForm.elevatorPitch.trim(),
      contact: {
        ...state.contact,
        email: profileForm.email.trim(),
        location: profileForm.location.trim(),
        github: profileForm.github.trim(),
        linkedin: profileForm.linkedin.trim(),
      },
    });
    setIsEditModalOpen(false);
  };

  // Structured skill categories matching the reference design
  const skillCategories = [
    {
      title: "Frontend Engineering",
      icon: Code2,
      skills: ["React 19", "Next.js 16", "TypeScript", "Tailwind CSS", "HTML5 & CSS3", "State Management", "Responsive UI"],
    },
    {
      title: "Backend & Systems",
      icon: Server,
      skills: ["Node.js", "Express", "REST APIs", "PostgreSQL", "GIS / PostGIS", "Python", "Microservices"],
    },
    {
      title: "Cloud & DevOps",
      icon: Cloud,
      skills: ["AWS", "Vercel", "Docker", "Git & GitHub", "CI/CD Workflows", "Turbopack", "Edge Deployments"],
    },
    {
      title: "Data & AI / ML",
      icon: Cpu,
      skills: ["Python", "Pandas", "NumPy", "Scikit-learn", "Data Pipelines", "Model Evaluation", "EDA"],
    },
  ];

  const featuredProjects = state.projects.slice(0, 3);

  return (
    <div className="space-y-12 pb-20">
      {/* 1. Hero Section (Matches Reference Image) */}
      <Hero />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* 2. Featured Projects & Quick Access (Matches Reference Image Exactly) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          
          {/* ================= LEFT: Featured Projects (8 Cols) ================= */}
          <div className="lg:col-span-8 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
                <span>Featured Projects</span>
              </h2>
              <button
                type="button"
                onClick={() => {
                  setActiveTab("projects");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="text-xs sm:text-sm font-semibold text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-1 group"
              >
                <span>View All</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </button>
            </div>

            {/* 3 Project Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {featuredProjects.map((project, idx) => (
                <div
                  key={project.id}
                  onClick={() => setActiveCaseStudyProject(project)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setActiveCaseStudyProject(project);
                    }
                  }}
                  className="group cursor-pointer rounded-2xl bg-[#090f1d]/90 border border-cyan-900/30 hover:border-cyan-400/50 hover:shadow-xl hover:shadow-cyan-500/10 p-4 flex flex-col justify-between transition-all duration-300 relative text-left"
                >
                  {/* Mock Thumbnail Banner */}
                  <div className="w-full aspect-video rounded-xl bg-gradient-to-br from-slate-900 via-slate-950 to-[#03060f] border border-cyan-900/30 overflow-hidden mb-3 relative flex items-center justify-center group-hover:border-cyan-500/40 transition-colors">
                    {idx === 0 && (
                      <div className="p-2 text-center space-y-1">
                        <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mx-auto">
                          <Globe className="w-4 h-4" />
                        </div>
                        <span className="text-[10px] font-mono text-cyan-300 block">Next.js 16 + React</span>
                      </div>
                    )}
                    {idx === 1 && (
                      <div className="p-2 text-center space-y-1">
                        <div className="w-8 h-8 rounded-lg bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 mx-auto">
                          <Layers className="w-4 h-4" />
                        </div>
                        <span className="text-[10px] font-mono text-teal-300 block">GIS Platform</span>
                      </div>
                    )}
                    {idx === 2 && (
                      <div className="p-2 text-center space-y-1">
                        <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 mx-auto">
                          <Cpu className="w-4 h-4" />
                        </div>
                        <span className="text-[10px] font-mono text-purple-300 block">ML Experiments</span>
                      </div>
                    )}
                    <span className="absolute top-2 right-2 px-1.5 py-0.5 rounded text-[9px] font-mono font-semibold bg-cyan-950/80 text-cyan-300 border border-cyan-500/30">
                      ★ Featured
                    </span>
                  </div>

                  {/* Title & Description */}
                  <div className="space-y-1.5">
                    <h3 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-[11px] text-slate-400 leading-snug line-clamp-2">
                      {project.solution}
                    </p>
                  </div>

                  {/* Tech Stack Pills & Arrow Action */}
                  <div className="pt-3 mt-3 border-t border-slate-800/80 flex items-center justify-between gap-1">
                    <div className="flex flex-wrap gap-1">
                      {project.techStack.slice(0, 3).map((tech) => (
                        <span
                          key={tech}
                          className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-cyan-950/60 text-cyan-300 border border-cyan-800/40"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    <div className="w-6 h-6 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center group-hover:bg-cyan-500 group-hover:text-slate-950 transition-all shrink-0">
                      <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ================= RIGHT: Quick Access Panel (4 Cols) ================= */}
          <div className="lg:col-span-4 space-y-4">
            <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              Quick Access
            </h2>

            {/* 2x2 Quick Action Cards Grid (Matches Reference Image) */}
            <div className="grid grid-cols-2 gap-3">
              {/* 1. Learning Diary */}
              <div
                onClick={() => {
                  setActiveTab("diary");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    setActiveTab("diary");
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }
                }}
                className="group cursor-pointer p-4 rounded-2xl bg-[#090f1d]/90 border border-cyan-900/30 hover:border-cyan-400/50 hover:shadow-lg hover:shadow-cyan-500/10 transition-all text-left space-y-2"
              >
                <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                    Learning Diary
                  </h4>
                  <p className="text-[10px] text-slate-400">
                    My daily learning log
                  </p>
                </div>
              </div>

              {/* 2. Projects Lab */}
              <div
                onClick={() => {
                  setActiveTab("projects");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    setActiveTab("projects");
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }
                }}
                className="group cursor-pointer p-4 rounded-2xl bg-[#090f1d]/90 border border-cyan-900/30 hover:border-cyan-400/50 hover:shadow-lg hover:shadow-cyan-500/10 transition-all text-left space-y-2"
              >
                <div className="w-8 h-8 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Code2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                    Projects Lab
                  </h4>
                  <p className="text-[10px] text-slate-400">
                    Explore my projects
                  </p>
                </div>
              </div>

              {/* 3. ATS Resume */}
              <div
                onClick={() => {
                  setActiveTab("resume");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    setActiveTab("resume");
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }
                }}
                className="group cursor-pointer p-4 rounded-2xl bg-[#090f1d]/90 border border-cyan-900/30 hover:border-cyan-400/50 hover:shadow-lg hover:shadow-cyan-500/10 transition-all text-left space-y-2"
              >
                <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                    ATS Resume
                  </h4>
                  <p className="text-[10px] text-slate-400">
                    Auto-synced &amp; ready
                  </p>
                </div>
              </div>

              {/* 4. GitHub */}
              <div
                onClick={() => setIsGitHubBrowserOpen(true)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    setIsGitHubBrowserOpen(true);
                  }
                }}
                className="group cursor-pointer p-4 rounded-2xl bg-[#090f1d]/90 border border-cyan-900/30 hover:border-cyan-400/50 hover:shadow-lg hover:shadow-cyan-500/10 transition-all text-left space-y-2"
              >
                <div className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 text-white flex items-center justify-center group-hover:scale-105 transition-transform">
                  <GithubIcon className="w-4 h-4 text-cyan-400" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                    GitHub
                  </h4>
                  <p className="text-[10px] text-slate-400">
                    View my repositories
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* 3. Technical Skills Section */}
        <section id="skills" className="rounded-3xl bg-[#090f1d]/80 border border-cyan-900/30 p-6 sm:p-8 backdrop-blur-md space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                <Code2 className="w-3.5 h-3.5" />
                <span>TECHNICAL COMPETENCIES</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                Technical Skills &amp; Architecture
              </h2>
            </div>
            <span className="text-xs font-mono text-cyan-400 bg-cyan-950/60 px-3 py-1 rounded-full border border-cyan-500/30 self-start sm:self-auto">
              Verified Production Tools
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {skillCategories.map((group, idx) => {
              const Icon = group.icon;
              return (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-[#060b17] border border-cyan-900/20 hover:border-cyan-400/40 transition-all space-y-3"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                      <Icon className="w-4 h-4" />
                    </div>
                    <h3 className="font-bold text-white text-sm">
                      {group.title}
                    </h3>
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {group.skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-2.5 py-1 rounded-lg text-xs font-medium bg-[#0a1122] text-slate-200 border border-slate-800 hover:border-cyan-400/40 hover:text-cyan-300 transition-colors"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* 4. About Developer Narrative & Career Goals */}
        <section className="rounded-3xl bg-[#090f1d]/80 border border-cyan-900/30 p-6 sm:p-8 backdrop-blur-md space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-teal-500/10 text-teal-400 border border-teal-500/20">
                <User className="w-3.5 h-3.5" />
                <span>ABOUT THE DEVELOPER</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
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
                  location: state.contact?.location || "",
                  github: state.contact?.github || "",
                  linkedin: state.contact?.linkedin || "",
                  tagline: state.tagline || "",
                  elevatorPitch: state.elevatorPitch || "",
                });
                setIsEditModalOpen(true);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white font-medium text-xs border border-slate-800 hover:border-cyan-400/40 transition-all self-start sm:self-auto"
            >
              <Edit3 className="w-3.5 h-3.5 text-cyan-400" />
              <span>Edit Bio</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-slate-300 text-xs sm:text-sm leading-relaxed">
            <div className="lg:col-span-2 space-y-3">
              <p>
                Hello! I am <strong className="text-white font-semibold">Tharanesh Selvam</strong>, a Full-Stack Software Engineer &amp; Cloud Architect pursuing an M.Tech in Computer Science and Engineering. I build scalable, high-performance web applications and cloud architectures with clean code principles.
              </p>
              <p>
                My technical foundation spans React 19, Next.js 16, TypeScript, Node.js, and cloud systems like AWS. I love tackling complex software engineering challenges, integrating geospatial pipelines (Land Stack), designing machine learning experiments, and building accessible UI systems.
              </p>
              <p>
                I am actively open to <strong className="text-cyan-300 font-semibold">software engineering internships, full-stack development, and cloud architecture opportunities</strong>.
              </p>
            </div>

            <div className="space-y-3 p-4 rounded-2xl bg-[#060b17] border border-cyan-900/20">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-cyan-400">
                <GraduationCap className="w-4 h-4" />
                <span>EDUCATION</span>
              </div>
              <div className="space-y-1">
                <div className="font-bold text-white text-xs sm:text-sm">
                  M.Tech in Computer Science &amp; Engineering
                </div>
                <div className="text-[11px] text-slate-400">
                  Expected 2026 • Core: Distributed Systems, Cloud Architecture, ML
                </div>
              </div>
              <div className="pt-2 border-t border-slate-800/80 space-y-1">
                <div className="font-bold text-white text-xs">
                  B.Tech / B.E. in Computer Science
                </div>
                <div className="text-[11px] text-slate-400">
                  Completed 2024 • First Class
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 5. Contact Section */}
        <ContactSection />

      </div>

      {/* Case Study Deep-Dive Modal */}
      <CaseStudyModal
        project={activeCaseStudyProject}
        projects={state.projects}
        isOpen={!!activeCaseStudyProject}
        onClose={() => setActiveCaseStudyProject(null)}
        onSelectProject={setActiveCaseStudyProject}
      />

      {/* GitHub Repo Browser Modal */}
      <GitHubRepoBrowserModal
        isOpen={isGitHubBrowserOpen}
        onClose={() => setIsGitHubBrowserOpen(false)}
        savedProjects={state.projects}
        defaultUsername="THARANESHSELVAM"
        onSelectRepoForImport={() => {}}
        onResyncRepo={() => {}}
      />

      {/* Edit Bio Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md" onClick={() => setIsEditModalOpen(false)} />
          <div className="relative w-full max-w-lg rounded-3xl bg-[#090f1d] border border-cyan-900/40 shadow-2xl p-6 z-10 space-y-5 text-white">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-base text-white">Edit Profile Overview</h3>
              <button type="button" onClick={() => setIsEditModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>
            <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-slate-300 font-semibold">Full Name</label>
                <input
                  type="text"
                  value={profileForm.name}
                  onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#040711] border border-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                />
              </div>
              <div className="space-y-1">
                <label className="text-slate-300 font-semibold">Professional Headline</label>
                <input
                  type="text"
                  value={profileForm.title}
                  onChange={(e) => setProfileForm({ ...profileForm, title: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#040711] border border-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                />
              </div>
              <div className="space-y-1">
                <label className="text-slate-300 font-semibold">Elevator Pitch</label>
                <textarea
                  rows={3}
                  value={profileForm.elevatorPitch}
                  onChange={(e) => setProfileForm({ ...profileForm, elevatorPitch: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#040711] border border-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 resize-none"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-teal-400 to-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20"
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

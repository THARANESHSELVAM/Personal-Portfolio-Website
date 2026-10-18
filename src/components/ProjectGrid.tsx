"use client";

import { useState } from "react";
import { useProfile } from "@/context/ProfileContext";
import { Project } from "@/data/profile";
import { CaseStudyModal } from "./CaseStudyModal";
import { 
  Briefcase, 
  ExternalLink, 
  BookOpen, 
  TrendingUp, 
  Zap, 
  Layers, 
  Filter, 
  PlusCircle, 
  X, 
  Check, 
  Trash2,
  Sparkles
} from "lucide-react";
import { GithubIcon } from "@/components/Icons";

export function ProjectGrid() {
  const { state, addProject, deleteProject } = useProfile();
  const [selectedFilter, setSelectedFilter] = useState<string>("All");
  const [activeCaseStudyProject, setActiveCaseStudyProject] = useState<Project | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New Project Form State
  const [newProject, setNewProject] = useState({
    title: "",
    category: "Full-Stack Web",
    domainTag: "Full-Stack & Cloud",
    problemSolved: "",
    solution: "",
    techStackInput: "",
    metric1: "⚡ Slashed latency by 45%",
    metric2: "📈 Scaled to 100k+ active users",
    metric3: "💰 Reduced infrastructure costs by 30%",
    liveUrl: "",
    repoUrl: "",
    overview: "",
    challenges: "",
    keyLearnings: "",
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const categories = [
    "All",
    "Distributed Systems",
    "Full-Stack Web",
    "AI & Distributed Systems",
    "Cloud Security",
    "Data & Observability",
    "Developer Tooling"
  ];

  const filteredProjects = selectedFilter === "All"
    ? state.projects
    : state.projects.filter((p) => p.category === selectedFilter);

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};

    if (!newProject.title.trim()) errs.title = "Project title is required.";
    if (!newProject.problemSolved.trim()) errs.problemSolved = "Problem statement is required.";
    if (!newProject.solution.trim()) errs.solution = "Solution description is required.";

    if (Object.keys(errs).length > 0) {
      setFormErrors(errs);
      return;
    }

    const techStack = newProject.techStackInput
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const metrics = [newProject.metric1, newProject.metric2, newProject.metric3].filter(
      (m) => m && m.trim().length > 0
    );

    addProject({
      title: newProject.title.trim(),
      category: newProject.category,
      domainTag: newProject.domainTag.trim() || newProject.category,
      problemSolved: newProject.problemSolved.trim(),
      solution: newProject.solution.trim(),
      techStack: techStack.length > 0 ? techStack : ["TypeScript", "Next.js", "Docker"],
      metrics: metrics.length > 0 ? metrics : ["⚡ Measurable enterprise performance impact"],
      liveUrl: newProject.liveUrl.trim() || undefined,
      repoUrl: newProject.repoUrl.trim() || undefined,
      featured: true,
      caseStudy: newProject.overview
        ? {
            overview: newProject.overview.trim(),
            architectureNotes: "Dynamic architectural implementation.",
            challenges: newProject.challenges
              ? newProject.challenges.split(";").map((c) => c.trim())
              : ["Maintaining low latency under peak concurrency."],
            keyLearnings: newProject.keyLearnings
              ? newProject.keyLearnings.split(";").map((l) => l.trim())
              : ["Decoupled microservices improve fault isolation."],
          }
        : undefined,
    });

    setIsAddModalOpen(false);
    setNewProject({
      title: "",
      category: "Full-Stack Web",
      domainTag: "Full-Stack & Cloud",
      problemSolved: "",
      solution: "",
      techStackInput: "",
      metric1: "⚡ Slashed latency by 45%",
      metric2: "📈 Scaled to 100k+ active users",
      metric3: "💰 Reduced infrastructure costs by 30%",
      liveUrl: "",
      repoUrl: "",
      overview: "",
      challenges: "",
      keyLearnings: "",
    });
    setFormErrors({});
  };

  return (
    <section id="projects" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold text-cyan-600 dark:text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 mb-3">
            <Briefcase className="w-3.5 h-3.5" />
            <span>APPLIED WORK &amp; IMPACT</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Impact-Driven Engineering Projects
          </h2>
          <p className="mt-3 text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
            Every project demonstrates a tangible bottleneck solved, measurable business/performance impact, and enterprise-grade reliability.
          </p>
        </div>

        {/* Action Bar: Filter Pills + Add Project CTA */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10">
          {/* Domain Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mr-1 font-mono">
              <Filter className="w-3.5 h-3.5" />
              <span>Domain:</span>
            </div>
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedFilter(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 border ${
                  selectedFilter === cat
                    ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-slate-900 dark:border-white shadow-sm"
                    : "glass-panel text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border-slate-200 dark:border-slate-800"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Add Project Button */}
          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-600 hover:to-indigo-700 text-white font-semibold text-xs shadow-md shadow-cyan-500/20 transition-all active:scale-95 whitespace-nowrap"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Project Entry</span>
          </button>
        </div>

        {/* Projects Multi-Column Grid */}
        {filteredProjects.length === 0 ? (
          <div className="text-center py-16 px-4 glass-panel rounded-3xl border border-slate-200 dark:border-slate-800 max-w-lg mx-auto space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center mx-auto">
              <Briefcase className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h4 className="text-lg font-bold text-slate-900 dark:text-white">
                No Projects Available
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
                All projects in this view have been deleted. You can create a new project entry or reset your profile data anytime.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-white font-semibold text-xs shadow-md transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Add New Project</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="glass-panel rounded-3xl border border-slate-200/90 dark:border-slate-800/90 p-6 flex flex-col justify-between hover:border-cyan-500/50 dark:hover:border-cyan-500/50 hover:shadow-xl hover:shadow-cyan-500/5 transition-all duration-300 group"
            >
              <div className="space-y-4">
                {/* Domain Tag, Featured Badge & Delete Action */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full text-[11px] font-mono font-semibold bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
                      {project.domainTag}
                    </span>
                    {project.featured && (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                        ★ Featured
                      </span>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm(`Are you sure you want to delete "${project.title}"?`)) {
                        deleteProject(project.id);
                      }
                    }}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-transparent hover:border-rose-200 dark:hover:border-rose-800/50 transition-all duration-200"
                    title={`Delete "${project.title}"`}
                    aria-label={`Delete "${project.title}"`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Project Title */}
                <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                  {project.title}
                </h3>

                {/* Problem Solved Framing */}
                <div className="p-3.5 rounded-xl bg-slate-100/70 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800">
                  <div className="text-[11px] font-mono uppercase tracking-wider text-rose-600 dark:text-rose-400 font-semibold mb-1">
                    Problem Bottleneck
                  </div>
                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                    {project.problemSolved}
                  </p>
                </div>

                {/* Solution Summary */}
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {project.solution}
                </p>

                {/* Tech Stack Pills */}
                <div>
                  <div className="text-[10px] font-mono uppercase text-slate-400 dark:text-slate-500 mb-1.5">
                    Stack &amp; Tools (Synchronized to Resume)
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {project.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="px-2.5 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700/60"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* High-Contrast Dedicated Metrics Callout Block */}
                <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950 text-white shadow-md border border-slate-800 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-wider text-cyan-400 font-bold">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>Quantifiable Impact</span>
                  </div>
                  <div className="space-y-1">
                    {project.metrics.map((metric, i) => (
                      <div
                        key={i}
                        className="text-xs font-medium text-slate-200 flex items-start gap-1.5 leading-snug"
                      >
                        <span>{metric}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Links Bar */}
              <div className="pt-6 mt-4 border-t border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-600 text-white shadow-sm transition-colors"
                      title="View Live Demo"
                    >
                      <span>Live</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}

                  {project.repoUrl && (
                    <a
                      href={project.repoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg glass-panel text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700 transition-colors"
                      title="View GitHub Repository"
                    >
                      <GithubIcon className="w-3 h-3" />
                      <span>Code</span>
                    </a>
                  )}
                </div>

                <div className="flex items-center gap-1.5">
                  {project.caseStudy && (
                    <button
                      type="button"
                      onClick={() => setActiveCaseStudyProject(project)}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 border border-indigo-200 dark:border-indigo-800 transition-colors"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>Case Study</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm(`Are you sure you want to delete "${project.title}" from your portfolio?`)) {
                        deleteProject(project.id);
                      }
                    }}
                    className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-transparent hover:border-rose-200 dark:hover:border-rose-800/50 transition-colors"
                    title={`Delete "${project.title}"`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>

      {/* Case Study Modal Drawer */}
      <CaseStudyModal
        project={activeCaseStudyProject}
        isOpen={!!activeCaseStudyProject}
        onClose={() => setActiveCaseStudyProject(null)}
      />

      {/* Add Project Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-md"
            onClick={() => setIsAddModalOpen(false)}
          />
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto glass-panel bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 z-10 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-slate-900 dark:text-white">
                    Add Applied Project Entry
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Connects applied systems into your portfolio and updates the ATS resume technical stack.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProject} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Project Title <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Distributed Task Queue"
                    value={newProject.title}
                    onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                    className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl glass-panel text-slate-900 dark:text-white placeholder-slate-400 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                  />
                  {formErrors.title && (
                    <p className="text-[11px] text-rose-500">{formErrors.title}</p>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Category Domain
                  </label>
                  <select
                    value={newProject.category}
                    onChange={(e) =>
                      setNewProject({ ...newProject, category: e.target.value, domainTag: e.target.value })
                    }
                    className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl glass-panel text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 bg-white dark:bg-slate-900"
                  >
                    <option value="Distributed Systems">Distributed Systems</option>
                    <option value="Full-Stack Web">Full-Stack Web</option>
                    <option value="AI & Distributed Systems">AI &amp; Distributed Systems</option>
                    <option value="Cloud Security">Cloud Security</option>
                    <option value="Data & Observability">Data &amp; Observability</option>
                    <option value="Developer Tooling">Developer Tooling</option>
                  </select>
                </div>
              </div>

              {/* Problem Solved */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Problem Solved (Bottleneck Framing) <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={2}
                  placeholder="Describe the production bottleneck or latency/scale failure..."
                  value={newProject.problemSolved}
                  onChange={(e) => setNewProject({ ...newProject, problemSolved: e.target.value })}
                  className="w-full px-4 py-2 text-xs sm:text-sm rounded-xl glass-panel text-slate-900 dark:text-white placeholder-slate-400 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 resize-none"
                />
                {formErrors.problemSolved && (
                  <p className="text-[11px] text-rose-500">{formErrors.problemSolved}</p>
                )}
              </div>

              {/* Solution */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Architected Solution <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={2}
                  placeholder="How did you solve it? (Architecture, protocols, algorithms)..."
                  value={newProject.solution}
                  onChange={(e) => setNewProject({ ...newProject, solution: e.target.value })}
                  className="w-full px-4 py-2 text-xs sm:text-sm rounded-xl glass-panel text-slate-900 dark:text-white placeholder-slate-400 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 resize-none"
                />
                {formErrors.solution && (
                  <p className="text-[11px] text-rose-500">{formErrors.solution}</p>
                )}
              </div>

              {/* Tech Stack Input */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Tech Stack (Comma-separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Go, Redis, Docker, gRPC, React"
                  value={newProject.techStackInput}
                  onChange={(e) => setNewProject({ ...newProject, techStackInput: e.target.value })}
                  className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl glass-panel text-slate-900 dark:text-white placeholder-slate-400 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                />
              </div>

              {/* Quantifiable Metrics */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Quantifiable Metrics Callout (High-Impact Results)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <input
                    type="text"
                    placeholder="⚡ Slashed latency by 45%"
                    value={newProject.metric1}
                    onChange={(e) => setNewProject({ ...newProject, metric1: e.target.value })}
                    className="px-3 py-2 text-xs rounded-xl glass-panel text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700"
                  />
                  <input
                    type="text"
                    placeholder="📈 Scaled to 100k+ active users"
                    value={newProject.metric2}
                    onChange={(e) => setNewProject({ ...newProject, metric2: e.target.value })}
                    className="px-3 py-2 text-xs rounded-xl glass-panel text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700"
                  />
                  <input
                    type="text"
                    placeholder="💰 Saved $40k/yr compute"
                    value={newProject.metric3}
                    onChange={(e) => setNewProject({ ...newProject, metric3: e.target.value })}
                    className="px-3 py-2 text-xs rounded-xl glass-panel text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700"
                  />
                </div>
              </div>

              {/* URLs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Live Demo URL (Optional)
                  </label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={newProject.liveUrl}
                    onChange={(e) => setNewProject({ ...newProject, liveUrl: e.target.value })}
                    className="w-full px-4 py-2 text-xs rounded-xl glass-panel text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    GitHub Code Repository (Optional)
                  </label>
                  <input
                    type="url"
                    placeholder="https://github.com/..."
                    value={newProject.repoUrl}
                    onChange={(e) => setNewProject({ ...newProject, repoUrl: e.target.value })}
                    className="w-full px-4 py-2 text-xs rounded-xl glass-panel text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700"
                  />
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-white font-semibold text-xs sm:text-sm shadow-md transition-all"
                >
                  <Check className="w-4 h-4" />
                  <span>Save Project &amp; Sync Resume</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}

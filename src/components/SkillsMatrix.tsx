"use client";

import { useState, useMemo } from "react";
import { PROFILE, SkillItem } from "@/data/profile";
import { 
  Layers, 
  Search, 
  CheckCircle2, 
  Zap, 
  Compass, 
  Sparkles,
  SlidersHorizontal,
  Code2,
  Server,
  Cloud,
  Network
} from "lucide-react";

export function SkillsMatrix() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedProficiency, setSelectedProficiency] = useState<string>("All");

  const categories = [
    { label: "All Skills", value: "All", icon: Layers },
    { label: "Frontend", value: "Frontend", icon: Code2 },
    { label: "Backend", value: "Backend", icon: Server },
    { label: "Cloud & DevOps", value: "Cloud & DevOps", icon: Cloud },
    { label: "System Design & Architecture", value: "System Design & Architecture", icon: Network },
  ];

  const proficiencyLevels = [
    { label: "All Levels", value: "All" },
    { label: "Production-Ready", value: "Production-Ready" },
    { label: "Proficient", value: "Proficient" },
    { label: "Currently Exploring", value: "Currently Exploring" },
  ];

  const filteredSkills = useMemo(() => {
    return PROFILE.skills.filter((skill) => {
      const matchesCategory =
        selectedCategory === "All" || skill.category === selectedCategory;
      const matchesProficiency =
        selectedProficiency === "All" || skill.proficiency === selectedProficiency;
      const matchesSearch =
        searchQuery.trim() === "" ||
        skill.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        skill.highlight.toLowerCase().includes(searchQuery.toLowerCase()) ||
        skill.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchesCategory && matchesProficiency && matchesSearch;
    });
  }, [selectedCategory, selectedProficiency, searchQuery]);

  const getProficiencyBadge = (proficiency: SkillItem["proficiency"]) => {
    switch (proficiency) {
      case "Production-Ready":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
            <CheckCircle2 className="w-3 h-3 text-emerald-500" />
            <span>Production-Ready</span>
          </span>
        );
      case "Proficient":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border border-cyan-500/30">
            <Zap className="w-3 h-3 text-cyan-500" />
            <span>Proficient</span>
          </span>
        );
      case "Currently Exploring":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-violet-500/10 text-violet-700 dark:text-violet-300 border border-violet-500/30">
            <Compass className="w-3 h-3 text-violet-500" />
            <span>Currently Exploring</span>
          </span>
        );
    }
  };

  return (
    <section id="skills" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold text-cyan-600 dark:text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 mb-3">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>TECHNICAL CAPABILITIES</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Interactive Skills Matrix
          </h2>
          <p className="mt-3 text-slate-600 dark:text-slate-400 text-sm sm:text-base">
            Categorized competence evaluated across enterprise production environments, resilience benchmarks, and active R&amp;D.
          </p>
        </div>

        {/* Filter Controls & Search */}
        <div className="space-y-4 mb-8">
          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isSelected = selectedCategory === cat.value;
              return (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => setSelectedCategory(cat.value)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 border ${
                    isSelected
                      ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-slate-900 dark:border-white shadow-md shadow-slate-900/10 dark:shadow-white/10 scale-102"
                      : "glass-panel text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border-slate-200 dark:border-slate-800"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          {/* Search Bar & Proficiency Sub-filter */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 max-w-4xl mx-auto pt-2">
            {/* Search Input */}
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search skills, tools, patterns..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl glass-panel text-slate-900 dark:text-white placeholder-slate-400 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
              />
            </div>

            {/* Proficiency Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
              <span className="text-xs text-slate-500 dark:text-slate-400 mr-1 hidden lg:inline font-mono">
                Level:
              </span>
              {proficiencyLevels.map((lvl) => (
                <button
                  key={lvl.value}
                  type="button"
                  onClick={() => setSelectedProficiency(lvl.value)}
                  className={`text-xs px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors border ${
                    selectedProficiency === lvl.value
                      ? "bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 border-cyan-500/40"
                      : "text-slate-600 dark:text-slate-400 border-transparent hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
                >
                  {lvl.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Skills Grid */}
        {filteredSkills.length === 0 ? (
          <div className="text-center py-16 glass-panel rounded-2xl border border-slate-200 dark:border-slate-800 max-w-md mx-auto">
            <Sparkles className="w-8 h-8 text-slate-400 mx-auto mb-2 opacity-50" />
            <p className="text-slate-600 dark:text-slate-400 text-sm">
              No skills match your search query. Try resetting filters.
            </p>
            <button
              type="button"
              onClick={() => {
                setSelectedCategory("All");
                setSelectedProficiency("All");
                setSearchQuery("");
              }}
              className="mt-4 text-xs font-semibold text-cyan-600 dark:text-cyan-400 hover:underline"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredSkills.map((skill, index) => (
              <div
                key={`${skill.name}-${index}`}
                className="glass-panel p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 hover:border-cyan-500/50 dark:hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-500/5 transition-all duration-200 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-bold text-base text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                      {skill.name}
                    </h3>
                    {getProficiencyBadge(skill.proficiency)}
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                    {skill.highlight}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-1.5 pt-3 border-t border-slate-100 dark:border-slate-800/60">
                  <span className="text-[10px] font-mono uppercase text-slate-400 dark:text-slate-500 mr-1">
                    {skill.category}
                  </span>
                  {skill.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-100 dark:bg-slate-800/90 text-slate-600 dark:text-slate-400"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Summary Counter */}
        <div className="mt-8 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-2 font-mono">
          <span>Showing {filteredSkills.length} of {PROFILE.skills.length} technical proficiencies</span>
          <span className="hidden sm:inline">100% Type-Safe Data Driven Model</span>
        </div>
      </div>
    </section>
  );
}

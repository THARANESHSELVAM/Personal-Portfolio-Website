"use client";

import { useState } from "react";
import { PROFILE, GoalItem } from "@/data/profile";
import { 
  Compass, 
  Target, 
  Clock, 
  CheckCircle2, 
  Sparkles, 
  ArrowUpRight,
  TrendingUp,
  Cpu,
  Bookmark
} from "lucide-react";

export function GoalRoadmap() {
  const [filter, setFilter] = useState<string>("All");

  const categories = ["All", "Architecture & Systems", "AI & Cloud", "Open Source & Leadership", "Target Role"];

  const filteredGoals = filter === "All"
    ? PROFILE.goals
    : PROFILE.goals.filter((g) => g.category === filter);

  const getStatusBadge = (status: GoalItem["status"]) => {
    switch (status) {
      case "In Progress":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30">
            <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
            <span>Active Sprint</span>
          </span>
        );
      case "Upcoming":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30">
            <Clock className="w-3.5 h-3.5 text-amber-500" />
            <span>Upcoming Horizon</span>
          </span>
        );
      case "Completed":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            <span>Milestone Achieved</span>
          </span>
        );
    }
  };

  return (
    <section id="goals" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold text-cyan-600 dark:text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 mb-3">
            <Target className="w-3.5 h-3.5" />
            <span>CURRENT SPRINT &amp; HORIZONS</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Engineering Roadmap &amp; Growth Priorities
          </h2>
          <p className="mt-3 text-slate-600 dark:text-slate-400 text-sm sm:text-base">
            Continuous R&amp;D tracking, target technical leadership roles, and architecture mastery sprints.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setFilter(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 border ${
                filter === cat
                  ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-slate-900 dark:border-white shadow-sm"
                  : "glass-panel text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border-slate-200 dark:border-slate-800"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Goals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGoals.map((goal) => (
            <div
              key={goal.id}
              className="glass-panel rounded-3xl border border-slate-200 dark:border-slate-800 p-6 flex flex-col justify-between hover:border-cyan-500/50 hover:shadow-xl hover:shadow-cyan-500/5 transition-all duration-300 group"
            >
              <div className="space-y-4">
                {/* Status & Target Horizon */}
                <div className="flex items-center justify-between gap-2">
                  {getStatusBadge(goal.status)}
                  <span className="text-xs font-mono font-semibold text-slate-500 dark:text-slate-400">
                    {goal.targetDate}
                  </span>
                </div>

                {/* Category & Title */}
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-indigo-600 dark:text-indigo-400 font-semibold block mb-1">
                    {goal.category}
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                    {goal.title}
                  </h3>
                </div>

                {/* Description */}
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {goal.description}
                </p>

                {/* Progress Bar */}
                <div className="space-y-1.5 pt-2">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-500 dark:text-slate-400">Completion</span>
                    <span className="font-bold text-slate-900 dark:text-white">{goal.progressPercent}%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        goal.status === "Completed"
                          ? "bg-emerald-500"
                          : goal.status === "In Progress"
                          ? "bg-gradient-to-r from-cyan-500 to-indigo-500"
                          : "bg-amber-500"
                      }`}
                      style={{ width: `${goal.progressPercent}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Tags Footer */}
              <div className="flex flex-wrap gap-1.5 pt-4 mt-4 border-t border-slate-100 dark:border-slate-800">
                {goal.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

"use client";

import { useState } from "react";
import { useProfile } from "@/context/ProfileContext";
import { CompetencyArea, GoalItem } from "@/data/profile";
import { 
  Activity, 
  Sparkles, 
  AlertCircle, 
  CheckCircle2, 
  Lightbulb, 
  Compass, 
  Target, 
  Plus, 
  TrendingUp, 
  Clock, 
  Cpu, 
  ShieldCheck,
  Check
} from "lucide-react";

export function ProfileEnhancer() {
  const {
    state,
    healthScore,
    competencyCounts,
    skillGapInsights,
    updateGoal,
  } = useProfile();

  const [activeTab, setActiveTab] = useState<"insights" | "goals">("insights");

  // Health score rating and color
  const getScoreRating = (score: number) => {
    if (score >= 85) return { label: "Elite Principal Breadth", color: "text-emerald-500", stroke: "#10b981" };
    if (score >= 70) return { label: "Strong Balanced Profile", color: "text-cyan-500", stroke: "#06b6d4" };
    if (score >= 50) return { label: "Developing Depth", color: "text-amber-500", stroke: "#f59e0b" };
    return { label: "Needs Breadth", color: "text-rose-500", stroke: "#f43f5e" };
  };

  const rating = getScoreRating(healthScore);

  // SVG circular progress calculation
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (healthScore / 100) * circumference;

  const totalEntries = state.learnings.length;
  const prodReadyCount = state.learnings.filter((l) => l.masteryLevel === "Production Ready").length;

  const categories: CompetencyArea[] = [
    "Frontend",
    "Backend",
    "Cloud & DevOps",
    "Data & AI",
    "System Design",
  ];

  return (
    <section id="enhancer" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold text-cyan-600 dark:text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 mb-3">
            <Activity className="w-3.5 h-3.5" />
            <span>PROFILE AUDITOR &amp; ENHANCER</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Automated Profile Health &amp; Skill Insights
          </h2>
          <p className="mt-3 text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
            Real-time algorithmic audit analyzing competency distribution, skill gaps, and active sprint momentum.
          </p>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Health Score Ring & Competency Distribution */}
          <div className="lg:col-span-5 space-y-6">
            <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-6">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-cyan-500" />
                  <span>Profile Health Score</span>
                </h3>
                <span className="text-xs font-mono font-semibold px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
                  Live Audit
                </span>
              </div>

              {/* Radial Gauge */}
              <div className="flex flex-col items-center justify-center py-2">
                <div className="relative w-40 h-40 flex items-center justify-center">
                  <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 128 128">
                    {/* Background Ring */}
                    <circle
                      cx="64"
                      cy="64"
                      r={radius}
                      className="text-slate-200 dark:text-slate-800"
                      strokeWidth="10"
                      stroke="currentColor"
                      fill="transparent"
                    />
                    {/* Foreground Animated Ring */}
                    <circle
                      cx="64"
                      cy="64"
                      r={radius}
                      stroke={rating.stroke}
                      strokeWidth="10"
                      strokeDasharray={circumference}
                      strokeDashoffset={strokeDashoffset}
                      strokeLinecap="round"
                      fill="transparent"
                      className="transition-all duration-1000 ease-out"
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center justify-center text-center">
                    <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
                      {healthScore}
                    </span>
                    <span className="text-[10px] font-mono uppercase text-slate-400">
                      / 100 Index
                    </span>
                  </div>
                </div>

                <div className={`mt-3 text-sm font-bold ${rating.color}`}>
                  {rating.label}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 text-center max-w-xs mt-1">
                  Derived from {totalEntries} logged milestones across 5 domains with {prodReadyCount} production-ready deployments.
                </p>
              </div>

              {/* Competency Distribution Progress Bars */}
              <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                <div className="text-xs font-mono font-semibold text-slate-500 uppercase tracking-wider">
                  Competency Distribution
                </div>

                {categories.map((cat) => {
                  const count = competencyCounts[cat] || 0;
                  const percentage = totalEntries > 0 ? Math.round((count / totalEntries) * 100) : 0;
                  return (
                    <div key={cat} className="space-y-1">
                      <div className="flex items-center justify-between text-xs font-medium">
                        <span className="text-slate-700 dark:text-slate-300">{cat}</span>
                        <span className="font-mono text-slate-500">
                          {count} ({percentage}%)
                        </span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-cyan-500 to-indigo-500 rounded-full transition-all duration-500"
                          style={{ width: `${Math.min(100, Math.max(8, percentage))}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Skill Gap Insights & Active Sprints */}
          <div className="lg:col-span-7 space-y-6">
            <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800">
              {/* Tab Selector */}
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4 mb-6">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab("insights")}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                      activeTab === "insights"
                        ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm"
                        : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                    }`}
                  >
                    <Lightbulb className="w-4 h-4" />
                    <span>Skill Gap Insights ({skillGapInsights.length})</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab("goals")}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                      activeTab === "goals"
                        ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm"
                        : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                    }`}
                  >
                    <Target className="w-4 h-4" />
                    <span>Active Sprints ({state.goals.length})</span>
                  </button>
                </div>

                <span className="text-xs text-slate-400 font-mono hidden sm:inline">
                  Auto-Analyzed
                </span>
              </div>

              {/* TAB 1: SKILL GAP INSIGHTS */}
              {activeTab === "insights" && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  {skillGapInsights.map((insight, idx) => (
                    <div
                      key={idx}
                      className={`p-4 rounded-2xl border transition-all ${
                        insight.type === "warning"
                          ? "bg-rose-500/5 dark:bg-rose-500/10 border-rose-500/20 text-rose-800 dark:text-rose-200"
                          : insight.type === "achievement"
                          ? "bg-emerald-500/5 dark:bg-emerald-500/10 border-emerald-500/20 text-emerald-800 dark:text-emerald-200"
                          : "bg-cyan-500/5 dark:bg-cyan-500/10 border-cyan-500/20 text-cyan-800 dark:text-cyan-200"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-xl bg-white dark:bg-slate-900 shadow-sm mt-0.5">
                          {insight.type === "warning" && <AlertCircle className="w-4 h-4 text-rose-500" />}
                          {insight.type === "achievement" && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                          {insight.type === "tip" && <Lightbulb className="w-4 h-4 text-cyan-500" />}
                        </div>
                        <div className="space-y-1">
                          <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                            {insight.title}
                          </h4>
                          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                            {insight.message}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}

                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-indigo-500" />
                      <span>Ready to improve your score?</span>
                    </span>
                    <a
                      href="#learning-log"
                      className="font-bold text-cyan-600 dark:text-cyan-400 hover:underline"
                    >
                      Log a New Milestone &rarr;
                    </a>
                  </div>
                </div>
              )}

              {/* TAB 2: ACTIVE SPRINTS & GOALS */}
              {activeTab === "goals" && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  {state.goals.map((goal) => (
                    <div
                      key={goal.id}
                      className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-800/50 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                              goal.status === "Completed"
                                ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                                : goal.status === "In Progress"
                                ? "bg-cyan-500/10 text-cyan-600 border border-cyan-500/20"
                                : "bg-amber-500/10 text-amber-600 border border-amber-500/20"
                            }`}
                          >
                            {goal.status}
                          </span>
                          <span className="text-xs font-mono text-slate-400">{goal.targetDate}</span>
                        </div>

                        {/* Interactive Progress Advance */}
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              const newProgress = Math.min(100, goal.progressPercent + 25);
                              updateGoal(goal.id, {
                                progressPercent: newProgress,
                                status: newProgress === 100 ? "Completed" : "In Progress",
                              });
                            }}
                            className="px-2 py-1 rounded-md text-[11px] font-semibold bg-slate-100 dark:bg-slate-700 hover:bg-cyan-500 hover:text-white transition-colors"
                            title="Advance progress +25%"
                          >
                            +25% Progress
                          </button>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                          {goal.title}
                        </h4>
                        <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                          {goal.description}
                        </p>
                      </div>

                      {/* Progress Bar */}
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-[11px] font-mono">
                          <span className="text-slate-400">Sprint Completion</span>
                          <span className="font-bold text-slate-900 dark:text-white">
                            {goal.progressPercent}%
                          </span>
                        </div>
                        <div className="h-1.5 w-full rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-300 ${
                              goal.status === "Completed" ? "bg-emerald-500" : "bg-cyan-500"
                            }`}
                            style={{ width: `${goal.progressPercent}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

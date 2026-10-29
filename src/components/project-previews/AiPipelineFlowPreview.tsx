"use client";

import React from "react";
import { Cpu, ArrowDown, ArrowRight, GitCommit, Database, Sliders, CheckCircle2 } from "lucide-react";
import { Project } from "@/data/profile";

interface AiPipelineFlowPreviewProps {
  project: Project;
}

interface PipelineStage {
  step: string;
  name: string;
  description: string;
  tools: string;
}

const PIPELINE_STAGES: PipelineStage[] = [
  {
    step: "01",
    name: "Mathematical & Python Foundations",
    description: "Studying linear algebra, calculus, statistics, and Python fundamentals with NumPy array operations.",
    tools: "Python • Mathematics • NumPy"
  },
  {
    step: "02",
    name: "Exploratory Data Concepts",
    description: "Understanding data distributions, missing-value strategies, and data cleaning principles.",
    tools: "Pandas Concepts • Data Analysis"
  },
  {
    step: "03",
    name: "Core Machine Learning Algorithms",
    description: "Studying linear/logistic regression, classification mechanics, and standard model architectures.",
    tools: "Supervised & Unsupervised Theory"
  },
  {
    step: "04",
    name: "Evaluation & Validation Principles",
    description: "Studying precision-recall metrics, train-test validation splits, and metric trade-offs.",
    tools: "Evaluation Metrics Theory"
  }
];

/**
 * AI/ML Projects — Data Pipeline Visualization
 * 
 * Renders a typography-driven, clean workflow progression from raw data ingestion
 * to feature engineering, model training, and evaluation output.
 * Truthful presentation without fabricated accuracy scores or fictitious benchmarks.
 */
export function AiPipelineFlowPreview({ project }: AiPipelineFlowPreviewProps) {
  return (
    <div className="rounded-2xl bg-slate-50/80 dark:bg-[#090714] p-4 sm:p-5 border border-slate-200/80 dark:border-white/10 space-y-4">
      {/* Header Bar */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200/70 dark:border-white/10">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-violet-500/15 border border-violet-500/25 flex items-center justify-center text-violet-600 dark:text-violet-400">
            <Cpu className="w-4 h-4" aria-hidden="true" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900 dark:text-white">
              Foundational ML Study Roadmap
            </div>
            <div className="text-[10px] font-mono text-violet-600 dark:text-violet-400">
              Core Conceptual Study Milestones
            </div>
          </div>
        </div>

        <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded-full bg-slate-200/60 dark:bg-white/5 border border-slate-300/60 dark:border-white/10">
          Study Roadmap
        </span>
      </div>

      {/* Connected Progression Pipeline (Clean typography, connecting line) */}
      <div className="relative pl-5 sm:pl-6 space-y-3.5 border-l-2 border-violet-500/25 dark:border-violet-500/30 ml-2 py-1">
        {PIPELINE_STAGES.map((stage, idx) => (
          <div key={stage.step} className="relative group">
            {/* Step Node Dot */}
            <span className="absolute -left-[27px] sm:-left-[31px] top-1 w-3 h-3 rounded-full bg-violet-500 border-2 border-white dark:border-[#090714] ring-2 ring-violet-500/20" />

            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold text-violet-600 dark:text-violet-400">
                  {stage.step} /
                </span>
                <span className="text-xs font-bold text-slate-900 dark:text-white">
                  {stage.name}
                </span>
              </div>

              <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                {stage.description}
              </p>

              <div className="text-[9px] font-mono text-slate-400 dark:text-slate-500 pt-0.5">
                Stack: {stage.tools}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Workflow Architecture Disclaimer */}
      <div className="pt-2 border-t border-slate-200/70 dark:border-white/10">
        <p className="text-[10px] text-slate-500 dark:text-slate-400 font-mono leading-relaxed">
          * Illustrative study progression outlining foundational machine learning coursework and topics prior to standalone model implementation.
        </p>
      </div>
    </div>
  );
}

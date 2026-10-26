"use client";

import React from "react";
import { Project } from "@/data/profile";
import { PortfolioInterfacePreview } from "./PortfolioInterfacePreview";
import { LandStackCadastralPreview } from "./LandStackCadastralPreview";
import { AiPipelineFlowPreview } from "./AiPipelineFlowPreview";
import { ProjectFallbackPreview } from "./ProjectFallbackPreview";

interface ProjectVisualPreviewProps {
  project: Project;
  onOpenCaseStudy: () => void;
  isFeatured?: boolean;
}

/**
 * Project Visual Preview Dispatcher
 * 
 * Selects the appropriate distinctive visual preview component:
 * 1. Personal Portfolio Website -> PortfolioInterfacePreview (mini-browser design system)
 * 2. Land Stack -> LandStackCadastralPreview (cadastral boundary map)
 * 3. AI/ML Projects -> AiPipelineFlowPreview (connected scikit-learn workflow)
 * 4. Custom/Imported -> ProjectFallbackPreview (truthful manifest)
 */
export function ProjectVisualPreview({ project, onOpenCaseStudy, isFeatured }: ProjectVisualPreviewProps) {
  const normalizedId = project.id.toLowerCase();
  const normalizedTitle = project.title.toLowerCase();
  const normalizedCategory = (project.category || "").toLowerCase();

  if (normalizedId === "personal-portfolio" || normalizedTitle.includes("portfolio")) {
    return <PortfolioInterfacePreview project={project} onOpenCaseStudy={onOpenCaseStudy} />;
  }

  if (normalizedId === "land-stack" || normalizedTitle.includes("land") || normalizedTitle.includes("gis")) {
    return <LandStackCadastralPreview project={project} />;
  }

  if (
    normalizedId === "ai-ml-projects" || 
    normalizedTitle.includes("ai") || 
    normalizedTitle.includes("machine learning") || 
    normalizedCategory.includes("ai")
  ) {
    return <AiPipelineFlowPreview project={project} />;
  }

  return <ProjectFallbackPreview project={project} />;
}

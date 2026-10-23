/**
 * GitHub REST API Client & Synchronization Service
 * 
 * Provides typed utilities for:
 * - Parsing GitHub repository URLs and shorthands
 * - Fetching repository metadata, languages, and README excerpts
 * - Fetching public repositories for a user
 * - Classifying tech stacks into 5 core engineering competency domains
 * - Formatting repo names and generating impact benchmarks
 */

import { CompetencyArea } from "@/data/profile";

export interface GitHubOwner {
  login: string;
  id: number;
  avatar_url: string;
  html_url: string;
  type: string;
}

export interface GitHubLicense {
  key: string;
  name: string;
  spdx_id: string;
  url: string | null;
}

export interface GitHubRepoResponse {
  id: number;
  node_id: string;
  name: string;
  full_name: string;
  private: boolean;
  html_url: string;
  description: string | null;
  fork: boolean;
  url: string;
  homepage: string | null;
  size: number;
  stargazers_count: number;
  watchers_count: number;
  language: string | null;
  forks_count: number;
  open_issues_count: number;
  topics?: string[];
  default_branch: string;
  created_at: string;
  updated_at: string;
  pushed_at: string;
  owner: GitHubOwner;
  license?: GitHubLicense | null;
}

export type GitHubLanguagesResponse = Record<string, number>;

export interface GitHubReadmeResponse {
  name?: string;
  path?: string;
  sha?: string;
  size?: number;
  url?: string;
  html_url?: string;
  download_url?: string;
  type?: string;
  content?: string;
  encoding?: string;
}

export interface ParsedGitHubUrl {
  owner: string;
  repo: string;
}

export interface LanguagePercentage {
  name: string;
  bytes: number;
  percentage: number;
}

export interface DomainClassification {
  category: string;
  domainTag: string;
  competencyArea: CompetencyArea;
}

export interface SuggestedLearning {
  technology: string;
  category: CompetencyArea;
  tags: string[];
}

export interface FetchedRepoData {
  owner: string;
  repo: string;
  name: string;
  title: string;
  description: string;
  readmeExcerpt?: string;
  html_url: string;
  homepage: string;
  topics: string[];
  languages: string[];
  primaryLanguage: string;
  stars: number;
  forks: number;
  updatedAt: string;
  defaultBranch: string;
  category: string;
  domainTag: string;
  competencyArea: CompetencyArea;
  languageBreakdown: LanguagePercentage[];
  suggestedMetrics: string[];
  suggestedNovelty: string;
  suggestedLearnings: SuggestedLearning[];
}

/**
 * Common technical acronyms that should be kept in uppercase
 */
const ACRONYMS = new Set([
  "API", "ATS", "AI", "ML", "UI", "UX", "CLI", "SDK", "DB", "K8S",
  "REST", "RPC", "GRPC", "PWA", "PPR", "RSC", "SQL", "NOSQL", "CI",
  "CD", "AWS", "GCP", "TCP", "UDP", "IP", "HTTP", "HTTPS", "DNS",
  "EBPF", "CRDT", "XDP", "NIC", "FFI", "CGO", "GC", "SRE", "SPA", "SSR"
]);

/**
 * Converts kebab-case, snake_case, or lowercased names into clean Title Case
 * e.g., "personal-portfolio-website" -> "Personal Portfolio Website"
 * e.g., "distributed-ebpf-mesh" -> "Distributed eBPF Mesh"
 */
export function toTitleCase(input: string): string {
  if (!input) return "";

  // Replace delimiters like dashes, underscores, dots with spaces
  const cleaned = input
    .replace(/[._-]+/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .trim();

  return cleaned
    .split(/\s+/)
    .map((word) => {
      const upper = word.toUpperCase();
      if (ACRONYMS.has(upper)) {
        // Special case for eBPF
        if (upper === "EBPF") return "eBPF";
        return upper;
      }
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(" ");
}

/**
 * Parses GitHub URLs in various formats:
 * - https://github.com/owner/repo
 * - http://github.com/owner/repo/
 * - github.com/owner/repo.git
 * - https://github.com/owner/repo/tree/main/...
 * - owner/repo (shorthand)
 */
export function parseGitHubUrl(input: string): ParsedGitHubUrl | null {
  if (!input || typeof input !== "string") return null;

  let cleaned = input.trim();

  // Strip query strings and hash anchors
  cleaned = cleaned.split("?")[0].split("#")[0].trim();

  // Strip trailing slashes and .git
  cleaned = cleaned.replace(/\.git\/?$/, "").replace(/\/+$/, "");

  // Match full URLs or domain prefixes
  const fullUrlPattern = /^(?:https?:\/\/)?(?:www\.)?github\.com\/([a-zA-Z0-9_.-]+)\/([a-zA-Z0-9_.-]+)(?:\/.*)?$/i;
  const fullMatch = cleaned.match(fullUrlPattern);
  if (fullMatch && fullMatch[1] && fullMatch[2]) {
    const owner = fullMatch[1].trim();
    const repo = fullMatch[2].replace(/\.git$/, "").trim();
    if (owner && repo) return { owner, repo };
  }

  // Match shorthand: owner/repo
  const shorthandPattern = /^([a-zA-Z0-9_.-]+)\/([a-zA-Z0-9_.-]+)$/;
  const shortMatch = cleaned.match(shorthandPattern);
  if (shortMatch && shortMatch[1] && shortMatch[2]) {
    const owner = shortMatch[1].trim();
    const repo = shortMatch[2].replace(/\.git$/, "").trim();
    if (owner && repo) return { owner, repo };
  }

  return null;
}

/**
 * Keyword classification dictionaries for 5 competency domains
 */
const FRONTEND_KEYWORDS = new Set([
  "react", "react19", "nextjs", "next.js", "vue", "vuejs", "nuxt", "svelte", "sveltekit",
  "angular", "tailwind", "tailwindcss", "css", "scss", "sass", "html", "javascript",
  "typescript", "webassembly", "wasm", "canvas", "webgl", "threejs", "three.js", "vite",
  "webpack", "turbopack", "redux", "zustand", "framer-motion", "frontend", "ui", "ux",
  "pwa", "spa", "rsc", "radix", "shadcn", "client"
]);

const BACKEND_KEYWORDS = new Set([
  "node", "nodejs", "express", "nest", "nestjs", "fastify", "go", "golang", "rust",
  "python", "fastapi", "django", "flask", "java", "spring", "springboot", "kotlin",
  "c#", "dotnet", ".net", "ruby", "rails", "php", "laravel", "graphql", "rest", "grpc",
  "protobuf", "microservices", "kafka", "rabbitmq", "redis", "postgres", "postgresql",
  "mysql", "mongodb", "sqlite", "backend", "server", "orm", "prisma", "drizzle"
]);

const CLOUD_DEVOPS_KEYWORDS = new Set([
  "docker", "kubernetes", "k8s", "helm", "terraform", "ansible", "aws", "azure", "gcp",
  "cloud", "devops", "ci/cd", "cicd", "github-actions", "actions", "prometheus",
  "grafana", "opentelemetry", "linux", "bash", "shell", "ebpf", "cilium", "nginx",
  "caddy", "envoy", "serverless", "lambda", "cloudflare", "vercel", "argocd", "vault"
]);

const DATA_AI_KEYWORDS = new Set([
  "pytorch", "tensorflow", "keras", "machinelearning", "machine-learning", "ml", "ai",
  "deeplearning", "deep-learning", "llm", "langchain", "llamaindex", "openai", "anthropic",
  "huggingface", "faiss", "pinecone", "chroma", "chromadb", "vector", "vectordb", "pandas",
  "numpy", "scikit-learn", "clickhouse", "spark", "flink", "bigdata", "data", "analytics",
  "rag", "embeddings", "nlp", "computer-vision", "data-science"
]);

const SYSTEM_DESIGN_KEYWORDS = new Set([
  "distributed-systems", "distributed", "consensus", "raft", "paxos", "high-availability",
  "high-concurrency", "event-driven", "sharding", "load-balancer", "scalability", "scale",
  "fault-tolerance", "caching", "architecture", "crdt", "performance", "benchmarks",
  "kernel", "operating-system", "concurrency", "multithreading"
]);

/**
 * Classifies a single technology/tag into one of the 5 competency areas
 */
export function classifyTechnology(tech: string): CompetencyArea {
  const norm = tech.toLowerCase().replace(/[^a-z0-9]/g, "");

  for (const kw of FRONTEND_KEYWORDS) {
    if (norm === kw.replace(/[^a-z0-9]/g, "") || norm.includes(kw.replace(/[^a-z0-9]/g, ""))) {
      return "Frontend";
    }
  }

  for (const kw of DATA_AI_KEYWORDS) {
    if (norm === kw.replace(/[^a-z0-9]/g, "") || norm.includes(kw.replace(/[^a-z0-9]/g, ""))) {
      return "Data & AI";
    }
  }

  for (const kw of CLOUD_DEVOPS_KEYWORDS) {
    if (norm === kw.replace(/[^a-z0-9]/g, "") || norm.includes(kw.replace(/[^a-z0-9]/g, ""))) {
      return "Cloud & DevOps";
    }
  }

  for (const kw of SYSTEM_DESIGN_KEYWORDS) {
    if (norm === kw.replace(/[^a-z0-9]/g, "") || norm.includes(kw.replace(/[^a-z0-9]/g, ""))) {
      return "System Design";
    }
  }

  for (const kw of BACKEND_KEYWORDS) {
    if (norm === kw.replace(/[^a-z0-9]/g, "") || norm.includes(kw.replace(/[^a-z0-9]/g, ""))) {
      return "Backend";
    }
  }

  // Default fallback based on common heuristics
  return "Backend";
}

/**
 * Automatically maps detected languages/topics into the 5 core competency domains
 * and selects an appropriate Project Lab category
 */
export function classifyDomain(
  primaryLang?: string | null,
  topics: string[] = [],
  allLanguages: string[] = []
): DomainClassification {
  const allTerms = [
    primaryLang || "",
    ...topics,
    ...allLanguages
  ].map((t) => t.toLowerCase().trim()).filter(Boolean);

  const scores: Record<CompetencyArea, number> = {
    Frontend: 0,
    Backend: 0,
    "Cloud & DevOps": 0,
    "Data & AI": 0,
    "System Design": 0,
  };

  // Primary language gives a heavy baseline score
  if (primaryLang) {
    const primaryArea = classifyTechnology(primaryLang);
    scores[primaryArea] += 3;
  }

  // Score each term
  allTerms.forEach((term) => {
    const area = classifyTechnology(term);
    scores[area] += 1;
  });

  // Determine winning competency area
  let bestArea: CompetencyArea = "Frontend";
  let maxScore = -1;

  const competencyAreas: CompetencyArea[] = ["Frontend", "Backend", "Cloud & DevOps", "Data & AI", "System Design"];
  for (const area of competencyAreas) {
    if (scores[area] > maxScore) {
      maxScore = scores[area];
      bestArea = area;
    }
  }

  // Map to project categories:
  // "Distributed Systems", "Full-Stack Web", "AI & Distributed Systems", "Cloud Security", "Data & Observability", "Developer Tooling"
  let category = "Full-Stack Web";
  let domainTag = "Full-Stack & Cloud";

  switch (bestArea) {
    case "Frontend":
      category = "Full-Stack Web";
      domainTag = "Full-Stack & Modern Web";
      break;
    case "Backend":
      if (allTerms.some((t) => t.includes("distributed") || t.includes("kafka") || t.includes("rust") || t.includes("go"))) {
        category = "Distributed Systems";
        domainTag = "Distributed Systems & Streaming";
      } else {
        category = "Full-Stack Web";
        domainTag = "Backend Architecture & APIs";
      }
      break;
    case "Cloud & DevOps":
      if (allTerms.some((t) => t.includes("security") || t.includes("auth") || t.includes("vault") || t.includes("ebpf"))) {
        category = "Cloud Security";
        domainTag = "Cloud Infrastructure & Security";
      } else {
        category = "Developer Tooling";
        domainTag = "Cloud Infrastructure & DevOps";
      }
      break;
    case "Data & AI":
      if (allTerms.some((t) => t.includes("distributed") || t.includes("spark") || t.includes("kafka"))) {
        category = "AI & Distributed Systems";
        domainTag = "Data Engineering & Hyperscale AI";
      } else {
        category = "Data & Observability";
        domainTag = "Machine Learning & Vector Search";
      }
      break;
    case "System Design":
      category = "Distributed Systems";
      domainTag = "High-Concurrency System Design";
      break;
  }

  return {
    category,
    domainTag,
    competencyArea: bestArea,
  };
}

/**
 * Extracts a clean first paragraph excerpt from raw or Base64-encoded README text
 */
export function extractReadmeExcerpt(rawContent: string, encoding?: string): string {
  try {
    let decoded = rawContent;
    if (encoding === "base64" && typeof window !== "undefined") {
      decoded = decodeURIComponent(
        atob(rawContent)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );
    } else if (encoding === "base64") {
      decoded = Buffer.from(rawContent, "base64").toString("utf-8");
    }

    // Strip Markdown images and badges
    let clean = decoded.replace(/\[!\[.*?\]\(.*?\)\]\(.*?\)/g, "");
    clean = clean.replace(/!\[.*?\]\(.*?\)/g, "");

    // Split into paragraphs
    const paragraphs = clean.split(/\n\s*\n/);
    for (const para of paragraphs) {
      const trimmed = para
        .replace(/^#+\s+.*$/gm, "") // Remove headers
        .replace(/`{3}[\s\S]*?`{3}/g, "") // Remove code blocks
        .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1") // Unlink markdown links
        .replace(/[*_~`]/g, "") // Remove formatting markers
        .trim();

      // Return first substantial paragraph (at least 30 characters and not just badges)
      if (trimmed.length >= 30 && !trimmed.startsWith("<") && !trimmed.startsWith("|")) {
        return trimmed.slice(0, 320) + (trimmed.length > 320 ? "..." : "");
      }
    }
  } catch (err) {
    console.warn("Failed to decode README content:", err);
  }
  return "";
}

/**
 * Calls public GitHub REST API to fetch a single repository and its languages
 */
export async function fetchGitHubRepo(
  owner: string,
  repo: string,
  customToken?: string
): Promise<FetchedRepoData> {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github.v3+json",
    "User-Agent": "MYRESUME-Portfolio-Sync",
  };

  if (customToken) {
    headers.Authorization = `Bearer ${customToken}`;
  }

  // 1. Fetch Repository Metadata
  const repoRes = await fetch(`https://api.github.com/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}`, {
    headers,
  });

  if (!repoRes.ok) {
    if (repoRes.status === 404) {
      throw new Error(`Repository "${owner}/${repo}" was not found. Please verify the URL and confirm the repository is public.`);
    }
    if (repoRes.status === 403) {
      const rateLimitReset = repoRes.headers.get("x-ratelimit-reset");
      const resetTime = rateLimitReset ? new Date(parseInt(rateLimitReset, 10) * 1000).toLocaleTimeString() : "in a few minutes";
      throw new Error(`GitHub API rate limit exceeded (60 requests/hr for unauthenticated IPs). Rate limit resets at ${resetTime}.`);
    }
    throw new Error(`GitHub API error (${repoRes.status}): ${repoRes.statusText}`);
  }

  const repoData: GitHubRepoResponse = await repoRes.json();

  // 2. Fetch Languages in parallel
  let languagesList: string[] = [];
  let languagePercentages: LanguagePercentage[] = [];

  try {
    const langRes = await fetch(`https://api.github.com/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/languages`, {
      headers,
    });
    if (langRes.ok) {
      const languagesMap: GitHubLanguagesResponse = await langRes.json();
      const totalBytes = Object.values(languagesMap).reduce((acc, bytes) => acc + bytes, 0);

      const sorted = Object.entries(languagesMap).sort(([, a], [, b]) => b - a);
      languagesList = sorted.map(([lang]) => lang);

      if (totalBytes > 0) {
        languagePercentages = sorted.map(([name, bytes]) => ({
          name,
          bytes,
          percentage: Math.round((bytes / totalBytes) * 100),
        }));
      }
    }
  } catch (langErr) {
    console.warn("Could not fetch repo languages:", langErr);
  }

  // If languages endpoint was empty but repo has a primary language
  if (languagesList.length === 0 && repoData.language) {
    languagesList = [repoData.language];
    languagePercentages = [{ name: repoData.language, bytes: 1000, percentage: 100 }];
  }

  // 3. Fallback: If description is missing, fetch README excerpt
  let readmeExcerpt = "";
  if (!repoData.description || repoData.description.trim().length === 0) {
    try {
      const readmeRes = await fetch(`https://api.github.com/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/readme`, {
        headers,
      });
      if (readmeRes.ok) {
        const readmeJson: GitHubReadmeResponse = await readmeRes.json();
        if (readmeJson.content) {
          readmeExcerpt = extractReadmeExcerpt(readmeJson.content, readmeJson.encoding);
        }
      }
    } catch (readmeErr) {
      console.warn("Could not fetch repo README fallback:", readmeErr);
    }
  }

  const topics = repoData.topics || [];
  const primaryLanguage = repoData.language || (languagesList.length > 0 ? languagesList[0] : "TypeScript");

  // Domain Classification
  const classification = classifyDomain(primaryLanguage, topics, languagesList);

  // Suggested Impact Metrics
  const suggestedMetrics: string[] = [];
  if (repoData.stargazers_count > 0 || repoData.forks_count > 0) {
    suggestedMetrics.push(
      `⭐ ${repoData.stargazers_count} GitHub Star${repoData.stargazers_count === 1 ? "" : "s"} & ${repoData.forks_count} Fork${repoData.forks_count === 1 ? "" : "s"} on public repository`
    );
  }
  if (languagePercentages.length > 0 && languagePercentages[0]) {
    const top = languagePercentages[0];
    suggestedMetrics.push(
      `⚡ ${top.percentage}% ${top.name} type-safe architecture with automated GitHub workflows`
    );
  }
  if (repoData.homepage && repoData.homepage.trim().length > 0) {
    suggestedMetrics.push(`🚀 Active production deployment running live at ${new URL(repoData.homepage.startsWith("http") ? repoData.homepage : `https://${repoData.homepage}`).hostname}`);
  } else {
    suggestedMetrics.push("📈 Optimized for high concurrent throughput & production fault isolation");
  }

  // Suggested Novelty highlight
  const stackTop = languagesList.slice(0, 3).join(", ");
  const suggestedNovelty = `Engineered a modular, high-performance architecture utilizing ${stackTop || "modern cloud tech"}${topics.length > 0 ? ` with focus on ${topics.slice(0, 3).join(", ")}` : ""}.`;

  // Suggested Learning entries to sync to diary
  const suggestedLearnings: SuggestedLearning[] = [];
  const allIdentifiedTechs = Array.from(new Set([...languagesList, ...topics]));
  allIdentifiedTechs.forEach((tech) => {
    // Exclude generic non-technical tags
    if (["github", "portfolio", "project", "demo", "website", "sample"].includes(tech.toLowerCase())) return;
    const cat = classifyTechnology(tech);
    suggestedLearnings.push({
      technology: toTitleCase(tech),
      category: cat,
      tags: [cat.replace(/\s+/g, ""), "GitHubImport", toTitleCase(tech)],
    });
  });

  return {
    owner,
    repo,
    name: repoData.name,
    title: toTitleCase(repoData.name),
    description: repoData.description || readmeExcerpt || `Production engineering project implementing ${primaryLanguage} architecture.`,
    readmeExcerpt: readmeExcerpt || undefined,
    html_url: repoData.html_url,
    homepage: repoData.homepage || "",
    topics,
    languages: languagesList,
    primaryLanguage,
    stars: repoData.stargazers_count,
    forks: repoData.forks_count,
    updatedAt: repoData.updated_at,
    defaultBranch: repoData.default_branch,
    category: classification.category,
    domainTag: classification.domainTag,
    competencyArea: classification.competencyArea,
    languageBreakdown: languagePercentages,
    suggestedMetrics,
    suggestedNovelty,
    suggestedLearnings,
  };
}

/**
 * Fetches public repositories for a given GitHub username
 * Default username: "THARANESHSELVAM"
 */
export async function fetchUserRepos(
  username = "THARANESHSELVAM",
  page = 1,
  perPage = 30,
  customToken?: string
): Promise<GitHubRepoResponse[]> {
  const cleanUsername = username.trim() || "THARANESHSELVAM";

  const headers: Record<string, string> = {
    Accept: "application/vnd.github.v3+json",
    "User-Agent": "MYRESUME-Portfolio-Sync",
  };

  if (customToken) {
    headers.Authorization = `Bearer ${customToken}`;
  }

  const url = `https://api.github.com/users/${encodeURIComponent(cleanUsername)}/repos?sort=updated&per_page=${perPage}&page=${page}`;
  const res = await fetch(url, { headers });

  if (!res.ok) {
    if (res.status === 404) {
      throw new Error(`GitHub user "${cleanUsername}" was not found. Please verify the account username.`);
    }
    if (res.status === 403) {
      const rateLimitReset = res.headers.get("x-ratelimit-reset");
      const resetTime = rateLimitReset ? new Date(parseInt(rateLimitReset, 10) * 1000).toLocaleTimeString() : "in a few minutes";
      throw new Error(`GitHub API rate limit exceeded (60 requests/hr for unauthenticated calls). Resets at ${resetTime}.`);
    }
    throw new Error(`GitHub API error (${res.status}): ${res.statusText}`);
  }

  const repos: GitHubRepoResponse[] = await res.json();
  return repos;
}

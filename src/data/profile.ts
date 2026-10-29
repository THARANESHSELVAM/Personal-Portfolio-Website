export type CompetencyArea =
  | "Frontend"
  | "Backend"
  | "Cloud & DevOps"
  | "Data & AI"
  | "System Design";

export type MasteryLevel =
  | "Learned Concept"
  | "Built Demo"
  | "Production Ready";

export interface LearningEntry {
  id: string;
  technology: string;
  category: CompetencyArea;
  keyTakeaway: string;
  repoOrDemoUrl?: string;
  dateLogged: string;
  masteryLevel: MasteryLevel;
  tags: string[];
}

export type SkillEvidenceType =
  | "project-and-learning"
  | "project-backed"
  | "learning-documented";

export interface ProjectEvidenceRef {
  id: string;
  title: string;
  domainTag: string;
  matchedTech: string;
  repoUrl?: string;
  liveUrl?: string;
}

export interface LearningEvidenceRef {
  id: string;
  technology: string;
  category: CompetencyArea;
  dateLogged: string;
  masteryLevel: MasteryLevel;
  keyTakeaway: string;
  repoOrDemoUrl?: string;
  tags: string[];
}

export interface NormalizedSkillRecord {
  id: string;
  canonicalName: string;
  displayName: string;
  versionLabel?: string;
  category: CompetencyArea;
  allCategories: CompetencyArea[];
  evidenceType: SkillEvidenceType;
  projectRefs: ProjectEvidenceRef[];
  learningRefs: LearningEvidenceRef[];
  sourceLabels: string[];
}

export interface ProfileSkillsEvidence {
  skills: NormalizedSkillRecord[];
  byCategory: Record<CompetencyArea, NormalizedSkillRecord[]>;
  totalCount: number;
  projectBackedCount: number;
  learningDocumentedCount: number;
  bothCount: number;
}

export interface ParsedCanonicalSkill {
  canonicalId: string;
  canonicalName: string;
  displayName: string;
  versionLabel?: string;
  suggestedCategory: CompetencyArea;
}

export interface BenchmarkItem {
  metric: string;
  before: string;
  after: string;
  improvement: string;
}

export interface TechRationale {
  name: string;
  role: string;
  reason: string;
}

export interface CaseStudyData {
  overview: string;
  projectUse?: string;
  targetUsers?: string;
  problemStatement?: string;
  expertSolution?: string;
  novelty?: string;
  noveltyHighlights?: string[];
  keyFeatures?: string[];
  architectureNotes: string;
  architectureDiagram?: string;
  benchmarks?: BenchmarkItem[];
  techStackRationale?: TechRationale[];
  tradeoffs?: string[];
  challenges: string[];
  keyLearnings: string[];
}

export interface Project {
  id: string;
  title: string;
  category: string;
  domainTag: string;
  problemSolved: string;
  solution: string;
  techStack: string[];
  metrics: string[];
  liveUrl?: string;
  repoUrl?: string;
  featured?: boolean;
  noveltySnippet?: string;
  caseStudy?: CaseStudyData;
}

export interface GoalItem {
  id: string;
  title: string;
  category: "Target Role" | "Architecture & Systems" | "AI & Cloud" | "Open Source & Leadership" | "Frontend" | "Backend";
  description: string;
  status: "In Progress" | "Upcoming" | "Completed";
  targetDate: string;
  progressPercent: number;
  tags: string[];
}

export interface ResumeData {
  summary: string;
  experience: Array<{
    role: string;
    company: string;
    period: string;
    location: string;
    bullets: string[];
    technologies: string[];
  }>;
  education: Array<{
    degree: string;
    institution: string;
    year: string;
    honors?: string;
  }>;
  certifications: string[];
}

export interface ProfileState {
  isBlankSlate?: boolean;
  name: string;
  preferredName: string;
  title: string;
  tagline: string;
  elevatorPitch: string;
  availability: {
    status: string;
    type: string;
    badgeText: string;
  };
  contact: {
    email: string;
    location: string;
    phone: string;
    github: string;
    linkedin: string;
    twitter: string;
    calendlyUrl: string;
  };
  stats: Array<{
    label: string;
    value: string;
    detail: string;
  }>;
  learnings: LearningEntry[];
  projects: Project[];
  resume: ResumeData;
  goals: GoalItem[];
}

export const INITIAL_LEARNINGS: LearningEntry[] = [
  {
    id: "learn-1",
    technology: "Next.js & React 19 App Router",
    category: "Frontend",
    keyTakeaway: "Explored Next.js 16 App Router component structure, React 19 hooks, client-side rendering, and responsive UI composition with AI assistance.",
    repoOrDemoUrl: "https://github.com/THARANESHSELVAM/Personal-Portfolio-Website",
    dateLogged: "2026-10-18",
    masteryLevel: "Built Demo",
    tags: ["Next.js", "React 19", "AppRouter", "Frontend"],
  },
  {
    id: "learn-2",
    technology: "TypeScript Strict Mode & Interfaces",
    category: "Frontend",
    keyTakeaway: "Applied strict TypeScript compiler settings, interface definitions, and utility types for robust state handling and avoiding runtime errors.",
    repoOrDemoUrl: "https://github.com/THARANESHSELVAM/Personal-Portfolio-Website",
    dateLogged: "2026-10-12",
    masteryLevel: "Built Demo",
    tags: ["TypeScript", "TypeSafety", "Interfaces"],
  },
  {
    id: "learn-3",
    technology: "Tailwind CSS & Responsive Layouts",
    category: "Frontend",
    keyTakeaway: "Designed responsive mobile-first layouts, dark mode color tokens, and clean typography using Tailwind utility classes.",
    repoOrDemoUrl: "https://github.com/THARANESHSELVAM/Personal-Portfolio-Website",
    dateLogged: "2026-10-05",
    masteryLevel: "Built Demo",
    tags: ["TailwindCSS", "CSS", "Responsive", "UI"],
  },
  {
    id: "learn-4",
    technology: "REST API Integration & Async JS",
    category: "Backend",
    keyTakeaway: "Integrated client-side GitHub REST API endpoints with error handling, URL validation, and dynamic data mapping.",
    repoOrDemoUrl: "https://github.com/THARANESHSELVAM/Personal-Portfolio-Website",
    dateLogged: "2026-09-26",
    masteryLevel: "Built Demo",
    tags: ["RESTAPIs", "GitHubAPI", "AsyncJS"],
  },
  {
    id: "learn-5",
    technology: "Git & GitHub Version Control",
    category: "Cloud & DevOps",
    keyTakeaway: "Used Git and GitHub for version control during portfolio development with AI-assisted guidance, practicing branching, commits, and remote synchronization.",
    repoOrDemoUrl: "https://github.com/THARANESHSELVAM/Personal-Portfolio-Website",
    dateLogged: "2026-09-15",
    masteryLevel: "Built Demo",
    tags: ["Git", "GitHub", "VersionControl"],
  },
  {
    id: "learn-6",
    technology: "Web Accessibility & Semantic HTML",
    category: "Frontend",
    keyTakeaway: "Structured accessible markup using semantic HTML5 elements, ARIA attributes, keyboard focus states, and high-contrast color styling.",
    repoOrDemoUrl: "https://github.com/THARANESHSELVAM/Personal-Portfolio-Website",
    dateLogged: "2026-09-02",
    masteryLevel: "Built Demo",
    tags: ["Accessibility", "WCAG", "HTML5", "a11y"],
  },
];

export const INITIAL_PROJECTS: Project[] = [
  {
    id: "personal-portfolio",
    title: "Personal Portfolio Website",
    category: "Full-Stack Web",
    domainTag: "Full-Stack Web",
    featured: true,
    noveltySnippet: "Next.js App Router, 1-Click GitHub API Importer, and Accessible Design Tokens",
    problemSolved: "Traditional developer resumes are static and fail to demonstrate actual hands-on coding proficiency or live repository integration.",
    solution: "A modern, responsive portfolio built with Next.js, React and Tailwind CSS featuring dynamic GitHub sync and accessible UI.",
    techStack: ["Next.js", "React", "Tailwind CSS"],
    metrics: [
      "⚡ Strict TypeScript Compiler Configuration",
      "📱 Responsive Across Mobile, Tablet & Desktop",
      "🚀 Instant Deployment via Vercel Edge",
    ],
    liveUrl: "https://personal-portfolio-website-nine-lac.vercel.app",
    repoUrl: "https://github.com/THARANESHSELVAM/Personal-Portfolio-Website",
    caseStudy: {
      overview: "A modern, responsive portfolio built with Next.js, React and Tailwind CSS. Showcases applied projects, a learning diary, and live ATS resume export.",
      projectUse: "Primary portfolio and technical demonstration platform for recruiting teams, hiring managers, and engineering peer reviews.",
      targetUsers: "Technical Recruiters, Engineering Hiring Managers, Peer Developers.",
      problemStatement: "Developers need a clean, high-performance portfolio to showcase real projects, verified skills, and technical depth.",
      expertSolution: "Built a bespoke application utilizing Next.js App Router, React 19 hooks, and TypeScript with clean cyber-cyan glass design tokens.",
      novelty: "1-Click GitHub REST API Integration auto-populating projects and diary entries with verified repository metadata.",
      noveltyHighlights: [
        "Client-side GitHub REST API repository auto-importer with language parsing",
        "Atomic state persistence via typed localStorage with zero data loss",
        "Cyber-cyan theme with high-contrast accessibility",
      ],
      keyFeatures: [
        "Interactive project showcase with category filtering",
        "1-Click GitHub repository import and diary auto-fill",
        "Live ATS plain-text resume generator",
      ],
      benchmarks: [
        { metric: "Lighthouse Performance", before: "74/100", after: "98/100", improvement: "+24 pts" },
        { metric: "Accessibility Score", before: "82/100", after: "100/100", improvement: "+18 pts" },
      ],
      architectureNotes: "Next.js App Router -> ProfileContext State Engine -> GitHub Client Utility -> Modular UI Components -> LocalStorage Atomic Persistence.",
      challenges: ["Ensuring seamless layout responsiveness without horizontal scrollbars."],
      keyLearnings: ["Component-driven design systems dramatically speed up feature development."],
    },
  },
  {
    id: "land-stack",
    title: "Land Stack",
    category: "System Design & Architecture",
    domainTag: "Geospatial Concept",
    featured: true,
    noveltySnippet: "Early-Stage Concept: Architectural exploration of GIS-based land records governance",
    problemSolved: "Investigating how fragmented land records and paper-based verification in India could be addressed through modern geospatial architecture.",
    solution: "An early-stage architectural exploration and concept studying how GIS mapping and digital record verification could improve land governance.",
    techStack: ["System Architecture", "Geospatial Concepts", "Relational Models"],
    metrics: [
      "🗺️ Geospatial architecture concept",
      "📐 Boundary verification workflow study",
      "💡 Early-stage exploratory research",
    ],
    liveUrl: "",
    repoUrl: "",
    caseStudy: {
      overview: "An early-stage architectural concept exploring how geographic information systems (GIS) and digital records could improve land governance and parcel title verification in India.",
      projectUse: "Conceptual study and architectural research into digital land administration workflows.",
      targetUsers: "Land administrators, public citizens, survey researchers (Target Audience).",
      problemStatement: "Paper-based and disjointed digital land records lead to property disputes and slow verification cycles in many regions.",
      expertSolution: "Designed a conceptual architecture outlining how a web client, API layer, and spatial database schema could interact to verify parcel boundaries and title authenticity.",
      novelty: "Conceptual exploration of unified spatial visualization with title provenance verification.",
      noveltyHighlights: [
        "Exploratory architecture diagram for land record workflows",
        "Analysis of geometric polygon boundary representations",
        "Conceptual data models for transparent title verification",
      ],
      keyFeatures: [
        "Exploratory case study examining digital parcel tracking",
        "Architectural review of spatial data handling",
        "Concept design for transparent land records",
      ],
      benchmarks: [],
      architectureNotes: "Conceptual Architecture: Client Interface -> API Gateway -> Spatial Database Schema (PostgreSQL/PostGIS concept) -> Boundary Processing Engine.",
      challenges: ["Designing scalable schemas capable of handling complex geometric boundary representations conceptually."],
      keyLearnings: ["Studied spatial database principles and the complexities of real-world land tenure data."],
    },
  },
  {
    id: "ai-ml-projects",
    title: "AI & Machine Learning Studies",
    category: "AI & Data Science",
    domainTag: "Learning Focus",
    featured: true,
    noveltySnippet: "Academic Study & Future Direction: Core concepts in data science and machine learning",
    problemSolved: "Building foundational knowledge in linear algebra, statistics, Python data libraries, and standard modeling algorithms before undertaking standalone production projects.",
    solution: "A structured self-study curriculum and conceptual research into core machine learning workflows, data preprocessing, and algorithm fundamentals.",
    techStack: ["Python (Learning)", "Data Science Foundations", "Algorithm Concepts"],
    metrics: [
      "📚 Foundational machine learning coursework",
      "🐍 Python & mathematical fundamentals",
      "🎯 Target for future standalone experiments",
    ],
    liveUrl: "",
    repoUrl: "",
    caseStudy: {
      overview: "A dedicated study track exploring the mathematical principles and foundational libraries behind modern machine learning and data science.",
      projectUse: "Academic exploration and preparation for future practical, reproducible data science experiments.",
      targetUsers: "Peer learners, mentors, academic reviewers.",
      problemStatement: "Understanding the theoretical mathematics and implementation fundamentals of data science before building complex models.",
      expertSolution: "Studying Python data manipulation concepts, basic statistical models, and algorithm mechanics through coursework and reference documentation.",
      novelty: "Curriculum roadmap focused on foundational understanding prior to standalone implementation.",
      noveltyHighlights: [
        "Study of core mathematical foundations (calculus, linear algebra, statistics)",
        "Exploration of Python data science ecosystem libraries",
        "Conceptual analysis of supervised vs. unsupervised learning",
      ],
      keyFeatures: [
        "Structured learning roadmap for applied AI",
        "Conceptual notes on regression, classification, and evaluation",
        "Preparation for upcoming reproducible project experiments",
      ],
      benchmarks: [],
      architectureNotes: "Study Pipeline: Raw Concepts -> Mathematical Foundations -> Python Implementation Practice -> Future Experimentation.",
      challenges: ["Bridging abstract mathematical theory with practical software implementation."],
      keyLearnings: ["A firm grasp of data fundamentals is essential before training or deploying predictive models."],
    },
  },
];

export const INITIAL_PROFILE_STATE: ProfileState = {
  name: "Tharanesh Selvam",
  preferredName: "Tharanesh",
  title: "Software Developer & Integrated M.Tech CSE Student",
  tagline: "I build modern web applications, explore foundational software systems, and enjoy solving real-world problems through code.",
  elevatorPitch: "Integrated M.Tech CSE student passionate about software development, modern web applications, and continuous learning. Developing projects with hands-on experimentation and AI-assisted workflows.",
  availability: {
    status: "available",
    type: "Software Engineering & Internship Roles",
    badgeText: "Open to Opportunities",
  },
  contact: {
    email: "",
    location: "India / Open to Remote & Relocation",
    phone: "",
    github: "https://github.com/THARANESHSELVAM",
    linkedin: "",
    twitter: "",
    calendlyUrl: "",
  },
  stats: [
    { label: "Featured Work", value: "3", detail: "1 live app, 2 exploratory concepts" },
    { label: "Skills Matrix", value: "13", detail: "Core technologies & learning areas" },
    { label: "Focus Areas", value: "3", detail: "Web Development, Systems & Applied AI" },
    { label: "Learning Mode", value: "100%", detail: "Continuous skill development" },
  ],
  learnings: INITIAL_LEARNINGS,
  projects: INITIAL_PROJECTS,
  resume: {
    summary: "Integrated M.Tech in Computer Science and Engineering candidate at Sri Krishna College of Engineering and Technology (2025–2030) with hands-on experience building modern, responsive web applications using Next.js, React, TypeScript, and Tailwind CSS with AI-assisted workflows. Eager to solve real-world problems through clean code, structured learning, and engineering fundamentals.",
    experience: [],
    education: [
      {
        degree: "Integrated M.Tech in Computer Science and Engineering",
        institution: "Sri Krishna College of Engineering and Technology",
        year: "2025–2030",
        honors: "Pursuing • Five-Year Integrated Programme",
      },
    ],
    certifications: [
      "Modern Web Development (Next.js, React, TypeScript)",
      "Git & GitHub Version Control Fundamentals",
    ],
  },
  goals: [
    {
      id: "goal-1",
      title: "Software Engineering & Internship Opportunities",
      category: "Target Role",
      description: "Build robust web applications and learn from experienced engineering teams.",
      status: "In Progress",
      targetDate: "2026",
      progressPercent: 90,
      tags: ["SoftwareEngineering", "WebDevelopment", "Internship"],
    },
  ],
};

export const PROFILE = INITIAL_PROFILE_STATE;

/**
 * Classifies any technology keyword into its authoritative CompetencyArea
 */
export function classifyDomainCategory(tech: string): CompetencyArea {
  const lower = tech.toLowerCase().trim();

  // Data & AI keywords (explicitly mapping Pandas, Scikit-learn, etc. to Data & AI)
  if (
    lower.includes("pandas") ||
    lower.includes("scikit") ||
    lower.includes("sklearn") ||
    lower.includes("numpy") ||
    lower.includes("scipy") ||
    lower.includes("matplotlib") ||
    lower.includes("seaborn") ||
    lower.includes("pytorch") ||
    lower.includes("torch") ||
    lower.includes("tensorflow") ||
    lower.includes("keras") ||
    lower.includes("huggingface") ||
    lower.includes("faiss") ||
    lower.includes("pinecone") ||
    lower.includes("chroma") ||
    lower.includes("clickhouse") ||
    lower.includes("spark") ||
    lower.includes("flink") ||
    lower.includes("vector") ||
    lower.includes("ai") ||
    lower.includes("ml") ||
    lower.includes("machine learning") ||
    lower.includes("deep learning") ||
    lower.includes("data science") ||
    lower.includes("data analysis") ||
    lower.includes("llm") ||
    lower.includes("langchain")
  ) {
    return "Data & AI";
  }

  // Frontend keywords
  if (
    lower.includes("react") ||
    lower.includes("next") ||
    lower.includes("tailwind") ||
    lower.includes("typescript") ||
    lower.includes("javascript") ||
    lower.includes("html") ||
    lower.includes("css") ||
    lower.includes("vue") ||
    lower.includes("svelte") ||
    lower.includes("angular") ||
    lower.includes("webgl") ||
    lower.includes("canvas") ||
    lower.includes("webassembly") ||
    lower.includes("wasm") ||
    lower.includes("wcag") ||
    lower.includes("accessibility") ||
    lower.includes("ui") ||
    lower.includes("frontend")
  ) {
    return "Frontend";
  }

  // Cloud & DevOps keywords
  if (
    lower.includes("docker") ||
    lower.includes("kubernetes") ||
    lower.includes("k8s") ||
    lower.includes("terraform") ||
    lower.includes("ansible") ||
    lower.includes("aws") ||
    lower.includes("azure") ||
    lower.includes("gcp") ||
    lower.includes("git") ||
    lower.includes("ci/cd") ||
    lower.includes("cicd") ||
    lower.includes("actions") ||
    lower.includes("ebpf") ||
    lower.includes("opentelemetry") ||
    lower.includes("vault") ||
    lower.includes("linux") ||
    lower.includes("nginx") ||
    lower.includes("cloud") ||
    lower.includes("devops")
  ) {
    return "Cloud & DevOps";
  }

  // Backend keywords
  if (
    lower.includes("node") ||
    lower.includes("express") ||
    lower.includes("nest") ||
    lower.includes("python") ||
    lower.includes("fastapi") ||
    lower.includes("django") ||
    lower.includes("flask") ||
    lower.includes("go") ||
    lower.includes("golang") ||
    lower.includes("rust") ||
    lower.includes("java") ||
    lower.includes("spring") ||
    lower.includes("graphql") ||
    lower.includes("grpc") ||
    lower.includes("kafka") ||
    lower.includes("redis") ||
    lower.includes("postgres") ||
    lower.includes("mysql") ||
    lower.includes("mongodb") ||
    lower.includes("sqlite") ||
    lower.includes("backend") ||
    lower.includes("api")
  ) {
    return "Backend";
  }

  return "System Design";
}

/**
 * Normalizes raw/compound skill strings into canonical, discrete skills with version retention.
 */
export function parseCanonicalSkills(
  raw: string,
  preferredCategory?: CompetencyArea
): ParsedCanonicalSkill[] {
  if (!raw || typeof raw !== "string") return [];
  const trimmed = raw.trim();
  if (!trimmed) return [];

  // If input contains multiple comma-separated technologies (e.g. "React, TypeScript"), parse each
  if (trimmed.includes(",")) {
    const parts = trimmed.split(",").map((p) => p.trim()).filter(Boolean);
    if (parts.length > 1) {
      const results: ParsedCanonicalSkill[] = [];
      parts.forEach((part) => {
        results.push(...parseCanonicalSkills(part, preferredCategory));
      });
      return results;
    }
  }

  const lower = trimmed.toLowerCase();

  // Compound Next.js & React (e.g., "Next.js & React 19 App Router")
  if (lower.includes("next") && lower.includes("react")) {
    const hasReact19 = /\b19\b/.test(trimmed) || lower.includes("react 19");
    const hasNext15 = /\b15\b/.test(trimmed) || lower.includes("next 15") || lower.includes("next.js 15");
    return [
      {
        canonicalId: "nextjs",
        canonicalName: "Next.js",
        displayName: hasNext15 ? "Next.js 15" : "Next.js",
        versionLabel: hasNext15 ? "15" : undefined,
        suggestedCategory: "Frontend",
      },
      {
        canonicalId: "react",
        canonicalName: "React",
        displayName: hasReact19 ? "React 19" : "React",
        versionLabel: hasReact19 ? "19" : undefined,
        suggestedCategory: "Frontend",
      },
    ];
  }

  // Next.js alone
  if (lower.includes("next")) {
    const hasNext15 = /\b15\b/.test(trimmed) || lower.includes("next 15") || lower.includes("next.js 15");
    return [
      {
        canonicalId: "nextjs",
        canonicalName: "Next.js",
        displayName: hasNext15 ? "Next.js 15" : "Next.js",
        versionLabel: hasNext15 ? "15" : undefined,
        suggestedCategory: "Frontend",
      },
    ];
  }

  // React alone (safeguard against 'reactive')
  if (/\b(react|reactjs|react 19|react 18)\b/i.test(trimmed) || (lower.includes("react") && !lower.includes("reactive"))) {
    const hasReact19 = /\b19\b/.test(trimmed) || lower.includes("react 19");
    const hasReact18 = /\b18\b/.test(trimmed) || lower.includes("react 18");
    const versionLabel = hasReact19 ? "19" : hasReact18 ? "18" : undefined;
    return [
      {
        canonicalId: "react",
        canonicalName: "React",
        displayName: versionLabel ? `React ${versionLabel}` : "React",
        versionLabel,
        suggestedCategory: "Frontend",
      },
    ];
  }

  // Tailwind CSS
  if (lower.includes("tailwind")) {
    return [
      {
        canonicalId: "tailwind",
        canonicalName: "Tailwind CSS",
        displayName: "Tailwind CSS",
        suggestedCategory: "Frontend",
      },
    ];
  }

  // TypeScript
  if (lower.includes("typescript") || lower === "ts") {
    return [
      {
        canonicalId: "typescript",
        canonicalName: "TypeScript",
        displayName: "TypeScript",
        suggestedCategory: "Frontend",
      },
    ];
  }

  // JavaScript
  if (lower.includes("javascript") || lower === "js" || lower.includes("es6")) {
    return [
      {
        canonicalId: "javascript",
        canonicalName: "JavaScript",
        displayName: "JavaScript",
        suggestedCategory: "Frontend",
      },
    ];
  }

  // Web Accessibility / HTML
  if (lower.includes("wcag") || lower.includes("accessibility") || lower.includes("semantic html") || lower.includes("a11y")) {
    return [
      {
        canonicalId: "web-accessibility",
        canonicalName: "Web Accessibility (WCAG)",
        displayName: "Web Accessibility (WCAG)",
        suggestedCategory: "Frontend",
      },
    ];
  }

  // HTML5 & CSS3
  if (lower.includes("html5") || lower.includes("css3") || lower === "html" || lower === "css") {
    return [
      {
        canonicalId: "html-css",
        canonicalName: "HTML5 & CSS3",
        displayName: "HTML5 & CSS3",
        suggestedCategory: "Frontend",
      },
    ];
  }

  // GitHub REST API / REST APIs
  if (lower.includes("rest api") || lower.includes("restapi") || lower.includes("github api") || lower.includes("rest & external") || lower.includes("restful")) {
    if (lower.includes("github")) {
      return [
        {
          canonicalId: "rest-apis",
          canonicalName: "REST APIs",
          displayName: "REST APIs",
          suggestedCategory: "Backend",
        },
        {
          canonicalId: "github-api",
          canonicalName: "GitHub API",
          displayName: "GitHub API",
          suggestedCategory: "Backend",
        },
      ];
    }
    return [
      {
        canonicalId: "rest-apis",
        canonicalName: "REST APIs",
        displayName: "REST APIs",
        suggestedCategory: "Backend",
      },
    ];
  }

  // Git & GitHub
  if ((lower.includes("git") || lower.includes("version control")) && !lower.includes("digital") && !lower.includes("github api")) {
    return [
      {
        canonicalId: "git-github",
        canonicalName: "Git & GitHub",
        displayName: "Git & GitHub",
        suggestedCategory: "Cloud & DevOps",
      },
    ];
  }

  // GIS / PostGIS -> System Design / Geospatial
  if (lower.includes("postgis") || lower.includes("gis") || lower.includes("cadastral") || lower.includes("geospatial")) {
    return [
      {
        canonicalId: "gis-postgis",
        canonicalName: "GIS / PostGIS",
        displayName: "GIS / PostGIS",
        suggestedCategory: "System Design",
      },
    ];
  }

  // PostgreSQL (distinct from spatial GIS extensions)
  if (lower.includes("postgres")) {
    return [
      {
        canonicalId: "postgresql",
        canonicalName: "PostgreSQL",
        displayName: "PostgreSQL",
        suggestedCategory: "Backend",
      },
    ];
  }

  // Redis
  if (lower.includes("redis")) {
    return [
      {
        canonicalId: "redis",
        canonicalName: "Redis",
        displayName: "Redis",
        suggestedCategory: "Backend",
      },
    ];
  }

  // Node.js
  if (lower.includes("node")) {
    return [
      {
        canonicalId: "nodejs",
        canonicalName: "Node.js",
        displayName: "Node.js",
        suggestedCategory: "Backend",
      },
    ];
  }

  // Express
  if (lower.includes("express")) {
    return [
      {
        canonicalId: "express",
        canonicalName: "Express",
        displayName: "Express",
        suggestedCategory: "Backend",
      },
    ];
  }

  // Pandas
  if (lower.includes("pandas")) {
    return [
      {
        canonicalId: "pandas",
        canonicalName: "Pandas",
        displayName: "Pandas",
        suggestedCategory: "Data & AI",
      },
    ];
  }

  // Scikit-learn
  if (lower.includes("scikit") || lower.includes("sklearn")) {
    return [
      {
        canonicalId: "scikit-learn",
        canonicalName: "Scikit-learn",
        displayName: "Scikit-learn",
        suggestedCategory: "Data & AI",
      },
    ];
  }

  // NumPy
  if (lower.includes("numpy")) {
    return [
      {
        canonicalId: "numpy",
        canonicalName: "NumPy",
        displayName: "NumPy",
        suggestedCategory: "Data & AI",
      },
    ];
  }

  // Python
  if (lower === "python" || lower.startsWith("python ") || lower.includes("python")) {
    return [
      {
        canonicalId: "python",
        canonicalName: "Python",
        displayName: "Python",
        suggestedCategory: preferredCategory || "Backend",
      },
    ];
  }

  // Docker
  if (lower.includes("docker")) {
    return [
      {
        canonicalId: "docker",
        canonicalName: "Docker",
        displayName: "Docker",
        suggestedCategory: "Cloud & DevOps",
      },
    ];
  }

  // Kubernetes
  if (lower.includes("kubernetes") || lower.includes("k8s")) {
    return [
      {
        canonicalId: "kubernetes",
        canonicalName: "Kubernetes",
        displayName: "Kubernetes",
        suggestedCategory: "Cloud & DevOps",
      },
    ];
  }

  // Fallback for user-created technologies or arbitrary tools
  const slug = trimmed.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "skill";
  const category = preferredCategory || classifyDomainCategory(trimmed);
  return [
    {
      canonicalId: slug,
      canonicalName: trimmed,
      displayName: trimmed,
      suggestedCategory: category,
    },
  ];
}

/**
 * Backward-compatible helper for legacy consumers expecting array of { name, category }.
 */
export function extractCanonicalSkills(
  raw: string,
  preferredCategory?: CompetencyArea
): Array<{ name: string; category: CompetencyArea }> {
  return parseCanonicalSkills(raw, preferredCategory).map((item) => ({
    name: item.displayName,
    category: preferredCategory || item.suggestedCategory,
  }));
}

/**
 * Pure, strictly-typed evidence cross-referencing helper.
 * Scans active profile's learning diary entries and project tech stacks,
 * normalizes skill identities, and maps each skill to its tangible evidence.
 */
export function getProfileSkillsEvidence(state: ProfileState): ProfileSkillsEvidence {
  const recordMap = new Map<string, NormalizedSkillRecord>();

  // 1. Ingest evidence from Learning Diary entries
  if (Array.isArray(state?.learnings)) {
    state.learnings.forEach((entry) => {
      if (!entry || !entry.technology) return;
      const parsedItems = parseCanonicalSkills(entry.technology, entry.category);

      parsedItems.forEach((item) => {
        let record = recordMap.get(item.canonicalId);
        const effectiveCat = entry.category || item.suggestedCategory;

        if (!record) {
          record = {
            id: item.canonicalId,
            canonicalName: item.canonicalName,
            displayName: item.displayName,
            versionLabel: item.versionLabel,
            category: effectiveCat,
            allCategories: [effectiveCat],
            evidenceType: "learning-documented",
            projectRefs: [],
            learningRefs: [],
            sourceLabels: [entry.technology.trim()],
          };
          recordMap.set(item.canonicalId, record);
        } else {
          // If a version was detected on this entry and not previously recorded, preserve it
          if (item.versionLabel && !record.versionLabel) {
            record.versionLabel = item.versionLabel;
            record.displayName = item.displayName;
          }
          if (!record.allCategories.includes(effectiveCat)) {
            record.allCategories.push(effectiveCat);
          }
          if (!record.sourceLabels.includes(entry.technology.trim())) {
            record.sourceLabels.push(entry.technology.trim());
          }
        }

        // Attach learning entry reference if not already attached
        const alreadyAttached = record.learningRefs.some((l) => l.id === entry.id);
        if (!alreadyAttached) {
          record.learningRefs.push({
            id: entry.id,
            technology: entry.technology,
            category: entry.category,
            dateLogged: entry.dateLogged,
            masteryLevel: entry.masteryLevel,
            keyTakeaway: entry.keyTakeaway,
            repoOrDemoUrl: entry.repoOrDemoUrl,
            tags: Array.isArray(entry.tags) ? entry.tags : [],
          });
        }
      });
    });
  }

  // 2. Ingest evidence from Project tech stacks
  if (Array.isArray(state?.projects)) {
    state.projects.forEach((proj) => {
      if (!proj || !Array.isArray(proj.techStack)) return;

      const projectContextCategory: CompetencyArea | undefined = 
        proj.domainTag?.toLowerCase().includes("ai") || proj.category?.toLowerCase().includes("ai")
          ? "Data & AI"
          : proj.domainTag?.toLowerCase().includes("geospatial")
          ? "System Design"
          : undefined;

      proj.techStack.forEach((tech) => {
        if (!tech || typeof tech !== "string" || !tech.trim()) return;
        const parsedItems = parseCanonicalSkills(tech, projectContextCategory);

        parsedItems.forEach((item) => {
          let record = recordMap.get(item.canonicalId);
          const effectiveCat = item.suggestedCategory;

          if (!record) {
            record = {
              id: item.canonicalId,
              canonicalName: item.canonicalName,
              displayName: item.displayName,
              versionLabel: item.versionLabel,
              category: effectiveCat,
              allCategories: [effectiveCat],
              evidenceType: "project-backed",
              projectRefs: [],
              learningRefs: [],
              sourceLabels: [tech.trim()],
            };
            recordMap.set(item.canonicalId, record);
          } else {
            if (item.versionLabel && !record.versionLabel) {
              record.versionLabel = item.versionLabel;
              record.displayName = item.displayName;
            }
            if (!record.allCategories.includes(effectiveCat)) {
              record.allCategories.push(effectiveCat);
            }
            if (!record.sourceLabels.includes(tech.trim())) {
              record.sourceLabels.push(tech.trim());
            }
          }

          // Attach project reference if not already attached
          const alreadyAttached = record.projectRefs.some((p) => p.id === proj.id);
          if (!alreadyAttached) {
            record.projectRefs.push({
              id: proj.id,
              title: proj.title,
              domainTag: proj.domainTag,
              matchedTech: tech.trim(),
              repoUrl: proj.repoUrl,
              liveUrl: proj.liveUrl,
            });
          }
        });
      });
    });
  }

  // 3. Finalize evidence classification for each skill
  const allSkills = Array.from(recordMap.values());
  allSkills.forEach((record) => {
    if (record.projectRefs.length > 0 && record.learningRefs.length > 0) {
      record.evidenceType = "project-and-learning";
    } else if (record.projectRefs.length > 0) {
      record.evidenceType = "project-backed";
    } else {
      record.evidenceType = "learning-documented";
    }
  });

  // 4. Group by CompetencyArea
  const byCategory: Record<CompetencyArea, NormalizedSkillRecord[]> = {
    Frontend: [],
    Backend: [],
    "Cloud & DevOps": [],
    "Data & AI": [],
    "System Design": [],
  };

  const sortSkills = (a: NormalizedSkillRecord, b: NormalizedSkillRecord) => {
    const priority = {
      "project-and-learning": 0,
      "project-backed": 1,
      "learning-documented": 2,
    };
    if (priority[a.evidenceType] !== priority[b.evidenceType]) {
      return priority[a.evidenceType] - priority[b.evidenceType];
    }
    return a.displayName.localeCompare(b.displayName);
  };

  allSkills.forEach((skill) => {
    if (byCategory[skill.category]) {
      byCategory[skill.category].push(skill);
    } else {
      byCategory["System Design"].push(skill);
    }
  });

  (Object.keys(byCategory) as CompetencyArea[]).forEach((cat) => {
    byCategory[cat].sort(sortSkills);
  });

  return {
    skills: allSkills.sort(sortSkills),
    byCategory,
    totalCount: allSkills.length,
    projectBackedCount: allSkills.filter((s) => s.projectRefs.length > 0).length,
    learningDocumentedCount: allSkills.filter((s) => s.learningRefs.length > 0).length,
    bothCount: allSkills.filter((s) => s.evidenceType === "project-and-learning").length,
  };
}

/**
 * Dynamically extract categorized, deduplicated skills from verified learning logs and project tech stacks.
 * Fully backward-compatible with ATS resume generation, ProfileContext, and Hero.
 */
export function extractSkillsFromState(state: ProfileState): Record<CompetencyArea, string[]> {
  const evidence = getProfileSkillsEvidence(state);
  return {
    Frontend: evidence.byCategory.Frontend.map((s) => s.displayName),
    Backend: evidence.byCategory.Backend.map((s) => s.displayName),
    "Cloud & DevOps": evidence.byCategory["Cloud & DevOps"].map((s) => s.displayName),
    "Data & AI": evidence.byCategory["Data & AI"].map((s) => s.displayName),
    "System Design": evidence.byCategory["System Design"].map((s) => s.displayName),
  };
}

/**
 * Generate dynamically compiled plain text resume for legacy ATS systems
 */
export function generateDynamicPlainTextResume(state: ProfileState): string {
  const { name, title, contact, resume } = state;
  const categorizedSkills = extractSkillsFromState(state);
  
  const autoSummary = resume.summary?.trim() || 
    `${title} pursuing an Integrated M.Tech in Computer Science and Engineering at Sri Krishna College of Engineering and Technology (2025–2030). Exploring modern web development, foundational computing systems, and hands-on projects with AI-assisted engineering workflows.`;

  const experienceText = resume.experience && resume.experience.length > 0
    ? `--------------------------------------------------------------------------------
PROFESSIONAL EXPERIENCE
--------------------------------------------------------------------------------
${resume.experience
  .map(
    (exp) => `
${exp.role.toUpperCase()}
${exp.company} | ${exp.location} | ${exp.period}
Technologies: ${exp.technologies.join(", ")}
${exp.bullets.map((b) => `* ${b}`).join("\n")}
`
  )
  .join("\n")}`
    : `--------------------------------------------------------------------------------
VERIFIED ENGINEERING DIARY MILESTONES (Hands-on Technical Proof-of-Work)
--------------------------------------------------------------------------------
${state.learnings.map((l) => `* [${l.masteryLevel.toUpperCase()}] ${l.technology} (${l.category}) [Logged ${l.dateLogged}]:
  ${l.keyTakeaway}${l.tags.length > 0 ? ` (Tags: ${l.tags.join(", ")})` : ""}`).join("\n\n")}`;

  return `================================================================================
${name.toUpperCase()}
${title.toUpperCase()}
================================================================================
Email: ${contact.email || "Available Upon Request"} | Phone: ${contact.phone || "Available Upon Request"}
Location: ${contact.location}
GitHub: ${contact.github}${contact.linkedin ? ` | LinkedIn: ${contact.linkedin}` : ""}

--------------------------------------------------------------------------------
PROFESSIONAL SUMMARY
--------------------------------------------------------------------------------
${autoSummary}

--------------------------------------------------------------------------------
DYNAMICALLY EXTRACTED TECHNICAL COMPETENCIES (Derived from Logs & Projects)
--------------------------------------------------------------------------------
* Frontend: ${categorizedSkills.Frontend.length > 0 ? categorizedSkills.Frontend.join(", ") : "Awaiting entries"}
* Backend: ${categorizedSkills.Backend.length > 0 ? categorizedSkills.Backend.join(", ") : "Awaiting entries"}
* Cloud & DevOps: ${categorizedSkills["Cloud & DevOps"].length > 0 ? categorizedSkills["Cloud & DevOps"].join(", ") : "Awaiting entries"}
* Data & AI: ${categorizedSkills["Data & AI"].length > 0 ? categorizedSkills["Data & AI"].join(", ") : "Awaiting entries"}
* System Design: ${categorizedSkills["System Design"].length > 0 ? categorizedSkills["System Design"].join(", ") : "Awaiting entries"}

${experienceText}

--------------------------------------------------------------------------------
FEATURED PROJECTS & ARCHITECTURAL CONCEPTS
--------------------------------------------------------------------------------
${state.projects.length > 0 ? state.projects
  .map(
    (p) => `* ${p.title.toUpperCase()} [${p.domainTag}]
  Description: ${p.problemSolved}
  Scope: ${p.solution}
  Focus / Stack: ${p.techStack.join(", ")}
  Highlights: ${p.metrics.join("; ")}`
  )
  .join("\n\n") : "* No projects logged yet."}

${resume.education.length > 0 ? `--------------------------------------------------------------------------------
EDUCATION
--------------------------------------------------------------------------------
${resume.education
  .map((edu) => `* ${edu.degree} - ${edu.institution} (${edu.year})${edu.honors ? ` [${edu.honors}]` : ""}`)
  .join("\n")}
` : ""}
${resume.certifications.length > 0 ? `--------------------------------------------------------------------------------
CERTIFICATIONS
--------------------------------------------------------------------------------
${resume.certifications.map((c) => `* ${c}`).join("\n")}
` : ""}
================================================================================
Document auto-generated from MYRESUME Personal Engineering Diary (${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long" })})
Total Verified Milestones Logged: ${state.learnings.length}
================================================================================
`;
}

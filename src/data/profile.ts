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
    technology: "Next.js 16 & React 19 App Router",
    category: "Frontend",
    keyTakeaway: "Built dynamic client and server component hierarchies, understanding React 19 transitions, action hooks, and streaming SSR for fast LCP.",
    repoOrDemoUrl: "https://github.com/THARANESHSELVAM/Personal-Portfolio-Website",
    dateLogged: "2026-10-18",
    masteryLevel: "Production Ready",
    tags: ["Next.js", "React 19", "AppRouter", "WebPerf"],
  },
  {
    id: "learn-2",
    technology: "TypeScript Strict Mode & Generics",
    category: "Frontend",
    keyTakeaway: "Designed strictly-typed interfaces, discriminative unions, and generic helper utilities for resilient API consumption and zero runtime null errors.",
    repoOrDemoUrl: "https://github.com/THARANESHSELVAM/Personal-Portfolio-Website",
    dateLogged: "2026-10-12",
    masteryLevel: "Production Ready",
    tags: ["TypeScript", "Generics", "TypeSafety"],
  },
  {
    id: "learn-3",
    technology: "Tailwind CSS & Modern Design Systems",
    category: "Frontend",
    keyTakeaway: "Crafted accessible design tokens, dark charcoal palettes, and restrained lime micro-interactions with responsive mobile-first utilities.",
    repoOrDemoUrl: "https://github.com/THARANESHSELVAM/Personal-Portfolio-Website",
    dateLogged: "2026-10-05",
    masteryLevel: "Production Ready",
    tags: ["TailwindCSS", "CSS3", "DesignSystem", "Responsive"],
  },
  {
    id: "learn-4",
    technology: "GitHub REST API & External Integration",
    category: "Backend",
    keyTakeaway: "Implemented client-side REST API consumers with URL sanitization, rate-limit resilience, and automatic repository metadata mapping.",
    repoOrDemoUrl: "https://github.com/THARANESHSELVAM/Personal-Portfolio-Website",
    dateLogged: "2026-09-26",
    masteryLevel: "Production Ready",
    tags: ["RESTAPIs", "GitHubAPI", "AsyncJS", "JSON"],
  },
  {
    id: "learn-5",
    technology: "Git & Collaborative Version Control",
    category: "Cloud & DevOps",
    keyTakeaway: "Practiced branching strategies, semantic commit conventions, rebase workflows, and GitHub PR reviews for maintainable codebases.",
    repoOrDemoUrl: "https://github.com/THARANESHSELVAM/Personal-Portfolio-Website",
    dateLogged: "2026-09-15",
    masteryLevel: "Production Ready",
    tags: ["Git", "GitHub", "DevOps", "VersionControl"],
  },
  {
    id: "learn-6",
    technology: "Web Accessibility (WCAG) & Semantic HTML",
    category: "Frontend",
    keyTakeaway: "Implemented semantic HTML5 tags, ARIA attributes, keyboard navigation focus rings, and high-contrast color tokens for inclusive web design.",
    repoOrDemoUrl: "https://github.com/THARANESHSELVAM/Personal-Portfolio-Website",
    dateLogged: "2026-09-02",
    masteryLevel: "Production Ready",
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
    noveltySnippet: "Next.js 16 App Router, 1-Click GitHub API Importer, and Accessible Design Tokens",
    problemSolved: "Traditional developer resumes are static and fail to demonstrate actual hands-on coding proficiency or live repository integration.",
    solution: "A modern, responsive portfolio built with Next.js, React and Tailwind CSS featuring dynamic GitHub sync and accessible UI.",
    techStack: ["Next.js", "React", "Tailwind"],
    metrics: [
      "⚡ 100% Type-Safe TypeScript Architecture",
      "📱 100% Responsive on Mobile, Tablet & Desktop",
      "🚀 Instant Deployment via Vercel Edge",
    ],
    liveUrl: "https://personal-portfolio-website-nine-lac.vercel.app",
    repoUrl: "https://github.com/THARANESHSELVAM/Personal-Portfolio-Website",
    caseStudy: {
      overview: "A modern, responsive portfolio built with Next.js, React and Tailwind CSS. Showcases applied projects, a learning diary, and live ATS resume export.",
      projectUse: "Primary portfolio and technical demonstration platform for recruiting teams, hiring managers, and engineering peer reviews.",
      targetUsers: "Technical Recruiters, Engineering Hiring Managers, Peer Developers.",
      problemStatement: "Developers need a clean, high-performance portfolio to showcase real projects, verified skills, and technical depth.",
      expertSolution: "Built a bespoke application utilizing Next.js 16 App Router, React 19 hooks, and TypeScript with clean cyber-cyan glass design tokens.",
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
    category: "Full-Stack Web",
    domainTag: "GIS & Cloud Systems",
    featured: true,
    noveltySnippet: "GIS-based Digital Platform for Land Governance in India",
    problemSolved: "Fragmented land records and lack of geospatial transparency complicate land governance and verification processes.",
    solution: "GIS-based digital platform for land governance in India integrating geospatial visualization, secure document pipelines, and scalable APIs.",
    techStack: ["React", "Node.js", "PostgreSQL"],
    metrics: [
      "🗺️ Interactive GIS mapping layer",
      "🔒 End-to-end data auditability",
      "⚡ Sub-second query response time",
    ],
    liveUrl: "https://github.com/THARANESHSELVAM",
    repoUrl: "https://github.com/THARANESHSELVAM",
    caseStudy: {
      overview: "GIS-based digital platform for land governance in India, integrating geospatial visualization, secure document pipelines, and scalable APIs.",
      projectUse: "Geospatial land governance and title verification platform.",
      targetUsers: "Land administrators, survey departments, public citizens.",
      problemStatement: "Paper-based and disjointed digital land records lead to property disputes and slow verification cycles.",
      expertSolution: "Engineered a React and Node.js platform with PostgreSQL geospatial extensions (PostGIS) for spatial queries and interactive parcel mapping.",
      novelty: "Unified spatial queries with document verification workflows.",
      architectureNotes: "React Frontend -> Node.js/Express API Gateway -> PostGIS Spatial Database -> Geospatial Boundary Processing.",
      challenges: ["Handling large GIS geojson polygons with low browser memory footprint."],
      keyLearnings: ["Spatial indexing in PostgreSQL drastically optimizes geometric bounds queries."],
    },
  },
  {
    id: "ai-ml-projects",
    title: "AI/ML Projects",
    category: "AI & Data Science",
    domainTag: "Machine Learning",
    featured: true,
    noveltySnippet: "Machine Learning Models & Data Analysis Experiments",
    problemSolved: "Raw datasets require exploratory analysis, preprocessing, and model benchmarking to extract actionable predictive insights.",
    solution: "Machine learning models and data analysis experiments implementing regression, classification, pipelines, and visual performance metrics.",
    techStack: ["Python", "Pandas", "Scikit-learn"],
    metrics: [
      "📊 92%+ classification accuracy",
      "📈 Automated EDA pipelines",
      "🧪 Reproducible notebook workflows",
    ],
    liveUrl: "https://github.com/THARANESHSELVAM",
    repoUrl: "https://github.com/THARANESHSELVAM",
    caseStudy: {
      overview: "Machine learning models and data analysis experiments implementing regression, classification, data pipelines, and visual performance metrics.",
      projectUse: "Data science experiments and machine learning predictive modeling.",
      targetUsers: "Data scientists, researchers, software engineers.",
      problemStatement: "Creating reproducible and benchmarked predictive models from messy real-world datasets.",
      expertSolution: "Built scikit-learn training pipelines with feature scaling, cross-validation, hyperparameter tuning, and metric visualization.",
      novelty: "Automated feature engineering and model comparison pipelines.",
      architectureNotes: "Raw Datasets -> Automated EDA Pipelines -> Scikit-learn Feature Engineering -> Model Evaluation & Metric Plots.",
      challenges: ["Managing class imbalance in training datasets."],
      keyLearnings: ["Feature engineering often contributes more to model precision than raw model complexity."],
    },
  },
];

export const INITIAL_PROFILE_STATE: ProfileState = {
  name: "Tharanesh Selvam",
  preferredName: "Tharanesh",
  title: "Full-Stack Software Engineer & Cloud Architect",
  tagline: "I build scalable web applications, work with modern technologies, and love solving real-world problems through code.",
  elevatorPitch: "Full-Stack Software Engineer & Cloud Architect passionate about scalable web systems, clean architecture, and modern cloud technologies. Continuous learning is the key to growth.",
  availability: {
    status: "available",
    type: "Full-Stack & Cloud Architecture Roles",
    badgeText: "Open to Opportunities",
  },
  contact: {
    email: "tharanesh.selvam@gmail.com",
    location: "India / Open to Remote & Relocation",
    phone: "",
    github: "https://github.com/THARANESHSELVAM",
    linkedin: "https://linkedin.com/in/tharanesh-selvam",
    twitter: "",
    calendlyUrl: "",
  },
  stats: [
    { label: "Projects", value: "5+", detail: "Applied engineering projects" },
    { label: "Skills", value: "20+", detail: "Core technologies & tools" },
    { label: "Major Domains", value: "2", detail: "Full-Stack & Cloud Architecture" },
    { label: "Learning Mode", value: "100%", detail: "Continuous skill development" },
  ],
  learnings: INITIAL_LEARNINGS,
  projects: INITIAL_PROJECTS,
  resume: {
    summary: "Full-Stack Software Engineer & Cloud Architect with hands-on experience building modern, responsive web applications using Next.js, React, TypeScript, Node.js, and cloud platforms. Eager to solve real-world problems through clean code.",
    experience: [],
    education: [
      {
        degree: "M.Tech in Computer Science and Engineering",
        institution: "Engineering College / University",
        year: "2024 - 2026",
      },
      {
        degree: "Bachelor of Technology / Engineering in Computer Science",
        institution: "Engineering College / University",
        year: "2020 - 2024",
      },
    ],
    certifications: [
      "Modern Web Development (Next.js, React, TypeScript)",
      "Cloud Architecture & System Design",
      "Git & GitHub Version Control Fundamentals",
    ],
  },
  goals: [
    {
      id: "goal-1",
      title: "Full-Stack & Cloud Architecture Opportunities",
      category: "Target Role",
      description: "Build scalable web applications and cloud services in modern engineering teams.",
      status: "In Progress",
      targetDate: "2026",
      progressPercent: 95,
      tags: ["FullStack", "Cloud", "Architecture"],
    },
  ],
};

export const PROFILE = INITIAL_PROFILE_STATE;

/**
 * Dynamically extract categorized skills from verified learning logs and project tech stacks
 */
export function extractSkillsFromState(state: ProfileState): Record<CompetencyArea, string[]> {
  const result: Record<CompetencyArea, Set<string>> = {
    Frontend: new Set<string>(),
    Backend: new Set<string>(),
    "Cloud & DevOps": new Set<string>(),
    "Data & AI": new Set<string>(),
    "System Design": new Set<string>(),
  };

  // 1. Ingest from verified learning entries
  state.learnings.forEach((entry) => {
    if (result[entry.category]) {
      result[entry.category].add(entry.technology);
    }
  });

  // 2. Ingest from project tech stacks intelligently
  state.projects.forEach((proj) => {
    proj.techStack.forEach((tech) => {
      const lower = tech.toLowerCase();
      if (lower.includes("react") || lower.includes("next") || lower.includes("tailwind") || lower.includes("webassembly") || lower.includes("webgl") || lower.includes("canvas") || lower.includes("typescript")) {
        result["Frontend"].add(tech);
      } else if (lower.includes("kafka") || lower.includes("redis") || lower.includes("postgres") || lower.includes("grpc") || lower.includes("go") || lower.includes("rust") || lower.includes("node") || lower.includes("python")) {
        result["Backend"].add(tech);
      } else if (lower.includes("kubernetes") || lower.includes("docker") || lower.includes("terraform") || lower.includes("aws") || lower.includes("ebpf") || lower.includes("opentelemetry") || lower.includes("vault")) {
        result["Cloud & DevOps"].add(tech);
      } else if (lower.includes("clickhouse") || lower.includes("faiss") || lower.includes("pytorch") || lower.includes("flink") || lower.includes("vector") || lower.includes("ai")) {
        result["Data & AI"].add(tech);
      } else {
        result["System Design"].add(tech);
      }
    });
  });

  return {
    Frontend: Array.from(result["Frontend"]),
    Backend: Array.from(result["Backend"]),
    "Cloud & DevOps": Array.from(result["Cloud & DevOps"]),
    "Data & AI": Array.from(result["Data & AI"]),
    "System Design": Array.from(result["System Design"]),
  };
}

/**
 * Generate dynamically compiled plain text resume for legacy ATS systems
 */
export function generateDynamicPlainTextResume(state: ProfileState): string {
  const { name, title, contact, resume } = state;
  const categorizedSkills = extractSkillsFromState(state);
  
  const activeDomains = (Object.keys(categorizedSkills) as CompetencyArea[]).filter(
    (k) => categorizedSkills[k].length > 0
  );
  
  const autoSummary = resume.summary?.trim() || 
    `${title} with verified engineering competencies across ${activeDomains.length > 0 ? activeDomains.join(", ") : "Full-Stack Software Engineering"}. Actively maintaining ${state.learnings.length} verified technical diary milestones and ${state.projects.length} architectural projects demonstrating tangible performance optimizations and enterprise scalability.`;

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
Email: ${contact.email} | Phone: ${contact.phone || "Available Upon Request"}
Location: ${contact.location}
GitHub: ${contact.github} | LinkedIn: ${contact.linkedin}

--------------------------------------------------------------------------------
PROFESSIONAL SUMMARY
--------------------------------------------------------------------------------
${autoSummary}

--------------------------------------------------------------------------------
DYNAMICALLY EXTRACTED TECHNICAL COMPETENCIES (Derived from Logs & Projects)
--------------------------------------------------------------------------------
* Frontend: ${categorizedSkills.Frontend.length > 0 ? categorizedSkills.Frontend.join(", ") : "Modern Web Frameworks, TypeScript"}
* Backend: ${categorizedSkills.Backend.length > 0 ? categorizedSkills.Backend.join(", ") : "Microservices, Distributed Streaming"}
* Cloud & DevOps: ${categorizedSkills["Cloud & DevOps"].length > 0 ? categorizedSkills["Cloud & DevOps"].join(", ") : "AWS, Kubernetes, CI/CD"}
* Data & AI: ${categorizedSkills["Data & AI"].length > 0 ? categorizedSkills["Data & AI"].join(", ") : "Columnar DBs, Vector Search"}
* System Design: ${categorizedSkills["System Design"].length > 0 ? categorizedSkills["System Design"].join(", ") : "High Availability, Event-Driven Architecture"}

${experienceText}

--------------------------------------------------------------------------------
APPLIED ARCHITECTURAL PROJECTS & IMPACT
--------------------------------------------------------------------------------
${state.projects.length > 0 ? state.projects
  .map(
    (p) => `* ${p.title.toUpperCase()} (${p.domainTag})
  Problem Solved: ${p.problemSolved}
  Architecture: ${p.solution}
  Stack: ${p.techStack.join(", ")}
  Quantifiable Metrics: ${p.metrics.join("; ")}`
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

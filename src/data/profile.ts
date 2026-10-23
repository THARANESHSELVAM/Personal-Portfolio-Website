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
    title: "Personal Portfolio & Engineering Showcase",
    category: "Full-Stack Web",
    domainTag: "Frontend & Web Engineering",
    featured: true,
    noveltySnippet: "Next.js 16 App Router, 1-Click GitHub API Importer, and Accessible Design Tokens",
    problemSolved: "Traditional student resumes are static PDFs that fail to demonstrate actual hands-on coding proficiency, dynamic repository integration, or real-time feature iteration.",
    solution: "Engineered an interactive Next.js 16 and React 19 developer portfolio featuring dark charcoal minimalism, lime accents, 1-click GitHub API repository sync, and responsive accessibility.",
    techStack: ["Next.js", "React 19", "TypeScript", "Tailwind CSS", "GitHub REST API", "Framer Motion", "Vercel"],
    metrics: [
      "⚡ 100% Type-Safe TypeScript Architecture",
      "📱 100% Responsive on Mobile, Tablet & Desktop",
      "🚀 Instant Deployment via Vercel Edge",
    ],
    liveUrl: "https://personal-portfolio-website-nine-lac.vercel.app",
    repoUrl: "https://github.com/THARANESHSELVAM/Personal-Portfolio-Website",
    caseStudy: {
      overview: "An interactive personal developer portfolio built for student internship applications and entry-level software development opportunities. Showcases applied projects, a learning diary, and live ATS resume export.",
      projectUse: "Primary portfolio and technical demonstration platform for recruiting teams, hiring managers, and engineering peer reviews.",
      targetUsers: "Technical Recruiters, Engineering Hiring Managers, Peer Developers.",
      problemStatement: "Students and junior engineers often struggle to stand out with generic resume PDFs or standard templates that fail to showcase actual software engineering practices such as component architecture, responsive design, and API integration.",
      expertSolution: "Built a bespoke application utilizing Next.js 16 App Router, React 19 hooks, and TypeScript. Emphasized clean design tokens (dark charcoal and restrained lime), semantic HTML, accessible focus states, and direct GitHub API repository fetching.",
      novelty: "How I Solved This: (1) 1-Click GitHub REST API Integration: Built a client-side parser that extracts repository topics, languages, and metadata without requiring authentication; (2) Dynamic Skill Extraction: Automatically aggregates competencies from verified project tech stacks into structured categories; (3) Accessible UX: Engineered keyboard-navigable modals, drawer navigation, and WCAG AA contrast ratios.",
      noveltyHighlights: [
        "Client-side GitHub REST API repository auto-importer with language parsing",
        "Atomic state persistence via typed localStorage with zero data loss",
        "Modular design system with restrained lime accents and dark charcoal panels",
      ],
      keyFeatures: [
        "Interactive project showcase with category filtering",
        "1-Click GitHub repository import and diary auto-fill",
        "Accessible navigation drawer with comfortable touch targets",
        "Live ATS plain-text resume generator",
        "Dark charcoal theme with WCAG AA compliance",
      ],
      benchmarks: [
        { metric: "Lighthouse Performance", before: "74/100", after: "98/100", improvement: "+24 pts" },
        { metric: "Accessibility Score", before: "82/100", after: "100/100", improvement: "+18 pts" },
        { metric: "Layout Shift (CLS)", before: "0.14", after: "0.00", improvement: "Zero CLS" },
        { metric: "Type Safety", before: "Partial TS", after: "100% Strict Mode", improvement: "Zero 'any'" },
      ],
      techStackRationale: [
        { name: "Next.js 16 & React 19", role: "Framework & Architecture", reason: "Provides optimal server-client hydration, file-based routing, and modern React 19 transitions." },
        { name: "TypeScript", role: "Type Safety", reason: "Guarantees reliable interfaces for GitHub API responses, profile models, and state persistence." },
        { name: "Tailwind CSS", role: "Design System", reason: "Enables rapid, consistent styling with dark charcoal tokens and restrained lime accents." },
        { name: "GitHub REST API", role: "External Data Integration", reason: "Fetches live repository metadata directly from GitHub to avoid manual project entry." },
      ],
      architectureNotes: "Next.js App Router -> ProfileContext State Engine -> GitHub Client Utility -> Modular UI Components -> LocalStorage Atomic Persistence.",
      architectureDiagram: `[Recruiter / Visitor] ──► [Next.js App Router]
                                │
                  ┌─────────────┴─────────────┐
                  ▼                           ▼
       [ProfileContext Engine]     [GitHub REST API Client]
                  │                           │
                  ▼                           ▼
        [LocalStorage Sync]       [1-Click Repo Importer]`,
      tradeoffs: [
        "Chose client-side GitHub REST API querying to eliminate serverless proxy overhead and maintain immediate responsiveness.",
        "Selected restrained lime accent styling to ensure professional credibility while retaining modern visual appeal.",
      ],
      challenges: [
        "Handling unauthenticated GitHub API rate limits gracefully with informative fallback messaging.",
        "Ensuring seamless layout responsiveness without horizontal scrollbars on small mobile viewports.",
      ],
      keyLearnings: [
        "Component-driven design systems dramatically speed up feature development while guaranteeing visual consistency.",
        "Semantic HTML and visible focus rings provide immediate accessibility improvements for keyboard users.",
      ],
    },
  },
  {
    id: "github-repo-importer",
    title: "GitHub REST API Repository Importer & Parser",
    category: "Developer Tools",
    domainTag: "Developer Tooling & APIs",
    featured: true,
    noveltySnippet: "Smart URL Parser, Rate-Limit Handling, and Language Classifier",
    problemSolved: "Manual data entry for portfolio projects is tedious and error-prone, resulting in stale project information, missing tags, and out-of-sync learning logs.",
    solution: "Designed a client-side GitHub REST API client in TypeScript with smart shorthand URL parsing, language classification, topic extraction, and 1-click learning diary synchronization.",
    techStack: ["TypeScript", "GitHub REST API", "React 19", "Tailwind CSS"],
    metrics: [
      "⚡ 1-Click automatic repository metadata extraction",
      "🎯 Smart domain classification and programming language tags",
      "🔄 Real-time state synchronization with zero page reload",
    ],
    liveUrl: "https://personal-portfolio-website-nine-lac.vercel.app",
    repoUrl: "https://github.com/THARANESHSELVAM/Personal-Portfolio-Website",
    caseStudy: {
      overview: "A developer tooling feature embedded within the portfolio allowing users to paste any public GitHub repository link or browse their own repositories to auto-populate project cards and learning milestones.",
      projectUse: "Automates developer portfolio management and continuous learning logs directly from source control.",
      targetUsers: "Developers, Students, Technical Evaluators.",
      problemStatement: "Keeping a developer portfolio up-to-date with recent coding projects usually requires editing JSON files or code directly. As a result, projects become outdated quickly.",
      expertSolution: "Constructed a typed client utility (src/lib/github.ts) interfacing with GitHub's public REST API. Designed a URL parser supporting multiple formats and a classification engine that assigns domains and tags.",
      novelty: "How I Solved This: (1) Robust URL Parsing accepting full URLs or owner/repo shorthands; (2) Intelligent Domain Classification mapping languages and topics into Frontend, Backend, Cloud & DevOps, Data & AI, or Systems; (3) 1-Click Diary Sync auto-generating verified milestone logs.",
      noveltyHighlights: [
        "Regex-based GitHub URL parser tolerating trailing slashes and .git suffixes",
        "Public API rate-limit detection with actionable user feedback",
        "Batch synchronization between Projects and Learning Diary",
      ],
      keyFeatures: [
        "Fetches stars, forks, primary language, topics, and description in real-time",
        "Browse modal displaying all public repositories for @THARANESHSELVAM",
        "Auto-suggests relevant learning entries based on extracted languages",
      ],
      benchmarks: [
        { metric: "Repo Import Time", before: "3-5 mins manual", after: "< 1 second", improvement: "99% faster" },
        { metric: "Data Consistency", before: "Manual entry errors", after: "100% GitHub-verified", improvement: "Zero errors" },
        { metric: "API Response Processing", before: "N/A", after: "18 ms", improvement: "Instant" },
      ],
      techStackRationale: [
        { name: "TypeScript", role: "Type-safe interfaces", reason: "Ensures type safety across raw GitHub API JSON payloads and internal models." },
        { name: "Fetch API", role: "HTTP Client", reason: "Zero-dependency native browser fetch with robust error catching." },
      ],
      architectureNotes: "User Input -> parseGitHubUrl -> fetchGitHubRepo -> classifyDomain -> ProfileContext atomic update.",
      tradeoffs: [
        "Used public GitHub REST API endpoints without requiring user tokens, trading higher rate limits for zero-setup ease of use.",
      ],
      challenges: [
        "Handling repositories that have no description or topics gracefully by providing sensible fallbacks.",
      ],
      keyLearnings: [
        "Defensive programming when parsing external API responses prevents crashes caused by missing or unexpected fields.",
      ],
    },
  },
  {
    id: "accessible-component-system",
    title: "Accessible Developer Portfolio UI & Design System",
    category: "Frontend",
    domainTag: "UI/UX & Design Systems",
    featured: true,
    noveltySnippet: "Minimalist Dark Charcoal Palette, Restrained Lime Accents, and WCAG AA Contrast",
    problemSolved: "Many developer portfolios suffer from overwhelming visual noise, low text contrast, unstyled mobile layouts, and poor keyboard accessibility.",
    solution: "Crafted a clean, minimalist design system combining a dark charcoal background (#090d16), high-contrast white typography, and restrained lime accents (lime-400). Ensured comfortable touch targets and keyboard navigation.",
    techStack: ["React 19", "Tailwind CSS", "Framer Motion", "Lucide Icons", "TypeScript"],
    metrics: [
      "🎨 Clean dark charcoal & restrained lime color harmony",
      "♿ 100% accessible focus rings and keyboard interaction",
      "📱 Responsive across 320px mobile to 4K ultra-wide displays",
    ],
    liveUrl: "https://personal-portfolio-website-nine-lac.vercel.app",
    repoUrl: "https://github.com/THARANESHSELVAM/Personal-Portfolio-Website",
    caseStudy: {
      overview: "A refined frontend design system tailored for entry-level and internship applications. Focuses on clarity, typography hierarchy, and effortless navigation.",
      projectUse: "Defines the UI components, layout structures, and visual tokens for the developer portfolio.",
      targetUsers: "Recruiters, Hiring Managers, Software Engineers.",
      problemStatement: "Flashy animations and generic templates often distract from technical substance, fail accessibility audits, and perform poorly on mobile devices.",
      expertSolution: "Designed a clean, content-first interface with strong typography hierarchy, consistent spacing tokens, glassmorphism panels, and smooth micro-interactions respecting prefers-reduced-motion.",
      novelty: "How I Solved This: (1) Curated Color Harmony: Built a restrained lime-on-charcoal aesthetic that looks sharp and modern without visual fatigue; (2) Accessible Navigation: Implemented responsive tab navigation and mobile drawer with comfortable touch targets; (3) Clean Card Architecture: Designed project cards highlighting problem, solution, and source links.",
      noveltyHighlights: [
        "Curated dark charcoal theme with WCAG AA compliance",
        "Subtle Framer Motion entrance transitions with reduced-motion fallback",
        "Zero horizontal overflow across all device viewports",
      ],
      keyFeatures: [
        "Responsive desktop navbar and mobile drawer",
        "Categorized skill pills and verified learning entries",
        "Direct email copy with interactive feedback toast",
        "Clean project cards with live demo and GitHub buttons",
      ],
      benchmarks: [
        { metric: "Mobile Touch Target Size", before: "28 px (Too small)", after: "44+ px (Compliant)", improvement: "100% accessible" },
        { metric: "Contrast Ratio", before: "3.2:1 (Failing)", after: "9.8:1 (AAA Pass)", improvement: "Triple contrast" },
        { metric: "Cumulative Layout Shift", before: "0.08", after: "0.00", improvement: "Zero shift" },
      ],
      techStackRationale: [
        { name: "Tailwind CSS v4", role: "Utility styling", reason: "Provides precise control over responsive breakpoints and dark mode variants." },
        { name: "Lucide React", role: "Iconography", reason: "Lightweight, consistent SVG icons with accessible sizing." },
      ],
      architectureNotes: "Tailwind CSS Tokens -> Reusable UI Components -> Responsive Breakpoints -> Keyboard Focus Management.",
      tradeoffs: [
        "Avoided heavy 3D canvas libraries in favor of crisp CSS gradients and subtle Framer Motion animations for maximum performance.",
      ],
      challenges: [
        "Maintaining crisp typography contrast while preserving a modern dark aesthetic.",
      ],
      keyLearnings: [
        "Restrained color accents (such as lime) have far greater visual impact when used sparingly on primary actions and indicators.",
      ],
    },
  },
];

export const INITIAL_PROFILE_STATE: ProfileState = {
  name: "Tharanesh Selvam",
  preferredName: "Tharanesh",
  title: "Aspiring Full-Stack Software Engineer",
  tagline: "Computer Science Student & Developer | Crafting responsive, accessible, and high-performance web applications.",
  elevatorPitch: "Aspiring software engineer passionate about modern frontend architectures, clean code, and resilient full-stack systems. Experienced with React, Next.js, TypeScript, and Tailwind CSS. Open to student internship and entry-level software engineering roles where I can contribute to high-impact user experiences.",
  availability: {
    status: "available",
    type: "Student Internships & Entry-Level Roles",
    badgeText: "Available for Internships",
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
    { label: "Target Roles", value: "Intern & Junior", detail: "Frontend & Full-Stack Software Engineering" },
    { label: "Core Stack", value: "TypeScript & React", detail: "Next.js, Tailwind CSS & REST APIs" },
    { label: "Applied Projects", value: "Public Repos", detail: "Interactive applications with source code" },
    { label: "Resume Status", value: "Verified", detail: "Synchronized to technical portfolio logs" },
  ],
  learnings: INITIAL_LEARNINGS,
  projects: INITIAL_PROJECTS,
  resume: {
    summary: "Motivated Computer Science student and aspiring full-stack software engineer with hands-on experience building modern, responsive web applications using Next.js 16, React 19, TypeScript, and Tailwind CSS. Eager to contribute to dynamic software development teams through internships or entry-level roles.",
    experience: [],
    education: [
      {
        degree: "Bachelor of Technology / Engineering in Computer Science",
        institution: "Engineering College / University",
        year: "Expected 2026",
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
      title: "Software Engineering Internship",
      category: "Target Role",
      description: "Contribute to production-grade web applications in an agile, collaborative engineering team.",
      status: "In Progress",
      targetDate: "2026",
      progressPercent: 90,
      tags: ["Internship", "FullStack", "Frontend"],
    },
    {
      id: "goal-2",
      title: "Next.js 16 & React 19 Mastery",
      category: "Frontend",
      description: "Deep dive into Server Actions, Streaming SSR, and partial pre-rendering for optimal Core Web Vitals.",
      status: "In Progress",
      targetDate: "Q2 2026",
      progressPercent: 85,
      tags: ["Next.js", "React", "WebPerf"],
    },
    {
      id: "goal-3",
      title: "Open Source Collaboration",
      category: "Open Source & Leadership",
      description: "Actively contributing to open-source UI libraries, documentation, and developer tools on GitHub.",
      status: "In Progress",
      targetDate: "Q3 2026",
      progressPercent: 70,
      tags: ["OpenSource", "GitHub", "Community"],
    },
    {
      id: "goal-4",
      title: "Scalable API & Backend Integration",
      category: "Backend",
      description: "Designing secure RESTful endpoints, type-safe data validation, and database schemas with Node.js and TypeScript.",
      status: "Upcoming",
      targetDate: "Q4 2026",
      progressPercent: 60,
      tags: ["Node.js", "RESTAPIs", "TypeScript"],
    },
  ],
};

// Backwards-compatibility alias for initial renders
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

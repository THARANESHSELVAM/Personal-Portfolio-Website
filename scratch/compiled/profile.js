"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PROFILE = exports.INITIAL_PROFILE_STATE = exports.INITIAL_PROJECTS = exports.INITIAL_LEARNINGS = void 0;
exports.classifyDomainCategory = classifyDomainCategory;
exports.parseCanonicalSkills = parseCanonicalSkills;
exports.extractCanonicalSkills = extractCanonicalSkills;
exports.getProfileSkillsEvidence = getProfileSkillsEvidence;
exports.extractSkillsFromState = extractSkillsFromState;
exports.generateDynamicPlainTextResume = generateDynamicPlainTextResume;
exports.INITIAL_LEARNINGS = [
    {
        id: "learn-1",
        technology: "Next.js & React 19 App Router",
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
exports.INITIAL_PROJECTS = [
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
            "📊 Cross-validation & evaluation metrics",
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
exports.INITIAL_PROFILE_STATE = {
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
        { label: "Projects", value: "3", detail: "Applied engineering projects" },
        { label: "Skills", value: "13", detail: "Core technologies & tools" },
        { label: "Major Domains", value: "3", detail: "Web Systems, GIS & Applied AI" },
        { label: "Learning Mode", value: "100%", detail: "Continuous skill development" },
    ],
    learnings: exports.INITIAL_LEARNINGS,
    projects: exports.INITIAL_PROJECTS,
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
exports.PROFILE = exports.INITIAL_PROFILE_STATE;
/**
 * Classifies any technology keyword into its authoritative CompetencyArea
 */
function classifyDomainCategory(tech) {
    const lower = tech.toLowerCase().trim();
    // Data & AI keywords (explicitly mapping Pandas, Scikit-learn, etc. to Data & AI)
    if (lower.includes("pandas") ||
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
        lower.includes("langchain")) {
        return "Data & AI";
    }
    // Frontend keywords
    if (lower.includes("react") ||
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
        lower.includes("frontend")) {
        return "Frontend";
    }
    // Cloud & DevOps keywords
    if (lower.includes("docker") ||
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
        lower.includes("devops")) {
        return "Cloud & DevOps";
    }
    // Backend keywords
    if (lower.includes("node") ||
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
        lower.includes("api")) {
        return "Backend";
    }
    return "System Design";
}
/**
 * Normalizes raw/compound skill strings into canonical, discrete skills with version retention.
 */
function parseCanonicalSkills(raw, preferredCategory) {
    if (!raw || typeof raw !== "string")
        return [];
    const trimmed = raw.trim();
    if (!trimmed)
        return [];
    // If input contains multiple comma-separated technologies (e.g. "React, TypeScript"), parse each
    if (trimmed.includes(",")) {
        const parts = trimmed.split(",").map((p) => p.trim()).filter(Boolean);
        if (parts.length > 1) {
            const results = [];
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
function extractCanonicalSkills(raw, preferredCategory) {
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
function getProfileSkillsEvidence(state) {
    const recordMap = new Map();
    // 1. Ingest evidence from Learning Diary entries
    if (Array.isArray(state?.learnings)) {
        state.learnings.forEach((entry) => {
            if (!entry || !entry.technology)
                return;
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
                }
                else {
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
            if (!proj || !Array.isArray(proj.techStack))
                return;
            const projectContextCategory = proj.domainTag?.toLowerCase().includes("ai") || proj.category?.toLowerCase().includes("ai")
                ? "Data & AI"
                : proj.domainTag?.toLowerCase().includes("geospatial")
                    ? "System Design"
                    : undefined;
            proj.techStack.forEach((tech) => {
                if (!tech || typeof tech !== "string" || !tech.trim())
                    return;
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
                    }
                    else {
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
        }
        else if (record.projectRefs.length > 0) {
            record.evidenceType = "project-backed";
        }
        else {
            record.evidenceType = "learning-documented";
        }
    });
    // 4. Group by CompetencyArea
    const byCategory = {
        Frontend: [],
        Backend: [],
        "Cloud & DevOps": [],
        "Data & AI": [],
        "System Design": [],
    };
    const sortSkills = (a, b) => {
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
        }
        else {
            byCategory["System Design"].push(skill);
        }
    });
    Object.keys(byCategory).forEach((cat) => {
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
function extractSkillsFromState(state) {
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
function generateDynamicPlainTextResume(state) {
    const { name, title, contact, resume } = state;
    const categorizedSkills = extractSkillsFromState(state);
    const activeDomains = Object.keys(categorizedSkills).filter((k) => categorizedSkills[k].length > 0);
    const autoSummary = resume.summary?.trim() ||
        `${title} with verified engineering competencies across ${activeDomains.length > 0 ? activeDomains.join(", ") : "Full-Stack Software Engineering"}. Actively maintaining ${state.learnings.length} verified technical diary milestones and ${state.projects.length} architectural projects demonstrating tangible performance optimizations and enterprise scalability.`;
    const experienceText = resume.experience && resume.experience.length > 0
        ? `--------------------------------------------------------------------------------
PROFESSIONAL EXPERIENCE
--------------------------------------------------------------------------------
${resume.experience
            .map((exp) => `
${exp.role.toUpperCase()}
${exp.company} | ${exp.location} | ${exp.period}
Technologies: ${exp.technologies.join(", ")}
${exp.bullets.map((b) => `* ${b}`).join("\n")}
`)
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
* Frontend: ${categorizedSkills.Frontend.length > 0 ? categorizedSkills.Frontend.join(", ") : "Awaiting entries"}
* Backend: ${categorizedSkills.Backend.length > 0 ? categorizedSkills.Backend.join(", ") : "Awaiting entries"}
* Cloud & DevOps: ${categorizedSkills["Cloud & DevOps"].length > 0 ? categorizedSkills["Cloud & DevOps"].join(", ") : "Awaiting entries"}
* Data & AI: ${categorizedSkills["Data & AI"].length > 0 ? categorizedSkills["Data & AI"].join(", ") : "Awaiting entries"}
* System Design: ${categorizedSkills["System Design"].length > 0 ? categorizedSkills["System Design"].join(", ") : "Awaiting entries"}

${experienceText}

--------------------------------------------------------------------------------
APPLIED ARCHITECTURAL PROJECTS & IMPACT
--------------------------------------------------------------------------------
${state.projects.length > 0 ? state.projects
        .map((p) => `* ${p.title.toUpperCase()} (${p.domainTag})
  Problem Solved: ${p.problemSolved}
  Architecture: ${p.solution}
  Stack: ${p.techStack.join(", ")}
  Quantifiable Metrics: ${p.metrics.join("; ")}`)
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

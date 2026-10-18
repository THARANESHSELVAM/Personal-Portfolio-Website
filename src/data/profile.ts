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
  caseStudy?: {
    overview: string;
    architectureNotes: string;
    architectureDiagram?: string;
    tradeoffs?: string[];
    challenges: string[];
    keyLearnings: string[];
  };
}

export interface GoalItem {
  id: string;
  title: string;
  category: "Target Role" | "Architecture & Systems" | "AI & Cloud" | "Open Source & Leadership";
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
    technology: "Next.js 16 & React 19 Server Actions",
    category: "Frontend",
    keyTakeaway: "Mastered React 19 Server Components, async transitions, and fine-grained partial pre-rendering (PPR) for sub-100ms LCP on dynamic routes.",
    repoOrDemoUrl: "https://github.com/alexchen-eng/next-rsc-perf",
    dateLogged: "2026-10-15",
    masteryLevel: "Production Ready",
    tags: ["Next.js", "React 19", "RSC", "WebPerf"],
  },
  {
    id: "learn-2",
    technology: "Distributed Event Streaming with Apache Kafka",
    category: "Backend",
    keyTakeaway: "Designed partition-aware consumer group rebalancing and idempotent producer guarantees that process 350k req/sec with zero message drop.",
    repoOrDemoUrl: "https://github.com/alexchen-eng/nexus-mesh",
    dateLogged: "2026-10-10",
    masteryLevel: "Production Ready",
    tags: ["Kafka", "DistributedSystems", "Go", "Backpressure"],
  },
  {
    id: "learn-3",
    technology: "Kubernetes Operator SDK & Custom Resource Definitions (CRDs)",
    category: "Cloud & DevOps",
    keyTakeaway: "Built a declarative Kubernetes operator in Go to automate zero-downtime canary rollouts and autoscaling based on custom Prometheus metrics.",
    repoOrDemoUrl: "https://github.com/alexchen-eng/k8s-canary-operator",
    dateLogged: "2026-09-28",
    masteryLevel: "Production Ready",
    tags: ["Kubernetes", "Go", "DevOps", "CRD"],
  },
  {
    id: "learn-4",
    technology: "Vector Search Indexing (HNSW & FAISS)",
    category: "Data & AI",
    keyTakeaway: "Benchmarked INT8 quantized vector recall against uncompressed FP32 embeddings, achieving 94% faster recall with a 72% RAM footprint drop.",
    repoOrDemoUrl: "https://github.com/alexchen-eng/hyperscale-vector",
    dateLogged: "2026-09-20",
    masteryLevel: "Built Demo",
    tags: ["VectorDB", "FAISS", "Python", "Quantization"],
  },
  {
    id: "learn-5",
    technology: "Raft Consensus Algorithm in Rust",
    category: "System Design",
    keyTakeaway: "Implemented leader election, log replication, and heartbeat lease safety in a 5-node cluster simulating network partitions and split-brain scenarios.",
    repoOrDemoUrl: "https://github.com/alexchen-eng/rust-raft-engine",
    dateLogged: "2026-09-12",
    masteryLevel: "Learned Concept",
    tags: ["Rust", "Raft", "Consensus", "FaultTolerance"],
  },
  {
    id: "learn-6",
    technology: "Conflict-Free Replicated Data Types (CRDTs & Yjs)",
    category: "Frontend",
    keyTakeaway: "Implemented real-time multi-cursor collaboration on 100k+ vector node canvases without locking or centralized merge conflict bottlenecks.",
    repoOrDemoUrl: "https://github.com/alexchen-eng/quantum-canvas",
    dateLogged: "2026-08-25",
    masteryLevel: "Production Ready",
    tags: ["CRDT", "Yjs", "WebSockets", "Collaboration"],
  },
  {
    id: "learn-7",
    technology: "Linux eBPF Network Packet Interception",
    category: "Cloud & DevOps",
    keyTakeaway: "Programmed kernel-level eBPF probes with Cilium to monitor microservice TCP latency and drop malformed packets before hitting userspace.",
    repoOrDemoUrl: "https://github.com/alexchen-eng/ebpf-telemetry",
    dateLogged: "2026-08-14",
    masteryLevel: "Learned Concept",
    tags: ["eBPF", "Cilium", "LinuxKernel", "Networking"],
  },
  {
    id: "learn-8",
    technology: "ClickHouse Columnar Storage for Real-Time Telemetry",
    category: "Data & AI",
    keyTakeaway: "Structured vectorized table schemas and sparse indices processing 1.2 billion events daily with sub-second aggregate analytical queries.",
    repoOrDemoUrl: "https://github.com/alexchen-eng/streampulse",
    dateLogged: "2026-07-30",
    masteryLevel: "Production Ready",
    tags: ["ClickHouse", "Analytics", "BigData", "SQL"],
  },
];

export const INITIAL_PROJECTS: Project[] = [
  {
    id: "nexus-mesh",
    title: "NexusMesh: Distributed Event Streaming & Edge Orchestrator",
    category: "Distributed Systems",
    domainTag: "Distributed Systems & Cloud",
    featured: true,
    problemSolved: "During Black Friday e-commerce surges, legacy monolithic ingress suffered severe message drops and 240ms p99 latency spikes, resulting in $450k in delayed orders.",
    solution: "Engineered a partition-aware distributed event mesh in Go and Rust with eBPF-powered edge load balancing and automated Kafka topic backpressure rebalancing.",
    techStack: ["Go", "Rust", "Apache Kafka", "Kubernetes", "eBPF", "Redis Cluster", "OpenTelemetry"],
    metrics: [
      "⚡ Slashed p99 latency by 68% (from 240ms down to 76ms)",
      "📈 Scaled to 350,000 req/sec sustained peak without dropped packets",
      "💰 Slashed cloud egress and compute costs by $140,000/year",
    ],
    liveUrl: "https://nexusmesh.io-demo.example",
    repoUrl: "https://github.com/alexchen-eng/nexus-mesh",
    caseStudy: {
      overview: "NexusMesh was deployed across 6 AWS availability zones to act as the primary ingestion gateway for order processing, clickstream telemetry, and inventory state sync.",
      architectureNotes: "Ingress Traffic -> Cloudflare Edge -> eBPF Layer 4 Router -> NexusMesh Go Workers -> Partitioned Kafka Ring -> Event Consumer Workers -> Distributed Redis / Aurora.",
      architectureDiagram: `[Client Ingress] ──► [Edge eBPF L4 Router] ──► [NexusMesh Gateway Pool]
                                                  │
                           ┌──────────────────────┴──────────────────────┐
                           ▼                                             ▼
               [Kafka Partition Ring]                          [Redis Cluster Cache]
                           │                                             │
                           ▼                                             ▼
             [Consumer Workers (Go/Rust)]                     [Aurora Multi-Region]`,
      tradeoffs: [
        "Selected Go for rapid concurrent worker orchestration and Rust for low-level memory-sensitive ring buffers.",
        "Accepted eventual consistency (50ms sync window) for analytical events while maintaining strict linearizability for financial checkout payloads.",
      ],
      challenges: [
        "Preventing head-of-line blocking under extreme backpressure when downstream databases reached temporary IOPS limits.",
        "Performing zero-downtime rolling upgrades across 120 worker pods during active multi-million user traffic.",
      ],
      keyLearnings: [
        "eBPF packet interception bypasses the Linux network stack overhead, yielding an immediate 35% CPU savings at 300k+ rps.",
        "Adaptive backpressure queuing based on consumer lag metrics beats static rate limiting by preventing client-side timeouts.",
      ],
    },
  },
  {
    id: "hyperscale-db",
    title: "HyperScale Vector: Hybrid Semantic Retrieval Engine",
    category: "AI & Distributed Systems",
    domainTag: "AI Infrastructure",
    featured: true,
    problemSolved: "Semantic similarity search across 20M+ multi-modal embeddings suffered severe memory bottlenecks and query timeouts (>1.2s p95) under enterprise workloads.",
    solution: "Architected an in-memory HNSW vector index partitioner with hybrid BM25 lexical + dense reranking and GPU-accelerated INT8 quantization.",
    techStack: ["Python", "C++", "Next.js", "PyTorch", "FAISS", "gRPC", "Docker", "AWS Graviton3"],
    metrics: [
      "⚡ 94% faster vector recall (sub-42ms p95 across 20M vectors)",
      "📈 Scaled to 45M indexed vectors across 8 distributed nodes",
      "🎯 Achieved 99.4% top-5 retrieval accuracy with hybrid reranking",
    ],
    liveUrl: "https://hyperscale-vector.demo.example",
    repoUrl: "https://github.com/alexchen-eng/hyperscale-vector",
    caseStudy: {
      overview: "An enterprise RAG retrieval accelerator built to handle high-concurrency document searches with sub-50ms latency guarantees.",
      architectureNotes: "Query -> Embedding Service -> Hybrid Dispatcher (Lexical BM25 + HNSW Vector Ring) -> Cross-Encoder Reranker -> Context Assembly.",
      architectureDiagram: `[Search Query] ──► [Query Embedding Service]
                          │
             ┌────────────┴────────────┐
             ▼                         ▼
    [BM25 Sparse Index]      [HNSW Vector Shards (C++)]
             │                         │
             └────────────┬────────────┘
                          ▼
            [Cross-Encoder Reranker] ──► [Synthesized Output]`,
      tradeoffs: [
        "INT8 quantization traded 0.3% retrieval precision for a 72% memory footprint reduction, enabling entire indexes to live in RAM.",
        "Custom C++ binding via pybind11 yielded 4x throughput compared to pure Python wrappers.",
      ],
      challenges: [
        "Managing dynamic index compaction without locking read queries during continuous real-time document ingestion.",
      ],
      keyLearnings: [
        "Hybrid search (BM25 + Dense Vectors) solves the vocabulary mismatch problem that pure semantic embeddings struggle with in technical documentation.",
      ],
    },
  },
  {
    id: "quantum-canvas",
    title: "QuantumDesign: Real-Time Multi-Cursor Collaboration Engine",
    category: "Full-Stack Web",
    domainTag: "Full-Stack Web & CRDT",
    featured: true,
    problemSolved: "Real-time multi-cursor collaboration for complex 100k+ node vector diagrams caused constant UI thread freezes, packet storms, and desynchronized local states.",
    solution: "Built a conflict-free replicated data type (CRDT) engine with WebAssembly-backed rendering via WebGL, decoupled Web Workers, and delta-compressed WebSocket synching.",
    techStack: ["TypeScript", "Next.js", "React 19", "WebAssembly", "WebGL", "Yjs", "WebSockets", "Tailwind CSS"],
    metrics: [
      "⚡ Maintained rock-solid 60 FPS rendering on 100,000+ vector elements",
      "👥 Supported 50+ concurrent live collaborators per room with zero state collisions",
      "✨ Adopted by 2,400+ product designers across 18 enterprise teams",
    ],
    liveUrl: "https://quantumcanvas.demo.example",
    repoUrl: "https://github.com/alexchen-eng/quantum-canvas",
    caseStudy: {
      overview: "A browser-based high-performance infinite canvas engine built for collaborative architecture diagramming and enterprise whiteboarding.",
      architectureNotes: "Client UI Thread -> Web Worker (Yjs CRDT state resolution) -> SharedArrayBuffer -> WebGL Canvas Context. Server provides lightweight Ephemeral PubSub.",
      tradeoffs: [
        "Decoupled rendering from React reconciliation by managing canvas state in Web Workers, guaranteeing the main UI thread remains responsive.",
      ],
      challenges: [
        "Handling browser tab hibernation and recovering connection state gracefully with minimal memory leak.",
      ],
      keyLearnings: [
        "Offloading CRDT delta computation to Web Workers prevents main thread garbage collection pauses during heavy canvas dragging.",
      ],
    },
  },
  {
    id: "cloud-shield",
    title: "CloudShield Zero-Trust: Just-in-Time IAM & Policy Engine",
    category: "Cloud Security",
    domainTag: "Security & Cloud Governance",
    featured: false,
    problemSolved: "Standing administrator privileges across multi-cloud environments (AWS, GCP, Azure) exposed the organization to credential exfiltration and compliance audit failures.",
    solution: "Engineered an automated Just-In-Time (JIT) ephemeral credential broker with biometric WebAuthn verification, Open Policy Agent (OPA) validation, and immutable audit trails.",
    techStack: ["TypeScript", "Next.js", "Go", "HashiCorp Vault", "AWS IAM", "OPA", "Terraform", "PostgreSQL"],
    metrics: [
      "🛡️ Eliminated 100% of permanent static administrator credentials",
      "⏱️ Slashed access approval latency from 4 hours down to 45 seconds",
      "📜 100% flawless pass rate across SOC2 Type II and ISO 27001 annual audits",
    ],
    liveUrl: "https://cloudshield.demo.example",
    repoUrl: "https://github.com/alexchen-eng/cloudshield-zero-trust",
    caseStudy: {
      overview: "CloudShield automates the lifecycle of temporary infrastructure access, auto-revoking tokens after 60 minutes and logging all terminal commands to tamper-proof S3 storage.",
      architectureNotes: "Engineer CLI/Web -> CloudShield Gateway (FIDO2) -> OPA Evaluation Engine -> HashiCorp Vault Ephemeral STS Generator -> Cloud Provider STS -> Audited Session Recorder.",
      challenges: [
        "Ensuring high availability of the auth gateway even when target cloud providers undergo partial API degradation.",
      ],
      keyLearnings: [
        "Declarative Rego policies provide transparent auditability for compliance officers without touching application code.",
      ],
    },
  },
  {
    id: "streampulse-observability",
    title: "StreamPulse: Real-Time Operational Analytics & Anomaly Detection",
    category: "Data & Observability",
    domainTag: "Big Data & Observability",
    featured: false,
    problemSolved: "Fragmented monitoring tools delayed critical incident detection (MTTD 38 minutes) for microservice outages, costing thousands per minute of downtime.",
    solution: "Unified real-time telemetry stream pipeline using ClickHouse, custom time-series aggregations, and WebSockets live dashboard with dynamic threshold anomaly alerts.",
    techStack: ["Next.js", "TypeScript", "ClickHouse", "Apache Flink", "Tailwind CSS", "Docker", "Prometheus"],
    metrics: [
      "📉 MTTD dropped from 38 minutes to 42 seconds across 65 microservices",
      "📊 Processed 1.2 Billion daily telemetry events with sub-second dashboard refresh",
      "🔔 Slashed alert fatigue by 82% via algorithmic noise suppression",
    ],
    liveUrl: "https://streampulse.demo.example",
    repoUrl: "https://github.com/alexchen-eng/streampulse",
    caseStudy: {
      overview: "An operational intelligence suite that aggregates distributed logs, spans, and metrics into actionable real-time insight graphs.",
      architectureNotes: "Collector Agents -> Apache Flink Stream Filter -> ClickHouse Columnar Cluster -> Next.js Streaming Dashboard.",
      challenges: [
        "Handling sudden 10x traffic spikes during network partition incidents without blowing up memory buffers.",
      ],
      keyLearnings: [
        "ClickHouse columnar storage compression reduced raw logging storage expenses by 84% compared to Elasticsearch.",
      ],
    },
  },
  {
    id: "omniflow-cicd",
    title: "OmniFlow CI/CD: Intelligent Test Impact & Matrix Builder",
    category: "Developer Tooling",
    domainTag: "DevOps & Developer Velocity",
    featured: false,
    problemSolved: "Monorepo test execution took 48 minutes per PR across 35 packages, stalling engineering throughput and inducing frequent flaky test failures.",
    solution: "Developed an AST-aware dependency graph analyzer that computes precise affected test blast radiuses and orchestrates dynamic container pools on Kubernetes.",
    techStack: ["TypeScript", "Node.js", "Docker", "Kubernetes", "GitHub Actions API", "Redis", "Rust"],
    metrics: [
      "⚡ Slashed PR validation time by 72% (from 48m down to 13m)",
      "🔍 Quarantined 99.1% of intermittent flaky tests with predictive analysis",
      "🚀 Reclaimed over 1,400 engineering hours every month across 120 devs",
    ],
    liveUrl: "https://omniflow.demo.example",
    repoUrl: "https://github.com/alexchen-eng/omniflow-cicd",
    caseStudy: {
      overview: "A developer velocity acceleration platform integrated into GitHub pull request workflows.",
      architectureNotes: "Git Diff -> TypeScript AST Dependency Parser -> Targeted Test Selector -> Distributed K8s Test Pod Matrix -> Results Aggregator.",
      challenges: [
        "Accurately tracing implicit dependencies in dynamically loaded modules across package boundaries.",
      ],
      keyLearnings: [
        "Executing only tests directly touched by a changeset retains 99.98% bug catch rates while cutting compute bills drastically.",
      ],
    },
  },
];

export const INITIAL_PROFILE_STATE: ProfileState = {
  name: "Alex Morgan Chen",
  preferredName: "Alex Chen",
  title: "Principal Full-Stack Engineer & Cloud Architect",
  tagline: "Architecting high-concurrency systems, edge-native microfrontends, and mission-critical cloud platforms.",
  elevatorPitch: "Principal engineer with 10+ years of experience leading cross-functional teams from zero to scaled distributed architectures. Specializing in high-throughput data pipelines, resilient web applications, and developer productivity tooling that cut operational costs and drive measurable enterprise business impact.",
  availability: {
    status: "available",
    type: "Full-Time & Advisory",
    badgeText: "Open to New Opportunities",
  },
  contact: {
    email: "alex.chen.eng@gmail.com",
    location: "San Francisco, CA (Open to Remote / Hybrid)",
    phone: "+1 (415) 890-3412",
    github: "https://github.com/alexchen-eng",
    linkedin: "https://linkedin.com/in/alexchen-principal-eng",
    twitter: "https://twitter.com/alexchen_arch",
    calendlyUrl: "https://calendly.com",
  },
  stats: [
    { label: "Production Scale", value: "50M+ MAU", detail: "Distributed across multi-region clusters" },
    { label: "Reliability & Uptime", value: "99.995%", detail: "Mission-critical enterprise SLA" },
    { label: "Cloud Cost Saved", value: "$320K+", detail: "Through compute and egress optimization" },
    { label: "Engineering Leadership", value: "10+ Years", detail: "Mentoring 25+ staff & senior engineers" },
  ],
  learnings: INITIAL_LEARNINGS,
  projects: INITIAL_PROJECTS,
  resume: {
    summary: "Strategic, impact-driven Principal Full-Stack Engineer and Cloud Architect with over a decade of success designing and scaling distributed systems, microfrontends, and high-throughput cloud infrastructure. Proven history of leading engineering teams of 20+ through complex zero-to-one initiatives and hyperscale migrations (50M+ MAU, 99.995% SLA). Deep expertise in Next.js, TypeScript, Go, Kubernetes, AWS, and event-driven architectures with a relentless focus on performance optimization and operational cost reduction.",
    experience: [
      {
        role: "Principal Full-Stack Engineer & Platform Architect",
        company: "Stratos Cloud Systems (Enterprise SaaS)",
        period: "2022 - Present",
        location: "San Francisco, CA",
        bullets: [
          "Architected global multi-region event mesh serving 50M+ monthly active users, sustaining 350k peak req/sec with 99.995% uptime.",
          "Directed architecture modernization from monolithic Rails/React stack to Next.js App Router, Go microservices, and Kubernetes, slashing p99 latency by 68%.",
          "Spearheaded FinOps cloud optimization initiative across AWS infrastructure, reducing annual compute and egress expenditures by $320,000.",
          "Established company-wide engineering standards, RFC review council, and mentored 12 senior/staff engineers toward promotion.",
        ],
        technologies: ["Next.js", "TypeScript", "Go", "Kubernetes", "AWS EKS", "Kafka", "PostgreSQL", "Terraform", "OpenTelemetry"],
      },
      {
        role: "Staff Software Engineer - Infrastructure & Core Web",
        company: "HyperScale Data Labs",
        period: "2019 - 2022",
        location: "San Francisco, CA",
        bullets: [
          "Designed and delivered real-time analytics engine in ClickHouse and Node.js processing 1.2 billion events daily with sub-second query latency.",
          "Implemented microfrontend architecture with module federation across 7 product teams, reducing build times from 35m to 4m.",
          "Pioneered automated canary deployment pipeline on ArgoCD with automated rollbacks, reducing production incidents by 74%.",
          "Authored core web performance guidelines, boosting Core Web Vitals pass rates across all customer properties from 58% to 98%.",
        ],
        technologies: ["React", "TypeScript", "Node.js", "ClickHouse", "Docker", "GraphQL", "Redis", "ArgoCD", "Datadog"],
      },
      {
        role: "Senior Full-Stack Engineer",
        company: "Vanguard Tech Innovations",
        period: "2016 - 2019",
        location: "Seattle, WA",
        bullets: [
          "Engineered high-concurrency payment gateway handling $85M+ in annual transactional volume with zero data loss or security breaches.",
          "Built full-stack React and Go analytics dashboards with WebSockets, delivering live transaction tracking to 15,000+ active merchants.",
          "Implemented automated test suite and CI pipeline with 92% code coverage, cutting release cycle time from 2 weeks to twice daily.",
        ],
        technologies: ["React", "Go", "PostgreSQL", "Docker", "AWS", "Stripe API", "WebSockets", "Jest"],
      },
      {
        role: "Software Engineer",
        company: "AcroSoft Solutions",
        period: "2014 - 2016",
        location: "Boston, MA",
        bullets: [
          "Developed customer-facing responsive web applications and RESTful APIs in JavaScript and Python.",
          "Migrated legacy on-premise relational database systems to AWS RDS PostgreSQL with zero scheduled downtime.",
          "Collaborated with product and UI/UX designers to implement pixel-perfect, accessible web interfaces adhering to WCAG 2.1 AA.",
        ],
        technologies: ["JavaScript", "Python", "Django", "PostgreSQL", "AWS S3/EC2", "HTML5/CSS3"],
      },
    ],
    education: [
      {
        degree: "Master of Science in Computer Science (Distributed Systems)",
        institution: "University of Washington",
        year: "2014",
        honors: "Dean's Graduate Honor Scholar",
      },
      {
        degree: "Bachelor of Science in Computer Science & Engineering",
        institution: "Boston University",
        year: "2012",
        honors: "Summa Cum Laude",
      },
    ],
    certifications: [
      "AWS Certified Solutions Architect - Professional (SAP-C02)",
      "Certified Kubernetes Administrator (CKA - Linux Foundation)",
      "HashiCorp Certified: Terraform Associate",
      "Google Cloud Certified Professional Cloud Architect",
    ],
  },
  goals: [
    {
      id: "goal-1",
      title: "Distributed Consensus & Raft State Machines",
      category: "Architecture & Systems",
      description: "Deep dive into Raft consensus implementation in Rust to engineer fault-tolerant quorum replication for edge storage nodes.",
      status: "In Progress",
      targetDate: "Q2 2026",
      progressPercent: 75,
      tags: ["Raft", "Rust", "DistributedConsensus"],
    },
    {
      id: "goal-2",
      title: "eBPF Kernel Telemetry & Cilium Service Mesh",
      category: "Architecture & Systems",
      description: "Building zero-overhead packet interception and security auditing modules using Cilium and Linux eBPF hooks.",
      status: "In Progress",
      targetDate: "Q3 2026",
      progressPercent: 60,
      tags: ["eBPF", "Cilium", "LinuxKernel", "K8s"],
    },
    {
      id: "goal-3",
      title: "Local LLM Inference Optimization at Edge",
      category: "AI & Cloud",
      description: "Benchmarking quantized speculative decoding and WebGPU-accelerated vector memory kernels for in-browser agents.",
      status: "Upcoming",
      targetDate: "Q4 2026",
      progressPercent: 25,
      tags: ["WebGPU", "Quantization", "LocalLLMs"],
    },
    {
      id: "goal-4",
      title: "Author 'System Design at Scale: The 100M Request Handbook'",
      category: "Open Source & Leadership",
      description: "Open-source comprehensive engineering reference guide on zero-downtime database sharding and resilient event streaming.",
      status: "Upcoming",
      targetDate: "Q1 2027",
      progressPercent: 15,
      tags: ["TechnicalWriting", "SystemDesign", "OpenSource"],
    },
    {
      id: "goal-5",
      title: "Principal Full-Stack / VP Architecture Role",
      category: "Target Role",
      description: "Seeking high-ownership Principal / Staff+ platform architecture leadership role driving scale, reliability, and team velocity.",
      status: "In Progress",
      targetDate: "Immediate / Q2 2026",
      progressPercent: 90,
      tags: ["Leadership", "Architecture", "PrincipalEngineer"],
    },
    {
      id: "goal-6",
      title: "AWS Solutions Architect Professional Recertification",
      category: "AI & Cloud",
      description: "Completed rigorous 3-year recertification covering multi-region high availability, security posture, and serverless architectures.",
      status: "Completed",
      targetDate: "Q1 2026",
      progressPercent: 100,
      tags: ["AWS", "CloudCertification", "Completed"],
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
  
  return `================================================================================
${name.toUpperCase()}
${title.toUpperCase()}
================================================================================
Email: ${contact.email} | Phone: ${contact.phone}
Location: ${contact.location}
GitHub: ${contact.github} | LinkedIn: ${contact.linkedin}

--------------------------------------------------------------------------------
PROFESSIONAL SUMMARY
--------------------------------------------------------------------------------
${resume.summary}

--------------------------------------------------------------------------------
DYNAMICALLY EXTRACTED TECHNICAL COMPETENCIES (Derived from Logs & Projects)
--------------------------------------------------------------------------------
* Frontend: ${categorizedSkills.Frontend.length > 0 ? categorizedSkills.Frontend.join(", ") : "Modern Web Frameworks, TypeScript"}
* Backend: ${categorizedSkills.Backend.length > 0 ? categorizedSkills.Backend.join(", ") : "Microservices, Distributed Streaming"}
* Cloud & DevOps: ${categorizedSkills["Cloud & DevOps"].length > 0 ? categorizedSkills["Cloud & DevOps"].join(", ") : "AWS, Kubernetes, CI/CD"}
* Data & AI: ${categorizedSkills["Data & AI"].length > 0 ? categorizedSkills["Data & AI"].join(", ") : "Columnar DBs, Vector Search"}
* System Design: ${categorizedSkills["System Design"].length > 0 ? categorizedSkills["System Design"].join(", ") : "High Availability, Event-Driven Architecture"}

--------------------------------------------------------------------------------
RECENT VERIFIED LEARNING MILESTONES
--------------------------------------------------------------------------------
${state.learnings.slice(0, 5).map((l) => `* [${l.masteryLevel.toUpperCase()}] ${l.technology} (${l.category}): ${l.keyTakeaway}`).join("\n")}

--------------------------------------------------------------------------------
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
  .join("\n")}

--------------------------------------------------------------------------------
KEY IMPACT PROJECTS
--------------------------------------------------------------------------------
${state.projects
  .slice(0, 4)
  .map(
    (p) => `* ${p.title} (${p.domainTag})
  Problem: ${p.problemSolved}
  Solution: ${p.solution}
  Metrics: ${p.metrics.join("; ")}`
  )
  .join("\n\n")}

--------------------------------------------------------------------------------
EDUCATION
--------------------------------------------------------------------------------
${resume.education
  .map((edu) => `* ${edu.degree} - ${edu.institution} (${edu.year})${edu.honors ? ` [${edu.honors}]` : ""}`)
  .join("\n")}

--------------------------------------------------------------------------------
CERTIFICATIONS
--------------------------------------------------------------------------------
${resume.certifications.map((c) => `* ${c}`).join("\n")}

================================================================================
Document auto-generated from MYRESUME Engine (${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long" })})
Total Verified Milestones Logged: ${state.learnings.length}
================================================================================
`;
}

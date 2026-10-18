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

export interface SkillItem {
  name: string;
  category: "Frontend" | "Backend" | "Cloud & DevOps" | "System Design & Architecture";
  proficiency: "Production-Ready" | "Proficient" | "Currently Exploring";
  highlight: string;
  tags: string[];
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

export interface ProfileData {
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
  skills: SkillItem[];
  projects: Project[];
  resume: ResumeData;
  goals: GoalItem[];
}

export const PROFILE: ProfileData = {
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
  skills: [
    // Frontend
    { name: "Next.js & React 19", category: "Frontend", proficiency: "Production-Ready", highlight: "Server Components, App Router, Streaming SSR & ISR", tags: ["Next.js", "React", "TypeScript"] },
    { name: "TypeScript (Strict)", category: "Frontend", proficiency: "Production-Ready", highlight: "Complex generics, AST tooling & type-level safety", tags: ["TypeScript", "Tooling"] },
    { name: "Tailwind CSS & Design Systems", category: "Frontend", proficiency: "Production-Ready", highlight: "Tokenized UI systems, headless accessibility & micro-interactions", tags: ["Tailwind", "Radix", "Framer Motion"] },
    { name: "Web Performance & Core Web Vitals", category: "Frontend", proficiency: "Production-Ready", highlight: "Sub-second LCP, 0 CLS, code-splitting & tree-shaking", tags: ["Lighthouse", "Profiler", "Edge"] },
    { name: "WebGL & Canvas Collaboration", category: "Frontend", proficiency: "Proficient", highlight: "CRDTs (Yjs), 60fps canvas rendering & WebSockets", tags: ["Canvas", "WebGL", "Yjs"] },
    { name: "Microfrontends & Module Federation", category: "Frontend", proficiency: "Proficient", highlight: "Independent build/deploy pipelines for enterprise platforms", tags: ["Webpack", "Vite", "Turbopack"] },
    { name: "WebAssembly (WASM)", category: "Frontend", proficiency: "Currently Exploring", highlight: "Rust-compiled modules for edge browser computing", tags: ["Wasm", "Rust"] },

    // Backend
    { name: "Node.js & Go Microservices", category: "Backend", proficiency: "Production-Ready", highlight: "High-throughput concurrent services, gRPC, REST & GraphQL", tags: ["Go", "Node.js", "gRPC"] },
    { name: "Distributed Event Streaming (Kafka)", category: "Backend", proficiency: "Production-Ready", highlight: "Partitioning strategies, idempotency & backpressure control", tags: ["Kafka", "RabbitMQ", "EventMesh"] },
    { name: "PostgreSQL & Query Optimization", category: "Backend", proficiency: "Production-Ready", highlight: "Sharding, multi-column indexing, EXPLAIN ANALYZE & connection pooling", tags: ["PostgreSQL", "Prisma", "pgBouncer"] },
    { name: "Redis & Distributed Caching", category: "Backend", proficiency: "Production-Ready", highlight: "Cluster mode, distributed locks (Redlock), TTL strategies", tags: ["Redis", "Memcached"] },
    { name: "Python & FastAPI", category: "Backend", proficiency: "Proficient", highlight: "Asynchronous API gateways and ML model inference serving", tags: ["Python", "FastAPI", "Pydantic"] },
    { name: "Vector Databases & Search", category: "Backend", proficiency: "Proficient", highlight: "HNSW indexing, hybrid vector retrieval with Pinecone & pgvector", tags: ["pgvector", "Pinecone", "Milvus"] },
    { name: "Rust Services", category: "Backend", proficiency: "Currently Exploring", highlight: "Memory-safe high-performance networking & low-latency brokers", tags: ["Rust", "Tokio", "Actix"] },

    // Cloud & DevOps
    { name: "Amazon Web Services (AWS)", category: "Cloud & DevOps", proficiency: "Production-Ready", highlight: "EKS, ECS, Lambda, CloudFront, S3, RDS Aurora, SQS/SNS", tags: ["AWS", "CloudArchitect"] },
    { name: "Kubernetes & Docker Orchestration", category: "Cloud & DevOps", proficiency: "Production-Ready", highlight: "Helm, GitOps (ArgoCD), horizontal pod autoscaling & ingress controllers", tags: ["K8s", "Docker", "Helm"] },
    { name: "Terraform & Infrastructure as Code", category: "Cloud & DevOps", proficiency: "Production-Ready", highlight: "Modular multi-account AWS architectures with state locking", tags: ["Terraform", "Terragrunt", "IaC"] },
    { name: "CI/CD & Developer Platforms", category: "Cloud & DevOps", proficiency: "Production-Ready", highlight: "GitHub Actions, automated canary deployments & matrix testing", tags: ["CI/CD", "GitHub Actions"] },
    { name: "Observability (OpenTelemetry & Datadog)", category: "Cloud & DevOps", proficiency: "Proficient", highlight: "Distributed tracing, SLO/SLA dashboards & alert routing", tags: ["Datadog", "Prometheus", "Grafana"] },
    { name: "Cloudflare Workers & Edge Routing", category: "Cloud & DevOps", proficiency: "Proficient", highlight: "Edge caching, bot mitigation, and geo-distributed KV stores", tags: ["Cloudflare", "Edge"] },
    { name: "eBPF Linux Observability", category: "Cloud & DevOps", proficiency: "Currently Exploring", highlight: "Kernel-level network latency monitoring and Cilium CNI", tags: ["eBPF", "Cilium"] },

    // System Design & Architecture
    { name: "High-Availability Distributed Systems", category: "System Design & Architecture", proficiency: "Production-Ready", highlight: "Multi-region active-active replication, consensus & CAP theorem trade-offs", tags: ["Architecture", "Resilience"] },
    { name: "Zero-Trust Security & IAM", category: "System Design & Architecture", proficiency: "Production-Ready", highlight: "OAuth2 / OIDC, JWT key rotation, mTLS & role-based access control", tags: ["Security", "OAuth", "mTLS"] },
    { name: "Event-Driven & CQRS Architecture", category: "System Design & Architecture", proficiency: "Production-Ready", highlight: "Command Query Responsibility Segregation & Event Sourcing patterns", tags: ["CQRS", "EventDriven"] },
    { name: "Cost-Engineering (FinOps)", category: "System Design & Architecture", proficiency: "Production-Ready", highlight: "Graviton migration, auto-scaling thresholds & storage tiering", tags: ["FinOps", "CostReduction"] },
    { name: "Fault-Tolerance & Circuit Breaking", category: "System Design & Architecture", proficiency: "Production-Ready", highlight: "Graceful degradation, exponential backoff with jitter & bulkhead pattern", tags: ["Reliability", "SRE"] },
    { name: "Distributed Consensus Protocols", category: "System Design & Architecture", proficiency: "Currently Exploring", highlight: "Raft state machine replication and quorum leasing models", tags: ["Raft", "DistributedConsensus"] },
  ],
  projects: [
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
        architectureDiagram: `[User Input] ──► [Web Worker: Yjs State Engine] ──► [WebSocket Delta Sync]
                            │                                  │
                            ▼                                  ▼
                [WebGL Hardware Canvas]              [Distributed PubSub Node]`,
        tradeoffs: [
          "Decoupled rendering from React reconciliation by managing canvas state in Web Workers, guaranteeing the main UI thread remains responsive.",
          "Stored local state in IndexedDB for instant offline-first load times with optimistic updates.",
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
  ],
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

// Plain text resume generator for 1-click ATS downloads
export function generatePlainTextResume(): string {
  const { name, title, contact, resume } = PROFILE;
  
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
CORE TECHNICAL COMPETENCIES
--------------------------------------------------------------------------------
* Languages & Runtimes: TypeScript, JavaScript, Go, Python, Rust, SQL, HTML5/CSS3
* Frontend Frameworks: Next.js (App Router, Server Components), React 19, Tailwind CSS
* Backend & Distributed: Microservices, Apache Kafka, gRPC, REST, GraphQL, Redis
* Cloud & Infrastructure: AWS (EKS, Lambda, S3, Aurora, CloudFront), Kubernetes, Docker
* DevOps & CI/CD: Terraform, GitHub Actions, ArgoCD, Helm, Datadog, OpenTelemetry
* Databases: PostgreSQL (Sharding, Partitioning), ClickHouse, Redis, pgvector
* Architecture: High-Availability, Microfrontends, CQRS, Zero-Trust IAM, FinOps

--------------------------------------------------------------------------------
PROFESSIONAL EXPERIENCE
--------------------------------------------------------------------------------
${resume.experience
  .map(
    (exp) => `
${exp.role.toUpperCase()}
${exp.company} | ${exp.location} | ${exp.period}
Key Technologies: ${exp.technologies.join(", ")}
${exp.bullets.map((b) => `* ${b}`).join("\n")}
`
  )
  .join("\n")}

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
Document generated from MYRESUME ATS Hub (${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long" })})
================================================================================
`;
}

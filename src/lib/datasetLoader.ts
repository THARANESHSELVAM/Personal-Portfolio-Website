import { ProfileState, Project, LearningEntry, CompetencyArea, MasteryLevel } from "@/data/profile";

export interface UserIdentity {
  userId: string;
  name: string;
  fullName?: string;
  email: string;
  title: string;
  location?: string;
  phone?: string;
  github?: string;
  linkedin?: string;
}

/**
 * Sanitize userId or email for safe localStorage keys
 */
export function sanitizeUserId(userIdOrEmail: string): string {
  if (!userIdOrEmail) return "default_user";
  return userIdOrEmail.trim().toLowerCase().replace(/[^a-z0-9_-]/g, "_");
}

export const ACTIVE_USER_KEY = "myresume_active_user_id";
export const USER_REGISTRY_KEY = "myresume_users_registry_v1";

export function getWorkspaceStorageKey(userIdOrEmail: string): string {
  return `myresume_workspace_${sanitizeUserId(userIdOrEmail)}`;
}

/**
 * Validate that imported JSON complies with the ProfileState schema
 */
export function validateWorkspaceJSON(data: any): boolean {
  if (!data || typeof data !== "object") return false;
  if (typeof data.name !== "string") return false;
  if (!Array.isArray(data.learnings)) return false;
  if (!Array.isArray(data.projects)) return false;
  return true;
}

/**
 * Create a 100% clean, blank workspace for a user
 */
export function createBlankWorkspace(identity: UserIdentity): ProfileState {
  return {
    name: identity.name || "Software Engineer",
    preferredName: identity.name ? identity.name.split(" ")[0] : "Engineer",
    title: identity.title || "Full-Stack Software Engineer",
    tagline: "Personal Engineering & Learning Diary | Continuously logging architectures and verified milestones.",
    elevatorPitch: `Software engineer focused on scalable distributed architectures, resilient full-stack systems, and continuous technical mastery. This engineering diary logs verified concepts, hands-on prototypes, and production implementations.`,
    availability: {
      status: "available",
      type: "Full-Time Opportunities",
      badgeText: "Actively Learning & Building",
    },
    contact: {
      email: identity.email || "",
      location: identity.location || "Remote / Hybrid",
      phone: identity.phone || "",
      github: identity.github || (identity.email ? `https://github.com/${sanitizeUserId(identity.email.split("@")[0])}` : "https://github.com"),
      linkedin: identity.linkedin || "https://linkedin.com",
      twitter: "",
      calendlyUrl: "",
    },
    stats: [
      { label: "Engineering Milestones", value: "0 Logged", detail: "Verified concept and prototype entries" },
      { label: "Applied Projects", value: "0 Built", detail: "Architectural prototypes and implementations" },
      { label: "Competency Areas", value: "5 Domains", detail: "Frontend, Backend, Cloud, AI, Systems" },
      { label: "Resume Status", value: "Auto-Synced", detail: "Directly compiled from diary entries" },
    ],
    learnings: [],
    projects: [],
    resume: {
      summary: "",
      experience: [],
      education: [],
      certifications: [],
    },
    goals: [],
  };
}

/**
 * Create a curated starter workspace tailored for the user with verified milestones and case studies
 */
export function createStarterWorkspace(identity: UserIdentity): ProfileState {
  const blank = createBlankWorkspace(identity);

  const curatedLearnings: LearningEntry[] = [
    {
      id: "learn-1",
      technology: "Next.js 16 & React 19 Server Components",
      category: "Frontend",
      keyTakeaway: "Mastered React 19 async Server Actions, fine-grained partial pre-rendering (PPR), and streaming SSR for sub-100ms LCP on dynamic routes.",
      repoOrDemoUrl: identity.github || "https://github.com",
      dateLogged: new Date().toISOString().split("T")[0],
      masteryLevel: "Production Ready",
      tags: ["Next.js", "React 19", "RSC", "WebPerf"],
    },
    {
      id: "learn-2",
      technology: "Distributed Event Streaming with Apache Kafka",
      category: "Backend",
      keyTakeaway: "Designed partition-aware consumer group rebalancing and idempotent producer guarantees processing high-concurrency payloads with zero message loss.",
      repoOrDemoUrl: identity.github || "https://github.com",
      dateLogged: new Date(Date.now() - 86400000 * 4).toISOString().split("T")[0],
      masteryLevel: "Production Ready",
      tags: ["Kafka", "DistributedSystems", "Go", "Backpressure"],
    },
    {
      id: "learn-3",
      technology: "Kubernetes Operator SDK & Canary Rollouts",
      category: "Cloud & DevOps",
      keyTakeaway: "Built declarative Kubernetes CRDs and automated Prometheus-driven canary rollouts with automated rollbacks on anomaly detection.",
      repoOrDemoUrl: identity.github || "https://github.com",
      dateLogged: new Date(Date.now() - 86400000 * 12).toISOString().split("T")[0],
      masteryLevel: "Production Ready",
      tags: ["Kubernetes", "Go", "DevOps", "CRD"],
    },
    {
      id: "learn-4",
      technology: "Vector Search Indexing (HNSW & FAISS)",
      category: "Data & AI",
      keyTakeaway: "Benchmarked INT8 quantized vector recall against FP32 embeddings, achieving 94% faster recall with a 72% RAM footprint drop.",
      repoOrDemoUrl: identity.github || "https://github.com",
      dateLogged: new Date(Date.now() - 86400000 * 20).toISOString().split("T")[0],
      masteryLevel: "Built Demo",
      tags: ["VectorDB", "FAISS", "Python", "Quantization"],
    },
    {
      id: "learn-5",
      technology: "Raft Consensus Algorithm & Fault Tolerance",
      category: "System Design",
      keyTakeaway: "Implemented leader election, log replication, and heartbeat lease safety in a 5-node cluster simulating network partitions.",
      repoOrDemoUrl: identity.github || "https://github.com",
      dateLogged: new Date(Date.now() - 86400000 * 30).toISOString().split("T")[0],
      masteryLevel: "Learned Concept",
      tags: ["Rust", "Raft", "Consensus", "FaultTolerance"],
    },
  ];

  const curatedProjects: Project[] = [
    {
      id: "proj-nexus-mesh",
      title: "NexusMesh: Distributed Event Streaming & Edge Orchestrator",
      category: "Distributed Systems",
      domainTag: "Distributed Systems & Cloud",
      featured: true,
      noveltySnippet: "Kernel-Bypass eBPF Layer 4 Ingress Router & Zero-Copy Rust Ring Buffers",
      problemSolved: "During extreme e-commerce surges, legacy reverse proxies suffered socket queue contention and 240ms p99 latency spikes, resulting in dropped checkout events.",
      solution: "Engineered an edge-native, partition-aware distributed event mesh in Go and Rust with eBPF-powered edge load balancing and automated Kafka topic backpressure rebalancing.",
      techStack: ["Go", "Rust", "Apache Kafka", "Kubernetes", "eBPF", "Redis Cluster", "OpenTelemetry"],
      metrics: [
        "⚡ Slashed p99 latency by 68% (from 240ms down to 76ms)",
        "📈 Scaled to 350,000 req/sec sustained peak without dropped packets",
        "💰 Slashed cloud egress and compute costs by $140,000/year",
      ],
      liveUrl: "https://nexusmesh.demo.example",
      repoUrl: identity.github || "https://github.com",
      caseStudy: {
        overview: "NexusMesh is an ultra-high-throughput distributed event streaming and edge routing orchestrator handling mission-critical e-commerce order ingestion and state sync.",
        projectUse: "Primary edge gateway and event streaming fabric for enterprise e-commerce platforms. Powers high-concurrency flash sales, live clickstream telemetry ingestion, and inventory state sync.",
        targetUsers: "Platform Engineering, Site Reliability Engineers, Distributed Systems Architects.",
        problemStatement: "During high-volume traffic spikes, legacy ingress proxies suffered severe socket queue contention and thread starvation. Tail latency spiked from 45ms to 240ms+, and downstream Kafka partition consumers suffered uncoordinated stop-the-world rebalance storms.",
        expertSolution: "Designed a hybrid Go/Rust distributed event mesh with kernel-bypass routing and adaptive backpressure. Incoming traffic is filtered via custom eBPF XDP network filters directly into high-speed Go worker pools and buffered in off-heap Rust circular memory rings.",
        novelty: "How I Solved This Problem: (1) Kernel-Bypass eBPF L4 Packet Steering bypassing Linux network socket stack overhead; (2) Zero-Copy Hybrid Ring Buffer in Rust via FFI, eliminating Go GC pauses; (3) Derivative-based predictive partition shedding before SLA thresholds are breached.",
        noveltyHighlights: [
          "Driver-level eBPF XDP packet classifier bypassing kernel TCP/IP stack overhead",
          "Rust FFI zero-copy ring buffer eliminating Go garbage collection pauses",
          "Derivative-based predictive partition rebalancing preventing downstream backpressure cascades"
        ],
        keyFeatures: [
          "Sustains 350,000 req/sec peak with zero dropped packets",
          "Sub-millisecond Layer 4 edge routing with eBPF/XDP probes",
          "Exactly-once delivery semantics for checkout events via idempotent deduplication keys"
        ],
        benchmarks: [
          { metric: "Tail Latency (p99)", before: "240 ms", after: "76 ms", improvement: "-68.3%" },
          { metric: "Peak Throughput", before: "85,000 req/s", after: "350,000 req/s", improvement: "+311.7%" },
          { metric: "Message Drop Rate", before: "0.82%", after: "0.000%", improvement: "100% eliminated" }
        ],
        techStackRationale: [
          { name: "Go", role: "Worker Concurrency", reason: "Lightweight goroutine scheduling allows maintaining 50k+ open socket connections per pod." },
          { name: "Rust", role: "Zero-Copy Ring Buffers", reason: "Guarantees deterministic low latency without runtime garbage collection pauses." },
          { name: "eBPF / XDP", role: "Kernel-Bypass Ingress", reason: "Filters and routes incoming packets directly at the network interface driver level." },
          { name: "Apache Kafka", role: "Event Persistence", reason: "Provides partition-isolated, durable append-only commit logs." }
        ],
        architectureNotes: "Client Ingress -> Cloudflare Edge -> eBPF Layer 4 Router -> Go Workers -> Off-Heap Rust Ring Buffers -> Partitioned Kafka Ring -> Event Consumers.",
        architectureDiagram: `[Client Ingress] ──► [Edge eBPF L4 Router] ──► [Gateway Pool]
                                         │
                  ┌──────────────────────┴──────────────────────┐
                  ▼                                             ▼
      [Kafka Partition Ring]                          [Redis Cluster Cache]
                  │                                             │
                  ▼                                             ▼
    [Consumer Workers (Go/Rust)]                     [Aurora Multi-Region]`,
        tradeoffs: [
          "Selected Go for concurrent worker orchestration and Rust for low-level memory-sensitive ring buffers.",
          "Accepted eventual consistency (50ms sync window) for analytical events while maintaining strict linearizability for checkout payloads."
        ],
        challenges: [
          "Preventing head-of-line blocking under extreme backpressure when downstream databases reached temporary IOPS limits.",
          "Performing zero-downtime rolling upgrades across worker pods during active multi-million user traffic."
        ],
        keyLearnings: [
          "eBPF packet interception bypasses Linux network stack overhead, yielding an immediate 35% CPU savings at 300k+ rps.",
          "Adaptive backpressure queuing based on consumer lag metrics beats static rate limiting by preventing client-side timeouts."
        ],
      },
    },
    {
      id: "proj-quantum-canvas",
      title: "QuantumDesign: Real-Time Multi-Cursor Collaboration Engine",
      category: "Full-Stack Web",
      domainTag: "Full-Stack Web & CRDT",
      featured: true,
      noveltySnippet: "Web Worker CRDT State Machine + SharedArrayBuffer WebGL Pipeline",
      problemSolved: "Real-time multi-cursor collaboration for complex 100k+ node vector diagrams caused constant UI thread freezes, packet storms, and desynchronized local states.",
      solution: "Built a conflict-free replicated data type (CRDT) engine with WebAssembly-backed rendering via WebGL, decoupled Web Workers, and delta-compressed WebSocket synching.",
      techStack: ["TypeScript", "Next.js", "React 19", "WebAssembly", "WebGL", "Yjs", "WebSockets", "Tailwind CSS"],
      metrics: [
        "⚡ Maintained rock-solid 60 FPS rendering on 100,000+ vector elements",
        "👥 Supported 50+ concurrent live collaborators per room with zero state collisions",
        "✨ Adopted by 2,400+ product designers across enterprise teams",
      ],
      liveUrl: "https://quantumcanvas.demo.example",
      repoUrl: identity.github || "https://github.com",
      caseStudy: {
        overview: "A browser-based high-performance infinite canvas engine built for collaborative architecture diagramming and enterprise whiteboarding.",
        projectUse: "Real-time collaborative diagramming for system architects and engineering teams to design large-scale microservice topologies.",
        targetUsers: "Software Architects, UX/Product Designers, Engineering Managers.",
        problemStatement: "Traditional DOM-based and 2D canvas drawing engines suffer drastic frame rate collapse (dropping to 8-11 FPS) when rendering large documents with over 10,000 vector nodes.",
        expertSolution: "Architected a decoupled multi-threaded browser system. Shifted all CRDT mathematical convergence calculations into a dedicated Web Worker running Yjs and rendered with WebGL shaders.",
        novelty: "How I Solved This Problem: (1) Main-Thread Decoupling via SharedArrayBuffer & Atomics; (2) WebAssembly Dynamic QuadTree Culling evaluating viewport in 0.3ms; (3) 6-Byte Binary Delta Cursor Sync reducing network payload size by 95%.",
        noveltyHighlights: [
          "Web Worker CRDT state resolution communicating via zero-copy SharedArrayBuffer",
          "Rust/Wasm dynamic QuadTree viewport culling pruning 90%+ offscreen elements in 0.3ms",
          "Binary bitmask WebSocket telemetry reducing network bandwidth by 95%"
        ],
        keyFeatures: [
          "Maintains silky-smooth 60 FPS under 100,000+ vector elements",
          "Supports 50+ concurrent live editors per canvas with mathematical convergence",
          "Offline-first synchronization with automatic local IndexedDB persistence"
        ],
        benchmarks: [
          { metric: "Canvas Rendering FPS", before: "11 FPS", after: "60 FPS (Rock-solid)", improvement: "5.4x smoother" },
          { metric: "Max Vector Node Capacity", before: "10,000 nodes", after: "120,000+ nodes", improvement: "12x capacity" },
          { metric: "WebSocket Network Bandwidth", before: "42 KB/s", after: "2.1 KB/s", improvement: "-95.0%" }
        ],
        techStackRationale: [
          { name: "WebGL / WebAssembly", role: "Hardware Rendering", reason: "Bypasses the browser DOM entirely, drawing 100k+ nodes at 60 FPS on GPU." },
          { name: "Yjs (CRDT)", role: "State Convergence", reason: "Guarantees strong eventual consistency without central locks." },
          { name: "Web Workers", role: "Thread Isolation", reason: "Keeps heavy CRDT binary tree computation off the main browser UI thread." }
        ],
        architectureNotes: "Client UI Thread -> Web Worker (Yjs CRDT state resolution) -> SharedArrayBuffer -> WebGL Canvas Context.",
        architectureDiagram: `[Client UI Thread] ──► [Web Worker (CRDT State)]
        │                               │
        │ (Zero-Copy)                   ▼
        └──────────────────────► [SharedArrayBuffer]
                                        │
                                        ▼
                             [WebGL GPU Canvas (60 FPS)]`,
        tradeoffs: [
          "Decoupled rendering from React reconciliation by managing canvas state in Web Workers.",
          "Employed custom binary bitmask protocols which required custom serialization debugging tooling."
        ],
        challenges: [
          "Handling browser tab hibernation and recovering connection state gracefully with minimal memory leak.",
          "Managing SharedArrayBuffer security requirements (COOP/COEP headers)."
        ],
        keyLearnings: [
          "Offloading CRDT delta computation to Web Workers prevents main thread garbage collection pauses during heavy canvas dragging."
        ],
      },
    },
  ];

  return {
    ...blank,
    learnings: curatedLearnings,
    projects: curatedProjects,
    stats: [
      { label: "Engineering Milestones", value: `${curatedLearnings.length} Logged`, detail: "Verified concept and prototype entries" },
      { label: "Applied Projects", value: `${curatedProjects.length} Built`, detail: "Architectural prototypes and implementations" },
      { label: "Competency Areas", value: "5 Domains", detail: "Frontend, Backend, Cloud, AI, Systems" },
      { label: "Resume Status", value: "Auto-Synced", detail: "Directly compiled from diary entries" },
    ],
  };
}

/**
 * Export current workspace to formatted JSON string
 */
export function exportWorkspaceToJSON(state: ProfileState): string {
  const exportPayload = {
    app: "MYRESUME Personal Engineering Diary",
    version: "2.0",
    exportedAt: new Date().toISOString(),
    profile: {
      name: state.name,
      preferredName: state.preferredName,
      title: state.title,
      tagline: state.tagline,
      elevatorPitch: state.elevatorPitch,
      contact: state.contact,
      availability: state.availability,
    },
    learnings: state.learnings,
    projects: state.projects,
    resume: state.resume,
    goals: state.goals,
  };
  return JSON.stringify(exportPayload, null, 2);
}

/**
 * Import and validate workspace from JSON string
 */
export function importWorkspaceFromJSON(
  jsonString: string,
  currentIdentity?: UserIdentity
): { success: boolean; state?: ProfileState; error?: string } {
  try {
    const parsed = JSON.parse(jsonString);
    
    // Support either full export structure or direct ProfileState
    const rawState = parsed.profile ? {
      ...parsed.profile,
      learnings: parsed.learnings || [],
      projects: parsed.projects || [],
      resume: parsed.resume || { summary: "", experience: [], education: [], certifications: [] },
      goals: parsed.goals || [],
      stats: parsed.stats || [],
    } : parsed;

    if (!Array.isArray(rawState.learnings) || !Array.isArray(rawState.projects)) {
      return { success: false, error: "Invalid schema: Missing 'learnings' or 'projects' arrays." };
    }

    const state: ProfileState = {
      name: rawState.name || currentIdentity?.name || "Software Engineer",
      preferredName: rawState.preferredName || (rawState.name ? rawState.name.split(" ")[0] : "Engineer"),
      title: rawState.title || currentIdentity?.title || "Full-Stack Software Engineer",
      tagline: rawState.tagline || "Personal Engineering Diary",
      elevatorPitch: rawState.elevatorPitch || "Software engineer passionate about modern systems.",
      availability: rawState.availability || {
        status: "available",
        type: "Full-Time Opportunities",
        badgeText: "Open to Opportunities",
      },
      contact: {
        email: rawState.contact?.email || currentIdentity?.email || "",
        location: rawState.contact?.location || currentIdentity?.location || "Remote",
        phone: rawState.contact?.phone || currentIdentity?.phone || "",
        github: rawState.contact?.github || currentIdentity?.github || "https://github.com",
        linkedin: rawState.contact?.linkedin || currentIdentity?.linkedin || "https://linkedin.com",
        twitter: rawState.contact?.twitter || "",
        calendlyUrl: rawState.contact?.calendlyUrl || "",
      },
      stats: [
        { label: "Engineering Milestones", value: `${rawState.learnings.length} Logged`, detail: "Verified concept and prototype entries" },
        { label: "Applied Projects", value: `${rawState.projects.length} Built`, detail: "Architectural prototypes and implementations" },
        { label: "Competency Areas", value: "5 Domains", detail: "Frontend, Backend, Cloud, AI, Systems" },
        { label: "Resume Status", value: "Auto-Synced", detail: "Directly compiled from diary entries" },
      ],
      learnings: rawState.learnings,
      projects: rawState.projects,
      resume: rawState.resume || { summary: "", experience: [], education: [], certifications: [] },
      goals: rawState.goals || [],
    };

    return { success: true, state };
  } catch (err: any) {
    return { success: false, error: `JSON Parse error: ${err.message}` };
  }
}

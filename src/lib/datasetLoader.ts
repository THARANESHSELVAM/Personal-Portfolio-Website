import { ProfileState, Project, LearningEntry, CompetencyArea, MasteryLevel, INITIAL_LEARNINGS, INITIAL_PROJECTS, INITIAL_PROFILE_STATE } from "@/data/profile";

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

export const CANONICAL_INTEGRATED_MTECH_EDUCATION = {
  degree: "Integrated M.Tech in Computer Science and Engineering",
  institution: "Sri Krishna College of Engineering and Technology",
  year: "2025–2030",
  honors: "Pursuing • Five-Year Integrated Programme",
};

export const CANONICAL_MTECH_SUMMARY =
  "Integrated M.Tech in Computer Science and Engineering candidate at Sri Krishna College of Engineering and Technology (2025–2030) with hands-on experience building modern, responsive web applications using Next.js, React, TypeScript, and Tailwind CSS with AI-assisted workflows. Eager to solve real-world problems through clean code, structured learning, and engineering fundamentals.";

/**
 * Checks if a given ProfileState or user ID belongs to the owner/demo profile (Tharanesh Selvam)
 */
export function isOwnerProfile(state?: ProfileState | null, rawId?: string): boolean {
  if (rawId) {
    const s = sanitizeUserId(rawId);
    if (s === "tharanesh-selvam" || s === "tharaneshselvam" || s.startsWith("tharanesh")) {
      return true;
    }
  }
  if (!state) return false;
  const name = (state.name || "").trim().toLowerCase();
  return name === "tharanesh selvam" || name === "tharanesh";
}

/**
 * Checks if an education list contains obsolete records (separate Bachelor's degree, 2020-2024, or 2024-2026 M.Tech)
 */
export function hasObsoleteEducation(education?: Array<{ degree: string; institution?: string; year?: string }>): boolean {
  if (!education || !Array.isArray(education)) return false;
  return education.some((edu) => {
    const deg = (edu.degree || "").toLowerCase();
    const yr = (edu.year || "");
    const inst = (edu.institution || "").toLowerCase();
    return (
      deg.includes("bachelor") ||
      deg.includes("b.tech") ||
      deg.includes("b.e.") ||
      yr.includes("2020 - 2024") ||
      yr.includes("2020–2024") ||
      yr.includes("2024 - 2026") ||
      yr.includes("2024–2026") ||
      inst.includes("engineering college / university")
    );
  });
}

/**
 * Safely and idempotently migrates owner profile state to replace obsolete education with the single canonical integrated M.Tech entry.
 * Non-owner/custom profiles are NOT altered. Idempotent.
 */
export function migrateOwnerEducationIfNeeded(
  state: ProfileState,
  rawId?: string
): { migrated: boolean; state: ProfileState } {
  if (!isOwnerProfile(state, rawId)) {
    return { migrated: false, state };
  }

  const currentEducation = state.resume?.education || [];
  const needsMigration =
    hasObsoleteEducation(currentEducation) ||
    currentEducation.length > 1 ||
    (currentEducation.length === 1 &&
      (currentEducation[0].degree !== CANONICAL_INTEGRATED_MTECH_EDUCATION.degree ||
        currentEducation[0].institution !== CANONICAL_INTEGRATED_MTECH_EDUCATION.institution ||
        currentEducation[0].year !== CANONICAL_INTEGRATED_MTECH_EDUCATION.year));

  if (!needsMigration) {
    return { migrated: false, state };
  }

  const migratedState: ProfileState = {
    ...state,
    resume: {
      ...state.resume,
      summary:
        !state.resume?.summary ||
        state.resume.summary.includes("2024") ||
        state.resume.summary.includes("Engineering College")
          ? CANONICAL_MTECH_SUMMARY
          : state.resume.summary,
      education: [CANONICAL_INTEGRATED_MTECH_EDUCATION],
    },
  };

  return { migrated: true, state: migratedState };
}

/**
 * Scans known owner workspace storage keys in localStorage and migrates any stale education records safely in-place.
 * Leaves unrelated custom profiles untouched. Idempotent.
 */
export function migrateStoredOwnerWorkspacesInLocalStorage(): boolean {
  if (typeof window === "undefined" || !window.localStorage) return false;

  let anyMigrated = false;
  const candidateKeys = [
    getWorkspaceStorageKey("tharanesh-selvam"),
    getWorkspaceStorageKey("THARANESHSELVAM"),
    getWorkspaceStorageKey("tharaneshselvam@gmail.com"),
    getWorkspaceStorageKey("tharanesh.selvam@gmail.com"),
  ];

  try {
    const activeUser = localStorage.getItem(ACTIVE_USER_KEY);
    if (activeUser) {
      candidateKeys.push(getWorkspaceStorageKey(activeUser));
    }
  } catch {}

  const uniqueKeys = Array.from(new Set(candidateKeys));

  for (const key of uniqueKeys) {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) continue;
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === "object") {
        const { migrated, state: migratedState } = migrateOwnerEducationIfNeeded(parsed as ProfileState);
        if (migrated) {
          localStorage.setItem(key, JSON.stringify(migratedState));
          anyMigrated = true;
        }
      }
    } catch {}
  }

  return anyMigrated;
}

export const VALID_COMPETENCY_AREAS: readonly CompetencyArea[] = [
  "Frontend",
  "Backend",
  "Cloud & DevOps",
  "Data & AI",
  "System Design",
];

export const VALID_MASTERY_LEVELS: readonly MasteryLevel[] = [
  "Learned Concept",
  "Built Demo",
  "Production Ready",
];

export interface WorkspaceValidationResult {
  success: boolean;
  state?: ProfileState;
  error?: string;
}

/**
 * Perform rigorous runtime validation and defensive normalization on raw workspace data
 */
export function validateAndNormalizeWorkspace(
  rawState: unknown,
  currentIdentity?: UserIdentity
): WorkspaceValidationResult {
  if (!rawState || typeof rawState !== "object" || Array.isArray(rawState)) {
    return { success: false, error: "Invalid workspace JSON: Root must be a JSON object." };
  }

  const stateObj = rawState as Record<string, unknown>;

  // 1. Check learnings and projects arrays exist
  if (!Array.isArray(stateObj.learnings)) {
    return { success: false, error: "Invalid workspace schema: Field 'learnings' must be an array." };
  }
  if (!Array.isArray(stateObj.projects)) {
    return { success: false, error: "Invalid workspace schema: Field 'projects' must be an array." };
  }

  // 2. Validate and normalize learnings
  const normalizedLearnings: LearningEntry[] = [];
  const seenLearningIds = new Set<string>();

  // ISO date format regex (e.g. YYYY-MM-DD or full ISO 8601 timestamp)
  const ISO_DATE_REGEX = /^\d{4}-\d{2}-\d{2}(?:[T\s]\d{2}:\d{2}(?::\d{2}(?:\.\d{1,3})?)?(?:Z|[+-]\d{2}:?\d{2})?)?$/;

  const rawLearnings = stateObj.learnings as unknown[];
  for (let i = 0; i < rawLearnings.length; i++) {
    const rawEntry = rawLearnings[i];
    if (!rawEntry || typeof rawEntry !== "object" || Array.isArray(rawEntry)) {
      return { success: false, error: `Invalid learning entry at index ${i}: Expected an object.` };
    }
    const entry = rawEntry as Record<string, unknown>;

    // Required: id
    if (typeof entry.id !== "string" || !entry.id.trim()) {
      return { success: false, error: `Invalid learning entry at index ${i}: Missing required 'id' string.` };
    }
    const id = entry.id.trim();
    if (seenLearningIds.has(id)) {
      return { success: false, error: `Duplicate learning entry ID detected: '${id}'. Each milestone must have a unique ID.` };
    }
    seenLearningIds.add(id);

    // Required: technology
    if (typeof entry.technology !== "string" || !entry.technology.trim()) {
      return { success: false, error: `Invalid learning entry '${id}': Missing required 'technology' field.` };
    }
    const technology = entry.technology.trim();

    // Required: category
    if (typeof entry.category !== "string" || !VALID_COMPETENCY_AREAS.includes(entry.category as CompetencyArea)) {
      return {
        success: false,
        error: `Invalid learning entry '${id}': Unsupported competency category '${entry.category}'. Must be one of: ${VALID_COMPETENCY_AREAS.join(", ")}.`,
      };
    }
    const category = entry.category as CompetencyArea;

    // Required: keyTakeaway
    if (typeof entry.keyTakeaway !== "string" || !entry.keyTakeaway.trim()) {
      return { success: false, error: `Invalid learning entry '${id}': Missing required 'keyTakeaway' field.` };
    }
    const keyTakeaway = entry.keyTakeaway.trim();

    // Required: dateLogged (defensive validation against malformed or fake historical dates)
    if (typeof entry.dateLogged !== "string" || !entry.dateLogged.trim()) {
      return { success: false, error: `Invalid learning entry '${id}': Missing required 'dateLogged' field.` };
    }
    const dateLogged = entry.dateLogged.trim();
    if (!ISO_DATE_REGEX.test(dateLogged) || isNaN(Date.parse(dateLogged))) {
      return {
        success: false,
        error: `Invalid learning entry '${id}': Malformed dateLogged '${dateLogged}'. Must be a valid date string (e.g. YYYY-MM-DD).`,
      };
    }
    const parsedYear = new Date(dateLogged).getFullYear();
    if (parsedYear < 1990 || parsedYear > 2100) {
      return {
        success: false,
        error: `Invalid learning entry '${id}': Date year ${parsedYear} is outside valid engineering timeline range (1990-2100).`,
      };
    }

    // Required: masteryLevel
    if (typeof entry.masteryLevel !== "string" || !VALID_MASTERY_LEVELS.includes(entry.masteryLevel as MasteryLevel)) {
      return {
        success: false,
        error: `Invalid learning entry '${id}': Unsupported mastery level '${entry.masteryLevel}'. Must be one of: ${VALID_MASTERY_LEVELS.join(", ")}.`,
      };
    }
    const masteryLevel = entry.masteryLevel as MasteryLevel;

    // Optional / Safe normalization: tags
    let tags: string[] = [];
    if (entry.tags === undefined || entry.tags === null) {
      // Legacy entries with missing or undefined tags -> normalize defensively to []
      tags = [];
    } else if (Array.isArray(entry.tags)) {
      // Must contain only strings
      for (let tIdx = 0; tIdx < entry.tags.length; tIdx++) {
        const tagItem = entry.tags[tIdx];
        if (typeof tagItem !== "string") {
          return {
            success: false,
            error: `Invalid learning entry '${id}': Tag at index ${tIdx} is not a string (received ${typeof tagItem}).`,
          };
        }
      }
      tags = entry.tags
        .map((t: string) => t.trim().replace(/^#+/, ""))
        .filter((t: string) => t.length > 0);
    } else if (typeof entry.tags === "string") {
      // Legacy comma-separated format support
      tags = entry.tags
        .split(",")
        .map((t: string) => t.trim().replace(/^#+/, ""))
        .filter((t: string) => t.length > 0);
    } else {
      // Invalid type (e.g. number, boolean, object)
      return {
        success: false,
        error: `Invalid learning entry '${id}': Field 'tags' has an invalid type (${typeof entry.tags}). Must be an array of strings.`,
      };
    }

    // Optional / Safe normalization: repoOrDemoUrl
    let repoOrDemoUrl: string | undefined = undefined;
    if (entry.repoOrDemoUrl !== undefined && entry.repoOrDemoUrl !== null && entry.repoOrDemoUrl !== "") {
      if (typeof entry.repoOrDemoUrl !== "string") {
        return {
          success: false,
          error: `Invalid learning entry '${id}': 'repoOrDemoUrl' must be a valid URL string.`,
        };
      }
      const trimmedUrl = entry.repoOrDemoUrl.trim();
      if (trimmedUrl) {
        try {
          const parsed = new URL(trimmedUrl);
          if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
            return {
              success: false,
              error: `Invalid learning entry '${id}': 'repoOrDemoUrl' must use http or https protocol.`,
            };
          }
          repoOrDemoUrl = trimmedUrl;
        } catch {
          return {
            success: false,
            error: `Invalid learning entry '${id}': Malformed 'repoOrDemoUrl' (${trimmedUrl}). Must be a valid URL.`,
          };
        }
      }
    }

    normalizedLearnings.push({
      id,
      technology,
      category,
      keyTakeaway,
      dateLogged,
      masteryLevel,
      tags,
      ...(repoOrDemoUrl ? { repoOrDemoUrl } : {}),
    });
  }

  // 3. Validate and normalize projects
  const normalizedProjects: Project[] = [];
  const seenProjectIds = new Set<string>();

  const rawProjects = stateObj.projects as unknown[];
  for (let i = 0; i < rawProjects.length; i++) {
    const rawProj = rawProjects[i];
    if (!rawProj || typeof rawProj !== "object" || Array.isArray(rawProj)) {
      return { success: false, error: `Invalid project at index ${i}: Expected an object.` };
    }
    const proj = rawProj as Record<string, unknown>;

    // Required: id
    if (typeof proj.id !== "string" || !proj.id.trim()) {
      return { success: false, error: `Invalid project at index ${i}: Missing required 'id' string.` };
    }
    const id = proj.id.trim();
    if (seenProjectIds.has(id)) {
      return { success: false, error: `Duplicate project ID detected: '${id}'. Each project must have a unique ID.` };
    }
    seenProjectIds.add(id);

    // Required: title
    if (typeof proj.title !== "string" || !proj.title.trim()) {
      return { success: false, error: `Invalid project '${id}': Missing required 'title' field.` };
    }
    const title = proj.title.trim();

    // Required: techStack
    if (!Array.isArray(proj.techStack)) {
      return { success: false, error: `Invalid project '${id}': 'techStack' must be an array of strings.` };
    }
    for (let tIdx = 0; tIdx < proj.techStack.length; tIdx++) {
      if (typeof proj.techStack[tIdx] !== "string") {
        return { success: false, error: `Invalid project '${id}': Tech stack item at index ${tIdx} is not a string.` };
      }
    }
    const techStack = (proj.techStack as string[])
      .map((t: string) => t.trim())
      .filter((t: string) => t.length > 0);

    normalizedProjects.push({
      id,
      title,
      category: typeof proj.category === "string" && proj.category.trim() ? proj.category.trim() : "Full-Stack Web",
      domainTag: typeof proj.domainTag === "string" && proj.domainTag.trim() ? proj.domainTag.trim() : "Engineering Project",
      problemSolved: typeof proj.problemSolved === "string" ? proj.problemSolved : "",
      solution: typeof proj.solution === "string" ? proj.solution : "",
      techStack,
      metrics: Array.isArray(proj.metrics) ? proj.metrics.filter((m: unknown): m is string => typeof m === "string") : [],
      ...(typeof proj.liveUrl === "string" && proj.liveUrl.trim() ? { liveUrl: proj.liveUrl.trim() } : {}),
      ...(typeof proj.repoUrl === "string" && proj.repoUrl.trim() ? { repoUrl: proj.repoUrl.trim() } : {}),
      ...(typeof proj.featured === "boolean" ? { featured: proj.featured } : {}),
      ...(typeof proj.noveltySnippet === "string" ? { noveltySnippet: proj.noveltySnippet } : {}),
      ...(proj.caseStudy && typeof proj.caseStudy === "object" ? { caseStudy: proj.caseStudy as Project["caseStudy"] } : {}),
    });
  }

  const contactObj = (stateObj.contact && typeof stateObj.contact === "object") ? (stateObj.contact as Record<string, unknown>) : undefined;
  const resumeObj = (stateObj.resume && typeof stateObj.resume === "object") ? (stateObj.resume as Record<string, unknown>) : undefined;
  const availabilityObj = (stateObj.availability && typeof stateObj.availability === "object") ? (stateObj.availability as Record<string, unknown>) : undefined;

  // 4. Construct normalized ProfileState
  const state: ProfileState = {
    name: typeof stateObj.name === "string" && stateObj.name.trim() ? stateObj.name.trim() : currentIdentity?.name || "Software Engineer",
    preferredName: typeof stateObj.preferredName === "string" && stateObj.preferredName.trim() ? stateObj.preferredName.trim() : (typeof stateObj.name === "string" && stateObj.name ? stateObj.name.split(" ")[0] : "Engineer"),
    title: typeof stateObj.title === "string" && stateObj.title.trim() ? stateObj.title.trim() : currentIdentity?.title || "Full-Stack Software Engineer",
    tagline: typeof stateObj.tagline === "string" ? stateObj.tagline : "Personal Engineering Diary",
    elevatorPitch: typeof stateObj.elevatorPitch === "string" ? stateObj.elevatorPitch : "Software engineer passionate about modern systems.",
    availability: availabilityObj ? {
      status: typeof availabilityObj.status === "string" ? (availabilityObj.status as "available" | "busy" | "open") : "available",
      type: typeof availabilityObj.type === "string" ? availabilityObj.type : "Full-Time Opportunities",
      badgeText: typeof availabilityObj.badgeText === "string" ? availabilityObj.badgeText : "Open to Opportunities",
    } : {
      status: "available",
      type: "Full-Time Opportunities",
      badgeText: "Open to Opportunities",
    },
    contact: {
      email: (typeof contactObj?.email === "string" && contactObj.email) || currentIdentity?.email || "",
      location: (typeof contactObj?.location === "string" && contactObj.location) || currentIdentity?.location || "Remote",
      phone: (typeof contactObj?.phone === "string" && contactObj.phone) || currentIdentity?.phone || "",
      github: (typeof contactObj?.github === "string" && contactObj.github) || currentIdentity?.github || "https://github.com",
      linkedin: (typeof contactObj?.linkedin === "string" && contactObj.linkedin) || currentIdentity?.linkedin || "https://linkedin.com",
      twitter: (typeof contactObj?.twitter === "string" && contactObj.twitter) || "",
      calendlyUrl: (typeof contactObj?.calendlyUrl === "string" && contactObj.calendlyUrl) || "",
    },
    stats: [
      { label: "Engineering Milestones", value: `${normalizedLearnings.length} Logged`, detail: "Verified concept and prototype entries" },
      { label: "Featured Work", value: `${normalizedProjects.length} Logged`, detail: "Active projects and architectural concepts" },
      { label: "Competency Areas", value: "5 Domains", detail: "Frontend, Backend, Cloud, AI, Systems" },
      { label: "Resume Status", value: "Auto-Synced", detail: "Directly compiled from diary entries" },
    ],
    learnings: normalizedLearnings,
    projects: normalizedProjects,
    resume: resumeObj ? {
      summary: typeof resumeObj.summary === "string" ? resumeObj.summary : "",
      experience: Array.isArray(resumeObj.experience) ? (resumeObj.experience as ProfileState["resume"]["experience"]) : [],
      education: Array.isArray(resumeObj.education) ? (resumeObj.education as ProfileState["resume"]["education"]) : [],
      certifications: Array.isArray(resumeObj.certifications) ? (resumeObj.certifications as ProfileState["resume"]["certifications"]) : [],
    } : { summary: "", experience: [], education: [], certifications: [] },
    goals: Array.isArray(stateObj.goals) ? (stateObj.goals as ProfileState["goals"]) : [],
  };

  return { success: true, state };
}

/**
 * Validate that imported JSON complies with the ProfileState schema
 */
export function validateWorkspaceJSON(data: unknown): boolean {
  if (!data || typeof data !== "object") return false;
  const dataObj = data as Record<string, unknown>;
  const raw = dataObj.profile ? { ...(dataObj.profile as Record<string, unknown>), ...dataObj } : dataObj;
  return validateAndNormalizeWorkspace(raw).success;
}

/**
 * Create a 100% clean, blank workspace for a user
 */
export function createBlankWorkspace(identity: UserIdentity): ProfileState {
  return {
    isBlankSlate: true,
    name: identity.name || "New Developer",
    preferredName: identity.name ? identity.name.split(" ")[0] : "Developer",
    title: identity.title || "Software Engineer",
    tagline: "",
    elevatorPitch: "",
    availability: {
      status: "available",
      type: "Open to Opportunities",
      badgeText: "Open to Work",
    },
    contact: {
      email: identity.email || "",
      location: identity.location || "",
      phone: identity.phone || "",
      github: identity.github || "",
      linkedin: identity.linkedin || "",
      twitter: "",
      calendlyUrl: "",
    },
    stats: [
      { label: "Engineering Milestones", value: "0 Logged", detail: "Verified concept and prototype entries" },
      { label: "Featured Work", value: "0 Logged", detail: "Active projects and architectural concepts" },
      { label: "Competency Areas", value: "0 Domains", detail: "Frontend, Backend, Cloud, AI, Systems" },
      { label: "Resume Status", value: "Blank Slate", detail: "Ready to add entries" },
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

  return {
    ...blank,
    name: identity.name || INITIAL_PROFILE_STATE.name,
    preferredName: identity.name ? identity.name.split(" ")[0] : INITIAL_PROFILE_STATE.preferredName,
    title: identity.title || INITIAL_PROFILE_STATE.title,
    tagline: INITIAL_PROFILE_STATE.tagline,
    elevatorPitch: INITIAL_PROFILE_STATE.elevatorPitch,
    availability: INITIAL_PROFILE_STATE.availability,
    contact: {
      ...blank.contact,
      email: identity.email || INITIAL_PROFILE_STATE.contact.email,
      github: identity.github || INITIAL_PROFILE_STATE.contact.github,
      linkedin: identity.linkedin || INITIAL_PROFILE_STATE.contact.linkedin,
      location: identity.location || INITIAL_PROFILE_STATE.contact.location,
    },
    learnings: INITIAL_LEARNINGS,
    projects: INITIAL_PROJECTS,
    stats: INITIAL_PROFILE_STATE.stats,
    resume: INITIAL_PROFILE_STATE.resume,
    goals: INITIAL_PROFILE_STATE.goals,
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
): WorkspaceValidationResult {
  if (typeof jsonString !== "string" || !jsonString.trim()) {
    return { success: false, error: "Empty or invalid JSON content." };
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(jsonString);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return { success: false, error: `JSON Parse error: ${message}` };
  }

  if (!parsed || typeof parsed !== "object") {
    return { success: false, error: "Invalid JSON: Root must be a JSON object." };
  }

  const parsedObj = parsed as Record<string, unknown>;

  // Support either full export structure or direct ProfileState
  const rawState = (parsedObj.profile && typeof parsedObj.profile === "object") ? {
    ...(parsedObj.profile as Record<string, unknown>),
    learnings: parsedObj.learnings,
    projects: parsedObj.projects,
    resume: parsedObj.resume,
    goals: parsedObj.goals,
    stats: parsedObj.stats,
  } : parsedObj;

  return validateAndNormalizeWorkspace(rawState, currentIdentity);
}

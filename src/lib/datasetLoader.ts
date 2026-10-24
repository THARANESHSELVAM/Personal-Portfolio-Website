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
      { label: "Applied Projects", value: "0 Built", detail: "Interactive applications and source code" },
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

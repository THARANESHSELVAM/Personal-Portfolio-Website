"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VALID_MASTERY_LEVELS = exports.VALID_COMPETENCY_AREAS = exports.CANONICAL_MTECH_SUMMARY = exports.CANONICAL_INTEGRATED_MTECH_EDUCATION = exports.USER_REGISTRY_KEY = exports.ACTIVE_USER_KEY = void 0;
exports.sanitizeUserId = sanitizeUserId;
exports.getWorkspaceStorageKey = getWorkspaceStorageKey;
exports.isOwnerProfile = isOwnerProfile;
exports.hasObsoleteEducation = hasObsoleteEducation;
exports.migrateOwnerEducationIfNeeded = migrateOwnerEducationIfNeeded;
exports.migrateStoredOwnerWorkspacesInLocalStorage = migrateStoredOwnerWorkspacesInLocalStorage;
exports.validateAndNormalizeWorkspace = validateAndNormalizeWorkspace;
exports.validateWorkspaceJSON = validateWorkspaceJSON;
exports.createBlankWorkspace = createBlankWorkspace;
exports.createStarterWorkspace = createStarterWorkspace;
exports.exportWorkspaceToJSON = exportWorkspaceToJSON;
exports.importWorkspaceFromJSON = importWorkspaceFromJSON;
const profile_1 = require("@/data/profile");
/**
 * Sanitize userId or email for safe localStorage keys
 */
function sanitizeUserId(userIdOrEmail) {
    if (!userIdOrEmail)
        return "default_user";
    return userIdOrEmail.trim().toLowerCase().replace(/[^a-z0-9_-]/g, "_");
}
exports.ACTIVE_USER_KEY = "myresume_active_user_id";
exports.USER_REGISTRY_KEY = "myresume_users_registry_v1";
function getWorkspaceStorageKey(userIdOrEmail) {
    return `myresume_workspace_${sanitizeUserId(userIdOrEmail)}`;
}
exports.CANONICAL_INTEGRATED_MTECH_EDUCATION = {
    degree: "Integrated M.Tech in Computer Science and Engineering",
    institution: "Sri Krishna College of Engineering and Technology",
    year: "2025–2030",
    honors: "Pursuing • Five-Year Integrated Programme",
};
exports.CANONICAL_MTECH_SUMMARY = "Integrated M.Tech in Computer Science and Engineering candidate at Sri Krishna College of Engineering and Technology (2025–2030) with hands-on experience building modern, responsive web applications using Next.js, React, TypeScript, Node.js, and cloud platforms. Eager to solve real-world problems through clean code, robust architecture, and continuous learning.";
/**
 * Checks if a given ProfileState or user ID belongs to the owner/demo profile (Tharanesh Selvam)
 */
function isOwnerProfile(state, rawId) {
    if (rawId) {
        const s = sanitizeUserId(rawId);
        if (s === "tharanesh-selvam" || s === "tharaneshselvam" || s.startsWith("tharanesh")) {
            return true;
        }
    }
    if (!state)
        return false;
    const name = (state.name || "").trim().toLowerCase();
    return name === "tharanesh selvam" || name === "tharanesh";
}
/**
 * Checks if an education list contains obsolete records (separate Bachelor's degree, 2020-2024, or 2024-2026 M.Tech)
 */
function hasObsoleteEducation(education) {
    if (!education || !Array.isArray(education))
        return false;
    return education.some((edu) => {
        const deg = (edu.degree || "").toLowerCase();
        const yr = (edu.year || "");
        const inst = (edu.institution || "").toLowerCase();
        return (deg.includes("bachelor") ||
            deg.includes("b.tech") ||
            deg.includes("b.e.") ||
            yr.includes("2020 - 2024") ||
            yr.includes("2020–2024") ||
            yr.includes("2024 - 2026") ||
            yr.includes("2024–2026") ||
            inst.includes("engineering college / university"));
    });
}
/**
 * Safely and idempotently migrates owner profile state to replace obsolete education with the single canonical integrated M.Tech entry.
 * Non-owner/custom profiles are NOT altered. Idempotent.
 */
function migrateOwnerEducationIfNeeded(state, rawId) {
    if (!isOwnerProfile(state, rawId)) {
        return { migrated: false, state };
    }
    const currentEducation = state.resume?.education || [];
    const needsMigration = hasObsoleteEducation(currentEducation) ||
        currentEducation.length > 1 ||
        (currentEducation.length === 1 &&
            (currentEducation[0].degree !== exports.CANONICAL_INTEGRATED_MTECH_EDUCATION.degree ||
                currentEducation[0].institution !== exports.CANONICAL_INTEGRATED_MTECH_EDUCATION.institution ||
                currentEducation[0].year !== exports.CANONICAL_INTEGRATED_MTECH_EDUCATION.year));
    if (!needsMigration) {
        return { migrated: false, state };
    }
    const migratedState = {
        ...state,
        resume: {
            ...state.resume,
            summary: !state.resume?.summary ||
                state.resume.summary.includes("2024") ||
                state.resume.summary.includes("Engineering College")
                ? exports.CANONICAL_MTECH_SUMMARY
                : state.resume.summary,
            education: [exports.CANONICAL_INTEGRATED_MTECH_EDUCATION],
        },
    };
    return { migrated: true, state: migratedState };
}
/**
 * Scans known owner workspace storage keys in localStorage and migrates any stale education records safely in-place.
 * Leaves unrelated custom profiles untouched. Idempotent.
 */
function migrateStoredOwnerWorkspacesInLocalStorage() {
    if (typeof window === "undefined" || !window.localStorage)
        return false;
    let anyMigrated = false;
    const candidateKeys = [
        getWorkspaceStorageKey("tharanesh-selvam"),
        getWorkspaceStorageKey("THARANESHSELVAM"),
        getWorkspaceStorageKey("tharaneshselvam@gmail.com"),
        getWorkspaceStorageKey("tharanesh.selvam@gmail.com"),
    ];
    try {
        const activeUser = localStorage.getItem(exports.ACTIVE_USER_KEY);
        if (activeUser) {
            candidateKeys.push(getWorkspaceStorageKey(activeUser));
        }
    }
    catch { }
    const uniqueKeys = Array.from(new Set(candidateKeys));
    for (const key of uniqueKeys) {
        try {
            const raw = localStorage.getItem(key);
            if (!raw)
                continue;
            const parsed = JSON.parse(raw);
            if (parsed && typeof parsed === "object") {
                const { migrated, state: migratedState } = migrateOwnerEducationIfNeeded(parsed);
                if (migrated) {
                    localStorage.setItem(key, JSON.stringify(migratedState));
                    anyMigrated = true;
                }
            }
        }
        catch { }
    }
    return anyMigrated;
}
exports.VALID_COMPETENCY_AREAS = [
    "Frontend",
    "Backend",
    "Cloud & DevOps",
    "Data & AI",
    "System Design",
];
exports.VALID_MASTERY_LEVELS = [
    "Learned Concept",
    "Built Demo",
    "Production Ready",
];
/**
 * Perform rigorous runtime validation and defensive normalization on raw workspace data
 */
function validateAndNormalizeWorkspace(rawState, currentIdentity) {
    if (!rawState || typeof rawState !== "object" || Array.isArray(rawState)) {
        return { success: false, error: "Invalid workspace JSON: Root must be a JSON object." };
    }
    const stateObj = rawState;
    // 1. Check learnings and projects arrays exist
    if (!Array.isArray(stateObj.learnings)) {
        return { success: false, error: "Invalid workspace schema: Field 'learnings' must be an array." };
    }
    if (!Array.isArray(stateObj.projects)) {
        return { success: false, error: "Invalid workspace schema: Field 'projects' must be an array." };
    }
    // 2. Validate and normalize learnings
    const normalizedLearnings = [];
    const seenLearningIds = new Set();
    // ISO date format regex (e.g. YYYY-MM-DD or full ISO 8601 timestamp)
    const ISO_DATE_REGEX = /^\d{4}-\d{2}-\d{2}(?:[T\s]\d{2}:\d{2}(?::\d{2}(?:\.\d{1,3})?)?(?:Z|[+-]\d{2}:?\d{2})?)?$/;
    const rawLearnings = stateObj.learnings;
    for (let i = 0; i < rawLearnings.length; i++) {
        const rawEntry = rawLearnings[i];
        if (!rawEntry || typeof rawEntry !== "object" || Array.isArray(rawEntry)) {
            return { success: false, error: `Invalid learning entry at index ${i}: Expected an object.` };
        }
        const entry = rawEntry;
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
        if (typeof entry.category !== "string" || !exports.VALID_COMPETENCY_AREAS.includes(entry.category)) {
            return {
                success: false,
                error: `Invalid learning entry '${id}': Unsupported competency category '${entry.category}'. Must be one of: ${exports.VALID_COMPETENCY_AREAS.join(", ")}.`,
            };
        }
        const category = entry.category;
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
        if (typeof entry.masteryLevel !== "string" || !exports.VALID_MASTERY_LEVELS.includes(entry.masteryLevel)) {
            return {
                success: false,
                error: `Invalid learning entry '${id}': Unsupported mastery level '${entry.masteryLevel}'. Must be one of: ${exports.VALID_MASTERY_LEVELS.join(", ")}.`,
            };
        }
        const masteryLevel = entry.masteryLevel;
        // Optional / Safe normalization: tags
        let tags = [];
        if (entry.tags === undefined || entry.tags === null) {
            // Legacy entries with missing or undefined tags -> normalize defensively to []
            tags = [];
        }
        else if (Array.isArray(entry.tags)) {
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
                .map((t) => t.trim().replace(/^#+/, ""))
                .filter((t) => t.length > 0);
        }
        else if (typeof entry.tags === "string") {
            // Legacy comma-separated format support
            tags = entry.tags
                .split(",")
                .map((t) => t.trim().replace(/^#+/, ""))
                .filter((t) => t.length > 0);
        }
        else {
            // Invalid type (e.g. number, boolean, object)
            return {
                success: false,
                error: `Invalid learning entry '${id}': Field 'tags' has an invalid type (${typeof entry.tags}). Must be an array of strings.`,
            };
        }
        // Optional / Safe normalization: repoOrDemoUrl
        let repoOrDemoUrl = undefined;
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
                }
                catch {
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
    const normalizedProjects = [];
    const seenProjectIds = new Set();
    const rawProjects = stateObj.projects;
    for (let i = 0; i < rawProjects.length; i++) {
        const rawProj = rawProjects[i];
        if (!rawProj || typeof rawProj !== "object" || Array.isArray(rawProj)) {
            return { success: false, error: `Invalid project at index ${i}: Expected an object.` };
        }
        const proj = rawProj;
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
        const techStack = proj.techStack
            .map((t) => t.trim())
            .filter((t) => t.length > 0);
        normalizedProjects.push({
            id,
            title,
            category: typeof proj.category === "string" && proj.category.trim() ? proj.category.trim() : "Full-Stack Web",
            domainTag: typeof proj.domainTag === "string" && proj.domainTag.trim() ? proj.domainTag.trim() : "Engineering Project",
            problemSolved: typeof proj.problemSolved === "string" ? proj.problemSolved : "",
            solution: typeof proj.solution === "string" ? proj.solution : "",
            techStack,
            metrics: Array.isArray(proj.metrics) ? proj.metrics.filter((m) => typeof m === "string") : [],
            ...(typeof proj.liveUrl === "string" && proj.liveUrl.trim() ? { liveUrl: proj.liveUrl.trim() } : {}),
            ...(typeof proj.repoUrl === "string" && proj.repoUrl.trim() ? { repoUrl: proj.repoUrl.trim() } : {}),
            ...(typeof proj.featured === "boolean" ? { featured: proj.featured } : {}),
            ...(typeof proj.noveltySnippet === "string" ? { noveltySnippet: proj.noveltySnippet } : {}),
            ...(proj.caseStudy && typeof proj.caseStudy === "object" ? { caseStudy: proj.caseStudy } : {}),
        });
    }
    const contactObj = (stateObj.contact && typeof stateObj.contact === "object") ? stateObj.contact : undefined;
    const resumeObj = (stateObj.resume && typeof stateObj.resume === "object") ? stateObj.resume : undefined;
    const availabilityObj = (stateObj.availability && typeof stateObj.availability === "object") ? stateObj.availability : undefined;
    // 4. Construct normalized ProfileState
    const state = {
        name: typeof stateObj.name === "string" && stateObj.name.trim() ? stateObj.name.trim() : currentIdentity?.name || "Software Engineer",
        preferredName: typeof stateObj.preferredName === "string" && stateObj.preferredName.trim() ? stateObj.preferredName.trim() : (typeof stateObj.name === "string" && stateObj.name ? stateObj.name.split(" ")[0] : "Engineer"),
        title: typeof stateObj.title === "string" && stateObj.title.trim() ? stateObj.title.trim() : currentIdentity?.title || "Full-Stack Software Engineer",
        tagline: typeof stateObj.tagline === "string" ? stateObj.tagline : "Personal Engineering Diary",
        elevatorPitch: typeof stateObj.elevatorPitch === "string" ? stateObj.elevatorPitch : "Software engineer passionate about modern systems.",
        availability: availabilityObj ? {
            status: typeof availabilityObj.status === "string" ? availabilityObj.status : "available",
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
            { label: "Applied Projects", value: `${normalizedProjects.length} Built`, detail: "Architectural prototypes and implementations" },
            { label: "Competency Areas", value: "5 Domains", detail: "Frontend, Backend, Cloud, AI, Systems" },
            { label: "Resume Status", value: "Auto-Synced", detail: "Directly compiled from diary entries" },
        ],
        learnings: normalizedLearnings,
        projects: normalizedProjects,
        resume: resumeObj ? {
            summary: typeof resumeObj.summary === "string" ? resumeObj.summary : "",
            experience: Array.isArray(resumeObj.experience) ? resumeObj.experience : [],
            education: Array.isArray(resumeObj.education) ? resumeObj.education : [],
            certifications: Array.isArray(resumeObj.certifications) ? resumeObj.certifications : [],
        } : { summary: "", experience: [], education: [], certifications: [] },
        goals: Array.isArray(stateObj.goals) ? stateObj.goals : [],
    };
    return { success: true, state };
}
/**
 * Validate that imported JSON complies with the ProfileState schema
 */
function validateWorkspaceJSON(data) {
    if (!data || typeof data !== "object")
        return false;
    const dataObj = data;
    const raw = dataObj.profile ? { ...dataObj.profile, ...dataObj } : dataObj;
    return validateAndNormalizeWorkspace(raw).success;
}
/**
 * Create a 100% clean, blank workspace for a user
 */
function createBlankWorkspace(identity) {
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
function createStarterWorkspace(identity) {
    const blank = createBlankWorkspace(identity);
    return {
        ...blank,
        name: identity.name || profile_1.INITIAL_PROFILE_STATE.name,
        preferredName: identity.name ? identity.name.split(" ")[0] : profile_1.INITIAL_PROFILE_STATE.preferredName,
        title: identity.title || profile_1.INITIAL_PROFILE_STATE.title,
        tagline: profile_1.INITIAL_PROFILE_STATE.tagline,
        elevatorPitch: profile_1.INITIAL_PROFILE_STATE.elevatorPitch,
        availability: profile_1.INITIAL_PROFILE_STATE.availability,
        contact: {
            ...blank.contact,
            email: identity.email || profile_1.INITIAL_PROFILE_STATE.contact.email,
            github: identity.github || profile_1.INITIAL_PROFILE_STATE.contact.github,
            linkedin: identity.linkedin || profile_1.INITIAL_PROFILE_STATE.contact.linkedin,
            location: identity.location || profile_1.INITIAL_PROFILE_STATE.contact.location,
        },
        learnings: profile_1.INITIAL_LEARNINGS,
        projects: profile_1.INITIAL_PROJECTS,
        stats: profile_1.INITIAL_PROFILE_STATE.stats,
        resume: profile_1.INITIAL_PROFILE_STATE.resume,
        goals: profile_1.INITIAL_PROFILE_STATE.goals,
    };
}
/**
 * Export current workspace to formatted JSON string
 */
function exportWorkspaceToJSON(state) {
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
function importWorkspaceFromJSON(jsonString, currentIdentity) {
    if (typeof jsonString !== "string" || !jsonString.trim()) {
        return { success: false, error: "Empty or invalid JSON content." };
    }
    let parsed;
    try {
        parsed = JSON.parse(jsonString);
    }
    catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        return { success: false, error: `JSON Parse error: ${message}` };
    }
    if (!parsed || typeof parsed !== "object") {
        return { success: false, error: "Invalid JSON: Root must be a JSON object." };
    }
    const parsedObj = parsed;
    // Support either full export structure or direct ProfileState
    const rawState = (parsedObj.profile && typeof parsedObj.profile === "object") ? {
        ...parsedObj.profile,
        learnings: parsedObj.learnings,
        projects: parsedObj.projects,
        resume: parsedObj.resume,
        goals: parsedObj.goals,
        stats: parsedObj.stats,
    } : parsedObj;
    return validateAndNormalizeWorkspace(rawState, currentIdentity);
}

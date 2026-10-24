/**
 * Strict Owner Authentication Configuration & Multi-Profile Management
 * Supports both verified owner credentials and persistent custom registered profiles.
 */

export interface AuthConfig {
  authorizedUsernames: string[];
  authorizedEmails: string[];
  securityPin: string;
}

export interface RegisteredProfile {
  userId: string;
  username?: string;
  email: string;
  name: string;
  title: string;
  location?: string;
  phone?: string;
  github?: string;
  linkedin?: string;
  pin: string;
  isOwner?: boolean;
  isBlankSlate?: boolean;
  createdAt: number;
}

export const AUTH_SESSION_KEY = "myresume_auth_session_token_v1";
export const AUTH_CONFIG_OVERRIDE_KEY = "myresume_auth_config_override_v1";
export const REGISTERED_PROFILES_KEY = "myresume_registered_profiles";

export const DEFAULT_OWNER_PROFILE: RegisteredProfile = {
  userId: "tharanesh-selvam",
  username: "THARANESHSELVAM",
  email: "tharaneshselvam@gmail.com",
  name: "Tharanesh Selvam",
  title: "Full-Stack Software Engineer & Cloud Architect",
  location: "India / Open to Remote & Relocation",
  github: "https://github.com/THARANESHSELVAM",
  linkedin: "https://linkedin.com/in/tharanesh-selvam",
  pin: "2026",
  isOwner: true,
  createdAt: 1700000000000,
};

export const DEFAULT_AUTH_CONFIG: AuthConfig = {
  authorizedUsernames: [
    "tharaneshselvam",
    "tharanesh",
    "tharanesh-selvam",
    "tharanesh selvam",
  ],
  authorizedEmails: [
    "tharaneshselvam@gmail.com",
    "tharanesh.selvam@gmail.com",
  ],
  securityPin: "2026",
};

/**
 * Normalize an email or username string for robust comparison
 */
export function normalizeCredential(val?: string): string {
  return (val || "").trim().toLowerCase();
}

/**
 * Retrieve current active auth config
 */
export function getAuthConfig(): AuthConfig {
  if (typeof window === "undefined") return DEFAULT_AUTH_CONFIG;

  try {
    const stored = localStorage.getItem(AUTH_CONFIG_OVERRIDE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed && Array.isArray(parsed.authorizedUsernames) && Array.isArray(parsed.authorizedEmails)) {
        return {
          authorizedUsernames: Array.from(new Set([...DEFAULT_AUTH_CONFIG.authorizedUsernames, ...parsed.authorizedUsernames.map((u: string) => u.toLowerCase().trim())])),
          authorizedEmails: Array.from(new Set([...DEFAULT_AUTH_CONFIG.authorizedEmails, ...parsed.authorizedEmails.map((e: string) => e.toLowerCase().trim())])),
          securityPin: parsed.securityPin || DEFAULT_AUTH_CONFIG.securityPin,
        };
      }
    }
  } catch (err) {
    console.warn("Failed to parse custom auth config from localStorage:", err);
  }

  return DEFAULT_AUTH_CONFIG;
}

/**
 * Retrieve all registered user profiles from localStorage
 */
export function getRegisteredProfiles(): RegisteredProfile[] {
  if (typeof window === "undefined") return [DEFAULT_OWNER_PROFILE];

  try {
    const stored = localStorage.getItem(REGISTERED_PROFILES_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Ensure default owner profile is always present
        const hasOwner = parsed.some((p: RegisteredProfile) => 
          normalizeCredential(p.userId) === "tharanesh-selvam" || 
          normalizeCredential(p.username) === "tharaneshselvam"
        );
        if (!hasOwner) {
          return [DEFAULT_OWNER_PROFILE, ...parsed];
        }
        return parsed;
      }
    }
  } catch (e) {
    console.warn("Failed to parse registered profiles:", e);
  }

  // First run: initialize storage with default owner profile
  try {
    localStorage.setItem(REGISTERED_PROFILES_KEY, JSON.stringify([DEFAULT_OWNER_PROFILE]));
  } catch {}

  return [DEFAULT_OWNER_PROFILE];
}

/**
 * Find a registered profile by username or email
 */
export function findRegisteredProfile(usernameOrEmail: string): RegisteredProfile | undefined {
  const norm = normalizeCredential(usernameOrEmail);
  if (!norm) return undefined;

  const profiles = getRegisteredProfiles();
  return profiles.find((p) => {
    const pUser = normalizeCredential(p.username);
    const pId = normalizeCredential(p.userId);
    const pEmail = normalizeCredential(p.email);
    return norm === pUser || norm === pId || norm === pEmail || norm.replace(/[\s-_]/g, "") === pUser.replace(/[\s-_]/g, "");
  });
}

/**
 * Register a new profile into localStorage persistent registry
 */
export function registerNewProfile(data: Omit<RegisteredProfile, "createdAt">): RegisteredProfile {
  const profiles = getRegisteredProfiles();
  const rawUsername = (data.username || data.userId || "").trim();
  const normalizedId = normalizeCredential(data.userId || rawUsername);

  const existingIndex = profiles.findIndex((p) => 
    normalizeCredential(p.userId) === normalizedId ||
    (p.username && normalizeCredential(p.username) === normalizeCredential(rawUsername)) ||
    normalizeCredential(p.email) === normalizeCredential(data.email)
  );

  const newProfile: RegisteredProfile = {
    ...data,
    userId: normalizedId,
    username: rawUsername,
    email: data.email.trim(),
    name: data.name.trim(),
    title: data.title.trim(),
    pin: data.pin.trim(),
    isOwner: false,
    isBlankSlate: data.isBlankSlate !== undefined ? data.isBlankSlate : true,
    createdAt: Date.now(),
  };

  let updatedList: RegisteredProfile[];
  if (existingIndex >= 0) {
    updatedList = [...profiles];
    updatedList[existingIndex] = { ...updatedList[existingIndex], ...newProfile };
  } else {
    updatedList = [...profiles, newProfile];
  }

  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(REGISTERED_PROFILES_KEY, JSON.stringify(updatedList));
    } catch (e) {
      console.error("Failed to persist registered profile:", e);
    }
  }

  return newProfile;
}

/**
 * Verify credentials
 * - If isNewProfile is true, performs basic input validation (allows new registration without blocking)
 * - If isNewProfile is false, checks against owner config or any saved registered profile
 */
export function verifyCredentials(
  username: string,
  email: string,
  passcode?: string,
  isNewProfile = false
): { success: boolean; error?: string; matchedProfile?: RegisteredProfile } {
  const normUser = normalizeCredential(username);
  const normEmail = normalizeCredential(email);
  const normPass = (passcode || "").trim();

  if (!normUser) {
    return { success: false, error: "Username or User ID is required." };
  }
  if (!normEmail) {
    return { success: false, error: "Email ID is required." };
  }
  if (!normPass) {
    return { success: false, error: "Security PIN / Passcode is required." };
  }

  // Mode 1: Registering a brand new profile
  if (isNewProfile) {
    if (normUser.length < 3) {
      return { success: false, error: "Username must be at least 3 characters." };
    }
    if (!normEmail.includes("@") || !normEmail.includes(".")) {
      return { success: false, error: "Please enter a valid email address." };
    }
    if (normPass.length < 3) {
      return { success: false, error: "Passcode PIN must be at least 3 digits/characters." };
    }
    return { success: true };
  }

  // Mode 2: Existing Profile Verification
  // Check against registered profiles first
  const registered = findRegisteredProfile(username) || findRegisteredProfile(email);
  if (registered) {
    if (normPass === registered.pin) {
      return { success: true, matchedProfile: registered };
    }
    return {
      success: false,
      error: "Access Denied: Invalid Security Passcode / PIN for this profile.",
    };
  }

  // Fallback check against default owner config
  const config = getAuthConfig();
  const isUsernameValid = config.authorizedUsernames.some(
    (u) => normalizeCredential(u) === normUser || normalizeCredential(u).replace(/[\s-_]/g, "") === normUser.replace(/[\s-_]/g, "")
  );

  const isEmailValid = config.authorizedEmails.some((e) => {
    const targetNorm = normalizeCredential(e);
    if (targetNorm === normEmail) return true;
    if (targetNorm.endsWith("@gmail.com") && normEmail.endsWith("@gmail.com")) {
      const targetUser = targetNorm.split("@")[0].replace(/\./g, "");
      const inputUser = normEmail.split("@")[0].replace(/\./g, "");
      return targetUser === inputUser;
    }
    return false;
  });

  if (!isUsernameValid || !isEmailValid) {
    return {
      success: false,
      error: "Access Denied: Profile not found. Select 'Add New Profile Entry' to register a new profile.",
    };
  }

  if (normPass !== config.securityPin) {
    return {
      success: false,
      error: "Access Denied: Invalid Security Passcode / PIN. Please enter the authorized owner passcode.",
    };
  }

  return { success: true, matchedProfile: DEFAULT_OWNER_PROFILE };
}

export interface SessionPayload {
  userId: string;
  email: string;
  name: string;
  authenticatedAt: number;
  signature: string;
}

/**
 * Generate a validated session token for storage
 */
export function createSessionToken(username: string, email: string, name = "Verified User"): string {
  const payload: SessionPayload = {
    userId: normalizeCredential(username),
    email: normalizeCredential(email),
    name: name.trim(),
    authenticatedAt: Date.now(),
    signature: `auth_verified_${normalizeCredential(username)}_${normalizeCredential(email).slice(0, 5)}`,
  };

  return btoa(JSON.stringify(payload));
}

/**
 * Validate an existing session token from localStorage
 * Allows default owner OR any registered profile
 */
export function validateSessionToken(token: string | null): boolean {
  if (!token) return false;

  try {
    const decoded = JSON.parse(atob(token)) as SessionPayload;
    if (!decoded || !decoded.userId || !decoded.email || !decoded.signature) {
      return false;
    }

    const normUser = normalizeCredential(decoded.userId);
    const normEmail = normalizeCredential(decoded.email);

    // 1. Check against registered profiles list
    const profiles = getRegisteredProfiles();
    const isRegistered = profiles.some(p => 
      normalizeCredential(p.userId) === normUser ||
      normalizeCredential(p.username) === normUser ||
      normalizeCredential(p.email) === normEmail
    );
    if (isRegistered) return true;

    // 2. Check against default owner config
    const config = getAuthConfig();
    const isUserValid = config.authorizedUsernames.some(
      (u) => normalizeCredential(u) === normUser || normalizeCredential(u).replace(/[\s-_]/g, "") === normUser.replace(/[\s-_]/g, "")
    );
    const isEmailValid = config.authorizedEmails.some(
      (e) => normalizeCredential(e) === normEmail || (
        e.endsWith("@gmail.com") && normEmail.endsWith("@gmail.com") &&
        e.split("@")[0].replace(/\./g, "") === normEmail.split("@")[0].replace(/\./g, "")
      )
    );

    return isUserValid && isEmailValid;
  } catch (err) {
    return false;
  }
}

/**
 * Clear session and lock workspace
 */
export function clearAuthSession(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(AUTH_SESSION_KEY);
  }
}

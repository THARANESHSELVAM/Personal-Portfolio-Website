/**
 * Strict Owner Authentication Configuration & Session Security
 * Enforces verified owner credentials before granting access to the portfolio workspace.
 */

export interface AuthConfig {
  authorizedUsernames: string[];
  authorizedEmails: string[];
  securityPin: string;
}

export const AUTH_SESSION_KEY = "myresume_auth_session_token_v1";
export const AUTH_CONFIG_OVERRIDE_KEY = "myresume_auth_config_override_v1";

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
 * Retrieve current active auth config (merging any owner-persisted overrides)
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
 * Normalize an email or username string for robust comparison
 */
export function normalizeCredential(val: string): string {
  return (val || "").trim().toLowerCase();
}

/**
 * Strictly verify entered credentials against authorized owner records
 */
export function verifyCredentials(
  username: string,
  email: string,
  passcode?: string
): { success: boolean; error?: string } {
  const config = getAuthConfig();

  const normUser = normalizeCredential(username);
  const normEmail = normalizeCredential(email);
  const normPass = (passcode || "").trim();

  if (!normUser) {
    return { success: false, error: "Username or User ID is required." };
  }

  if (!normEmail) {
    return { success: false, error: "Email ID is required." };
  }

  // 1. Verify Username / User ID
  const isUsernameValid = config.authorizedUsernames.some(
    (u) => normalizeCredential(u) === normUser || normalizeCredential(u).replace(/[\s-_]/g, "") === normUser.replace(/[\s-_]/g, "")
  );

  if (!isUsernameValid) {
    return {
      success: false,
      error: "Access Denied: Unauthorized Username or Email ID. Only the verified portfolio owner can access this workspace.",
    };
  }

  // 2. Verify Email ID
  // For Gmail addresses, handle dot-insensitivity
  const isEmailValid = config.authorizedEmails.some((e) => {
    const targetNorm = normalizeCredential(e);
    if (targetNorm === normEmail) return true;
    
    // Check gmail dot equivalence
    if (targetNorm.endsWith("@gmail.com") && normEmail.endsWith("@gmail.com")) {
      const targetUser = targetNorm.split("@")[0].replace(/\./g, "");
      const inputUser = normEmail.split("@")[0].replace(/\./g, "");
      return targetUser === inputUser;
    }
    return false;
  });

  if (!isEmailValid) {
    return {
      success: false,
      error: "Access Denied: Unauthorized Username or Email ID. Only the verified portfolio owner can access this workspace.",
    };
  }

  // 3. Verify Security Passcode PIN (Required)
  if (normPass !== config.securityPin) {
    return {
      success: false,
      error: "Access Denied: Invalid Security Passcode / PIN. Please enter the authorized owner passcode.",
    };
  }

  return { success: true };
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
export function createSessionToken(username: string, email: string): string {
  const payload: SessionPayload = {
    userId: normalizeCredential(username),
    email: normalizeCredential(email),
    name: "Tharanesh Selvam",
    authenticatedAt: Date.now(),
    signature: `auth_verified_${normalizeCredential(username)}_${normalizeCredential(email).slice(0, 5)}`,
  };

  return btoa(JSON.stringify(payload));
}

/**
 * Validate an existing session token from localStorage
 */
export function validateSessionToken(token: string | null): boolean {
  if (!token) return false;

  try {
    const decoded = JSON.parse(atob(token)) as SessionPayload;
    if (!decoded || !decoded.userId || !decoded.email || !decoded.signature) {
      return false;
    }

    const config = getAuthConfig();
    const isUserValid = config.authorizedUsernames.some(
      (u) => normalizeCredential(u) === decoded.userId || normalizeCredential(u).replace(/[\s-_]/g, "") === decoded.userId.replace(/[\s-_]/g, "")
    );
    const isEmailValid = config.authorizedEmails.some(
      (e) => normalizeCredential(e) === decoded.email || (
        e.endsWith("@gmail.com") && decoded.email.endsWith("@gmail.com") &&
        e.split("@")[0].replace(/\./g, "") === decoded.email.split("@")[0].replace(/\./g, "")
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

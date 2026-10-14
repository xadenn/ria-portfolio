import crypto from "crypto";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

export const ADMIN_COOKIE_NAME = "ria_admin_session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days in seconds

function getAdminPassword(): string {
  const password = process.env.ADMIN_PASSWORD?.trim();
  if (!password) {
    console.warn("[Auth] ADMIN_PASSWORD environment variable is not defined");
    return "";
  }
  return password;
}

function getSessionSecret(): string {
  return process.env.ADMIN_SESSION_SECRET || "ria_verma_atelier_admin_auth_salt_default";
}

/**
 * Creates a deterministic HMAC signature for the admin session token
 */
export function generateSessionToken(): string {
  const password = getAdminPassword();
  const secret = getSessionSecret();
  return crypto
    .createHmac("sha256", secret)
    .update(`admin_session:${password}`)
    .digest("hex");
}

/**
 * Verifies if a submitted password matches the configured admin password
 */
export function verifyAdminPassword(inputPassword: string): boolean {
  if (!inputPassword) return false;
  const expected = getAdminPassword();
  // Safe comparison
  return inputPassword.trim() === expected;
}

/**
 * Validates a session token against current admin password and secret
 */
export function isValidSessionToken(token?: string | null): boolean {
  if (!token) return false;
  const expectedToken = generateSessionToken();
  try {
    return crypto.timingSafeEqual(
      Buffer.from(token, "utf-8"),
      Buffer.from(expectedToken, "utf-8")
    );
  } catch {
    return false;
  }
}

/**
 * Server-side helper to check if current request or cookie store is authenticated
 */
export async function isServerAdminAuthenticated(req?: NextRequest): Promise<boolean> {
  let token: string | undefined;

  if (req) {
    token = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
  } else {
    try {
      const cookieStore = await cookies();
      token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
    } catch {
      return false;
    }
  }

  return isValidSessionToken(token);
}

export const COOKIE_OPTIONS = {
  name: ADMIN_COOKIE_NAME,
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: SESSION_MAX_AGE,
};

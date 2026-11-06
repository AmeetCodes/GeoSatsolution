import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { SESSION_ABSOLUTE_MS, SESSION_INACTIVITY_MS } from "./session-config";

export type AdminSessionRole = "admin" | "superadmin";

export interface AdminSession {
  sessionId: string;
  email: string;
  role: AdminSessionRole;
  issuedAt: number;
  lastActivityAt: number;
  expiresAt: number;
}

const VALID_ROLES: AdminSessionRole[] = ["admin", "superadmin"];
const CLOCK_SKEW_MS = 60 * 1000;

function getSessionSecret(): string {
  const secret = process.env.ADMIN_SESSION_SECRET?.trim();
  if (!secret || Buffer.byteLength(secret) < 32) {
    throw new Error("ADMIN_SESSION_SECRET must be configured with at least 32 characters");
  }
  return secret;
}

function signPayload(payload: string): string {
  return createHmac("sha256", getSessionSecret()).update(payload).digest("base64url");
}

export function createAdminSessionId(): string {
  return randomBytes(32).toString("base64url");
}

export function createAdminSession(
  email: string,
  role: AdminSessionRole,
  sessionId: string,
  now = Date.now(),
): AdminSession {
  return {
    sessionId,
    email: email.trim().toLowerCase(),
    role,
    issuedAt: now,
    lastActivityAt: now,
    expiresAt: now + SESSION_ABSOLUTE_MS,
  };
}

export function signAdminSessionToken(session: AdminSession): string {
  const payload = JSON.stringify({
    sessionId: session.sessionId,
    email: session.email.trim().toLowerCase(),
    role: session.role,
    issuedAt: session.issuedAt,
    lastActivityAt: session.lastActivityAt,
    expiresAt: session.expiresAt,
  });
  const encodedPayload = Buffer.from(payload).toString("base64url");
  return `${encodedPayload}.${signPayload(encodedPayload)}`;
}

export function verifyAdminSessionToken(
  token?: string | null,
  now = Date.now(),
): AdminSession | null {
  if (!token) return null;

  try {
    const parts = token.split(".");
    if (parts.length !== 2 || !parts[0] || !parts[1]) return null;

    const [encodedPayload, signature] = parts;
    const expectedSignature = Buffer.from(signPayload(encodedPayload), "base64url");
    const providedSignature = Buffer.from(signature, "base64url");

    if (
      expectedSignature.length !== providedSignature.length ||
      !timingSafeEqual(expectedSignature, providedSignature)
    ) {
      return null;
    }

    const parsed = JSON.parse(
      Buffer.from(encodedPayload, "base64url").toString("utf-8"),
    ) as Partial<AdminSession>;

    const { sessionId, email, role, issuedAt, lastActivityAt, expiresAt } = parsed;

    if (typeof sessionId !== "string" || !sessionId) return null;
    if (typeof email !== "string" || !email.trim()) return null;
    if (typeof role !== "string" || !VALID_ROLES.includes(role as AdminSessionRole)) return null;
    if (
      typeof issuedAt !== "number" ||
      typeof lastActivityAt !== "number" ||
      typeof expiresAt !== "number" ||
      !Number.isFinite(issuedAt) ||
      !Number.isFinite(lastActivityAt) ||
      !Number.isFinite(expiresAt)
    ) {
      return null;
    }

    if (issuedAt > now + CLOCK_SKEW_MS) return null;
    if (lastActivityAt < issuedAt - CLOCK_SKEW_MS) return null;
    if (lastActivityAt > now + CLOCK_SKEW_MS) return null;
    if (expiresAt > issuedAt + SESSION_ABSOLUTE_MS + CLOCK_SKEW_MS) return null;

    const inactivityDeadline = lastActivityAt + SESSION_INACTIVITY_MS;
    if (now >= Math.min(expiresAt, inactivityDeadline)) return null;

    return {
      sessionId,
      email: email.trim().toLowerCase(),
      role: role as AdminSessionRole,
      issuedAt,
      lastActivityAt,
      expiresAt,
    };
  } catch {
    return null;
  }
}

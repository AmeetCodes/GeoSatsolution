import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "node:crypto";

export interface AdminSession {
  email: string;
  role: "admin" | "superadmin";
  issuedAt: number;
  expiresAt: number;
}

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

export function createSessionToken(
  email: string,
  role: AdminSession["role"],
  days = 1,
): string {
  const issuedAt = Date.now();
  const expiresAt = issuedAt + days * 24 * 60 * 60 * 1000;
  const payload = JSON.stringify({
    email: email.trim().toLowerCase(),
    role,
    issuedAt,
    expiresAt,
  });
  const encodedPayload = Buffer.from(payload).toString("base64url");
  return `${encodedPayload}.${signPayload(encodedPayload)}`;
}

export function verifySessionToken(token?: string | null): AdminSession | null {
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
    ) return null;

    const session = JSON.parse(Buffer.from(encodedPayload, "base64url").toString("utf-8")) as AdminSession;
    if (
      !session.email ||
      !["admin", "superadmin"].includes(session.role) ||
      !Number.isFinite(session.issuedAt) ||
      !Number.isFinite(session.expiresAt) ||
      Date.now() > session.expiresAt
    ) return null;

    return session;
  } catch {
    return null;
  }
}

export async function getAdminSessionServer(): Promise<AdminSession | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("geosat_admin_session")?.value;
  return verifySessionToken(token);
}

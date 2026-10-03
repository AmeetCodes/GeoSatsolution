import { cookies } from "next/headers";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@geosatsoln.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "GeoSatAdmin2026!Secure";
const ADMIN_SECRET = process.env.ADMIN_SESSION_SECRET || "geosat_admin_secret_key_84920485918239048123";

export interface AdminSession {
  email: string;
  role: "admin";
  issuedAt: number;
  expiresAt: number;
}

/**
 * Creates an encrypted/signed session string
 */
export function createSessionToken(email: string, days = 7): string {
  const expiresAt = Date.now() + days * 24 * 60 * 60 * 1000;
  const payload = JSON.stringify({
    email,
    role: "admin",
    issuedAt: Date.now(),
    expiresAt,
  });
  const encodedPayload = Buffer.from(payload).toString("base64url");
  const signature = Buffer.from(encodedPayload + ADMIN_SECRET).toString("base64url").slice(0, 32);
  return `${encodedPayload}.${signature}`;
}

/**
 * Verifies session token
 */
export function verifySessionToken(token?: string | null): AdminSession | null {
  if (!token) return null;
  try {
    const [encodedPayload, signature] = token.split(".");
    if (!encodedPayload || !signature) return null;

    const expectedSignature = Buffer.from(encodedPayload + ADMIN_SECRET).toString("base64url").slice(0, 32);
    if (signature !== expectedSignature) return null;

    const session: AdminSession = JSON.parse(Buffer.from(encodedPayload, "base64url").toString("utf-8"));
    if (Date.now() > session.expiresAt) return null;

    return session;
  } catch {
    return null;
  }
}

/**
 * Validates admin credentials from request
 */
export function validateAdminCredentials(email: string, pass: string): boolean {
  return email.trim().toLowerCase() === ADMIN_EMAIL.trim().toLowerCase() && pass === ADMIN_PASSWORD;
}

/**
 * Server-side helper to check if current request has admin rights
 */
export async function getAdminSessionServer(): Promise<AdminSession | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("geosat_admin_session")?.value;
  return verifySessionToken(token);
}

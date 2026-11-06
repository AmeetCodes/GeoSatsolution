import { cookies } from "next/headers";
import {
  ADMIN_SESSION_COOKIE,
  SESSION_COOKIE_MAX_AGE_SECONDS,
} from "./session-config";
import {
  verifyAdminSessionToken,
  type AdminSession,
} from "./admin-session";
import {
  isAdminSessionActive,
  refreshAdminSession,
  revokeAdminSession,
} from "@/lib/db/services/admin-session.service";

function getCookieOptions(maxAge = SESSION_COOKIE_MAX_AGE_SECONDS) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict" as const,
    path: "/",
    maxAge,
  };
}

export async function setAdminSessionCookie(token: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_SESSION_COOKIE, token, getCookieOptions());
}

export async function clearAdminSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_SESSION_COOKIE, "", getCookieOptions(0));
}

export async function getAdminSessionServer(): Promise<AdminSession | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
  const session = verifyAdminSessionToken(token);

  if (!session) return null;

  const active = await isAdminSessionActive(session.sessionId);
  return active ? session : null;
}

export async function refreshAdminSessionServer(): Promise<AdminSession | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
  const session = verifyAdminSessionToken(token);

  if (!session) return null;

  const refreshed = await refreshAdminSession(session);
  if (!refreshed) return null;

  await setAdminSessionCookie(refreshed.token);
  return refreshed.session;
}

export async function revokeAdminSessionServer(): Promise<void> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
  const session = verifyAdminSessionToken(token);

  if (!session) return;

  await revokeAdminSession(session.sessionId);
}

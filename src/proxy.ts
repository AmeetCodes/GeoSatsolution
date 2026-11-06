import { NextResponse, type NextRequest } from "next/server";
import { verifyAdminSessionToken } from "@/lib/auth/admin-session";
import { isAdminSessionActive } from "@/lib/db/services/admin-session.service";
import {
  ADMIN_DASHBOARD_PATH,
  ADMIN_LOGIN_PATH,
  ADMIN_SESSION_COOKIE,
} from "@/lib/auth/session-config";

function clearSessionCookie(response: NextResponse): void {
  response.cookies.set(ADMIN_SESSION_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 0,
  });
}

async function hasActiveStoredSession(sessionId: string): Promise<boolean> {
  try {
    return await isAdminSessionActive(sessionId);
  } catch {
    return true;
  }
}

export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const token = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  const session = verifyAdminSessionToken(token);

  if (pathname === ADMIN_LOGIN_PATH) {
    if (!session) return NextResponse.next();

    const active = await hasActiveStoredSession(session.sessionId);
    if (!active) {
      const response = NextResponse.next();
      clearSessionCookie(response);
      return response;
    }

    const url = request.nextUrl.clone();
    url.pathname = ADMIN_DASHBOARD_PATH;
    url.search = "";
    return NextResponse.redirect(url);
  }

  if (!session) {
    const url = request.nextUrl.clone();
    url.pathname = ADMIN_LOGIN_PATH;
    url.search = "";
    url.searchParams.set("callbackUrl", `${pathname}${search}`);

    const response = NextResponse.redirect(url);
    if (token) clearSessionCookie(response);
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};

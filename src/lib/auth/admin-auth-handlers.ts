import { NextResponse } from "next/server";
import {
  AdminRecordNotFoundError,
  authenticateAdmin,
} from "@/lib/db/services/admin-auth.service";
import { issueAdminSession } from "@/lib/db/services/admin-session.service";
import {
  consumeAdminLoginAttempt,
  resetAdminLoginAttempts,
} from "@/lib/db/services/admin-login-rate-limit.service";
import { adminLoginSchema } from "@/lib/validations/auth.schema";
import { validationErrorResponse } from "@/lib/validations/utils";
import {
  clearAdminSessionCookie,
  getAdminSessionServer,
  refreshAdminSessionServer,
  revokeAdminSessionServer,
  setAdminSessionCookie,
} from "./admin-session.server";
import { SESSION_INACTIVITY_MS } from "./session-config";

function getClientIp(req: Request): string {
  const forwardedFor = req.headers.get("x-forwarded-for");
  if (forwardedFor) {
    const clientIp = forwardedFor.split(",")[0]?.trim();
    if (clientIp) return clientIp;
  }

  return (
    req.headers.get("cf-connecting-ip")?.trim() ||
    req.headers.get("x-real-ip")?.trim() ||
    "unknown"
  );
}

export async function handleAdminLogin(req: Request): Promise<NextResponse> {
  let phase: "rate_limit" | "admin_lookup" | "session" = "rate_limit";
  try {
    let rawBody: unknown;
    try {
      rawBody = await req.json();
    } catch {
      return NextResponse.json(
        { success: false, code: "invalid_request", message: "Email and password are required" },
        { status: 400 },
      );
    }

    const parsed = adminLoginSchema.safeParse(rawBody);
    if (!parsed.success) {
      return validationErrorResponse(parsed.error, "Invalid credentials");
    }

    const ip = getClientIp(req);
    const rateLimit = await consumeAdminLoginAttempt(ip);

    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          success: false,
          code: "rate_limited",
          message: "Too many attempts. Please wait before trying again.",
          retryAfterSeconds: rateLimit.retryAfterSeconds,
        },
        {
          status: 429,
          headers: { "Retry-After": String(rateLimit.retryAfterSeconds) },
        },
      );
    }

    phase = "admin_lookup";
    const { email, password } = parsed.data;
    const admin = await authenticateAdmin(email, password);

    if (!admin) {
      return NextResponse.json(
        { success: false, code: "invalid_credentials", message: "Invalid credentials" },
        { status: 401 },
      );
    }

    await resetAdminLoginAttempts(ip).catch(() => undefined);

    phase = "session";
    const { token, session } = await issueAdminSession(admin, {
      ip,
      userAgent: req.headers.get("user-agent"),
    });
    await setAdminSessionCookie(token);

    return NextResponse.json({
      success: true,
      message: "Admin authentication successful",
      user: {
        email: admin.email,
        name: admin.name,
        role: admin.role,
      },
      expiresAt: session.expiresAt,
      inactivityExpiresAt: session.lastActivityAt + SESSION_INACTIVITY_MS,
    });
  } catch (error) {
    if (error instanceof AdminRecordNotFoundError) {
      return NextResponse.json(
        {
          success: false,
          code: "admin_not_found",
          message: "We couldn't find an admin account for that email. Check the address or contact your system administrator.",
        },
        { status: 503 },
      );
    }

    const message = error instanceof Error ? error.message : "";
    if (message.includes("MONGODB_URI")) {
      return NextResponse.json(
        {
          success: false,
          code: "database_not_configured",
          message: "We can't check your admin account right now. Please try again shortly. If this continues, contact your system administrator.",
        },
        { status: 503 },
      );
    }

    if (message.includes("ADMIN_SESSION_SECRET")) {
      return NextResponse.json(
        {
          success: false,
          code: "session_not_configured",
          message: "Your admin session couldn't be started. Please try again. If this continues, contact your system administrator.",
        },
        { status: 503 },
      );
    }

    const errorCode =
      error && typeof error === "object" && "code" in error
        ? String(error.code)
        : undefined;
    console.error("[admin-auth] Login request failed", {
      phase,
      errorName: error instanceof Error ? error.name : "unknown",
      errorCode,
    });

    return NextResponse.json(
      {
        success: false,
        code: phase === "session" ? "session_unavailable" : "database_unavailable",
        message:
          phase === "session"
            ? "Your admin session couldn't be started. Please try again. If this continues, contact your system administrator."
            : "We can't check your admin account right now. Please try again shortly. If this continues, contact your system administrator.",
      },
      { status: 503 },
    );
  }
}

export async function handleAdminRefresh(): Promise<NextResponse> {
  try {
    const session = await refreshAdminSessionServer();

    if (!session) {
      await clearAdminSessionCookie();
      return NextResponse.json(
        {
          success: false,
          code: "session_expired",
          message: "Session expired due to inactivity",
        },
        { status: 401 },
      );
    }

    return NextResponse.json({
      success: true,
      user: { email: session.email, role: session.role },
      expiresAt: session.expiresAt,
      lastActivityAt: session.lastActivityAt,
      inactivityExpiresAt: session.lastActivityAt + SESSION_INACTIVITY_MS,
    });
  } catch {
    return NextResponse.json(
      { success: false, message: "Session refresh is temporarily unavailable" },
      { status: 503 },
    );
  }
}

export async function handleAdminLogout(): Promise<NextResponse> {
  await revokeAdminSessionServer().catch(() => undefined);
  await clearAdminSessionCookie();

  return NextResponse.json({ success: true, message: "Logged out successfully" });
}

export async function handleAdminSessionStatus(): Promise<NextResponse> {
  try {
    const session = await getAdminSessionServer();

    if (!session) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    return NextResponse.json({
      authenticated: true,
      user: { email: session.email, role: session.role },
      expiresAt: session.expiresAt,
      lastActivityAt: session.lastActivityAt,
    });
  } catch {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
}

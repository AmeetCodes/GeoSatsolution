import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  createSessionToken,
  verifySessionToken,
} from "@/app/admin/_lib/admin-auth";
import { authenticateAdmin } from "@/lib/db/services/admin-auth.service";
import { adminLoginSchema } from "@/lib/validations/auth.schema";
import { validationErrorResponse } from "@/lib/validations/utils";

export async function POST(req: Request) {
  try {
    let rawBody: unknown;
    try {
      rawBody = await req.json();
    } catch {
      return NextResponse.json(
        { success: false, message: "Email and password are required" },
        { status: 400 }
      );
    }

    const parsed = adminLoginSchema.safeParse(rawBody);
    if (!parsed.success) {
      return validationErrorResponse(parsed.error, "Email and password are required");
    }

    const { email, password, rememberMe } = parsed.data;

    const admin = await authenticateAdmin(email, password);
    if (!admin) {
      return NextResponse.json(
        { success: false, message: "Invalid email or password" },
        { status: 401 }
      );
    }

    const durationDays = rememberMe ? 30 : 1;
    const token = createSessionToken(admin.email, admin.role, durationDays);

    const cookieStore = await cookies();
    cookieStore.set("geosat_admin_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: durationDays * 24 * 60 * 60,
    });

    return NextResponse.json({
      success: true,
      message: "Admin authentication successful",
      user: {
        email: admin.email,
        name: admin.name,
        role: admin.role,
      },
    });
  } catch {
    return NextResponse.json(
      { success: false, message: "Authentication service is temporarily unavailable" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("geosat_admin_session")?.value;
    const session = verifySessionToken(token);

    if (!session) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    return NextResponse.json({
      authenticated: true,
      user: { email: session.email, role: session.role },
    });
  } catch {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
}

export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.delete("geosat_admin_session");
  return NextResponse.json({ success: true, message: "Logged out successfully" });
}

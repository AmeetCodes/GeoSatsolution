import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  validateAdminCredentials,
  createSessionToken,
  verifySessionToken,
} from "@/lib/admin-auth";

export async function POST(req: Request) {
  try {
    const { email, password, rememberMe } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Email and password are required" },
        { status: 400 }
      );
    }

    const isValid = validateAdminCredentials(email, password);

    if (!isValid) {
      return NextResponse.json(
        { success: false, message: "Invalid email or administrative password" },
        { status: 401 }
      );
    }

    const durationDays = rememberMe ? 30 : 1;
    const token = createSessionToken(email, durationDays);

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
      user: { email, role: "admin" },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error?.message || "Internal server error" },
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

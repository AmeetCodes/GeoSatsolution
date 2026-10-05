import { NextResponse } from "next/server";
import { industryService } from "@/lib/db/services/industry.service";
import { getAdminSessionServer } from "@/app/admin/_lib/admin-auth";

export const dynamic = "force-dynamic";

type RouteProps = {
  params: Promise<{ slug: string }>;
};

export async function GET(req: Request, { params }: RouteProps) {
  try {
    const { slug } = await params;
    const session = await getAdminSessionServer();
    const industry = await industryService.getBySlug(slug, !session);

    if (!industry) {
      return NextResponse.json({ success: false, message: "Industry sector not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: industry });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error?.message || "Failed to fetch industry" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request, { params }: RouteProps) {
  try {
    const session = await getAdminSessionServer();
    if (!session) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const { slug } = await params;
    const body = await req.json();
    const updated = await industryService.update(slug, body);

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error?.message || "Failed to update industry" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request, { params }: RouteProps) {
  try {
    const session = await getAdminSessionServer();
    if (!session) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const { slug } = await params;
    const deleted = await industryService.delete(slug);

    if (!deleted) {
      return NextResponse.json({ success: false, message: "Industry sector not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Industry sector deleted" });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error?.message || "Failed to delete industry" },
      { status: 500 }
    );
  }
}

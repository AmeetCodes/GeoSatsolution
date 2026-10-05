import { NextResponse } from "next/server";
import { solutionService } from "@/lib/db/services/solution.service";
import { getAdminSessionServer } from "@/app/admin/_lib/admin-auth";

export const dynamic = "force-dynamic";

type RouteProps = {
  params: Promise<{ slug: string }>;
};

export async function GET(req: Request, { params }: RouteProps) {
  try {
    const { slug } = await params;
    const session = await getAdminSessionServer();
    const solution = await solutionService.getBySlug(slug, !session);

    if (!solution) {
      return NextResponse.json({ success: false, message: "Solution not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: solution });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error?.message || "Failed to fetch solution" },
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
    const updated = await solutionService.update(slug, body);

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error?.message || "Failed to update solution" },
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
    const deleted = await solutionService.delete(slug);

    if (!deleted) {
      return NextResponse.json({ success: false, message: "Solution not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Solution deleted" });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error?.message || "Failed to delete solution" },
      { status: 500 }
    );
  }
}

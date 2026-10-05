import { NextResponse } from "next/server";
import { solutionService } from "@/lib/db/services/solution.service";
import { getAdminSessionServer } from "@/app/admin/_lib/admin-auth";
import { solutionItemSchema } from "@/lib/validations/solution.schema";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const group = searchParams.get("group") || undefined;
    const includeDrafts = searchParams.get("includeDrafts") === "true";

    const session = includeDrafts ? await getAdminSessionServer() : null;
    const solutions = session
      ? await solutionService.getAllForAdmin(group)
      : await solutionService.getAllPublished();

    return NextResponse.json({ success: true, data: solutions });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error?.message || "Failed to fetch solutions" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await getAdminSessionServer();
    if (!session) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = solutionItemSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: "Validation error", errors: parsed.error.issues },
        { status: 400 }
      );
    }

    const created = await solutionService.create(parsed.data);
    return NextResponse.json({ success: true, data: created }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error?.message || "Failed to create solution" },
      { status: 500 }
    );
  }
}

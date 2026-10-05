import { NextResponse } from "next/server";
import { industryService } from "@/lib/db/services/industry.service";
import { getAdminSessionServer } from "@/app/admin/_lib/admin-auth";
import { industryItemSchema } from "@/lib/validations/industry.schema";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const includeDrafts = searchParams.get("includeDrafts") === "true";

    const session = includeDrafts ? await getAdminSessionServer() : null;
    const industries = session
      ? await industryService.getAllForAdmin()
      : await industryService.getAllPublished();

    return NextResponse.json({ success: true, data: industries });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error?.message || "Failed to fetch industries" },
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
    const parsed = industryItemSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: "Validation error", errors: parsed.error.issues },
        { status: 400 }
      );
    }

    const created = await industryService.create(parsed.data);
    return NextResponse.json({ success: true, data: created }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error?.message || "Failed to create industry" },
      { status: 500 }
    );
  }
}

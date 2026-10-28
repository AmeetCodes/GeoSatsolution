import { NextResponse } from "next/server";
import { getAdminSessionServer } from "@/app/admin/_lib/admin-auth";
import { inquiryService } from "@/lib/db/services/inquiry.service";
import { updateInquirySchema } from "@/lib/validations/inquiry.schema";
import { validationErrorResponse } from "@/lib/validations/utils";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getAdminSessionServer();
    if (!session) {
      return NextResponse.json(
        { success: false, message: "Unauthorized. Admin session required." },
        { status: 401 },
      );
    }

    const [data, counts] = await Promise.all([
      inquiryService.list(),
      inquiryService.statusCounts(),
    ]);

    return NextResponse.json({ success: true, data, counts });
  } catch (error: unknown) {
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Failed to load inquiries",
      },
      { status: 500 },
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await getAdminSessionServer();
    if (!session) {
      return NextResponse.json(
        { success: false, message: "Unauthorized. Admin session required." },
        { status: 401 },
      );
    }

    let rawBody: unknown;
    try {
      rawBody = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, message: "Invalid JSON payload" },
        { status: 400 },
      );
    }

    const parsed = updateInquirySchema.safeParse(rawBody);
    if (!parsed.success) {
      return validationErrorResponse(parsed.error, "Inquiry update is invalid");
    }

    const updated = await inquiryService.updateStatus(parsed.data.id, parsed.data.status);
    if (!updated) {
      return NextResponse.json(
        { success: false, message: "Inquiry not found." },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, message: "Inquiry status updated", data: updated });
  } catch (error: unknown) {
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Failed to update inquiry",
      },
      { status: 500 },
    );
  }
}

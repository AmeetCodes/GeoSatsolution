import { NextResponse } from "next/server";
import { getAdminSessionServer } from "@/app/admin/_lib/admin-auth";
import { districtProjectService } from "@/lib/db/services/district-project.service";
import { districtProjectsRequestSchema } from "@/lib/validations/district-project.schema";
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

    const data = await districtProjectService.listRecords();
    return NextResponse.json({ success: true, data });
  } catch (error: unknown) {
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Failed to load district projects",
      },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
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

    const parsed = districtProjectsRequestSchema.safeParse(rawBody);
    if (!parsed.success) {
      return validationErrorResponse(parsed.error, "District project request is invalid");
    }

    const request_ = parsed.data;

    switch (request_.action) {
      case "create": {
        const created = await districtProjectService.create(request_.data);
        return NextResponse.json({ success: true, message: "Project added", data: created });
      }
      case "increment": {
        const created = await districtProjectService.increment(request_.data);
        return NextResponse.json({ success: true, message: "Project count increased", data: created });
      }
      case "decrement": {
        const removed = await districtProjectService.decrement(request_.data.district);
        if (!removed) {
          return NextResponse.json(
            { success: false, message: "No projects to remove in this district." },
            { status: 404 },
          );
        }
        return NextResponse.json({ success: true, message: "Project count decreased" });
      }
      case "set": {
        const data = await districtProjectService.setDistrictProjects(request_.data);
        return NextResponse.json({ success: true, message: "District updated", data });
      }
      case "delete-district": {
        const removed = await districtProjectService.removeDistrict(request_.data.district);
        if (removed === 0) {
          return NextResponse.json(
            { success: false, message: "No projects found in this district." },
            { status: 404 },
          );
        }
        return NextResponse.json({ success: true, message: "District projects removed" });
      }
      case "update": {
        const updated = await districtProjectService.update(request_.id, request_.data);
        if (!updated) {
          return NextResponse.json(
            { success: false, message: "District project not found." },
            { status: 404 },
          );
        }
        return NextResponse.json({ success: true, message: "Project updated", data: updated });
      }
      case "delete": {
        const removed = await districtProjectService.remove(request_.id);
        if (!removed) {
          return NextResponse.json(
            { success: false, message: "District project not found." },
            { status: 404 },
          );
        }
        return NextResponse.json({ success: true, message: "Project deleted" });
      }
      default:
        return NextResponse.json(
          { success: false, message: "Unsupported action" },
          { status: 400 },
        );
    }
  } catch (error: unknown) {
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Failed to save district project",
      },
      { status: 500 },
    );
  }
}

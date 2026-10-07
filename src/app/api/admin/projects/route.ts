import { NextResponse } from "next/server";
import { z } from "zod";
import { getAdminSessionServer } from "@/app/admin/_lib/admin-auth";
import { DEFAULT_PROJECTS } from "@/lib/data/project-content";
import { contentService } from "@/lib/db/services/content.service";
import type { ProjectItem } from "@/lib/data/project-content";
import { projectListSchema } from "@/lib/validations/project.schema";
import { parsePayload, validationErrorResponse } from "@/lib/validations/utils";

const projectsRequestSchema = z.discriminatedUnion("action", [
  z.object({ action: z.literal("reset") }),
  z.object({ action: z.literal("save"), data: z.unknown() }),
]);

export const dynamic = "force-dynamic";

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

    const parsedRequest = projectsRequestSchema.safeParse(rawBody);
    if (!parsedRequest.success) {
      return validationErrorResponse(parsedRequest.error, "Project request is invalid");
    }

    let projects: ProjectItem[];
    if (parsedRequest.data.action === "reset") {
      projects = DEFAULT_PROJECTS;
    } else {
      const parsedProjects = parsePayload(
        projectListSchema,
        parsedRequest.data.data,
        "Project data is invalid",
      );
      if (!parsedProjects.ok) return parsedProjects.response;
      projects = parsedProjects.data;
    }

    const saved = await contentService.replaceProjects(projects);
    return NextResponse.json({
      success: true,
      message: "Projects saved successfully",
      data: saved.map(({ code, title, sector, body, tags, images, isPublished }) => ({ code, title, sector, body, tags, images: images || [], isPublished: isPublished !== false })),
    });
  } catch (error: unknown) {
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Failed to save projects",
      },
      { status: 500 },
    );
  }
}

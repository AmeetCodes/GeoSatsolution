import { NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { getAdminSessionServer } from "@/app/admin/_lib/admin-auth";
import { siteContentService } from "@/lib/db/services/site-content.service";
import { adminContentRequestSchema, siteContentSchema, siteContentSectionPayloadSchemas } from "@/lib/validations/content.schema";
import { parsePayload, validationErrorResponse } from "@/lib/validations/utils";
import { getErrorMessage } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  if (!(await getAdminSessionServer())) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  try {
    const content = await siteContentService.getFullSiteContent();
    const section = new URL(request.url).searchParams.get("section");
    return NextResponse.json({ success: true, data: section && section in content ? content[section as keyof typeof content] : content });
  } catch (error) {
    return NextResponse.json({ success: false, message: getErrorMessage(error, "Failed to load content") }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (!(await getAdminSessionServer())) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  try {
    let body: unknown;
    try { body = await request.json(); } catch { return NextResponse.json({ success: false, message: "Invalid JSON payload" }, { status: 400 }); }
    const parsed = adminContentRequestSchema.safeParse(body);
    if (!parsed.success) return validationErrorResponse(parsed.error, "Content payload is invalid");
    const { action, section, data } = parsed.data;
    if (action === "reset") return NextResponse.json({ success: false, message: "Reset to bundled content is disabled; manage content in the database." }, { status: 400 });

    if (action === "update-all") {
      const all = parsePayload(siteContentSchema, data, "Content payload is invalid");
      if (!all.ok) return all.response;
      for (const key of ["Solutions", "Products", "Industries", "Company"] as const) {
        await siteContentService.updateSection(key, all.data[key]);
      }
    } else if (section) {
      const value = parsePayload(siteContentSectionPayloadSchemas[section], data, "Content payload is invalid");
      if (!value.ok) return value.response;
      await siteContentService.updateSection(section, value.data);
    }

    const refreshed = await siteContentService.getFullSiteContent();
    revalidateTag("public-navigation", { expire: 0 });
    revalidatePath("/", "layout");
    return NextResponse.json({ success: true, data: section ? refreshed[section] : refreshed });
  } catch (error) {
    return NextResponse.json({ success: false, message: getErrorMessage(error, "Failed to update content") }, { status: 500 });
  }
}

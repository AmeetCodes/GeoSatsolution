import { NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { getAdminSessionServer } from "@/app/admin/_lib/admin-auth";
import { siteContentService } from "@/lib/db/services/site-content.service";
import {
  adminContentRequestSchema,
  siteContentSchema,
  siteContentSectionPayloadSchemas,
} from "@/lib/validations/content.schema";
import { parsePayload, validationErrorResponse } from "@/lib/validations/utils";
import { getErrorMessage } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const section = searchParams.get("section");
    const content = await siteContentService.getFullSiteContent();

    if (section && section in content) {
      const key = section as keyof typeof content;
      return NextResponse.json({
        success: true,
        data: content[key],
      });
    }

    return NextResponse.json({
      success: true,
      data: content,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: getErrorMessage(error, "Failed to load content") },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await getAdminSessionServer();
    if (!session) {
      return NextResponse.json(
        { success: false, message: "Unauthorized. Admin session required." },
        { status: 401 }
      );
    }

    let rawBody: unknown;
    try {
      rawBody = await req.json();
    } catch {
      return NextResponse.json(
        { success: false, message: "Invalid JSON payload" },
        { status: 400 }
      );
    }

    const parsed = adminContentRequestSchema.safeParse(rawBody);
    if (!parsed.success) {
      return validationErrorResponse(parsed.error, "Content payload is invalid");
    }

    const { action, section, data } = parsed.data;

    if (action === "reset") {
      const resetData = await siteContentService.resetAll();
      revalidateTag("public-navigation", { expire: 0 });
      revalidatePath("/", "layout");
      return NextResponse.json({
        success: true,
        message: "Content successfully restored to default state in database",
        data: resetData,
      });
    }

    if (action === "update-all") {
      const parsedData = parsePayload(siteContentSchema, data, "Content payload is invalid");
      if (!parsedData.ok) return parsedData.response;

      await siteContentService.updateSection("Solutions", parsedData.data.Solutions);
      await siteContentService.updateSection("Products", parsedData.data.Products);
      await siteContentService.updateSection("Industries", parsedData.data.Industries);
      await siteContentService.updateSection("Company", parsedData.data.Company);

      const refreshed = await siteContentService.getFullSiteContent();
      revalidateTag("public-navigation", { expire: 0 });
      revalidatePath("/", "layout");
      return NextResponse.json({
        success: true,
        message: "Full site content saved successfully to database",
        data: refreshed,
      });
    }

    if (!section) {
      return NextResponse.json(
        { success: false, message: "Content payload is invalid" },
        { status: 400 }
      );
    }

    const parsedData = parsePayload(
      siteContentSectionPayloadSchemas[section],
      data,
      "Content payload is invalid",
    );
    if (!parsedData.ok) return parsedData.response;

    await siteContentService.updateSection(section, parsedData.data);
    const refreshed = await siteContentService.getFullSiteContent();
    revalidateTag("public-navigation", { expire: 0 });
    revalidatePath("/", "layout");

    return NextResponse.json({
      success: true,
      message: `${section} updated successfully in database`,
      data: refreshed[section],
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: getErrorMessage(error, "Failed to update content") },
      { status: 500 }
    );
  }
}

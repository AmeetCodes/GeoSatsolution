import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { getAdminSessionServer } from "@/app/admin/_lib/admin-auth";
import { getNavigationTree } from "@/lib/tree-store";
import {
  getSiteContent,
  saveSiteContent,
  DEFAULT_SITE_CONTENT,
} from "@/lib/data-store";
import {
  adminContentRequestSchema,
  siteContentSchema,
  siteContentSectionPayloadSchemas,
} from "@/lib/validations/content.schema";
import { parsePayload, validationErrorResponse } from "@/lib/validations/utils";

function refreshContentPaths() {
  revalidatePath("/", "layout");

  const tree = getNavigationTree();
  for (const tab of tree.tabs) {
    if (tab.href && tab.href.startsWith("/")) {
      revalidatePath(tab.href);
    }
    for (const column of tab.columns) {
      for (const item of column.items) {
        if (item.href) {
          revalidatePath(item.href);
        }
      }
    }
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const section = searchParams.get("section");
    const content = getSiteContent();

    if (section && section in content) {
      return NextResponse.json({
        success: true,
        data: (content as any)[section],
      });
    }

    return NextResponse.json({
      success: true,
      data: content,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error?.message || "Failed to load content" },
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
      saveSiteContent(DEFAULT_SITE_CONTENT);
      refreshContentPaths();
      return NextResponse.json({
        success: true,
        message: "Content successfully restored to default state",
        data: DEFAULT_SITE_CONTENT,
      });
    }

    if (action === "update-all") {
      const parsedData = parsePayload(siteContentSchema, data, "Content payload is invalid");
      if (!parsedData.ok) return parsedData.response;

      saveSiteContent(parsedData.data);
      refreshContentPaths();
      return NextResponse.json({
        success: true,
        message: "Full site content saved successfully",
        data: parsedData.data,
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

    const currentContent = getSiteContent();
    (currentContent as unknown as Record<string, unknown>)[section] = parsedData.data;
    saveSiteContent(currentContent);
    refreshContentPaths();

    return NextResponse.json({
      success: true,
      message: `${section} updated successfully`,
      data: parsedData.data,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error?.message || "Failed to update content" },
      { status: 500 }
    );
  }
}

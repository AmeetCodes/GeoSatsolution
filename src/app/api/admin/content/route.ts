import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { getAdminSessionServer } from "@/app/admin/_lib/admin-auth";
import { getNavigationTree } from "@/lib/tree-store";
import {
  getSiteContent,
  saveSiteContent,
  DEFAULT_SITE_CONTENT,
  type SiteContentData,
} from "@/lib/data-store";

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

    const body = await req.json();
    const { action, section, data } = body;

    // Reset action
    if (action === "reset") {
      saveSiteContent(DEFAULT_SITE_CONTENT);
      refreshContentPaths();
      return NextResponse.json({
        success: true,
        message: "Content successfully restored to default state",
        data: DEFAULT_SITE_CONTENT,
      });
    }

    const currentContent = getSiteContent();

    if (action === "update-all") {
      if (!data) {
        return NextResponse.json({ success: false, message: "Missing data" }, { status: 400 });
      }
      saveSiteContent(data as SiteContentData);
      refreshContentPaths();
      return NextResponse.json({
        success: true,
        message: "Full site content saved successfully",
        data,
      });
    }

    if (section && section in currentContent) {
      (currentContent as any)[section] = data;
      saveSiteContent(currentContent);
      refreshContentPaths();
      return NextResponse.json({
        success: true,
        message: `${section} updated successfully`,
        data: (currentContent as any)[section],
      });
    }

    return NextResponse.json(
      { success: false, message: "Invalid section or action" },
      { status: 400 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error?.message || "Failed to update content" },
      { status: 500 }
    );
  }
}

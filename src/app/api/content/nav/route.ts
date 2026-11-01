import { unstable_cache } from "next/cache";
import { NextResponse } from "next/server";
import { navigationService } from "@/lib/db/services/navigation.service";
import { siteContentService } from "@/lib/db/services/site-content.service";
import { getErrorMessage } from "@/lib/utils";

export const dynamic = "force-dynamic";

const getCachedNavigationPayload = unstable_cache(async () => {
  const [tree, content] = await Promise.all([navigationService.getTree(), siteContentService.getFullSiteContent()]);
  const groups = (id: string) => (tree.tabs.find((tab) => tab.id === id)?.columns || []).map((column) => ({
    title: column.title,
    links: column.items.map((item) => item.title),
  }));
  const industries = (tree.tabs.find((tab) => tab.id === "industries")?.columns || []).map((column) => ({
    title: column.title,
    intro: column.items[0]?.intro || "",
    description: column.items[0]?.description || "",
    items: column.items.map((item) => item.title),
  }));
  return {
    tree,
    tabs: tree.tabs,
    solutionGroups: groups("solutions"),
    productGroups: groups("products"),
    companyGroups: groups("company"),
    industries,
    solutions: content.Solutions.filter((item: { isPublished?: boolean }) => item.isPublished !== false),
    products: content.Products.filter((item: { isPublished?: boolean }) => item.isPublished !== false),
  };
}, ["public-navigation-payload-v2"], { revalidate: 3600, tags: ["public-navigation"] });

export async function GET() {
  try {
    return NextResponse.json({ success: true, data: await getCachedNavigationPayload() });
  } catch (error) {
    return NextResponse.json({ success: false, message: getErrorMessage(error) }, { status: 500 });
  }
}

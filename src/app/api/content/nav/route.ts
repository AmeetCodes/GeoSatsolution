import { unstable_cache } from "next/cache";
import { NextResponse } from "next/server";
import { navigationService } from "@/lib/db/services/navigation.service";
import { siteContentService } from "@/lib/db/services/site-content.service";

export const dynamic = "force-dynamic";

const getCachedNavigationPayload = unstable_cache(
  async () => {
    const [tree, content] = await Promise.all([
      navigationService.getTree(),
      siteContentService.getFullSiteContent(),
    ]);

    // Extract solution groups directly from the dynamic tree
    const solutionsTab = tree.tabs.find((t) => t.id === "solutions");
    const solutionGroups = (solutionsTab?.columns || []).map((col) => ({
      title: col.title,
      links: col.items.map((i) => i.title),
    }));

    // Extract product groups directly from the dynamic tree
    const productsTab = tree.tabs.find((t) => t.id === "products");
    const productGroups = (productsTab?.columns || []).map((col) => ({
      title: col.title,
      links: col.items.map((i) => i.title),
    }));

    // Extract company groups directly from the dynamic tree
    const companyTab = tree.tabs.find((t) => t.id === "company");
    const companyGroups = (companyTab?.columns || []).map((col) => ({
      title: col.title,
      links: col.items.map((i) => i.title),
    }));

    // Extract industries cards directly from the dynamic tree
    const industriesTab = tree.tabs.find((t) => t.id === "industries");
    const industries = (industriesTab?.columns || []).map((col) => ({
      title: col.title,
      intro: col.items[0]?.intro || "",
      description: col.items[0]?.description || "",
      items: col.items.map((i) => i.title),
    }));

    return {
      tree,
      tabs: tree.tabs,
      solutionGroups,
      productGroups,
      companyGroups,
      industries,
      solutions: content.Solutions,
      products: content.Products,
    };
  },
  ["public-navigation-payload-v2"],
  { revalidate: 3600, tags: ["public-navigation"] },
);

export async function GET() {
  try {
    const data = await getCachedNavigationPayload();
    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error?.message }, { status: 500 });
  }
}

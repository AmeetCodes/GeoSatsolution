import { NextResponse } from "next/server";
import { getNavigationTree } from "@/lib/tree-store";
import { getSiteContent } from "@/lib/data-store";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const tree = getNavigationTree();
    const content = getSiteContent();

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

    return NextResponse.json({
      success: true,
      data: {
        tree, // Full dynamic hierarchical navigation tree
        tabs: tree.tabs,
        solutionGroups,
        productGroups,
        companyGroups,
        industries,
        solutions: content.Solutions,
        products: content.Products,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error?.message }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getAdminSessionServer } from "@/lib/admin-auth";
import {
  getNavigationTree,
  saveNavigationTree,
  DEFAULT_NAVIGATION_TREE,
  type NavigationTree,
  type NavTreeTab,
  type NavTreeColumn,
  type NavTreeItem,
  slugify,
} from "@/lib/tree-store";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const tree = getNavigationTree();
    return NextResponse.json({ success: true, data: tree });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error?.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getAdminSessionServer();
    if (!session) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { action, tree, tabId, columnId, itemId, payload } = body;

    // Action 1: Reset to factory default
    if (action === "reset") {
      saveNavigationTree(DEFAULT_NAVIGATION_TREE);
      revalidatePath("/", "layout");
      return NextResponse.json({
        success: true,
        message: "Navigation tree reset to factory defaults",
        data: DEFAULT_NAVIGATION_TREE,
      });
    }

    // Action 2: Save entire tree directly
    if (action === "saveTree" && tree) {
      saveNavigationTree(tree);
      revalidatePath("/", "layout");
      return NextResponse.json({
        success: true,
        message: "Navigation tree saved successfully",
        data: tree,
      });
    }

    const currentTree: NavigationTree = getNavigationTree();

    // Action 3: Add new Level 1 Tab
    if (action === "addTab") {
      const { label, href, footerNote, catalogueCta } = payload;
      const id = slugify(label);
      const newTab: NavTreeTab = {
        id,
        label,
        slug: id,
        href: href || `#${id}`,
        order: currentTree.tabs.length + 1,
        type: "columns",
        footerNote: footerNote || "Every engagement is scoped against a tolerance, not a template.",
        catalogueCta: catalogueCta || `Request the full ${label.toLowerCase()} catalogue`,
        columns: [],
      };
      currentTree.tabs.push(newTab);
      saveNavigationTree(currentTree);
      revalidatePath("/", "layout");
      return NextResponse.json({ success: true, message: `Added tab "${label}"`, data: currentTree });
    }

    // Action 4: Edit Level 1 Tab
    if (action === "editTab" && tabId) {
      const tab = currentTree.tabs.find((t) => t.id === tabId);
      if (!tab) return NextResponse.json({ success: false, message: "Tab not found" }, { status: 404 });
      if (payload.label) tab.label = payload.label;
      if (payload.href !== undefined) tab.href = payload.href;
      if (payload.footerNote !== undefined) tab.footerNote = payload.footerNote;
      if (payload.catalogueCta !== undefined) tab.catalogueCta = payload.catalogueCta;
      saveNavigationTree(currentTree);
      revalidatePath("/", "layout");
      return NextResponse.json({ success: true, message: `Updated tab "${tab.label}"`, data: currentTree });
    }

    // Action 5: Delete Level 1 Tab
    if (action === "deleteTab" && tabId) {
      currentTree.tabs = currentTree.tabs.filter((t) => t.id !== tabId);
      saveNavigationTree(currentTree);
      revalidatePath("/", "layout");
      return NextResponse.json({ success: true, message: `Deleted tab`, data: currentTree });
    }

    // Action 6: Reorder Tabs
    if (action === "reorderTabs" && Array.isArray(payload.tabIds)) {
      const tabMap = new Map(currentTree.tabs.map((t) => [t.id, t]));
      const reordered: NavTreeTab[] = [];
      payload.tabIds.forEach((id: string, index: number) => {
        const tab = tabMap.get(id);
        if (tab) {
          tab.order = index + 1;
          reordered.push(tab);
          tabMap.delete(id);
        }
      });
      // Append any remaining
      tabMap.forEach((tab) => reordered.push(tab));
      currentTree.tabs = reordered;
      saveNavigationTree(currentTree);
      revalidatePath("/", "layout");
      return NextResponse.json({ success: true, message: "Tabs reordered", data: currentTree });
    }

    // Level 2 Column operations
    const targetTab = currentTree.tabs.find((t) => t.id === tabId);
    if (!targetTab && (action.includes("Column") || action.includes("Item"))) {
      return NextResponse.json({ success: false, message: `Tab "${tabId}" not found` }, { status: 404 });
    }

    // Action 7: Add Column to Tab
    if (action === "addColumn" && targetTab) {
      const { title } = payload;
      const slug = slugify(title);
      const newCol: NavTreeColumn = {
        id: `col-${slug}-${Date.now().toString().slice(-4)}`,
        title,
        slug,
        order: targetTab.columns.length + 1,
        items: [],
      };
      targetTab.columns.push(newCol);
      saveNavigationTree(currentTree);
      revalidatePath("/", "layout");
      return NextResponse.json({ success: true, message: `Added column "${title}"`, data: currentTree });
    }

    // Action 8: Edit Column
    if (action === "editColumn" && targetTab && columnId) {
      const col = targetTab.columns.find((c) => c.id === columnId);
      if (!col) return NextResponse.json({ success: false, message: "Column not found" }, { status: 404 });
      if (payload.title) {
        col.title = payload.title;
        col.slug = slugify(payload.title);
      }
      saveNavigationTree(currentTree);
      revalidatePath("/", "layout");
      return NextResponse.json({ success: true, message: `Updated column "${col.title}"`, data: currentTree });
    }

    // Action 9: Delete Column
    if (action === "deleteColumn" && targetTab && columnId) {
      targetTab.columns = targetTab.columns.filter((c) => c.id !== columnId);
      saveNavigationTree(currentTree);
      revalidatePath("/", "layout");
      return NextResponse.json({ success: true, message: "Deleted column", data: currentTree });
    }

    // Action 10: Reorder Columns within Tab
    if (action === "reorderColumns" && targetTab && Array.isArray(payload.columnIds)) {
      const colMap = new Map(targetTab.columns.map((c) => [c.id, c]));
      const reordered: NavTreeColumn[] = [];
      payload.columnIds.forEach((id: string, index: number) => {
        const col = colMap.get(id);
        if (col) {
          col.order = index + 1;
          reordered.push(col);
          colMap.delete(id);
        }
      });
      colMap.forEach((col) => reordered.push(col));
      targetTab.columns = reordered;
      saveNavigationTree(currentTree);
      revalidatePath("/", "layout");
      return NextResponse.json({ success: true, message: "Columns reordered", data: currentTree });
    }

    // Level 3 Item operations
    const targetColumn = targetTab?.columns.find((c) => c.id === columnId);
    if (!targetColumn && action.includes("Item") && action !== "reorderItems") {
      return NextResponse.json({ success: false, message: `Column "${columnId}" not found` }, { status: 404 });
    }

    // Action 11: Add Item to Column
    if (action === "addItem" && targetTab && targetColumn) {
      const { title, intro, description, outcomes, href } = payload;
      const slug = slugify(title);
      const generatedHref = href || `/${targetTab.slug}/${slug}`;
      const newItem: NavTreeItem = {
        id: `item-${slug}-${Date.now().toString().slice(-4)}`,
        title,
        slug,
        href: generatedHref,
        order: targetColumn.items.length + 1,
        intro: intro || "",
        description: description || "",
        outcomes: outcomes || [],
      };
      targetColumn.items.push(newItem);
      saveNavigationTree(currentTree);
      revalidatePath("/", "layout");
      return NextResponse.json({ success: true, message: `Added item "${title}"`, data: currentTree });
    }

    // Action 12: Edit Item / CMS Content
    if (action === "editItem" && targetTab && targetColumn && itemId) {
      const item = targetColumn.items.find((i) => i.id === itemId);
      if (!item) return NextResponse.json({ success: false, message: "Item not found" }, { status: 404 });
      if (payload.title) {
        item.title = payload.title;
        item.slug = slugify(payload.title);
      }
      if (payload.href !== undefined) item.href = payload.href;
      if (payload.intro !== undefined) item.intro = payload.intro;
      if (payload.description !== undefined) item.description = payload.description;
      if (payload.outcomes !== undefined) item.outcomes = payload.outcomes;
      if (payload.images !== undefined) item.images = payload.images;
      if (payload.metadata !== undefined) item.metadata = payload.metadata;
      saveNavigationTree(currentTree);
      revalidatePath("/", "layout");
      return NextResponse.json({ success: true, message: `Updated item "${item.title}"`, data: currentTree });
    }

    // Action 13: Delete Item
    if (action === "deleteItem" && targetTab && targetColumn && itemId) {
      targetColumn.items = targetColumn.items.filter((i) => i.id !== itemId);
      saveNavigationTree(currentTree);
      revalidatePath("/", "layout");
      return NextResponse.json({ success: true, message: "Deleted item", data: currentTree });
    }

    // Action 14: Reorder Items within Column
    if (action === "reorderItems" && targetTab && targetColumn && Array.isArray(payload.itemIds)) {
      const itemMap = new Map(targetColumn.items.map((i) => [i.id, i]));
      const reordered: NavTreeItem[] = [];
      payload.itemIds.forEach((id: string, index: number) => {
        const item = itemMap.get(id);
        if (item) {
          item.order = index + 1;
          reordered.push(item);
          itemMap.delete(id);
        }
      });
      itemMap.forEach((item) => reordered.push(item));
      targetColumn.items = reordered;
      saveNavigationTree(currentTree);
      revalidatePath("/", "layout");
      return NextResponse.json({ success: true, message: "Items reordered", data: currentTree });
    }

    return NextResponse.json({ success: false, message: "Unknown action" }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error?.message }, { status: 500 });
  }
}

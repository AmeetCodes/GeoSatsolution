import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getAdminSessionServer } from "@/app/admin/_lib/admin-auth";
import { navigationService } from "@/lib/db/services/navigation.service";
import { solutionRepository } from "@/lib/db/repositories/solution.repository";
import { productRepository } from "@/lib/db/repositories/product.repository";
import { industryRepository } from "@/lib/db/repositories/industry.repository";
import {
  type NavigationTree,
  type NavTreeTab,
  type NavTreeColumn,
  type NavTreeItem,
  slugify,
} from "@/lib/tree-store";
import {
  columnPayloadSchema,
  itemPayloadSchema,
  navigationTreeSchema,
  reorderColumnsPayloadSchema,
  reorderItemsPayloadSchema,
  reorderTabsPayloadSchema,
  tabPayloadSchema,
  treeRequestSchema,
} from "@/lib/validations/navigation.schema";
import { parsePayload, validationErrorResponse } from "@/lib/validations/utils";

export const dynamic = "force-dynamic";

async function syncTreeItemWithDatabase(targetTab: NavTreeTab, targetColumn: NavTreeColumn, item: NavTreeItem) {
  try {
    const tabKey = targetTab.id.toLowerCase();
    const slug = item.slug || slugify(item.title);
    if (tabKey === "solutions") {
      const existing = await solutionRepository.findBySlug(slug);
      if (existing) {
        await solutionRepository.updateBySlug(slug, {
          title: item.title,
          group: targetColumn.title,
          intro: item.intro,
          description: item.description,
          outcomes: item.outcomes,
          images: item.images,
        });
      } else {
        await solutionRepository.create({
          title: item.title,
          slug,
          group: targetColumn.title,
          intro: item.intro || "",
          description: item.description || "",
          outcomes: item.outcomes || [],
          images: item.images || [],
          isPublished: true,
        });
      }
    } else if (tabKey === "products") {
      const existing = await productRepository.findBySlug(slug);
      if (existing) {
        await productRepository.updateBySlug(slug, {
          title: item.title,
          group: targetColumn.title,
          intro: item.intro,
          description: item.description,
          outcomes: item.outcomes,
          images: item.images,
        });
      } else {
        await productRepository.create({
          title: item.title,
          slug,
          group: targetColumn.title,
          intro: item.intro || "",
          description: item.description || "",
          outcomes: item.outcomes || [],
          images: item.images || [],
          isPublished: true,
        });
      }
    } else if (tabKey === "industries") {
      const existing = await industryRepository.findBySlug(slug);
      if (existing) {
        await industryRepository.updateBySlug(slug, {
          title: item.title,
          intro: item.intro,
          description: item.description,
          items: item.outcomes || [],
        });
      } else {
        await industryRepository.create({
          title: item.title,
          slug,
          intro: item.intro || "",
          description: item.description || "",
          items: item.outcomes || [],
          isPublished: true,
        });
      }
    }
  } catch (err) {
    console.error("Failed to sync tree item to database:", err);
  }
}

async function removeTreeItemFromDatabase(tabId: string, item: NavTreeItem) {
  try {
    const tabKey = tabId.toLowerCase();
    const slug = item.slug || slugify(item.title);
    if (tabKey === "solutions") {
      await solutionRepository.deleteBySlug(slug);
    } else if (tabKey === "products") {
      await productRepository.deleteBySlug(slug);
    } else if (tabKey === "industries") {
      await industryRepository.deleteBySlug(slug);
    }
  } catch (err) {
    console.error("Failed to remove tree item from database:", err);
  }
}

export async function GET() {
  try {
    const tree = await navigationService.getTree();
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

    let rawBody: unknown;
    try {
      rawBody = await request.json();
    } catch {
      return NextResponse.json({ success: false, message: "Invalid JSON payload" }, { status: 400 });
    }

    const parsedRequest = treeRequestSchema.safeParse(rawBody);
    if (!parsedRequest.success) {
      return validationErrorResponse(parsedRequest.error, "Navigation payload is invalid");
    }

    const { action, tree, tabId, columnId, itemId, payload } = parsedRequest.data;

    // Action 1: Reset to factory default
    if (action === "reset") {
      const resetTree = await navigationService.resetTree();
      revalidatePath("/", "layout");
      return NextResponse.json({
        success: true,
        message: "Navigation tree reset to factory defaults in database",
        data: resetTree,
      });
    }

    // Action 2: Save entire tree directly
    if (action === "saveTree") {
      const parsedTree = parsePayload(navigationTreeSchema, tree, "Navigation tree is invalid");
      if (!parsedTree.ok) return parsedTree.response;

      const saved = await navigationService.saveTree(parsedTree.data);
      revalidatePath("/", "layout");
      return NextResponse.json({
        success: true,
        message: "Navigation tree saved successfully in database",
        data: saved,
      });
    }

    const currentTree: NavigationTree = await navigationService.getTree();

    // Action 3: Add new Level 1 Tab
    if (action === "addTab") {
      const parsedPayload = parsePayload(tabPayloadSchema, payload, "Tab payload is invalid");
      if (!parsedPayload.ok) return parsedPayload.response;

      const { label, href, footerNote, catalogueCta } = parsedPayload.data;
      const id = slugify(label);
      if (currentTree.tabs.some((existing) => existing.id === id)) {
        return NextResponse.json(
          { success: false, message: `A tab named "${label}" already exists` },
          { status: 409 }
        );
      }
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
      await navigationService.saveTree(currentTree);
      revalidatePath("/", "layout");
      return NextResponse.json({ success: true, message: `Added tab "${label}"`, data: currentTree });
    }

    // Action 4: Edit Level 1 Tab
    if (action === "editTab") {
      if (!tabId) return NextResponse.json({ success: false, message: "Tab id is required" }, { status: 400 });
      const tab = currentTree.tabs.find((t) => t.id === tabId);
      if (!tab) return NextResponse.json({ success: false, message: "Tab not found" }, { status: 404 });
      const parsedPayload = parsePayload(tabPayloadSchema, payload, "Tab payload is invalid");
      if (!parsedPayload.ok) return parsedPayload.response;

      const { label, href, footerNote, catalogueCta } = parsedPayload.data;
      tab.label = label;
      tab.href = href;
      tab.footerNote = footerNote;
      tab.catalogueCta = catalogueCta;
      await navigationService.saveTree(currentTree);
      revalidatePath("/", "layout");
      return NextResponse.json({ success: true, message: `Updated tab "${tab.label}"`, data: currentTree });
    }

    // Action 5: Delete Level 1 Tab
    if (action === "deleteTab") {
      if (!tabId) return NextResponse.json({ success: false, message: "Tab id is required" }, { status: 400 });
      currentTree.tabs = currentTree.tabs.filter((t) => t.id !== tabId);
      await navigationService.saveTree(currentTree);
      revalidatePath("/", "layout");
      return NextResponse.json({ success: true, message: `Deleted tab`, data: currentTree });
    }

    // Action 6: Reorder Level 1 Tabs
    if (action === "reorderTabs") {
      const parsedPayload = parsePayload(reorderTabsPayloadSchema, payload, "Tab order payload is invalid");
      if (!parsedPayload.ok) return parsedPayload.response;

      const tabMap = new Map(currentTree.tabs.map((t) => [t.id, t]));
      const reordered: NavTreeTab[] = [];
      parsedPayload.data.tabIds.forEach((id: string, index: number) => {
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
      await navigationService.saveTree(currentTree);
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
      const parsedPayload = parsePayload(columnPayloadSchema, payload, "Column payload is invalid");
      if (!parsedPayload.ok) return parsedPayload.response;

      const { title } = parsedPayload.data;
      const slug = slugify(title);
      if (targetTab.columns.some((existing) => existing.slug === slug)) {
        return NextResponse.json(
          { success: false, message: `A column named "${title}" already exists in this tab` },
          { status: 409 }
        );
      }
      const newCol: NavTreeColumn = {
        id: `col-${slug}-${Date.now().toString().slice(-4)}`,
        title,
        slug,
        order: targetTab.columns.length + 1,
        items: [],
      };
      targetTab.columns.push(newCol);
      await navigationService.saveTree(currentTree);
      revalidatePath("/", "layout");
      return NextResponse.json({ success: true, message: `Added column "${title}"`, data: currentTree });
    }

    // Action 8: Edit Column
    if (action === "editColumn" && targetTab && columnId) {
      const col = targetTab.columns.find((c) => c.id === columnId);
      if (!col) return NextResponse.json({ success: false, message: "Column not found" }, { status: 404 });
      const parsedPayload = parsePayload(columnPayloadSchema, payload, "Column payload is invalid");
      if (!parsedPayload.ok) return parsedPayload.response;

      col.title = parsedPayload.data.title;
      col.slug = slugify(parsedPayload.data.title);
      await navigationService.saveTree(currentTree);
      revalidatePath("/", "layout");
      return NextResponse.json({ success: true, message: `Updated column "${col.title}"`, data: currentTree });
    }

    // Action 9: Delete Column
    if (action === "deleteColumn" && targetTab && columnId) {
      targetTab.columns = targetTab.columns.filter((c) => c.id !== columnId);
      await navigationService.saveTree(currentTree);
      revalidatePath("/", "layout");
      return NextResponse.json({ success: true, message: "Deleted column", data: currentTree });
    }

    // Action 10: Reorder Columns within Tab
    if (action === "reorderColumns" && targetTab) {
      const parsedPayload = parsePayload(
        reorderColumnsPayloadSchema,
        payload,
        "Column order payload is invalid"
      );
      if (!parsedPayload.ok) return parsedPayload.response;

      const colMap = new Map(targetTab.columns.map((c) => [c.id, c]));
      const reordered: NavTreeColumn[] = [];
      parsedPayload.data.columnIds.forEach((id: string, index: number) => {
        const col = colMap.get(id);
        if (col) {
          col.order = index + 1;
          reordered.push(col);
          colMap.delete(id);
        }
      });
      colMap.forEach((col) => reordered.push(col));
      targetTab.columns = reordered;
      await navigationService.saveTree(currentTree);
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
      const parsedPayload = parsePayload(itemPayloadSchema, payload, "Item payload is invalid");
      if (!parsedPayload.ok) return parsedPayload.response;

      const { title, intro, description, outcomes, href } = parsedPayload.data;
      const slug = slugify(title);
      if (targetColumn.items.some((existing) => existing.slug === slug)) {
        return NextResponse.json(
          { success: false, message: `An item named "${title}" already exists in this column` },
          { status: 409 }
        );
      }
      const generatedHref = href || `/${targetTab.slug}/${slug}`;
      const newItem: NavTreeItem = {
        id: `item-${slug}-${Date.now().toString().slice(-4)}`,
        title,
        slug,
        href: generatedHref,
        order: targetColumn.items.length + 1,
        intro,
        description,
        outcomes,
      };
      targetColumn.items.push(newItem);
      await navigationService.saveTree(currentTree);
      await syncTreeItemWithDatabase(targetTab, targetColumn, newItem);
      revalidatePath("/", "layout");
      revalidatePath(generatedHref);
      return NextResponse.json({ success: true, message: `Added item "${title}"`, data: currentTree });
    }

    // Action 12: Edit Item / CMS Content
    if (action === "editItem" && targetTab && targetColumn && itemId) {
      const item = targetColumn.items.find((i) => i.id === itemId);
      if (!item) return NextResponse.json({ success: false, message: "Item not found" }, { status: 404 });
      const parsedPayload = parsePayload(itemPayloadSchema, payload, "Item payload is invalid");
      if (!parsedPayload.ok) return parsedPayload.response;

      const { title, href, intro, description, outcomes, images, metadata } = parsedPayload.data;
      const oldHref = item.href;
      item.title = title;
      item.slug = slugify(title);
      if (href !== undefined) item.href = href;
      item.intro = intro;
      item.description = description;
      item.outcomes = outcomes;
      if (images !== undefined) item.images = images;
      if (metadata !== undefined) item.metadata = metadata;
      await navigationService.saveTree(currentTree);
      await syncTreeItemWithDatabase(targetTab, targetColumn, item);
      revalidatePath("/", "layout");
      if (oldHref) revalidatePath(oldHref);
      if (item.href && item.href !== oldHref) revalidatePath(item.href);
      return NextResponse.json({ success: true, message: `Updated item "${item.title}"`, data: currentTree });
    }

    // Action 13: Delete Item
    if (action === "deleteItem" && targetTab && targetColumn && itemId) {
      const itemToDelete = targetColumn.items.find((i) => i.id === itemId);
      targetColumn.items = targetColumn.items.filter((i) => i.id !== itemId);
      await navigationService.saveTree(currentTree);
      if (itemToDelete) {
        await removeTreeItemFromDatabase(targetTab.id, itemToDelete);
        if (itemToDelete.href) revalidatePath(itemToDelete.href);
      }
      revalidatePath("/", "layout");
      return NextResponse.json({ success: true, message: "Deleted item", data: currentTree });
    }

    // Action 14: Reorder Items within Column
    if (action === "reorderItems" && targetTab && targetColumn) {
      const parsedPayload = parsePayload(reorderItemsPayloadSchema, payload, "Item order payload is invalid");
      if (!parsedPayload.ok) return parsedPayload.response;

      const itemMap = new Map(targetColumn.items.map((i) => [i.id, i]));
      const reordered: NavTreeItem[] = [];
      parsedPayload.data.itemIds.forEach((id: string, index: number) => {
        const item = itemMap.get(id);
        if (item) {
          item.order = index + 1;
          reordered.push(item);
          itemMap.delete(id);
        }
      });
      itemMap.forEach((item) => reordered.push(item));
      targetColumn.items = reordered;
      await navigationService.saveTree(currentTree);
      revalidatePath("/", "layout");
      return NextResponse.json({ success: true, message: "Items reordered", data: currentTree });
    }

    return NextResponse.json({ success: false, message: "Unknown action" }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error?.message }, { status: 500 });
  }
}

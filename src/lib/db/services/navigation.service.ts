import { revalidatePath, revalidateTag } from "next/cache";
import { cache } from "react";
import { navigationRepository } from "../repositories/navigation.repository";
import {
  DEFAULT_NAVIGATION_TREE,
  NavigationTree,
  NavTreeTab,
  NavTreeColumn,
  NavTreeItem,
} from "../../tree-store";

const getTreeForRequest = cache(async (): Promise<NavigationTree> => {
  const tree = await navigationRepository.getTree();
  if (!tree || tree.tabs.length === 0) {
    return navigationRepository.saveTree(DEFAULT_NAVIGATION_TREE);
  }
  return tree;
});

export class NavigationService {
  async getTree(): Promise<NavigationTree> {
    return getTreeForRequest();
  }

  async saveTree(tree: NavigationTree): Promise<NavigationTree> {
    const saved = await navigationRepository.saveTree(tree);
    this.revalidateAll(saved);
    return saved;
  }

  async resetTree(): Promise<NavigationTree> {
    const saved = await navigationRepository.resetTree();
    this.revalidateAll(saved);
    return saved;
  }

  async findTreeItem(
    slugs: string[] | string
  ): Promise<{
    tab: NavTreeTab;
    column?: NavTreeColumn;
    item: NavTreeItem;
  } | null> {
    const tree = await this.getTree();
    const parts = Array.isArray(slugs) ? slugs.filter(Boolean) : [slugs].filter(Boolean);
    if (!parts.length) return null;

    const fullPath = "/" + parts.join("/");
    const targetSlug = parts[parts.length - 1];

    // Pass 1: exact href match
    for (const tab of tree.tabs) {
      for (const col of tab.columns) {
        for (const item of col.items) {
          if (item.href === fullPath || item.href === `/${parts.join("/")}`) {
            return { tab, column: col, item };
          }
        }
      }
    }

    // Pass 2: structured match [tab, col, item]
    if (parts.length === 3) {
      const [tSlug, cSlug, iSlug] = parts;
      const tab = tree.tabs.find((t) => t.slug === tSlug || t.id === tSlug);
      if (tab) {
        const col = tab.columns.find((c) => c.slug === cSlug || c.id === cSlug);
        if (col) {
          const item = col.items.find((i) => i.slug === iSlug || i.id === iSlug);
          if (item) return { tab, column: col, item };
        }
      }
    }

    // Pass 3: match by leaf item slug
    for (const tab of tree.tabs) {
      for (const col of tab.columns) {
        for (const item of col.items) {
          if (item.slug === targetSlug || item.id === targetSlug) {
            return { tab, column: col, item };
          }
        }
      }
    }

    return null;
  }

  async getAllTreeItems(): Promise<{
    tab: NavTreeTab;
    column: NavTreeColumn;
    item: NavTreeItem;
  }[]> {
    const tree = await this.getTree();
    const results: { tab: NavTreeTab; column: NavTreeColumn; item: NavTreeItem }[] = [];
    for (const tab of tree.tabs) {
      for (const column of tab.columns) {
        for (const item of column.items) {
          results.push({ tab, column, item });
        }
      }
    }
    return results;
  }

  private revalidateAll(tree: NavigationTree) {
    try {
      revalidateTag("public-navigation", { expire: 0 });
      revalidatePath("/", "layout");
      for (const tab of tree.tabs) {
        if (tab.href && tab.href.startsWith("/")) {
          revalidatePath(tab.href);
        }
        for (const col of tab.columns) {
          for (const item of col.items) {
            if (item.href) {
              revalidatePath(item.href);
            }
          }
        }
      }
    } catch {
      // safe fallback
    }
  }
}

export const navigationService = new NavigationService();

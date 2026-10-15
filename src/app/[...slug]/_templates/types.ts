import type { NavTreeColumn, NavTreeItem, NavTreeTab } from "@/lib/tree-store";
import type { ContentImage, ProductDownloadItem } from "@/lib/data-store";

export type { NavTreeColumn, NavTreeItem, NavTreeTab, ContentImage, ProductDownloadItem };

/**
 * Resolved page item passed to the section templates. It is a navigation tree
 * item enriched with optional product fields (brand, resources) sourced from
 * the DB-backed content services.
 */
export type PageItem = NavTreeItem & {
  brand?: string;
  brandUrl?: string;
  resources?: ProductDownloadItem[];
};

export type PageGalleryImage = ContentImage;

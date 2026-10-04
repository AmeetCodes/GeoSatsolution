import { z } from "zod";

import {
  idListSchema,
  imageListSchema,
  optionalText,
  orderSchema,
  requiredText,
  slugSchema,
  textList,
  uniqueBy,
} from "./shared.schema";

export const navMetadataSchema = z.object({
  metaTitle: optionalText(70, "Meta title"),
  metaDescription: optionalText(200, "Meta description"),
});

export const navTreeItemSchema = z.object({
  id: requiredText(160, "Item id"),
  title: requiredText(160, "Item title"),
  slug: slugSchema,
  href: optionalText(500, "Item href"),
  order: orderSchema(),
  intro: optionalText(600, "Item intro"),
  description: optionalText(5000, "Item description"),
  outcomes: textList(40, 300, "Item outcomes"),
  images: imageListSchema,
  metadata: navMetadataSchema.optional(),
});

export const navTreeColumnSchema = z.object({
  id: requiredText(160, "Column id"),
  title: requiredText(160, "Column title"),
  slug: slugSchema,
  order: orderSchema(),
  items: z.array(navTreeItemSchema).max(500, "Too many items in a column").default([]),
});

export const navTreeTabSchema = z.object({
  id: requiredText(160, "Tab id"),
  label: requiredText(160, "Tab label"),
  slug: slugSchema,
  href: optionalText(500, "Tab href"),
  order: orderSchema(),
  type: z.enum(["columns", "cards"]).optional(),
  footerNote: optionalText(300, "Footer note"),
  catalogueCta: optionalText(200, "Catalogue CTA"),
  columns: z.array(navTreeColumnSchema).max(200, "Too many columns in a tab").default([]),
});

export const navigationTreeSchema = z.object({
  tabs: uniqueBy(navTreeTabSchema, {
    max: 50,
    maxMessage: "Too many navigation tabs",
    key: (tab) => tab.id,
    label: "tab id",
  }),
});

export const TREE_ACTIONS = [
  "reset",
  "saveTree",
  "addTab",
  "editTab",
  "deleteTab",
  "reorderTabs",
  "addColumn",
  "editColumn",
  "deleteColumn",
  "reorderColumns",
  "addItem",
  "editItem",
  "deleteItem",
  "reorderItems",
] as const;

export type TreeAction = (typeof TREE_ACTIONS)[number];

export const tabPayloadSchema = z.object({
  label: requiredText(160, "Tab label"),
  href: optionalText(500, "Tab href"),
  footerNote: optionalText(300, "Footer note"),
  catalogueCta: optionalText(200, "Catalogue CTA"),
});

export const columnPayloadSchema = z.object({
  title: requiredText(160, "Column title"),
});

export const itemPayloadSchema = z.object({
  title: requiredText(160, "Item title"),
  href: z.string().trim().max(500, "Item href must be 500 characters or fewer").optional(),
  intro: optionalText(600, "Item intro"),
  description: optionalText(5000, "Item description"),
  outcomes: textList(40, 300, "Item outcomes"),
  images: imageListSchema.optional(),
  metadata: navMetadataSchema.optional(),
});

export const reorderTabsPayloadSchema = z.object({ tabIds: idListSchema("Tab id") });

export const reorderColumnsPayloadSchema = z.object({
  columnIds: idListSchema("Column id"),
});

export const reorderItemsPayloadSchema = z.object({ itemIds: idListSchema("Item id") });

export const treeRequestSchema = z.object({
  action: z.enum(TREE_ACTIONS, { error: "Unknown action" }),
  tabId: requiredText(160, "Tab id").optional(),
  columnId: requiredText(160, "Column id").optional(),
  itemId: requiredText(160, "Item id").optional(),
  payload: z.unknown().optional(),
  tree: z.unknown().optional(),
});

export type NavigationTreeInput = z.output<typeof navigationTreeSchema>;
export type TabPayloadInput = z.output<typeof tabPayloadSchema>;
export type ColumnPayloadInput = z.output<typeof columnPayloadSchema>;
export type ItemPayloadInput = z.output<typeof itemPayloadSchema>;

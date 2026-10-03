import { describe, it } from "node:test";
import assert from "node:assert/strict";

import { getTreeItem, findTreeItemBySlug } from "./tree-store";
import {
  getPageContentForTreeItem,
  syncTreeItemWithSiteContent,
} from "./data-store";

describe("dynamic page data sync", () => {
  it("matches tree items to site content and exposes fallback aliases", () => {
    const match = getTreeItem(["solutions", "survey-mapping", "uav-lidar-survey"]);
    assert.ok(match, "tree lookup should resolve a dynamic page item");

    const aliasMatch = findTreeItemBySlug(["solutions", "survey-mapping", "uav-lidar-survey"]);
    assert.deepEqual(aliasMatch?.item?.slug, match?.item.slug);

    const pageContent = getPageContentForTreeItem(match!);
    assert.ok(pageContent, "site content lookup should resolve the matching page content");

    const synced = syncTreeItemWithSiteContent({
      id: "solutions",
      label: "Solutions",
      slug: "solutions",
      href: "/solutions",
      order: 1,
      columns: [],
    }, {
      id: "col-test",
      title: "Test Column",
      slug: "test-column",
      order: 1,
      items: [],
    }, {
      id: "item-test",
      title: "Test Solution",
      slug: "test-solution",
      href: "/solutions/test-solution",
      order: 1,
      intro: "Intro",
      description: "Description",
      outcomes: ["Outcome"],
    });

    assert.equal(synced, true);
  });
});

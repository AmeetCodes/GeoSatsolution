import { describe, it } from "node:test";
import assert from "node:assert/strict";

import siteContent from "@/data/site-content.json";
import navigationTree from "@/data/navigation-tree.json";

import { adminLoginSchema } from "./auth.schema";
import {
  adminContentRequestSchema,
  siteContentSchema,
  siteContentSectionPayloadSchemas,
} from "./content.schema";
import { parsePayload } from "./utils";
import { createConsultationSchema } from "./consultation.schema";
import { articleSchema } from "./article.schema";
import { industryItemSchema } from "./industry.schema";
import { productItemSchema } from "./product.schema";
import { solutionItemSchema } from "./solution.schema";
import { projectListSchema } from "./project.schema";
import {
  columnPayloadSchema,
  itemPayloadSchema,
  navigationTreeSchema,
  reorderItemsPayloadSchema,
  tabPayloadSchema,
  treeRequestSchema,
} from "./navigation.schema";

const validSolution = {
  title: "UAV LiDAR Survey",
  group: "Survey & Mapping",
  intro: "A dependable picture of the ground.",
  description: "Dense point clouds for true bare-earth terrain models.",
  outcomes: ["Calibrated LAS/LAZ point clouds"],
  images: [{ src: "https://example.com/a.jpg", alt: "Aerial", caption: "Terrain" }],
};

const validItemPayload = {
  title: "Drone Photogrammetry",
  href: "/solutions/drone-photogrammetry",
  intro: "High-resolution orthomosaics.",
  description: "Sub-centimeter aerial imagery.",
  outcomes: ["Sub-cm orthomosaics"],
};

describe("entity schemas reject incomplete or invalid records", () => {
  it("requires the structural fields of a solution", () => {
    assert.equal(solutionItemSchema.safeParse(validSolution).success, true);
    assert.equal(solutionItemSchema.safeParse({ ...validSolution, title: "" }).success, false);
    assert.equal(solutionItemSchema.safeParse({ ...validSolution, title: "   " }).success, false);
    assert.equal(solutionItemSchema.safeParse({ ...validSolution, group: undefined }).success, false);
    assert.equal(
      solutionItemSchema.safeParse({ ...validSolution, outcomes: [""] }).success,
      false,
      "blank outcome entries must be rejected",
    );
    assert.equal(
      solutionItemSchema.safeParse({ ...validSolution, outcomes: "not-an-array" }).success,
      false,
    );
    assert.equal(
      solutionItemSchema.safeParse({ ...validSolution, title: 42 }).success,
      false,
      "wrong types must be rejected",
    );
  });

  it("rejects unsafe image sources", () => {
    const withImages = (src: unknown) => ({ ...validSolution, images: [{ src, alt: "a", caption: "c" }] });
    assert.equal(productItemSchema.safeParse(withImages("javascript:alert(1)")).success, false);
    assert.equal(productItemSchema.safeParse(withImages("/images/local.jpg")).success, true);
    assert.equal(productItemSchema.safeParse(withImages("https://example.com/a.jpg")).success, true);
  });

  it("validates industries and articles", () => {
    assert.equal(
      industryItemSchema.safeParse({
        title: "Construction",
        intro: "Site progress",
        description: "Verification",
        items: ["BIM", "Site progress"],
      }).success,
      true,
    );
    assert.equal(industryItemSchema.safeParse({}).success, false);
    assert.equal(industryItemSchema.safeParse({ title: "  " }).success, false);
    assert.equal(
      industryItemSchema.safeParse({ title: "X", intro: "", description: "", items: [] }).success,
      true,
      "optional copy fields may be empty, matching existing checked-in content",
    );
    assert.equal(
      industryItemSchema.safeParse({ title: "X", intro: 5, description: "", items: [] }).success,
      false,
      "wrongly typed copy fields must be rejected",
    );

    assert.equal(
      articleSchema.safeParse({
        slug: "uav-regional-update",
        title: "Regional update",
        date: "2026-10-03",
        category: "News",
        excerpt: "Short summary",
        body: ["Paragraph one"],
      }).success,
      true,
    );
    assert.equal(
      articleSchema.safeParse({
        slug: "Not A Slug!",
        title: "Bad",
        date: "2026-10-03",
        category: "News",
        body: [],
      }).success,
      false,
      "slugs must be url-safe",
    );
    assert.equal(
      articleSchema.safeParse({
        slug: "ok-slug",
        title: "Bad date",
        date: "03-10-2026",
        category: "News",
        body: [],
      }).success,
      false,
      "dates must be ISO",
    );
  });

  it("validates project fields and requires unique project codes", () => {
    const project = {
      code: "HYD-04",
      title: "Hydropower corridor",
      sector: "Energy",
      body: "Survey-grade corridor capture.",
      tags: ["LiDAR"],
    };

    assert.equal(projectListSchema.safeParse([project]).success, true);
    assert.equal(
      projectListSchema.safeParse([project, { ...project, code: "hyd-04" }]).success,
      false,
    );
    assert.equal(projectListSchema.safeParse([{ ...project, body: "" }]).success, false);
  });

  it("rejects duplicate titles and slugs in saved collections", () => {
    const duplicatedSolutions = [validSolution, { ...validSolution }];
    const result = siteContentSchema.safeParse({
      Solutions: duplicatedSolutions,
      Products: [],
      Industries: [],
      Company: { Leadership: [], Partners: [], Insights: [] },
    });

    assert.equal(result.success, false);
    assert.match(JSON.stringify(result.error?.issues), /Duplicate solution title/);
  });

  it("requires complete admin credentials", () => {
    assert.equal(
      adminLoginSchema.safeParse({
        email: "admin@example.test",
        password: "test-only-password-value",
        rememberMe: true,
      }).success,
      true,
    );
    assert.equal(adminLoginSchema.safeParse({ email: "nope", password: "12345678" }).success, false);
    assert.equal(
      adminLoginSchema.safeParse({ email: "admin@example.test", password: "short" }).success,
      false,
    );
    assert.equal(adminLoginSchema.safeParse({ password: "test-only-password-value" }).success, false);
  });
});

describe("admin content requests", () => {
  it("only accepts known sections and actions", () => {
    assert.equal(adminContentRequestSchema.safeParse({ action: "reset" }).success, true);
    assert.equal(
      adminContentRequestSchema.safeParse({ action: "drop-database" }).success,
      false,
      "unknown actions must be rejected",
    );
    assert.equal(
      adminContentRequestSchema.safeParse({ section: "Secrets", data: [] }).success,
      false,
      "unknown sections must be rejected",
    );
    assert.equal(adminContentRequestSchema.safeParse({}).success, false);
    assert.equal(
      adminContentRequestSchema.safeParse({ action: "reset", section: "Solutions", data: [] }).success,
      false,
      "action and section must not be combined",
    );
    assert.equal(adminContentRequestSchema.safeParse({ section: "Solutions" }).success, false);
    assert.equal(adminContentRequestSchema.safeParse({ action: "update-all" }).success, false);
  });

  it("explains why a payload was rejected", () => {
    const unknownSection = adminContentRequestSchema.safeParse({ section: "Secrets", data: [] });
    assert.match(unknownSection.error?.issues[0].message ?? "", /Unknown content section/);

    const unknownAction = adminContentRequestSchema.safeParse({ action: "drop-database" });
    assert.match(unknownAction.error?.issues[0].message ?? "", /Unknown action/);

    const missingData = adminContentRequestSchema.safeParse({ section: "Solutions" });
    assert.match(missingData.error?.issues[0].message ?? "", /Section data is required/);
  });

  it("rejects a section payload that does not match its schema", () => {
    const result = parsePayload(
      siteContentSectionPayloadSchemas.Solutions,
      [{ title: "Broken", group: "Group", outcomes: "nope" }],
    );

    assert.equal(result.ok, false);
    assert.equal(result.ok === false && result.response.status, 400);
  });

  it("rejects update-all payloads missing required sections", () => {
    assert.equal(parsePayload(siteContentSchema, {}).ok, false);
    assert.equal(
      parsePayload(siteContentSchema, {
        Solutions: [validSolution],
        Products: [],
        Industries: [],
        Company: { Leadership: [], Partners: [], Insights: [] },
      }).ok,
      true,
    );
  });
});

describe("navigation tree requests", () => {
  it("validates tab, column and item payloads", () => {
    assert.equal(
      tabPayloadSchema.safeParse({
        label: "Insights",
        href: "/insights",
        footerNote: "",
        catalogueCta: "",
      }).success,
      true,
    );
    assert.equal(tabPayloadSchema.safeParse({ label: "" }).success, false);
    assert.equal(tabPayloadSchema.safeParse({}).success, false);
    assert.equal(columnPayloadSchema.safeParse({ title: "About" }).success, true);
    assert.equal(columnPayloadSchema.safeParse({ title: "" }).success, false);
    assert.equal(itemPayloadSchema.safeParse(validItemPayload).success, true);
    assert.equal(itemPayloadSchema.safeParse({ ...validItemPayload, title: "" }).success, false);
    assert.equal(itemPayloadSchema.safeParse({ ...validItemPayload, outcomes: [1] }).success, false);
    assert.equal(
      itemPayloadSchema.safeParse({ ...validItemPayload, images: [{ src: "data:text/html,x" }] }).success,
      false,
    );
  });

  it("only accepts known actions", () => {
    assert.equal(treeRequestSchema.safeParse({ action: "reset" }).success, true);
    assert.equal(treeRequestSchema.safeParse({ action: "dropEverything" }).success, false);
    assert.equal(treeRequestSchema.safeParse({}).success, false);
    assert.equal(reorderItemsPayloadSchema.safeParse({ itemIds: ["a", "b"] }).success, true);
    assert.equal(reorderItemsPayloadSchema.safeParse({ itemIds: "a,b" }).success, false);
    assert.equal(reorderItemsPayloadSchema.safeParse({ itemIds: [""] }).success, false);
  });

  it("rejects a whole-tree save with broken nodes", () => {
    const broken = {
      tabs: [
        {
          id: "solutions",
          label: "Solutions",
          slug: "solutions",
          href: "/solutions",
          order: 1,
          columns: [
            {
              id: "col-survey",
              title: "Survey",
              slug: "survey",
              order: 1,
              items: [{ id: "item-1", title: "No slug or order" }],
            },
          ],
        },
      ],
    };

    const result = navigationTreeSchema.safeParse(broken);
    assert.equal(result.success, false);
    assert.match(JSON.stringify(result.error?.issues), /Slug is required|Order must be a number/);
  });
});

describe("consultation requests", () => {
  const schema = createConsultationSchema(["UAV LiDAR Survey", "Drone Photogrammetry"]);

  const valid = {
    name: "Ameet Tester",
    organisation: "GeoSAT",
    email: "ameet@example.com",
    phone: "+91 9000000000",
    interest: "UAV LiDAR Survey",
    otherInterest: "",
    details: "We need a multi-sensor survey over a 40 hectare site.",
    website: "",
  };

  it("accepts a complete submission", () => {
    const result = schema.safeParse(valid);
    assert.equal(result.success, true);
    assert.equal(result.success && result.data.name, "Ameet Tester");
  });

  it("rejects incomplete submissions with actionable messages", () => {
    const cases: Array<[Record<string, unknown>, RegExp]> = [
      [{ ...valid, name: "A" }, /Enter your full name\./],
      [{ ...valid, email: "not-an-email" }, /Enter a valid email address\./],
      [{ ...valid, email: "a@b.com\nbcc:x@y.com" }, /Enter a valid email address\./],
      [{ ...valid, interest: "Nonsense" }, /Choose a valid area of interest\./],
      [{ ...valid, interest: "Other" }, /Tell us what service you need\./],
      [{ ...valid, details: "too short" }, /Add a few details so our team can prepare\./],
      [{ ...valid, details: "" }, /Add a few details so our team can prepare\./],
    ];

    for (const [payload, expected] of cases) {
      const result = schema.safeParse(payload);
      assert.equal(result.success, false, `${JSON.stringify(payload)} should be rejected`);
      assert.match(
        result.success ? "" : result.error.issues[0].message,
        expected,
        `${JSON.stringify(payload)} should report ${expected}`,
      );
    }
  });

  it("accepts a honeypot payload shaped like the client form sends it", () => {
    assert.equal(schema.safeParse({ ...valid, website: null }).success, true);
    assert.equal(schema.safeParse({ ...valid, website: {} }).success, true);
  });
});

describe("checked-in content satisfies the schemas", () => {
  it("accepts the current site content file", () => {
    const result = siteContentSchema.safeParse(siteContent);
    assert.equal(
      result.success,
      true,
      `site-content.json is invalid: ${JSON.stringify(result.error?.issues?.slice(0, 5))}`,
    );
  });

  it("accepts the default site content", async () => {
    const { DEFAULT_SITE_CONTENT } = await import("@/lib/data-store");
    const result = siteContentSchema.safeParse(DEFAULT_SITE_CONTENT);
    assert.equal(
      result.success,
      true,
      `DEFAULT_SITE_CONTENT is invalid: ${JSON.stringify(result.error?.issues?.slice(0, 5))}`,
    );
  });

  it("accepts the current navigation tree file", () => {
    const result = navigationTreeSchema.safeParse(navigationTree);
    assert.equal(
      result.success,
      true,
      `navigation-tree.json is invalid: ${JSON.stringify(result.error?.issues?.slice(0, 5))}`,
    );
  });

  it("accepts the default navigation tree", async () => {
    const { DEFAULT_NAVIGATION_TREE } = await import("@/lib/tree-store");
    const result = navigationTreeSchema.safeParse(DEFAULT_NAVIGATION_TREE);
    assert.equal(
      result.success,
      true,
      `DEFAULT_NAVIGATION_TREE is invalid: ${JSON.stringify(result.error?.issues?.slice(0, 5))}`,
    );
  });
});

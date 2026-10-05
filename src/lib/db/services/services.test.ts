import { after, describe, it } from "node:test";
import assert from "node:assert/strict";
import { solutionService } from "./solution.service";
import { productService } from "./product.service";
import { industryService } from "./industry.service";
import { navigationService } from "./navigation.service";
import { siteContentService } from "./site-content.service";
import { contentService } from "./content.service";
import { authenticateAdmin } from "./admin-auth.service";
import { hashPassword } from "../../auth/password";
import bcrypt from "bcryptjs";
import { Admin } from "../../models/Admin";
import { disconnectDB } from "../connection";

describe("MongoDB Service Layer CRUD", () => {
  after(async () => {
    // Clean up test items
    await solutionService.delete("test-automated-solution").catch(() => {});
    await productService.delete("test-automated-product").catch(() => {});
    await industryService.delete("test-automated-industry").catch(() => {});
    await disconnectDB();
  });

  it("performs full Solution CRUD operations in MongoDB", async () => {
    // 1. Create
    const created = await solutionService.create({
      title: "Test Automated Solution",
      slug: "test-automated-solution",
      group: "Survey & Mapping",
      intro: "Automated test intro",
      description: "Automated test description",
      outcomes: ["Test Outcome 1"],
      images: [{ src: "/test.jpg", alt: "Test Alt", caption: "Test Caption" }],
      isPublished: true,
    });
    assert.equal(created.title, "Test Automated Solution");
    assert.equal(created.slug, "test-automated-solution");

    // 2. Read by slug
    const found = await solutionService.getBySlug("test-automated-solution");
    assert.ok(found);
    assert.equal(found.group, "Survey & Mapping");

    // 3. Update
    const updated = await solutionService.update("test-automated-solution", {
      intro: "Updated intro text",
    });
    assert.equal(updated.intro, "Updated intro text");

    // 4. Verify in published list
    const published = await solutionService.getAllPublished();
    assert.ok(published.some((s) => s.slug === "test-automated-solution"));

    // 5. Delete
    const deleted = await solutionService.delete("test-automated-solution");
    assert.equal(deleted, true);

    const checkMissing = await solutionService.getBySlug("test-automated-solution");
    assert.equal(checkMissing, null);
  });

  it("performs full Product CRUD operations in MongoDB", async () => {
    const created = await productService.create({
      title: "Test Automated Product",
      slug: "test-automated-product",
      group: "UAV & Payloads",
      intro: "Product intro",
      description: "Product description",
      outcomes: ["Product Outcome"],
      images: [{ src: "/prod.jpg", alt: "Prod Alt" }],
      isPublished: true,
    });
    assert.equal(created.slug, "test-automated-product");

    const found = await productService.getBySlug("test-automated-product");
    assert.ok(found);

    const updated = await productService.update("test-automated-product", {
      description: "Updated product description",
    });
    assert.equal(updated.description, "Updated product description");

    const deleted = await productService.delete("test-automated-product");
    assert.equal(deleted, true);
  });

  it("performs full Industry CRUD operations in MongoDB", async () => {
    const created = await industryService.create({
      title: "Test Automated Industry",
      slug: "test-automated-industry",
      intro: "Industry intro",
      description: "Industry description",
      items: ["Item A", "Item B"],
      isPublished: true,
    });
    assert.equal(created.slug, "test-automated-industry");

    const found = await industryService.getBySlug("test-automated-industry");
    assert.ok(found);

    const deleted = await industryService.delete("test-automated-industry");
    assert.equal(deleted, true);
  });

  it("loads navigation tree and resolves tree items from MongoDB", async () => {
    const tree = await navigationService.getTree();
    assert.ok(tree.tabs.length > 0, "navigation tree should contain tabs");

    const matched = await navigationService.findTreeItem(["solutions", "survey-mapping", "uav-lidar-survey"]);
    assert.ok(matched, "should resolve uav-lidar-survey from MongoDB navigation tree");
    assert.equal(matched?.item?.title, "UAV LiDAR Survey");
  });

  it("loads full site content aggregated from MongoDB collections", async () => {
    const content = await siteContentService.getFullSiteContent();
    assert.ok(Array.isArray(content.Solutions), "content.Solutions should be an array");
    assert.ok(content.Solutions.length > 0, "should contain seeded solutions");
    assert.ok(Array.isArray(content.Products), "content.Products should be an array");
    assert.ok(Array.isArray(content.Industries), "content.Industries should be an array");
    assert.ok(content.Company.Leadership.length > 0, "should contain leadership");
  });

  it("saves project edits to MongoDB and reads them back for the homepage", async () => {
    const originalProjects = await contentService.getProjects();
    const replacement = [{
      code: "TEST-PROJECT-01",
      title: "Test Project",
      sector: "Test Sector",
      body: "Project persistence test.",
      tags: ["test"],
    }];

    try {
      await contentService.replaceProjects(replacement);
      const saved = await contentService.getProjects();

      assert.equal(saved.length, 1);
      assert.equal(saved[0].code, replacement[0].code);
      assert.deepEqual(saved[0].tags, replacement[0].tags);
    } finally {
      await contentService.replaceProjects(originalProjects.map(({ code, title, sector, body, tags }) => ({
        code,
        title,
        sector,
        body,
        tags,
      })));
    }
  });

  it("authenticates admins against MongoDB password hashes", async () => {
    const email = "admin-auth-test@example.test";
    const password = "test-only-admin-password";
    await Admin.deleteOne({ email });
    await Admin.create({
      email,
      name: "Admin Auth Test",
      role: "admin",
      passwordHash: await hashPassword(password),
    });

    try {
      const authenticated = await authenticateAdmin(email.toUpperCase(), password);
      assert.deepEqual(authenticated, {
        email,
        name: "Admin Auth Test",
        role: "admin",
      });
      assert.equal(await authenticateAdmin(email, "wrong-password"), null);
      assert.equal(await authenticateAdmin("missing-admin@example.test", password), null);
    } finally {
      await Admin.deleteOne({ email });
    }
  });

  it("authenticates and upgrades existing bcrypt admin hashes", async () => {
    const email = "admin-bcrypt-auth-test@example.test";
    const password = "test-only-bcrypt-admin-password";
    await Admin.deleteOne({ email });
    await Admin.create({
      email,
      name: "Bcrypt Admin Auth Test",
      role: "admin",
      passwordHash: await bcrypt.hash(password, 4),
    });

    try {
      const authenticated = await authenticateAdmin(email, password);
      assert.equal(authenticated?.email, email);

      const updatedAdmin = await Admin.findOne({ email }).select("+passwordHash").exec();
      assert.ok(updatedAdmin?.passwordHash.startsWith("scrypt$"));
      assert.deepEqual(await authenticateAdmin(email, password), authenticated);
    } finally {
      await Admin.deleteOne({ email });
    }
  });
});

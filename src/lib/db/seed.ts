import { existsSync, readFileSync } from "fs";
import { resolve } from "path";
import connectDB from "./connection";

// If running in standalone CLI, load .env.local or .env
if (!process.env.MONGODB_URI) {
  const envPath = existsSync(resolve(process.cwd(), ".env.local"))
    ? resolve(process.cwd(), ".env.local")
    : existsSync(resolve(process.cwd(), ".env"))
    ? resolve(process.cwd(), ".env")
    : null;
  if (envPath) {
    const lines = readFileSync(envPath, "utf-8").split("\n");
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const match = trimmed.match(/^([^=]+)=(.*)$/);
      if (match) {
        const key = match[1].trim();
        let val = match[2].trim();
        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
          val = val.slice(1, -1);
        }
        process.env[key] = val;
      }
    }
  }
}
import {
  Solution,
  Product,
  Industry,
  Leader,
  Partner,
  Article,
  Project,
  Equipment,
  Client,
  Navigation,
  Resource,
  ContentMigration,
} from "../models";
import { DEFAULT_SITE_CONTENT, DEFAULT_RESOURCES, getSiteContent } from "../data-store";
import { DEFAULT_PROJECTS } from "../data/project-content";
import { DEFAULT_NAVIGATION_TREE, getNavigationTree } from "../tree-store";
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const SEED_EQUIPMENT = [
  { label: "UAV platforms", value: "Fixed-wing & multirotor" },
  { label: "LiDAR payloads", value: "UAV, terrestrial & SLAM" },
  { label: "Positioning", value: "RTK / PPK GNSS receivers" },
  { label: "Angle measurement", value: "Total stations & laser scanners" },
  { label: "Processing", value: "Trimble, LiDAR360, DJI Terra, Pix4D" },
  { label: "Analysis", value: "PLS-CADD, eCognition, GIS platforms" },
];

export async function seedDatabase(force = false): Promise<{ seeded: boolean; counts: Record<string, number> }> {
  await connectDB();

  const solutionCount = await Solution.countDocuments();
  if (!force && solutionCount > 0) {
    const counts = {
      solutions: await Solution.countDocuments(),
      products: await Product.countDocuments(),
      industries: await Industry.countDocuments(),
      leaders: await Leader.countDocuments(),
      partners: await Partner.countDocuments(),
      articles: await Article.countDocuments(),
      projects: await Project.countDocuments(),
      equipment: await Equipment.countDocuments(),
      clients: await Client.countDocuments(),
      navigation: await Navigation.countDocuments(),
      resources: await Resource.countDocuments(),
    };
    return { seeded: false, counts };
  }

  // Load existing data source (JSON or defaults)
  const siteContent = getSiteContent() || DEFAULT_SITE_CONTENT;
  const navTree = getNavigationTree() || DEFAULT_NAVIGATION_TREE;

  if (force) {
    await Solution.deleteMany({});
    await Product.deleteMany({});
    await Industry.deleteMany({});
    await Leader.deleteMany({});
    await Partner.deleteMany({});
    await Article.deleteMany({});
    await Project.deleteMany({});
    await Equipment.deleteMany({});
    await Client.deleteMany({});
    await Navigation.deleteMany({});
    await Resource.deleteMany({});
  }

  // 1. Seed Solutions
  const solutionDocs = (siteContent.Solutions || []).map((item, idx) => ({
    title: item.title,
    slug: slugify(item.title),
    group: item.group,
    intro: item.intro,
    description: item.description,
    outcomes: item.outcomes || [],
    images: item.images || [],
    isPublished: true,
    order: idx + 1,
  }));
  if (solutionDocs.length > 0) {
    await Solution.insertMany(solutionDocs);
  }

  // 2. Seed Products
  const productDocs = (siteContent.Products || []).map((item, idx) => ({
    title: item.title,
    slug: slugify(item.title),
    group: item.group,
    intro: item.intro,
    description: item.description,
    outcomes: item.outcomes || [],
    images: item.images || [],
    specifications: {},
    isPublished: true,
    order: idx + 1,
  }));
  if (productDocs.length > 0) {
    await Product.insertMany(productDocs);
  }

  // 3. Seed Industries
  const industryDocs = (siteContent.Industries || []).map((item, idx) => ({
    title: item.title,
    slug: slugify(item.title),
    intro: item.intro,
    description: item.description,
    items: item.items || [],
    images: [],
    isPublished: true,
    order: idx + 1,
  }));
  if (industryDocs.length > 0) {
    await Industry.insertMany(industryDocs);
  }

  // 4. Seed Company - Leadership
  const leaderDocs = (siteContent.Company?.Leadership || []).map((item, idx) => ({
    name: item.name,
    role: item.role,
    division: item.division,
    bio: item.bio,
    image: {
      src: `/team/${slugify(item.name)}.svg`,
      alt: item.name,
    },
    order: idx + 1,
  }));
  if (leaderDocs.length > 0) {
    await Leader.insertMany(leaderDocs);
  }

  // 5. Seed Company - Partners
  const partnerDocs = (siteContent.Company?.Partners || []).map((item, idx) => ({
    customId: item.id || `PART-${idx + 1}`,
    name: item.name,
    category: item.category,
    tier: item.tier,
    description: item.description,
    order: idx + 1,
  }));
  if (partnerDocs.length > 0) {
    await Partner.insertMany(partnerDocs);
  }

  // 6. Seed Company - Insights (Articles)
  const articleDocs = (siteContent.Company?.Insights || []).map((item) => ({
    slug: item.slug || slugify(item.title),
    title: item.title,
    date: item.date ? new Date(item.date) : new Date(),
    category: item.category,
    excerpt: item.excerpt,
    body: item.body || [],
    author: "GeoSAT Editorial",
    isPublished: true,
  }));
  if (articleDocs.length > 0) {
    await Article.insertMany(articleDocs);
  }

  if (DEFAULT_RESOURCES.length) {
    await Resource.insertMany(DEFAULT_RESOURCES.map((item, index) => ({ ...item, order: index + 1, updated: new Date(item.updated) })));
    await ContentMigration.updateOne({ _id: "legacy-downloads-v1" }, { $setOnInsert: { appliedAt: new Date() } }, { upsert: true });
  }

  // 8. Seed Projects
  const projectDocs = DEFAULT_PROJECTS.map((proj, idx) => ({
    code: proj.code,
    title: proj.title,
    sector: proj.sector,
    body: proj.body,
    tags: proj.tags || [],
    images: proj.images || [],
    isPublished: proj.isPublished !== false,
    order: idx + 1,
  }));
  if (projectDocs.length > 0) {
    await Project.insertMany(projectDocs);
  }

  // 9. Seed Equipment
  const equipmentDocs = SEED_EQUIPMENT.map((eq, idx) => ({
    label: eq.label,
    value: eq.value,
    order: idx + 1,
  }));
  if (equipmentDocs.length > 0) {
    await Equipment.insertMany(equipmentDocs);
  }

  // 10. Seed Clients
  const clientSource = siteContent.Company?.Clients?.length
    ? siteContent.Company.Clients
    : DEFAULT_SITE_CONTENT.Company.Clients;
  const clientDocs = clientSource.map((client, idx) => ({
    name: client.name,
    category: client.category || "Institutional",
    description: client.description || "",
    image: client.image,
    order: client.order ?? idx + 1,
  }));
  if (clientDocs.length > 0) {
    await Client.insertMany(clientDocs);
  }

  // 11. Seed Navigation Tree
  await Navigation.findOneAndUpdate(
    { treeKey: "default" },
    { treeKey: "default", tabs: navTree.tabs },
    { upsert: true, returnDocument: "after" }
  );

  const counts = {
    solutions: await Solution.countDocuments(),
    products: await Product.countDocuments(),
    industries: await Industry.countDocuments(),
    leaders: await Leader.countDocuments(),
    partners: await Partner.countDocuments(),
    articles: await Article.countDocuments(),
    projects: await Project.countDocuments(),
    equipment: await Equipment.countDocuments(),
    clients: await Client.countDocuments(),
    navigation: await Navigation.countDocuments(),
    resources: await Resource.countDocuments(),
  };

  return { seeded: true, counts };
}

if (process.argv[1] && process.argv[1].endsWith("seed.ts")) {
  seedDatabase(true)
    .then((result) => {
      console.log("Seeding complete:", result);
      process.exit(0);
    })
    .catch((err) => {
      console.error("Seeding failed:", err);
      process.exit(1);
    });
}

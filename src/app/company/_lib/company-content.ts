import { companyService } from "@/lib/db/services/company.service";

export type NewsItem = {
  slug: string;
  title: string;
  date: string;
  category: string;
  excerpt: string;
  body: string[];
};

export type CareerRole = {
  slug: string;
  title: string;
  category: string;
  location: string;
  summary: string;
  responsibilities: string[];
  requirements: string[];
};

export type ResourceDocument = {
  slug: string;
  title: string;
  category: string;
  summary: string;
  updated: string;
};

export const RESOURCE_DOCUMENTS: ResourceDocument[] = [
  {
    slug: "uav-lidar-workflow",
    title: "UAV LiDAR Survey Workflow Guide",
    category: "Operations",
    summary: "Step-by-step field procedures for planning, executing, and processing UAV LiDAR survey missions including pre-flight checks, GCP placement, and trajectory post-processing.",
    updated: "2026-08-15",
  },
  {
    slug: "gnss-network-adjustment",
    title: "GNSS Network Adjustment Reference",
    category: "Geodetic Control",
    summary: "Technical reference for designing, observing, and adjusting static GNSS baselines including loop closure tolerances and datum transformation parameters.",
    updated: "2026-07-22",
  },
  {
    slug: "point-cloud-classification",
    title: "Point Cloud Classification Standards",
    category: "Data Processing",
    summary: "Classification schema and quality assurance criteria for airborne LiDAR point clouds following ASPRS LAS 1.4 standards.",
    updated: "2026-06-10",
  },
  {
    slug: "gis-data-delivery-spec",
    title: "GIS Data Delivery Specification",
    category: "GIS & Spatial Data",
    summary: "File format requirements, coordinate reference system standards, and metadata documentation for spatial data deliverables.",
    updated: "2026-05-28",
  },
];

export type LeaderItem = {
  name: string;
  role: string;
  division?: string;
  bio?: string;
  image?: { src: string; alt: string };
};

export type PartnerItem = {
  id: string;
  name: string;
  category?: string;
  tier?: string;
  description?: string;
};

export type ClientItem = {
  name: string;
  logo?: string;
  category?: string;
};

export function newsSlug(rawTitle: string): string {
  return rawTitle
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function careerSlug(rawTitle: string): string {
  return rawTitle
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function getDynamicNewsItems(): Promise<NewsItem[]> {
  try {
    const list = await companyService.getArticles(true);
    if (list && list.length > 0) {
      return list.map((a) => ({
        slug: a.slug,
        title: a.title,
        date: a.date ? new Date(a.date).toISOString().split("T")[0] : "",
        category: a.category || "General",
        excerpt: a.excerpt || "",
        body: a.body || [],
      }));
    }
  } catch (err) {
    console.error("Error fetching dynamic news:", err);
  }
  return [];
}

export async function getDynamicNewsItemBySlug(slug: string): Promise<NewsItem | undefined> {
  try {
    const a = await companyService.getArticleBySlug(slug);
    if (a) {
      return {
        slug: a.slug,
        title: a.title,
        date: a.date ? new Date(a.date).toISOString().split("T")[0] : "",
        category: a.category || "General",
        excerpt: a.excerpt || "",
        body: a.body || [],
      };
    }
  } catch (err) {
    console.error("Error fetching dynamic news by slug:", err);
  }
  return undefined;
}

export async function getDynamicCareerRoles(): Promise<CareerRole[]> {
  try {
    const list = await companyService.getCareers(true);
    if (list && list.length > 0) {
      return list.map((c) => ({
        slug: c.slug,
        title: c.title,
        category: c.category || "General",
        location: c.location || "Kathmandu and field projects",
        summary: c.summary || "",
        responsibilities: c.responsibilities || [],
        requirements: c.requirements || [],
      }));
    }
  } catch (err) {
    console.error("Error fetching dynamic careers:", err);
  }
  return [];
}

export async function getDynamicCareerRoleBySlug(slug: string): Promise<CareerRole | undefined> {
  try {
    const c = await companyService.getCareerBySlug(slug);
    if (c) {
      return {
        slug: c.slug,
        title: c.title,
        category: c.category || "General",
        location: c.location || "Kathmandu and field projects",
        summary: c.summary || "",
        responsibilities: c.responsibilities || [],
        requirements: c.requirements || [],
      };
    }
  } catch (err) {
    console.error("Error fetching dynamic career by slug:", err);
  }
  return undefined;
}

export async function getDynamicLeaders(): Promise<LeaderItem[]> {
  try {
    const leaders = await companyService.getLeaders();
    return leaders.map((l) => ({
      name: l.name,
      role: l.role,
      division: l.division,
      bio: l.bio,
      image: l.image,
    }));
  } catch (err) {
    console.error("Error fetching dynamic leaders:", err);
    return [];
  }
}

export async function getDynamicPartners(): Promise<PartnerItem[]> {
  try {
    const partners = await companyService.getPartners();
    return partners.map((p) => ({
      id: p.customId || p._id.toString(),
      name: p.name,
      category: p.category,
      tier: p.tier,
      description: p.description,
    }));
  } catch (err) {
    console.error("Error fetching dynamic partners:", err);
    return [];
  }
}

export async function getDynamicClients(): Promise<ClientItem[]> {
  try {
    const clients = await companyService.getClients();
    return clients.map((c) => ({
      name: c.name,
      logo: c.logo,
      category: c.category,
    }));
  } catch (err) {
    console.error("Error fetching dynamic clients:", err);
    return [];
  }
}

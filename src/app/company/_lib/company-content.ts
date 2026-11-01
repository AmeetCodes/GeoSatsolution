import { companyService } from "@/lib/db/services/company.service";

export type NewsItem = {
  slug: string;
  title: string;
  date: string;
  category: string;
  excerpt: string;
  body: string[];
  image?: { src: string; alt: string; source?: "upload" | "url"; mediaId?: string };
  author?: string;
};

export type ResourceDocument = {
  id?: string;
  slug: string;
  title: string;
  category: string;
  summary: string;
  updated: string;
  fileUrl?: string;
  fileName?: string;
  thumbnail?: { src: string; alt: string; source?: "upload" | "url"; mediaId?: string };
  isPublished?: boolean;
};

export async function getDynamicResources(): Promise<ResourceDocument[]> {
  try {
    const resources = await companyService.getResources(true);
    return resources.map((resource) => ({
      id: resource._id.toString(),
      slug: resource.slug,
      title: resource.title,
      category: resource.category,
      summary: resource.description || "",
      updated: resource.updated ? new Date(resource.updated).toISOString().slice(0, 10) : "",
      fileUrl: resource.fileUrl || "",
      fileName: resource.fileName || "",
      thumbnail: resource.thumbnail ? { ...resource.thumbnail, mediaId: resource.thumbnail.mediaId ? String(resource.thumbnail.mediaId) : undefined } : undefined,
      isPublished: resource.isPublished,
    }));
  } catch (error) {
    console.error("Error fetching dynamic resources:", error);
    return [];
  }
}

export type LeaderItem = {
  id?: string;
  name: string;
  role: string;
  division?: string;
  bio?: string;
  expertise?: string;
  image?: { src: string; alt: string; source?: "upload" | "url"; mediaId?: string };
  accent?: string;
  imagePosition?: string;
  order?: number;
};

export type PartnerItem = {
  id: string;
  name: string;
  category?: string;
  tier?: string;
  description?: string;
  url?: string;
  logo?: { src: string; alt: string; source?: "upload" | "url"; mediaId?: string };
  order?: number;
};

export type ClientItem = {
  id: string;
  name: string;
  category: string;
  description: string;
  url?: string;
  image?: { src: string; alt: string; source?: "upload" | "url"; mediaId?: string };
  order: number;
};

export function newsSlug(rawTitle: string): string {
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
        image: a.image ? { ...a.image, mediaId: a.image.mediaId ? String(a.image.mediaId) : undefined } : undefined,
        author: a.author,
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
        image: a.image ? { ...a.image, mediaId: a.image.mediaId ? String(a.image.mediaId) : undefined } : undefined,
        author: a.author,
      };
    }
  } catch (err) {
    console.error("Error fetching dynamic news by slug:", err);
  }
  return undefined;
}

export async function getDynamicLeaders(): Promise<LeaderItem[]> {
  try {
    const leaders = await companyService.getLeaders();
    return leaders.map((l) => ({
      id: l.customId || l._id.toString(),
      name: l.name,
      role: l.role,
      division: l.division,
      bio: l.bio,
      expertise: l.expertise || l.bio,
      image: l.image,
      accent: l.accent,
      imagePosition: l.imagePosition,
      order: l.order,
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
      url: p.url,
      logo: p.logo ? {
        src: p.logo.src,
        alt: p.logo.alt,
        source: p.logo.source,
        mediaId: p.logo.mediaId ? String(p.logo.mediaId) : undefined,
      } : undefined,
      order: p.order,
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
      id: c._id.toString(),
      name: c.name,
      category: c.category || "Institutional",
      description: c.description || "",
      url: c.url,
      image: c.image ? {
        src: c.image.src,
        alt: c.image.alt,
        source: c.image.source,
        mediaId: c.image.mediaId ? String(c.image.mediaId) : undefined,
      } : c.logo ? { src: c.logo, alt: c.name } : undefined,
      order: c.order || 0,
    }));
  } catch (err) {
    console.error("Error fetching dynamic clients:", err);
    return [];
  }
}

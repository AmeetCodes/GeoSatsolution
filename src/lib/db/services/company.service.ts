import { revalidatePath } from "next/cache";
import { companyRepository } from "../repositories/company.repository";
import { ILeader } from "../../models/leader";
import { IPartner } from "../../models/partner";
import { IArticle } from "../../models/Article";
import { ICareer } from "../../models/career";
import { IClient } from "../../models/client";
import { Types } from "mongoose";
import type { SiteContentData } from "../../data-store";

export class CompanyService {
  async getCompanyData() {
    const [leadership, partners, insights, careers, resources] = await Promise.all([
      companyRepository.getLeaders(),
      companyRepository.getPartners(),
      companyRepository.getArticles(false),
      companyRepository.getCareers(false),
      companyRepository.getResources(false),
    ]);

    return {
      Leadership: leadership.map((l) => ({
        id: l.customId || l._id.toString(),
        name: l.name,
        role: l.role,
        division: l.division,
        bio: l.bio,
        image: l.image,
        order: l.order,
      })),
      Partners: partners.map((p) => ({
        id: p.customId || p._id.toString(),
        name: p.name,
        category: p.category,
        tier: p.tier,
        description: p.description,
        logo: p.logo,
        order: p.order,
      })),
      Insights: insights.map((a) => ({
        id: a._id.toString(),
        slug: a.slug,
        title: a.title,
        date: a.date ? a.date.toISOString().split("T")[0] : "",
        category: a.category,
        excerpt: a.excerpt,
        body: a.body || [],
        image: a.image,
        author: a.author,
        isPublished: a.isPublished,
      })),
      Careers: careers.map((c) => ({
        id: c._id.toString(),
        slug: c.slug,
        title: c.title,
        category: c.category,
        location: c.location,
        summary: c.summary,
        description: c.description,
        employmentType: c.employmentType,
        applicationInfo: c.applicationInfo,
        status: c.status,
        isPublished: c.isPublished,
        responsibilities: c.responsibilities || [],
        requirements: c.requirements || [],
      })),
      Resources: resources.map((resource) => ({
        id: resource._id.toString(),
        slug: resource.slug,
        title: resource.title,
        category: resource.category,
        description: resource.description || "",
        fileUrl: resource.fileUrl || "",
        thumbnail: resource.thumbnail,
        updated: resource.updated ? new Date(resource.updated).toISOString().slice(0, 10) : "",
        isPublished: resource.isPublished,
      })),
    };
  }

  async getLeaders(): Promise<ILeader[]> {
    return companyRepository.getLeaders();
  }

  async getPartners(): Promise<IPartner[]> {
    return companyRepository.getPartners();
  }

  async getClients(): Promise<IClient[]> {
    return companyRepository.getClients();
  }

  async getResources(publishedOnly = true) {
    return companyRepository.getResources(publishedOnly);
  }

  async getArticles(publishedOnly = true): Promise<IArticle[]> {
    return companyRepository.getArticles(publishedOnly);
  }

  async getArticleBySlug(slug: string): Promise<IArticle | null> {
    return companyRepository.getArticleBySlug(slug);
  }

  async getCareers(publishedOnly = true): Promise<ICareer[]> {
    return companyRepository.getCareers(publishedOnly);
  }

  async getCareerBySlug(slug: string): Promise<ICareer | null> {
    return companyRepository.getCareerBySlug(slug);
  }

  async updateCompany(data: Partial<SiteContentData["Company"]>) {
    if (data.Leadership) {
      const leaderDocs = data.Leadership.map((item, idx) => ({
        customId: item.id || new Types.ObjectId().toString(),
        name: item.name,
        role: item.role,
        division: item.division,
        bio: item.bio,
        image: item.image || {
          src: `/team/${item.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.svg`,
          alt: item.name,
        },
        order: item.order ?? idx + 1,
      }));
      await companyRepository.replaceLeaders(leaderDocs);
    }

    if (data.Partners) {
      const partnerDocs = data.Partners.map((item, idx) => ({
        customId: item.id || `PART-${idx + 1}`,
        name: item.name,
        category: item.category,
        tier: item.tier,
        description: item.description,
        logo: item.logo,
        order: item.order ?? idx + 1,
      }));
      await companyRepository.replacePartners(partnerDocs);
    }

    if (data.Insights) {
      const articleDocs = data.Insights.map((item) => ({
        id: item.id,
        slug: item.slug || item.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        title: item.title,
        date: item.date ? new Date(item.date) : new Date(),
        category: item.category,
        excerpt: item.excerpt,
        body: item.body || [],
        image: item.image,
        author: item.author || "GeoSAT Editorial",
        isPublished: item.isPublished !== false,
      }));
      await companyRepository.replaceArticles(articleDocs);
    }

    if (data.Careers) {
      const careerDocs = data.Careers.map((item) => ({
        id: item.id,
        slug: item.slug || item.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        title: item.title,
        category: item.category,
        location: item.location,
        summary: item.summary,
        description: item.description || "",
        employmentType: item.employmentType || "Full-time",
        applicationInfo: item.applicationInfo || "",
        status: item.status || "open",
        responsibilities: item.responsibilities || [],
        requirements: item.requirements || [],
        isPublished: item.isPublished !== false,
      }));
      await companyRepository.replaceCareers(careerDocs);
    }

    if (data.Resources) {
      await companyRepository.replaceResources(data.Resources.map((item, index) => ({
        ...item,
        id: item.id,
        order: index + 1,
        updated: item.updated ? new Date(item.updated) : new Date(),
      })));
    }

    this.revalidate();
    return this.getCompanyData();
  }

  private revalidate() {
    try {
      revalidatePath("/", "layout");
      revalidatePath("/company/careers");
      revalidatePath("/company/insights/news");
      revalidatePath("/company/insights/downloads-technical-resources");
      revalidatePath("/company/about/executive-technical-leads");
      revalidatePath("/company/about/geosat-partners");
      revalidatePath("/leadership");
    } catch {
      // safe fallback
    }
  }
}

export const companyService = new CompanyService();

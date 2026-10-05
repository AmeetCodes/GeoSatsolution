import { revalidatePath } from "next/cache";
import { companyRepository } from "../repositories/company.repository";
import { ILeader } from "../../models/leader";
import { IPartner } from "../../models/partner";
import { IArticle } from "../../models/Article";
import { ICareer } from "../../models/career";
import { IClient } from "../../models/client";

export class CompanyService {
  async getCompanyData() {
    const [leadership, partners, insights, careers] = await Promise.all([
      companyRepository.getLeaders(),
      companyRepository.getPartners(),
      companyRepository.getArticles(false),
      companyRepository.getCareers(false),
    ]);

    return {
      Leadership: leadership.map((l) => ({
        name: l.name,
        role: l.role,
        division: l.division,
        bio: l.bio,
      })),
      Partners: partners.map((p) => ({
        id: p.customId || p._id.toString(),
        name: p.name,
        category: p.category,
        tier: p.tier,
        description: p.description,
      })),
      Insights: insights.map((a) => ({
        slug: a.slug,
        title: a.title,
        date: a.date ? a.date.toISOString().split("T")[0] : "",
        category: a.category,
        excerpt: a.excerpt,
        body: a.body || [],
      })),
      Careers: careers.map((c) => ({
        slug: c.slug,
        title: c.title,
        category: c.category,
        location: c.location,
        summary: c.summary,
        responsibilities: c.responsibilities || [],
        requirements: c.requirements || [],
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

  async updateCompany(data: {
    Leadership?: any[];
    Partners?: any[];
    Insights?: any[];
    Careers?: any[];
  }) {
    if (data.Leadership) {
      const leaderDocs = data.Leadership.map((item, idx) => ({
        name: item.name,
        role: item.role,
        division: item.division,
        bio: item.bio,
        image: {
          src: `/team/${item.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.svg`,
          alt: item.name,
        },
        order: idx + 1,
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
        order: idx + 1,
      }));
      await companyRepository.replacePartners(partnerDocs);
    }

    if (data.Insights) {
      const articleDocs = data.Insights.map((item) => ({
        slug: item.slug || item.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        title: item.title,
        date: item.date ? new Date(item.date) : new Date(),
        category: item.category,
        excerpt: item.excerpt,
        body: item.body || [],
        author: "GeoSAT Editorial",
        isPublished: true,
      }));
      await companyRepository.replaceArticles(articleDocs);
    }

    if (data.Careers) {
      const careerDocs = data.Careers.map((item) => ({
        slug: item.slug || item.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        title: item.title,
        category: item.category,
        location: item.location,
        summary: item.summary,
        responsibilities: item.responsibilities || [],
        requirements: item.requirements || [],
        isPublished: true,
      }));
      await companyRepository.replaceCareers(careerDocs);
    }

    this.revalidate();
    return this.getCompanyData();
  }

  private revalidate() {
    try {
      revalidatePath("/", "layout");
      revalidatePath("/company/careers");
      revalidatePath("/company/insights/news");
      revalidatePath("/company/about/executive-technical-leads");
      revalidatePath("/company/about/geosat-partners");
      revalidatePath("/leadership");
    } catch {
      // safe fallback
    }
  }
}

export const companyService = new CompanyService();

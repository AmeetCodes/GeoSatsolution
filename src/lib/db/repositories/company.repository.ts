import connectDB from "../connection";
import { Leader, ILeader } from "../../models/leader";
import { Partner, IPartner } from "../../models/partner";
import { Article, IArticle } from "../../models/Article";
import { Career, ICareer } from "../../models/career";
import { Client, IClient } from "../../models/client";

export class CompanyRepository {
  // Leadership
  async getLeaders(): Promise<ILeader[]> {
    await connectDB();
    return Leader.find({}).sort({ order: 1, createdAt: 1 }).lean().exec() as unknown as Promise<ILeader[]>;
  }

  async replaceLeaders(leaders: Partial<ILeader>[]): Promise<ILeader[]> {
    await connectDB();
    await Leader.deleteMany({});
    if (leaders.length === 0) return [];
    return Leader.insertMany(leaders) as unknown as Promise<ILeader[]>;
  }

  // Partners
  async getPartners(): Promise<IPartner[]> {
    await connectDB();
    return Partner.find({}).sort({ order: 1, createdAt: 1 }).lean().exec() as unknown as Promise<IPartner[]>;
  }

  async replacePartners(partners: Partial<IPartner>[]): Promise<IPartner[]> {
    await connectDB();
    await Partner.deleteMany({});
    if (partners.length === 0) return [];
    return Partner.insertMany(partners) as unknown as Promise<IPartner[]>;
  }

  // Articles / Insights
  async getArticles(publishedOnly = false): Promise<IArticle[]> {
    await connectDB();
    const query = publishedOnly ? { isPublished: true } : {};
    return Article.find(query).sort({ date: -1, createdAt: -1 }).lean().exec() as unknown as Promise<IArticle[]>;
  }

  async getArticleBySlug(slug: string): Promise<IArticle | null> {
    await connectDB();
    return Article.findOne({ slug }).lean().exec() as unknown as Promise<IArticle | null>;
  }

  async replaceArticles(articles: Partial<IArticle>[]): Promise<IArticle[]> {
    await connectDB();
    await Article.deleteMany({});
    if (articles.length === 0) return [];
    return Article.insertMany(articles) as unknown as Promise<IArticle[]>;
  }

  // Careers
  async getCareers(publishedOnly = false): Promise<ICareer[]> {
    await connectDB();
    const query = publishedOnly ? { isPublished: true } : {};
    return Career.find(query).sort({ createdAt: -1 }).lean().exec() as unknown as Promise<ICareer[]>;
  }

  async getCareerBySlug(slug: string): Promise<ICareer | null> {
    await connectDB();
    return Career.findOne({ slug }).lean().exec() as unknown as Promise<ICareer | null>;
  }

  async replaceCareers(careers: Partial<ICareer>[]): Promise<ICareer[]> {
    await connectDB();
    await Career.deleteMany({});
    if (careers.length === 0) return [];
    return Career.insertMany(careers) as unknown as Promise<ICareer[]>;
  }

  // Clients
  async getClients(): Promise<IClient[]> {
    await connectDB();
    return Client.find({}).sort({ order: 1, createdAt: 1 }).lean().exec() as unknown as Promise<IClient[]>;
  }
}

export const companyRepository = new CompanyRepository();

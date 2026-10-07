import connectDB from "../connection";
import { Types } from "mongoose";
import { Leader, ILeader } from "../../models/leader";
import { Partner, IPartner } from "../../models/partner";
import { Article, IArticle } from "../../models/Article";
import { Career, ICareer } from "../../models/career";
import { Client, IClient } from "../../models/client";
import { Resource, IResource } from "../../models/Resource";

export class CompanyRepository {
  // Leadership
  async getLeaders(): Promise<ILeader[]> {
    await connectDB();
    return Leader.find({}).sort({ order: 1, createdAt: 1 }).lean().exec() as unknown as Promise<ILeader[]>;
  }

  async replaceLeaders(leaders: Partial<ILeader>[]): Promise<ILeader[]> {
    await connectDB();
    const ids = leaders.flatMap((item) => item.customId ? [item.customId] : []);
    if (leaders.length) await Leader.bulkWrite(leaders.map((item) => {
      const filter = item.customId
        ? { $or: [{ customId: item.customId }, ...(Types.ObjectId.isValid(item.customId) ? [{ _id: new Types.ObjectId(item.customId) }] : []), { name: item.name }] }
        : { name: item.name };
      return { updateOne: { filter, update: { $set: item }, upsert: true } };
    }));
    await Leader.deleteMany({ $and: [{ customId: { $nin: ids } }, { name: { $nin: leaders.flatMap((item) => item.name ? [item.name] : []) } }] });
    return Leader.find({}).sort({ order: 1, createdAt: 1 }).lean().exec() as unknown as Promise<ILeader[]>;
  }

  // Partners
  async getPartners(): Promise<IPartner[]> {
    await connectDB();
    return Partner.find({}).sort({ order: 1, createdAt: 1 }).lean().exec() as unknown as Promise<IPartner[]>;
  }

  async replacePartners(partners: Partial<IPartner>[]): Promise<IPartner[]> {
    await connectDB();
    const ids = partners.flatMap((item) => item.customId ? [item.customId] : []);
    if (partners.length) await Partner.bulkWrite(partners.map((item) => {
      const filter = item.customId
        ? { $or: [{ customId: item.customId }, ...(Types.ObjectId.isValid(item.customId) ? [{ _id: new Types.ObjectId(item.customId) }] : []), { name: item.name }] }
        : { name: item.name };
      const { logo, ...data } = item;
      const update = logo ? { $set: item } : { $set: data, $unset: { logo: 1 as const } };
      return { updateOne: { filter, update, upsert: true } };
    }));
    await Partner.deleteMany({ customId: { $nin: ids } });
    return Partner.find({}).sort({ order: 1, createdAt: 1 }).lean().exec() as unknown as Promise<IPartner[]>;
  }

  // Articles / Insights
  async getArticles(publishedOnly = false): Promise<IArticle[]> {
    await connectDB();
    const query = publishedOnly ? { isPublished: true } : {};
    return Article.find(query).sort({ date: -1, createdAt: -1 }).lean().exec() as unknown as Promise<IArticle[]>;
  }

  async getArticleBySlug(slug: string): Promise<IArticle | null> {
    await connectDB();
    return Article.findOne({ slug, isPublished: true }).lean().exec() as unknown as Promise<IArticle | null>;
  }

  async replaceArticles(articles: (Partial<IArticle> & { id?: string })[]): Promise<IArticle[]> {
    await connectDB();
    const ids = articles.flatMap((item) => item.id ? [new Types.ObjectId(String(item.id))] : []);
    const slugs = articles.flatMap((item) => item.slug ? [item.slug] : []);
    if (articles.length) await Article.bulkWrite(articles.map((item) => {
      const { id, ...data } = item;
      return { updateOne: { filter: id ? { _id: new Types.ObjectId(String(id)) } : { slug: item.slug }, update: { $set: data }, upsert: true } };
    }));
    await Article.deleteMany({ $and: [{ _id: { $nin: ids } }, { slug: { $nin: slugs } }] });
    return Article.find({}).sort({ date: -1, createdAt: -1 }).lean().exec() as unknown as Promise<IArticle[]>;
  }

  // Careers
  async getCareers(publishedOnly = false): Promise<ICareer[]> {
    await connectDB();
    const query = publishedOnly ? { isPublished: true } : {};
    return Career.find(query).sort({ createdAt: -1 }).lean().exec() as unknown as Promise<ICareer[]>;
  }

  async getCareerBySlug(slug: string): Promise<ICareer | null> {
    await connectDB();
    return Career.findOne({ slug, isPublished: true }).lean().exec() as unknown as Promise<ICareer | null>;
  }

  async replaceCareers(careers: (Partial<ICareer> & { id?: string })[]): Promise<ICareer[]> {
    await connectDB();
    const ids = careers.flatMap((item) => item.id ? [new Types.ObjectId(String(item.id))] : []);
    const slugs = careers.flatMap((item) => item.slug ? [item.slug] : []);
    if (careers.length) await Career.bulkWrite(careers.map((item) => {
      const { id, ...data } = item;
      return { updateOne: { filter: id ? { _id: new Types.ObjectId(String(id)) } : { slug: item.slug }, update: { $set: data }, upsert: true } };
    }));
    await Career.deleteMany({ $and: [{ _id: { $nin: ids } }, { slug: { $nin: slugs } }] });
    return Career.find({}).sort({ createdAt: -1 }).lean().exec() as unknown as Promise<ICareer[]>;
  }

  // Clients
  async getClients(): Promise<IClient[]> {
    await connectDB();
    return Client.find({}).sort({ order: 1, createdAt: 1 }).lean().exec() as unknown as Promise<IClient[]>;
  }

  async replaceClients(clients: (Partial<IClient> & { id?: string })[]): Promise<IClient[]> {
    await connectDB();
    const ids = clients.flatMap((item) => item.id && Types.ObjectId.isValid(item.id)
      ? [new Types.ObjectId(item.id)]
      : []);
    const names = clients.flatMap((item) => item.name ? [item.name] : []);
    if (clients.length) {
      await Client.bulkWrite(clients.map((item) => {
        const { id, image, ...data } = item;
        const filter = id && Types.ObjectId.isValid(id) ? { _id: new Types.ObjectId(id) } : { name: item.name };
        const update = {
          $set: image ? { ...data, image } : data,
          $unset: { logo: 1 as const, ...(!image ? { image: 1 as const } : {}) },
        };
        return { updateOne: { filter, update, upsert: true } };
      }));
    }
    await Client.deleteMany({ $and: [{ _id: { $nin: ids } }, { name: { $nin: names } }] });
    return Client.find({}).sort({ order: 1, createdAt: 1 }).lean().exec() as unknown as Promise<IClient[]>;
  }

  async getResources(publishedOnly = false): Promise<IResource[]> {
    await connectDB();
    return Resource.find(publishedOnly ? { isPublished: true } : {}).sort({ order: 1, updated: -1 }).lean().exec() as unknown as Promise<IResource[]>;
  }

  async replaceResources(resources: (Partial<IResource> & { id?: string })[]): Promise<IResource[]> {
    await connectDB();
    const ids = resources.flatMap((item) => item.id ? [new Types.ObjectId(String(item.id))] : []);
    const slugs = resources.flatMap((item) => item.slug ? [item.slug] : []);
    if (resources.length) await Resource.bulkWrite(resources.map((item) => {
      const { id, ...data } = item;
      return { updateOne: { filter: id ? { _id: new Types.ObjectId(String(id)) } : { slug: item.slug }, update: { $set: data }, upsert: true } };
    }));
    await Resource.deleteMany({ $and: [{ _id: { $nin: ids } }, { slug: { $nin: slugs } }] });
    return this.getResources();
  }
}

export const companyRepository = new CompanyRepository();

import connectDB from "../connection";
import { revalidatePath } from "next/cache";
import { Project, IProject } from "../../models/project";
import { Equipment, IEquipment } from "../../models/equipment";
import { Client, IClient } from "../../models/client";
import { Consultation, IConsultation } from "../../models/Consultation";
import type { ProjectItem } from "../../data/project-content";

export class ContentService {
  async getProjects(publishedOnly = false): Promise<IProject[]> {
    await connectDB();
    const query = publishedOnly
      ? { $or: [{ isPublished: true }, { isPublished: { $exists: false } }] }
      : {};
    return Project.find(query).sort({ order: 1, createdAt: 1 }).lean().exec() as unknown as Promise<IProject[]>;
  }

  async replaceProjects(projects: ProjectItem[]): Promise<IProject[]> {
    await connectDB();
    await Project.deleteMany({}).exec();

    const saved = projects.length
      ? await Project.insertMany(projects.map((project, index) => ({
          ...project,
          order: index + 1,
          images: project.images || [],
          isPublished: project.isPublished !== false,
        })))
      : [];

    try {
      revalidatePath("/", "page");
      revalidatePath("/company/our-work");
    } catch {
      // Revalidation is unavailable outside a Next.js request context.
    }

    return saved as unknown as IProject[];
  }

  async getEquipment(): Promise<IEquipment[]> {
    await connectDB();
    return Equipment.find({}).sort({ order: 1, createdAt: 1 }).lean().exec() as unknown as Promise<IEquipment[]>;
  }

  async getClients(): Promise<IClient[]> {
    await connectDB();
    return Client.find({}).sort({ order: 1, createdAt: 1 }).lean().exec() as unknown as Promise<IClient[]>;
  }

  async saveConsultation(data: {
    name: string;
    organisation?: string;
    email: string;
    phone?: string;
    interest: string;
    otherInterest?: string;
    details: string;
  }): Promise<IConsultation> {
    await connectDB();
    const doc = new Consultation(data);
    return doc.save() as unknown as Promise<IConsultation>;
  }

  async getConsultations(): Promise<IConsultation[]> {
    await connectDB();
    return Consultation.find({}).sort({ createdAt: -1 }).lean().exec() as unknown as Promise<IConsultation[]>;
  }


  async getLeaders() {
    const { companyRepository } = await import("../repositories/company.repository");
    return companyRepository.getLeaders();
  }

  async getPartners() {
    const { companyRepository } = await import("../repositories/company.repository");
    return companyRepository.getPartners();
  }

  async getArticles(publishedOnly = false) {
    const { companyRepository } = await import("../repositories/company.repository");
    return companyRepository.getArticles(publishedOnly);
  }

  async getArticleBySlug(slug: string) {
    const { companyRepository } = await import("../repositories/company.repository");
    return companyRepository.getArticleBySlug(slug);
  }

  async getResources(publishedOnly = false) {
    const { companyRepository } = await import("../repositories/company.repository");
    return companyRepository.getResources(publishedOnly);
  }

}

export const contentService = new ContentService();
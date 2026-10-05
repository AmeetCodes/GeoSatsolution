import connectDB from "../connection";
import { Industry, IIndustry, IIndustryImage } from "../../models/Industry";

export interface CreateIndustryDTO {
  title: string;
  slug?: string;
  intro?: string;
  description?: string;
  items: string[];
  images?: IIndustryImage[];
  isPublished?: boolean;
  order?: number;
}

export interface UpdateIndustryDTO {
  title?: string;
  slug?: string;
  intro?: string;
  description?: string;
  items?: string[];
  images?: IIndustryImage[];
  isPublished?: boolean;
  order?: number;
}

export class IndustryRepository {
  async findAll(filter: { isPublished?: boolean } = {}): Promise<IIndustry[]> {
    await connectDB();
    const query: Record<string, unknown> = {};
    if (filter.isPublished !== undefined) query.isPublished = filter.isPublished;

    return Industry.find(query).sort({ order: 1, createdAt: 1 }).lean().exec() as unknown as Promise<IIndustry[]>;
  }

  async findBySlug(slug: string): Promise<IIndustry | null> {
    await connectDB();
    return Industry.findOne({ slug }).lean().exec() as unknown as Promise<IIndustry | null>;
  }

  async findByTitle(title: string): Promise<IIndustry | null> {
    await connectDB();
    return Industry.findOne({ title }).lean().exec() as unknown as Promise<IIndustry | null>;
  }

  async findById(id: string): Promise<IIndustry | null> {
    await connectDB();
    return Industry.findById(id).lean().exec() as unknown as Promise<IIndustry | null>;
  }

  async create(data: CreateIndustryDTO): Promise<IIndustry> {
    await connectDB();
    const doc = new Industry(data);
    return doc.save() as unknown as Promise<IIndustry>;
  }

  async updateBySlug(slug: string, data: UpdateIndustryDTO): Promise<IIndustry | null> {
    await connectDB();
    return Industry.findOneAndUpdate(
      { slug },
      { $set: data },
      { returnDocument: "after", runValidators: true }
    ).lean().exec() as unknown as Promise<IIndustry | null>;
  }

  async updateById(id: string, data: UpdateIndustryDTO): Promise<IIndustry | null> {
    await connectDB();
    return Industry.findByIdAndUpdate(
      id,
      { $set: data },
      { returnDocument: "after", runValidators: true }
    ).lean().exec() as unknown as Promise<IIndustry | null>;
  }

  async deleteBySlug(slug: string): Promise<boolean> {
    await connectDB();
    const res = await Industry.deleteOne({ slug }).exec();
    return (res.deletedCount ?? 0) > 0;
  }

  async deleteById(id: string): Promise<boolean> {
    await connectDB();
    const res = await Industry.findByIdAndDelete(id).exec();
    return !!res;
  }

  async replaceAll(industries: CreateIndustryDTO[]): Promise<IIndustry[]> {
    await connectDB();
    await Industry.deleteMany({});
    if (industries.length === 0) return [];
    return Industry.insertMany(industries) as unknown as Promise<IIndustry[]>;
  }

  async count(): Promise<number> {
    await connectDB();
    return Industry.countDocuments();
  }
}

export const industryRepository = new IndustryRepository();

import connectDB from "../connection";
import { Types } from "mongoose";
import { Solution, ISolution, ISolutionImage } from "../../models/solution";
import { normalizeSlug, stripTrailingNumericSuffix } from "../../utils";

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function slugPattern(pattern: string): RegExp {
  return new RegExp(`^${escapeRegExp(pattern)}$`, "i");
}

async function findOneBySlugPattern(pattern: string): Promise<ISolution | null> {
  return Solution.findOne({ slug: { $regex: slugPattern(pattern) } })
    .lean()
    .exec() as unknown as Promise<ISolution | null>;
}

export interface CreateSolutionDTO {
  id?: string;
  title: string;
  slug?: string;
  group: string;
  intro?: string;
  description?: string;
  outcomes?: string[];
  faqs?: { question: string; answer: string }[];
  images?: ISolutionImage[];
  isPublished?: boolean;
  order?: number;
}

export interface UpdateSolutionDTO {
  title?: string;
  slug?: string;
  group?: string;
  intro?: string;
  description?: string;
  outcomes?: string[];
  faqs?: { question: string; answer: string }[];
  images?: ISolutionImage[];
  isPublished?: boolean;
  order?: number;
}

export class SolutionRepository {
  async findAll(filter: { isPublished?: boolean; group?: string } = {}): Promise<ISolution[]> {
    await connectDB();
    const query: Record<string, unknown> = {};
    if (filter.isPublished !== undefined) query.isPublished = filter.isPublished;
    if (filter.group) query.group = filter.group;

    return Solution.find(query).sort({ order: 1, createdAt: 1 }).lean().exec() as unknown as Promise<ISolution[]>;
  }

  async findBySlug(slug: string): Promise<ISolution | null> {
    await connectDB();

    const cleanSlug = normalizeSlug(slug);
    if (!cleanSlug) return null;

    // 1. Case-insensitive exact match on the normalized slug.
    const exactMatch = await findOneBySlugPattern(cleanSlug);
    if (exactMatch) return exactMatch;

    // 2. Retry without an accidental trailing numeric suffix (e.g. engineering-survey321).
    const baseSlug = stripTrailingNumericSuffix(cleanSlug);
    if (baseSlug && baseSlug !== cleanSlug) {
      const baseMatch = await findOneBySlugPattern(baseSlug);
      if (baseMatch) return baseMatch;
    }

    // 3. Last resort: tolerate a stored slug that still has a numeric suffix appended.
    const tolerantPattern = new RegExp(
      `^${escapeRegExp(baseSlug || cleanSlug)}(?:[-_]?\\d+)?$`,
      "i",
    );
    return Solution.findOne({ slug: { $regex: tolerantPattern } })
      .lean()
      .exec() as unknown as Promise<ISolution | null>;
  }

  async findByTitle(title: string): Promise<ISolution | null> {
    await connectDB();
    return Solution.findOne({ title }).lean().exec() as unknown as Promise<ISolution | null>;
  }

  async findById(id: string): Promise<ISolution | null> {
    await connectDB();
    return Solution.findById(id).lean().exec() as unknown as Promise<ISolution | null>;
  }

  async create(data: CreateSolutionDTO): Promise<ISolution> {
    await connectDB();
    const doc = new Solution(data);
    return doc.save() as unknown as Promise<ISolution>;
  }

  async updateBySlug(slug: string, data: UpdateSolutionDTO): Promise<ISolution | null> {
    await connectDB();
    return Solution.findOneAndUpdate(
      { slug },
      { $set: data },
      { returnDocument: "after", runValidators: true }
    ).lean().exec() as unknown as Promise<ISolution | null>;
  }

  async updateByTitle(title: string, data: UpdateSolutionDTO): Promise<ISolution | null> {
    await connectDB();
    return Solution.findOneAndUpdate(
      { title },
      { $set: data },
      { returnDocument: "after", runValidators: true }
    ).lean().exec() as unknown as Promise<ISolution | null>;
  }

  async updateById(id: string, data: UpdateSolutionDTO): Promise<ISolution | null> {
    await connectDB();
    return Solution.findByIdAndUpdate(
      id,
      { $set: data },
      { returnDocument: "after", runValidators: true }
    ).lean().exec() as unknown as Promise<ISolution | null>;
  }

  async deleteBySlug(slug: string): Promise<boolean> {
    await connectDB();
    const res = await Solution.deleteOne({ slug }).exec();
    return (res.deletedCount ?? 0) > 0;
  }

  async deleteByTitle(title: string): Promise<boolean> {
    await connectDB();
    const res = await Solution.deleteOne({ title }).exec();
    return (res.deletedCount ?? 0) > 0;
  }

  async deleteById(id: string): Promise<boolean> {
    await connectDB();
    const res = await Solution.findByIdAndDelete(id).exec();
    return !!res;
  }

  async replaceAll(solutions: CreateSolutionDTO[]): Promise<ISolution[]> {
    await connectDB();
    const slugs = solutions.map((item) => item.slug).filter((slug): slug is string => Boolean(slug));
    const ids = solutions.flatMap((item) => item.id ? [new Types.ObjectId(item.id)] : []);
    if (solutions.length) await Solution.bulkWrite(solutions.map((item) => {
      const { id, ...data } = item;
      return { updateOne: { filter: id ? { _id: new Types.ObjectId(id) } : { slug: item.slug }, update: { $set: data }, upsert: true } };
    }));
    await Solution.deleteMany({ $and: [{ _id: { $nin: ids } }, { slug: { $nin: slugs } }] });
    return Solution.find({}).sort({ order: 1, createdAt: 1 }).lean().exec() as unknown as Promise<ISolution[]>;
  }

  async count(): Promise<number> {
    await connectDB();
    return Solution.countDocuments();
  }
}

export const solutionRepository = new SolutionRepository();

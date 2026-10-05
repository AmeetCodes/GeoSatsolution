import connectDB from "../connection";
import { Solution, ISolution, ISolutionImage } from "../../models/solution";

export interface CreateSolutionDTO {
  title: string;
  slug?: string;
  group: string;
  intro?: string;
  description?: string;
  outcomes?: string[];
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
    return Solution.findOne({ slug }).lean().exec() as unknown as Promise<ISolution | null>;
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
    await Solution.deleteMany({});
    if (solutions.length === 0) return [];
    return Solution.insertMany(solutions) as unknown as Promise<ISolution[]>;
  }

  async count(): Promise<number> {
    await connectDB();
    return Solution.countDocuments();
  }
}

export const solutionRepository = new SolutionRepository();

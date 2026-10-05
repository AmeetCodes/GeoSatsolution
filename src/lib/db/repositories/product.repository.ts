import connectDB from "../connection";
import { Types } from "mongoose";
import { Product, IProduct, IProductImage } from "../../models/product";

export interface CreateProductDTO {
  id?: string;
  title: string;
  slug?: string;
  group: string;
  intro?: string;
  description?: string;
  outcomes?: string[];
  images?: IProductImage[];
  specifications?: Record<string, string>;
  faqs?: { question: string; answer: string }[];
  isPublished?: boolean;
  order?: number;
}

export interface UpdateProductDTO {
  title?: string;
  slug?: string;
  group?: string;
  intro?: string;
  description?: string;
  outcomes?: string[];
  images?: IProductImage[];
  specifications?: Record<string, string>;
  faqs?: { question: string; answer: string }[];
  isPublished?: boolean;
  order?: number;
}

export class ProductRepository {
  async findAll(filter: { isPublished?: boolean; group?: string } = {}): Promise<IProduct[]> {
    await connectDB();
    const query: Record<string, unknown> = {};
    if (filter.isPublished !== undefined) query.isPublished = filter.isPublished;
    if (filter.group) query.group = filter.group;

    return Product.find(query).sort({ order: 1, createdAt: 1 }).lean().exec() as unknown as Promise<IProduct[]>;
  }

  async findBySlug(slug: string): Promise<IProduct | null> {
    await connectDB();
    return Product.findOne({ slug }).lean().exec() as unknown as Promise<IProduct | null>;
  }

  async findByTitle(title: string): Promise<IProduct | null> {
    await connectDB();
    return Product.findOne({ title }).lean().exec() as unknown as Promise<IProduct | null>;
  }

  async findById(id: string): Promise<IProduct | null> {
    await connectDB();
    return Product.findById(id).lean().exec() as unknown as Promise<IProduct | null>;
  }

  async create(data: CreateProductDTO): Promise<IProduct> {
    await connectDB();
    const doc = new Product(data);
    return doc.save() as unknown as Promise<IProduct>;
  }

  async updateBySlug(slug: string, data: UpdateProductDTO): Promise<IProduct | null> {
    await connectDB();
    return Product.findOneAndUpdate(
      { slug },
      { $set: data },
      { returnDocument: "after", runValidators: true }
    ).lean().exec() as unknown as Promise<IProduct | null>;
  }

  async updateById(id: string, data: UpdateProductDTO): Promise<IProduct | null> {
    await connectDB();
    return Product.findByIdAndUpdate(
      id,
      { $set: data },
      { returnDocument: "after", runValidators: true }
    ).lean().exec() as unknown as Promise<IProduct | null>;
  }

  async deleteBySlug(slug: string): Promise<boolean> {
    await connectDB();
    const res = await Product.deleteOne({ slug }).exec();
    return (res.deletedCount ?? 0) > 0;
  }

  async deleteById(id: string): Promise<boolean> {
    await connectDB();
    const res = await Product.findByIdAndDelete(id).exec();
    return !!res;
  }

  async replaceAll(products: CreateProductDTO[]): Promise<IProduct[]> {
    await connectDB();
    const slugs = products.map((item) => item.slug).filter((slug): slug is string => Boolean(slug));
    const ids = products.flatMap((item) => item.id ? [new Types.ObjectId(item.id)] : []);
    if (products.length) await Product.bulkWrite(products.map((item) => {
      const { id, ...data } = item;
      return { updateOne: { filter: id ? { _id: new Types.ObjectId(id) } : { slug: item.slug }, update: { $set: data }, upsert: true } };
    }));
    await Product.deleteMany({ $and: [{ _id: { $nin: ids } }, { slug: { $nin: slugs } }] });
    return Product.find({}).sort({ order: 1, createdAt: 1 }).lean().exec() as unknown as Promise<IProduct[]>;
  }

  async count(): Promise<number> {
    await connectDB();
    return Product.countDocuments();
  }
}

export const productRepository = new ProductRepository();

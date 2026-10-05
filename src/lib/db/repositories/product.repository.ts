import connectDB from "../connection";
import { Product, IProduct, IProductImage } from "../../models/product";

export interface CreateProductDTO {
  title: string;
  slug?: string;
  group: string;
  intro?: string;
  description?: string;
  outcomes?: string[];
  images?: IProductImage[];
  specifications?: Record<string, string>;
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
    await Product.deleteMany({});
    if (products.length === 0) return [];
    return Product.insertMany(products) as unknown as Promise<IProduct[]>;
  }

  async count(): Promise<number> {
    await connectDB();
    return Product.countDocuments();
  }
}

export const productRepository = new ProductRepository();

import mongoose, { Schema, Document, Model } from "mongoose";

export interface IProductImage {
  src: string;
  alt: string;
  caption?: string;
}

export interface IProduct extends Document {
  title: string;              // Product Name (e.g., "GNSS Receivers")
  slug: string;
  group: string;              // Category (e.g., "Survey Equipment")
  intro: string;
  description: string;
  outcomes: string[];         // Specifications/Features list
  images: IProductImage[];
  specifications?: Record<string, string>;
  isPublished: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true, index: true },
    group: { type: String, required: true, trim: true, index: true },
    intro: { type: String, required: true },
    description: { type: String, required: true },
    outcomes: { type: [String], default: [] },
    images: [
      {
        src: { type: String, required: true },
        alt: { type: String, required: true },
        caption: { type: String },
      },
    ],
    specifications: { type: Schema.Types.Mixed, default: {} },
    isPublished: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Product: Model<IProduct> =
  mongoose.models.Product || mongoose.model<IProduct>("Product", ProductSchema);
import mongoose, { Schema, Document, Model } from "mongoose";

export interface IProductImage {
  src: string;
  alt: string;
  caption?: string;
  source?: "upload" | "url";
  mediaId?: string;
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
  faqs: { question: string; answer: string }[];
  resources: { title: string; fileUrl: string; fileSource?: "upload" | "url"; fileMediaId?: string; fileName?: string }[];
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
    intro: { type: String, default: "" },
    description: { type: String, default: "" },
    outcomes: { type: [String], default: [] },
    images: [
      {
        src: { type: String, required: true },
        alt: { type: String, required: true },
        caption: { type: String },
        source: { type: String, enum: ["upload", "url"] },
        mediaId: { type: String, match: /^[a-f\d]{24}$/i },
      },
    ],
    specifications: { type: Schema.Types.Mixed, default: {} },
    faqs: [{ question: { type: String, required: true }, answer: { type: String, required: true } }],
    resources: [{
      title: { type: String, required: true, trim: true },
      fileUrl: { type: String, required: true, trim: true },
      fileSource: { type: String, enum: ["upload", "url"] },
      fileMediaId: { type: Schema.Types.ObjectId, ref: "MediaAsset" },
      fileName: { type: String, default: "" },
    }],
    isPublished: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Rebuild a stale dev-server model after schema changes so newly added resource
// fields are not dropped by Mongoose strict mode during hot reloads.
if (mongoose.models.Product && !mongoose.models.Product.schema.path("resources")) {
  delete mongoose.models.Product;
}

export const Product: Model<IProduct> =
  mongoose.models.Product || mongoose.model<IProduct>("Product", ProductSchema);

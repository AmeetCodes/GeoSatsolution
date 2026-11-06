import mongoose, { Schema, Document, Model } from "mongoose";

export type ProductImageFitMode = "contain" | "cover";
export type ProductImageFocalPosition = "center" | "top" | "bottom" | "left" | "right";

export interface IProductImage {
  src: string;
  alt: string;
  caption?: string;
  source?: "upload" | "url";
  mediaId?: string;
  order?: number;
  fitMode?: ProductImageFitMode;
  focalPosition?: ProductImageFocalPosition;
}

export interface IProduct extends Document {
  title: string;              // Product Name (e.g., "Trimble R12i GNSS Receiver")
  slug: string;
  group: string;              // Category (e.g., "Survey Equipment")
  subcategory?: string;       // Subcategory / Class (e.g., "GNSS Receivers")
  brand?: string;             // Brand/Manufacturer (e.g., "Trimble", "DJI")
  brandUrl?: string;          // Official brand/product website URL
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
    subcategory: { type: String, default: "", trim: true, index: true },
    brand: { type: String, default: "", trim: true },
    brandUrl: { type: String, default: "", trim: true },
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
        order: { type: Number, default: 0 },
        fitMode: { type: String, enum: ["contain", "cover"], default: "contain" },
        focalPosition: { type: String, enum: ["center", "top", "bottom", "left", "right"], default: "center" },
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
if (mongoose.models.Product && (!mongoose.models.Product.schema.path("resources") || !mongoose.models.Product.schema.path("subcategory") || !mongoose.models.Product.schema.path("images.fitMode"))) {
  delete mongoose.models.Product;
}

export const Product: Model<IProduct> =
  mongoose.models.Product || mongoose.model<IProduct>("Product", ProductSchema);

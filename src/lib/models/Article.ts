import mongoose, { Schema, Document, Model } from "mongoose";

export interface IArticle extends Document {
  slug: string;
  title: string;
  date: Date;
  category: string;
  excerpt: string;
  image?: { src: string; alt: string; source?: "upload" | "url"; mediaId?: string };
  body: string[];
  author?: string;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ArticleSchema = new Schema<IArticle>(
  {
    slug: { type: String, required: true, unique: true, trim: true, index: true },
    title: { type: String, required: true, trim: true },
    date: { type: Date, default: Date.now },
    category: { type: String, required: true, trim: true },
    excerpt: { type: String, required: true },
    image: {
      src: { type: String },
      alt: { type: String },
      source: { type: String, enum: ["upload", "url"] },
      mediaId: { type: Schema.Types.ObjectId, ref: "MediaAsset" },
    },
    body: { type: [String], required: true },
    author: { type: String, default: "GeoSAT Team" },
    isPublished: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Article: Model<IArticle> =
  mongoose.models.Article || mongoose.model<IArticle>("Article", ArticleSchema);

import mongoose, { Schema, Document, Model } from "mongoose";

export interface IIndustryImage {
  src: string;
  alt: string;
  caption?: string;
}

export interface IIndustry extends Document {
  title: string;              // Sector Title (e.g., "Infrastructure")
  slug: string;
  intro: string;
  description: string;
  items: string[];            // Sub-services (e.g., ["Hydropower & Energy", "Roads, Highways & Bridges"])
  images: IIndustryImage[];
  isPublished: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const IndustrySchema = new Schema<IIndustry>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true, index: true },
    intro: { type: String, default: "" },
    description: { type: String, default: "" },
    items: { type: [String], required: true },
    images: [
      {
        src: { type: String, required: true },
        alt: { type: String, required: true },
        caption: { type: String },
      },
    ],
    isPublished: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Industry: Model<IIndustry> =
  mongoose.models.Industry || mongoose.model<IIndustry>("Industry", IndustrySchema);
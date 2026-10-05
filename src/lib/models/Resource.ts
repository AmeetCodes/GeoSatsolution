import mongoose, { Document, Model, Schema } from "mongoose";

export interface IResource extends Document {
  slug: string;
  title: string;
  category: string;
  description: string;
  fileUrl: string;
  thumbnail?: { src: string; alt: string };
  updated: Date;
  isPublished: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const ResourceSchema = new Schema<IResource>({
  slug: { type: String, required: true, unique: true, trim: true, index: true },
  title: { type: String, required: true, trim: true },
  category: { type: String, required: true, trim: true },
  description: { type: String, default: "" },
  fileUrl: { type: String, default: "" },
  thumbnail: { src: { type: String }, alt: { type: String } },
  updated: { type: Date, default: Date.now },
  isPublished: { type: Boolean, default: true },
  order: { type: Number, default: 0 },
}, { timestamps: true });

export const Resource: Model<IResource> = mongoose.models.Resource || mongoose.model<IResource>("Resource", ResourceSchema);

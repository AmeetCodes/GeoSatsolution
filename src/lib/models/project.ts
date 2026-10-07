import mongoose, { Schema, Document, Model } from "mongoose";

export interface IProject extends Document {
  code: string;               // e.g. "HYD-04"
  title: string;
  sector: string;
  body: string;
  tags: string[];
  images: { src: string; alt: string; caption?: string; source?: "upload" | "url"; mediaId?: string }[];
  isPublished: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema = new Schema<IProject>(
  {
    code: { type: String, required: true, trim: true, unique: true },
    title: { type: String, required: true, trim: true },
    sector: { type: String, required: true, trim: true },
    body: { type: String, required: true },
    tags: { type: [String], default: [] },
    images: [
      {
        src: { type: String, required: true },
        alt: { type: String, default: "" },
        caption: { type: String, default: "" },
        source: { type: String, enum: ["upload", "url"] },
        mediaId: { type: String, match: /^[a-f\d]{24}$/i },
      },
    ],
    isPublished: { type: Boolean, default: true, index: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Project: Model<IProject> =
  mongoose.models.Project || mongoose.model<IProject>("Project", ProjectSchema);

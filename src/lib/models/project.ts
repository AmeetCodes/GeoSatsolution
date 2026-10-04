import mongoose, { Schema, Document, Model } from "mongoose";

export interface IProject extends Document {
  code: string;               // e.g. "HYD-04"
  title: string;
  sector: string;
  body: string;
  tags: string[];
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema = new Schema<IProject>(
  {
    code: { type: String, required: true, trim: true },
    title: { type: String, required: true, trim: true },
    sector: { type: String, required: true, trim: true },
    body: { type: String, required: true },
    tags: { type: [String], default: [] },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Project: Model<IProject> =
  mongoose.models.Project || mongoose.model<IProject>("Project", ProjectSchema);
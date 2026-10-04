import mongoose, { Schema, Document, Model } from "mongoose";

export interface IClient extends Document {
  name: string;
  logo?: string;
  category?: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const ClientSchema = new Schema<IClient>(
  {
    name: { type: String, required: true, trim: true },
    logo: { type: String },
    category: { type: String, default: "Institutional" },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Client: Model<IClient> =
  mongoose.models.Client || mongoose.model<IClient>("Client", ClientSchema);
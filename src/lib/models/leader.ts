import mongoose, { Schema, Document, Model } from "mongoose";

export interface ILeader extends Document {
  customId?: string;
  name: string;
  role: string;
  division: string;
  bio: string;
  expertise?: string;
  image: {
    src: string;
    alt: string;
    source?: "upload" | "url";
    mediaId?: string;
  };
  accent?: string;
  imagePosition?: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const LeaderSchema = new Schema<ILeader>(
  {
    customId: { type: String, unique: true, sparse: true, trim: true },
    name: { type: String, required: true, trim: true },
    role: { type: String, required: true, trim: true },
    division: { type: String, required: true, trim: true },
    bio: { type: String, required: true },
    expertise: { type: String, default: "", trim: true },
    image: {
      src: { type: String, default: "/team/default-avatar.svg" },
      alt: { type: String, default: "Leader profile image" },
      source: { type: String, enum: ["upload", "url"], default: "url" },
      mediaId: { type: Schema.Types.ObjectId, ref: "MediaAsset" },
    },
    accent: { type: String, default: "#0d9488", trim: true },
    imagePosition: { type: String, default: "center top", trim: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Leader: Model<ILeader> =
  mongoose.models.Leader || mongoose.model<ILeader>("Leader", LeaderSchema);

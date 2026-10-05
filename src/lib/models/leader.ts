import mongoose, { Schema, Document, Model } from "mongoose";

export interface ILeader extends Document {
  customId?: string;
  name: string;
  role: string;
  division: string;
  bio: string;
  image: {
    src: string;
    alt: string;
  };
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
    image: {
      src: { type: String, default: "/team/default-avatar.svg" },
      alt: { type: String, default: "Leader profile image" },
    },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Leader: Model<ILeader> =
  mongoose.models.Leader || mongoose.model<ILeader>("Leader", LeaderSchema);

import mongoose, { Document, Model, Schema } from "mongoose";

export interface IAdminSession extends Document {
  sessionId: string;
  email: string;
  role: "admin" | "superadmin";
  issuedAt: Date;
  lastActivityAt: Date;
  expiresAt: Date;
  revokedAt: Date | null;
  ipHash?: string;
  userAgent?: string;
  createdAt: Date;
  updatedAt: Date;
}

const AdminSessionSchema = new Schema<IAdminSession>(
  {
    sessionId: { type: String, required: true, unique: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    role: { type: String, enum: ["admin", "superadmin"], default: "admin" },
    issuedAt: { type: Date, required: true },
    lastActivityAt: { type: Date, required: true },
    expiresAt: { type: Date, required: true },
    revokedAt: { type: Date, default: null },
    ipHash: { type: String },
    userAgent: { type: String, maxlength: 512 },
  },
  { timestamps: true },
);

AdminSessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const AdminSession: Model<IAdminSession> =
  mongoose.models.AdminSession ||
  mongoose.model<IAdminSession>("AdminSession", AdminSessionSchema);

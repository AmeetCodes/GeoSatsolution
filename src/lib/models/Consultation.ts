import mongoose, { Schema, Document, Model } from "mongoose";

export type ConsultationType = "CONSULTATION" | "ASSESSMENT" | "PRODUCT_BUY";

export const CONSULTATION_TYPES: readonly ConsultationType[] = [
  "CONSULTATION",
  "ASSESSMENT",
  "PRODUCT_BUY",
];

export interface IConsultation extends Document {
  name: string;
  organisation?: string;
  email: string;
  phone?: string;
  interest: string;
  otherInterest?: string;
  details: string;
  type?: ConsultationType;
  status: "pending" | "contacted" | "completed" | "archived";
  createdAt: Date;
  updatedAt: Date;
}

const ConsultationSchema = new Schema<IConsultation>(
  {
    name: { type: String, required: true, trim: true },
    organisation: { type: String, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, trim: true },
    interest: { type: String, required: true, trim: true },
    otherInterest: { type: String, trim: true },
    details: { type: String, required: true },
    type: {
      type: String,
      enum: CONSULTATION_TYPES,
      default: "CONSULTATION",
    },
    status: {
      type: String,
      enum: ["pending", "contacted", "completed", "archived"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export const Consultation: Model<IConsultation> =
  mongoose.models.Consultation ||
  mongoose.model<IConsultation>("Consultation", ConsultationSchema);

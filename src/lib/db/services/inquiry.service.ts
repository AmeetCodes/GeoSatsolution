import connectDB from "@/lib/db/connection";
import { Consultation, type IConsultation } from "@/lib/models/Consultation";
import {
  isInquiryStatus,
  isInquiryType,
  type InquiryRecord,
  type InquiryStatus,
  type InquiryStatusCounts,
} from "@/lib/inquiry-types";

export type {
  InquiryRecord,
  InquiryStatus,
  InquiryStatusCounts,
  InquiryType,
} from "@/lib/inquiry-types";
export { INQUIRY_STATUSES, INQUIRY_TYPES } from "@/lib/inquiry-types";

function toIso(value: Date | string | undefined): string {
  if (!value) return "";
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? "" : date.toISOString();
}

function toRecord(doc: IConsultation): InquiryRecord {
  return {
    id: String(doc._id),
    type: isInquiryType(doc.type) ? doc.type : "CONSULTATION",
    name: doc.name ?? "",
    organisation: doc.organisation ?? "",
    email: doc.email ?? "",
    phone: doc.phone ?? "",
    interest: doc.interest ?? "",
    otherInterest: doc.otherInterest ?? "",
    details: doc.details ?? "",
    status: isInquiryStatus(doc.status) ? doc.status : "pending",
    createdAt: toIso(doc.createdAt),
    updatedAt: toIso(doc.updatedAt),
  };
}

export class InquiryService {
  /**
   * Returns every submitted consultation/assessment inquiry, newest first.
   * Failures degrade to an empty list so the admin console still renders.
   */
  async list(): Promise<InquiryRecord[]> {
    try {
      await connectDB();
      const docs = await Consultation.find().sort({ createdAt: -1 }).lean<IConsultation[]>();
      return docs.map(toRecord);
    } catch (error) {
      console.error("Failed to list inquiries:", error);
      return [];
    }
  }

  async count(): Promise<number> {
    try {
      await connectDB();
      return await Consultation.countDocuments();
    } catch (error) {
      console.error("Failed to count inquiries:", error);
      return 0;
    }
  }

  async statusCounts(): Promise<InquiryStatusCounts> {
    const counts: InquiryStatusCounts = {
      total: 0,
      pending: 0,
      contacted: 0,
      completed: 0,
      archived: 0,
    };
    try {
      await connectDB();
      const rows = await Consultation.aggregate<{ _id: InquiryStatus; count: number }>([
        { $group: { _id: "$status", count: { $sum: 1 } } },
      ]);
      for (const row of rows) {
        if (isInquiryStatus(row._id)) counts[row._id] = row.count;
        counts.total += row.count;
      }
    } catch (error) {
      console.error("Failed to aggregate inquiry statuses:", error);
    }
    return counts;
  }

  async updateStatus(id: string, status: InquiryStatus): Promise<InquiryRecord | null> {
    if (!isInquiryStatus(status)) throw new Error("Unsupported inquiry status");
    await connectDB();
    const updated = await Consultation.findByIdAndUpdate(
      id,
      { status },
      { new: true },
    ).lean<IConsultation | null>();
    return updated ? toRecord(updated) : null;
  }
}

export const inquiryService = new InquiryService();

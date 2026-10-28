/**
 * Shared inquiry types for the admin console. Kept free of any server-only
 * imports so both the MongoDB service and client components can consume them.
 */

export type InquiryStatus = "pending" | "contacted" | "completed" | "archived";

export const INQUIRY_STATUSES: readonly InquiryStatus[] = [
  "pending",
  "contacted",
  "completed",
  "archived",
];

export type InquiryType = "CONSULTATION" | "ASSESSMENT" | "PRODUCT_BUY";

export const INQUIRY_TYPES: readonly InquiryType[] = [
  "CONSULTATION",
  "ASSESSMENT",
  "PRODUCT_BUY",
];

export interface InquiryRecord {
  id: string;
  type: InquiryType;
  name: string;
  organisation: string;
  email: string;
  phone: string;
  interest: string;
  otherInterest: string;
  details: string;
  status: InquiryStatus;
  createdAt: string;
  updatedAt: string;
}

export interface InquiryStatusCounts {
  total: number;
  pending: number;
  contacted: number;
  completed: number;
  archived: number;
}

export function isInquiryStatus(value: unknown): value is InquiryStatus {
  return typeof value === "string" && (INQUIRY_STATUSES as readonly string[]).includes(value);
}

export function isInquiryType(value: unknown): value is InquiryType {
  return typeof value === "string" && (INQUIRY_TYPES as readonly string[]).includes(value);
}

export function computeInquiryCounts(list: readonly InquiryRecord[]): InquiryStatusCounts {
  const counts: InquiryStatusCounts = {
    total: list.length,
    pending: 0,
    contacted: 0,
    completed: 0,
    archived: 0,
  };
  for (const inquiry of list) {
    if (isInquiryStatus(inquiry.status)) counts[inquiry.status] += 1;
  }
  return counts;
}

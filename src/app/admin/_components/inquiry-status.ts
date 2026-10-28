import type { InquiryStatus, InquiryType } from "@/lib/inquiry-types";

export interface InquiryStatusMeta {
  value: InquiryStatus;
  label: string;
  /** Badge / select styling for the light admin theme. */
  badgeClass: string;
  dotClass: string;
}

export const INQUIRY_STATUS_META: Record<InquiryStatus, InquiryStatusMeta> = {
  pending: {
    value: "pending",
    label: "New",
    badgeClass: "bg-amber-50 text-amber-700 border-amber-200",
    dotClass: "bg-amber-500",
  },
  contacted: {
    value: "contacted",
    label: "Contacted",
    badgeClass: "bg-blue-50 text-blue-700 border-blue-200",
    dotClass: "bg-blue-500",
  },
  completed: {
    value: "completed",
    label: "Resolved",
    badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200",
    dotClass: "bg-emerald-500",
  },
  archived: {
    value: "archived",
    label: "Archived",
    badgeClass: "bg-slate-100 text-slate-600 border-slate-200",
    dotClass: "bg-slate-400",
  },
};

export const INQUIRY_STATUS_ORDER: InquiryStatus[] = [
  "pending",
  "contacted",
  "completed",
  "archived",
];

export function inquiryStatusLabel(status: InquiryStatus): string {
  return INQUIRY_STATUS_META[status]?.label ?? "New";
}

export interface InquiryTypeMeta {
  value: InquiryType;
  label: string;
  badgeClass: string;
}

export const INQUIRY_TYPE_META: Record<InquiryType, InquiryTypeMeta> = {
  CONSULTATION: {
    value: "CONSULTATION",
    label: "Consultation",
    badgeClass: "bg-teal-50 text-teal-700 border-teal-200",
  },
  ASSESSMENT: {
    value: "ASSESSMENT",
    label: "Assessment",
    badgeClass: "bg-indigo-50 text-indigo-700 border-indigo-200",
  },
  PRODUCT_BUY: {
    value: "PRODUCT_BUY",
    label: "Product / Quote",
    badgeClass: "bg-amber-50 text-amber-700 border-amber-200",
  },
};

export function inquiryTypeLabel(type: InquiryType): string {
  return INQUIRY_TYPE_META[type]?.label ?? "Consultation";
}

export function inquiryTypeBadgeClass(type: InquiryType): string {
  return INQUIRY_TYPE_META[type]?.badgeClass ?? INQUIRY_TYPE_META.CONSULTATION.badgeClass;
}

export function formatInquiryDate(value: string): string {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function inquiryReference(id: string): string {
  return `#INQ-${id.slice(-5).toUpperCase()}`;
}

export function inquiryInterestLabel(inquiry: {
  interest: string;
  otherInterest: string;
}): string {
  if (inquiry.interest && inquiry.interest !== "Other") return inquiry.interest;
  if (inquiry.otherInterest) return inquiry.otherInterest;
  return "General enquiry";
}

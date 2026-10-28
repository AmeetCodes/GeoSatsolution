"use client";

import React, { useEffect } from "react";
import { X, Mail, Phone, Building2, Calendar, Loader2 } from "lucide-react";
import type { InquiryRecord, InquiryStatus } from "@/lib/inquiry-types";
import {
  INQUIRY_STATUS_META,
  INQUIRY_STATUS_ORDER,
  formatInquiryDate,
  inquiryInterestLabel,
  inquiryReference,
  inquiryTypeBadgeClass,
  inquiryTypeLabel,
} from "./inquiry-status";

interface InquiryDrawerProps {
  inquiry: InquiryRecord | null;
  onClose: () => void;
  onStatusChange: (id: string, status: InquiryStatus) => void;
  updatingId?: string | null;
}

export function InquiryDrawer({
  inquiry,
  onClose,
  onStatusChange,
  updatingId = null,
}: InquiryDrawerProps) {
  useEffect(() => {
    if (!inquiry) return;
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [inquiry, onClose]);

  if (!inquiry) return null;

  const meta = INQUIRY_STATUS_META[inquiry.status];
  const isUpdating = updatingId === inquiry.id;

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label="Inquiry details">
      <button
        type="button"
        aria-label="Close details"
        onClick={onClose}
        className="absolute inset-0 cursor-default bg-slate-900/40 backdrop-blur-sm"
      />

      <div className="absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-6 py-5">
          <div className="min-w-0">
            <span className="inline-block rounded bg-slate-100 px-2 py-0.5 font-mono text-[11px] text-slate-500">
              {inquiryReference(inquiry.id)}
            </span>
            <h2 className="mt-2 truncate text-lg font-semibold text-slate-900">{inquiry.name}</h2>
            <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
              <Building2 className="h-3.5 w-3.5" />
              {inquiry.organisation || "Individual enquiry"}
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 space-y-6 overflow-y-auto px-6 py-6">
          {/* Status */}
          <div>
            <label
              htmlFor="inquiry-status"
              className="block text-xs font-semibold uppercase tracking-wider text-slate-500"
            >
              Status
            </label>
            <div className="relative mt-2">
              <select
                id="inquiry-status"
                value={inquiry.status}
                disabled={isUpdating}
                onChange={(event) =>
                  onStatusChange(inquiry.id, event.target.value as InquiryStatus)
                }
                className={`w-full cursor-pointer appearance-none rounded-lg border py-2.5 pl-9 pr-9 text-sm font-semibold outline-none transition-colors focus:ring-2 focus:ring-emerald-500/20 disabled:opacity-60 ${meta.badgeClass}`}
              >
                {INQUIRY_STATUS_ORDER.map((status) => (
                  <option key={status} value={status}>
                    {INQUIRY_STATUS_META[status].label}
                  </option>
                ))}
              </select>
              <span
                className={`pointer-events-none absolute left-3.5 top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full ${meta.dotClass}`}
              />
              {isUpdating ? (
                <Loader2 className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-slate-400" />
              ) : null}
            </div>
          </div>

          {/* Interested area */}
          <div>
            <span className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
              Interested area
            </span>
            <span className="mt-2 inline-flex items-center rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
              {inquiryInterestLabel(inquiry)}
            </span>
          </div>

          {/* Quick contact */}
          <div className="grid grid-cols-2 gap-2">
            <a
              href={`tel:${inquiry.phone}`}
              className={`inline-flex items-center justify-center gap-2 rounded-lg border px-3 py-2.5 text-xs font-semibold transition-colors ${
                inquiry.phone
                  ? "border-slate-200 bg-white text-slate-700 hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700"
                  : "pointer-events-none border-slate-100 bg-slate-50 text-slate-300"
              }`}
              aria-disabled={!inquiry.phone}
            >
              <Phone className="h-3.5 w-3.5" />
              {inquiry.phone ? "Call" : "No phone"}
            </a>
            <a
              href={`mailto:${inquiry.email}`}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-xs font-semibold text-slate-700 transition-colors hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700"
            >
              <Mail className="h-3.5 w-3.5" />
              Email
            </a>
          </div>

          <div className="space-y-1.5 rounded-lg border border-slate-200 bg-slate-50/60 px-4 py-3 text-xs">
            <div className="flex items-center justify-between gap-4">
              <span className="text-slate-500">Request type</span>
              <span
                className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-semibold ${inquiryTypeBadgeClass(inquiry.type)}`}
              >
                {inquiryTypeLabel(inquiry.type)}
              </span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-slate-500">Phone</span>
              <span className="font-medium text-slate-700">{inquiry.phone || "—"}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-slate-500">Work email</span>
              <span className="truncate font-medium text-slate-700">{inquiry.email}</span>
            </div>
          </div>

          {/* Message */}
          <div>
            <span className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
              Project description
            </span>
            <p className="mt-2 whitespace-pre-wrap rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm leading-relaxed text-slate-700">
              {inquiry.details || "No additional details provided."}
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Calendar className="h-3.5 w-3.5" />
            Submitted {formatInquiryDate(inquiry.createdAt)}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-200 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

export default InquiryDrawer;

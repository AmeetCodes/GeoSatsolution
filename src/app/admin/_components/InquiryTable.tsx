"use client";

import React from "react";
import { Inbox, Loader2, Mail, Phone, ArrowRight } from "lucide-react";
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

interface InquiryTableProps {
  inquiries: InquiryRecord[];
  onSelect: (inquiry: InquiryRecord) => void;
  onStatusChange: (id: string, status: InquiryStatus) => void;
  updatingId?: string | null;
}

export function InquiryTable({
  inquiries,
  onSelect,
  onStatusChange,
  updatingId = null,
}: InquiryTableProps) {
  if (inquiries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
          <Inbox className="h-6 w-6" />
        </div>
        <p className="mt-4 text-sm font-semibold text-slate-800">No inquiries yet</p>
        <p className="mt-1 max-w-sm text-xs text-slate-500">
          Consultation and assessment requests submitted from the public site will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[880px] border-collapse text-left">
        <thead>
          <tr className="border-b border-slate-200 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            <th className="px-5 py-3 font-semibold">Date &amp; ID</th>
            <th className="px-5 py-3 font-semibold">Customer</th>
            <th className="px-5 py-3 font-semibold">Contact</th>
            <th className="px-5 py-3 font-semibold">Interested Area</th>
            <th className="px-5 py-3 font-semibold">Status</th>
            <th className="px-5 py-3 text-right font-semibold">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {inquiries.map((inquiry) => {
            const meta = INQUIRY_STATUS_META[inquiry.status];
            const isUpdating = updatingId === inquiry.id;
            return (
              <tr
                key={inquiry.id}
                className="group transition-colors hover:bg-slate-50/80"
              >
                <td className="whitespace-nowrap px-5 py-4 align-top">
                  <div className="text-sm font-medium text-slate-700">
                    {formatInquiryDate(inquiry.createdAt)}
                  </div>
                  <span className="mt-1 inline-block rounded bg-slate-100 px-2 py-0.5 font-mono text-[11px] text-slate-500">
                    {inquiryReference(inquiry.id)}
                  </span>
                </td>

                <td className="px-5 py-4 align-top">
                  <div className="text-sm font-medium text-slate-900">{inquiry.name}</div>
                  {inquiry.organisation ? (
                    <div className="text-xs text-slate-500">{inquiry.organisation}</div>
                  ) : (
                    <div className="text-xs text-slate-400">Individual</div>
                  )}
                </td>

                <td className="px-5 py-4 align-top">
                  <a
                    href={`mailto:${inquiry.email}`}
                    className="flex items-center gap-1.5 text-sm text-slate-700 hover:text-emerald-700 hover:underline"
                  >
                    <Mail className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                    <span className="truncate">{inquiry.email}</span>
                  </a>
                  {inquiry.phone ? (
                    <a
                      href={`tel:${inquiry.phone}`}
                      className="mt-1 flex items-center gap-1.5 text-xs text-slate-500 hover:text-emerald-700 hover:underline"
                    >
                      <Phone className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                      {inquiry.phone}
                    </a>
                  ) : (
                    <span className="mt-1 block text-xs text-slate-400">No phone</span>
                  )}
                </td>

                <td className="px-5 py-4 align-top">
                  <div className="flex flex-col items-start gap-1.5">
                    <span
                      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${inquiryTypeBadgeClass(inquiry.type)}`}
                    >
                      {inquiryTypeLabel(inquiry.type)}
                    </span>
                    <span className="inline-flex max-w-[220px] items-center rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
                      <span className="truncate">{inquiryInterestLabel(inquiry)}</span>
                    </span>
                  </div>
                </td>

                <td className="px-5 py-4 align-top">
                  <div className="relative">
                    <select
                      value={inquiry.status}
                      disabled={isUpdating}
                      onChange={(event) =>
                        onStatusChange(inquiry.id, event.target.value as InquiryStatus)
                      }
                      className={`w-full cursor-pointer appearance-none rounded-full border py-1 pl-6 pr-7 text-xs font-semibold outline-none transition-colors focus:ring-2 focus:ring-emerald-500/20 disabled:opacity-60 ${meta.badgeClass}`}
                      aria-label={`Update status for ${inquiry.name}`}
                    >
                      {INQUIRY_STATUS_ORDER.map((status) => (
                        <option key={status} value={status}>
                          {INQUIRY_STATUS_META[status].label}
                        </option>
                      ))}
                    </select>
                    <span
                      className={`pointer-events-none absolute left-2.5 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full ${meta.dotClass}`}
                    />
                    {isUpdating && (
                      <Loader2 className="pointer-events-none absolute right-2 top-1/2 h-3 w-3 -translate-y-1/2 animate-spin text-slate-400" />
                    )}
                  </div>
                </td>

                <td className="px-5 py-4 text-right align-top">
                  <button
                    type="button"
                    onClick={() => onSelect(inquiry)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm transition-colors hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700"
                  >
                    View Details
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default InquiryTable;

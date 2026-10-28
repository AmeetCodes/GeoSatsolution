"use client";

import React from "react";
import {
  Layers,
  Package,
  Building2,
  Inbox,
  Plus,
  ArrowRight,
  MapPinned,
  Activity,
  Zap,
} from "lucide-react";
import { InquiryTable } from "./InquiryTable";
import { INQUIRY_STATUS_META } from "./inquiry-status";
import type { AdminTab } from "./AdminHeader";
import type { SiteContentData } from "@/lib/data-store";
import type {
  InquiryRecord,
  InquiryStatus,
  InquiryStatusCounts,
} from "@/lib/inquiry-types";

type LucideIconLike = React.ComponentType<{ className?: string }>;

interface AdminOverviewProps {
  content: SiteContentData;
  inquiries: InquiryRecord[];
  inquiryCounts: InquiryStatusCounts;
  onNavigateTab: (tab: AdminTab) => void;
  onOpenAddModal: (type: "solution" | "product") => void;
  onSelectInquiry: (inquiry: InquiryRecord) => void;
  onStatusChange: (id: string, status: InquiryStatus) => void;
  updatingInquiryId?: string | null;
}

export function AdminOverview({
  content,
  inquiries,
  inquiryCounts,
  onNavigateTab,
  onOpenAddModal,
  onSelectInquiry,
  onStatusChange,
  updatingInquiryId = null,
}: AdminOverviewProps) {
  const totalSolutions = content?.Solutions?.length || 0;
  const totalProducts = content?.Products?.length || 0;
  const totalIndustries = content?.Industries?.length || 0;

  const stats: {
    title: string;
    count: number;
    sub: string;
    icon: LucideIconLike;
    iconWrap: string;
    iconColor: string;
    hoverBorder: string;
    tab: AdminTab;
  }[] = [
    {
      title: "Total Solutions",
      count: totalSolutions,
      sub: "Service offerings",
      icon: Layers,
      iconWrap: "bg-emerald-50",
      iconColor: "text-emerald-600",
      hoverBorder: "hover:border-emerald-300",
      tab: "solutions",
    },
    {
      title: "Total Products",
      count: totalProducts,
      sub: "Hardware & software",
      icon: Package,
      iconWrap: "bg-blue-50",
      iconColor: "text-blue-600",
      hoverBorder: "hover:border-blue-300",
      tab: "products",
    },
    {
      title: "Target Industries",
      count: totalIndustries,
      sub: "Client sectors",
      icon: Building2,
      iconWrap: "bg-amber-50",
      iconColor: "text-amber-600",
      hoverBorder: "hover:border-amber-300",
      tab: "industries",
    },
    {
      title: "Incoming Inquiries",
      count: inquiryCounts.total,
      sub: `${inquiryCounts.pending} awaiting response`,
      icon: Inbox,
      iconWrap: "bg-purple-50",
      iconColor: "text-purple-600",
      hoverBorder: "hover:border-purple-300",
      tab: "transactions",
    },
  ];

  const quickActions: {
    label: string;
    icon: LucideIconLike;
    action: () => void;
  }[] = [
    { label: "Add Solution", icon: Plus, action: () => onOpenAddModal("solution") },
    { label: "Add Product", icon: Plus, action: () => onOpenAddModal("product") },
    { label: "Manage District Map", icon: MapPinned, action: () => onNavigateTab("district") },
    { label: "View Inquiries", icon: Inbox, action: () => onNavigateTab("transactions") },
  ];

  const breakdowns: {
    label: string;
    items: { name: string; count: number }[];
    barColor: string;
    icon: LucideIconLike;
  }[] = [
    {
      label: "Solutions",
      items: (() => {
        const groups: Record<string, number> = {};
        (content?.Solutions ?? []).forEach((s) => {
          groups[s.group] = (groups[s.group] || 0) + 1;
        });
        return Object.entries(groups).map(([k, v]) => ({ name: k, count: v }));
      })(),
      barColor: "#059669",
      icon: Layers,
    },
    {
      label: "Products",
      items: (() => {
        const groups: Record<string, number> = {};
        (content?.Products ?? []).forEach((p) => {
          groups[p.group] = (groups[p.group] || 0) + 1;
        });
        return Object.entries(groups).map(([k, v]) => ({ name: k, count: v }));
      })(),
      barColor: "#2563eb",
      icon: Package,
    },
  ];

  const recentInquiries = inquiries.slice(0, 5);
  const statusPills = (["pending", "contacted", "completed", "archived"] as const).filter(
    (status) => inquiryCounts[status] > 0,
  );

  return (
    <div className="space-y-6">
      {/* KPI summary */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <button
              key={stat.title}
              type="button"
              onClick={() => onNavigateTab(stat.tab)}
              className={`group rounded-xl border border-slate-200 bg-white p-5 text-left shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${stat.hoverBorder}`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    {stat.title}
                  </p>
                  <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
                    {stat.count}
                  </p>
                  <p className="mt-1 truncate text-xs text-slate-500">{stat.sub}</p>
                </div>
                <span
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${stat.iconWrap}`}
                >
                  <Icon className={`h-5 w-5 ${stat.iconColor}`} />
                </span>
              </div>
              <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-slate-400 transition-colors group-hover:text-slate-700">
                <span>Manage</span>
                <ArrowRight className="h-3 w-3 transition-transform duration-200 group-hover:translate-x-0.5" />
              </div>
            </button>
          );
        })}
      </div>

      {/* Quick actions + breakdowns */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <Zap className="h-4 w-4 text-amber-500" />
            <h3 className="text-sm font-semibold text-slate-900">Quick Actions</h3>
          </div>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <button
                  key={action.label}
                  type="button"
                  onClick={action.action}
                  className="group flex items-center gap-2.5 rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-left text-xs font-semibold text-slate-700 transition-colors hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700"
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-slate-100 text-slate-600 transition-colors group-hover:bg-emerald-100 group-hover:text-emerald-700">
                    <Icon className="h-3.5 w-3.5" />
                  </span>
                  <span className="leading-tight">{action.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {breakdowns.map((bd) => {
          const Icon = bd.icon;
          const total = bd.items.reduce((s, i) => s + i.count, 0);
          return (
            <div key={bd.label} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center gap-2">
                <Icon className="h-4 w-4 text-slate-500" />
                <h3 className="text-sm font-semibold text-slate-900">{bd.label} by Group</h3>
              </div>
              {bd.items.length === 0 ? (
                <p className="text-xs italic text-slate-400">No items yet</p>
              ) : (
                <ul className="space-y-3">
                  {bd.items.map((item) => {
                    const pct = total > 0 ? Math.round((item.count / total) * 100) : 0;
                    return (
                      <li key={item.name}>
                        <div className="mb-1 flex items-center justify-between">
                          <span className="max-w-[70%] truncate text-xs text-slate-600">{item.name}</span>
                          <span className="text-xs font-semibold text-slate-900">{item.count}</span>
                        </div>
                        <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{ width: `${pct}%`, background: bd.barColor }}
                          />
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          );
        })}
      </div>

      {/* Recent inquiries */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2.5">
            <Activity className="h-4 w-4 text-emerald-600" />
            <div>
              <h2 className="text-sm font-semibold text-slate-900">Recent Inquiries</h2>
              <p className="text-xs text-slate-500">Latest consultation, assessment &amp; product quote submissions</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            {statusPills.map((status) => {
              const meta = INQUIRY_STATUS_META[status];
              return (
                <span
                  key={status}
                  className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${meta.badgeClass}`}
                >
                  <span className={`h-1.5 w-1.5 rounded-full ${meta.dotClass}`} />
                  {inquiryCounts[status]} {meta.label}
                </span>
              );
            })}
            <button
              type="button"
              onClick={() => onNavigateTab("transactions")}
              className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-[11px] font-semibold text-slate-600 transition-colors hover:bg-slate-100"
            >
              View all
              <ArrowRight className="h-3 w-3" />
            </button>
          </div>
        </div>
        <InquiryTable
          inquiries={recentInquiries}
          onSelect={onSelectInquiry}
          onStatusChange={onStatusChange}
          updatingId={updatingInquiryId}
        />
      </div>
    </div>
  );
}

export default AdminOverview;

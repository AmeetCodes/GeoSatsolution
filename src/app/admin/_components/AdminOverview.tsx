"use client";

import React from "react";
import {
  Layers,
  Box,
  Building2,
  Users,
  Activity,
  Plus,
  ArrowRight,
  Globe,
  BookOpen,
  Briefcase,
  Handshake,
  TrendingUp,
  Zap,
} from "lucide-react";
import TableComponent from "./AdminPaymentsTable";
import type { SiteContentData } from "@/lib/data-store";

interface AdminOverviewProps {
  content: SiteContentData;
  onNavigateTab: (tab: any) => void;
  onOpenAddModal: (type: "solution" | "product") => void;
}

export function AdminOverview({
  content,
  onNavigateTab,
  onOpenAddModal,
}: AdminOverviewProps) {
  const totalSolutions = content?.Solutions?.length || 0;
  const totalProducts = content?.Products?.length || 0;
  const totalIndustries = content?.Industries?.length || 0;
  const totalInsights = content?.Company?.Insights?.length || 0;
  const totalCareers = content?.Company?.Careers?.length || 0;
  const totalPartners = content?.Company?.Partners?.length || 0;
  const totalLeaders = content?.Company?.Leadership?.length || 0;
  const totalCompany = totalInsights + totalCareers + totalPartners + totalLeaders;

  const stats = [
    {
      title: "Solutions",
      count: totalSolutions,
      sub: "Service offerings",
      icon: Layers,
      accent: "#22d3ee",
      bg: "rgba(34,211,238,0.06)",
      border: "rgba(34,211,238,0.15)",
      tab: "solutions",
    },
    {
      title: "Products",
      count: totalProducts,
      sub: "Hardware & software",
      icon: Box,
      accent: "#818cf8",
      bg: "rgba(129,140,248,0.06)",
      border: "rgba(129,140,248,0.15)",
      tab: "products",
    },
    {
      title: "Industries",
      count: totalIndustries,
      sub: "Target sectors",
      icon: Building2,
      accent: "#34d399",
      bg: "rgba(52,211,153,0.06)",
      border: "rgba(52,211,153,0.15)",
      tab: "industries",
    },
    {
      title: "Company",
      count: totalCompany,
      sub: `${totalLeaders} leaders · ${totalInsights} insights`,
      icon: Users,
      accent: "#f472b6",
      bg: "rgba(244,114,182,0.06)",
      border: "rgba(244,114,182,0.15)",
      tab: "company",
    },
  ];

  const quickLinks = [
    { label: "Add Solution", icon: Layers, color: "#22d3ee", action: () => onOpenAddModal("solution") },
    { label: "Add Product", icon: Box, color: "#818cf8", action: () => onOpenAddModal("product") },
    { label: "Manage Projects", icon: Briefcase, color: "#fb923c", action: () => onNavigateTab("projects") },
    { label: "Manage Industries", icon: Building2, color: "#34d399", action: () => onNavigateTab("industries") },
    { label: "Company Info", icon: Users, color: "#f472b6", action: () => onNavigateTab("company") },
    { label: "Orders", icon: Briefcase, color: "#fb923c", action: () => onNavigateTab("transactions") },
    { label: "Live Preview", icon: Globe, color: "#a78bfa", action: () => onNavigateTab("preview") },
  ];

  const breakdowns = [
    {
      label: "Solutions",
      items: (() => {
        const groups: Record<string, number> = {};
        (content?.Solutions ?? []).forEach((s) => {
          groups[s.group] = (groups[s.group] || 0) + 1;
        });
        return Object.entries(groups).map(([k, v]) => ({ name: k, count: v }));
      })(),
      color: "#22d3ee",
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
      color: "#818cf8",
      icon: Box,
    },
  ];

  return (
    <div className="space-y-6">

      {/* Hero banner */}
      <div className="relative overflow-hidden rounded-2xl border border-white/[0.06] bg-gradient-to-br from-[#0d0d1a] via-[#0a0a14] to-[#080810] p-6 sm:p-8">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -right-32 -top-32 h-80 w-80 rounded-full bg-cyan-500/[0.06] blur-3xl" />
          <div className="absolute -left-20 bottom-0 h-48 w-48 rounded-full bg-indigo-500/[0.06] blur-3xl" />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-400">
                Live · All systems synchronized
              </span>
            </div>
            <h1 className="text-2xl sm:text-[1.75rem] font-bold tracking-tight text-[#f1ece5] leading-tight">
              GeoSAT Content Hub
            </h1>
            <p className="mt-2 text-[13px] text-zinc-400 max-w-xl leading-relaxed">
              Every change you make here updates the public site instantly — Projects, Solutions, Products, Industries, and Company content are live on save.
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5">
            <button
              type="button"
              onClick={() => onNavigateTab("tree")}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-[12px] font-semibold text-zinc-950 bg-[#f1ece5] hover:bg-[#e2dcce] transition-all hover:-translate-y-0.5 active:scale-[0.98]"
            >
              <Layers className="w-3.5 h-3.5" />
              Mega-Menu &amp; Tree CMS
            </button>
            <button
              type="button"
              onClick={() => onOpenAddModal("solution")}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-[12px] font-semibold text-[#f1ece5] bg-[#f1ece5]/80 hover:bg-[#f1ece5] border border-zinc-800 hover:border-[#f1ece5]/30 transition-all hover:-translate-y-0.5 active:scale-[0.98]"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Solution
            </button>
            <button
              type="button"
              onClick={() => onOpenAddModal("product")}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-[12px] font-semibold text-[#f1ece5] bg-[#f1ece5]/80 hover:bg-[#f1ece5] border border-zinc-800 hover:border-[#f1ece5]/30 transition-all hover:-translate-y-0.5"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Product
            </button>
          </div>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <button
              key={stat.title}
              type="button"
              onClick={() => onNavigateTab(stat.tab)}
              className="group relative overflow-hidden rounded-xl border text-left p-4 sm:p-5 transition-all duration-200 hover:-translate-y-0.5 cursor-pointer border-zinc-800 bg-[#f1ece5]/80 hover:bg-[#f1ece5] hover:border-zinc-700"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-medium text-zinc-500 uppercase tracking-[0.12em] truncate">{stat.title}</p>
                  <p className="mt-2 text-3xl font-bold text-zinc-950 tracking-tight">{stat.count}</p>
                  <p className="mt-1 text-[11px] text-zinc-500 truncate">{stat.sub}</p>
                </div>
                <div className="flex-shrink-0 mt-0.5 p-2 rounded-lg" style={{ background: `${stat.accent}15` }}>
                  <Icon className="w-4 h-4" style={{ color: stat.accent }} />
                </div>
              </div>
              <div className="mt-3 flex items-center gap-1 text-[11px] font-medium transition-all" style={{ color: stat.accent }}>
                <span>Manage</span>
                <ArrowRight className="w-3 h-3 transition-transform duration-200 group-hover:translate-x-0.5" />
              </div>
            </button>
          );
        })}
      </div>

      {/* Content breakdowns + Quick actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Breakdowns */}
        {breakdowns.map((bd) => {
          const Icon = bd.icon;
          const total = bd.items.reduce((s, i) => s + i.count, 0);
          return (
            <div key={bd.label} className="rounded-xl border border-zinc-800 bg-[#f1ece5]/80 p-5">
              <div className="flex items-center gap-2 mb-4">
                <Icon className="w-4 h-4" style={{ color: bd.color }} />
                <h3 className="text-[12px] font-semibold text-[#f1ece5] uppercase tracking-wider">
                  {bd.label} by Group
                </h3>
              </div>
              {bd.items.length === 0 ? (
                <p className="text-[12px] text-zinc-600 italic">No items yet</p>
              ) : (
                <ul className="space-y-2.5">
                  {bd.items.map((item) => {
                    const pct = total > 0 ? Math.round((item.count / total) * 100) : 0;
                    return (
                      <li key={item.name}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[11px] text-zinc-400 truncate max-w-[70%]">{item.name}</span>
                          <span className="text-[11px] font-semibold text-zinc-950">{item.count}</span>
                        </div>
                        <div className="h-1 rounded-full bg-white/[0.06] overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{ width: `${pct}%`, background: bd.color }}
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

        {/* Quick actions */}
        <div className="rounded-xl border border-white/[0.06] bg-[#f1ece5]/50 p-5">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="w-4 h-4 text-amber-400" />
            <h3 className="text-[12px] font-semibold text-zinc-300 uppercase tracking-[0.1em]">Quick Actions</h3>
          </div>
          <ul className="space-y-1.5">
            {quickLinks.map((link) => {
              const Icon = link.icon;
              return (
                <li key={link.label}>
                  <button
                    type="button"
                    onClick={link.action}
                    className="group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-all hover:bg-[#f1ece5]/80"
                  >
                    <div className="flex h-6 w-6 items-center justify-center rounded-md shrink-0 border border-zinc-800 bg-[#f1ece5]/80">
                      <Icon className="w-3 h-3 text-zinc-950" />
                    </div>
                    <span className="text-[12px] text-zinc-400 group-hover:text-[#f1ece5] transition-colors font-medium">{link.label}</span>
                    <ArrowRight className="ml-auto w-3 h-3 text-zinc-700 group-hover:text-zinc-400 transition-all group-hover:translate-x-0.5" />
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      {/* Recent orders table */}
      <div className="rounded-xl border border-zinc-800 bg-[#f1ece5]/80">
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800">
          <div className="flex items-center gap-2.5">
            <Activity className="w-4 h-4 text-zinc-950" />
            <div>
              <h2 className="text-[13px] font-semibold text-zinc-950">Recent Orders & Inquiries</h2>
              <p className="text-[11px] text-zinc-400">Client requests and service orders</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-medium">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Live
          </div>
        </div>
        <div className="p-4 overflow-x-auto">
          <TableComponent />
        </div>
      </div>
    </div>
  );
}

export default AdminOverview;

"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  LayoutDashboard,
  Layers,
  Box,
  Briefcase,
  MapPinned,
  Building2,
  Users,
  Inbox,
  MonitorPlay,
  LogOut,
  ExternalLink,
  CheckCircle2,
  Loader2,
  UserRound,
} from "lucide-react";

export type AdminTab =
  | "overview"
  | "tree"
  | "solutions"
  | "products"
  | "projects"
  | "district"
  | "industries"
  | "company"
  | "transactions"
  | "preview";

interface AdminHeaderProps {
  activeTab: AdminTab;
  setActiveTab: (tab: AdminTab) => void;
  onLogout: () => void;
  userEmail?: string;
  isSaving?: boolean;
  savedRecently?: boolean;
}

export function AdminHeader({
  activeTab,
  setActiveTab,
  onLogout,
  userEmail = "",
  isSaving = false,
  savedRecently = false,
}: AdminHeaderProps) {
  const tabs = [
    { id: "overview",     label: "Dashboard",      icon: LayoutDashboard, description: "Overview & stats" },
    { id: "tree",         label: "Mega-Menu CMS",  icon: Layers,          description: "N-Level tree & columns" },
    { id: "solutions",    label: "Solutions",      icon: Layers,          description: "Manage services" },
    { id: "products",     label: "Products",       icon: Box,             description: "Manage catalog" },
    { id: "projects",     label: "Projects",       icon: Briefcase,       description: "Featured work" },
    { id: "district",     label: "District Map",   icon: MapPinned,       description: "Nepal coverage" },
    { id: "industries",   label: "Industries",     icon: Building2,       description: "Sector pages" },
    { id: "company",      label: "Company",        icon: Users,           description: "Team & partners" },
    { id: "transactions", label: "Inquiries",      icon: Inbox,           description: "Client requests" },
    { id: "preview",      label: "Live Preview",   icon: MonitorPlay,     description: "See changes live" },
  ] as const;

  const displayEmail = userEmail || "admin@geosatsolutions.com.np";

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/95 backdrop-blur-xl">
      {/* Top bar */}
      <div className="flex min-h-[64px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        {/* Logo + badge */}
        <Link href="/admin/dashboard" className="flex shrink-0 items-center gap-3">
          <Image
            src="/logo.png"
            alt="GeoSAT"
            width={110}
            height={32}
            className="h-7 w-auto object-contain"
            priority
          />
          <span className="hidden rounded-md border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-emerald-700 sm:inline-block">
            Admin
          </span>
        </Link>

        {/* Right controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Save status */}
          <div className="hidden items-center justify-center sm:flex">
            {isSaving ? (
              <span className="flex items-center gap-1.5 rounded-lg bg-amber-50 px-2.5 py-1 text-[11px] font-semibold text-amber-700">
                <Loader2 className="h-3 w-3 animate-spin" />
                Saving…
              </span>
            ) : savedRecently ? (
              <span className="flex items-center gap-1.5 rounded-lg bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
                <CheckCircle2 className="h-3 w-3" />
                Saved
              </span>
            ) : null}
          </div>

          {/* Public site */}
          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-[11px] font-semibold text-slate-600 transition-colors hover:bg-slate-100"
          >
            <span>Live Site</span>
            <ExternalLink className="h-3 w-3" />
          </Link>

          {/* User email badge */}
          <span className="hidden items-center gap-1.5 rounded-lg bg-slate-100 px-2.5 py-1.5 text-[11px] font-medium text-slate-700 lg:inline-flex">
            <UserRound className="h-3 w-3 text-slate-500" />
            {displayEmail}
          </span>

          {/* Logout */}
          <button
            type="button"
            onClick={onLogout}
            className="inline-flex items-center gap-1.5 rounded-lg border border-transparent px-2.5 py-1.5 text-[11px] font-semibold text-slate-500 transition-colors hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600"
            title="Sign Out"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </div>

      {/* Tab navigation */}
      <div className="border-t border-slate-100 px-2 sm:px-4 lg:px-8">
        <nav className="flex items-center gap-1 overflow-x-auto py-1 no-scrollbar">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                title={tab.description}
                className={`flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-t-lg border-b-2 px-3 py-2 text-xs font-medium transition-colors sm:gap-2 sm:px-4 ${
                  isActive
                    ? "border-emerald-600 bg-emerald-50/50 font-semibold text-emerald-700"
                    : "border-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                <Icon
                  className={`h-3.5 w-3.5 ${
                    isActive ? "text-emerald-600" : "text-slate-400"
                  }`}
                />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
}

export default AdminHeader;

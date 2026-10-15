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
  ClipboardList,
  MonitorPlay,
  LogOut,
  ExternalLink,
  RotateCcw,
  ShieldAlert,
  CheckCircle2,
  Loader2,
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
  onResetDefaults: () => void;
  userEmail?: string;
  isSaving?: boolean;
  savedRecently?: boolean;
}

export function AdminHeader({
  activeTab,
  setActiveTab,
  onLogout,
  onResetDefaults,
  userEmail = "",
  isSaving = false,
  savedRecently = false,
}: AdminHeaderProps) {
  const tabs = [
    { id: "overview",      label: "Dashboard",        icon: LayoutDashboard,  description: "Overview & stats" },
    { id: "tree",          label: "Mega-Menu CMS",    icon: Layers,           description: "N-Level Tree & Columns" },
    { id: "solutions",     label: "Solutions",         icon: Layers,           description: "Manage services" },
    { id: "products",      label: "Products",          icon: Box,              description: "Manage catalog" },
    { id: "projects",      label: "Projects",          icon: Briefcase,        description: "Featured work" },
    { id: "district",      label: "District Map",      icon: MapPinned,        description: "Nepal coverage" },
    { id: "industries",    label: "Industries",        icon: Building2,        description: "Sector pages" },
    { id: "company",       label: "Company",           icon: Users,            description: "Team & partners" },
    { id: "transactions",  label: "Orders",            icon: ClipboardList,    description: "Client requests" },
    { id: "preview",       label: "Live Preview",      icon: MonitorPlay,      description: "See changes live" },
  ] as const;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#f1ece5]/20 bg-[#f1ece5]/95 backdrop-blur-xl text-zinc-950">
      {/* Top bar */}
      <div className="flex h-[60px] items-center justify-between px-6 lg:px-8">
        {/* Logo + badge */}
        <Link href="/admin" className="flex items-center gap-3 shrink-0">
          <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
            <ShieldAlert className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="flex items-center gap-2">
            <Image
              src="/logo.png"
              alt="GeoSAT"
              width={110}
              height={32}
              className="object-contain h-7 w-auto"
              priority
            />
          <span className="hidden sm:block text-[10px] font-semibold tracking-wider text-[#f1ece5]/80 uppercase border-l border-white/10 pl-2 ml-1">
            Admin
          </span>
          </div>
        </Link>

        {/* Right controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Save status */}
          <div className="hidden sm:flex items-center h-7 px-2.5 rounded-md min-w-[90px] justify-center">
            {isSaving ? (
              <span className="flex items-center gap-1.5 text-[11px] text-amber-400 font-medium">
                <Loader2 className="w-3 h-3 animate-spin" />
                Saving…
              </span>
            ) : savedRecently ? (
              <span className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-medium">
                <CheckCircle2 className="w-3 h-3" />
                Saved
              </span>
            ) : null}
          </div>

          {/* Reset */}
          <button
            type="button"
            onClick={onResetDefaults}
            title="Restore factory default content"
            className="hidden md:inline-flex items-center gap-1.5 h-7 px-2.5 text-[11px] font-medium text-zinc-300 hover:text-[#f1ece5] bg-[#f1ece5]/80 hover:bg-[#f1ece5] border border-zinc-800 hover:border-[#f1ece5]/30 rounded-lg transition-all"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>

          {/* Public site */}
          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 h-7 px-2.5 text-[11px] font-medium text-[#f1ece5] bg-[#f1ece5] hover:bg-[#e2dcce] text-zinc-950 border border-[#f1ece5]/30 rounded-lg transition-all"
          >
            <span>Site</span>
            <ExternalLink className="w-3 h-3" />
          </Link>

          <div className="w-px h-4 bg-white/[0.08] hidden sm:block" />

          {/* User */}
          <div className="hidden lg:flex flex-col text-right leading-tight">
            <span className="text-[11px] font-medium text-zinc-300">{userEmail}</span>
            <span className="text-[9px] text-zinc-600 uppercase tracking-wider">Super Admin</span>
          </div>

          {/* Logout */}
          <button
            type="button"
            onClick={onLogout}
            className="inline-flex items-center gap-1.5 h-7 px-2.5 text-[11px] font-medium text-zinc-400 hover:text-red-400 hover:bg-red-500/[0.08] border border-transparent hover:border-red-500/20 rounded-lg transition-all"
            title="Sign Out"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </div>

      {/* Tab navigation */}
      <div className="border-t border-zinc-800 px-4 lg:px-8">
        <nav className="flex items-end gap-0.5 overflow-x-auto no-scrollbar -mb-px">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`group relative flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 lg:px-4 h-9 sm:h-10 text-[11px] sm:text-xs font-semibold tracking-wider transition-all whitespace-nowrap ${
                  isActive
                    ? "text-[#f1ece5] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#f1ece5] after:rounded-full"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                <Icon
                  className={`w-3.5 h-3.5 transition-colors duration-200 ${
                    isActive ? "text-cyan-400" : "text-zinc-600 group-hover:text-zinc-400"
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

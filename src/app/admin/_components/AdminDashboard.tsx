"use client";

import type { SiteContentData } from '@/lib/content-types';

import React, { useState, useMemo, useRef } from "react";
import { AdminHeader, type AdminTab } from "./AdminHeader";
import { AdminSessionWarning } from "./AdminSessionWarning";
import { useAdminSession } from "../_lib/use-admin-session";
import { AdminOverview } from "./AdminOverview";
import { TreeCMSManager } from "./TreeCMSManager";
import { SolutionsManager } from "./SolutionsManager";
import { ProductsManager } from "./ProductsManager";
import { ProjectsManager } from "./ProjectsManager";
import { DistrictProjectsManager } from "./DistrictProjectsManager";
import { IndustriesManager } from "./IndustriesManager";
import { CompanyManager } from "./CompanyManager";
import { LivePreview } from "./LivePreview";
import { InquiryTable } from "./InquiryTable";
import { InquiryDrawer } from "./InquiryDrawer";
import { INQUIRY_STATUS_META } from "./inquiry-status";
import SwipeToast from "@/components/ui/SwipeToast";
import type { NavigationTree } from "@/lib/tree-store";
import type { ProjectItem } from "@/lib/data/project-content";
import type { DistrictProjectRecord } from "@/lib/nepal-map-types";
import {
  computeInquiryCounts,
  type InquiryRecord,
  type InquiryStatus,
  type InquiryStatusCounts,
} from "@/lib/inquiry-types";
import { getErrorMessage } from "@/lib/utils";
import { CheckCircle2, Inbox, RefreshCw } from "lucide-react";

interface ToastState {
  id: string;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

interface AdminDashboardProps {
  initialContent: SiteContentData;
  initialTree?: NavigationTree;
  initialProjects: ProjectItem[];
  initialDistrictProjects?: DistrictProjectRecord[];
  initialInquiries?: InquiryRecord[];
  initialInquiryCounts?: InquiryStatusCounts;
  userEmail?: string;
}

export function AdminDashboard({
  initialContent,
  initialTree,
  initialProjects,
  initialDistrictProjects = [],
  initialInquiries = [],
  initialInquiryCounts,
  userEmail = "",
}: AdminDashboardProps) {
  const { showWarning, warningRemainingMs, extendSession, logout } = useAdminSession();
  const [content, setContent] = useState<SiteContentData>(initialContent);
  const [tree, setTree] = useState<NavigationTree>(initialTree || { tabs: [] });
  const [projects, setProjects] = useState<ProjectItem[]>(initialProjects);
  const [inquiries, setInquiries] = useState<InquiryRecord[]>(initialInquiries);
  const [inquiryCounts, setInquiryCounts] = useState<InquiryStatusCounts>(
    initialInquiryCounts ?? computeInquiryCounts(initialInquiries),
  );
  const [inquiryFilter, setInquiryFilter] = useState<InquiryStatus | "all">("all");
  const [selectedInquiry, setSelectedInquiry] = useState<InquiryRecord | null>(null);
  const [updatingInquiryId, setUpdatingInquiryId] = useState<string | null>(null);
  const [isRefreshingInquiries, setIsRefreshingInquiries] = useState(false);
  const [activeTab, setActiveTab] = useState<AdminTab>("overview");
  const [isSaving, setIsSaving] = useState(false);
  const [savedRecently, setSavedRecently] = useState(false);
  const [toasts, setToasts] = useState<ToastState[]>([]);
  const savedTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const addToast = (
    title: string,
    description?: string,
    actionLabel?: string,
    onAction?: () => void,
  ) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, title, description, actionLabel, onAction }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const handleSaveSection = async (
    section: keyof SiteContentData,
    data: SiteContentData[keyof SiteContentData],
  ) => {
    setIsSaving(true);
    setSavedRecently(false);
    try {
      const res = await fetch("/api/admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section, data }),
      });

      const resData = await res.json().catch(() => null);
      if (!res.ok) throw new Error(resData?.message || "Failed to save changes");
      setContent((prev) => ({ ...prev, [section]: resData?.data ?? data }) as SiteContentData);
      setSavedRecently(true);
      if (savedTimer.current) clearTimeout(savedTimer.current);
      savedTimer.current = setTimeout(() => setSavedRecently(false), 3000);
    } catch (err) {
      addToast("Save Failed", getErrorMessage(err, "Could not persist to server"));
      throw err;
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveProjects = async (updated: ProjectItem[]) => {
    setIsSaving(true);
    setSavedRecently(false);
    try {
      const res = await fetch("/api/admin/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "save", data: updated }),
      });
      const result = await res.json().catch(() => null);
      if (!res.ok) throw new Error(result?.message || "Failed to save projects");

      setProjects(result.data);
      setSavedRecently(true);
      if (savedTimer.current) clearTimeout(savedTimer.current);
      savedTimer.current = setTimeout(() => setSavedRecently(false), 3000);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Could not save projects";
      addToast("Save Failed", message);
      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  const handleInquiryStatusChange = async (id: string, status: InquiryStatus) => {
    const name = inquiries.find((inquiry) => inquiry.id === id)?.name ?? "Inquiry";
    const previous = inquiries;
    const optimistic = inquiries.map((inquiry) =>
      inquiry.id === id ? { ...inquiry, status } : inquiry,
    );

    setInquiries(optimistic);
    setInquiryCounts(computeInquiryCounts(optimistic));
    setSelectedInquiry((prev) => (prev && prev.id === id ? { ...prev, status } : prev));
    setUpdatingInquiryId(id);

    try {
      const res = await fetch("/api/admin/inquiries", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      const result = await res.json().catch(() => null);
      if (!res.ok || !result?.success) {
        throw new Error(result?.message || "Failed to update inquiry status");
      }

      const saved: InquiryRecord | undefined = result.data;
      const next = saved
        ? optimistic.map((inquiry) => (inquiry.id === id ? saved : inquiry))
        : optimistic;
      setInquiries(next);
      setInquiryCounts(computeInquiryCounts(next));
      if (saved) {
        setSelectedInquiry((prev) => (prev && prev.id === id ? saved : prev));
      }
      addToast("Status updated", `${name} marked as ${INQUIRY_STATUS_META[status].label}.`);
    } catch (err) {
      setInquiries(previous);
      setInquiryCounts(computeInquiryCounts(previous));
      setSelectedInquiry((prev) =>
        prev && prev.id === id
          ? previous.find((inquiry) => inquiry.id === id) ?? prev
          : prev,
      );
      addToast("Update Failed", getErrorMessage(err, "Could not update the inquiry status."));
    } finally {
      setUpdatingInquiryId(null);
    }
  };

  const handleRefreshInquiries = async () => {
    if (isRefreshingInquiries) return;
    setIsRefreshingInquiries(true);
    try {
      const res = await fetch("/api/admin/inquiries", { cache: "no-store" });
      const result = (await res.json().catch(() => null)) as {
        success?: boolean;
        message?: string;
        data?: InquiryRecord[];
        counts?: InquiryStatusCounts;
      } | null;
      if (!res.ok || !result?.success || !result.data) {
        throw new Error(result?.message || "Could not refresh inquiries");
      }

      const next = result.data;
      setInquiries(next);
      setInquiryCounts(result.counts ?? computeInquiryCounts(next));
      setSelectedInquiry((prev) =>
        prev ? next.find((inquiry) => inquiry.id === prev.id) ?? null : prev,
      );
      addToast("Inquiries refreshed", `${next.length} total request${next.length === 1 ? "" : "s"}.`);
    } catch (err) {
      addToast("Refresh Failed", getErrorMessage(err, "Could not refresh inquiries."));
    } finally {
      setIsRefreshingInquiries(false);
    }
  };

  const filteredInquiries = useMemo(
    () =>
      inquiryFilter === "all"
        ? inquiries
        : inquiries.filter((inquiry) => inquiry.status === inquiryFilter),
    [inquiries, inquiryFilter],
  );

  const tabLabels: Record<AdminTab, string> = {
    overview: "Dashboard Overview",
    tree: "Mega-Menu & Hierarchy CMS",
    solutions: "Solutions Manager",
    products: "Products Manager",
    projects: "Projects Manager",
    district: "District Project Map",
    industries: "Industries Manager",
    company: "Company Manager",
    transactions: "Orders & Requests",
    preview: "Live Site Preview",
  };

  const filterOptions: { value: InquiryStatus | "all"; label: string; count: number }[] = [
    { value: "all", label: "All", count: inquiryCounts.total },
    { value: "pending", label: "New", count: inquiryCounts.pending },
    { value: "contacted", label: "Contacted", count: inquiryCounts.contacted },
    { value: "completed", label: "Resolved", count: inquiryCounts.completed },
    { value: "archived", label: "Archived", count: inquiryCounts.archived },
  ];

  return (
    <div className="admin-dashboard flex min-h-screen flex-col bg-slate-50 text-slate-700">
      <AdminHeader
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogout={logout}
        userEmail={userEmail}
        isSaving={isSaving}
        savedRecently={savedRecently}
      />

      {/* Page header breadcrumb */}
      <div className="flex items-center gap-3 border-b border-slate-200 bg-white px-4 py-3 sm:px-6 lg:px-8">
        <span className="text-[11px] font-medium uppercase tracking-wider text-slate-400">Admin</span>
        <span className="text-slate-300">/</span>
        <span className="text-[11px] font-semibold text-slate-700">{tabLabels[activeTab]}</span>
        <div className="ml-auto flex items-center gap-2">
          {isSaving && (
            <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-amber-600">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-500" />
              Saving changes…
            </span>
          )}
          {savedRecently && !isSaving && (
            <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-emerald-600">
              <CheckCircle2 className="h-3 w-3" />
              Changes live on site
            </span>
          )}
        </div>
      </div>

      {/* Main workspace */}
      <main className="mx-auto w-full max-w-[1400px] flex-1 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        {activeTab === "overview" && (
          <AdminOverview
            content={content}
            inquiries={inquiries}
            inquiryCounts={inquiryCounts}
            onNavigateTab={(tab) => setActiveTab(tab)}
            onOpenAddModal={(type) => {
              if (type === "solution") setActiveTab("solutions");
              if (type === "product") setActiveTab("products");
            }}
            onSelectInquiry={setSelectedInquiry}
            onStatusChange={handleInquiryStatusChange}
            updatingInquiryId={updatingInquiryId}
          />
        )}

        {activeTab === "tree" && (
          <TreeCMSManager
            initialTree={tree}
            onTriggerToast={addToast}
            onTreeUpdated={(updated) => setTree(updated)}
          />
        )}

        {activeTab === "solutions" && (
          <SolutionsManager
            solutions={content.Solutions || []}
            onSaveSolutions={(updated) => handleSaveSection("Solutions", updated)}
            onTriggerToast={addToast}
          />
        )}

        {activeTab === "products" && (
          <ProductsManager
            products={content.Products || []}
            onSaveProducts={(updated) => handleSaveSection("Products", updated)}
            onTriggerToast={addToast}
          />
        )}

        {activeTab === "projects" && (
          <ProjectsManager
            projects={projects}
            onSaveProjects={handleSaveProjects}
            onTriggerToast={addToast}
          />
        )}

        {activeTab === "district" && (
          <DistrictProjectsManager
            initialProjects={initialDistrictProjects}
            onTriggerToast={addToast}
          />
        )}

        {activeTab === "industries" && (
          <IndustriesManager
            industries={content.Industries || []}
            onSaveIndustries={(updated) => handleSaveSection("Industries", updated)}
            onTriggerToast={addToast}
          />
        )}

        {activeTab === "company" && (
          <CompanyManager
            company={content.Company}
            onSaveCompany={(updatedCompany) => handleSaveSection("Company", updatedCompany)}
            onTriggerToast={addToast}
          />
        )}

        {activeTab === "transactions" && (
          <div className="space-y-5">
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="flex flex-wrap items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                  <Inbox className="h-5 w-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <h2 className="text-lg font-semibold text-slate-900">Orders &amp; Requests</h2>
                  <p className="mt-0.5 text-xs text-slate-500">
                    Real consultation, assessment and product quote inquiries submitted from the public site.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleRefreshInquiries}
                  disabled={isRefreshingInquiries}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 shadow-sm transition-colors hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <RefreshCw className={`h-3.5 w-3.5 ${isRefreshingInquiries ? "animate-spin" : ""}`} />
                  Refresh
                </button>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {filterOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setInquiryFilter(option.value)}
                  className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors ${
                    inquiryFilter === option.value
                      ? "border-emerald-600 bg-emerald-600 text-white"
                      : "border-slate-200 bg-white text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {option.label}
                  <span
                    className={`rounded-full px-1.5 text-[10px] ${
                      inquiryFilter === option.value ? "bg-white/20" : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {option.count}
                  </span>
                </button>
              ))}
            </div>

            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
              <InquiryTable
                inquiries={filteredInquiries}
                onSelect={setSelectedInquiry}
                onStatusChange={handleInquiryStatusChange}
                updatingId={updatingInquiryId}
              />
            </div>
          </div>
        )}

        {activeTab === "preview" && <LivePreview content={content} />}
      </main>

      <InquiryDrawer
        inquiry={selectedInquiry}
        onClose={() => setSelectedInquiry(null)}
        onStatusChange={handleInquiryStatusChange}
        updatingId={updatingInquiryId}
      />

      <AdminSessionWarning
        open={showWarning}
        secondsRemaining={Math.ceil(warningRemainingMs / 1000)}
        onStayActive={extendSession}
        onLogout={logout}
      />

      {/* Toast stack */}
      <div className="pointer-events-none fixed bottom-6 right-6 z-50 flex flex-col gap-2">
        {toasts.map((toast) => (
          <div key={toast.id} className="pointer-events-auto">
            <SwipeToast
              title={toast.title}
              description={toast.description}
              actionLabel={toast.actionLabel}
              onAction={toast.onAction}
              onClose={() => removeToast(toast.id)}
              duration={3500}
              fuse="bottom"
              fuseColor="#f8fafc"
              background="#ffffff"
              color="#0f172a"
              inline
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminDashboard;
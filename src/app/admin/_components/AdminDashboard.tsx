"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { AdminHeader, type AdminTab } from "./AdminHeader";
import { AdminOverview } from "./AdminOverview";
import { TreeCMSManager } from "./TreeCMSManager";
import { SolutionsManager } from "./SolutionsManager";
import { ProductsManager } from "./ProductsManager";
import { ProjectsManager } from "./ProjectsManager";
import { DistrictProjectsManager } from "./DistrictProjectsManager";
import { IndustriesManager } from "./IndustriesManager";
import { CompanyManager } from "./CompanyManager";
import { LivePreview } from "./LivePreview";
import TableComponent from "./AdminPaymentsTable";
import SwipeToast from "@/components/ui/SwipeToast";
import type { SiteContentData } from "@/lib/data-store";
import type { NavigationTree } from "@/lib/tree-store";
import type { ProjectItem } from "@/lib/data/project-content";
import type { DistrictProjectRecord } from "@/lib/nepal-map-types";
import { getErrorMessage } from "@/lib/utils";
import { CheckCircle2 } from "lucide-react";

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
  userEmail?: string;
}

export function AdminDashboard({
  initialContent,
  initialTree,
  initialProjects,
  initialDistrictProjects = [],
  userEmail = "",
}: AdminDashboardProps) {
  const router = useRouter();
  const [content, setContent] = useState<SiteContentData>(initialContent);
  const [tree, setTree] = useState<NavigationTree>(
    initialTree || { tabs: [] },
  );
  const [projects, setProjects] = useState<ProjectItem[]>(initialProjects);
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
      setContent((prev) => ({ ...prev, [section]: resData?.data ?? data }));
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

  const handleResetDefaults = async () => {
    if (!confirm("Reset ALL site content to factory defaults? This cannot be undone.")) return;
    setIsSaving(true);
    try {
      // 1. Reset site-content
      const res = await fetch("/api/admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reset" }),
      });
      const resData = await res.json();
      if (res.ok && resData.data) {
        setContent(resData.data);
      }

      // 2. Reset navigation tree
      const treeRes = await fetch("/api/admin/tree", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reset" }),
      });
      const treeData = await treeRes.json();
      if (treeRes.ok && treeData.data) {
        setTree(treeData.data);
      }

      const projectsRes = await fetch("/api/admin/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reset" }),
      });
      const projectsData = await projectsRes.json();
      if (!projectsRes.ok) throw new Error(projectsData?.message || "Could not reset projects");
      setProjects(projectsData.data);

      setSavedRecently(true);
      if (savedTimer.current) clearTimeout(savedTimer.current);
      savedTimer.current = setTimeout(() => setSavedRecently(false), 3000);
      addToast("Defaults Restored", "All content & navigation tree reset to factory template.");
    } catch (err) {
      addToast("Reset Failed", getErrorMessage(err));
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/auth", { method: "DELETE" });
      router.push("/admin/login");
      router.refresh();
    } catch {
      router.push("/admin/login");
    }
  };

  // Breadcrumb label for current tab
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

  return (
    <div className="admin-dashboard min-h-screen bg-[#f1ece5] text-zinc-950 flex flex-col font-sans">
      <AdminHeader
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogout={handleLogout}
        onResetDefaults={handleResetDefaults}
        userEmail={userEmail}
        isSaving={isSaving}
        savedRecently={savedRecently}
      />

      {/* Page header breadcrumb */}
      <div className="border-b border-zinc-800 bg-[#f1ece5] px-6 lg:px-8 py-3 flex items-center gap-3">
        <span className="text-[11px] text-zinc-400 uppercase tracking-wider font-medium">Admin</span>
        <span className="text-zinc-700">/</span>
        <span className="text-[11px] text-zinc-700 font-medium">{tabLabels[activeTab]}</span>
        <div className="ml-auto flex items-center gap-2">
          {isSaving && (
            <span className="inline-flex items-center gap-1.5 text-[11px] text-amber-400 font-medium animate-pulse">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
              Saving changes…
            </span>
          )}
          {savedRecently && !isSaving && (
            <span className="inline-flex items-center gap-1.5 text-[11px] text-emerald-400 font-medium">
              <CheckCircle2 className="w-3 h-3" />
              Changes live on site
            </span>
          )}
        </div>
      </div>

      {/* Main workspace */}
      <main className="flex-1 max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 bg-[#f1ece5]">
        {activeTab === "overview" && (
          <AdminOverview
            content={content}
            onNavigateTab={(tab) => setActiveTab(tab)}
            onOpenAddModal={(type) => {
              if (type === "solution") setActiveTab("solutions");
              if (type === "product") setActiveTab("products");
            }}
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
            <div className="rounded-xl border border-white/[0.06] bg-[#f1ece5]/60 p-5 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-[15px] font-semibold text-zinc-950">Client Orders & Requests</h2>
                  <p className="text-[12px] text-zinc-500 mt-1">
                    Service contracts, equipment rentals, and software subscription records.
                  </p>
                </div>
              </div>
            </div>
            <div className="rounded-xl border border-white/[0.06] bg-[#f1ece5]/60 p-4 sm:p-6 overflow-x-auto">
              <TableComponent />
            </div>
          </div>
        )}

        {activeTab === "preview" && <LivePreview content={content} />}
      </main>

      {/* Toast stack */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none">
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
              fuseColor="#f1ece5"
              background="#18181b"
              color="#f1ece5"
              inline
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminDashboard;

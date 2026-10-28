"use client";

import React, { useState } from "react";
import {
  Layers,
  Box,
  Building2,
  Users,
  Plus,
  Edit2,
  Trash2,
  MoveUp,
  MoveDown,
  Settings,
  FolderPlus,
  FileText,
  CheckCircle2,
  X,
} from "lucide-react";
import type {
  NavTreeTab,
  NavTreeColumn,
  NavTreeItem,
  NavigationTree,
} from "@/lib/tree-store";
import { getErrorMessage } from "@/lib/utils";

interface TreeCMSManagerProps {
  initialTree: NavigationTree;
  onTriggerToast: (
    title: string,
    desc?: string,
    actionLabel?: string,
    onAction?: () => void,
  ) => void;
  onTreeUpdated?: (newTree: NavigationTree) => void;
}

export function TreeCMSManager({
  initialTree,
  onTriggerToast,
  onTreeUpdated,
}: TreeCMSManagerProps) {
  const [tree, setTree] = useState<NavigationTree>(initialTree);
  const [activeTabId, setActiveTabId] = useState<string>(
    initialTree.tabs[0]?.id || "solutions",
  );
  const [isSaving, setIsSaving] = useState(false);

  // Modals state
  const [tabModalOpen, setTabModalOpen] = useState(false);
  const [editingTab, setEditingTab] = useState<NavTreeTab | null>(null);
  const [tabForm, setTabForm] = useState({
    label: "",
    href: "",
    footerNote: "",
    catalogueCta: "",
  });

  const [colModalOpen, setColModalOpen] = useState(false);
  const [editingCol, setEditingCol] = useState<{
    tabId: string;
    col: NavTreeColumn | null;
  } | null>(null);
  const [colTitle, setColTitle] = useState("");

  const [itemModalOpen, setItemModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<{
    tabId: string;
    columnId: string;
    item: NavTreeItem | null;
  } | null>(null);
  const [itemForm, setItemForm] = useState({
    title: "",
    href: "",
    intro: "",
    description: "",
    outcomes: [""],
  });

  const activeTab = tree.tabs.find((t) => t.id === activeTabId) || tree.tabs[0];

  // Helper to send tree API requests
  const apiCall = async (body: Record<string, unknown>) => {
    setIsSaving(true);
    try {
      const res = await fetch("/api/admin/tree", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to update navigation tree");
      }
      if (data.data) {
        setTree(data.data);
        onTreeUpdated?.(data.data);
      }
      return data;
    } catch (err) {
      onTriggerToast("Operation Failed", getErrorMessage(err));
      throw err;
    } finally {
      setIsSaving(false);
    }
  };

  // ================= TAB HANDLERS =================
  const openAddTabModal = () => {
    setEditingTab(null);
    setTabForm({
      label: "",
      href: "",
      footerNote: "Every engagement is scoped against a tolerance, not a template.",
      catalogueCta: "",
    });
    setTabModalOpen(true);
  };

  const openEditTabModal = (tab: NavTreeTab) => {
    setEditingTab(tab);
    setTabForm({
      label: tab.label,
      href: tab.href || "",
      footerNote: tab.footerNote || "",
      catalogueCta: tab.catalogueCta || "",
    });
    setTabModalOpen(true);
  };

  const handleSaveTab = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tabForm.label.trim()) return;

    if (editingTab) {
      await apiCall({
        action: "editTab",
        tabId: editingTab.id,
        payload: tabForm,
      });
      onTriggerToast("Tab Updated", `"${tabForm.label}" saved successfully`);
    } else {
      await apiCall({
        action: "addTab",
        payload: tabForm,
      });
      onTriggerToast("Tab Added", `"${tabForm.label}" added to main navigation`);
    }
    setTabModalOpen(false);
  };

  const handleDeleteTab = async (tab: NavTreeTab) => {
    if (
      !confirm(
        `Are you sure you want to delete tab "${tab.label}" and all its columns/items?`,
      )
    )
      return;
    await apiCall({ action: "deleteTab", tabId: tab.id });
    onTriggerToast("Tab Deleted", `Removed "${tab.label}"`);
    if (activeTabId === tab.id) {
      const remaining = tree.tabs.filter((t) => t.id !== tab.id);
      if (remaining.length > 0) setActiveTabId(remaining[0].id);
    }
  };

  const handleMoveTab = async (tabIndex: number, direction: "left" | "right") => {
    const newIndex = direction === "left" ? tabIndex - 1 : tabIndex + 1;
    if (newIndex < 0 || newIndex >= tree.tabs.length) return;
    const tabIds = tree.tabs.map((t) => t.id);
    const temp = tabIds[tabIndex];
    tabIds[tabIndex] = tabIds[newIndex];
    tabIds[newIndex] = temp;
    await apiCall({ action: "reorderTabs", payload: { tabIds } });
    onTriggerToast("Reordered Tabs", "Navigation order updated");
  };

  // ================= COLUMN HANDLERS =================
  const openAddColModal = (tabId: string) => {
    setEditingCol({ tabId, col: null });
    setColTitle("");
    setColModalOpen(true);
  };

  const openEditColModal = (tabId: string, col: NavTreeColumn) => {
    setEditingCol({ tabId, col });
    setColTitle(col.title);
    setColModalOpen(true);
  };

  const handleSaveCol = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!colTitle.trim() || !editingCol) return;

    if (editingCol.col) {
      await apiCall({
        action: "editColumn",
        tabId: editingCol.tabId,
        columnId: editingCol.col.id,
        payload: { title: colTitle.trim() },
      });
      onTriggerToast("Column Renamed", `Column renamed to "${colTitle.trim()}"`);
    } else {
      await apiCall({
        action: "addColumn",
        tabId: editingCol.tabId,
        payload: { title: colTitle.trim() },
      });
      onTriggerToast(
        "Column Added",
        `New column "${colTitle.trim()}" added to mega-menu`,
      );
    }
    setColModalOpen(false);
  };

  const handleDeleteCol = async (tabId: string, col: NavTreeColumn) => {
    if (
      !confirm(
        `Are you sure you want to delete column "${col.title}" and its ${col.items.length} items?`,
      )
    )
      return;
    await apiCall({ action: "deleteColumn", tabId, columnId: col.id });
    onTriggerToast("Column Deleted", `Removed column "${col.title}"`);
  };

  const handleMoveCol = async (
    tabId: string,
    colIndex: number,
    direction: "left" | "right",
  ) => {
    if (!activeTab) return;
    const newIndex = direction === "left" ? colIndex - 1 : colIndex + 1;
    if (newIndex < 0 || newIndex >= activeTab.columns.length) return;
    const columnIds = activeTab.columns.map((c) => c.id);
    const temp = columnIds[colIndex];
    columnIds[colIndex] = columnIds[newIndex];
    columnIds[newIndex] = temp;
    await apiCall({
      action: "reorderColumns",
      tabId,
      payload: { columnIds },
    });
    onTriggerToast("Columns Reordered", "Mega-menu column order updated");
  };

  // ================= ITEM HANDLERS =================
  const openAddItemModal = (tabId: string, columnId: string) => {
    setEditingItem({ tabId, columnId, item: null });
    setItemForm({
      title: "",
      href: "",
      intro: "",
      description: "",
      outcomes: ["Deliverable specification 1", "Quality assurance deliverable 2"],
    });
    setItemModalOpen(true);
  };

  const openEditItemModal = (
    tabId: string,
    columnId: string,
    item: NavTreeItem,
  ) => {
    setEditingItem({ tabId, columnId, item });
    setItemForm({
      title: item.title,
      href: item.href || "",
      intro: item.intro || "",
      description: item.description || "",
      outcomes:
        item.outcomes && item.outcomes.length > 0 ? [...item.outcomes] : [""],
    });
    setItemModalOpen(true);
  };

  const handleSaveItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemForm.title.trim() || !editingItem) return;

    const cleanedOutcomes = itemForm.outcomes.filter((o) => o.trim() !== "");

    if (editingItem.item) {
      await apiCall({
        action: "editItem",
        tabId: editingItem.tabId,
        columnId: editingItem.columnId,
        itemId: editingItem.item.id,
        payload: {
          title: itemForm.title.trim(),
          href: itemForm.href.trim() || undefined,
          intro: itemForm.intro.trim(),
          description: itemForm.description.trim(),
          outcomes: cleanedOutcomes,
        },
      });
      onTriggerToast("Item Updated", `Saved updates to "${itemForm.title.trim()}"`);
    } else {
      await apiCall({
        action: "addItem",
        tabId: editingItem.tabId,
        columnId: editingItem.columnId,
        payload: {
          title: itemForm.title.trim(),
          href: itemForm.href.trim() || undefined,
          intro: itemForm.intro.trim(),
          description: itemForm.description.trim(),
          outcomes: cleanedOutcomes,
        },
      });
      onTriggerToast("Item Added", `Added "${itemForm.title.trim()}" to menu`);
    }
    setItemModalOpen(false);
  };

  const handleDeleteItem = async (
    tabId: string,
    columnId: string,
    item: NavTreeItem,
  ) => {
    if (!confirm(`Are you sure you want to delete item "${item.title}"?`)) return;
    await apiCall({
      action: "deleteItem",
      tabId,
      columnId,
      itemId: item.id,
    });
    onTriggerToast("Item Deleted", `Removed "${item.title}"`);
  };

  const handleMoveItem = async (
    tabId: string,
    column: NavTreeColumn,
    itemIndex: number,
    direction: "up" | "down",
  ) => {
    const newIndex = direction === "up" ? itemIndex - 1 : itemIndex + 1;
    if (newIndex < 0 || newIndex >= column.items.length) return;
    const itemIds = column.items.map((i) => i.id);
    const temp = itemIds[itemIndex];
    itemIds[itemIndex] = itemIds[newIndex];
    itemIds[newIndex] = temp;
    await apiCall({
      action: "reorderItems",
      tabId,
      columnId: column.id,
      payload: { itemIds },
    });
    onTriggerToast("Item Reordered", `Updated order in "${column.title}"`);
  };

  const getTabIcon = (tabId: string) => {
    switch (tabId.toLowerCase()) {
      case "solutions":
        return Layers;
      case "products":
        return Box;
      case "industries":
        return Building2;
      case "company":
        return Users;
      default:
        return FileText;
    }
  };

  return (
    <div className="admin-tree-cms space-y-7">
      {/* Top Banner / Explainer */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-5 sm:p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-semibold tracking-wider uppercase">
                Dynamic CMS &amp; Mega-Menu Engine
              </span>
              <span className="text-xs text-slate-500">Full N-Level Tree CRUD</span>
            </div>
            <h2 className="text-xl font-semibold text-slate-900">
              Navigation Hierarchy &amp; Page CMS
            </h2>
            <p className="text-sm text-slate-700 mt-1 max-w-3xl leading-relaxed">
              Manage all 3 levels of your site tree:{" "}
              <span className="text-slate-900 font-medium">Main Tabs (Level 1)</span>,{" "}
              <span className="text-slate-900 font-medium">Column Headers (Level 2)</span>, and{" "}
              <span className="text-slate-900 font-medium">Nav Items &amp; Page Content (Level 3/4)</span>.
              Any addition, rename, reordering, or deletion syncs directly to the frontend mega-menu and dynamic routes.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={openAddTabModal}
            className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3.5 py-2 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-emerald-700 disabled:opacity-60"
          >
            <Plus className="w-4 h-4" />
            <span>Add Main Tab</span>
          </button>
          </div>
        </div>
      </div>

      {/* Level 1: Main Tabs Bar */}
      <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1 no-scrollbar border-b border-slate-200">
        <div className="flex items-center gap-1.5 sm:gap-2">
          {tree.tabs.map((tab, idx) => {
            const Icon = getTabIcon(tab.id);
            const isActive = tab.id === activeTabId;
            const totalItems = tab.columns.reduce(
              (acc, col) => acc + col.items.length,
              0,
            );

            return (
              <div
                key={tab.id}
                className={`group relative flex items-center rounded-lg transition-all ${
                  isActive
                    ? "bg-white border border-slate-200 shadow-sm"
                    : "bg-white border border-slate-200 hover:bg-slate-100"
                }`}
              >
                <button
                  type="button"
                  onClick={() => setActiveTabId(tab.id)}
                  className="flex items-center gap-2 px-3.5 py-2 text-xs"
                >
                  <Icon
                    className={`w-3.5 h-3.5 ${
                      isActive ? "text-emerald-600" : "text-slate-500"
                    }`}
                  />
                  <span className={`uppercase tracking-wider font-semibold ${isActive ? "text-slate-900" : "text-slate-700"}`}>{tab.label}</span>
                  <span
                    className={`px-2.5 py-0.5 rounded-md text-[10px] ${
                      isActive
                        ? "bg-slate-100 text-slate-700"
                        : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {tab.columns.length} cols · {totalItems}
                  </span>
                </button>

                {/* Tab actions hover menu */}
                <div className="flex items-center pr-1.5 gap-0.5 opacity-60 group-hover:opacity-100 transition-opacity">
                  {idx > 0 && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMoveTab(idx, "left");
                      }}
                      className="p-1 hover:bg-slate-100 text-slate-500 rounded"
                      title="Move tab left"
                    >
                      <MoveUp className="w-3 h-3 rotate-[-90deg]" />
                    </button>
                  )}
                  {idx < tree.tabs.length - 1 && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMoveTab(idx, "right");
                      }}
                      className="p-1 hover:bg-slate-100 text-slate-500 rounded"
                      title="Move tab right"
                    >
                      <MoveDown className="w-3 h-3 rotate-[-90deg]" />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      openEditTabModal(tab);
                    }}
                    className="p-1 hover:bg-slate-100 text-slate-500 rounded"
                    title="Edit tab settings"
                  >
                    <Settings className="w-3 h-3" />
                  </button>
                  {tree.tabs.length > 1 && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteTab(tab);
                      }}
                      className="p-1 hover:bg-rose-100 text-rose-600 rounded"
                      title="Delete tab"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Active Tab Workspace */}
      {activeTab && (
        <div className="space-y-6">
          {/* Active Tab Info & Add Column Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-white border border-slate-200 rounded-xl shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 font-bold text-sm">
                {activeTab.label.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-semibold text-slate-900">
                    {activeTab.label} Columns &amp; Items
                  </h3>
                  <span className="text-xs text-slate-500">
                    ({activeTab.columns.length} Column Headers)
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Route slug:{" "}
                  <code className="px-1.5 py-0.5 rounded text-[11px] font-mono text-slate-800 bg-slate-100">
                    /{activeTab.slug}
                  </code>{" "}
                  Href: <span className="font-mono text-[11px] text-slate-800">{activeTab.href}</span>
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => openAddColModal(activeTab.id)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-100"
            >
              <FolderPlus className="w-4 h-4" />
              <span>Add Column Header</span>
            </button>
          </div>

          {/* Columns Grid (Level 2 & Level 3) */}
          {activeTab.columns.length === 0 ? (
            <div className="text-center py-16 rounded-xl border border-dashed border-slate-300 bg-white/60">
              <FolderPlus className="w-10 h-10 mx-auto text-slate-400 mb-3" />
              <p className="text-sm text-slate-700 font-medium">No column headers in this tab yet</p>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Click &quot;Add Column Header&quot; to create your first mega-menu column (e.g., &quot;Survey &amp; Mapping&quot;, &quot;About&quot;).
              </p>
                <button
                  type="button"
                  onClick={() => openAddColModal(activeTab.id)}
                  className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3.5 py-2 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-emerald-700 disabled:opacity-60"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Column Header</span>
                </button>
            </div>
          ) : (
            <div
              className="grid gap-5 items-start"
              style={{
                gridTemplateColumns: `repeat(auto-fit, minmax(310px, 1fr))`,
              }}
            >
              {activeTab.columns.map((column, colIdx) => (
                <div
                  key={column.id || column.title}
                  className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col"
                >
                  {/* Column Header (Level 2) */}
                  <div className="border-b border-slate-200 p-4 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="flex size-6 items-center justify-center rounded-md bg-emerald-50 border border-emerald-200 text-[10px] font-bold text-emerald-700 shrink-0">
                        {String(colIdx + 1).padStart(2, "0")}
                      </span>
                      <h4
                        className="text-sm font-semibold uppercase tracking-wider text-slate-900 truncate"
                        title={column.title}
                      >
                        {column.title}
                      </h4>
                      <span className="text-xs text-slate-500 shrink-0">
                        ({column.items.length})
                      </span>
                    </div>

                    {/* Column controls */}
                    <div className="flex items-center gap-1 shrink-0">
                      {colIdx > 0 && (
                        <button
                          type="button"
                          onClick={() => handleMoveCol(activeTab.id, colIdx, "left")}
                          className="p-1 hover:bg-slate-100 text-slate-500 rounded"
                          title="Move column left"
                        >
                          <MoveUp className="w-3.5 h-3.5 rotate-[-90deg]" />
                        </button>
                      )}
                      {colIdx < activeTab.columns.length - 1 && (
                        <button
                          type="button"
                          onClick={() => handleMoveCol(activeTab.id, colIdx, "right")}
                          className="p-1 hover:bg-slate-100 text-slate-500 rounded"
                          title="Move column right"
                        >
                          <MoveDown className="w-3.5 h-3.5 rotate-[-90deg]" />
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => openEditColModal(activeTab.id, column)}
                        className="p-1 hover:bg-slate-100 text-slate-500 rounded"
                        title="Rename column"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteCol(activeTab.id, column)}
                        className="p-1 hover:bg-rose-100 text-rose-600 rounded"
                        title="Delete column"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Level 3: Items in this Column */}
                  <div className="p-3 space-y-2 flex-1 min-h-[140px]">
                    {column.items.length === 0 ? (
                      <div className="text-center py-8 text-xs text-slate-500">
                        No items under this column header.
                      </div>
                    ) : (
                      column.items.map((item, itemIdx) => (
                        <div
                          key={item.id || item.title}
                          className="group relative rounded-lg border border-slate-200 bg-white p-3 transition-all flex flex-col gap-2 hover:bg-slate-50"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-start gap-2 min-w-0">
                              <span className="size-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                              <div className="min-w-0">
                                <span className="text-xs font-semibold text-slate-900 block truncate leading-snug">
                                  {item.title}
                                </span>
                                <span className="text-[10px] text-slate-500 font-mono block truncate mt-0.5">
                                  {item.href || `/${activeTab.slug}/${item.slug}`}
                                </span>
                              </div>
                            </div>

                            {/* Item action controls */}
                            <div className="flex items-center gap-1 shrink-0 opacity-80 group-hover:opacity-100">
                              {itemIdx > 0 && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleMoveItem(activeTab.id, column, itemIdx, "up")
                                  }
                                  className="p-1 text-slate-500 hover:bg-slate-100 rounded"
                                  title="Move up"
                                >
                                  <MoveUp className="w-3 h-3" />
                                </button>
                              )}
                              {itemIdx < column.items.length - 1 && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleMoveItem(activeTab.id, column, itemIdx, "down")
                                  }
                                  className="p-1 text-slate-500 hover:bg-slate-100 rounded"
                                  title="Move down"
                                >
                                  <MoveDown className="w-3 h-3" />
                                </button>
                              )}
                              <button
                                type="button"
                                onClick={() =>
                                  openEditItemModal(activeTab.id, column.id, item)
                                }
                                className="p-1 text-slate-500 hover:bg-slate-100 rounded"
                                title="Edit item & page content"
                              >
                                <Edit2 className="w-3 h-3" />
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  handleDeleteItem(activeTab.id, column.id, item)
                                }
                                className="p-1 text-rose-600 hover:bg-rose-100 rounded"
                                title="Delete item"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>

                          {/* Quick details preview */}
                          {item.intro && (
                            <p className="text-[11px] text-slate-700 line-clamp-2 pl-3.5 leading-relaxed">
                              {item.intro}
                            </p>
                          )}

                          {item.outcomes && item.outcomes.length > 0 && (
                            <div className="pl-3.5 flex items-center gap-1.5 text-[10px] text-emerald-700">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                              <span>{item.outcomes.length} deliverables specified</span>
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>

                  {/* Add Item to this column */}
                  <div className="p-3 border-t border-slate-200">
                    <button
                      type="button"
                      onClick={() => openAddItemModal(activeTab.id, column.id)}
                      className="w-full py-2 px-3 rounded-lg border border-dashed border-slate-300 text-slate-500 text-xs font-medium transition-colors hover:bg-slate-100 hover:text-slate-700 flex items-center justify-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Item under &quot;{column.title}&quot;</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ================= MODAL: ADD / EDIT MAIN TAB ================= */}
      {tabModalOpen && (
        <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <h3 className="text-base font-semibold text-slate-900">
                {editingTab ? `Edit Tab: ${editingTab.label}` : "Add Main Navigation Tab"}
              </h3>
              <button
                type="button"
                onClick={() => setTabModalOpen(false)}
                className="p-1 text-slate-500 hover:bg-slate-100 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveTab} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                  Tab Label *
                </label>
                <input
                  type="text"
                  required
                  value={tabForm.label}
                  onChange={(e) => setTabForm({ ...tabForm, label: e.target.value })}
                  placeholder="e.g. Solutions, Products, Company, Services"
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/15"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                  Navigation Href
                </label>
                <input
                  type="text"
                  value={tabForm.href}
                  onChange={(e) => setTabForm({ ...tabForm, href: e.target.value })}
                  placeholder="e.g. /solutions or /services"
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-mono text-slate-800 placeholder:text-slate-400 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/15"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                  Mega-Menu Footer Note
                </label>
                <input
                  type="text"
                  value={tabForm.footerNote}
                  onChange={(e) =>
                    setTabForm({ ...tabForm, footerNote: e.target.value })
                  }
                  placeholder="e.g. Every engagement is scoped against a tolerance."
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 placeholder:text-slate-400 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/15"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                  Mega-Menu Catalogue CTA Link Text
                </label>
                <input
                  type="text"
                  value={tabForm.catalogueCta}
                  onChange={(e) =>
                    setTabForm({ ...tabForm, catalogueCta: e.target.value })
                  }
                  placeholder="e.g. Request the full catalogue"
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 placeholder:text-slate-400 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/15"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setTabModalOpen(false)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3.5 py-2 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-emerald-700 disabled:opacity-60"
                >
                  {isSaving ? "Saving..." : editingTab ? "Save Changes" : "Create Tab"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: ADD / EDIT COLUMN ================= */}
      {colModalOpen && editingCol && (
        <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <h3 className="text-base font-semibold text-slate-900">
                {editingCol.col ? `Rename Column: ${editingCol.col.title}` : "Add Column Header / Sub-Category"}
              </h3>
              <button
                type="button"
                onClick={() => setColModalOpen(false)}
                className="p-1 text-slate-500 hover:bg-slate-100 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveCol} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                  Column Header Title *
                </label>
                <input
                  type="text"
                  required
                  value={colTitle}
                  onChange={(e) => setColTitle(e.target.value)}
                  placeholder="e.g. Survey & Mapping, About, Insights"
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/15"
                  autoFocus
                />
                <p className="text-xs text-slate-500 mt-1.5">
                  This title appears in the mega-menu dropdown.
                </p>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setColModalOpen(false)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3.5 py-2 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-emerald-700 disabled:opacity-60"
                >
                  {isSaving ? "Saving..." : editingCol.col ? "Save Column Title" : "Create Column"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: ADD / EDIT ITEM (LEVEL 3 & 4 CMS) ================= */}
      {itemModalOpen && editingItem && (
        <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                  Level 3 Item &amp; Page CMS
                </span>
                <h3 className="text-base font-semibold text-slate-900 mt-0.5">
                  {editingItem.item ? `Edit: ${editingItem.item.title}` : "Add New Nav Item"}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setItemModalOpen(false)}
                className="p-1 text-slate-500 hover:bg-slate-100 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveItem} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                  Item Title *
                </label>
                <input
                  type="text"
                  required
                  value={itemForm.title}
                  onChange={(e) => setItemForm({ ...itemForm, title: e.target.value })}
                  placeholder="e.g. UAV LiDAR Survey or Executive & Technical Leads"
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/15"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                  Custom Route / Href (Optional - auto-generated if left blank)
                </label>
                <input
                  type="text"
                  value={itemForm.href}
                  onChange={(e) => setItemForm({ ...itemForm, href: e.target.value })}
                  placeholder="e.g. /company/about/executive-technical-leads"
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-mono text-slate-800 placeholder:text-slate-400 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/15"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                  Intro / Summary Hook
                </label>
                <textarea
                  rows={2}
                  value={itemForm.intro}
                  onChange={(e) => setItemForm({ ...itemForm, intro: e.target.value })}
                  placeholder="A dependable picture of the ground, even where the ground is hard to reach."
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 placeholder:text-slate-400 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/15 leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                  Detailed Page Description (CMS)
                </label>
                <textarea
                  rows={3}
                  value={itemForm.description}
                  onChange={(e) =>
                    setItemForm({ ...itemForm, description: e.target.value })
                  }
                  placeholder="Dense point clouds penetrating steep slopes and heavy vegetation to produce true bare-earth terrain models."
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 placeholder:text-slate-400 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/15 leading-relaxed"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Key Deliverables / Outcomes
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      setItemForm({
                        ...itemForm,
                        outcomes: [...itemForm.outcomes, ""],
                      })
                    }
                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-[11px] font-semibold text-slate-700 transition-colors hover:bg-slate-100"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add Deliverable</span>
                  </button>
                </div>
                <div className="space-y-2">
                  {itemForm.outcomes.map((outcome, oIdx) => (
                    <div key={oIdx} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={outcome}
                        onChange={(e) => {
                          const updated = [...itemForm.outcomes];
                          updated[oIdx] = e.target.value;
                          setItemForm({ ...itemForm, outcomes: updated });
                        }}
                        placeholder={`Deliverable ${oIdx + 1}`}
                        className="flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 placeholder:text-slate-400 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/15"
                      />
                      {itemForm.outcomes.length > 1 && (
                        <button
                          type="button"
                          onClick={() => {
                            const updated = itemForm.outcomes.filter(
                              (_, idx) => idx !== oIdx,
                            );
                            setItemForm({ ...itemForm, outcomes: updated });
                          }}
                          className="p-1.5 text-rose-600 hover:bg-rose-100 rounded"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setItemModalOpen(false)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3.5 py-2 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-emerald-700 disabled:opacity-60"
                >
                  {isSaving ? "Saving..." : editingItem.item ? "Save Item Changes" : "Add Item"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default TreeCMSManager;

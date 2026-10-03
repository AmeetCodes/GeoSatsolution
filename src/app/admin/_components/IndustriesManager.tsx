"use client";

import React, { useState } from "react";
import {
  Building2,
  Edit2,
  Plus,
  Trash2,
  CheckCircle2,
  Layers,
} from "lucide-react";
import type { IndustryItem } from "@/lib/data-store";

interface IndustriesManagerProps {
  industries: IndustryItem[];
  onSaveIndustries: (updated: IndustryItem[]) => Promise<void>;
  onTriggerToast: (title: string, desc?: string, actionLabel?: string, onAction?: () => void) => void;
}

export function IndustriesManager({
  industries,
  onSaveIndustries,
  onTriggerToast,
}: IndustriesManagerProps) {
  const [editingItem, setEditingItem] = useState<IndustryItem | null>(null);
  const [isNew, setIsNew] = useState(false);

  // Modal form states
  const [title, setTitle] = useState("");
  const [intro, setIntro] = useState("");
  const [desc, setDesc] = useState("");
  const [items, setItems] = useState<string[]>([""]);

  const openAddModal = () => {
    setIsNew(true);
    setTitle("");
    setIntro("");
    setDesc("");
    setItems(["Sector Sub-field 1", "Sector Sub-field 2"]);
    setEditingItem({
      title: "",
      intro: "",
      description: "",
      items: [],
    });
  };

  const openEditModal = (item: IndustryItem) => {
    setIsNew(false);
    setEditingItem(item);
    setTitle(item.title);
    setIntro(item.intro);
    setDesc(item.description);
    setItems([...item.items]);
  };

  const handleSaveModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const cleanedItems = items.filter((i) => i.trim() !== "");

    const newIndustry: IndustryItem = {
      title: title.trim(),
      intro: intro.trim(),
      description: desc.trim(),
      items: cleanedItems.length > 0 ? cleanedItems : ["General Sector Solutions"],
    };

    let updatedList: IndustryItem[];
    if (isNew) {
      updatedList = [...industries, newIndustry];
      onTriggerToast("Industry Sector Added", `"${newIndustry.title}" sector has been added`);
    } else {
      updatedList = industries.map((ind) => (ind.title === editingItem?.title ? newIndustry : ind));
      onTriggerToast("Sector Updated", `Saved updates to "${newIndustry.title}"`);
    }

    await onSaveIndustries(updatedList);
    setEditingItem(null);
  };

  const handleDelete = async (targetTitle: string) => {
    const idx = industries.findIndex((ind) => ind.title === targetTitle);
    if (idx === -1) return;
    const removed = industries[idx];
    const updated = industries.filter((ind) => ind.title !== targetTitle);

    await onSaveIndustries(updated);
    onTriggerToast(
      "Sector Deleted",
      `Removed "${removed.title}"`,
      "Undo",
      async () => {
        const restored = [...updated];
        restored.splice(idx, 0, removed);
        await onSaveIndustries(restored);
        onTriggerToast("Restored", `Restored "${removed.title}"`);
      }
    );
  };

  return (
    <div className="space-y-6">
      {/* Top action header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
        <div>
          <h2 className="text-sm font-semibold text-white">Target Industry Sectors</h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Manage industry-specific offerings, domain applications, and focus areas.
          </p>
        </div>

        <button
          type="button"
          onClick={openAddModal}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shrink-0 transition-colors shadow-md shadow-emerald-600/20"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Sector</span>
        </button>
      </div>

      {/* Grid of Industry Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {industries.map((ind) => (
          <div
            key={ind.title}
            className="flex flex-col justify-between rounded-xl border border-zinc-800 bg-zinc-900/50 p-5 hover:border-zinc-700 transition-all"
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="h-9 w-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white tracking-tight">
                      {ind.title}
                    </h3>
                    <span className="text-[10px] text-zinc-500">
                      {ind.items.length} Focus Disciplines
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => openEditModal(ind)}
                    className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs flex items-center gap-1 transition-colors"
                    title="Edit sector"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(ind.title)}
                    className="p-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/60 text-red-400 text-xs transition-colors"
                    title="Delete sector"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <p className="text-xs text-zinc-300 font-medium leading-relaxed mb-2">
                {ind.intro}
              </p>
              <p className="text-xs text-zinc-400 leading-relaxed mb-4">
                {ind.description}
              </p>

              <div className="border-t border-zinc-800/80 pt-3">
                <p className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                  Specialized Verticals:
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {ind.items.map((sub, sidx) => (
                    <span
                      key={sidx}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-zinc-800/80 text-zinc-200 text-xs border border-zinc-700/60"
                    >
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      {sub}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit / Add Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-xl rounded-2xl border border-zinc-800 bg-zinc-900 p-6 shadow-2xl text-white my-8 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-white mb-1">
              {isNew ? "Add Industry Sector" : `Edit "${editingItem.title}"`}
            </h3>
            <p className="text-xs text-zinc-400 mb-6">
              Configure sector overview, lead paragraph, and associated disciplines.
            </p>

            <form onSubmit={handleSaveModal} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">
                  Sector Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Infrastructure, Natural Resources"
                  className="w-full px-3 py-2 text-xs rounded-lg bg-zinc-950 border border-zinc-800 text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">
                  Lead Summary / Intro
                </label>
                <textarea
                  rows={2}
                  value={intro}
                  onChange={(e) => setIntro(e.target.value)}
                  placeholder="Key value proposition for this industry..."
                  className="w-full px-3 py-2 text-xs rounded-lg bg-zinc-950 border border-zinc-800 text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">
                  Full Sector Description
                </label>
                <textarea
                  rows={3}
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  placeholder="Detailed narrative describing our impact and case studies..."
                  className="w-full px-3 py-2 text-xs rounded-lg bg-zinc-950 border border-zinc-800 text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  required
                />
              </div>

              {/* Items List */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-medium text-zinc-300">
                    Sector Focus Areas & Applications
                  </label>
                  <button
                    type="button"
                    onClick={() => setItems([...items, ""])}
                    className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-medium"
                  >
                    <Plus className="w-3 h-3" /> Add Item
                  </button>
                </div>
                <div className="space-y-2">
                  {items.map((it, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={it}
                        onChange={(e) => {
                          const updated = [...items];
                          updated[idx] = e.target.value;
                          setItems(updated);
                        }}
                        placeholder={`Application ${idx + 1}`}
                        className="flex-1 px-3 py-1.5 text-xs rounded-lg bg-zinc-950 border border-zinc-800 text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const updated = items.filter((_, i) => i !== idx);
                          setItems(updated.length > 0 ? updated : [""]);
                        }}
                        className="p-1.5 text-zinc-400 hover:text-red-400"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="px-4 py-2 text-xs font-medium rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/30 transition-all"
                >
                  Save Sector
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default IndustriesManager;

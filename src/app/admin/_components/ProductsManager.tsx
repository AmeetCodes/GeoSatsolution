"use client";

import React, { useState, useMemo } from "react";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Check,
  Box,
  Filter,
} from "lucide-react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Archive02Icon, Delete02Icon } from "@hugeicons/core-free-icons";
import SwipeRow from "@/components/ui/SwipeRow";
import type { ProductItem } from "@/lib/data-store";

interface ProductsManagerProps {
  products: ProductItem[];
  onSaveProducts: (updated: ProductItem[]) => Promise<void>;
  onTriggerToast: (title: string, desc?: string, actionLabel?: string, onAction?: () => void) => void;
}

const PRODUCT_GROUPS = [
  "All",
  "UAV & Payloads",
  "Survey Equipment",
  "Software",
  "Satellite & Monitoring",
] as const;

export function ProductsManager({
  products,
  onSaveProducts,
  onTriggerToast,
}: ProductsManagerProps) {
  const [selectedGroup, setSelectedGroup] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [editingItem, setEditingItem] = useState<ProductItem | null>(null);
  const [isNew, setIsNew] = useState(false);

  // Form states
  const [formTitle, setFormTitle] = useState("");
  const [formGroup, setFormGroup] = useState<string>("UAV & Payloads");
  const [formIntro, setFormIntro] = useState("");
  const [formDesc, setFormDesc] = useState("");
  const [formOutcomes, setFormOutcomes] = useState<string[]>([""]);
  const [formImages, setFormImages] = useState<{ src: string; alt: string; caption: string }[]>([
    { src: "", alt: "", caption: "" },
  ]);

  const filtered = useMemo(() => {
    return products.filter((item) => {
      const matchesGroup = selectedGroup === "All" || item.group === selectedGroup;
      const matchesSearch =
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.intro.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.group.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesGroup && matchesSearch;
    });
  }, [products, selectedGroup, searchQuery]);

  const openAddModal = () => {
    setIsNew(true);
    setFormTitle("");
    setFormGroup(selectedGroup !== "All" ? selectedGroup : "UAV & Payloads");
    setFormIntro("");
    setFormDesc("");
    setFormOutcomes(["Survey-grade accuracy", "IP55 weather resistance", "High payload capacity"]);
    setFormImages([
      {
        src: "https://images.unsplash.com/photo-1508615070457-7baeba4003ab?auto=format&fit=crop&w=1800&q=85",
        alt: "Geospatial Hardware",
        caption: "Industrial grade field instrument",
      },
    ]);
    setEditingItem({
      title: "",
      group: "UAV & Payloads",
      intro: "",
      description: "",
      outcomes: [],
      images: [],
    });
  };

  const openEditModal = (item: ProductItem) => {
    setIsNew(false);
    setEditingItem(item);
    setFormTitle(item.title);
    setFormGroup(item.group);
    setFormIntro(item.intro);
    setFormDesc(item.description);
    setFormOutcomes(item.outcomes.length > 0 ? [...item.outcomes] : [""]);
    setFormImages(
      item.images?.length > 0
        ? [...item.images]
        : [{ src: "", alt: "", caption: "" }]
    );
  };

  const handleSaveModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    const cleanedOutcomes = formOutcomes.filter((o) => o.trim() !== "");
    const cleanedImages = formImages.filter((img) => img.src.trim() !== "");

    const newProduct: ProductItem = {
      title: formTitle.trim(),
      group: formGroup,
      intro: formIntro.trim(),
      description: formDesc.trim(),
      outcomes: cleanedOutcomes.length > 0 ? cleanedOutcomes : ["Standard calibration certified"],
      images: cleanedImages.length > 0 ? cleanedImages : [
        {
          src: "https://images.unsplash.com/photo-1508615070457-7baeba4003ab?auto=format&fit=crop&w=1800&q=85",
          alt: formTitle,
          caption: "Precision instrumentation",
        },
      ],
    };

    let updatedList: ProductItem[];
    if (isNew) {
      updatedList = [newProduct, ...products];
      onTriggerToast("Product Added", `"${newProduct.title}" added to ${newProduct.group}`);
    } else {
      updatedList = products.map((p) => (p.title === editingItem?.title ? newProduct : p));
      onTriggerToast("Product Updated", `Saved "${newProduct.title}"`);
    }

    await onSaveProducts(updatedList);
    setEditingItem(null);
  };

  const handleDelete = async (title: string) => {
    const idx = products.findIndex((p) => p.title === title);
    if (idx === -1) return;
    const removedItem = products[idx];
    const updated = products.filter((p) => p.title !== title);

    await onSaveProducts(updated);

    onTriggerToast(
      "Product Deleted",
      `Removed "${removedItem.title}"`,
      "Undo",
      async () => {
        const restored = [...updated];
        restored.splice(idx, 0, removedItem);
        await onSaveProducts(restored);
        onTriggerToast("Restored", `Restored "${removedItem.title}"`);
      }
    );
  };

  return (
    <div className="space-y-6">
      {/* Controls Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-xl border border-zinc-800 bg-[#f1ece5]/80 p-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input
            type="text"
            placeholder="Search products, equipment, software..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs rounded-lg bg-[#f1ece5] border border-zinc-800 text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {/* Group selector */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          <Filter className="w-3.5 h-3.5 text-zinc-500 mr-1 shrink-0 hidden sm:block" />
          {PRODUCT_GROUPS.map((grp) => (
            <button
              key={grp}
              type="button"
              onClick={() => setSelectedGroup(grp)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
                selectedGroup === grp
                  ? "bg-blue-600 text-white font-semibold shadow-sm"
                  : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
              }`}
            >
              {grp}
            </button>
          ))}
        </div>

        {/* Add button */}
        <button
          type="button"
          onClick={openAddModal}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#f1ece5] hover:bg-[#e2dcce] text-zinc-950 text-xs font-semibold shrink-0 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Products list with SwipeRow */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="text-center py-16 rounded-xl border border-dashed border-zinc-800 bg-[#f1ece5]/30">
            <Box className="w-8 h-8 mx-auto text-zinc-600 mb-2" />
            <p className="text-sm text-zinc-400 font-medium">No products found in this category</p>
            <p className="text-xs text-zinc-500 mt-1">Adjust your search or add a new equipment item.</p>
          </div>
        ) : (
          filtered.map((item) => (
            <div
              key={item.title}
              className="rounded-xl border border-zinc-800/80 bg-[#f1ece5]/50 hover:border-zinc-700 transition-all p-4"
            >
              <SwipeRow
                actions={[
                  {
                    id: "delete",
                    label: "Delete",
                    icon: <HugeiconsIcon icon={Delete02Icon} size={18} />,
                    color: "#dc2626",
                    dismiss: true,
                  },
                  {
                    id: "archive",
                    label: "Archive",
                    icon: <HugeiconsIcon icon={Archive02Icon} size={18} />,
                    color: "#475569",
                    dismiss: true,
                  },
                ]}
                onAction={(act) => {
                  if (act.id === "delete") handleDelete(item.title);
                  if (act.id === "archive") {
                    onTriggerToast("Archived", `Product "${item.title}" catalog visibility toggled`);
                  }
                }}
                onCommit={(act) => {
                  if (act.id === "delete") handleDelete(item.title);
                }}
                height={70}
                rowColor="#18181b"
                drawerColor="#09090b"
                actionWidth={80}
              >
                <div className="w-full flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
                      <Box className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-zinc-950 tracking-tight">
                          {item.title}
                        </span>
                        <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-blue-950 text-blue-400 border border-blue-800/50">
                          {item.group}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-400 mt-0.5 line-clamp-1">
                        {item.intro}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-zinc-500 hidden sm:inline mr-2">
                      ← Swipe left to delete
                    </span>
                    <button
                      type="button"
                      onClick={() => openEditModal(item)}
                      className="px-3 py-1.5 text-xs font-medium rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 flex items-center gap-1.5 transition-colors"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(item.title)}
                      className="p-1.5 text-xs font-medium rounded-lg bg-red-950/40 hover:bg-red-900/60 text-red-400 border border-red-900/40 transition-colors"
                      title="Delete product"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </SwipeRow>

              <div className="mt-3 pt-3 border-t border-zinc-800/60 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-zinc-500 font-medium">Specifications / Key Specs:</span>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {item.outcomes.map((out, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-zinc-800/80 text-zinc-300 text-[11px]"
                      >
                        <Check className="w-3 h-3 text-blue-400" />
                        {out}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-zinc-500 font-medium">Description:</span>
                  <p className="text-zinc-400 mt-1 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Edit / Add Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-2xl rounded-2xl border border-zinc-800 bg-[#f1ece5] p-6 shadow-2xl text-white my-8 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-zinc-950 mb-1">
              {isNew ? "Add New Product" : `Edit "${editingItem.title}"`}
            </h3>
            <p className="text-xs text-zinc-400 mb-6">
              Configure product category, specifications, and hardware details.
            </p>

            <form onSubmit={handleSaveModal} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">
                  Product / Instrument Name
                </label>
                <input
                  type="text"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g. GNSS Receivers or LiDAR Payloads"
                  className="w-full px-3 py-2 text-xs rounded-lg bg-[#f1ece5] border border-zinc-800 text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">
                  Product Category
                </label>
                <select
                  value={formGroup}
                  onChange={(e) => setFormGroup(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg bg-[#f1ece5] border border-zinc-800 text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="UAV & Payloads">UAV & Payloads</option>
                  <option value="Survey Equipment">Survey Equipment</option>
                  <option value="Software">Software</option>
                  <option value="Satellite & Monitoring">Satellite & Monitoring</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">
                  Summary / Elevator Pitch
                </label>
                <textarea
                  rows={2}
                  value={formIntro}
                  onChange={(e) => setFormIntro(e.target.value)}
                  placeholder="Short introductory summary for equipment catalogue..."
                  className="w-full px-3 py-2 text-xs rounded-lg bg-[#f1ece5] border border-zinc-800 text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">
                  Full Technical Specifications
                </label>
                <textarea
                  rows={3}
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  placeholder="Detailed engineering capabilities, sensor parameters, tolerances..."
                  className="w-full px-3 py-2 text-xs rounded-lg bg-[#f1ece5] border border-zinc-800 text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Specifications / Outcomes */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-medium text-zinc-300">
                    Key Features / Technical Specs
                  </label>
                  <button
                    type="button"
                    onClick={() => setFormOutcomes([...formOutcomes, ""])}
                    className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 font-medium"
                  >
                    <Plus className="w-3 h-3" /> Add Spec
                  </button>
                </div>
                <div className="space-y-2">
                  {formOutcomes.map((outcome, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={outcome}
                        onChange={(e) => {
                          const updated = [...formOutcomes];
                          updated[idx] = e.target.value;
                          setFormOutcomes(updated);
                        }}
                        placeholder={`Feature / Spec ${idx + 1}`}
                        className="flex-1 px-3 py-1.5 text-xs rounded-lg bg-[#f1ece5] border border-zinc-800 text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const updated = formOutcomes.filter((_, i) => i !== idx);
                          setFormOutcomes(updated.length > 0 ? updated : [""]);
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
                  className="px-4 py-2 text-xs font-medium rounded-lg text-zinc-400 hover:text-[#f1ece5] hover:bg-zinc-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold rounded-lg bg-[#f1ece5] hover:bg-[#e2dcce] text-zinc-950 transition-all"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductsManager;

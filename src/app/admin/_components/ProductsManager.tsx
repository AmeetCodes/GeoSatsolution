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
  Download,
  LoaderCircle,
  ExternalLink,
  Tag,
} from "lucide-react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Archive02Icon, Delete02Icon } from "@hugeicons/core-free-icons";
import SwipeRow from "@/components/ui/SwipeRow";
import {
  type ContentImage,
  type ProductDownloadItem,
  type ProductItem,
} from "@/lib/content-types";
import { PRODUCT_TAXONOMY } from "@/lib/product-taxonomy";
import { ImageMediaEditor } from "./ImageMediaEditor";

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
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [editingItem, setEditingItem] = useState<ProductItem | null>(null);
  const [isNew, setIsNew] = useState(false);

  // Form states
  const [formTitle, setFormTitle] = useState("");
  const [formSlug, setFormSlug] = useState("");
  const [formPublished, setFormPublished] = useState(true);
  const [formGroup, setFormGroup] = useState<string>("UAV & Payloads");
  const [formSubcategory, setFormSubcategory] = useState<string>("");
  const [formBrand, setFormBrand] = useState("");
  const [formBrandUrl, setFormBrandUrl] = useState("");
  const [formIntro, setFormIntro] = useState("");
  const [formDesc, setFormDesc] = useState("");
  const [formOutcomes, setFormOutcomes] = useState<string[]>([""]);
  const [formImages, setFormImages] = useState<ContentImage[]>([
    { src: "", alt: "", caption: "", source: "url" },
  ]);
  const [formResources, setFormResources] = useState<ProductDownloadItem[]>([]);
  const [formFaqs, setFormFaqs] = useState<{ question: string; answer: string }[]>([]);
  const [uploadingResourceIndex, setUploadingResourceIndex] = useState<number | null>(null);

  // Available subcategories for current form group
  const availableSubcategoriesForGroup = useMemo(() => {
    return PRODUCT_TAXONOMY[formGroup] || [];
  }, [formGroup]);

  // Available subcategories for filtering
  const filterSubcategories = useMemo(() => {
    if (selectedGroup === "All") {
      const allSubs = new Set<string>();
      Object.values(PRODUCT_TAXONOMY).forEach((subs) => subs.forEach((s) => allSubs.add(s)));
      return Array.from(allSubs);
    }
    return PRODUCT_TAXONOMY[selectedGroup] || [];
  }, [selectedGroup]);

  const filtered = useMemo(() => {
    return products.filter((item) => {
      const matchesGroup = selectedGroup === "All" || item.group === selectedGroup;
      const matchesSubcategory =
        selectedSubcategory === "All" ||
        item.subcategory === selectedSubcategory ||
        (!item.subcategory && item.title === selectedSubcategory);
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        item.title.toLowerCase().includes(query) ||
        item.intro.toLowerCase().includes(query) ||
        item.group.toLowerCase().includes(query) ||
        (item.subcategory && item.subcategory.toLowerCase().includes(query)) ||
        (item.brand && item.brand.toLowerCase().includes(query));

      return matchesGroup && matchesSubcategory && matchesSearch;
    });
  }, [products, selectedGroup, selectedSubcategory, searchQuery]);

  const openAddModal = () => {
    setIsNew(true);
    const initialGroup = selectedGroup !== "All" ? selectedGroup : "UAV & Payloads";
    const initialSubs = PRODUCT_TAXONOMY[initialGroup] || [];
    const initialSubcategory =
      selectedSubcategory !== "All" && initialSubs.includes(selectedSubcategory)
        ? selectedSubcategory
        : initialSubs[0] || "";

    setFormTitle("");
    setFormSlug("");
    setFormPublished(true);
    setFormGroup(initialGroup);
    setFormSubcategory(initialSubcategory);
    setFormBrand("");
    setFormBrandUrl("");
    setFormIntro("");
    setFormDesc("");
    setFormOutcomes(["Survey-grade accuracy", "IP55 weather resistance", "High payload capacity"]);
    setFormFaqs([]);
    setFormImages([{ src: "", alt: "", caption: "", source: "url" }]);
    setFormResources([]);
    setEditingItem({
      title: "",
      group: initialGroup,
      subcategory: initialSubcategory,
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
    setFormSlug(item.slug || "");
    setFormPublished(item.isPublished !== false);
    setFormGroup(item.group);
    const subcats = PRODUCT_TAXONOMY[item.group] || [];
    setFormSubcategory(item.subcategory || (subcats.includes(item.title) ? item.title : subcats[0] || ""));
    setFormBrand(item.brand || "");
    setFormBrandUrl(item.brandUrl || "");
    setFormIntro(item.intro);
    setFormDesc(item.description);
    setFormOutcomes(item.outcomes.length > 0 ? [...item.outcomes] : [""]);
    setFormFaqs(item.faqs || []);
    setFormResources(
      item.resources
        ? item.resources.map((resource) => ({
            ...resource,
            fileMediaId: resource.fileMediaId ? String(resource.fileMediaId) : undefined,
          }))
        : []
    );
    setFormImages(
      item.images && item.images.length > 0
        ? item.images.map((img) => ({ ...img, caption: img.caption || "" }))
        : [{ src: "", alt: "", caption: "", source: "url" }]
    );
  };

  const handleGroupChange = (newGroup: string) => {
    setFormGroup(newGroup);
    const subcats = PRODUCT_TAXONOMY[newGroup] || [];
    if (!subcats.includes(formSubcategory)) {
      setFormSubcategory(subcats[0] || "");
    }
  };

  const handleSaveModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (uploadingResourceIndex !== null) return;
    if (!formTitle.trim()) return;
    if (formImages.some((image) => image.source === "upload" && !image.mediaId)) {
      onTriggerToast("Image upload required", "Finish uploading the selected image or remove that image entry.");
      return;
    }
    if (
      formResources.some(
        (resource) =>
          Boolean(resource.title.trim() || resource.fileUrl.trim()) &&
          (!resource.title.trim() || !resource.fileUrl.trim())
      )
    ) {
      onTriggerToast("Complete product downloads", "Each download needs both a display title and a file or URL.");
      return;
    }

    const cleanedOutcomes = formOutcomes.filter((o) => o.trim() !== "");
    const cleanedImages = formImages.filter((img) => img.src.trim() !== "");

    const newProduct: ProductItem = {
      id: isNew ? undefined : editingItem?.id,
      title: formTitle.trim(),
      slug:
        formSlug.trim() ||
        formTitle
          .trim()
          .toLowerCase()
          .replace(/&/g, "and")
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, ""),
      isPublished: formPublished,
      group: formGroup,
      subcategory: formSubcategory.trim() || undefined,
      brand: formBrand.trim() || undefined,
      brandUrl: formBrandUrl.trim() || undefined,
      intro: formIntro.trim(),
      description: formDesc.trim(),
      outcomes: cleanedOutcomes.length > 0 ? cleanedOutcomes : ["Standard calibration certified"],
      faqs: formFaqs.filter((faq) => faq.question.trim() && faq.answer.trim()),
      images: cleanedImages.slice(0, 4).map((image) => ({ ...image, alt: image.alt.trim() || formTitle.trim() })),
      resources: formResources.filter((resource) => resource.title.trim() && resource.fileUrl.trim()),
    };

    let updatedList: ProductItem[];
    if (isNew) {
      updatedList = [newProduct, ...products];
    } else {
      updatedList = products.map((p) => {
        if (editingItem?.id && p.id === editingItem.id) return newProduct;
        if (p.title === editingItem?.title) return newProduct;
        return p;
      });
    }

    await onSaveProducts(updatedList);
    onTriggerToast(
      isNew ? "Product Added" : "Product Updated",
      isNew ? `"${newProduct.title}" added to ${newProduct.subcategory || newProduct.group}` : `Saved "${newProduct.title}"`
    );
    setEditingItem(null);
  };

  const uploadProductResource = async (index: number, file?: File) => {
    if (!file) return;
    setUploadingResourceIndex(index);
    try {
      const data = new FormData();
      data.set("file", file);
      const response = await fetch("/api/admin/documents", { method: "POST", body: data });
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error(result.message || "The file could not be uploaded.");
      setFormResources((current) =>
        current.map((resource, i) =>
          i === index
            ? {
                ...resource,
                fileUrl: result.data.fileUrl,
                fileSource: "upload",
                fileMediaId: result.data.fileMediaId,
                fileName: result.data.fileName,
              }
            : resource
        )
      );
      onTriggerToast("File Uploaded", `${result.data.fileName} is ready to attach to this product.`);
    } catch (error) {
      onTriggerToast("Upload Failed", error instanceof Error ? error.message : "The resource could not be uploaded.");
    } finally {
      setUploadingResourceIndex(null);
    }
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
      <div className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          {/* Search */}
          <div className="relative max-w-md flex-1">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search products, models, brands, subcategories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-10 pr-4 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/15"
            />
          </div>

          {/* Add button */}
          <button
            type="button"
            onClick={openAddModal}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-emerald-600 px-3.5 py-2 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-emerald-700"
          >
            <Plus className="w-4 h-4" />
            <span>Add Product Model</span>
          </button>
        </div>

        {/* Level 1: Category filters */}
        <div className="flex flex-wrap items-center gap-2 border-t border-slate-100 pt-3">
          <span className="mr-1 flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-slate-500">
            <Filter className="w-3.5 h-3.5" /> Category:
          </span>
          {PRODUCT_GROUPS.map((grp) => (
            <button
              key={grp}
              type="button"
              onClick={() => {
                setSelectedGroup(grp);
                setSelectedSubcategory("All");
              }}
              className={`whitespace-nowrap rounded-lg px-3 py-1.5 text-xs transition-colors ${
                selectedGroup === grp
                  ? "bg-emerald-600 font-semibold text-white"
                  : "border border-slate-200 bg-white font-medium text-slate-600 hover:bg-slate-100"
              }`}
            >
              {grp}
            </button>
          ))}
        </div>

        {/* Level 2: Subcategory filters */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="mr-1 flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-slate-500">
            <Tag className="w-3.5 h-3.5" /> Subcategory:
          </span>
          <button
            type="button"
            onClick={() => setSelectedSubcategory("All")}
            className={`whitespace-nowrap rounded-md px-2.5 py-1 text-[11px] transition-colors ${
              selectedSubcategory === "All"
                ? "bg-emerald-600 font-semibold text-white"
                : "border border-slate-200 bg-white font-medium text-slate-600 hover:bg-slate-100"
            }`}
          >
            All Subcategories
          </button>
          {filterSubcategories.map((subcat) => (
            <button
              key={subcat}
              type="button"
              onClick={() => setSelectedSubcategory(subcat)}
              className={`whitespace-nowrap rounded-md px-2.5 py-1 text-[11px] transition-colors ${
                selectedSubcategory === subcat
                  ? "bg-emerald-600 font-semibold text-white"
                  : "border border-slate-200 bg-white font-medium text-slate-600 hover:bg-slate-100"
              }`}
            >
              {subcat}
            </button>
          ))}
        </div>
      </div>

      {/* Products list with SwipeRow */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 bg-white/60 py-16 text-center">
            <Box className="mx-auto mb-2 h-8 w-8 text-slate-300" />
            <p className="text-sm font-semibold text-slate-700">No product models found in this category / subcategory</p>
            <p className="mt-1 text-xs text-slate-500">Add a new product model to populate this section.</p>
          </div>
        ) : (
          filtered.map((item) => (
            <div
              key={item.id || item.slug || item.title}
              className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-all hover:border-slate-300 hover:shadow"
            >
              <SwipeRow
                actions={[
                  {
                    id: "delete",
                    label: "Delete",
                    icon: <HugeiconsIcon icon={Delete02Icon} size={18} />,
                    color: "#e11d48",
                    dismiss: true,
                  },
                  {
                    id: "archive",
                    label: "Archive",
                    icon: <HugeiconsIcon icon={Archive02Icon} size={18} />,
                    color: "#64748b",
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
                height={64}
                radius={12}
                rowColor="#ffffff"
                drawerColor="#f1f5f9"
                actionWidth={80}
              >
                <div className="flex w-full items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-600">
                      <Box className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm font-semibold tracking-tight text-slate-900">
                          {item.title}
                        </span>
                        <span className="rounded-md bg-slate-100 px-2.5 py-1 text-xs text-slate-700">
                          {item.group}
                        </span>
                        {item.subcategory && (
                          <span className="rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 text-[10px] font-semibold text-slate-600">
                            {item.subcategory}
                          </span>
                        )}
                        {item.brand && (
                          <span className="flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-800">
                            {item.brand}
                            {item.brandUrl && (
                              <a
                                href={item.brandUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:text-amber-600"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <ExternalLink className="w-2.5 h-2.5" />
                              </a>
                            )}
                          </span>
                        )}
                        {item.isPublished === false && (
                          <span className="rounded-full bg-rose-50 px-2 py-0.5 text-[10px] font-semibold text-rose-700">
                            Draft
                          </span>
                        )}
                      </div>
                      <p className="mt-1 line-clamp-1 text-xs text-slate-500">
                        {item.intro}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => openEditModal(item)}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-100"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(item.title)}
                      className="inline-flex items-center justify-center rounded-lg border border-rose-200 bg-rose-50 p-2 text-rose-600 transition-colors hover:bg-rose-100"
                      title="Delete product"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </SwipeRow>

              <div className="mt-3 grid grid-cols-1 gap-2 border-t border-slate-100 pt-3 text-xs sm:grid-cols-2">
                <div>
                  <span className="font-medium text-slate-500">Key Specs:</span>
                  <div className="mt-1 flex flex-wrap gap-1.5">
                    {item.outcomes.map((out, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1 rounded-full border border-emerald-200/60 bg-emerald-50 px-2 py-0.5 text-[11px] text-emerald-800"
                      >
                        <Check className="w-3 h-3 text-emerald-600" />
                        {out}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="font-medium text-slate-500">Description Preview:</span>
                  <p className="mt-1 line-clamp-2 leading-relaxed text-slate-600">
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
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-900/50 p-4 backdrop-blur-sm sm:items-center">
          <div className="relative my-8 max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-slate-200 bg-white p-6 text-slate-700 shadow-2xl">
            <h3 className="text-lg font-semibold text-slate-900 mb-1">
              {isNew ? "Add Product Model" : `Edit "${editingItem.title}"`}
            </h3>
            <p className="mb-6 text-xs text-slate-500">
              Configure product category, subcategory class, brand information, and hardware specifications.
            </p>

            <form onSubmit={handleSaveModal} className="space-y-4">
              {/* Hierarchy Level 1 & Level 2 Dropdowns */}
              <div className="grid grid-cols-1 gap-4 rounded-xl border border-emerald-200 bg-emerald-50/50 p-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Level 1: Main Category
                  </label>
                  <select
                    value={formGroup}
                    onChange={(e) => handleGroupChange(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/15"
                  >
                    <option value="UAV & Payloads">UAV & Payloads</option>
                    <option value="Survey Equipment">Survey Equipment</option>
                    <option value="Software">Software</option>
                    <option value="Satellite & Monitoring">Satellite & Monitoring</option>
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Level 2: Subcategory / Class
                  </label>
                  <select
                    value={formSubcategory}
                    onChange={(e) => setFormSubcategory(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/15"
                  >
                    {availableSubcategoriesForGroup.map((subcat) => (
                      <option key={subcat} value={subcat}>
                        {subcat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Product Model Name & Slug */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Product Model Title
                  </label>
                  <input
                    type="text"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    placeholder="e.g. Trimble R12i GNSS Receiver or DJI Zenmuse L2"
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/15"
                    required
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-500">
                    URL Slug (auto-generated if empty)
                  </label>
                  <input
                    value={formSlug}
                    onChange={(e) => setFormSlug(e.target.value)}
                    placeholder="trimble-r12i-gnss-receiver"
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/15"
                  />
                </div>
              </div>

              {/* Brand Name & Brand URL */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Brand / Manufacturer Name
                  </label>
                  <input
                    type="text"
                    value={formBrand}
                    onChange={(e) => setFormBrand(e.target.value)}
                    placeholder="e.g. Trimble, DJI Enterprise, GreenValley"
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/15"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Brand Official Website / Product URL
                  </label>
                  <input
                    type="url"
                    value={formBrandUrl}
                    onChange={(e) => setFormBrandUrl(e.target.value)}
                    placeholder="https://geospatial.trimble.com/en/products/hardware/..."
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/15"
                  />
                </div>
              </div>

              <label className="flex items-center gap-2 text-xs font-medium text-slate-600">
                <input
                  type="checkbox"
                  checked={formPublished}
                  onChange={(e) => setFormPublished(e.target.checked)}
                  className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                />
                <span>Published in public catalog</span>
              </label>

              {/* Card Intro */}
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Card Summary / Intro (1-2 sentences for card display)
                </label>
                <textarea
                  rows={2}
                  value={formIntro}
                  onChange={(e) => setFormIntro(e.target.value)}
                  placeholder="Short introductory summary for card display..."
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/15"
                  required
                />
              </div>

              {/* Full Description */}
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Full Technical Description
                </label>
                <textarea
                  rows={3}
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  placeholder="Detailed engineering capabilities, sensor parameters, tolerances..."
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/15"
                  required
                />
              </div>

              {/* Key Specs / Outcomes */}
              <div>
                <div className="mb-1.5 flex items-center justify-between">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Key Technical Specifications (Quick Specs Chips)
                  </label>
                  <button
                    type="button"
                    onClick={() => setFormOutcomes([...formOutcomes, ""])}
                    className="flex items-center gap-1 text-xs font-semibold text-emerald-600 hover:text-emerald-700"
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
                        placeholder={`e.g. Sub-cm RTK accuracy, 60° IMU tilt compensation (${idx + 1})`}
                        className="flex-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/15"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const updated = formOutcomes.filter((_, i) => i !== idx);
                          setFormOutcomes(updated.length > 0 ? updated : [""]);
                        }}
                        className="rounded-md p-1.5 text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-600"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Product Images */}
              <section className="space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <label className="block text-sm font-semibold text-slate-900">Product Images</label>
                    <p className="mt-0.5 text-xs text-slate-500">
                      Choose a database upload or an external image URL. Up to four gallery images.
                    </p>
                  </div>
                  <button
                    type="button"
                    disabled={formImages.length >= 4}
                    onClick={() =>
                      setFormImages([...formImages, { src: "", alt: "", caption: "", source: "url" }])
                    }
                    className="shrink-0 text-xs font-semibold text-emerald-600 hover:text-emerald-700 disabled:opacity-50"
                  >
                    Add image
                  </button>
                </div>
                {formImages.map((image, index) => (
                  <ImageMediaEditor
                    key={index}
                    image={image}
                    index={index}
                    onChange={(updatedImage) =>
                      setFormImages(formImages.map((item, i) => (i === index ? updatedImage : item)))
                    }
                    onRemove={() => setFormImages(formImages.filter((_, i) => i !== index))}
                  />
                ))}
              </section>

              {/* Downloadable Resources */}
              <section className="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900">Downloadable Resources</h4>
                    <p className="mt-1 text-xs text-slate-500">
                      Datasheets, brochures, and user manuals downloadable on product pages.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setFormResources([
                        ...formResources,
                        { title: "", fileUrl: "", fileSource: "upload" },
                      ])
                    }
                    className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-100"
                  >
                    Add download
                  </button>
                </div>
                {formResources.length === 0 && (
                  <p className="rounded-lg border border-dashed border-slate-300 px-3 py-4 text-center text-xs text-slate-500">
                    No downloadable files attached yet. Add datasheets or brochures above.
                  </p>
                )}
                {formResources.map((resource, index) => (
                  <div
                    key={index}
                    className="grid gap-2 rounded-lg border border-slate-200 bg-white p-3 sm:grid-cols-[1fr_auto]"
                  >
                    <div className="space-y-2">
                      <input
                        value={resource.title}
                        onChange={(event) =>
                          setFormResources(
                            formResources.map((item, i) =>
                              i === index ? { ...item, title: event.target.value } : item
                            )
                          )
                        }
                        placeholder="Download label (e.g. Trimble R12i Datasheet)"
                        className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 placeholder:text-slate-400 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/15"
                      />
                      <label className="flex cursor-pointer flex-wrap items-center gap-2 text-xs text-slate-600">
                        {uploadingResourceIndex === index ? (
                          <LoaderCircle className="size-4 animate-spin text-emerald-600" />
                        ) : (
                          <Download className="size-4 text-emerald-600" />
                        )}
                        <span>
                          {resource.fileName ||
                            (uploadingResourceIndex === index ? "Uploading…" : "Upload a file")}
                        </span>
                        <input
                          type="file"
                          accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.rtf,.csv,.txt,.zip,.jpg,.jpeg,.png,.webp,.gif,.avif"
                          disabled={uploadingResourceIndex !== null}
                          onChange={(event) => void uploadProductResource(index, event.target.files?.[0])}
                          className="sr-only"
                        />
                      </label>
                      <input
                        value={resource.fileSource === "url" ? resource.fileUrl : ""}
                        onChange={(event) =>
                          setFormResources(
                            formResources.map((item, i) =>
                              i === index
                                ? {
                                    ...item,
                                    fileUrl: event.target.value,
                                    fileSource: "url",
                                    fileMediaId: undefined,
                                    fileName: "",
                                  }
                                : item
                            )
                          )
                        }
                        placeholder="Or enter a file URL directly"
                        className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 placeholder:text-slate-400 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/15"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => setFormResources(formResources.filter((_, i) => i !== index))}
                      aria-label={`Remove download ${index + 1}`}
                      className="justify-self-end self-start rounded-md px-2 py-1 text-xs font-medium text-rose-600 transition-colors hover:bg-rose-50"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </section>

              {/* FAQs */}
              <section className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Frequently asked questions</label>
                  <button
                    type="button"
                    onClick={() => setFormFaqs([...formFaqs, { question: "", answer: "" }])}
                    className="text-xs font-semibold text-emerald-600 hover:text-emerald-700"
                  >
                    Add FAQ
                  </button>
                </div>
                {formFaqs.map((faq, index) => (
                  <div key={index} className="space-y-2 rounded-lg border border-slate-200 bg-slate-50 p-3">
                    <input
                      value={faq.question}
                      onChange={(e) =>
                        setFormFaqs(
                          formFaqs.map((item, i) =>
                            i === index ? { ...item, question: e.target.value } : item
                          )
                        )
                      }
                      placeholder="Question"
                      className="w-full rounded-lg border border-slate-200 bg-white p-2 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/15"
                    />
                    <textarea
                      value={faq.answer}
                      onChange={(e) =>
                        setFormFaqs(
                          formFaqs.map((item, i) =>
                            i === index ? { ...item, answer: e.target.value } : item
                          )
                        )
                      }
                      placeholder="Answer"
                      rows={2}
                      className="w-full rounded-lg border border-slate-200 bg-white p-2 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/15"
                    />
                    <button
                      type="button"
                      onClick={() => setFormFaqs(formFaqs.filter((_, i) => i !== index))}
                      className="text-xs font-medium text-rose-600 hover:text-rose-700"
                    >
                      Remove FAQ
                    </button>
                  </div>
                ))}
              </section>

              <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-4">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploadingResourceIndex !== null}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-emerald-700 disabled:opacity-60"
                >
                  Save Product Model
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
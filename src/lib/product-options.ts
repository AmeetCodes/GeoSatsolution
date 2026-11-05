export interface QuoteProductOption {
  id: string;
  name: string;
  category: string;
  inStock: boolean;
}

export function resolveProductOption(
  products: QuoteProductOption[],
  preferredProductId: string,
  productName?: string,
): QuoteProductOption | undefined {
  if (preferredProductId) {
    const preferred = products.find((product) => product.id === preferredProductId);
    if (preferred) return preferred;
  }

  const normalizedName = productName?.trim().toLowerCase();
  if (normalizedName) {
    const namedProduct = products.find(
      (product) => product.name.trim().toLowerCase() === normalizedName,
    );
    if (namedProduct) return namedProduct;
  }

  return products[0];
}

export function normalizeProductOptions(data: unknown): QuoteProductOption[] {
  if (!Array.isArray(data)) return [];

  const options: QuoteProductOption[] = [];
  const seen = new Set<string>();

  for (const item of data) {
    if (!item || typeof item !== "object") continue;

    const record = item as Record<string, unknown>;
    const id =
      typeof record.id === "string"
        ? record.id
        : typeof record._id === "string"
          ? record._id
          : "";
    const name =
      typeof record.name === "string"
        ? record.name
        : typeof record.title === "string"
          ? record.title
          : "";

    if (!id || !name || seen.has(id)) continue;

    const group = typeof record.group === "string" ? record.group.trim() : "";
    const subcategory =
      typeof record.subcategory === "string" ? record.subcategory.trim() : "";
    const fallbackCategory =
      typeof record.category === "string" ? record.category.trim() : "";
    const stockValue = record.inStock;
    const inStock =
      typeof stockValue === "boolean" ? stockValue : record.isPublished !== false;

    seen.add(id);
    options.push({
      id,
      name,
      category: fallbackCategory || group || subcategory || "Survey Equipment",
      inStock,
    });
  }

  return options;
}

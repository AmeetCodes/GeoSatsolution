"use client";

import {
  useEffect,
  useMemo,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import { CheckCircle2, Loader2, Send, ShieldCheck, Tag } from "lucide-react";
import { z } from "zod";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ProductMultiSelect } from "@/components/ui/product-multi-select";
import {
  normalizeProductOptions,
  resolveProductOption,
  type QuoteProductOption,
} from "@/lib/product-options";
import { cn } from "@/lib/utils";
import { productInquirySchema } from "@/lib/validations/product-inquiry.schema";

export type { QuoteProductOption } from "@/lib/product-options";

export interface QuoteFormData {
  fullName: string;
  company: string;
  email: string;
  phone: string;
  productIds: string[];
  productNames: string[];
  projectDetails: string;
}

export interface RequestQuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultProductId?: string;
  productId?: string;
  productsList?: QuoteProductOption[];
  /** Legacy fallback used only when no product options are available. */
  productName?: string;
  /** Legacy fallback used only when no product options are available. */
  categoryName?: string;
  onSubmitSuccess?: (data: QuoteFormData) => void;
}

type QuoteFieldErrors = Partial<Record<keyof QuoteFormData, string>>;

const FIELD_IDS: Record<keyof QuoteFormData, string> = {
  fullName: "quote-fullName",
  company: "quote-company",
  email: "quote-email",
  phone: "quote-phone",
  productIds: "quote-products",
  productNames: "",
  projectDetails: "quote-projectDetails",
};

const SCHEMA_FIELD_MAP = {
  name: "fullName",
  company: "company",
  email: "email",
  phone: "phone",
  product: "productIds",
  products: "productIds",
  productIds: "productIds",
  details: "projectDetails",
} as const;

const quoteRequestSchema = productInquirySchema.extend({
  productIds: z
    .array(z.string().trim().min(1))
    .min(1, "Please select at least one product."),
  products: z
    .array(z.string().trim().min(1))
    .min(1, "Please select at least one product."),
});

const inputClassName =
  "h-11 rounded-xl border-slate-200 bg-slate-50/50 text-sm text-slate-900 placeholder:text-slate-400 focus:border-teal-600 focus:bg-white focus:ring-4 focus:ring-teal-500/10 aria-invalid:border-rose-500 aria-invalid:focus:border-rose-500 aria-invalid:focus:ring-rose-500/15 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 dark:focus:bg-slate-950";

function createInitialForm(products: QuoteProductOption[] = []): QuoteFormData {
  return {
    fullName: "",
    company: "",
    email: "",
    phone: "",
    productIds: products.map((product) => product.id),
    productNames: products.map((product) => product.name),
    projectDetails: "",
  };
}

export function RequestQuoteModal({
  isOpen,
  onClose,
  defaultProductId,
  productId,
  productsList,
  productName,
  categoryName,
  onSubmitSuccess,
}: RequestQuoteModalProps) {
  const preferredProductId = defaultProductId ?? productId ?? "";
  const providedProducts = productsList && productsList.length > 0 ? productsList : null;
  const hasProvidedProducts = Boolean(providedProducts);
  const initialProduct = resolveProductOption(
    providedProducts ?? [],
    preferredProductId,
    productName,
  );

  const [formData, setFormData] = useState<QuoteFormData>(() =>
    createInitialForm(initialProduct ? [initialProduct] : []),
  );
  const [fetchedProducts, setFetchedProducts] = useState<QuoteProductOption[]>([]);
  const [isProductsLoading, setIsProductsLoading] = useState(!hasProvidedProducts);
  const [productsError, setProductsError] = useState("");
  const [reloadToken, setReloadToken] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [errors, setErrors] = useState<QuoteFieldErrors>({});

  const availableProducts = providedProducts ?? fetchedProducts;

  useEffect(() => {
    if (hasProvidedProducts) return;

    const controller = new AbortController();
    let active = true;

    async function loadProducts() {
      try {
        const response = await fetch("/api/products", {
          cache: "no-store",
          signal: controller.signal,
        });
        const result = (await response.json().catch(() => null)) as
          | { success?: boolean; data?: unknown; message?: string }
          | null;

        if (!response.ok || !result?.success) {
          throw new Error(result?.message ?? "Could not load the product catalogue.");
        }

        const options = normalizeProductOptions(result.data);
        if (!active) return;

        setFetchedProducts(options);
        setProductsError(
          options.length === 0 ? "No products are available right now." : "",
        );

        if (options.length > 0) {
          setFormData((current) => {
            const validIds = current.productIds.filter((selectedId) =>
              options.some((product) => product.id === selectedId),
            );

            if (validIds.length === current.productIds.length) {
              return current;
            }

            if (validIds.length > 0) {
              return {
                ...current,
                productIds: validIds,
                productNames: validIds
                  .map(
                    (selectedId) =>
                      options.find((product) => product.id === selectedId)?.name,
                  )
                  .filter((name): name is string => Boolean(name)),
              };
            }

            const nextProduct = resolveProductOption(
              options,
              preferredProductId,
              productName,
            );

            return nextProduct
              ? {
                  ...current,
                  productIds: [nextProduct.id],
                  productNames: [nextProduct.name],
                }
              : current;
          });
        }
      } catch (error) {
        if (!active || controller.signal.aborted) return;
        setProductsError(
          error instanceof Error
            ? error.message
            : "Could not load the product catalogue.",
        );
      } finally {
        if (active) setIsProductsLoading(false);
      }
    }

    void loadProducts();

    return () => {
      active = false;
      controller.abort();
    };
  }, [hasProvidedProducts, preferredProductId, productName, reloadToken]);

  const selectedProducts = useMemo(
    () =>
      formData.productIds
        .map((selectedId) =>
          availableProducts.find((product) => product.id === selectedId),
        )
        .filter((product): product is QuoteProductOption => Boolean(product)),
    [availableProducts, formData.productIds],
  );

  const selectedProductNames =
    selectedProducts.length > 0
      ? selectedProducts.map((product) => product.name)
      : formData.productNames;

  const displayProductNames =
    selectedProductNames.length > 0
      ? selectedProductNames
      : productName
        ? [productName]
        : [];
  const displayProductName =
    displayProductNames.length > 0
      ? displayProductNames.join(", ")
      : "Select one or more products";

  const displayCategory =
    selectedProducts.length > 0
      ? Array.from(
          new Set(selectedProducts.map((product) => product.category)),
        ).join(" · ")
      : categoryName ?? "Survey Equipment";

  const hasSelectedProducts =
    selectedProducts.length > 0 || formData.productIds.length > 0;
  const hasOutOfStockProduct = selectedProducts.some(
    (product) => !product.inStock,
  );
  const selectedStockLabel =
    selectedProducts.length > 1
      ? `${selectedProducts.length} Selected`
      : selectedProducts[0]
        ? selectedProducts[0].inStock
          ? "In Stock"
          : "Made to Order"
        : hasSelectedProducts
          ? "Selected"
          : "Select Products";

  const handleInputChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    const field = name as Exclude<keyof QuoteFormData, "productIds" | "productNames">;
    setFormData((current) => ({ ...current, [field]: value }));
    setErrors((current) => {
      if (!current[field]) return current;
      return { ...current, [field]: undefined };
    });
    if (submitError) setSubmitError("");
  };

  const handleProductsChange = (nextProductIds: string[]) => {
    setFormData((current) => ({
      ...current,
      productIds: nextProductIds,
      productNames: nextProductIds
        .map(
          (selectedId) =>
            availableProducts.find((product) => product.id === selectedId)?.name,
        )
        .filter((name): name is string => Boolean(name)),
    }));
    setErrors((current) => {
      if (!current.productIds && !current.productNames) return current;
      return { ...current, productIds: undefined, productNames: undefined };
    });
    if (submitError) setSubmitError("");
  };

  const handleRetryProducts = () => {
    setProductsError("");
    setIsProductsLoading(true);
    setReloadToken((token) => token + 1);
  };

  const handleReset = () => {
    const defaultProduct = resolveProductOption(
      availableProducts,
      preferredProductId,
      productName,
    );

    setIsSubmitted(false);
    setIsSubmitting(false);
    setSubmitError("");
    setErrors({});
    setFormData(createInitialForm(defaultProduct ? [defaultProduct] : []));
    onClose();
  };

  const handleOpenChange = (open: boolean) => {
    if (open || isSubmitting) return;
    handleReset();
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) return;

    const payload = {
      name: formData.fullName.trim(),
      company: formData.company.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      productIds: formData.productIds,
      products: selectedProductNames,
      product: selectedProductNames.join(", "),
      details: formData.projectDetails.trim(),
      website: new FormData(event.currentTarget).get("website"),
    };

    const parsed = quoteRequestSchema.safeParse(payload);

    if (!parsed.success) {
      const nextErrors: QuoteFieldErrors = {};

      for (const issue of parsed.error.issues) {
        const sourceField = issue.path[0];
        if (typeof sourceField !== "string") continue;

        const formField = SCHEMA_FIELD_MAP[sourceField as keyof typeof SCHEMA_FIELD_MAP];
        if (formField && !nextErrors[formField]) {
          nextErrors[formField] = issue.message;
        }
      }

      setErrors(nextErrors);

      const firstInvalidField = Object.keys(nextErrors)[0] as
        | keyof QuoteFormData
        | undefined;
      const firstInvalidId = firstInvalidField ? FIELD_IDS[firstInvalidField] : "";
      if (firstInvalidId) document.getElementById(firstInvalidId)?.focus();
      return;
    }

    const submittedData: QuoteFormData = {
      fullName: parsed.data.name,
      company: parsed.data.company,
      email: parsed.data.email,
      phone: parsed.data.phone,
      productIds: parsed.data.productIds,
      productNames: parsed.data.products,
      projectDetails: parsed.data.details,
    };

    setIsSubmitting(true);
    setSubmitError("");

    try {
      const response = await fetch("/api/buy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: parsed.data.name,
          company: parsed.data.company,
          email: parsed.data.email,
          phone: parsed.data.phone,
          productIds: parsed.data.productIds,
          products: parsed.data.products,
          product: parsed.data.product,
          details: parsed.data.details,
          website: parsed.data.website,
        }),
      });

      const result = (await response.json().catch(() => null)) as {
        error?: string;
      } | null;

      if (!response.ok) {
        setSubmitError(
          result?.error ??
            "We couldn't send your request just now. Please try again shortly.",
        );
        return;
      }

      setFormData(submittedData);
      setIsSubmitted(true);
      onSubmitSuccess?.(submittedData);
    } catch {
      setSubmitError(
        "We couldn't reach the quote service. Check your connection and try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="max-h-[85vh] w-full max-w-xl gap-0 overflow-hidden rounded-3xl border-slate-200/80 bg-white p-6 shadow-2xl sm:max-h-[90vh] sm:p-8 dark:border-slate-800 dark:bg-slate-950">
        <div className="custom-scrollbar max-h-[calc(85vh-3rem)] overflow-y-auto pr-1.5 sm:max-h-[calc(90vh-4rem)]">
        {!isSubmitted ? (
          <>
            <DialogHeader className="mb-3 space-y-1.5 text-left">
              <div className="flex items-center gap-2">
                <Badge
                  variant="outline"
                  className="rounded-md border-teal-200/80 bg-teal-50 px-2.5 py-0.5 font-mono text-[10px] font-bold tracking-wider text-teal-700 uppercase dark:border-teal-800 dark:bg-teal-950/50 dark:text-teal-400"
                >
                  Purchase Request / {displayCategory}
                </Badge>
              </div>

              <DialogTitle className="font-heading text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl dark:text-slate-100">
                Request a quote.
              </DialogTitle>

              <DialogDescription className="font-sans text-xs leading-relaxed text-slate-500 sm:text-sm dark:text-slate-400">
                Share your requirement and our survey team will prepare the right pricing,
                configuration, and technical specifications for your project.
              </DialogDescription>
            </DialogHeader>

            <div className="mb-3 flex items-center justify-between gap-3 rounded-2xl border border-slate-200/80 bg-slate-50 p-3.5 dark:border-slate-800 dark:bg-slate-900/60">
              <div className="flex min-w-0 items-center gap-2.5">
                <div className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-teal-100 text-teal-700 dark:bg-teal-950/80 dark:text-teal-400">
                  <Tag className="size-4" aria-hidden="true" />
                </div>
                <div className="min-w-0">
                  <span className="block font-mono text-[10px] font-semibold tracking-wider text-slate-400 uppercase dark:text-slate-500">
                    Selected Equipment
                  </span>
                  <p className="truncate text-xs font-semibold text-slate-900 sm:text-sm dark:text-slate-100">
                    {displayProductName}
                  </p>
                </div>
              </div>
              <Badge
                className={cn(
                  "shrink-0 border font-mono text-[10px]",
                  hasSelectedProducts
                    ? hasOutOfStockProduct
                      ? "border-amber-200 bg-amber-500/10 text-amber-700 dark:border-amber-800 dark:text-amber-400"
                      : "border-emerald-200 bg-emerald-500/10 text-emerald-700 dark:border-emerald-800 dark:text-emerald-400"
                    : "border-slate-200 bg-slate-500/10 text-slate-500 dark:border-slate-700 dark:text-slate-400",
                )}
              >
                {selectedStockLabel}
              </Badge>
            </div>

            <form className="space-y-3.5" noValidate onSubmit={handleSubmit}>
              <div aria-hidden="true" className="absolute left-[-10000px] size-px overflow-hidden">
                <label htmlFor="quote-website">Leave this field empty</label>
                <input
                  id="quote-website"
                  name="website"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                />
              </div>

              <div className="space-y-1.5">
                <Label
                  htmlFor={FIELD_IDS.productIds}
                  className="text-xs font-semibold tracking-wider text-slate-700 uppercase dark:text-slate-300"
                >
                  Products <span className="text-teal-600 dark:text-teal-400" aria-hidden="true">*</span>
                </Label>

                <ProductMultiSelect
                  id={FIELD_IDS.productIds}
                  options={availableProducts}
                  values={formData.productIds}
                  onChange={handleProductsChange}
                  loading={isProductsLoading && availableProducts.length === 0}
                  loadError={productsError}
                  onRetry={handleRetryProducts}
                  invalid={Boolean(errors.productIds)}
                  describedBy={
                    errors.productIds ? "quote-products-error" : undefined
                  }
                  placeholder="Select one or more products..."
                />

                {errors.productIds ? (
                  <p id="quote-products-error" className="text-xs text-rose-700 dark:text-rose-400">
                    {errors.productIds}
                  </p>
                ) : null}

                {productsError && availableProducts.length > 0 ? (
                  <p className="text-xs text-amber-700 dark:text-amber-400">
                    {productsError}
                  </p>
                ) : null}
              </div>

              <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label
                    htmlFor={FIELD_IDS.fullName}
                    className="text-xs font-semibold tracking-wider text-slate-700 uppercase dark:text-slate-300"
                  >
                    Full Name <span className="text-teal-600 dark:text-teal-400" aria-hidden="true">*</span>
                  </Label>
                  <Input
                    id={FIELD_IDS.fullName}
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    autoComplete="name"
                    placeholder="e.g. Ameet Niraula"
                    className={cn(inputClassName)}
                    aria-invalid={Boolean(errors.fullName)}
                    aria-describedby={errors.fullName ? "quote-fullName-error" : undefined}
                    required
                  />
                  {errors.fullName ? (
                    <p id="quote-fullName-error" className="text-xs text-rose-700 dark:text-rose-400">
                      {errors.fullName}
                    </p>
                  ) : null}
                </div>

                <div className="space-y-1.5">
                  <Label
                    htmlFor={FIELD_IDS.company}
                    className="text-xs font-semibold tracking-wider text-slate-700 uppercase dark:text-slate-300"
                  >
                    Company / Organization
                  </Label>
                  <Input
                    id={FIELD_IDS.company}
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    autoComplete="organization"
                    placeholder="e.g. GeoSAT Solutions"
                    className={cn(inputClassName)}
                    aria-invalid={Boolean(errors.company)}
                    aria-describedby={errors.company ? "quote-company-error" : undefined}
                  />
                  {errors.company ? (
                    <p id="quote-company-error" className="text-xs text-rose-700 dark:text-rose-400">
                      {errors.company}
                    </p>
                  ) : null}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label
                    htmlFor={FIELD_IDS.email}
                    className="text-xs font-semibold tracking-wider text-slate-700 uppercase dark:text-slate-300"
                  >
                    Email Address <span className="text-teal-600 dark:text-teal-400" aria-hidden="true">*</span>
                  </Label>
                  <Input
                    id={FIELD_IDS.email}
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    autoComplete="email"
                    placeholder="name@company.com"
                    className={cn(inputClassName)}
                    aria-invalid={Boolean(errors.email)}
                    aria-describedby={errors.email ? "quote-email-error" : undefined}
                    required
                  />
                  {errors.email ? (
                    <p id="quote-email-error" className="text-xs text-rose-700 dark:text-rose-400">
                      {errors.email}
                    </p>
                  ) : null}
                </div>

                <div className="space-y-1.5">
                  <Label
                    htmlFor={FIELD_IDS.phone}
                    className="text-xs font-semibold tracking-wider text-slate-700 uppercase dark:text-slate-300"
                  >
                    Phone Number <span className="text-teal-600 dark:text-teal-400" aria-hidden="true">*</span>
                  </Label>
                  <Input
                    id={FIELD_IDS.phone}
                    name="phone"
                    type="tel"
                    inputMode="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                    autoComplete="tel"
                    placeholder="+977 98XXXXXXXX"
                    className={cn(inputClassName)}
                    aria-invalid={Boolean(errors.phone)}
                    aria-describedby={errors.phone ? "quote-phone-error" : undefined}
                    required
                  />
                  {errors.phone ? (
                    <p id="quote-phone-error" className="text-xs text-rose-700 dark:text-rose-400">
                      {errors.phone}
                    </p>
                  ) : null}
                </div>
              </div>

              <div className="space-y-1.5">
                <Label
                  htmlFor={FIELD_IDS.projectDetails}
                  className="text-xs font-semibold tracking-wider text-slate-700 uppercase dark:text-slate-300"
                >
                  Project Details / Requirements <span className="text-teal-600 dark:text-teal-400" aria-hidden="true">*</span>
                </Label>
                <textarea
                  id={FIELD_IDS.projectDetails}
                  name="projectDetails"
                  rows={3}
                  maxLength={3000}
                  placeholder="Describe your survey scope, required accuracy, target location, or specific equipment accessories needed..."
                  value={formData.projectDetails}
                  onChange={handleInputChange}
                  aria-invalid={Boolean(errors.projectDetails)}
                  aria-describedby={errors.projectDetails ? "quote-projectDetails-error" : undefined}
                  required
                  className={cn(
                    "w-full resize-none rounded-xl border border-slate-200 bg-slate-50/50 p-3.5 text-sm text-slate-900 outline-none transition-all duration-200 placeholder:text-slate-400 focus:border-teal-600 focus:bg-white focus:ring-4 focus:ring-teal-500/10 aria-invalid:border-rose-500 aria-invalid:focus:border-rose-500 aria-invalid:focus:ring-rose-500/15 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 dark:focus:bg-slate-950",
                  )}
                />
                {errors.projectDetails ? (
                  <p id="quote-projectDetails-error" className="text-xs text-rose-700 dark:text-rose-400">
                    {errors.projectDetails}
                  </p>
                ) : null}
              </div>

              {submitError ? (
                <p
                  role="alert"
                  className="rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-3 font-sans text-sm text-rose-700 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-300"
                >
                  {submitError}
                </p>
              ) : null}

              <div className="pt-2">
                <Button
                  buttonProps={{ type: "submit", disabled: isSubmitting, "aria-busy": isSubmitting }}
                  className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-teal-600 text-sm font-semibold text-white shadow-lg shadow-teal-900/10 transition-all duration-200 hover:bg-teal-700 active:scale-[0.99]"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                      <span>Preparing Proposal...</span>
                    </>
                  ) : (
                    <>
                      <Send className="size-4" aria-hidden="true" />
                      <span>Send Quote Request</span>
                    </>
                  )}
                </Button>
              </div>

              <div className="flex items-center justify-center gap-1.5 pt-1 text-[11px] text-slate-400 dark:text-slate-500">
                <ShieldCheck className="size-3.5 text-teal-600" aria-hidden="true" />
                <span>Confidential. Response provided within 24 business hours.</span>
              </div>
            </form>
          </>
        ) : (
          <div className="space-y-4 px-2 py-8 text-center sm:px-4" role="status">
            <DialogHeader className="sr-only">
              <DialogTitle>Quote request sent</DialogTitle>
              <DialogDescription>Your quote request has been submitted successfully.</DialogDescription>
            </DialogHeader>

            <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 shadow-sm dark:bg-emerald-950/80 dark:text-emerald-400">
              <CheckCircle2 className="size-8" aria-hidden="true" />
            </div>

            <h3 className="font-heading text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Quote Request Sent!
            </h3>

            <p className="mx-auto max-w-sm font-sans text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              Thank you,{" "}
              <span className="font-semibold text-slate-900 dark:text-slate-200">
                {formData.fullName}
              </span>
              . Our technical survey team is preparing your official proposal for{" "}
              <span className="font-semibold text-teal-600">
                {formData.productNames.join(", ")}
              </span>
              .
            </p>

            <div className="pt-4">
              <Button
                buttonProps={{ type: "button", onClick: handleReset }}
                className="h-11 rounded-xl bg-slate-900 px-6 text-sm font-medium text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200"
              >
                Close Window
              </Button>
            </div>
          </div>
        )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

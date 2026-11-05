"use client"

import { useId, useState } from "react"
import {
  AlertCircle,
  Check,
  ChevronDown,
  Loader2,
  RefreshCw,
  X,
} from "lucide-react"

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import type { QuoteProductOption } from "@/lib/product-options"
import { cn } from "@/lib/utils"

type ProductMultiSelectProps = {
  id?: string
  options: QuoteProductOption[]
  values: string[]
  onChange: (values: string[]) => void
  placeholder?: string
  loading?: boolean
  loadError?: string
  onRetry?: () => void
  invalid?: boolean
  describedBy?: string
  className?: string
}

const triggerClassName =
  "relative flex min-h-11 w-full items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50/50 p-2 pr-10 text-left text-sm text-slate-900 shadow-xs outline-none transition-colors hover:bg-slate-100/80 focus-visible:border-teal-600 focus-visible:bg-white focus-visible:ring-4 focus-visible:ring-teal-500/10 aria-invalid:border-rose-500 aria-invalid:focus-visible:ring-rose-500/15 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-900/80 dark:focus-visible:bg-slate-950"

export function ProductMultiSelect({
  id,
  options,
  values,
  onChange,
  placeholder = "Select one or more products...",
  loading = false,
  loadError = "",
  onRetry,
  invalid = false,
  describedBy,
  className,
}: ProductMultiSelectProps) {
  const [open, setOpen] = useState(false)
  const listboxId = useId()

  function toggleProduct(productId: string) {
    if (values.includes(productId)) {
      onChange(values.filter((value) => value !== productId))
      return
    }

    onChange([...values, productId])
  }

  function removeProduct(productId: string) {
    onChange(values.filter((value) => value !== productId))
  }

  if (loading) {
    return (
      <div
        id={id}
        aria-busy="true"
        className={cn(
          triggerClassName,
          "pointer-events-none text-slate-500 dark:text-slate-400",
          className
        )}
      >
        <Loader2 className="size-4 animate-spin" aria-hidden="true" />
        <span>Loading products...</span>
      </div>
    )
  }

  if (options.length === 0) {
    return (
      <div className="space-y-2">
        <div
          id={id}
          aria-invalid={invalid}
          aria-describedby={describedBy}
          className="flex min-h-11 w-full items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3.5 text-sm text-rose-700 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-300"
        >
          <AlertCircle className="size-4 shrink-0" aria-hidden="true" />
          <span className="truncate">
            {loadError || "No products are available right now."}
          </span>
        </div>

        {onRetry ? (
          <button
            type="button"
            onClick={onRetry}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-700 transition-colors hover:text-teal-800 dark:text-teal-400 dark:hover:text-teal-300"
          >
            <RefreshCw className="size-3.5" aria-hidden="true" />
            Retry product loading
          </button>
        ) : null}
      </div>
    )
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        nativeButton={false}
        render={
          <div
            id={id}
            tabIndex={0}
            role="combobox"
            aria-expanded={open}
            aria-controls={listboxId}
            aria-haspopup="listbox"
            aria-invalid={invalid}
            aria-describedby={describedBy}
          />
        }
        className={cn(triggerClassName, "cursor-pointer", className)}
      >
        <span className="custom-scrollbar flex max-h-24 min-w-0 flex-1 flex-wrap content-start items-center gap-1.5 overflow-y-auto py-0.5 pr-0.5">
          {values.length === 0 ? (
            <span className="px-1.5 text-sm text-slate-400 dark:text-slate-500">
              {placeholder}
            </span>
          ) : (
            values.map((productId) => {
              const product = options.find((option) => option.id === productId);
              const label = product?.name ?? productId;

              return (
                <span
                  key={productId}
                  className="inline-flex max-w-full items-center gap-1 rounded-lg border border-teal-200 bg-teal-100 px-2.5 py-1 text-xs font-semibold text-teal-800 dark:border-teal-800 dark:bg-teal-950/70 dark:text-teal-200"
                >
                  <span className="truncate">{label}</span>
                  <button
                    type="button"
                    aria-label={`Remove ${label}`}
                    onClick={(event) => {
                      event.stopPropagation();
                      removeProduct(productId);
                    }}
                    onPointerDown={(event) => event.stopPropagation()}
                    className="ml-0.5 rounded-sm text-teal-700 transition-colors hover:text-teal-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500/40 dark:text-teal-300 dark:hover:text-teal-100"
                  >
                    <X className="size-3" aria-hidden="true" />
                  </button>
                </span>
              );
            })
          )}
        </span>

        <ChevronDown
          className="pointer-events-none absolute top-1/2 right-3.5 size-4 -translate-y-1/2 text-slate-400 dark:text-slate-500"
          aria-hidden="true"
        />
      </PopoverTrigger>

      <PopoverContent className="w-[var(--anchor-width)] p-1">
        <div
          id={listboxId}
          role="listbox"
          aria-multiselectable="true"
          className="max-h-60 space-y-1 overflow-y-auto"
        >
          {options.map((product) => {
            const isSelected = values.includes(product.id);

            return (
              <button
                key={product.id}
                type="button"
                role="option"
                aria-selected={isSelected}
                onClick={() => toggleProduct(product.id)}
                className={cn(
                  "flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-left text-sm transition-colors",
                  isSelected
                    ? "bg-teal-50 font-medium text-teal-900 dark:bg-teal-950/60 dark:text-teal-100"
                    : "text-slate-800 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-900"
                )}
              >
                <span className="flex min-w-0 items-center gap-2">
                  <span
                    className={cn(
                      "flex size-4 shrink-0 items-center justify-center rounded border",
                      isSelected
                        ? "border-teal-600 bg-teal-600 text-white dark:border-teal-500 dark:bg-teal-500"
                        : "border-slate-300 bg-white dark:border-slate-700 dark:bg-slate-950"
                    )}
                  >
                    {isSelected ? (
                      <Check className="size-3" aria-hidden="true" />
                    ) : null}
                  </span>
                  <span className="truncate">{product.name}</span>
                </span>
                <span className="shrink-0 font-mono text-[10px] uppercase tracking-wide text-slate-400 dark:text-slate-500">
                  {product.category}
                </span>
              </button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  )
}

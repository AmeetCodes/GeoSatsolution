"use client"

import * as React from "react"
import { Select as SelectPrimitive } from "@base-ui/react/select"
import { Check, ChevronDown, ChevronUp } from "lucide-react"

import { cn } from "@/lib/utils"

const Select = SelectPrimitive.Root

function SelectValue({
  className,
  ...props
}: SelectPrimitive.Value.Props) {
  return (
    <SelectPrimitive.Value
      data-slot="select-value"
      className={cn(
        "truncate data-placeholder:text-slate-400 dark:data-placeholder:text-slate-500",
        className
      )}
      {...props}
    />
  )
}

function SelectTrigger({
  className,
  children,
  ...props
}: SelectPrimitive.Trigger.Props) {
  return (
    <SelectPrimitive.Trigger
      data-slot="select-trigger"
      className={cn(
        "flex h-11 w-full min-w-0 items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 text-left text-sm text-slate-900 outline-none transition-all duration-200 select-none hover:bg-slate-50 focus-visible:border-teal-600 focus-visible:bg-white focus-visible:ring-4 focus-visible:ring-teal-500/10 aria-invalid:border-rose-500 aria-invalid:focus-visible:border-rose-500 aria-invalid:focus-visible:ring-rose-500/15 data-disabled:cursor-not-allowed data-disabled:opacity-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-900 dark:focus-visible:bg-slate-950",
        className
      )}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon className="shrink-0 text-slate-400 transition-transform duration-200 data-open:rotate-180 dark:text-slate-500">
        <ChevronDown className="size-4" aria-hidden="true" />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  )
}

function SelectContent({
  className,
  children,
  sideOffset = 6,
  ...props
}: SelectPrimitive.Popup.Props & {
  sideOffset?: number
}) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Positioner
        sideOffset={sideOffset}
        alignItemWithTrigger={false}
        className="z-[70] outline-none select-none"
      >
        <SelectPrimitive.Popup
          data-slot="select-content"
          className={cn(
            "min-w-[var(--anchor-width)] origin-[var(--transform-origin)] rounded-xl border border-slate-200 bg-white p-1 text-slate-900 shadow-xl shadow-slate-900/10 outline-none transition-[transform,opacity] duration-100 data-ending-style:scale-[0.98] data-ending-style:opacity-0 data-starting-style:scale-[0.98] data-starting-style:opacity-0 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:shadow-black/40",
            className
          )}
          {...props}
        >
          <SelectPrimitive.ScrollUpArrow className="flex h-5 w-full cursor-default items-center justify-center bg-white text-slate-400 dark:bg-slate-950 dark:text-slate-500">
            <ChevronUp className="size-3.5" aria-hidden="true" />
          </SelectPrimitive.ScrollUpArrow>
          <SelectPrimitive.List className="max-h-[min(18rem,var(--available-height))] scroll-py-4 overflow-y-auto">
            {children}
          </SelectPrimitive.List>
          <SelectPrimitive.ScrollDownArrow className="flex h-5 w-full cursor-default items-center justify-center bg-white text-slate-400 dark:bg-slate-950 dark:text-slate-500">
            <ChevronDown className="size-3.5" aria-hidden="true" />
          </SelectPrimitive.ScrollDownArrow>
        </SelectPrimitive.Popup>
      </SelectPrimitive.Positioner>
    </SelectPrimitive.Portal>
  )
}

function SelectItem({
  className,
  children,
  ...props
}: SelectPrimitive.Item.Props) {
  return (
    <SelectPrimitive.Item
      data-slot="select-item"
      className={cn(
        "relative grid w-full cursor-default grid-cols-[1rem_1fr] items-center gap-2 rounded-lg py-2 pr-3 pl-2 text-sm outline-none select-none data-disabled:pointer-events-none data-disabled:opacity-50 data-highlighted:bg-teal-50 data-highlighted:text-teal-900 data-selected:font-semibold dark:data-highlighted:bg-teal-950/60 dark:data-highlighted:text-teal-100",
        className
      )}
      {...props}
    >
      <SelectPrimitive.ItemIndicator className="col-start-1 flex items-center justify-center text-teal-600 dark:text-teal-400">
        <Check className="size-3.5" aria-hidden="true" />
      </SelectPrimitive.ItemIndicator>
      <SelectPrimitive.ItemText className="col-start-2 min-w-0">
        {children}
      </SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  )
}

export {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
}

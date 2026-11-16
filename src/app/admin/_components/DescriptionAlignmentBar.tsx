"use client";

import { AlignJustify, AlignLeft } from "lucide-react";
import type { DescriptionAlignment } from "@/lib/description-alignment";

interface DescriptionAlignmentBarProps {
  value: DescriptionAlignment;
  onChange: (value: DescriptionAlignment) => void;
}

const OPTIONS: {
  value: DescriptionAlignment;
  label: string;
  icon: typeof AlignJustify;
}[] = [
  { value: "justify", label: "Justify", icon: AlignJustify },
  { value: "left", label: "Left align", icon: AlignLeft },
];

export function DescriptionAlignmentBar({
  value,
  onChange,
}: DescriptionAlignmentBarProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
      <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
        Text alignment
      </span>
      <div
        className="inline-flex rounded-md border border-slate-200 bg-white p-0.5"
        role="group"
        aria-label="Full technical description alignment"
      >
        {OPTIONS.map((option) => {
          const Icon = option.icon;
          const active = value === option.value;
          return (
            <button
              key={option.value}
              type="button"
              aria-pressed={active}
              onClick={() => onChange(option.value)}
              className={`inline-flex items-center gap-1.5 rounded px-2.5 py-1 text-[11px] font-semibold transition-colors ${
                active
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <Icon className="size-3.5" aria-hidden="true" />
              {option.label}
            </button>
          );
        })}
      </div>
      <span className="text-[11px] text-slate-500">
        {value === "justify" ? "Word-style justified" : "Straight left edge"}
      </span>
    </div>
  );
}

import { Box, Building2, Globe, Layers } from "lucide-react";

export function SectionBadge({ tabId, label }: { tabId: string; label: string }) {
  const Icon =
    tabId === "products"
      ? Box
      : tabId === "industries"
        ? Globe
        : tabId === "company"
          ? Building2
          : Layers;

  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-aqua/30 bg-aqua/10 px-3 py-1 font-heading text-xs font-medium uppercase tracking-wider text-teal-600">
      <Icon className="size-3.5" />
      <span>{label}</span>
    </div>
  );
}

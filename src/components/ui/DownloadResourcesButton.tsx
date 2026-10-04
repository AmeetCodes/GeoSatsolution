"use client";

import { useRouter } from "next/navigation";
import { PopButton } from "@/components/ui/pop-button";
import { cn } from "@/lib/utils";

const DEFAULT_RESOURCES_HREF = "/company/insights/downloads-technical-resources";

type DownloadResourcesButtonProps = Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  "onClick"
> & {
  href?: string;
  label?: string;
};

export function DownloadResourcesButton({
  href = DEFAULT_RESOURCES_HREF,
  label = "Download Resources",
  className,
  type = "button",
  ...buttonProps
}: DownloadResourcesButtonProps) {
  const router = useRouter();

  return (
    <PopButton
      {...buttonProps}
      type={type}
      className={cn("px-6 py-3 text-xs sm:px-7 sm:py-3.5 sm:text-sm", className)}
      onClick={() => router.push(href)}
    >
      {label}
    </PopButton>
  );
}

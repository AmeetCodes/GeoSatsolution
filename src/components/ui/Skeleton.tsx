import { cn } from "@/lib/utils";

/** Base shimmering block. Server-safe; reduced-motion handled globally in globals.css. */
export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn("animate-pulse rounded-md bg-line-strong/50", className)}
    />
  );
}

export function SkeletonText({
  lines = 3,
  className,
  lineClassName,
}: {
  lines?: number;
  className?: string;
  lineClassName?: string;
}) {
  return (
    <div className={cn("space-y-2.5", className)} aria-hidden="true">
      {Array.from({ length: lines }).map((_, index) => (
        <Skeleton
          key={index}
          className={cn(
            "h-4 w-full",
            index === lines - 1 && "w-2/3",
            lineClassName,
          )}
        />
      ))}
    </div>
  );
}

/** Matches the shared page `header` block used across list routes. */
export function PageHeaderSkeleton({ className }: { className?: string }) {
  return (
    <header className={cn("max-w-3xl", className)}>
      <Skeleton className="h-3 w-28" />
      <Skeleton className="mt-5 h-10 w-full max-w-2xl sm:h-12" />
      <Skeleton className="mt-3 h-10 w-4/5 max-w-xl sm:h-12" />
      <div className="mt-5 space-y-2.5">
        <Skeleton className="h-4 w-full max-w-2xl" />
        <Skeleton className="h-4 w-3/4 max-w-xl" />
      </div>
    </header>
  );
}

const GRID_COLUMNS: Record<number, string> = {
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-2 lg:grid-cols-3",
  4: "sm:grid-cols-2 lg:grid-cols-4",
};

export function CardSkeleton({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "flex flex-col rounded-[var(--radius-panel)] border border-line bg-panel/20 p-6",
        className,
      )}
    >
      <Skeleton className="h-3 w-24" />
      <Skeleton className="mt-4 h-6 w-3/4" />
      <div className="mt-4 space-y-2.5">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
      </div>
      <Skeleton className="mt-6 h-9 w-full rounded-lg" />
    </div>
  );
}

export function CardGridSkeleton({
  count = 6,
  columns = 3,
  className,
}: {
  count?: number;
  columns?: number;
  className?: string;
}) {
  return (
    <div
      className={cn("grid gap-6", GRID_COLUMNS[columns] ?? GRID_COLUMNS[3], className)}
      aria-hidden="true"
    >
      {Array.from({ length: count }).map((_, index) => (
        <CardSkeleton key={index} />
      ))}
    </div>
  );
}

/** Products catalog: category tabs + subcategory tiles + product grid. */
export function CatalogSkeleton() {
  return (
    <div className="mt-6 space-y-12" aria-hidden="true">
      <div className="flex flex-wrap gap-2.5 border-b border-slate-100 pb-6">
        {Array.from({ length: 5 }).map((_, index) => (
          <Skeleton key={index} className="h-10 w-28 rounded-xl" />
        ))}
      </div>

      <div className="space-y-4">
        <Skeleton className="h-4 w-64" />
        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <Skeleton key={index} className="h-16 rounded-xl" />
          ))}
        </div>
      </div>

      <div className="space-y-6 pt-4">
        <Skeleton className="h-8 w-72" />
        <CardGridSkeleton count={8} columns={4} />
      </div>
    </div>
  );
}

/** Two-column detail layout: back link, hero copy, media gallery, outcomes. */
export function DetailSkeleton() {
  return (
    <div aria-hidden="true">
      <Skeleton className="h-5 w-32" />

      <div className="grid grid-cols-1 items-start gap-8 pt-8 pb-12 lg:grid-cols-12 lg:gap-12 lg:pt-12 lg:pb-20">
        <div className="max-w-2xl lg:col-span-5 lg:max-w-none">
          <Skeleton className="h-6 w-48 rounded-full" />
          <Skeleton className="mt-6 h-11 w-full" />
          <Skeleton className="mt-3 h-11 w-3/4" />
          <div className="mt-6 space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
          <div className="mt-8 flex gap-4">
            <Skeleton className="h-12 w-44 rounded-full" />
            <Skeleton className="h-12 w-40 rounded-full" />
          </div>
        </div>

        <Skeleton className="aspect-[4/3] min-h-[420px] w-full rounded-3xl lg:col-span-7 lg:min-h-[500px] xl:min-h-[560px]" />
      </div>

      <div className="grid gap-8 border-t border-slate-100 py-16 md:grid-cols-[0.7fr_1.3fr] md:gap-12 lg:py-24 lg:gap-16">
        <div>
          <Skeleton className="h-3 w-32" />
          <Skeleton className="mt-4 h-8 w-full" />
          <Skeleton className="mt-2 h-8 w-2/3" />
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-16" />
          ))}
        </div>
      </div>
    </div>
  );
}

/** Long-form news article. */
export function ArticleSkeleton() {
  return (
    <div aria-hidden="true">
      <Skeleton className="h-5 w-32" />
      <div className="mt-8 rounded-[var(--radius-panel)] border border-line bg-panel/30 p-6 sm:p-8">
        <div className="flex gap-4">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-4 w-28" />
        </div>
        <Skeleton className="mt-6 h-11 w-full" />
        <Skeleton className="mt-3 h-11 w-4/5" />
        <Skeleton className="mt-6 h-5 w-full" />
        <Skeleton className="mt-2 h-5 w-3/4" />
        <div className="mt-8 space-y-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="h-4 w-full" />
          ))}
        </div>
      </div>
    </div>
  );
}

/** Media galleries (news, downloads, leadership, partners, projects). */
export function GallerySkeleton({
  tiles = 6,
  height = "h-[420px]",
}: {
  tiles?: number;
  height?: string;
}) {
  return (
    <div className={cn("grid gap-3 sm:grid-cols-2 lg:grid-cols-3", height)} aria-hidden="true">
      {Array.from({ length: tiles }).map((_, index) => (
        <Skeleton key={index} className="h-full min-h-40 w-full rounded-2xl" />
      ))}
    </div>
  );
}

export default Skeleton;

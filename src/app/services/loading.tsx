import { LoadingShell } from "@/components/layout/LoadingShell";
import { CardGridSkeleton, PageHeaderSkeleton, Skeleton } from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <LoadingShell>
      <PageHeaderSkeleton />
      <div className="mt-16 space-y-16">
        {[0, 1].map((group) => (
          <div key={group} className="space-y-6">
            <div className="flex items-center gap-3 border-b border-line pb-4">
              <Skeleton className="h-8 w-52" />
              <Skeleton className="h-6 w-24 rounded-full" />
            </div>
            <CardGridSkeleton count={3} columns={3} />
          </div>
        ))}
      </div>
    </LoadingShell>
  );
}

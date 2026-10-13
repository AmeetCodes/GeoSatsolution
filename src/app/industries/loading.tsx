import { LoadingShell } from "@/components/layout/LoadingShell";
import { PageHeaderSkeleton, Skeleton } from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <LoadingShell>
      <PageHeaderSkeleton className="mb-10 sm:mb-14" />
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <Skeleton key={index} className="min-h-[270px] rounded-2xl sm:min-h-[290px]" />
        ))}
      </div>
    </LoadingShell>
  );
}

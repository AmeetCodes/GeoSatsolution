import { LoadingShell } from "@/components/layout/LoadingShell";
import { Skeleton } from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <LoadingShell className="flex-1">
      <div className="max-w-3xl">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="mt-4 h-14 w-full max-w-lg" />
      </div>
      <div className="mt-12">
        <Skeleton className="h-[452px] w-full rounded-[18px]" />
      </div>
    </LoadingShell>
  );
}

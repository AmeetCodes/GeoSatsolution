import { LoadingShell } from "@/components/layout/LoadingShell";
import { GallerySkeleton, PageHeaderSkeleton } from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <LoadingShell>
      <PageHeaderSkeleton />
      <div className="mt-10">
        <GallerySkeleton tiles={6} height="h-[520px]" />
      </div>
    </LoadingShell>
  );
}

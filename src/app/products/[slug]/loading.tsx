import { LoadingShell } from "@/components/layout/LoadingShell";
import { CatalogSkeleton, PageHeaderSkeleton } from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <LoadingShell>
      <PageHeaderSkeleton />
      <CatalogSkeleton />
    </LoadingShell>
  );
}

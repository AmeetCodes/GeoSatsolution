import { LoadingShell } from "@/components/layout/LoadingShell";
import { DetailSkeleton } from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <LoadingShell>
      <DetailSkeleton />
    </LoadingShell>
  );
}

import { LoadingShell } from "@/components/layout/LoadingShell";
import { ArticleSkeleton } from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <LoadingShell containerClassName="max-w-4xl">
      <ArticleSkeleton />
    </LoadingShell>
  );
}

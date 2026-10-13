import { LoadingShell } from "@/components/layout/LoadingShell";
import { GallerySkeleton, Skeleton } from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <LoadingShell containerClassName="max-w-[1600px] px-4 sm:px-8 lg:px-12">
      <Skeleton className="h-5 w-40" />
      <header className="mb-3 mt-7 max-w-3xl">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="mt-4 h-11 w-72" />
        <Skeleton className="mt-4 h-5 w-full max-w-xl" />
      </header>
      <GallerySkeleton tiles={9} height="h-[60vh] min-h-[420px]" />
    </LoadingShell>
  );
}

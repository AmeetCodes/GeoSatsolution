import { LoadingShell } from "@/components/layout/LoadingShell";
import { Skeleton } from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <LoadingShell
      className="bg-[#f8faf9] pb-16 pt-24 sm:pt-28"
      containerClassName="max-w-7xl px-4 pt-6 sm:px-6 lg:px-10"
    >
      <Skeleton className="h-[min(760px,calc(100dvh-8rem))] min-h-[560px] w-full rounded-3xl" />
    </LoadingShell>
  );
}

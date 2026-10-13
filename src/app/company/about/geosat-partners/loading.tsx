import { LoadingShell } from "@/components/layout/LoadingShell";
import { GallerySkeleton, PageHeaderSkeleton, Skeleton } from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <LoadingShell
      className="bg-[#f4f7f6] pb-20 pt-28"
      containerClassName="max-w-[1500px] px-4 sm:px-6 lg:px-10"
    >
      <PageHeaderSkeleton className="mb-14" />
      {[0, 1].map((section) => (
        <section key={section} className="mb-16">
          <div className="mb-6 space-y-2">
            <Skeleton className="h-3 w-28" />
            <Skeleton className="h-8 w-64" />
          </div>
          <GallerySkeleton tiles={6} height="h-[440px]" />
        </section>
      ))}
    </LoadingShell>
  );
}

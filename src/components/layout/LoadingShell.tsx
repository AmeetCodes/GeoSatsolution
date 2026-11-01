import type { ReactNode } from "react";
import { Footer } from "./Footer";
import { Navbar } from "./Navbar";
import { cn } from "@/lib/utils";

/**
 * Shared chrome for route-level `loading.tsx` skeletons so the fixed navbar and
 * footer stay in place while the segment streams in — no layout jump.
 */
export function LoadingShell({
  children,
  className,
  containerClassName,
}: {
  children: ReactNode;
  className?: string;
  containerClassName?: string;
}) {
  return (
    <>
      <Navbar />
      <main
        className={cn(
          "min-h-screen bg-abyss pb-20 pt-[calc(var(--nav-h)+2rem)] sm:pt-[calc(var(--nav-h)+3.5rem)]",
          className,
        )}
      >
        <div className={cn("mx-auto w-full max-w-[1440px] px-4 sm:px-6 lg:px-10 xl:px-12", containerClassName)}>
          {children}
        </div>
      </main>
      <Footer />
    </>
  );
}

export default LoadingShell;

"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RotateCcw } from "lucide-react";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { Container } from "@/components/ui/Section";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Route error boundary:", error);
  }, [error]);

  return (
    <>
      <Navbar />
      <main className="relative min-h-screen overflow-hidden bg-abyss pb-24 pt-[calc(var(--nav-h)+2rem)] sm:pt-[calc(var(--nav-h)+3.5rem)]">
        <div className="pointer-events-none absolute inset-0 blueprint opacity-50" aria-hidden="true" />

        <Container className="relative">
          <div className="max-w-2xl">
            <p className="label text-aqua">Something went wrong</p>
            <span className="mt-6 flex size-14 items-center justify-center rounded-2xl border border-line bg-panel/40 text-aqua">
              <AlertTriangle className="size-6" aria-hidden="true" />
            </span>
            <h1 className="mt-6 font-display text-3xl leading-tight text-ink sm:text-4xl">
              We hit an unexpected fault loading this page.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-ink-3">
              The rest of the site is unaffected. Try reloading this section, or head
              back to a stable page and continue from there.
            </p>

            {error.digest ? (
              <p className="mt-4 font-mono text-xs text-ink-4">Reference: {error.digest}</p>
            ) : null}

            <div className="mt-9 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={reset}
                className="inline-flex h-12 items-center gap-2 rounded-full bg-aqua px-6 text-sm font-medium text-white transition-colors hover:bg-aqua-bright focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-aqua"
              >
                <RotateCcw className="size-4" aria-hidden="true" />
                Try again
              </button>
              <Link
                href="/"
                className="inline-flex h-12 items-center gap-2 rounded-full border border-line-strong px-6 text-sm font-medium text-ink transition-colors hover:border-aqua/50 hover:text-aqua focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-aqua"
              >
                Back to home
              </Link>
            </div>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}

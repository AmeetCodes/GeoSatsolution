import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/Reveal";
import { CREDENTIALS, HERO } from "@/lib/content";
import { Globe3DDemo } from "@/components/3d-globe-demo";

import Text3DFlip from "@/components/ui/text-3d-flip";


export function Hero() {
  return (
    <section id="top" className="relative isolate overflow-hidden pt-[var(--nav-h)]">
      {/* Engineering grid, faded out toward the bottom of the viewport. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 blueprint [mask-image:linear-gradient(to_bottom,black,transparent_78%)]"
      />

      <div className="relative mx-auto flex min-h-[calc(100vh-var(--nav-h))] w-full max-w-[1440px] flex-col justify-center px-6 py-8 sm:px-8 md:px-10 lg:px-12 lg:py-12">
        <div className="grid w-full grid-cols-1 items-center justify-between gap-8 lg:grid-cols-12 lg:gap-12">
          {/* Text column */}
          <div className="flex flex-col items-start justify-center text-left lg:col-span-6">
            {/* Eyebrow Label */}
            <Reveal>
              <p className="label mb-4 inline-flex items-center gap-2.5 text-xs font-bold tracking-widest text-slate-500 uppercase sm:text-sm">
                <span
                  aria-hidden="true"
                  className="size-1.5 rounded-full bg-[#16264A] [animation:pulse-dot_2.6s_ease-in-out_infinite]"
                />
                {HERO.eyebrow}
              </p>
            </Reveal>

            <Reveal delay={0.06}>
              <h1 className="font-['Mona_Sans',sans-serif] text-4xl leading-[1.05] font-bold tracking-tight text-slate-900 sm:text-5xl md:text-6xl lg:text-7xl">
                <span className="block">
                  <Text3DFlip
                    className="bg-transparent"
                    textClassName="text-slate-900"
                    flipTextClassName="text-slate-900"
                    rotateDirection="top"
                  >
                    Precision
                  </Text3DFlip>
                </span>

                <span className="block">
                  <Text3DFlip
                    className="bg-transparent"
                    textClassName="text-slate-900"
                    flipTextClassName="text-slate-900"
                    rotateDirection="top"
                  >
                    you can
                  </Text3DFlip>
                </span>

                <span className="block">
                  <Text3DFlip
                    className="bg-transparent"
                    textClassName="text-[#85856F]"
                    flipTextClassName="text-[#85856F]"
                    rotateDirection="top"
                  >
                    build on.
                  </Text3DFlip>
                </span>
              </h1>
            </Reveal>

            <p className="mt-6 mb-8 max-w-2xl font-['Roboto',sans-serif] text-base leading-relaxed text-slate-600 md:text-lg lg:text-xl">
              We equip surveying professionals with{" "}
              <span className="font-medium underline decoration-[#FF9800] decoration-2 underline-offset-4">
                enterprise-grade positioning hardware
              </span>
              ,{" "}
              <span className="font-medium underline decoration-[#FF9800] decoration-2 underline-offset-4">
                real-time GIS monitoring
              </span>
              , and ISO-certified instruments to{" "}
              <span className="my-0.5 inline-block rounded-md bg-[#E0F2FE] px-2 py-0.5 font-medium text-[#0369A1]">
                guarantee millimeter precision
              </span>{" "}
              on every job site.
            </p>

            {/* CTA Buttons */}
            <Reveal delay={0.18}>
              <div className="flex flex-wrap items-center gap-4">
                <Button
                  href="/request-assessment"
                  size="lg"
                  trailingIcon
                  className="h-auto rounded-full px-6 py-3.5 text-base font-semibold"
                >
                  {HERO.primaryCta}
                </Button>
                <Button
                  href="/solutions"
                  variant="secondary"
                  size="lg"
                  className="h-auto rounded-full px-6 py-3.5 text-base font-semibold"
                >
                  {HERO.secondaryCta}
                </Button>
              </div>
            </Reveal>

            {/* Trust Badges */}
            <Reveal delay={0.24}>
              <ul className="mt-8 flex flex-wrap gap-6 border-t border-slate-100 pt-6 text-xs font-medium text-slate-500 md:text-sm">
                {CREDENTIALS.map((credential) => (
                  <li key={credential}>{credential}</li>
                ))}
              </ul>
            </Reveal>

            {/* Secondary link */}
            <Reveal className="mt-5" delay={0.3}>
              <Link
                href="/request-assessment"
                className="group inline-flex items-center gap-2 py-1.5 text-xs text-slate-500 transition-colors duration-200 hover:text-slate-900"
              >
                <ArrowRight
                  className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
                Request an assessment
              </Link>
            </Reveal>
          </div>

          {/* Globe column */}
          <div className="flex items-center justify-center lg:col-span-6 lg:justify-end">
            <Globe3DDemo />
          </div>
        </div>
      </div>
    </section>
  );
}

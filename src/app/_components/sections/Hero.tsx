import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/Reveal";
import { CREDENTIALS, HERO } from "@/lib/content";
import { Globe3DDemo } from "@/components/3d-globe-demo";

import Text3DFlip from "@/components/ui/text-3d-flip";


export function Hero() {
  return (
    <section id="top" className="relative isolate overflow-hidden bg-white pt-[var(--nav-h)]">
      <div className="mx-auto flex min-h-[calc(100svh-var(--nav-h))] w-full max-w-[1680px] flex-col justify-center px-6 py-8 sm:px-8 md:px-10 lg:px-10 lg:py-10">
        <div className="grid w-full grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-8 xl:gap-10">
          {/* Text column */}
          <div className="flex flex-col items-start justify-center text-left">
            {/* Eyebrow Label */}
            <Reveal>
              <p className="label mb-5 inline-flex flex-wrap items-center gap-x-3 gap-y-1 text-sm font-bold tracking-[0.1em] text-slate-600 uppercase sm:text-base sm:tracking-[0.16em]">
                <span
                  aria-hidden="true"
                  className="size-2 rounded-full bg-[#16264A] [animation:pulse-dot_2.6s_ease-in-out_infinite]"
                />
                {HERO.eyebrow}
              </p>
            </Reveal>

            <Reveal delay={0.06}>
              <h1 className="font-['Mona_Sans',sans-serif] text-5xl leading-[0.98] font-extrabold tracking-[-0.055em] text-slate-900 sm:text-6xl md:text-7xl lg:text-7xl xl:text-[5.25rem] 2xl:text-8xl">
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

            <p className="mt-7 mb-9 max-w-2xl font-['Roboto',sans-serif] text-lg leading-[1.65] text-slate-600 md:text-xl xl:text-[1.35rem]">
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
                  className="h-auto rounded-full px-7 py-4 text-base font-semibold sm:text-lg"
                >
                  {HERO.primaryCta}
                </Button>
                <Button
                  href="/services"
                  variant="secondary"
                  size="lg"
                  className="h-auto rounded-full border border-slate-300 bg-white px-7 py-4 text-base font-semibold text-slate-800 shadow-sm hover:border-slate-400 hover:bg-slate-50 sm:text-lg"
                >
                  {HERO.secondaryCta}
                </Button>
              </div>
            </Reveal>

            {/* Trust Badges */}
            <Reveal delay={0.24}>
              <ul className="mt-9 flex max-w-3xl flex-wrap gap-x-7 gap-y-3 border-t border-slate-200 pt-6 text-sm font-medium text-slate-600 md:text-base">
                {CREDENTIALS.map((credential) => (
                  <li key={credential}>{credential}</li>
                ))}
              </ul>
            </Reveal>

            {/* Secondary link */}
            <Reveal className="mt-5" delay={0.3}>
              <Link
                href="/request-assessment"
                className="group inline-flex items-center gap-2 py-2 text-sm text-slate-600 transition-colors duration-200 hover:text-slate-900 sm:text-base"
              >
                <ArrowRight
                  className="size-4 transition-transform duration-300 group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
                Request an assessment
              </Link>
            </Reveal>
          </div>

          {/* Globe column */}
          <div className="flex items-center justify-center lg:justify-end">
            <Globe3DDemo />
          </div>
        </div>
      </div>
    </section>
  );
}

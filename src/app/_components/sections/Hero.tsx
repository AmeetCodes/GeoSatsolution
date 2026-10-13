import { ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { CREDENTIALS, HERO } from "@/lib/content";
import { Globe3DDemo } from "@/components/3d-globe-demo";
import { Highlighter } from "@/components/ui/highlighter"

import Text3DFlip from "@/components/ui/text-3d-flip";


export function Hero() {
  return (
 <section
  id="top"
  className="relative isolate flex min-h-[calc(100svh-var(--nav-h))] flex-col overflow-hidden pt-[calc(var(--nav-h)+2rem)]"
>
  {/* Engineering grid, faded out toward the bottom of the viewport. */}
  <div
    aria-hidden="true"
    className="pointer-events-none absolute inset-0 blueprint [mask-image:linear-gradient(to_bottom,black,transparent_78%)]"
  />

  <div className="pointer-events-none absolute inset-y-0 right-[-4%] z-0 hidden w-[60vw] items-center justify-center lg:flex">
    <div className="w-full max-w-6xl [&_canvas]:!pointer-events-auto">
      <Globe3DDemo />
    </div>
  </div>

  <Container className="relative flex flex-1 flex-col pb-12">
    <div className="flex flex-1 flex-col justify-center max-w-[36rem] lg:max-w-[35rem]">
      {/* Eyebrow Label */}
      <Reveal>
        <p className="label inline-flex items-center gap-2.5 text-[#16264A]">
          <span
            aria-hidden="true"
            className="size-1.5 rounded-full bg-[#16264A] [animation:pulse-dot_2.6s_ease-in-out_infinite]"
          />
          {HERO.eyebrow}
        </p>
      </Reveal>

      <Reveal delay={0.06}>
  <h1 className="font-['Mona_Sans',sans-serif] text-[34px] md:text-[70px] lg:text-[86px] font-[800] leading-[1.06] tracking-tight border-0 border-none">
    <span className="block">
      <Text3DFlip
        className="bg-transparent"
        textClassName="text-[#0d1117]"
        flipTextClassName="text-[#0d1117]"
        rotateDirection="top"
      >
        Precision
      </Text3DFlip>
    </span>

    <span className="block">
      <Text3DFlip
        className="bg-transparent"
        textClassName="text-[#0d1117]"
        flipTextClassName="text-[#0d1117]"
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

<p className="font-['Roboto',sans-serif] text-slate-900 text-lg sm:text-xl font-normal leading-relaxed mt-6 max-w-xl">
  We equip surveying professionals with{" "}
  <span className="underline decoration-[#FF9800] decoration-2 underline-offset-4 font-medium">
    enterprise-grade positioning hardware
  </span>
  ,{" "}
  <span className="underline decoration-[#FF9800] decoration-2 underline-offset-4 font-medium">
    real-time GIS monitoring
  </span>
  , and ISO-certified instruments to{" "}
  <span className="bg-[#E0F2FE] text-[#0369A1] px-2 py-0.5 rounded-md font-medium inline-block my-0.5">
    guarantee millimeter precision
  </span>{" "}
  on every job site.
</p>      {/* CTA Buttons */}
      <Reveal delay={0.18}>
        <div className="mt-9 flex flex-wrap items-center gap-3">
          <Button href="#contact" size="lg" trailingIcon>
            {HERO.primaryCta}
          </Button>
          <Button href="/solutions" variant="secondary" size="lg">
            {HERO.secondaryCta}
          </Button>
        </div>
      </Reveal>

      {/* Credentials List */}
      <Reveal delay={0.24}>
        <ul className="mt-10 flex flex-wrap gap-x-5 gap-y-2">
          {CREDENTIALS.map((credential) => (
            <li key={credential} className="text-xs text-[#16264A]">
              {credential}
            </li>
          ))}
        </ul>
      </Reveal>
    </div>

    {/* Scroll Link */}
    <Reveal className="mt-8" delay={0.3}>
      <a
        href="#contact"
        className="group inline-flex items-center gap-2 py-1.5 text-xs text-[#16264A] transition-colors duration-200 hover:opacity-80"
      >
        <ArrowDown
          className="size-3.5 transition-transform duration-300 group-hover:translate-y-0.5"
          aria-hidden="true"
        />
        Scroll to contact
      </a>
    </Reveal>
  </Container>
</section>
  );
}

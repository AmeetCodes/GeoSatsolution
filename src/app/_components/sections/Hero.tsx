import { ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Section";
import { Reveal, RevealItem } from "@/components/ui/Reveal";
import { HeroGlobe } from "../three/HeroGlobe";
import { CREDENTIALS, HERO } from "@/lib/content";
import { cn } from "@/lib/utils";

/** Reference configuration for the instrument panel beside the globe. */
const SENSOR_PROFILE = [
  { key: "Platform", value: "UAV LiDAR" },
  { key: "Datum", value: "WGS 84 · UTM" },
  { key: "Density", value: "18 pts/m²" },
  { key: "Vertical RMSE", value: "±2 cm" },
  { key: "Output", value: "LAS · LAZ · DTM" },
];

function SensorProfile() {
  return (
    <div className="glass w-[15.5rem] rounded-[var(--radius-card)] p-4">
      <div className="flex items-center justify-between">
        <p className="label">Reference config</p>
        <span className="size-1.5 rounded-full bg-aqua shadow-[0_0_8px_rgba(60,227,214,0.9)]" />
      </div>
      <dl className="mt-4 space-y-2.5">
        {SENSOR_PROFILE.map((row) => (
          <div key={row.key} className="flex items-baseline justify-between gap-4">
            <dt className="text-[0.6875rem] text-ink-3">{row.key}</dt>
            <dd className="font-mono text-[0.6875rem] text-ink tabular">{row.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

export function Hero() {
  return (
    <section
      id="top"
      className="relative isolate min-h-[100svh] overflow-hidden pb-16 pt-[calc(var(--nav-h)+2.5rem)] sm:pt-[calc(var(--nav-h)+3.5rem)]"
    >
      {/* Engineering grid, faded out toward the bottom of the viewport. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 blueprint [mask-image:linear-gradient(to_bottom,black,transparent_78%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[38rem] bg-[radial-gradient(ellipse_60%_100%_at_78%_22%,rgba(60,227,214,0.09),transparent_70%)]"
      />

      {/*
        One globe, repositioned at the lg breakpoint. Rendering two instances
        would spin up a second WebGL context and leave a zero-sized canvas
        burning a render loop.
      */}
      <HeroGlobe className="left-1/2 top-[2%] h-[62svh] w-[155vw] max-w-none -translate-x-1/2 opacity-60 [mask-image:radial-gradient(ellipse_46%_50%_at_50%_46%,black,transparent_72%)] lg:left-auto lg:right-[-13%] lg:top-1/2 lg:h-[min(92svh,52rem)] lg:w-[min(58vw,52rem)] lg:-translate-x-0 lg:-translate-y-1/2 lg:opacity-100 lg:[mask-image:none] xl:right-[-9%]" />

      <div className="pointer-events-none absolute bottom-[19%] right-[6%] z-10 hidden xl:block">
        <SensorProfile />
      </div>

      <Container className="relative flex min-h-[calc(100svh-var(--nav-h)-6rem)] flex-col justify-center">
        <div className="max-w-[36rem] lg:max-w-[34rem]">
          <Reveal>
            <p className="label inline-flex items-center gap-2.5 text-aqua/80">
              <span
                aria-hidden="true"
                className="size-1.5 rounded-full bg-aqua [animation:pulse-dot_2.6s_ease-in-out_infinite]"
              />
              {HERO.eyebrow}
            </p>
          </Reveal>

          <Reveal delay={0.06}>
            <h1 className="mt-7 text-[clamp(2.75rem,8.4vw,4.75rem)] font-medium leading-[0.96] tracking-[-0.04em]">
              <span className="block text-ink">Precision you can</span>
              <span className="mt-1 block text-gradient-aqua">build on.</span>
            </h1>
          </Reveal>

          <Reveal delay={0.12}>
            <p className="mt-7 max-w-[34rem] text-[1.0625rem] leading-relaxed text-ink-2">
              {HERO.sub}
            </p>
          </Reveal>

          <Reveal delay={0.18}>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Button href="#contact" size="lg" trailingIcon>
                {HERO.primaryCta}
              </Button>
              <Button href="#approach" variant="secondary" size="lg">
                {HERO.secondaryCta}
              </Button>
            </div>
          </Reveal>

          <Reveal delay={0.24}>
            <ul className="mt-10 flex flex-wrap gap-x-5 gap-y-2">
              {CREDENTIALS.map((credential) => (
                <li key={credential} className="text-xs text-ink-4">
                  {credential}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        <Reveal className="mt-16 lg:mt-24" delay={0.3}>
          <a
            href="#capabilities"
            className="group mb-10 inline-flex items-center gap-2 py-1.5 text-xs text-ink-4 transition-colors duration-200 hover:text-ink-2 lg:mb-0"
          >
            <ArrowDown
              className="size-3.5 transition-transform duration-300 group-hover:translate-y-0.5"
              aria-hidden="true"
            />
            Scroll to capabilities
          </a>
        </Reveal>
      </Container>
    </section>
  );
}

import { ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { CREDENTIALS, HERO } from "@/lib/content";
import { Globe3DDemo } from "@/components/3d-globe-demo";

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

      <div className="pointer-events-none absolute inset-y-0 right-[-4%] z-0 hidden w-[58vw] items-center justify-center lg:flex">
        <div className="w-full max-w-5xl [&_canvas]:!pointer-events-auto">
          <Globe3DDemo />
        </div>
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

import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { CTA, CONTACT } from "@/lib/content";

export function CtaBand() {
  return (
    <section id="contact" className="relative isolate scroll-mt-20 overflow-hidden py-28 sm:py-32 lg:py-40">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 blueprint opacity-70" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-full bg-[radial-gradient(ellipse_50%_60%_at_50%_50%,rgba(60,227,214,0.11),transparent_70%)]"
      />
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-px hairline" />

      <Container className="relative">
        <div className="mx-auto max-w-3xl text-center">
          <Reveal>
            <p className="label text-aqua/80">{CTA.eyebrow}</p>
          </Reveal>

          <Reveal delay={0.06}>
            <h2 className="mt-7 text-[clamp(2.25rem,5.6vw,4rem)] leading-[1.02] tracking-[-0.035em] text-balance">
              Tell us the decision{" "}
              <span className="text-gradient-aqua">you need to defend.</span>
            </h2>
          </Reveal>

          <Reveal delay={0.12}>
            <p className="mx-auto mt-7 max-w-xl text-[1.0625rem] leading-relaxed text-ink-2">
              {CTA.body}
            </p>
          </Reveal>

          <Reveal delay={0.18}>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
              <Button href={`mailto:${CONTACT.email}`} size="lg" trailingIcon>
                {CTA.primaryCta}
              </Button>
              <Button href="#capabilities" variant="secondary" size="lg">
                {CTA.secondaryCta}
              </Button>
            </div>
          </Reveal>

          <Reveal delay={0.24}>
            <dl className="mx-auto mt-14 flex max-w-2xl flex-col items-center justify-center gap-x-10 gap-y-5 border-t border-line pt-10 sm:flex-row">
              <div className="text-center">
                <dt className="label">Direct</dt>
                <dd className="mt-2">
                  <a
                    href={`mailto:${CONTACT.email}`}
                    className="inline-block py-1 text-sm text-ink transition-colors duration-200 hover:text-aqua"
                  >
                    {CONTACT.email}
                  </a>
                </dd>
              </div>
              <div className="text-center">
                <dt className="label">Telephone</dt>
                <dd className="mt-2">
                  <a
                    href={`tel:${CONTACT.phone.replace(/\s/g, "")}`}
                    className="inline-block py-1 text-sm text-ink transition-colors duration-200 hover:text-aqua"
                  >
                    {CONTACT.phone}
                  </a>
                </dd>
              </div>
              <div className="text-center">
                <dt className="label">Field hours</dt>
                <dd className="mt-2 text-sm text-ink">{CONTACT.hours}</dd>
              </div>
            </dl>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}

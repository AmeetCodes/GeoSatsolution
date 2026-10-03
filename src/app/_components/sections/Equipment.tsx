import { Check } from "lucide-react";
import { EQUIPMENT, SECTION_HEADERS } from "@/lib/content";
import { Container, Section, SectionHeader } from "@/components/ui/Section";
import { Reveal, RevealItem } from "@/components/ui/Reveal";

const CALIBRATION = [
  "Pre- and post-mobilisation check on every instrument",
  "Traceable certificates issued with each deliverable",
  "Independent control used to verify, never to assume",
];

export function Equipment() {
  return (
    <Section id="equipment">
      <Container>
        <div className="grid gap-14 lg:grid-cols-[minmax(0,24rem)_minmax(0,1fr)] lg:gap-20">
          <Reveal>
            <div>
              <SectionHeader
                index={SECTION_HEADERS.equipment.index}
                label={SECTION_HEADERS.equipment.label}
                title={SECTION_HEADERS.equipment.title}
                lede={SECTION_HEADERS.equipment.lede}
              />

              <ul className="mt-10 space-y-3.5 rounded-[var(--radius-card)] border border-line bg-white/[0.02] p-6">
                {CALIBRATION.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-ink-2">
                    <Check
                      className="mt-0.5 size-4 shrink-0 text-aqua"
                      strokeWidth={2.5}
                      aria-hidden="true"
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal className="lg:pt-2" stagger delay={0.08}>
            <div className="border-t border-line">
              <div className="grid grid-cols-[minmax(0,10rem)_minmax(0,1fr)] gap-6 border-b border-line py-3.5">
                <p className="label">System</p>
                <p className="label">Configuration</p>
              </div>

              {EQUIPMENT.map((item) => (
                <RevealItem
                  key={item.label}
                  className="group grid grid-cols-[minmax(0,10rem)_minmax(0,1fr)] items-baseline gap-6 border-b border-line py-6 transition-colors duration-300 hover:bg-white/[0.02]"
                >
                  <p className="text-sm text-ink-3">{item.label}</p>
                  <p className="font-mono text-sm text-ink tabular">{item.value}</p>
                </RevealItem>
              ))}
            </div>
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}

import { Check } from "lucide-react";
import { SECTION_HEADERS } from "@/lib/content";
import { contentService } from "@/lib/db/services/content.service";
import { Container, Section, SectionHeader } from "@/components/ui/Section";
import { Reveal, RevealItem } from "@/components/ui/Reveal";

export interface EquipmentItemData {
  label: string;
  value: string;
}

const DEFAULT_EQUIPMENT: EquipmentItemData[] = [
  { label: "UAV platforms", value: "Fixed-wing & multirotor" },
  { label: "LiDAR payloads", value: "UAV, terrestrial & SLAM" },
  { label: "Positioning", value: "RTK / PPK GNSS receivers" },
  { label: "Angle measurement", value: "Total stations & laser scanners" },
  { label: "Processing", value: "Trimble, LiDAR360, DJI Terra, Pix4D" },
  { label: "Analysis", value: "PLS-CADD, eCognition, GIS platforms" },
];

const CALIBRATION = [
  "Pre- and post-mobilisation check on every instrument",
  "Traceable certificates issued with each deliverable",
  "Independent control used to verify, never to assume",
];

export async function Equipment() {
  let equipmentList: EquipmentItemData[] = DEFAULT_EQUIPMENT;
  try {
    const dbEquipment = await contentService.getEquipment();
    if (dbEquipment && dbEquipment.length > 0) {
      equipmentList = dbEquipment.map((eq) => ({
        label: eq.label,
        value: eq.value,
      }));
    }
  } catch (error) {
    console.error("Failed to fetch equipment from DB:", error);
  }

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

              {equipmentList.map((item) => (
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

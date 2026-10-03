import { ArrowUpRight } from "lucide-react";
import { PROJECTS, SECTION_HEADERS } from "@/lib/content";
import { Container, Section, SectionHeader } from "@/components/ui/Section";
import { Reveal, RevealItem } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";

/**
 * One featured engagement at full width, the rest at half — the asymmetry
 * keeps a four-card catalogue from reading as a template grid.
 */
const [featured, ...rest] = PROJECTS;

function Card({
  project,
  className,
}: {
  project: (typeof PROJECTS)[number];
  className?: string;
}) {
  return (
    <a
      href="#contact"
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-[var(--radius-panel)] border border-line bg-panel/40 p-7 transition-[border-color,background-color,transform] duration-300 ease-out hover:-translate-y-1 hover:border-aqua/30 hover:bg-panel/70 sm:p-9",
        className,
      )}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-aqua/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      />

      <div className="flex items-start justify-between gap-4">
        <p className="label text-amber/80">{project.code}</p>
        <ArrowUpRight
          className="size-4 shrink-0 text-ink-4 transition-[color,transform] duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-aqua"
          aria-hidden="true"
        />
      </div>

      <h3 className="mt-6 max-w-md text-[clamp(1.25rem,2.1vw,1.625rem)] leading-snug text-ink">
        {project.title}
      </h3>
      <p className="mt-3 text-xs text-aqua/70">{project.sector}</p>
      <p className="mt-4 max-w-2xl text-sm leading-relaxed text-ink-2">{project.body}</p>

      <ul className="mt-7 flex flex-wrap gap-2 pt-1">
        {project.tags.map((tag) => (
          <li
            key={tag}
            className="rounded-full border border-line px-3 py-1 text-[0.6875rem] text-ink-3 transition-colors duration-200 group-hover:border-line-strong"
          >
            {tag}
          </li>
        ))}
      </ul>
    </a>
  );
}

export function Projects() {
  return (
    <Section id="projects" className="bg-abyss-2/30">
      <Container>
        <Reveal>
          <SectionHeader
            index={SECTION_HEADERS.projects.index}
            label={SECTION_HEADERS.projects.label}
            title={SECTION_HEADERS.projects.title}
            lede={SECTION_HEADERS.projects.lede}
          />
        </Reveal>

        <Reveal stagger className="mt-14 grid gap-4 sm:mt-16 lg:grid-cols-3">
          <RevealItem className="lg:col-span-3">
            <Card project={featured} className="lg:p-12" />
          </RevealItem>

          {rest.map((project) => (
            <RevealItem key={project.code}>
              <Card project={project} className="h-full" />
            </RevealItem>
          ))}
        </Reveal>
      </Container>
    </Section>
  );
}

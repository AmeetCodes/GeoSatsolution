import { ChevronDown } from "lucide-react";

export function SolutionFaq({ solutionTitle, deliverables, items }: { solutionTitle: string; deliverables: string[]; items?: { question: string; answer: string }[] }) {
  const generatedFaqs = [
    {
      question: `What is included with ${solutionTitle}?`,
      answer: `A ${solutionTitle} engagement is scoped to your site and decisions. Typical handover items include ${deliverables.join(", ")}, along with the supporting checks and metadata agreed during planning.`,
    },
    {
      question: "What information do you need to prepare a proposal?",
      answer: "Share the site location or coverage area, intended use, required accuracy or output, access constraints, and target schedule. If some details are still unknown, we can help define them during the first consultation.",
    },
    {
      question: "How do you choose the method and confirm quality?",
      answer: `We plan ${solutionTitle} around the terrain, project tolerance, and how the results will be used. The proposed capture and verification steps are agreed before fieldwork, then checked against the project control and acceptance criteria.`,
    },
  ];
  const faqs = items?.length ? items : generatedFaqs;

  return (
    <section className="mt-14 border-t border-line pt-10 sm:mt-16 sm:pt-12" aria-labelledby="solution-faq-heading">
      <div className="grid gap-7 md:grid-cols-[0.7fr_1.3fr] md:gap-12">
        <div>
          <p className="font-heading text-xs font-medium uppercase tracking-wider text-teal-600">Good to know</p>
          <h2 id="solution-faq-heading" className="mt-4 max-w-sm font-heading text-3xl font-semibold leading-tight tracking-tight text-ink">
            Questions about {solutionTitle}?
          </h2>
        </div>

        <div className="space-y-2">
          {faqs.map((faq) => (
            <details key={faq.question} className="group rounded-lg border border-line bg-white">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 rounded-lg px-4 py-4 font-sans font-medium leading-normal text-ink transition-colors hover:bg-slate-50 [&::-webkit-details-marker]:hidden">
                <span>{faq.question}</span>
                <ChevronDown
                  className="size-5 shrink-0 text-ink-3 transition-transform duration-300 group-open:rotate-180"
                  aria-hidden="true"
                />
              </summary>
              <div className="border-t border-line px-4 py-4">
                <p className="max-w-3xl font-sans text-sm leading-relaxed text-slate-600">
                  {faq.answer}
                </p>
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

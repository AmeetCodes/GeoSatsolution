import { ChevronDown } from "lucide-react";

export function ServiceFaq({
  items,
  className,
}: {
  items?: { question: string; answer: string }[];
  className?: string;
}) {
  if (!items?.length) return null;

  const sectionClassName =
    className ?? "mt-14 border-t border-line pt-10 sm:mt-16 sm:pt-12";

  return (
    <section
      className={sectionClassName}
      aria-labelledby="service-faq-heading"
    >
      <div className="grid gap-7 md:grid-cols-[0.7fr_1.3fr] md:gap-12">
        <div>
          <p className="font-heading text-xs font-medium uppercase tracking-wider text-teal-600">Good to know</p>
          <h2 id="service-faq-heading" className="mt-4 max-w-sm font-heading text-3xl font-semibold leading-tight tracking-tight text-ink">
            Frequently asked questions
          </h2>
        </div>

        <div className="space-y-2">
          {items.map((faq, index) => (
            <details key={`${faq.question}-${index}`} className="group rounded-lg border border-line bg-white">
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

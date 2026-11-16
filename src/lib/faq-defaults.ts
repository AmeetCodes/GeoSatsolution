import type { ContentFaq } from "./content-types";

export function normalizeFaqs(faqs?: ContentFaq[] | null): ContentFaq[] {
  return (faqs ?? [])
    .map((faq, index) => ({
      question: faq.question,
      answer: faq.answer,
      order: typeof faq.order === "number" ? faq.order : index,
    }))
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    .map((faq, index) => ({ ...faq, order: index }));
}

export function buildStarterFaqs(
  title: string,
  deliverables: string[] = [],
): ContentFaq[] {
  const handoverItems = deliverables.length
    ? deliverables.join(", ")
    : "the agreed survey outputs and supporting documentation";

  return [
    {
      question: `What is included with ${title}?`,
      answer: `A ${title} engagement is scoped to your site and decisions. Typical handover items include ${handoverItems}, along with the supporting checks and metadata agreed during planning.`,
      order: 0,
    },
    {
      question: "What information do we need to prepare a proposal?",
      answer:
        "Share the site location or coverage area, intended use, required accuracy or output, access constraints, and target schedule. If some details are still unknown, we can help define them during the first consultation.",
      order: 1,
    },
    {
      question: "How do you choose the method and confirm quality?",
      answer: `We plan ${title} around the terrain, project tolerance, and how the results will be used. The proposed capture and verification steps are agreed before fieldwork, then checked against the project control and acceptance criteria.`,
      order: 2,
    },
  ];
}

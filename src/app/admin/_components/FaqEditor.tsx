"use client";

import { ChevronDown, ChevronUp, Plus, Trash2 } from "lucide-react";
import type { ContentFaq } from "@/lib/content-types";

interface FaqEditorProps {
  faqs: ContentFaq[];
  onChange: (faqs: ContentFaq[]) => void;
}

export function FaqEditor({ faqs, onChange }: FaqEditorProps) {
  const commit = (next: ContentFaq[]) => {
    onChange(next.map((faq, index) => ({ ...faq, order: index })));
  };

  const updateFaq = (index: number, field: "question" | "answer", value: string) => {
    commit(faqs.map((faq, itemIndex) =>
      itemIndex === index ? { ...faq, [field]: value } : faq,
    ));
  };

  const moveFaq = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= faqs.length) return;
    const next = [...faqs];
    [next[index], next[target]] = [next[target], next[index]];
    commit(next);
  };

  return (
    <section className="space-y-3 rounded-xl border border-slate-200 bg-white p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Frequently asked questions
          </h4>
          <p className="mt-1 text-xs text-slate-500">
            These entries are stored on this record in the database. Deleting every FAQ hides the public section.
          </p>
        </div>
        <button
          type="button"
          onClick={() => commit([...faqs, { question: "", answer: "", order: faqs.length }])}
          className="inline-flex items-center gap-1 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 transition-colors hover:bg-emerald-100"
        >
          <Plus className="size-3.5" aria-hidden="true" />
          Add FAQ
        </button>
      </div>

      {faqs.length === 0 ? (
        <p className="rounded-lg border border-dashed border-slate-300 bg-slate-50 px-3 py-5 text-center text-xs text-slate-500">
          No FAQs yet. Add the first question above.
        </p>
      ) : (
        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="rounded-xl border border-slate-200 bg-slate-50 p-3"
            >
              <div className="mb-2 flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  <span className="flex size-5 items-center justify-center rounded-full bg-white text-[10px] text-slate-600 ring-1 ring-slate-200">
                    {index + 1}
                  </span>
                  FAQ
                </span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => moveFaq(index, -1)}
                    disabled={index === 0}
                    aria-label={`Move FAQ ${index + 1} up`}
                    className="rounded-md p-1.5 text-slate-500 transition-colors hover:bg-white hover:text-slate-800 disabled:cursor-not-allowed disabled:opacity-35"
                  >
                    <ChevronUp className="size-3.5" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveFaq(index, 1)}
                    disabled={index === faqs.length - 1}
                    aria-label={`Move FAQ ${index + 1} down`}
                    className="rounded-md p-1.5 text-slate-500 transition-colors hover:bg-white hover:text-slate-800 disabled:cursor-not-allowed disabled:opacity-35"
                  >
                    <ChevronDown className="size-3.5" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={() => commit(faqs.filter((_, itemIndex) => itemIndex !== index))}
                    aria-label={`Delete FAQ ${index + 1}`}
                    title="Delete FAQ"
                    className="ml-1 rounded-md border border-rose-200 bg-white p-1.5 text-rose-600 transition-colors hover:bg-rose-50"
                  >
                    <Trash2 className="size-3.5" aria-hidden="true" />
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <input
                  value={faq.question}
                  onChange={(event) => updateFaq(index, "question", event.target.value)}
                  placeholder="Question"
                  className="w-full rounded-lg border border-slate-200 bg-white p-2 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/15"
                />
                <textarea
                  value={faq.answer}
                  onChange={(event) => updateFaq(index, "answer", event.target.value)}
                  placeholder="Answer"
                  rows={3}
                  className="w-full rounded-lg border border-slate-200 bg-white p-2 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/15"
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

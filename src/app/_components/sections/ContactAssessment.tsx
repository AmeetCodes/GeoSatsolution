"use client";

import { Check, ChevronDown, LoaderCircle, MapPin, Mail, Phone } from "lucide-react";
import { useState, type FormEvent } from "react";
import { CONTACT } from "@/lib/content";
import { Container, Section } from "@/components/ui/Section";


const EXPECTATIONS = [
  "A practical review of your site, corridor or asset requirements",
  "Recommendations for survey methods, sensors and deliverables",
  "Clear guidance on accuracy, coverage, schedule and next steps",
];

export function ContactAssessment() {
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    setMessage("");

    const form = event.currentTarget;
    const formData = new FormData(form);
    const interest = String(formData.get("interest") ?? "");
    const details = String(formData.get("details") ?? "");

    try {
      const response = await fetch("/api/consultation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.get("name"),
          organisation: formData.get("organisation"),
          email: formData.get("email"),
          phone: formData.get("phone"),
          interest: "Other",
          otherInterest: interest,
          details,
          website: formData.get("website"),
        }),
      });
      const result = await response.json();

      if (!response.ok || !result.ok) {
        throw new Error(result.error || "We couldn't send your request. Please try again.");
      }

      form.reset();
      setStatus("success");
      setMessage("Thanks for reaching out. The GeoSAT team will be in touch soon.");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "We couldn't send your request. Please try again.");
    }
  }

  const fieldClass = "mt-2 w-full rounded-xl border border-[#d8dee5] bg-white px-4 py-3 text-sm text-[#18212b] placeholder:text-[#89939e] outline-none transition focus:border-[#00a884] focus:ring-2 focus:ring-[#00a884]/15";
  const labelClass = "block text-sm font-medium text-[#293440]";

  return (
    <Section id="contact" className="scroll-mt-24 border-t border-[#e8edf1] bg-[#f7f9fa] py-16 sm:py-24">
      <Container>
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <div className="pt-2">
            <p className="font-mono text-xs font-medium uppercase tracking-[0.18em] text-[#008b70]">
              GeoSAT Solutions · Kathmandu, Nepal
            </p>
            <h2 className="mt-5 max-w-xl text-4xl font-semibold leading-[1.08] tracking-[-0.04em] text-[#17212b] sm:text-5xl">
              Start with a clearer view of your project.
            </h2>
            <p className="mt-5 max-w-lg text-base leading-7 text-[#586572]">
              Tell us what you need to measure, map or monitor. Our geospatial team will help shape a practical assessment around your site and intended deliverables.
            </p>

            <div className="mt-9">
              <h3 className="text-sm font-semibold text-[#1e2933]">What to expect</h3>
              <ul className="mt-4 space-y-3">
                {EXPECTATIONS.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm leading-6 text-[#53606c]">
                    <Check className="mt-1 size-4 shrink-0 text-[#00a884]" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-9 space-y-3 border-t border-[#e1e6ea] pt-6 text-sm text-[#53606c]">
              <a className="flex w-fit items-center gap-3 hover:text-[#008b70]" href={`mailto:${CONTACT.email}`}>
                <Mail className="size-4 text-[#00a884]" aria-hidden="true" />{CONTACT.email}
              </a>
              <a className="flex w-fit items-center gap-3 hover:text-[#008b70]" href={`tel:${CONTACT.phone.replace(/\s/g, "")}`}>
                <Phone className="size-4 text-[#00a884]" aria-hidden="true" />{CONTACT.phone}
              </a>
              <p className="flex items-start gap-3">
                <MapPin className="mt-0.5 size-4 shrink-0 text-[#00a884]" aria-hidden="true" />
                <span>{CONTACT.address.join(", ")}</span>
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-[#e2e7eb] bg-white p-6 shadow-[0_20px_60px_-40px_rgba(17,35,48,0.32)] sm:p-8">
            <h3 className="text-2xl font-semibold tracking-tight text-[#17212b]">Request an assessment</h3>
            <p className="mt-2 text-sm leading-6 text-[#697581]">Share a few details and we’ll help identify the right geospatial approach.</p>

            <form onSubmit={handleSubmit} className="mt-7 space-y-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className={labelClass}>Full name <span className="text-[#00a884]">*</span>
                  <input className={fieldClass} name="name" autoComplete="name" required minLength={2} maxLength={120} placeholder="Your name" />
                </label>
                <label className={labelClass}>Organisation
                  <input className={fieldClass} name="organisation" autoComplete="organization" maxLength={160} placeholder="Company or agency" />
                </label>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className={labelClass}>Work email <span className="text-[#00a884]">*</span>
                  <input className={fieldClass} name="email" type="email" autoComplete="email" required maxLength={254} placeholder="name@organisation.com" />
                </label>
                <label className={labelClass}>Phone
                  <input className={fieldClass} name="phone" type="tel" autoComplete="tel" maxLength={60} placeholder="+977 ..." />
                </label>
              </div>
              <label className={labelClass}>Area of interest <span className="text-[#00a884]">*</span>
                <span className="relative block">
                  <select className={`${fieldClass} appearance-none pr-11`} name="interest" required defaultValue="">
                    <option value="" disabled>Select a service</option>
                    <option value="Other">Other / not sure yet</option>
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-[#76828d]" aria-hidden="true" />
                </span>
              </label>
              <label className={labelClass}>Project details <span className="text-[#00a884]">*</span>
                <textarea className={`${fieldClass} min-h-32 resize-y`} name="details" required minLength={12} maxLength={3000} placeholder="Where is the project, what do you need to understand, and what deliverables would help?" />
              </label>
              <label className="sr-only" aria-hidden="true">Website
                <input name="website" tabIndex={-1} autoComplete="off" />
              </label>

              <button type="submit" disabled={status === "sending"} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#00a884] px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-[#009574] focus-visible:outline-offset-4 disabled:cursor-wait disabled:opacity-70">
                {status === "sending" ? <><LoaderCircle className="size-4 animate-spin" aria-hidden="true" />Sending request…</> : "Request assessment"}
              </button>
              <p aria-live="polite" className={`text-sm ${status === "error" ? "text-red-700" : status === "success" ? "text-[#008b70]" : "text-[#697581]"}`}>
                {message || (status === "idle" ? "Your project details are shared with the GeoSAT team." : "")}
              </p>
            </form>
          </div>
        </div>
      </Container>
    </Section>
  );
}

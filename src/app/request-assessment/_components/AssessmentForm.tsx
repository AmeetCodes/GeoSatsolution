"use client";

import { ChevronDown, LoaderCircle } from "lucide-react";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { DEFAULT_INTEREST_OPTIONS } from "@/lib/consultation-interests";

export function AssessmentForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [interestOptions, setInterestOptions] = useState<string[]>([...DEFAULT_INTEREST_OPTIONS]);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [interestOpen, setInterestOpen] = useState(false);
  const [interestError, setInterestError] = useState("");
  const interestDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let active = true;
    fetch("/api/services", { cache: "no-store" })
      .then((response) => (response.ok ? response.json() : null))
      .then((json: { data?: Array<{ title?: string }> } | null) => {
        if (!active) return;
        const titles = (json?.data ?? [])
          .map((service) => service.title?.trim() ?? "")
          .filter(Boolean)
          .filter((title, index, all) => all.indexOf(title) === index);
        if (titles.length) {
          setInterestOptions([...new Set([...titles, ...DEFAULT_INTEREST_OPTIONS])]);
        }
      })
      .catch(() => {});

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!interestOpen) return;
    const closeOnOutsideClick = (event: PointerEvent) => {
      if (!interestDropdownRef.current?.contains(event.target as Node)) setInterestOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setInterestOpen(false);
    };
    document.addEventListener("pointerdown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [interestOpen]);

  function toggleInterest(value: string) {
    setSelectedInterests((current) =>
      current.includes(value) ? current.filter((item) => item !== value) : [...current, value],
    );
    setInterestError("");
    setMessage("");
    setStatus("idle");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");

    const form = event.currentTarget;
    const formData = new FormData(form);
    const interests = formData.getAll("interest").map(String);
    const otherInterest = String(formData.get("otherInterest") ?? "").trim();
    const details = String(formData.get("details") ?? "");

    if (!interests.length) {
      setStatus("error");
      setInterestError("Select at least one area of interest.");
      return;
    }

    setStatus("sending");
    setInterestError("");

    try {
      const response = await fetch("/api/consultation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.get("name"),
          organisation: formData.get("organisation"),
          email: formData.get("email"),
          phone: formData.get("phone"),
          interest: interests,
          otherInterest,
          details,
          type: "ASSESSMENT",
          website: formData.get("website"),
        }),
      });
      const result = await response.json();

      if (!response.ok || !result.ok) {
        throw new Error(result.error || "We couldn't send your request. Please try again.");
      }

      form.reset();
      setSelectedInterests([]);
      setInterestOpen(false);
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
    <div className="flex h-full flex-col rounded-2xl border border-[#e2e7eb] bg-white p-6 shadow-[0_20px_60px_-40px_rgba(17,35,48,0.32)] sm:p-8">
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
        <fieldset className="min-w-0 border-0 p-0">
          <legend className={`${labelClass} mb-2`}>Area of interest <span className="text-[#00a884]">*</span></legend>
          <div className="relative" ref={interestDropdownRef}>
            <button
              type="button"
              aria-haspopup="true"
              aria-expanded={interestOpen}
              aria-controls="assessment-interest-options"
              aria-invalid={Boolean(interestError)}
              aria-describedby={interestError ? "assessment-interest-error" : undefined}
              onClick={() => setInterestOpen((open) => !open)}
              className={`${fieldClass} !mt-0 flex items-center justify-between gap-3 text-left`}
            >
              <span className={selectedInterests.length ? "truncate text-[#18212b]" : "truncate text-[#89939e]"}>
                {selectedInterests.length
                  ? selectedInterests.map((item) => item === "Other" ? "Other / not sure yet" : item).join(", ")
                  : "Select one or more services"}
              </span>
              <ChevronDown className={`size-4 shrink-0 text-[#76828d] transition-transform ${interestOpen ? "rotate-180" : ""}`} aria-hidden="true" />
            </button>
            <div
              id="assessment-interest-options"
              role="group"
              aria-label="Choose areas of interest"
              hidden={!interestOpen}
              className="absolute inset-x-0 top-[calc(100%+6px)] z-20 max-h-64 overflow-y-auto rounded-xl border border-[#d8dee5] bg-white p-2 shadow-[0_16px_36px_-18px_rgba(17,35,48,0.38)]"
            >
              <p className="px-3 py-2 text-xs font-medium text-[#697581]">Choose all that apply</p>
              {[...interestOptions.filter((option) => option !== "Other"), "Other"].map((option) => (
                <label key={option} className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-[#293440] transition-colors hover:bg-[#f3f7f8]">
                  <input
                    type="checkbox"
                    name="interest"
                    value={option}
                    checked={selectedInterests.includes(option)}
                    onChange={() => toggleInterest(option)}
                    className="size-4 shrink-0 accent-[#00a884]"
                  />
                  {option === "Other" ? "Other / not sure yet" : option}
                </label>
              ))}
              <div className="sticky bottom-0 mt-1 flex items-center justify-between border-t border-[#e7ecef] bg-white px-3 py-2">
                <span className="text-xs text-[#697581]">{selectedInterests.length} selected</span>
                <button type="button" onClick={() => setInterestOpen(false)} className="rounded-full px-3 py-1.5 text-xs font-semibold text-[#008b70] transition-colors hover:bg-[#eaf7f4]">Done</button>
              </div>
            </div>
          </div>
          {interestError ? <p id="assessment-interest-error" className="mt-1.5 text-xs text-red-700">{interestError}</p> : null}
        </fieldset>
        {selectedInterests.includes("Other") ? (
          <label className={labelClass}>Tell us what service you need <span className="text-[#00a884]">*</span>
            <input className={fieldClass} name="otherInterest" required maxLength={160} placeholder="Describe the service you need" />
          </label>
        ) : null}
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
  );
}

export default AssessmentForm;

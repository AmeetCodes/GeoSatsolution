"use client";

import { useState, type FormEvent } from "react";
import { ArrowUpRight, CheckCircle2, LoaderCircle } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { launchConfetti } from "@/components/ui/confetti";
import { SpecularButton } from "@/components/ui/SpecularButton";
const DEFAULT_SOLUTIONS = [
  { title: "UAV LiDAR & Aerial Survey" },
  { title: "Drone Photogrammetry" },
  { title: "Engineering & Topographic Survey" },
  { title: "GIS & Spatial Intelligence" },
  { title: "Geotechnical & Displacement Monitoring" },
  { title: "Cadastral & Land Survey" },
  { title: "Bathymetric & Hydrographic Survey" },
];

type ConsultationFields = {
  name: string;
  organisation: string;
  email: string;
  phone: string;
  interest: string;
  otherInterest: string;
  details: string;
};

type FieldName = keyof ConsultationFields;
type FieldErrors = Partial<Record<FieldName, string>>;

const INITIAL_ERRORS: FieldErrors = {};

function InputField({
  id,
  label,
  value,
  required = false,
  type = "text",
  error,
  onChange,
  onBlur,
}: {
  id: FieldName;
  label: string;
  value: string;
  required?: boolean;
  type?: string;
  error?: string;
  onChange: (value: string) => void;
  onBlur: () => void;
}) {
  return (
    <div className="min-w-0">
      <label htmlFor={id} className="text-sm font-semibold text-ink">
        {label}{required ? <span className="ml-1 text-aqua" aria-hidden="true">*</span> : null}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        value={value}
        required={required}
        autoComplete={id === "name" ? "name" : id === "email" ? "email" : id === "phone" ? "tel" : "organization"}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        onChange={(event) => onChange(event.target.value)}
        onBlur={onBlur}
        className="mt-1.5 h-11 w-full rounded-xl border border-slate-300 bg-white px-3.5 text-sm text-ink shadow-sm outline-none transition focus:border-aqua focus:ring-2 focus:ring-aqua/15 aria-invalid:border-rose-500 aria-invalid:focus:ring-rose-500/15"
      />
      {error ? <p id={`${id}-error`} className="mt-1 text-xs text-rose-700">{error}</p> : null}
    </div>
  );
}

export function ConsultationDialog({ solutionTitle, solutionGroup }: { solutionTitle: string; solutionGroup: string }) {
  const [fields, setFields] = useState<ConsultationFields>({
    name: "",
    organisation: "",
    email: "",
    phone: "",
    interest: solutionTitle,
    otherInterest: "",
    details: "",
  });
  const [errors, setErrors] = useState<FieldErrors>(INITIAL_ERRORS);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function updateField(field: FieldName, value: string) {
    setFields((current) => ({ ...current, [field]: value }));
    if (errors[field]) setErrors((current) => ({ ...current, [field]: undefined }));
    setSubmitError("");
  }

  function validate() {
    const nextErrors: FieldErrors = {};
    if (fields.name.trim().length < 2) nextErrors.name = "Enter your full name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email.trim())) nextErrors.email = "Enter a valid email address.";
    if (!fields.interest) nextErrors.interest = "Choose an area of interest.";
    if (fields.interest === "Other" && fields.otherInterest.trim().length < 2) nextErrors.otherInterest = "Tell us what service you need.";
    if (fields.details.trim().length < 12) nextErrors.details = "Add a few details so our team can prepare.";
    setErrors(nextErrors);
    return nextErrors;
  }

  async function submitRequest(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validate();
    const firstInvalidField = Object.keys(nextErrors)[0] as FieldName | undefined;
    if (firstInvalidField) {
      document.getElementById(firstInvalidField)?.focus();
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");

    try {
      const formData = new FormData(event.currentTarget);
      const response = await fetch("/api/consultation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...fields,
          name: fields.name.trim(),
          organisation: fields.organisation.trim(),
          email: fields.email.trim(),
          phone: fields.phone.trim(),
          details: fields.details.trim(),
          website: formData.get("website"),
        }),
      });
      const result = await response.json().catch(() => null) as { error?: string } | null;

      if (!response.ok) {
        setSubmitError(result?.error ?? "We couldn't send your request just now. Please try again shortly.");
        return;
      }

      setSubmitted(true);
      launchConfetti({ x: 0.5, y: 0.4 }, 1.6);
    } catch {
      setSubmitError("We couldn't reach the consultation service. Check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog>
      <DialogTrigger
        render={
          <SpecularButton
            size="lg"
            radius={16}
            tint="#ffffff"
            tintOpacity={0}
            blur={0}
            textColor="#ffffff"
            lineColor="#b7fff3"
            baseColor="#087f75"
            intensity={1.1}
            shineSize={12}
            shineFade={35}
            thickness={1.2}
            speed={0.25}
            followMouse
            proximity={260}
            autoAnimate={false}
            aria-label={`Consult about ${solutionTitle}`}
          >
            Consult
          </SpecularButton>
        }
      />
      <DialogContent
        className="max-h-[calc(100dvh-2rem)] max-w-[min(36rem,calc(100%-2rem))] gap-0 overflow-y-auto rounded-lg border border-slate-200 bg-[#f7f7f1] p-0 text-ink shadow-[0_30px_100px_-35px_rgba(15,23,42,0.55)] sm:max-w-xl"
        showCloseButton
      >
        <DialogHeader className="px-6 pb-5 pt-8 sm:px-8 sm:pt-10">
          <p className="label text-amber">Consultation request / {solutionGroup}</p>
          <DialogTitle className="font-display text-4xl font-semibold leading-[1.05] tracking-normal text-ink sm:text-5xl">
            Let&apos;s plan your survey.
          </DialogTitle>
          <DialogDescription className="max-w-lg text-base leading-relaxed text-ink-2">
            Tell us what you need, and our team will prepare the right next step.
          </DialogDescription>
          <span className="mt-1 inline-flex w-fit border border-aqua/40 px-2.5 py-1 text-xs font-semibold text-aqua-deep">
            {solutionTitle}
          </span>
        </DialogHeader>

        {submitted ? (
          <div role="status" className="px-6 pb-8 sm:px-8 sm:pb-10">
            <div className="flex gap-4 rounded-xl border border-emerald-200 bg-emerald-50 p-5 text-emerald-950">
              <CheckCircle2 className="mt-0.5 size-6 shrink-0 text-emerald-700" aria-hidden="true" />
              <div>
                <h3 className="font-display text-xl font-semibold">Thank you for consulting with us.</h3>
                <p className="mt-2 text-sm leading-relaxed">
                  Your request has been sent to the GeoSAT consultation team. We&apos;ll follow up at {fields.email.trim()}.
                </p>
              </div>
            </div>
            <DialogClose className="mt-5 inline-flex min-h-11 items-center justify-center rounded-xl bg-aqua px-5 text-sm font-semibold text-white transition hover:bg-aqua-bright">
              Done
            </DialogClose>
          </div>
        ) : (
        <form noValidate onSubmit={submitRequest} className="px-6 pb-7 sm:px-8 sm:pb-8">
          <div aria-hidden="true" className="absolute left-[-10000px] size-px overflow-hidden">
            <label htmlFor="website">Leave this field empty</label>
            <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
          </div>
          <div className="grid gap-x-4 gap-y-4 sm:grid-cols-2">
            <InputField
              id="name"
              label="Full name"
              value={fields.name}
              required
              error={errors.name}
              onChange={(value) => updateField("name", value)}
              onBlur={() => fields.name.trim().length < 2 && fields.name.length > 0 && setErrors((current) => ({ ...current, name: "Enter your full name." }))}
            />
            <InputField
              id="organisation"
              label="Organisation"
              value={fields.organisation}
              onChange={(value) => updateField("organisation", value)}
              onBlur={() => undefined}
            />
            <InputField
              id="email"
              label="Email"
              type="email"
              value={fields.email}
              required
              error={errors.email}
              onChange={(value) => updateField("email", value)}
              onBlur={() => fields.email.length > 0 && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email.trim()) && setErrors((current) => ({ ...current, email: "Enter a valid email address." }))}
            />
            <InputField
              id="phone"
              label="Phone"
              type="tel"
              value={fields.phone}
              onChange={(value) => updateField("phone", value)}
              onBlur={() => undefined}
            />
            <div className="sm:col-span-2">
              <label htmlFor="interest" className="text-sm font-semibold text-ink">
                Area of interest<span className="ml-1 text-aqua" aria-hidden="true">*</span>
              </label>
              <select
                id="interest"
                name="interest"
                required
                value={fields.interest}
                aria-invalid={Boolean(errors.interest)}
                aria-describedby={errors.interest ? "interest-error" : undefined}
                onChange={(event) => updateField("interest", event.target.value)}
                className="mt-1.5 h-11 w-full rounded-xl border border-slate-300 bg-white px-3.5 text-sm text-ink shadow-sm outline-none transition focus:border-aqua focus:ring-2 focus:ring-aqua/15 aria-invalid:border-rose-500"
              >
                <option value="" disabled>Select an area</option>
                {DEFAULT_SOLUTIONS.map((solution) => <option key={solution.title} value={solution.title}>{solution.title}</option>)}
                <option value="Other">Other</option>
              </select>
              {errors.interest ? <p id="interest-error" className="mt-1 text-xs text-rose-700">{errors.interest}</p> : null}
            </div>
            {fields.interest === "Other" ? (
              <div className="sm:col-span-2">
                <InputField
                  id="otherInterest"
                  label="Tell us what you need"
                  value={fields.otherInterest}
                  required
                  error={errors.otherInterest}
                  onChange={(value) => updateField("otherInterest", value)}
                  onBlur={() => fields.otherInterest.trim().length < 2 && fields.otherInterest.length > 0 && setErrors((current) => ({ ...current, otherInterest: "Tell us what service you need." }))}
                />
              </div>
            ) : null}
            <div className="sm:col-span-2">
              <label htmlFor="details" className="text-sm font-semibold text-ink">
                Project details<span className="ml-1 text-aqua" aria-hidden="true">*</span>
              </label>
              <textarea
                id="details"
                name="details"
                required
                minLength={12}
                rows={4}
                value={fields.details}
                placeholder="Coverage area, accuracy requirement, timeline..."
                aria-invalid={Boolean(errors.details)}
                aria-describedby={errors.details ? "details-error" : undefined}
                onChange={(event) => updateField("details", event.target.value)}
                className="mt-1.5 w-full resize-y rounded-xl border border-slate-300 bg-white px-3.5 py-3 text-sm leading-relaxed text-ink shadow-sm outline-none transition placeholder:text-slate-400 focus:border-aqua focus:ring-2 focus:ring-aqua/15 aria-invalid:border-rose-500"
              />
              {errors.details ? <p id="details-error" className="mt-1 text-xs text-rose-700">{errors.details}</p> : null}
            </div>
          </div>

          <div className="mt-5 flex flex-col gap-4 border-t border-slate-200 pt-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-60 text-xs leading-relaxed text-ink-3">
              Your request is sent directly to the GeoSAT consultation team.
            </p>
            {submitError ? (
              <p role="alert" className="text-sm text-rose-700 sm:max-w-48">{submitError}</p>
            ) : null}
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-[#d5b35e] px-5 text-sm font-semibold text-ink shadow-sm transition hover:bg-[#cba94f] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aqua focus-visible:ring-offset-2"
            >
              {isSubmitting ? (
                <>Sending request <LoaderCircle className="size-4 animate-spin" aria-hidden="true" /></>
              ) : (
                <>Send consultation request <ArrowUpRight className="size-4" aria-hidden="true" /></>
              )}
            </button>
          </div>
        </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
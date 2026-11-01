"use client";

import { useState, type FormEvent } from "react";
import { CheckCircle2, LoaderCircle } from "lucide-react";
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
import { productInquirySchema } from "@/lib/validations/product-inquiry.schema";

type ProductFields = {
  name: string;
  company: string;
  email: string;
  phone: string;
  product: string;
  details: string;
};

type FieldName = keyof ProductFields;
type FieldErrors = Partial<Record<FieldName, string>>;

const INITIAL_ERRORS: FieldErrors = {};

function InputField({
  id,
  label,
  value,
  required = false,
  type = "text",
  error,
  maxLength,
  inputMode,
  onChange,
}: {
  id: FieldName;
  label: string;
  value: string;
  required?: boolean;
  type?: string;
  error?: string;
  maxLength?: number;
  inputMode?: "text" | "tel" | "numeric" | "email";
  onChange: (value: string) => void;
}) {
  return (
    <div className="min-w-0">
      <label htmlFor={id} className="text-sm font-semibold text-ink">
        {label}
        {required ? <span className="ml-1 text-aqua" aria-hidden="true">*</span> : null}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        value={value}
        required={required}
        maxLength={maxLength}
        inputMode={inputMode}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        onChange={(event) => onChange(event.target.value)}
        className="mt-1.5 h-11 w-full rounded-xl border border-slate-300 bg-white px-3.5 text-sm text-ink shadow-sm outline-none transition focus:border-aqua focus:ring-2 focus:ring-aqua/15 aria-invalid:border-rose-500 aria-invalid:focus:ring-rose-500/15"
      />
      {error ? <p id={`${id}-error`} className="mt-1 text-xs text-rose-700">{error}</p> : null}
    </div>
  );
}

export function ProductBuyDialog({ productTitle, productGroup }: { productTitle: string; productGroup: string }) {
  const [fields, setFields] = useState<ProductFields>({
    name: "",
    company: "",
    email: "",
    phone: "",
    product: productTitle,
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
    const result = productInquirySchema.safeParse({
      name: fields.name.trim(),
      company: fields.company.trim(),
      email: fields.email.trim(),
      phone: fields.phone.trim(),
      product: fields.product,
      details: fields.details.trim(),
      website: "",
    });

    if (result.success) {
      setErrors(INITIAL_ERRORS);
      return INITIAL_ERRORS;
    }

    const nextErrors: FieldErrors = {};
    for (const issue of result.error.issues) {
      const field = issue.path[0] as FieldName | undefined;
      if (field && !nextErrors[field]) nextErrors[field] = issue.message;
    }
    setErrors(nextErrors);
    return nextErrors;
  }

  async function submitRequest(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSubmitting) return;
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
      const response = await fetch("/api/buy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: fields.name.trim(),
          company: fields.company.trim(),
          email: fields.email.trim(),
          phone: fields.phone.trim(),
          product: fields.product,
          details: fields.details.trim(),
          website: formData.get("website"),
        }),
      });
      const result = (await response.json().catch(() => null)) as { error?: string } | null;

      if (!response.ok) {
        setSubmitError(result?.error ?? "We couldn't send your request right now. Please try again shortly.");
        return;
      }

      setSubmitted(true);
      launchConfetti({ x: 0.5, y: 0.35 }, 1.6);
    } catch {
      setSubmitError("We couldn't reach the request service. Check your connection and try again.");
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
            lineColor="#dffaf7"
            baseColor="#0b7e72"
            intensity={1.15}
            shineSize={12}
            shineFade={35}
            thickness={1.2}
            speed={0.25}
            followMouse
            proximity={260}
            autoAnimate={false}
            aria-label={`Buy ${productTitle}`}
          >
            Buy
          </SpecularButton>
        }
      />
      <DialogContent
        className="max-h-[calc(100dvh-2rem)] max-w-[min(36rem,calc(100%-2rem))] gap-0 overflow-y-auto rounded-lg border border-slate-200 bg-[#f7f7f1] p-0 text-ink shadow-[0_30px_100px_-35px_rgba(15,23,42,0.55)] sm:max-w-xl"
        showCloseButton
      >
        <DialogHeader className="px-6 pb-5 pt-8 sm:px-8 sm:pt-10">
          <p className="label text-amber">Purchase request / {productGroup}</p>
          <DialogTitle className="font-heading text-4xl font-semibold leading-tight tracking-tight text-ink sm:text-5xl">
            Request a quote.
          </DialogTitle>
          <DialogDescription className="max-w-lg font-sans text-base leading-relaxed text-slate-600">
            Share your requirement and our team will prepare the right pricing, configuration and next step.
          </DialogDescription>
          <span className="mt-1 inline-flex w-fit border border-aqua/40 px-2.5 py-1 text-xs font-semibold text-aqua-deep">
            {productTitle}
          </span>
        </DialogHeader>

        {submitted ? (
          <div role="status" className="px-6 pb-8 sm:px-8 sm:pb-10">
            <div className="flex gap-4 rounded-xl border border-emerald-200 bg-emerald-50 p-5 text-emerald-950">
              <CheckCircle2 className="mt-0.5 size-6 shrink-0 text-emerald-700" aria-hidden="true" />
              <div>
                <h3 className="font-heading text-xl font-semibold tracking-tight">Your quote request has been sent.</h3>
                <p className="mt-2 font-sans text-sm leading-relaxed">
                  We&apos;ll follow up with pricing and configuration details for {productTitle} at {fields.email.trim()}.
                </p>
              </div>
            </div>
            <DialogClose className="mt-5 inline-flex min-h-11 items-center justify-center rounded-xl bg-aqua px-5 font-sans text-sm font-medium tracking-normal text-white transition hover:bg-aqua-bright">
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
              />
              <InputField
                id="company"
                label="Company"
                value={fields.company}
                onChange={(value) => updateField("company", value)}
              />
              <InputField
                id="email"
                label="Email"
                type="email"
                value={fields.email}
                required
                error={errors.email}
                onChange={(value) => updateField("email", value)}
              />
              <InputField
                id="phone"
                label="Phone"
                type="tel"
                value={fields.phone}
                required
                error={errors.phone}
                maxLength={10}
                inputMode="numeric"
                onChange={(value) => updateField("phone", value)}
              />
              <div className="sm:col-span-2">
                <label htmlFor="product" className="text-sm font-semibold text-ink">
                  Product
                  <span className="ml-1 text-aqua" aria-hidden="true">*</span>
                </label>
                <input
                  id="product"
                  name="product"
                  value={productTitle}
                  readOnly
                  className="mt-1.5 h-11 w-full rounded-xl border border-slate-300 bg-slate-100 px-3.5 text-sm text-ink shadow-sm outline-none"
                />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="details" className="text-sm font-semibold text-ink">
                  Project details
                  <span className="ml-1 text-aqua" aria-hidden="true">*</span>
                </label>
                <textarea
                  id="details"
                  name="details"
                  value={fields.details}
                  required
                  onChange={(event) => updateField("details", event.target.value)}
                  rows={5}
                  className="mt-1.5 w-full rounded-xl border border-slate-300 bg-white px-3.5 py-3 text-sm text-ink shadow-sm outline-none transition focus:border-aqua focus:ring-2 focus:ring-aqua/15 aria-invalid:border-rose-500"
                />
                {errors.details ? <p className="mt-1 text-xs text-rose-700">{errors.details}</p> : null}
              </div>
            </div>

            {submitError ? (
              <p className="mt-4 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
                {submitError}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-aqua px-5 text-sm font-semibold text-white transition hover:bg-aqua-bright disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? (
                <>
                  <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
                  Sending request
                </>
              ) : (
                "Send request"
              )}
            </button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}

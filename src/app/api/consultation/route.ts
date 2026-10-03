import nodemailer from "nodemailer";
import { SOLUTIONS } from "@/lib/solutions";

export const runtime = "nodejs";

const MAX_REQUEST_BYTES = 12_000;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const SOLUTION_NAMES = new Set(SOLUTIONS.map((solution) => solution.title));

type ConsultationPayload = {
  name?: unknown;
  organisation?: unknown;
  email?: unknown;
  phone?: unknown;
  interest?: unknown;
  otherInterest?: unknown;
  details?: unknown;
  website?: unknown;
};

function asText(value: unknown, maximumLength: number) {
  return typeof value === "string" ? value.trim().slice(0, maximumLength) : "";
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };
    return entities[character];
  });
}

function invalidRequest(message: string, status = 400) {
  return Response.json({ ok: false, error: message }, { status });
}

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin) {
    return invalidRequest("This request could not be verified.", 403);
  }

  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > MAX_REQUEST_BYTES) {
    return invalidRequest("The request is too large.", 413);
  }

  let parsedBody: unknown;
  try {
    parsedBody = await request.json();
  } catch {
    return invalidRequest("Please check the form and try again.");
  }

  if (!parsedBody || typeof parsedBody !== "object" || Array.isArray(parsedBody)) {
    return invalidRequest("Please check the form and try again.");
  }

  const payload = parsedBody as ConsultationPayload;

  if (asText(payload.website, 200)) {
    return Response.json({ ok: true });
  }

  const name = asText(payload.name, 120);
  const organisation = asText(payload.organisation, 160);
  const email = asText(payload.email, 254);
  const phone = asText(payload.phone, 60);
  const interest = asText(payload.interest, 120);
  const otherInterest = asText(payload.otherInterest, 160);
  const details = asText(payload.details, 3000);
  const interestLabel = interest === "Other" ? otherInterest : interest;

  if (name.length < 2) return invalidRequest("Enter your full name.");
  if (!EMAIL_PATTERN.test(email) || /[\r\n]/.test(email)) return invalidRequest("Enter a valid email address.");
  if (!SOLUTION_NAMES.has(interest) && interest !== "Other") return invalidRequest("Choose a valid area of interest.");
  if (interest === "Other" && otherInterest.length < 2) return invalidRequest("Tell us what service you need.");
  if (details.length < 12) return invalidRequest("Add a few details so our team can prepare.");

  const recipient = process.env.GMAIL_CONSULT_USER;
  const password = process.env.GMAIL_CONSULT_APP_PASSWORD?.replace(/\s/g, "");
  if (!recipient || !password) {
    return invalidRequest("Consultation email is temporarily unavailable. Please try again later.", 503);
  }

  const safeName = escapeHtml(name);
  const safeOrganisation = escapeHtml(organisation || "Not provided");
  const safeEmail = escapeHtml(email);
  const safePhone = escapeHtml(phone || "Not provided");
  const safeInterest = escapeHtml(interestLabel);
  const safeDetails = escapeHtml(details).replace(/\n/g, "<br>");
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user: recipient, pass: password },
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 20_000,
  });

  try {
    await transporter.sendMail({
      from: { name: "GeoSAT Website Consultations", address: recipient },
      to: recipient,
      replyTo: { name, address: email },
      subject: `Website consultation: ${interestLabel}`,
      text: [
        "New consultation request",
        "",
        `Name: ${name}`,
        `Organisation: ${organisation || "Not provided"}`,
        `Email: ${email}`,
        `Phone: ${phone || "Not provided"}`,
        `Area of interest: ${interestLabel}`,
        "",
        "Project details:",
        details,
      ].join("\n"),
      html: `<h1>New consultation request</h1><dl><dt>Name</dt><dd>${safeName}</dd><dt>Organisation</dt><dd>${safeOrganisation}</dd><dt>Email</dt><dd>${safeEmail}</dd><dt>Phone</dt><dd>${safePhone}</dd><dt>Area of interest</dt><dd>${safeInterest}</dd></dl><h2>Project details</h2><p>${safeDetails}</p>`,
    });

    return Response.json({ ok: true });
  } catch {
    console.error("Consultation email could not be delivered.");
    return invalidRequest("We couldn't send your request just now. Please try again shortly.", 502);
  } finally {
    transporter.close();
  }
}

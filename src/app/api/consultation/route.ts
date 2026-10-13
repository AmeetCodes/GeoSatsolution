import {
  buildNotificationContent,
  createGmailTransporter,
  getEmailAccount,
  sendCustomerConfirmation,
} from "@/lib/email";
import { solutionService } from "@/lib/db/services/solution.service";
import connectDB from "@/lib/db/connection";
import { Consultation } from "@/lib/models/Consultation";
import { createConsultationSchema } from "@/lib/validations/consultation.schema";

export const runtime = "nodejs";

const MAX_REQUEST_BYTES = 12_000;

type ConsultationPayload = {
  website?: unknown;
};

function asText(value: unknown, maximumLength: number) {
  return typeof value === "string" ? value.trim().slice(0, maximumLength) : "";
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

  const solutions = await solutionService.getAllPublished();
  const validSolutionNames = solutions.map((s) => s.title);
  const parsed = createConsultationSchema(validSolutionNames).safeParse(parsedBody);

  if (!parsed.success) {
    return invalidRequest(parsed.error.issues[0]?.message ?? "Please check the form and try again.");
  }

  const { name, organisation, email, phone, interest, otherInterest, details } = parsed.data;
  const interestLabel = interest === "Other" ? otherInterest : interest;

  try {
    await connectDB();
    await Consultation.create({
      name,
      organisation,
      email,
      phone,
      interest: interestLabel,
      otherInterest: interest === "Other" ? otherInterest : undefined,
      details,
      status: "pending",
    });
  } catch (dbErr) {
    console.error("Error saving consultation to MongoDB:", dbErr);
  }

  const account = getEmailAccount("GMAIL_CONSULT_USER", "GMAIL_CONSULT_APP_PASSWORD");
  if (!account) {
    return invalidRequest("Consultation email is temporarily unavailable. Please try again later.", 503);
  }

  const transporter = createGmailTransporter(account);

  try {
    const content = buildNotificationContent({
      heading: "New solution consultation request",
      messageLabel: "Project details",
      fields: [
        { label: "Inquiry type", value: "Solution consultation" },
        { label: "Area of interest", value: interestLabel },
        { label: "Customer name", value: name },
        { label: "Organisation", value: organisation },
        { label: "Email", value: email },
        { label: "Phone", value: phone },
      ],
      message: details,
    });

    await transporter.sendMail({
      from: { name: "GeoSAT Website Consultations", address: account.user },
      to: account.user,
      replyTo: { name, address: email },
      subject: `Solution consultation: ${interestLabel}`,
      text: content.text,
      html: content.html,
    });
  } catch {
    console.error("Consultation email could not be delivered.");
    transporter.close();
    return invalidRequest("We couldn't send your request just now. Please try again shortly.", 502);
  }

  try {
    await sendCustomerConfirmation(transporter, account, email, name);
  } catch {
    console.error("Consultation confirmation email could not be delivered.");
  } finally {
    transporter.close();
  }

  return Response.json({ ok: true });
}

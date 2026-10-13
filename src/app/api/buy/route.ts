import {
  buildNotificationContent,
  createGmailTransporter,
  getEmailAccount,
  sendCustomerConfirmation,
} from "@/lib/email";
import { productInquirySchema } from "@/lib/validations/product-inquiry.schema";

export const runtime = "nodejs";

const MAX_REQUEST_BYTES = 12_000;

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

  if (asText((parsedBody as { website?: unknown }).website, 200)) {
    return Response.json({ ok: true });
  }

  const parsed = productInquirySchema.safeParse(parsedBody);
  if (!parsed.success) {
    return invalidRequest(parsed.error.issues[0]?.message ?? "Please check the form and try again.");
  }

  const { name, company, email, phone, product, details } = parsed.data;

  const account = getEmailAccount("GMAIL_BUY_USER", "GMAIL_BUY_APP_PASSWORD");
  if (!account) {
    return invalidRequest("Product inquiries are temporarily unavailable. Please try again later.", 503);
  }

  const transporter = createGmailTransporter(account);

  try {
    const content = buildNotificationContent({
      heading: "New product inquiry",
      messageLabel: "Customer message",
      fields: [
        { label: "Inquiry type", value: "Product purchase / quote request" },
        { label: "Product", value: product },
        { label: "Customer name", value: name },
        { label: "Company", value: company },
        { label: "Email", value: email },
        { label: "Phone", value: phone },
      ],
      message: details,
    });

    await transporter.sendMail({
      from: { name: "GeoSAT Website Product Inquiries", address: account.user },
      to: account.user,
      replyTo: { name, address: email },
      subject: `Product inquiry: ${product}`,
      text: content.text,
      html: content.html,
    });
  } catch {
    console.error("Product inquiry email could not be delivered.");
    transporter.close();
    return invalidRequest("We couldn't send your request just now. Please try again shortly.", 502);
  }

  try {
    await sendCustomerConfirmation(transporter, account, email, name);
  } catch {
    console.error("Product inquiry confirmation email could not be delivered.");
  } finally {
    transporter.close();
  }

  return Response.json({ ok: true });
}

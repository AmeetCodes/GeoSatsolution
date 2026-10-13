import nodemailer, { type Transporter } from "nodemailer";

export type EmailAccount = { user: string; password: string };

export function escapeHtml(value: string) {
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

export function getEmailAccount(userKey: string, passwordKey: string): EmailAccount | null {
  const user = process.env[userKey]?.trim();
  const password = process.env[passwordKey]?.replace(/\s/g, "");

  if (!user || !password) return null;

  return { user, password };
}

export function createGmailTransporter(account: EmailAccount): Transporter {
  return nodemailer.createTransport({
    service: "gmail",
    auth: { user: account.user, pass: account.password },
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 20_000,
  });
}

export type EmailField = { label: string; value?: string | null };

const BRAND = "GeoSAT Solutions Pvt. Ltd.";
const CONFIRMATION_SUBJECT = "Thank You for Contacting GeoSAT Solutions";

function displayValue(value?: string | null) {
  return value && value.trim() ? value : "Not provided";
}

export function buildNotificationContent(options: {
  heading: string;
  messageLabel: string;
  fields: EmailField[];
  message: string;
}) {
  const { heading, messageLabel, fields, message } = options;

  const text = [
    heading,
    "",
    ...fields.map((field) => `${field.label}: ${displayValue(field.value)}`),
    "",
    `${messageLabel}:`,
    message,
    "",
    "— Sent from the GeoSAT Solutions website",
  ].join("\n");

  const rows = fields
    .map(
      (field) =>
        `<tr><th align="left" style="padding:9px 12px;background:#f1f5f9;border:1px solid #e2e8f0;font-size:13px;color:#334155;width:38%;">${escapeHtml(
          field.label,
        )}</th><td style="padding:9px 12px;border:1px solid #e2e8f0;font-size:14px;color:#0f172a;">${escapeHtml(
          displayValue(field.value),
        )}</td></tr>`,
    )
    .join("");

  const html = `<!doctype html><html><body style="margin:0;background:#f7f7f1;font-family:Arial,Helvetica,sans-serif;color:#0f172a;">
  <div style="max-width:640px;margin:0 auto;padding:24px;">
    <h1 style="margin:0 0 4px;font-size:20px;">${escapeHtml(heading)}</h1>
    <p style="margin:0 0 18px;color:#64748b;font-size:13px;">Sent from the GeoSAT Solutions website</p>
    <table style="width:100%;border-collapse:collapse;">${rows}</table>
    <h2 style="margin:22px 0 6px;font-size:15px;">${escapeHtml(messageLabel)}</h2>
    <p style="margin:0;font-size:14px;line-height:1.65;white-space:pre-wrap;">${escapeHtml(message)}</p>
  </div>
</body></html>`;

  return { text, html };
}

export function buildConfirmationContent(customerName: string) {
  const name = displayValue(customerName);

  const text = [
    `Dear ${name},`,
    "",
    "Thank you for contacting GeoSAT Solutions. We have successfully received your inquiry and appreciate your interest in our services. Our team will review your request and get back to you shortly.",
    "",
    "Best regards,",
    BRAND,
  ].join("\n");

  const html = `<!doctype html><html><body style="margin:0;background:#f7f7f1;font-family:Arial,Helvetica,sans-serif;color:#0f172a;">
  <div style="max-width:640px;margin:0 auto;padding:24px;">
    <p style="font-size:15px;line-height:1.7;">Dear ${escapeHtml(name)},</p>
    <p style="font-size:15px;line-height:1.7;">Thank you for contacting GeoSAT Solutions. We have successfully received your inquiry and appreciate your interest in our services. Our team will review your request and get back to you shortly.</p>
    <p style="font-size:15px;line-height:1.7;margin-bottom:0;">Best regards,<br><strong>${BRAND}</strong></p>
  </div>
</body></html>`;

  return { subject: CONFIRMATION_SUBJECT, text, html };
}

export async function sendCustomerConfirmation(
  transporter: Transporter,
  account: EmailAccount,
  customerEmail: string,
  customerName: string,
) {
  const confirmation = buildConfirmationContent(customerName);

  await transporter.sendMail({
    from: { name: "GeoSAT Solutions", address: account.user },
    to: customerEmail,
    subject: confirmation.subject,
    text: confirmation.text,
    html: confirmation.html,
  });
}

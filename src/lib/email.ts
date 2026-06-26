const FROM_ADDRESS = "noreply@mohikontok.com";
const FROM_NAME = "Mohikontok Sound Lab";
const STUDIO_LOCATION = "1389 Kearney Ave, Bronx, NY 10465";

interface SendEmailInput {
  to: string;
  subject: string;
  html: string;
  text: string;
}

async function sendEmail({ to, subject, html, text }: SendEmailInput): Promise<void> {
  const apiToken = process.env.CLOUDFLARE_API_TOKEN;
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;

  if (!apiToken || !accountId) {
    console.warn("[email] Skipping send: CLOUDFLARE_API_TOKEN or CLOUDFLARE_ACCOUNT_ID not configured.");
    return;
  }

  const endpoint = `https://api.cloudflare.com/client/v4/accounts/${accountId}/email/sending/send`;

  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        to,
        from: { address: FROM_ADDRESS, name: FROM_NAME },
        subject,
        html,
        text,
      }),
    });

    if (!res.ok) {
      let detail = "";
      try {
        detail = JSON.stringify(await res.json());
      } catch {
        detail = await res.text();
      }
      console.error(`[email] Send failed (${res.status}) for "${subject}" -> ${to}: ${detail}`);
      return;
    }

    const data = await res.json();
    if (data?.success === false) {
      console.error(`[email] API reported failure for "${subject}" -> ${to}:`, data.errors);
      return;
    }

    console.log(`[email] Sent "${subject}" -> ${to}`, data?.result);
  } catch (err) {
    console.error(`[email] Exception sending "${subject}" -> ${to}:`, err);
  }
}

export interface WelcomeEmailInput {
  name?: string | null;
  email: string;
}

export async function sendWelcomeEmail({ name, email }: WelcomeEmailInput): Promise<void> {
  const greeting = name ? `Hi ${name},` : "Hi there,";

  const html = `
<!DOCTYPE html>
<html>
  <body style="font-family: Arial, Helvetica, sans-serif; background:#0b0b0f; margin:0; padding:0;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#0b0b0f; padding:32px 0;">
      <tr><td align="center">
        <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="background:#13131a; border:1px solid rgba(255,255,255,0.06); border-radius:16px; overflow:hidden;">
          <tr><td style="background:#ee7234; padding:24px 32px;">
            <h1 style="margin:0; color:#ffffff; font-size:20px; letter-spacing:0.02em;">Mohikontok Sound Lab</h1>
          </td></tr>
          <tr><td style="padding:32px; color:#e8e8ea; font-size:15px; line-height:1.6;">
            <p>${greeting}</p>
            <p>Welcome to Mohikontok Sound Lab. Your account is ready. You can now reserve rehearsal, recording, and mastering sessions at our Bronx studio.</p>
            <p style="text-align:center; margin:28px 0;">
              <a href="${process.env.NEXTAUTH_URL || "https://mohikontok.com"}/#scheduler"
                 style="display:inline-block; background:#ee7234; color:#ffffff; text-decoration:none; font-weight:600; padding:12px 28px; border-radius:8px;">
                Book a Session
              </a>
            </p>
            <p style="color:#a0a0aa; font-size:13px;">${STUDIO_LOCATION}</p>
            <hr style="border:none; border-top:1px solid rgba(255,255,255,0.08); margin:24px 0;" />
            <p style="color:#74747e; font-size:12px;">You're receiving this because an account was created with this email address at Mohikontok Sound Lab.</p>
          </td></tr>
        </table>
      </td></tr>
    </table>
  </body>
</html>`.trim();

  const text = `${greeting}

Welcome to Mohikontok Sound Lab. Your account is ready. You can now reserve rehearsal, recording, and mastering sessions at our Bronx studio.

Book a session: ${process.env.NEXTAUTH_URL || "https://mohikontok.com"}/#scheduler

Location: ${STUDIO_LOCATION}

You're receiving this because an account was created with this email address at Mohikontok Sound Lab.`.trim();

  await sendEmail({
    to: email,
    subject: "Welcome to Mohikontok Sound Lab!",
    html,
    text,
  });
}

export interface BookingConfirmationEmailInput {
  name?: string | null;
  email: string;
  serviceName: string;
  date: string;
  timeSlot: string;
  transactionId?: string | null;
}

export async function sendBookingConfirmationEmail({
  name,
  email,
  serviceName,
  date,
  timeSlot,
  transactionId,
}: BookingConfirmationEmailInput): Promise<void> {
  const greeting = name ? `Hi ${name},` : "Hi there,";
  const receiptLine = transactionId ? `<p style="color:#a0a0aa; font-size:13px;">Receipt reference: <strong>${transactionId}</strong></p>` : "";
  const receiptText = transactionId ? `\nReceipt reference: ${transactionId}` : "";

  const html = `
<!DOCTYPE html>
<html>
  <body style="font-family: Arial, Helvetica, sans-serif; background:#0b0b0f; margin:0; padding:0;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#0b0b0f; padding:32px 0;">
      <tr><td align="center">
        <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="background:#13131a; border:1px solid rgba(255,255,255,0.06); border-radius:16px; overflow:hidden;">
          <tr><td style="background:#ee7234; padding:24px 32px;">
            <h1 style="margin:0; color:#ffffff; font-size:20px; letter-spacing:0.02em;">Mohikontok Sound Lab</h1>
          </td></tr>
          <tr><td style="padding:32px; color:#e8e8ea; font-size:15px; line-height:1.6;">
            <p>${greeting}</p>
            <p>Your booking is confirmed. Here are the details:</p>
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:16px 0; font-size:14px;">
              <tr><td style="padding:8px 0; color:#a0a0aa; width:120px;">Service</td><td style="padding:8px 0; color:#ffffff; font-weight:600;">${serviceName}</td></tr>
              <tr><td style="padding:8px 0; color:#a0a0aa;">Date</td><td style="padding:8px 0; color:#ffffff;">${date}</td></tr>
              <tr><td style="padding:8px 0; color:#a0a0aa;">Time</td><td style="padding:8px 0; color:#ffffff;">${timeSlot}</td></tr>
              <tr><td style="padding:8px 0; color:#a0a0aa;">Location</td><td style="padding:8px 0; color:#ffffff;">${STUDIO_LOCATION}</td></tr>
            </table>
            <p style="text-align:center; margin:28px 0;">
              <a href="${process.env.NEXTAUTH_URL || "https://mohikontok.com"}/#scheduler"
                 style="display:inline-block; background:#ee7234; color:#ffffff; text-decoration:none; font-weight:600; padding:12px 28px; border-radius:8px;">
                View / Book Another Session
              </a>
            </p>
            ${receiptLine}
            <hr style="border:none; border-top:1px solid rgba(255,255,255,0.08); margin:24px 0;" />
            <p style="color:#74747e; font-size:12px;">Please arrive 10–15 minutes before your scheduled session. Need to cancel? Notify us at least 24 hours in advance.</p>
          </td></tr>
        </table>
      </td></tr>
    </table>
  </body>
</html>`.trim();

  const text = `${greeting}

Your booking is confirmed. Here are the details:

Service: ${serviceName}
Date: ${date}
Time: ${timeSlot}
Location: ${STUDIO_LOCATION}${receiptText}

View / book another session: ${process.env.NEXTAUTH_URL || "https://mohikontok.com"}/#scheduler

Please arrive 10–15 minutes before your scheduled session. Need to cancel? Notify us at least 24 hours in advance.`.trim();

  await sendEmail({
    to: email,
    subject: "Your Mohikontok session is confirmed",
    html,
    text,
  });
}
import nodemailer from "nodemailer";

export interface SendContactEmailPayload {
  toEmail: string;
  senderName: string;
  senderEmail: string;
  subject: string;
  message: string;
}

export async function sendContactEmail({
  toEmail,
  senderName,
  senderEmail,
  subject,
  message,
}: SendContactEmailPayload): Promise<void> {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT) || 465;
  const secure = process.env.SMTP_SECURE === "true";
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const fromName = process.env.SMTP_FROM_NAME || "Contact Form";
  const fromEmail = process.env.SMTP_FROM_EMAIL || user;
  const replyToAddr = process.env.SMTP_REPLY_TO || senderEmail;
  const siteUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
  const siteDomain = new URL(siteUrl).host;

  if (!host || !user || !pass) {
    throw new Error(
      "SMTP configuration is missing. Please set SMTP_HOST, SMTP_USER, and SMTP_PASS environment variables.",
    );
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
    connectionTimeout: Number(process.env.SMTP_CONNECTION_TIMEOUT_MS) || 20000,
    greetingTimeout: Number(process.env.SMTP_GREETING_TIMEOUT_MS) || 20000,
    socketTimeout: Number(process.env.SMTP_SOCKET_TIMEOUT_MS) || 60000,
  });

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>New Contact Message</title>
</head>
<body style="margin:0;padding:0;background:#f7f5f2;font-family:Georgia,serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:32px 16px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border:1px solid #ddd8d0;border-radius:12px;overflow:hidden;">
          <!-- Header -->
          <tr>
            <td style="background:#b34c53;padding:28px 32px;">
              <p style="margin:0;color:#fff;font-family:Georgia,serif;font-size:11px;letter-spacing:2px;text-transform:uppercase;opacity:0.75;">新しいお問い合わせ</p>
              <h1 style="margin:6px 0 0;color:#ffffff;font-family:Georgia,serif;font-size:22px;font-weight:bold;">New Contact Message</h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:32px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding-bottom:20px;">
                    <p style="margin:0 0 4px;font-size:11px;font-family:monospace;color:#948d85;letter-spacing:1px;text-transform:uppercase;">From</p>
                    <p style="margin:0;font-size:16px;color:#2c2825;font-weight:bold;">${senderName}</p>
                    <a href="mailto:${senderEmail}" style="font-size:13px;color:#b34c53;font-family:monospace;text-decoration:none;">${senderEmail}</a>
                  </td>
                </tr>
                <tr>
                  <td style="padding-bottom:24px;border-bottom:1px solid #e8e4de;">
                    <p style="margin:0 0 4px;font-size:11px;font-family:monospace;color:#948d85;letter-spacing:1px;text-transform:uppercase;">Subject</p>
                    <p style="margin:0;font-size:15px;color:#2c2825;font-weight:bold;">${subject}</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding-top:24px;">
                    <p style="margin:0 0 12px;font-size:11px;font-family:monospace;color:#948d85;letter-spacing:1px;text-transform:uppercase;">Message</p>
                    <div style="background:#f7f5f2;border-left:3px solid #b34c53;padding:16px 20px;border-radius:0 6px 6px 0;">
                      <p style="margin:0;font-size:14px;color:#2c2825;line-height:1.75;white-space:pre-wrap;">${message.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</p>
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:20px 32px;border-top:1px solid #e8e4de;background:#f7f5f2;">
              <p style="margin:0;font-size:11px;font-family:monospace;color:#b0a89e;text-align:center;">
                Sent via contact form · ${siteDomain}
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

  await transporter.sendMail({
    from: `"${fromName}" <${fromEmail}>`,
    to: toEmail,
    replyTo: replyToAddr,
    subject: `[Contact Form] ${subject}`,
    html,
    text: `From: ${senderName} <${senderEmail}>\nSubject: ${subject}\n\n${message}`,
  });
}

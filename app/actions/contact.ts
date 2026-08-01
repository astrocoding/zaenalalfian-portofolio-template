"use server";

import { prisma } from "@/lib/prisma";
import { sendContactEmail } from "@/lib/email";

export interface ContactFormPayload {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface ContactFormResult {
  success: boolean;
  error?: string;
  /** Gmail address from contacts table — available even on failure for fallback mailto link */
  gmail?: string | null;
}

export async function sendContactMessageAction(
  payload: ContactFormPayload,
): Promise<ContactFormResult> {
  const { name, email, subject, message } = payload;

  // Basic server-side validation
  if (!name.trim() || !email.trim() || !subject.trim() || !message.trim()) {
    return { success: false, error: "All fields are required." };
  }

  // Fetch recipient gmail early — also needed in error fallback
  let fallbackGmail: string | null = null;
  try {
    const contact = await prisma.contact.findFirst({
      select: { gmail: true },
    });
    fallbackGmail = contact?.gmail ?? null;
  } catch {
    // non-fatal — proceed without fallback
  }

  if (!fallbackGmail) {
    return {
      success: false,
      gmail: null,
      error:
        "Recipient email is not configured. Please try again later or contact directly.",
    };
  }

  try {
    await sendContactEmail({
      toEmail: fallbackGmail,
      senderName: name.trim(),
      senderEmail: email.trim(),
      subject: subject.trim(),
      message: message.trim(),
    });

    return { success: true, gmail: fallbackGmail };
  } catch (err) {
    console.error("[sendContactMessageAction] Failed to send email:", err);
    return {
      success: false,
      gmail: fallbackGmail,
      error:
        "Failed to send your message. Please try again or contact directly via email.",
    };
  }
}

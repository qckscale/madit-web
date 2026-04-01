import { getEmailClient } from "@mi/lib/email";
import { NextResponse } from "next/server";

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const name = typeof body.name === "string" ? body.name.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim() : "";
    const subject = typeof body.subject === "string" ? body.subject.trim() : "";
    const message = typeof body.message === "string" ? body.message.trim() : "";

    if (!name || !email || !subject || !message) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return new NextResponse("Invalid email address", { status: 400 });
    }

    const resend = getEmailClient();

    const { error } = await resend.emails.send({
      from: "MadIT <web@contact.madit.se>",
      to: ["daniel.moquist@madit.se"],
      subject: "Contact - MadIT.se",
      html: `
        <p>Services they're looking for: ${escapeHtml(subject)}</p>
        <p>From: ${escapeHtml(name)}</p>
        <p>Email: ${escapeHtml(email)}</p>
        <p>Message: ${escapeHtml(message)}</p>
      `,
    });

    if (error) {
      console.error(error);
      return new NextResponse("Email not sent!", {
        status: 400,
        headers: { "content-type": "application/json" },
      });
    }

    return new NextResponse("Email sent!", {
      headers: { "content-type": "application/json" },
    });
  } catch (err) {
    console.error(err);
    return new NextResponse("Email not sent!", {
      status: 400,
      headers: { "content-type": "application/json" },
    });
  }
}

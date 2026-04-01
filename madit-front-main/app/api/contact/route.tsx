import { getEmailClient } from "@mi/lib/email";
import { NextResponse } from "next/server";

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
      replyTo: email,
      subject: "Contact - MadIT.se",
      text: [
        `Services they're looking for: ${subject}`,
        `From: ${name}`,
        `Email: ${email}`,
        ``,
        `Message:`,
        message,
      ].join("\n"),
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

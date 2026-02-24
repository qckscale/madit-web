import { client } from "@mi/lib/email";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const message = {
      senderAddress: "DoNotReply@mail.madit.se",
      content: {
        subject: `Contact - MadIT.se`,
        html: `
        <p>Services they're looking for: ${body.subject}</p>
        <p>From: ${body.name}</p>
        <p>Email: ${body.email}</p>
        <p>Message: ${body.message}</p>
      `,
      },
      recipients: {
        to: [
          {
            address: "daniel.moquist@madit.se",
            displayName: "Daniel Moquist",
          },
        ],
      },
    };

    const poller = await client.beginSend(message);
    await poller.pollUntilDone();
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

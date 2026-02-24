import { client } from "@mi/sanity";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = await Promise.all(
      body.requests?.map((request: any) => client.fetch(request))
    );
    return new NextResponse(data as any, {
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

import { client } from "@mi/sanity/client";
import { SEARCH_GROQ } from "@mi/sanity/calls";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const query = searchParams.get("q")?.trim() || "";
  const locale = searchParams.get("locale") === "sv" ? "sv" : "en";

  if (query.length < 2) {
    return NextResponse.json({
      articles: [],
      services: [],
      work: [],
      pages: [],
    });
  }

  const results = await client.fetch(
    SEARCH_GROQ(locale),
    { searchTerm: `${query}*` },
    { next: { revalidate: 60 } }
  );

  return NextResponse.json(results);
}

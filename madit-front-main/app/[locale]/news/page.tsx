import { ARTICLES_GROQ, client } from "@mi/sanity";
import { News } from "@mi/shared/components/News";

export default async function NewsPage({
  params,
}: {
  params: { locale: "en" | "sv" };
}) {
  const [articles] = await Promise.all([
    client.fetch<any[]>({
      query: ARTICLES_GROQ(0, 20, params.locale || "en"),
      config: {
        next: { revalidate: 60 },
      },
    }),
  ]);

  return (
    <>
      <News articles={articles} />
    </>
  );
}

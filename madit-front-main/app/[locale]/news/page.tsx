import { ARTICLES_GROQ, client } from "@mi/sanity";
import { News } from "@mi/shared/components/News";

export default async function NewsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const [articles] = await Promise.all([
    client.fetch<any[]>(ARTICLES_GROQ(0, 20, locale || "en"), {}, { next: { revalidate: 60 } }),
  ]);

  return (
    <>
      <News articles={articles} />
    </>
  );
}

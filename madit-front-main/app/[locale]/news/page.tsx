import { ARTICLES_GROQ, client } from "@mi/sanity";
import { News } from "@mi/shared/components/News";
import { buildMetadata } from "@mi/shared/utils/seo/metadata";
import { translate } from "@mi/shared/utils/lang/translate";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return buildMetadata({
    fallbackTitle: translate("news", locale as "sv" | "en"),
    fallbackDescription: translate("news_description", locale as "sv" | "en"),
    locale,
    path: "/news",
  });
}

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

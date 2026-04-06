import { ARTICLES_GROQ, ARTICLES_COUNT_GROQ, client } from "@mi/sanity";
import { News } from "@mi/shared/components/News";
import { Pagination } from "@mi/shared/components/Pagination";
import { buildMetadata } from "@mi/shared/utils/seo/metadata";
import { translate } from "@mi/shared/utils/lang/translate";

const ITEMS_PER_PAGE = 9;

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
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { locale } = await params;
  const { page: pageParam } = await searchParams;
  const currentPage = Math.max(1, parseInt(pageParam || "1", 10) || 1);

  const [articles, totalCount] = await Promise.all([
    client.fetch<any[]>(
      ARTICLES_GROQ(currentPage - 1, ITEMS_PER_PAGE, locale || "en"),
      {},
      { next: { revalidate: 60 } }
    ),
    client.fetch<number>(ARTICLES_COUNT_GROQ, {}, { next: { revalidate: 60 } }),
  ]);

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  return (
    <>
      <News articles={articles} locale={locale as "en" | "sv"} />
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          locale={locale}
        />
      )}
    </>
  );
}

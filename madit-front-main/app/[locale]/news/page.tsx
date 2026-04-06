import {
  ARTICLES_GROQ,
  ARTICLES_COUNT_GROQ,
  CATEGORIES_GROQ,
  client,
} from "@mi/sanity";
import { News } from "@mi/shared/components/News";
import { Pagination } from "@mi/shared/components/Pagination";
import { CategoryFilter } from "@mi/shared/components/CategoryFilter";
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
  searchParams: Promise<{ page?: string; category?: string }>;
}) {
  const { locale } = await params;
  const { page: pageParam, category } = await searchParams;
  const currentPage = Math.max(1, parseInt(pageParam || "1", 10) || 1);
  const activeCategory = category || undefined;

  const [articles, totalCount, categories] = await Promise.all([
    client.fetch<any[]>(
      ARTICLES_GROQ(currentPage - 1, ITEMS_PER_PAGE, locale || "en", activeCategory),
      {},
      { next: { revalidate: 60 } }
    ),
    client.fetch<number>(
      ARTICLES_COUNT_GROQ(activeCategory),
      {},
      { next: { revalidate: 60 } }
    ),
    client.fetch<any[]>(CATEGORIES_GROQ, {}, { next: { revalidate: 60 } }),
  ]);

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  return (
    <>
      {categories.length > 0 && (
        <CategoryFilter
          categories={categories}
          activeCategory={activeCategory}
          locale={locale as "en" | "sv"}
        />
      )}
      <News articles={articles} locale={locale as "en" | "sv"} />
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          locale={locale}
          category={activeCategory}
        />
      )}
    </>
  );
}

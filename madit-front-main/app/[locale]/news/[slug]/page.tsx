import { BLOG_SEO, GET_ONE_ARTICLES_GROQ, client } from "@mi/sanity";
import Author from "@mi/shared/components/Author";
import BlockContent from "@mi/shared/components/BlockContent";
import { buildMetadata } from "@mi/shared/utils/seo/metadata";
import { articleJsonLd } from "@mi/shared/utils/seo/jsonld";
import { notFound } from "next/navigation";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}) {
  const { slug, locale } = await params;
  const article = await client.fetch<any>(
    BLOG_SEO(locale || "en"),
    { slug },
    { next: { revalidate: 60 } },
  );
  if (!article) return {};
  return buildMetadata({
    seo: article.seo,
    fallbackTitle: article.title,
    fallbackDescription: article.ingress,
    fallbackImageUrl: article.thumbnailUrl,
    locale: locale || "en",
    path: `/news/${slug}`,
    type: "article",
  });
}

export default async function NewsDetailPage({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}) {
  const { slug, locale } = await params;
  const [page] = await Promise.all([
    client.fetch<any>(GET_ONE_ARTICLES_GROQ(locale || "en"), { slug }, { next: { revalidate: 60 } }),
  ]);
  if (!page) notFound();
  const jsonLd = articleJsonLd({
    headline: page.title,
    datePublished: page.publishedAt,
    authorName: page.author?.name,
    imageUrl: page.thumbnail,
  });
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="container-width container-width-page small">
        <h1 className="heading-2">{page.title}</h1>
        <BlockContent content={page.content}></BlockContent>
        {page.author && (
          <Author {...page.author} publishedAt={page.publishedAt} />
        )}
      </div>
    </>
  );
}

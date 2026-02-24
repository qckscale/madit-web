import { BLOG_SEO, GET_ONE_ARTICLES_GROQ, client } from "@mi/sanity";
import Author from "@mi/shared/components/Author";
import BlockContent from "@mi/shared/components/BlockContent";
import { notFound } from "next/navigation";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}) {
  const { slug, locale } = await params;
  const article = await client.fetch<any>(
    BLOG_SEO(slug, locale || "en"),
    {},
    { next: { revalidate: 60 } },
  );
  return {
    title: article.seo?.title || article.title,
    description: article.seo?.content || article.ingress,
  };
}

export default async function NewsDetailPage({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}) {
  const { slug, locale } = await params;
  const [page] = await Promise.all([
    client.fetch<any>(GET_ONE_ARTICLES_GROQ(slug, locale || "en"), {}, { next: { revalidate: 60 } }),
  ]);
  if (!page) notFound();
  return (
    <>
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

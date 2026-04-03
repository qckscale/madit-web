import { PAGE_GROQ, PAGE_SEO, client } from "@mi/sanity";
import BlockContent from "@mi/shared/components/BlockContent";
import { buildMetadata } from "@mi/shared/utils/seo/metadata";
import { notFound } from "next/navigation";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}) {
  const { slug, locale } = await params;
  const page = await client.fetch<any>(
    PAGE_SEO(locale || "en"),
    { slug },
    { next: { revalidate: 60 } },
  );
  if (!page) return {};
  return buildMetadata({
    seo: page.seo,
    fallbackTitle: page.title,
    fallbackImageUrl: page.mainImageUrl,
    locale: locale || "en",
    path: `/page/${slug}`,
  });
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}) {
  const { slug, locale } = await params;
  const [page] = await Promise.all([
    client.fetch<any>(PAGE_GROQ(locale || "en"), { slug }, { next: { revalidate: 60 } }),
  ]);
  if (!page) notFound();

  return (
    <>
      <div className="container-width container-width-page small">
        <h1 className="heading-2">{page.title}</h1>
        <BlockContent content={page.content}></BlockContent>
      </div>
    </>
  );
}

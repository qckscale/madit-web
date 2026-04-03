import { GET_ONE_CUSTOMER_CASE, WORK_SEO, client } from "@mi/sanity";
import BlockContent from "@mi/shared/components/BlockContent";
import { buildMetadata } from "@mi/shared/utils/seo/metadata";
import { notFound } from "next/navigation";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}) {
  const { slug, locale } = await params;
  const work = await client.fetch<any>(
    WORK_SEO(locale),
    { slug },
    { next: { revalidate: 60 } },
  );
  if (!work) notFound();
  return buildMetadata({
    seo: work.seo,
    fallbackTitle: work.title,
    fallbackDescription: work.ingress,
    fallbackImageUrl: work.thumbnailUrl,
    locale,
    path: `/customer-case/${slug}`,
  });
}

export default async function CustomerCaseDetailPage({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}) {
  const { slug, locale } = await params;
  const [page] = await Promise.all([
    client.fetch<any>(GET_ONE_CUSTOMER_CASE(locale), { slug }, { next: { revalidate: 60 } }),
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

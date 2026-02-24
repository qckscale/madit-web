import { GET_ONE_CUSTOMER_CASE, WORK_SEO, client } from "@mi/sanity";
import BlockContent from "@mi/shared/components/BlockContent";
import { notFound } from "next/navigation";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}) {
  const { slug, locale } = await params;
  const service = await client.fetch<any>(
    WORK_SEO(slug, locale),
    {},
    { next: { revalidate: 60 } },
  );
  if (!service) notFound();

  return {
    title: service.seo?.title || service.title,
    description: service.seo?.content || service.ingress,
  };
}

export default async function CustomerCaseDetailPage({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}) {
  const { slug, locale } = await params;
  const [page] = await Promise.all([
    client.fetch<any>(GET_ONE_CUSTOMER_CASE(slug, locale), {}, { next: { revalidate: 60 } }),
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

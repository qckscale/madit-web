import { GET_ONE_SERVICE_GROQ, SERVICE_SEO, client } from "@mi/sanity";
import BlockContent from "@mi/shared/components/BlockContent";
import { buildMetadata } from "@mi/shared/utils/seo/metadata";
import { translate } from "@mi/shared/utils/lang/translate";
import { notFound } from "next/navigation";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}) {
  const { slug, locale } = await params;
  const service = await client.fetch<any>(
    SERVICE_SEO(locale),
    { slug },
    { next: { revalidate: 60 } },
  );
  if (!service) notFound();
  return buildMetadata({
    seo: service.seo,
    fallbackTitle: service.title,
    fallbackDescription: service.ingress,
    locale,
    path: `/service/${slug}`,
  });
}

const DURATION_KEYS: Record<string, string> = {
  "2h": "2h",
  full_day: "full_day",
  half_day: "half_day",
  multi_day: "multi_day",
};

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}) {
  const { slug, locale } = await params;
  const loc = (locale || "en") as "sv" | "en";
  const page = await client.fetch<any>(
    GET_ONE_SERVICE_GROQ(locale),
    { slug },
    { next: { revalidate: 60 } },
  );
  if (!page) notFound();

  return (
    <>
      <div className="container-width container-width-page small">
        <h1 className="heading-2">{page.title}</h1>
        <BlockContent content={page.content} />

        {page.category === "training" && (page.duration || page.targetAudience || page.prerequisites) && (
          <div className="service-details">
            {page.duration && (
              <div className="service-details__item">
                <strong>{translate("duration", loc)}</strong>
                <span>{translate(DURATION_KEYS[page.duration] || page.duration, loc)}</span>
              </div>
            )}
            {page.targetAudience && (
              <div className="service-details__item">
                <strong>{translate("target_audience", loc)}</strong>
                <span>{page.targetAudience}</span>
              </div>
            )}
            {page.prerequisites && (
              <div className="service-details__item">
                <strong>{translate("prerequisites", loc)}</strong>
                <span>{page.prerequisites}</span>
              </div>
            )}
          </div>
        )}

        {page.category === "products" && (page.deliverables || page.estimatedTimeline || page.startingPrice) && (
          <div className="service-details">
            {page.estimatedTimeline && (
              <div className="service-details__item">
                <strong>{translate("estimated_timeline", loc)}</strong>
                <span>{page.estimatedTimeline}</span>
              </div>
            )}
            {page.startingPrice && (
              <div className="service-details__item">
                <strong>{translate("starting_price", loc)}</strong>
                <span>{page.startingPrice}</span>
              </div>
            )}
            {page.deliverables && (
              <div className="service-details__deliverables">
                <strong>{translate("deliverables", loc)}</strong>
                <BlockContent content={page.deliverables} />
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}

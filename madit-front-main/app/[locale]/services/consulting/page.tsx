import { SERVICE_GROQ, SERVICE_CATEGORY_PAGE_GROQ, client } from "@mi/sanity";
import { Services } from "@mi/shared/components/Services";
import BlockContent from "@mi/shared/components/BlockContent";
import { buildMetadata } from "@mi/shared/utils/seo/metadata";
import { translate } from "@mi/shared/utils/lang/translate";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const categoryPage = await client.fetch<any>(
    SERVICE_CATEGORY_PAGE_GROQ(locale),
    { category: "consulting" },
    { next: { revalidate: 60 } },
  );
  return buildMetadata({
    seo: categoryPage?.seo,
    fallbackTitle: categoryPage?.title || translate("consulting", locale as "sv" | "en"),
    fallbackDescription: categoryPage?.ingress || translate("consulting_description", locale as "sv" | "en"),
    locale,
    path: "/services/consulting",
  });
}

export default async function ConsultingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const loc = (locale || "en") as "sv" | "en";
  const [categoryPage, services] = await Promise.all([
    client.fetch<any>(SERVICE_CATEGORY_PAGE_GROQ(loc), { category: "consulting" }, { next: { revalidate: 60 } }),
    client.fetch<any[]>(SERVICE_GROQ(loc), {}, { next: { revalidate: 60 } }),
  ]);

  const consulting = services.filter((s) => s.category === "consulting");

  return (
    <>
      {categoryPage?.content && (
        <div className="container-width container-width-page small">
          <h1 className="heading-2">{categoryPage.title || translate("consulting", loc)}</h1>
          <BlockContent content={categoryPage.content} />
        </div>
      )}
      <Services
        sectionTitle={!categoryPage?.content ? (categoryPage?.title || translate("consulting", loc)) : undefined}
        services={consulting}
        topMargin={false}
        locale={loc}
      />
    </>
  );
}

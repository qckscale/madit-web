import { SERVICE_CATEGORY_PAGES_GROQ, client } from "@mi/sanity";
import { Services } from "@mi/shared/components/Services";
import { buildMetadata } from "@mi/shared/utils/seo/metadata";
import { translate } from "@mi/shared/utils/lang/translate";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return buildMetadata({
    fallbackTitle: translate("services", locale as "sv" | "en"),
    fallbackDescription: translate("services_description", locale as "sv" | "en"),
    locale,
    path: "/services",
  });
}

const CATEGORY_URLS: Record<string, string> = {
  consulting: "service/azure-consulting",
  training: "services/training",
  products: "services/products",
};

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const loc = (locale || "en") as "sv" | "en";
  const categoryPages = await client.fetch<any[]>(
    SERVICE_CATEGORY_PAGES_GROQ(loc),
    {},
    { next: { revalidate: 60 } },
  );

  const categoryCards = categoryPages.map((cp) => ({
    title: cp.title || translate(cp.category, loc),
    ingress: cp.ingress || translate(`${cp.category}_description`, loc),
    icon: cp.icon || null,
    url: CATEGORY_URLS[cp.category] || "services",
  }));

  return (
    <Services
      services={categoryCards}
      topMargin={false}
      locale={loc}
    />
  );
}

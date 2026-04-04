import { SERVICE_GROQ, client } from "@mi/sanity";
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

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const loc = (locale || "en") as "sv" | "en";
  const services = await client.fetch<any[]>(
    SERVICE_GROQ(loc),
    {},
    { next: { revalidate: 60 } },
  );

  const consulting = services.find((s) => s.category === "consulting");
  const trainingCount = services.filter((s) => s.category === "training").length;
  const productsCount = services.filter((s) => s.category === "products").length;

  const categoryCards = [
    {
      title: consulting?.title || translate("consulting", loc),
      ingress: consulting?.ingress || translate("consulting_description", loc),
      icon: consulting?.icon || null,
      url: consulting ? `service/${consulting.url}` : "services",
    },
    {
      title: translate("training", loc),
      ingress: translate("training_description", loc),
      icon: null,
      url: "services/training",
    },
    {
      title: translate("products", loc),
      ingress: translate("products_description", loc),
      icon: null,
      url: "services/products",
    },
  ];

  return (
    <Services
      services={categoryCards}
      topMargin={false}
      locale={loc}
    />
  );
}

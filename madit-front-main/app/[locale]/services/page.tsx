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

const CATEGORIES = ["consulting", "training", "products"] as const;

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

  const grouped = {
    consulting: services.filter((s) => s.category === "consulting"),
    training: services.filter((s) => s.category === "training"),
    products: services.filter((s) => s.category === "products"),
  };

  return (
    <>
      {CATEGORIES.map((cat) =>
        grouped[cat].length > 0 ? (
          <Services
            key={cat}
            sectionId={cat}
            sectionTitle={translate(cat, loc)}
            sectionDescription={translate(`${cat}_description`, loc)}
            services={grouped[cat]}
            topMargin={false}
            locale={loc}
          />
        ) : null,
      )}
    </>
  );
}

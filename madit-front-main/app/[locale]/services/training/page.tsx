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
    fallbackTitle: translate("training", locale as "sv" | "en"),
    fallbackDescription: translate("training_description", locale as "sv" | "en"),
    locale,
    path: "/services/training",
  });
}

export default async function TrainingPage({
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

  const training = services.filter((s) => s.category === "training");

  return (
    <Services
      sectionTitle={translate("training", loc)}
      sectionDescription={translate("training_description", loc)}
      services={training}
      topMargin={false}
      locale={loc}
    />
  );
}

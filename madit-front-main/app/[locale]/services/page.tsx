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

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const [services] = await Promise.all([
    client.fetch<any>(SERVICE_GROQ(locale || "en"), {}, { next: { revalidate: 60 } }),
  ]);

  return (
    <>
      <Services topMargin={false} services={services} locale={locale as "en" | "sv"} />
    </>
  );
}

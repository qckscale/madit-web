import { ALL_WORK_GROQ, client } from "@mi/sanity";
import Work from "@mi/shared/components/Work";
import { buildMetadata } from "@mi/shared/utils/seo/metadata";
import { translate } from "@mi/shared/utils/lang/translate";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return buildMetadata({
    fallbackTitle: translate("customer_cases", locale as "sv" | "en"),
    fallbackDescription: translate("customer_cases_description", locale as "sv" | "en"),
    locale,
    path: "/customer-case",
  });
}

export default async function CustomerCase({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const [work] = await Promise.all([
    client.fetch<any>(ALL_WORK_GROQ(locale || "en"), {}, { next: { revalidate: 60 } }),
  ]);

  return (
    <>
      <Work work={work} isHome={false} locale={locale as "en" | "sv"} />
    </>
  );
}

import { ALL_WORK_GROQ, SERVICE_GROQ, client } from "@mi/sanity";
import { Services } from "@mi/shared/components/Services";
import Work from "@mi/shared/components/Work";
import { getLocale, translate } from "@mi/shared/utils/lang/translate";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: `${translate("customer_cases", getLocale())} | MadIT`,
};

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
      <Work work={work} isHome={false} />
    </>
  );
}

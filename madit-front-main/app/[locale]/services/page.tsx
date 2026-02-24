import { SERVICE_GROQ, client } from "@mi/sanity";
import { Services } from "@mi/shared/components/Services";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Services | MadIT",
};

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
      <Services topMargin={false} services={services} />
    </>
  );
}

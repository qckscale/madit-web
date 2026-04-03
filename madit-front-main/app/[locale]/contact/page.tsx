import { SERVICE_GROQ, client } from "@mi/sanity";
import { ContactForm } from "@mi/shared/components/ContactForm";
import Section from "@mi/shared/components/Section";
import { buildMetadata } from "@mi/shared/utils/seo/metadata";
import { translate } from "@mi/shared/utils/lang/translate";
import { notFound } from "next/navigation";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return buildMetadata({
    fallbackTitle: translate("contact", locale as "sv" | "en"),
    fallbackDescription: translate("contact_description", locale as "sv" | "en"),
    locale,
    path: "/contact",
  });
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const [services] = await Promise.all([
    client.fetch<any>(SERVICE_GROQ(locale || "en"), {}, { next: { revalidate: 60 } }),
  ]);
  if (!services) notFound();

  return (
    <div className="container-width container-width-page">
      <ContactForm services={services} />
    </div>
  );
}

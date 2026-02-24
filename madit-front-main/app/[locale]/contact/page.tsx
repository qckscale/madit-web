import { SERVICE_GROQ, client } from "@mi/sanity";
import { ContactForm } from "@mi/shared/components/ContactForm";
import Section from "@mi/shared/components/Section";
import { Metadata } from "next";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Contact | MadIT",
};

export default async function ContactPage({
  params,
}: {
  params: { locale: "en" | "sv" };
}) {
  const [services] = await Promise.all([
    client.fetch<any>({
      query: SERVICE_GROQ(params.locale || "en"),
      config: {
        next: { revalidate: 60 },
      },
    }),
  ]);
  if (!services) notFound();

  return (
    <div className="container-width container-width-page">
      <ContactForm services={services} />
    </div>
  );
}

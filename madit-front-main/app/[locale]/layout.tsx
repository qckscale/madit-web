import { Header } from "@mi/shared/components/Header";
import "../globals.scss";
import { Open_Sans } from "next/font/google";
import { Footer } from "@mi/shared/components/Footer";
import {
  GENERAL_SETTINGS,
  HOME_PAGE_SEO,
  SERVICE_GROQ,
  client,
} from "@mi/sanity";
import { ExternalScripts } from "@mi/shared/components/ExternalScripts";

const openSans = Open_Sans({ subsets: ["latin"] });

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}) {
  const { locale } = await params;
  const generalSettings = await client.fetch<any>(
    HOME_PAGE_SEO(locale),
    {},
    { next: { revalidate: 60 } },
  );
  return {
    title: generalSettings.seo.title,
    description: generalSettings.seo.content,
  };
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const [settings, services] = await Promise.all([
    client.fetch<any>(GENERAL_SETTINGS(locale), {}, { next: { revalidate: 60 } }),
    client.fetch<any>(SERVICE_GROQ(locale), {}, { next: { revalidate: 60 } }),
  ]);

  return (
    <html lang={locale}>
      <body className={openSans.className}>
        <Header />
        {children}
        <Footer footer={settings.footer} services={services} />
        <ExternalScripts cookieSettings={settings.cookieSettings} nonce={""} />
      </body>
    </html>
  );
}

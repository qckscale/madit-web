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
import { buildMetadata } from "@mi/shared/utils/seo/metadata";
import { organizationJsonLd } from "@mi/shared/utils/seo/jsonld";

const openSans = Open_Sans({ subsets: ["latin"] });

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}) {
  const { locale } = await params;
  const data = await client.fetch<any>(
    HOME_PAGE_SEO(locale),
    {},
    { next: { revalidate: 60 } },
  );
  const seo = data.homePageSeo?.seo || data.seo;
  return {
    metadataBase: new URL(process.env.BASE_URL || "https://madit.se"),
    ...buildMetadata({
      seo,
      locale,
      path: "",
    }),
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

  const orgJsonLd = organizationJsonLd({
    phone: settings.footer?.phone,
    email: settings.footer?.email,
    address: settings.footer?.address,
  });

  return (
    <html lang={locale}>
      <body className={openSans.className}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
        <Header />
        {children}
        <Footer footer={settings.footer} services={services} />
        <ExternalScripts cookieSettings={settings.cookieSettings} nonce={""} />
      </body>
    </html>
  );
}

import { SITEMAP_GROQ, client } from "@mi/sanity";
import { MetadataRoute } from "next";
import { i18n } from "@mi/i18n-config";

interface Slug {
  slug: string;
  priority: number;
  lastModified: string;
}

const baseUrl = process.env.BASE_URL;

function alternates(path: string) {
  return {
    languages: Object.fromEntries(
      i18n.locales.map((l) => [l, `${baseUrl}/${l}${path}`]),
    ),
  };
}

async function getSitemap(locale = "sv"): Promise<MetadataRoute.Sitemap> {
  const [{ page, articles, services, work }] = await Promise.all([
    client.fetch<any>(SITEMAP_GROQ(locale), {}, { next: { revalidate: 60 } }),
  ]);

  return [
    ...addSlugPrefixes(page, "page"),
    ...addSlugPrefixes(articles, "news"),
    ...addSlugPrefixes(services, "service"),
    ...addSlugPrefixes(work, "customer-case"),
  ].map((item: Slug) => ({
    url: `${baseUrl}/${locale}/${item.slug}`,
    priority: item.priority,
    lastModified: item.lastModified
      ? new Date(item.lastModified)
      : new Date().toISOString(),
    changeFrequency: "daily" as const,
    alternates: alternates(`/${item.slug}`),
  }));
}

function addSlugPrefixes(slug: Slug[], prefix: string): any[] {
  return slug.map((item: Slug) => ({
    ...item,
    slug: `${prefix}/${item.slug}`,
  }));
}

function staticEntry(path: string): MetadataRoute.Sitemap[number] {
  return {
    url: `${baseUrl}${path}`,
    lastModified: new Date().toISOString(),
    changeFrequency: "daily",
    priority: 1.0,
    alternates: alternates(path.replace(/^\/(sv|en)/, "")),
  };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    const sitemapSv = await getSitemap("sv");
    const sitemapEn = await getSitemap("en");

    return [
      {
        url: `${baseUrl}/`,
        lastModified: new Date().toISOString(),
        changeFrequency: "daily",
        priority: 1.0,
        alternates: alternates(""),
      },
      staticEntry("/sv/services"),
      staticEntry("/en/services"),
      staticEntry("/sv/customer-case"),
      staticEntry("/en/customer-case"),
      staticEntry("/sv/news"),
      staticEntry("/en/news"),
      staticEntry("/sv/contact"),
      staticEntry("/en/contact"),
      ...sitemapSv,
      ...sitemapEn,
    ];
  } catch (err) {
    return [];
  }
}

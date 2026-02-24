import { SITEMAP_GROQ, client } from "@mi/sanity";
import { MetadataRoute } from "next";

interface Slug {
  slug: string;
  priority: number;
  lastModified: string;
}

async function getSitemap(locale = "sv"): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.BASE_URL;

  const [{ page, articles, services, work }] = await Promise.all([
    client.fetch<any>({
      query: SITEMAP_GROQ(locale),
      config: { next: { revalidate: 60 } },
    }),
  ]);

  return [
    ...addSlugPrefixes(page, "page"),
    ...addSlugPrefixes(articles, "news"),
    ...addSlugPrefixes(services, "service"),
    ...addSlugPrefixes(work, "customer-case"),
  ].map((item: Slug) => {
    return {
      url: `${baseUrl}/${locale}/${item.slug}`,
      priority: item.priority,
      lastModified: item.lastModified
        ? new Date(item.lastModified)
        : new Date().toISOString(),
      changeFrequency: "daily",
    };
  }, []);
}

function addSlugPrefixes(slug: Slug[], prefix: string): any[] {
  return slug.map((item: Slug) => ({
    ...slug,
    slug: `${prefix}/${item.slug}`,
  }));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    const baseUrl = process.env.BASE_URL;
    const sitemapSv = await getSitemap("sv");
    const sitemapEn = await getSitemap("en");

    const staticPages: any[] = [
      {
        url: `${baseUrl}/sv/services`,
        lastModified: new Date().toISOString(),
        changeFrequency: "daily",
        priority: 1.0,
      },
      {
        url: `${baseUrl}/en/services`,
        lastModified: new Date().toISOString(),
        changeFrequency: "daily",
        priority: 1.0,
      },
      {
        url: `${baseUrl}/sv/customer-case`,
        lastModified: new Date().toISOString(),
        changeFrequency: "daily",
        priority: 1.0,
      },
      {
        url: `${baseUrl}/en/customer-case`,
        lastModified: new Date().toISOString(),
        changeFrequency: "daily",
        priority: 1.0,
      },
    ];
    return [
      {
        url: `${baseUrl}/`,
        lastModified: new Date().toISOString(),
        changeFrequency: "daily",
        priority: 1.0,
      },
      ...staticPages,
      ...sitemapSv,
      ...sitemapEn,
    ];
  } catch (err) {
    return [];
  }
}

import { Metadata } from "next";
import { i18n } from "@mi/i18n-config";

interface SeoData {
  title?: string;
  content?: string;
  ogImageUrl?: string;
  canonicalUrl?: string;
  noIndex?: boolean;
}

interface BuildMetadataOptions {
  seo?: SeoData;
  fallbackTitle?: string;
  fallbackDescription?: string;
  fallbackImageUrl?: string;
  locale: string;
  path: string;
  type?: "website" | "article";
  publishedAt?: string;
  authorName?: string;
}

const BASE_URL = process.env.BASE_URL || "https://madit.se";

function ogImageUrl(url: string): string {
  return `${url}?w=1200&h=630&fit=crop&auto=format`;
}

export function buildMetadata({
  seo,
  fallbackTitle,
  fallbackDescription,
  fallbackImageUrl,
  locale,
  path,
  type = "website",
  publishedAt,
  authorName,
}: BuildMetadataOptions): Metadata {
  const title = seo?.title || fallbackTitle;
  const description = seo?.content || fallbackDescription;
  const rawImageUrl = seo?.ogImageUrl || fallbackImageUrl;
  const imageUrl = rawImageUrl ? ogImageUrl(rawImageUrl) : undefined;
  const url = `${BASE_URL}/${locale}${path}`;
  const canonical = seo?.canonicalUrl || url;

  const alternates: Metadata["alternates"] = {
    canonical,
    languages: Object.fromEntries(
      i18n.locales.map((l) => [l, `${BASE_URL}/${l}${path}`]),
    ),
  };

  const metadata: Metadata = {
    title,
    description,
    alternates,
    openGraph: {
      title: title || undefined,
      description: description || undefined,
      url,
      siteName: "MadIT",
      locale,
      type,
      ...(imageUrl && {
        images: [{ url: imageUrl, width: 1200, height: 630 }],
      }),
      ...(type === "article" && publishedAt && { publishedTime: publishedAt }),
      ...(type === "article" && authorName && { authors: [authorName] }),
    },
    twitter: {
      card: "summary_large_image",
      title: title || undefined,
      description: description || undefined,
      ...(imageUrl && { images: [imageUrl] }),
    },
  };

  if (seo?.noIndex) {
    metadata.robots = { index: false, follow: true };
  }

  return metadata;
}

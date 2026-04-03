const BASE_URL = process.env.BASE_URL || "https://madit.se";

interface OrganizationProps {
  phone?: string;
  email?: string;
  address?: string;
}

export function organizationJsonLd({ phone, email, address }: OrganizationProps) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "MadIT Consulting AB",
    url: BASE_URL,
    logo: `${BASE_URL}/logotype.svg`,
    ...(phone && { telephone: phone }),
    ...(email && { email }),
    ...(address && {
      address: {
        "@type": "PostalAddress",
        streetAddress: address,
      },
    }),
  };
}

interface ArticleProps {
  headline: string;
  datePublished?: string;
  authorName?: string;
  imageUrl?: string;
}

export function articleJsonLd({ headline, datePublished, authorName, imageUrl }: ArticleProps) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline,
    ...(datePublished && { datePublished }),
    ...(authorName && { author: { "@type": "Person", name: authorName } }),
    ...(imageUrl && { image: imageUrl }),
    publisher: {
      "@type": "Organization",
      name: "MadIT Consulting AB",
      logo: { "@type": "ImageObject", url: `${BASE_URL}/logotype.svg` },
    },
  };
}

interface BreadcrumbItem {
  name: string;
  path?: string;
}

export function breadcrumbJsonLd(locale: string, items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      ...(item.path && { item: `${BASE_URL}/${locale}${item.path}` }),
    })),
  };
}

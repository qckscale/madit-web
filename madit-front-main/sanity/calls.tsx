export const FOOTER_GROQ = (locale = "en") => `
  ...,
  phone,
  address,
  email,
  pagesOfInterest[]-> {
    "title": title.${locale},
    "link": slug.current
  },
  "copyrightText": copyrightText.${locale}, 
`;

export const PAGE_GROQ = (url: string, locale = "en") => `
*[_type == "page" && slug.current == "${url}"][0] {
  "title": title.${locale},
  "url": slug.current,
  "content": body.${locale},
  "seo": ${LOCALIZED_SEO(locale)}
}
`;

export const LOCALIZED_SEO = (locale = "en") => `
  seo {
    "content": content.${locale},
    "title": title.${locale}
  }
`;

export const GENERAL_SETTINGS = (locale = "en") => `
*[_type == "generalSettings"][0] {
  ...,
  ${LOCALIZED_SEO(locale)},
  cookieSettings {
    "message": message.${locale},
    "ctaText": ctaText.${locale},
    "linkText": linkText.${locale},
    "link": link->slug.current,
  },
  footer-> {
    ${FOOTER_GROQ(locale)}
  },
  services[]-> {
    "title": title.${locale},
    "ingress": ingress.${locale},
  }
}`;

export const HOME_PAGE_SETTINGS = (locale = "en") => `
*[_type == "generalSettings"][0] {
  homePage-> {
    ...,
    "heroImage": heroImage.asset->url,
    "newsTitle": newsTitle.${locale},
    "title": title.${locale},
    "ctaPrimary": ctaPrimary.${locale},
    "ctaSecondary": ctaSecondary.${locale},
    "serviceTitle": serviceTitle.${locale},
    "testimonialTitle": testimonialTitle.${locale},
    "testimonialSubtitle": testimonialSubtitle.${locale},
    services[][0...6]-> {
      ...,
      "icon": icon.asset->url,
      "title": title.${locale},
      "ingress": ingress.${locale},
      "url": slug.current
    },
  },
}`;

export const HOME_PAGE_SEO = (locale = "en") => `
*[_type == "generalSettings"][0] {
  ${LOCALIZED_SEO(locale)},
}`;

export const WORK_SEO = (url: string, locale = "en") => `
*[_type == "work" && slug.current == "${url}"][0] {
  "seo": ${LOCALIZED_SEO(locale)},
  "title": title.${locale},
  "ingress": ingress.${locale}
}`;
export const SERVICE_SEO = (url: string, locale = "en") => `
*[_type == "services" && slug.current == "${url}"][0] {
  "seo": ${LOCALIZED_SEO(locale)},
  "title": title.${locale},
  "ingress": ingress.${locale}
}`;

export const BLOG_SEO = (url: string, locale = "en") => `
*[_type == "post" && slug.current == "${url}"][0] {
  "seo": ${LOCALIZED_SEO(locale)},
  "title": title.${locale}, 
  "ingress": ingress.${locale}
}`;

export const PAGE_SEO = (url: string, locale = "en") => `
*[_type == "page" && slug.current == "${url}"][0] {
  "seo": ${LOCALIZED_SEO(locale)},
  "title": title.${locale},
  "ingress": ingress.${locale}
}`;

export const SERVICE_GROQ = (locale = "en") => `
*[_type == "services"] | order(order asc) {
  "title": title.${locale},
  "icon": icon.asset->url,
  "ingress": ingress.${locale},
  "url": slug.current,
  "content": content.${locale},
}`;

export const GET_ONE_CUSTOMER_CASE = (url: string, locale = "en") => `
*[_type == "work" && slug.current == "${url}"][0] {
  "title": title.${locale},
  thumbnail,
  "ingress": ingress.${locale},
  "url": slug.current,
  "content": content.${locale},
}
`;
export const GET_ONE_SERVICE_GROQ = (url: string, locale = "en") => `
*[_type == "services" && slug.current == "${url}"][0] {
  "title": title.${locale},
  thumbnail,
  "ingress": ingress.${locale},
  "url": slug.current,
  "content": content.${locale},
}
`;
export const GET_ONE_ARTICLES_GROQ = (url: string, locale = "en") => `
*[_type == "post" && slug.current == "${url}"][0] {
  "title": title.${locale},
  "url": slug.current,
  "ingress": ingress.${locale},
  "thumbnail": thumbnail.asset->url,
  categories[]-> {
    title,
    "url": slug.current
  },
  publishedAt,
  author-> {
    name,
    "title": title.${locale},
    bio,
    "image": image.asset->url
  },
  "content": body.${locale}
}
`;

export const ARTICLES_GROQ = (page = 0, itemsPerPage = 12, locale = "en") => `
*[_type == "post"] | order(dateTime(publishedAt) desc) [${
  page * itemsPerPage
}...${page + itemsPerPage}] {
  "title": title.${locale},
  "url": slug.current,
  "author": author->name,
  "ingress": ingress.${locale},
  "thumbnail": thumbnail.asset->url,
  categories[]-> {
    title,
    "url": slug.current
  },
  publishedAt,
  "content": ingress.${locale}
}
`;

export const WORK_GROQ = (locale = "en") => {
  return `
  *[_type == "work"][0...6] {
    "title": title.${locale},
    "ingress": ingress.${locale},
    "thumbnail": thumbnail.asset->url,
    "url": slug.current
  }`;
};

export const ALL_WORK_GROQ = (locale = "en") => `
*[_type == "work"] {
  "title": title.${locale},
  "ingress": ingress.${locale},
  "thumbnail": thumbnail.asset->url,
  "url": slug.current
}`;

export const HOMEPAGE_GROQ = (locale = "en") => `
{
  "page": ${HOME_PAGE_SETTINGS(locale)},
  "articles": ${ARTICLES_GROQ(0, 3, locale)},
  "work": ${WORK_GROQ(locale)},
  "authors": *[_type == "author"] {
    name,
    "title": title.${locale},
    "image": image.asset->url
  },
  "testimonials": *[_type == "testimonial"] {
    "name": name,
    "title": title.${locale},
    "quote": quote.${locale},
    "thumbnail": thumbnail.asset->url
  }
}`;

export function contact({ name, email, subject, message }: any) {
  return fetch("/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, subject, message }),
  });
}

export const PAGES_SITEMAP = (locale: string) => `
*[_type == "page"] {
  "slug": slug.current,
  "lastModified": _updatedAt,
  "priority": 0.8
}
`;
export const ARTICLES_SITEMAP = (locale: string) => `
*[_type == "post"] {
  "slug": slug.current,
  "lastModified": _updatedAt,
  "priority": 0.8
}
`;

export const SERVICES_SITEMAP = (locale = "sv") => `
*[_type == "services"] {
  "slug": slug.current,
  "lastModified": _updatedAt,
  "priority": 0.9
}
`;
export const WORK_SITEMAP = (locale = "sv") => `
*[_type == "work"] {
  "slug": slug.current,
  "lastModified": _updatedAt,
  "priority": 0.9
}
`;

export const SITEMAP_GROQ = (lang = "sv") => `
{
  "page": ${PAGES_SITEMAP(lang)},
  "articles": ${ARTICLES_SITEMAP(lang)},
  "services": ${SERVICES_SITEMAP(lang)},
  "work": ${WORK_SITEMAP(lang)}
}`;

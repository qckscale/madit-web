import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  try {
  } catch (err) {
    return {
      rules: {
        userAgent: "*",
        allow: "/",
      },
    };
  }
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${process.env.BASE_URL}/sitemap.xml`,
  };
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "cdn.sanity.io" },
    ],
    formats: ["image/webp"],
  },
  experimental: {
    optimizePackageImports: ["@portabletext/react", "date-fns"],
    inlineCss: true,
  },
};

module.exports = nextConfig;

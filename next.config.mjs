import { withPayload } from "@payloadcms/next/withPayload";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

/** @type {import('next').NextConfig} */
const nextConfig = {
  // 'standalone' is only needed for the Docker/VPS deploy.
  // Netlify's adapter does its own bundling and breaks if this is set.
  output: process.env.NETLIFY ? undefined : "standalone",

  // Fixes the stray-lockfile workspace-root warning.
  outputFileTracingRoot: import.meta.dirname,

  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
    qualities: [30, 75],
    minimumCacheTTL: 2678400, // 31 days
  },

  // Old sitemap URLs → the matching homepage sections
  async redirects() {
    return [
      { source: "/:locale(ru|kz|en)/about", destination: "/:locale#about", permanent: true },
      { source: "/:locale(ru|kz|en)/services", destination: "/:locale#services", permanent: true },
      { source: "/:locale(ru|kz|en)/contacts", destination: "/:locale#contact", permanent: true },
    ];
  },
};

export default withPayload(withNextIntl(nextConfig), {
  devBundleServerPackages: false,
});
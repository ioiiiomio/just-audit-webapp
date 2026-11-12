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
    // Payload media is served from our own /api/media/... (relative URLs don't need this).
    // Only list external hosts you actually load images from — "**" lets anyone use
    // /_next/image as a free image proxy on your Vercel bill.
    remotePatterns: [
      { protocol: "https", hostname: "www.justaudit.kz" },
      { protocol: "https", hostname: "justaudit.kz" },
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

  // Security headers for the public site (Payload admin excluded)
  async headers() {
    return [
      {
        source: "/((?!admin).*)",
        headers: [
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Content-Type-Options", value: "nosniff" },
        ],
      },
    ];
  },
};

export default withPayload(withNextIntl(nextConfig), {
  devBundleServerPackages: false,
});

import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/admin", "/api"] },
    sitemap: "https://www.justaudit.kz/sitemap.xml",
    host: "https://www.justaudit.kz", // Yandex main-mirror hint
  };
}
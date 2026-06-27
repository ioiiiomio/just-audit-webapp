// src/app/sitemap.ts
import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const locales = ["ru", "kz"];
  return locales.map((locale) => ({
    url: `https://justaudit.kz/${locale}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 1,
  }));
}

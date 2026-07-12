// src/app/sitemap.ts
import type { MetadataRoute } from "next";
import { getPayload } from "payload";
import config from "@payload-config";

const locales = ["ru", "kz", "en"] as const;

const staticRoutes = [
  { path: "", priority: 1 },
  { path: "/about", priority: 0.8 },
  { path: "/services", priority: 0.8 },
  { path: "/contacts", priority: 0.7 },
  { path: "/careers", priority: 0.6 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = "https://justaudit.kz";

  const staticEntries: MetadataRoute.Sitemap = locales.flatMap((locale) =>
    staticRoutes.map(({ path, priority }) => ({
      url: `${base}/${locale}${path}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority,
    })),
  );

  const payload = await getPayload({ config });

  const { docs: pages } = await payload.find({
    collection: "pages",
    limit: 1000,
    depth: 0,
  });

  const dynamicPageEntries: MetadataRoute.Sitemap = locales.flatMap((locale) =>
    pages.map((page) => ({
      url: `${base}/${locale}/${page.slug}`,
      lastModified: new Date(page.updatedAt),
      changeFrequency: "monthly" as const,
      priority: 0.5,
    })),
  );

  const { docs: certificates } = await payload.find({
    collection: "certificates",
    limit: 1000,
    depth: 0,
  });

  const certificateEntries: MetadataRoute.Sitemap = locales.flatMap((locale) =>
    certificates
      .filter((cert) => cert.title) // skip untitled certificates
      .map((cert) => ({
        url: `${base}/${locale}/certificates/${cert.id}`,
        lastModified: new Date(cert.updatedAt),
        changeFrequency: "yearly" as const,
        priority: 0.3,
      })),
  );

  return [...staticEntries, ...dynamicPageEntries, ...certificateEntries];
}

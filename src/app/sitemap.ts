// src/app/sitemap.ts
import type { MetadataRoute } from "next";
import { getPayload } from "payload";
import config from "@payload-config";
import { routing } from "@/i18n/routing";
import { buildAlternates } from "@/lib/seo";

export const revalidate = 3600; // rebuild at most once an hour

const SITE = "https://www.justaudit.kz";

type Entry = { path: string; lastModified?: string | Date };

// One URL per locale, each listing its language alternates (ru / kk / en / x-default)
function expand({ path, lastModified }: Entry): MetadataRoute.Sitemap {
    return routing.locales.map((locale) => ({
        url: `${SITE}/${locale}${path}`,
        lastModified,
        alternates: { languages: buildAlternates(locale, path).languages },
    }));
}

const newest = (dates: (string | undefined | null)[]) =>
    dates.filter(Boolean).sort().at(-1) ?? undefined;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const payload = await getPayload({ config });
    const base = { depth: 0, pagination: false, locale: "ru" } as const;

    const [pages, projects, articles, videos, topics] = await Promise.all([
        payload.find({ ...base, collection: "pages", select: { slug: true, updatedAt: true } }),
        payload.find({ ...base, collection: "projects", select: { slug: true, updatedAt: true } }),
        payload.find({
            ...base,
            collection: "education-materials",
            where: { contentType: { equals: "article" } },
            select: { slug: true, updatedAt: true },
        }),
        payload.find({
            ...base,
            collection: "education-materials",
            where: { contentType: { equals: "video" } },
            select: { slug: true, updatedAt: true },
        }),
        payload.find({ ...base, collection: "education-topics", select: { slug: true, updatedAt: true } }),
    ]);

    const latestArticle = newest(articles.docs.map((d) => d.updatedAt));
    const latestVideo = newest(videos.docs.map((d) => d.updatedAt));

    const entries: Entry[] = [
        // Static routes: no lastModified rather than a fake "now"
        { path: "" },
        { path: "/team" },
        { path: "/careers" },

        // List pages: dated by their newest item
        { path: "/knowledge", lastModified: newest([latestArticle, latestVideo]) },
        { path: "/knowledge/seminars", lastModified: latestArticle },
        { path: "/knowledge/videos", lastModified: latestVideo },

        // CMS content
        ...pages.docs.map((d) => ({ path: `/${d.slug}`, lastModified: d.updatedAt })),
        ...projects.docs.map((d) => ({ path: `/projects/${d.slug}`, lastModified: d.updatedAt })),
        ...articles.docs.map((d) => ({ path: `/knowledge/seminars/${d.slug}`, lastModified: d.updatedAt })),
        ...videos.docs.map((d) => ({ path: `/knowledge/videos/${d.slug}`, lastModified: d.updatedAt })),
        ...topics.docs.map((d) => ({ path: `/knowledge/videos/${d.slug}`, lastModified: d.updatedAt })),
    ];
    return entries.flatMap(expand);
}
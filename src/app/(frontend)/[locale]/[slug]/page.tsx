// src/app/(frontend)/[locale]/[slug]/page.tsx
import { cache } from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import { getPayload } from "payload";
import config from "@payload-config";
import { RichText } from "@payloadcms/richtext-lexical/react";

import type { Metadata } from "next";
import type { Locale } from "@/i18n/routing";
import { buildAlternates } from "@/lib/seo";

type Props = { params: Promise<{ locale: Locale; slug: string }> };

// cache() dedupes the query: generateMetadata and the page share one DB call per request
const getPage = cache(async (slug: string, locale: Locale) => {
  const payload = await getPayload({ config });
  const { docs } = await payload.find({
    collection: "pages",
    where: { slug: { equals: slug } },
    locale,
    limit: 1,
    depth: 1,
  });
  return docs[0] ?? null;
});

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const page = await getPage(slug, locale);
  if (!page) return {};
  return {
    title: page.metaTitle || page.title || undefined,
    description: page.metaDescription || undefined,
    alternates: buildAlternates(locale, `/${slug}`),
  };
}

export default async function DynamicPage({ params }: Props) {
  const { locale, slug } = await params;
  const page = await getPage(slug, locale);
  if (!page) notFound();

  const image =
      page.featuredImage && typeof page.featuredImage === "object"
          ? page.featuredImage
          : null;

  return (
      <main className="mx-auto max-w-4xl px-4 py-16 md:py-24">
        <h1 className="font-heading text-3xl md:text-5xl text-brand-black mb-8">
          {page.title}
        </h1>
        {image?.url && (
            <Image
                src={image.url}
                alt={image.alt || page.title || ""}
                width={image.width ?? 1600}
                height={image.height ?? 900}
                sizes="(max-width: 896px) 100vw, 896px"
                priority
                className="mb-8 h-auto w-full rounded-lg object-cover"
            />
        )}
        <div className="prose max-w-none font-body">
          {page.content && <RichText data={page.content} />}
        </div>
      </main>
  );
}
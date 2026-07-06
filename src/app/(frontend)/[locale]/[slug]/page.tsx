// src/app/(frontend)/[locale]/[slug]/page.tsx
import { notFound } from "next/navigation";
import { getPayload } from "payload";
import config from "@payload-config";
import { RichText } from "@payloadcms/richtext-lexical/react";

import type { Metadata } from "next";

type Props = { params: Promise<{ locale: string; slug: string }> };

async function getPage(slug: string, locale: string) {
  const payload = await getPayload({ config });
  const { docs } = await payload.find({
    collection: "pages",
    where: { slug: { equals: slug } },
    locale: locale as "ru" | "kz" | "en",
    limit: 1,
    depth: 1,
  });
  return docs[0] ?? null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const page = await getPage(slug, locale);
  if (!page) return {};
  return {
    title: page.metaTitle || page.title || undefined,
    description: page.metaDescription || undefined,
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
        <img
          src={image.url}
          alt={page.title ?? ""}
          className="mb-8 w-full rounded-lg object-cover"
        />
      )}
      <div className="prose max-w-none font-body">
        {page.content && <RichText data={page.content} />}
      </div>
    </main>
  );
}

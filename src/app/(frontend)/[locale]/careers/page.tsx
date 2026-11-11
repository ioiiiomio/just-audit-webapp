// src/app/(frontend)/[locale]/careers/page.tsx
import { cache } from "react";
import { getPayload } from "payload";
import config from "@payload-config";
import { getTranslations } from "next-intl/server";
import Image from "next/image";
import type { Metadata } from "next";

import { resolveIcon } from "@/lib/resolve-icon";
import { buildAlternates } from "@/lib/seo";
import type { Locale } from "@/i18n/routing";
import { CareerCtaButtons } from "./CareerCtaButtons";

type Props = { params: Promise<{ locale: Locale }> };

// Shared by generateMetadata and the page: one DB call per request
const getCareers = cache(async (locale: Locale) => {
  const payload = await getPayload({ config });
  return payload.findGlobal({ slug: "careers", locale, depth: 1 });
});

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const careers = await getCareers(locale);
  return {
    title: careers.heroTitle || undefined,
    description: careers.heroSubtitle || undefined,
    alternates: buildAlternates(locale, "/careers"),
  };
}

export default async function CareersPage({ params }: Props) {
  const { locale } = await params;
  const payload = await getPayload({ config });

  // Run all three in parallel instead of one after another
  const [t, careers, { docs: benefits }] = await Promise.all([
    getTranslations("careers"),
    getCareers(locale),
    payload.find({
      collection: "career-benefits",
      locale,
      sort: "order",
      depth: 0,
    }),
  ]);

  const heroImage =
      careers.heroImage && typeof careers.heroImage === "object" && careers.heroImage.url
          ? careers.heroImage
          : null;

  return (
      <section className="bg-brand-milk px-6 py-24 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl">
            <h1 className="font-heading text-4xl font-bold leading-tight text-brand-green sm:text-5xl">
              {careers.heroTitle}
            </h1>
            <div className="mt-6 h-1 w-16 bg-brand-green" />
            <p className="mt-6 font-body text-base text-brand-black/80">
              {careers.heroSubtitle}
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-start">
            <div className="flex flex-col gap-4">
              {benefits.map((benefit) => {
                const Icon = resolveIcon(benefit.icon);
                return (
                    <div
                        key={benefit.id}
                        className="flex gap-4 rounded-2xl bg-white p-5 shadow-sm"
                    >
                      <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-brand-green/10">
                        {Icon && <Icon className="size-6 text-brand-green" />}
                      </div>
                      <div>
                        <h3 className="font-heading text-lg font-bold text-brand-green">
                          {benefit.title}
                        </h3>
                        <p className="mt-1 font-body text-sm text-brand-black/80">
                          {benefit.description}
                        </p>
                      </div>
                    </div>
                );
              })}

              <CareerCtaButtons
                  label={careers.secondaryButtonLabel ?? t("secondaryButtonFallback")}
                  modalLabels={{
                    title: t("form.title"),
                    name: t("form.name"),
                    phone: t("form.phone"),
                    email: t("form.email"),
                    city: t("form.city"),
                    position: t("form.position"),
                    comment: t("form.comment"),
                    resume: t("form.resume"),
                    submit: t("form.submit"),
                    success: t("form.success"),
                    error: t("form.error"),
                    errorName: t("form.errorName"),
                    errorPhone: t("form.errorPhone"),
                    errorEmail: t("form.errorEmail"),
                    errorPosition: t("form.errorPosition"),
                    errorComment: t("form.errorComment"),
                    errorResumeType: t("form.errorResumeType"),
                    errorResumeSize: t("form.errorResumeSize"),
                  }}
              />
            </div>

            {heroImage && (
                <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl lg:aspect-[3/4]">
                  <Image
                      src={heroImage.url!}
                      alt={heroImage.alt ?? ""}
                      fill
                      className="object-cover object-top"
                      sizes="(min-width: 1280px) 600px, (min-width: 1024px) 50vw, 100vw"
                  />
                </div>
            )}
          </div>
        </div>
      </section>
  );
}
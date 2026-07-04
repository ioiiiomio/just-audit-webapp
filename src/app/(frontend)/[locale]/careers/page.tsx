// src/app/(frontend)/[locale]/careers/page.tsx
import { getPayload } from "payload";
import config from "@payload-config";
import { getTranslations } from "next-intl/server";
import { resolveIcon } from "@/lib/resolve-icon";
import { CareerCtaButtons } from "./CareerCtaButtons";
import Image from "next/image";

export default async function CareersPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations("careers");
  const payload = await getPayload({ config });

  const careers = await payload.findGlobal({
    slug: "careers",
    locale: locale as "ru" | "kz" | "en",
  });

  const { docs: benefits } = await payload.find({
    collection: "career-benefits",
    locale: locale as "ru" | "kz" | "en",
    sort: "order",
  });

  return (
    <section className="bg-brand-milk px-6 py-24 lg:px-16">
      <div className="mx-auto max-w-7xl">
        {/* Full-width title block */}
        <div className="max-w-2xl">
          <h1 className="font-heading text-4xl font-bold leading-tight text-brand-green sm:text-5xl">
            {careers.heroTitle}
          </h1>
          <div className="mt-6 h-1 w-16 bg-brand-green" />
          <p className="mt-6 font-body text-base text-brand-black/80">
            {careers.heroSubtitle}
          </p>
        </div>

        {/* Benefits + image start at the same row */}
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
              primaryLabel={
                careers.primaryButtonLabel ?? t("primaryButtonFallback")
              }
              primaryHref={careers.primaryButtonHref ?? "#"}
              secondaryLabel={
                careers.secondaryButtonLabel ?? t("secondaryButtonFallback")
              }
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
              }}
            />
          </div>

          {careers.heroImage && typeof careers.heroImage === "object" && (
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl lg:aspect-[3/4]">
              <Image
                src={careers.heroImage.url ?? ""}
                alt={careers.heroImage.alt ?? ""}
                fill
                className="object-cover object-top"
                sizes="(min-width: 1024px) 50vw, 100vw"
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

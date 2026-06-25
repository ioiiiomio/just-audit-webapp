// src/components/sections/why-us-section.tsx
import { useTranslations } from "next-intl";
import { trustPoints } from "@/data/why-us";

export function WhyUsSection() {
  const t = useTranslations("whyUs");

  return (
    <section className="px-6 py-24 lg:px-16">
      <div className="mx-auto max-w-3xl text-center">
        <span className="font-label text-sm font-bold uppercase tracking-wide text-brand-green">
          {t("eyebrow")}
        </span>
        <h2 className="mt-4 font-heading text-4xl font-bold leading-tight text-brand-green sm:text-5xl">
          {t("title")}
        </h2>
      </div>

      <div className="mx-auto mt-16 flex max-w-5xl flex-wrap justify-center gap-6">
        {trustPoints.map(({ id, icon: Icon }) => (
          <div
            key={id}
            className="w-full rounded-2xl bg-white p-8 text-center shadow-sm sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]"
          >
            <Icon
              className="mx-auto size-9 text-brand-green"
              strokeWidth={1.5}
            />
            <h3 className="mt-5 font-heading text-lg font-bold text-brand-green">
              {t(`points.${id}.title`)}
            </h3>
            <p className="mt-3 font-body text-sm text-brand-black/80">
              {t(`points.${id}.description`)}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

// src/components/sections/about-section.tsx
import { useTranslations } from "next-intl";
import { principles } from "@/data/about";

export function AboutSection() {
  const t = useTranslations("about");

  return (
    <section id="about" className="bg-brand-milk px-6 py-20 lg:px-24 lg:py-28">
      <div className="mx-auto grid max-w-7xl gap-16 lg:grid-cols-2 lg:gap-24">
        {/* Left: company description */}
        <div>
          <span className="font-label text-sm font-bold uppercase tracking-wide text-brand-green">
            {t("eyebrow")}
          </span>
          <h2 className="mt-4 font-heading text-4xl font-bold text-brand-green">
            {t("title")}
          </h2>
          <div className="mt-6 space-y-5 font-body text-brand-black/80">
            <p>{t("paragraph1")}</p>
            <p>{t("paragraph2")}</p>
            <p>{t("paragraph3")}</p>
          </div>
        </div>

        {/* Right: principles */}
        <div className="lg:border-l lg:border-brand-black/10 lg:pl-16">
          <span className="font-label text-sm font-bold uppercase tracking-wide text-brand-green">
            {t("principlesEyebrow")}
          </span>

          <ul className="mt-6 divide-y divide-brand-black/10">
            {principles.map(({ id, icon: Icon }) => (
              <li key={id} className="flex gap-6 py-8 first:pt-0 last:pb-0">
                <div className="flex size-16 shrink-0 items-center justify-center rounded-full bg-brand-green/10">
                  <Icon className="size-6 text-brand-green" />
                </div>
                <div>
                  <h3 className="font-heading text-lg font-bold text-brand-green">
                    {t(`principles.${id}.title`)}
                  </h3>
                  <p className="mt-2 font-body text-brand-black/80">
                    {t(`principles.${id}.description`)}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

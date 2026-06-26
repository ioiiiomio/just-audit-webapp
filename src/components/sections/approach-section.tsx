// src/components/sections/approach-section.tsx
import Image from "next/image";
import { useTranslations } from "next-intl";

const items = ["standards", "systemic", "confidentiality"] as const;

export function ApproachSection() {
  const t = useTranslations("approach");

  return (
    <section className="relative overflow-hidden py-24 lg:py-32">
      <Image
        src="/images/approach-desk.png"
        alt=""
        fill
        className="object-cover"
      />

      <div className="relative z-10 mx-auto max-w-6xl px-6 text-center">
        <span className="font-label text-sm font-bold uppercase tracking-wide text-brand-green">
          {t("eyebrow")}
        </span>
        <h2 className="mt-4 font-heading text-4xl font-bold text-brand-green sm:text-5xl">
          {t("title")}
        </h2>

        <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {items.map((id, index) => (
            <div
              key={id}
              className="rounded-2xl bg-white p-8 text-left shadow-sm"
            >
              <span className="font-heading text-6xl font-bold text-brand-green">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-6 font-heading text-xl font-bold text-brand-green">
                {t(`items.${id}.title`)}
              </h3>
              <p className="mt-4 font-body text-brand-black/80">
                {t(`items.${id}.description`)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

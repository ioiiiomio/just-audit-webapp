// src/components/sections/services-section.tsx
import { getPayload } from "payload";
import config from "@payload-config";
import { getTranslations } from "next-intl/server";
import { serviceIcons } from "@/lib/service-icons";

export async function ServicesSection({ locale }: { locale: string }) {
  const t = await getTranslations("services");
  const payload = await getPayload({ config });

  const { docs: services } = await payload.find({
    collection: "services",
    locale: locale as "ru" | "kz",
    sort: "order",
  });

  return (
    <section id="services" className="bg-brand-milk px-6 py-24 lg:px-16">
      <div className="mx-auto max-w-3xl text-center">
        <span className="font-label text-sm font-bold uppercase tracking-wide text-brand-green">
          {t("eyebrow")}
        </span>
        <h2 className="mt-4 font-heading text-4xl font-bold leading-tight text-brand-green sm:text-5xl">
          {t("title")}
        </h2>
      </div>

      <div className="mx-auto mt-16 grid max-w-6xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => {
          const Icon = serviceIcons[service.icon as keyof typeof serviceIcons];
          return (
            <div
              key={service.id}
              className="rounded-2xl bg-white p-8 text-center shadow-sm"
            >
              <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-brand-green/10">
                {Icon && <Icon className="size-7 text-brand-green" />}
              </div>
              <h3 className="mt-6 font-heading text-lg font-bold uppercase text-brand-green">
                {service.title}
              </h3>
              <p className="mt-4 font-body text-sm text-brand-black/80">
                {service.shortDescription}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

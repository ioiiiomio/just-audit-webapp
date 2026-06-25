// src/components/sections/certificates-section.tsx
import { getPayload } from "payload";
import config from "@payload-config";
import { getTranslations } from "next-intl/server";
import { CertificatesCarousel } from "@/components/sections/certificates-carousel";

export async function CertificatesSection({ locale }: { locale: string }) {
  const t = await getTranslations("certificates");
  const payload = await getPayload({ config });

  const { docs } = await payload.find({
    collection: "certificates",
    locale: locale as "ru" | "kz",
    sort: "order",
  });

  return (
    <section className="bg-brand-beige px-6 py-24 lg:px-16">
      <div className="mx-auto max-w-6xl text-center">
        <h2 className="font-heading text-4xl font-bold text-brand-green sm:text-5xl">
          {t("title")}
        </h2>
      </div>
      <div className="mt-14">
        <CertificatesCarousel
          certificates={docs.map((doc) => ({
            id: doc.id,
            title: doc.title,
            image: { url: doc.image?.url, alt: doc.image?.alt },
          }))}
        />
      </div>
    </section>
  );
}

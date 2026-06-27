import { getPayload } from "payload";
import config from "@payload-config";
import { getTranslations } from "next-intl/server";
import { CertificatesCarousel } from "./certificates-carousel";

interface CertificatesSectionProps {
  locale: string;
}

export async function CertificatesSection({
  locale,
}: CertificatesSectionProps) {
  const t = await getTranslations({ locale, namespace: "certificates" });
  const payload = await getPayload({ config });

  const { docs } = await payload.find({
    collection: "certificates",
    locale: locale as "ru" | "kz",
    sort: "order",
    limit: 50,
  });

  const certificates = docs.filter(
    (cert) => cert.image && typeof cert.image === "object" && cert.image.url,
  );

  if (certificates.length === 0) return null;

  return (
    <section id="certificates" className="bg-brand-milk py-20">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="font-heading text-3xl text-brand-black md:text-4xl">
            {t("title")}
          </h2>
          <p className="font-body mt-4 text-brand-black/70">{t("subtitle")}</p>
        </div>

        <CertificatesCarousel certificates={certificates} />
      </div>
    </section>
  );
}

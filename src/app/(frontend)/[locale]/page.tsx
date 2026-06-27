// src/app/(frontend)/[locale]/page.tsx
import { getPayload } from "payload";
import config from "@payload-config"; // TODO: confirm this matches your config import elsewhere (e.g. how services-section.tsx imports it)

import { Footer } from "@/components/layout/footer";
import { AboutSection } from "@/components/sections/about-section";
import { ApproachSection } from "@/components/sections/approach-section";
import { CertificatesSection } from "@/components/sections/certificates-section";
import { ContactSection } from "@/components/sections/contact-section";
import { HeroSection } from "@/components/sections/hero-section";
import { ServicesSection } from "@/components/sections/services-section";
import { SpecialistsSection } from "@/components/sections/specialists-section";
import { WhyUsSection } from "@/components/sections/why-us-section";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const payload = await getPayload({ config });
  const homepage = await payload.findGlobal({
    slug: "homepage",
    locale: locale as "ru" | "kz",
    depth: 1, // needed so backgroundImage resolves to the full Media doc, not just its ID
  });

  return (
    <main className="min-h-screen">
      <HeroSection {...homepage.hero} />
      <AboutSection {...homepage.about} />
      <ApproachSection {...homepage.approach} />
      <SpecialistsSection {...homepage.specialists} locale={locale} />
      <CertificatesSection {...homepage.certificates} locale={locale} />
      <ServicesSection {...homepage.services} locale={locale} />
      <WhyUsSection {...homepage.whyUs} />
      <ContactSection {...homepage.contact} locale={locale} />
      <Footer />
    </main>
  );
}

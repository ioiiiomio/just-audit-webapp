// src/app/(frontend)/[locale]/page.tsx
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

  return (
    <main className="min-h-screen">
      <HeroSection />
      <AboutSection />
      <ApproachSection />
      <SpecialistsSection locale={locale} />
      <CertificatesSection locale={locale} />
      <ServicesSection locale={locale} />
      <WhyUsSection />
      <ContactSection locale={locale} />
      <Footer />
    </main>
  );
}

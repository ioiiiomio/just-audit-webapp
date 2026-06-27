import { getPayload } from "payload";
import config from "@payload-config";
import { Footer } from "@/components/layout/footer";
import { AboutSection } from "@/components/sections/about-section";
import { AnnouncementsBanner } from "@/components/sections/announcements-banner";
import { ApproachSection } from "@/components/sections/approach-section";
import { CertificatesSection } from "@/components/sections/certificates-section";
import { ContactSection } from "@/components/sections/contact-section";
import { HeroSection } from "@/components/sections/hero-section";
import { ServicesSection } from "@/components/sections/services-section";
import { SpecialistsSection } from "@/components/sections/specialists-section";
import { WhyUsSection } from "@/components/sections/why-us-section";
// src/app/(frontend)/[locale]/layout.tsx
import type { Metadata } from "next";
export const revalidate = 60;
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  return {
    title: {
      default:
        locale === "ru"
          ? "Just Audit — Аудит и консалтинг"
          : "Just Audit — Аудит және консалтинг",
      template: "%s | Just Audit",
    },
    description:
      locale === "ru"
        ? "Профессиональный аудит и консалтинг в Казахстане"
        : "Қазақстандағы кәсіби аудит және консалтинг",
    alternates: {
      canonical: `https://justaudit.kz/${locale}`,
      languages: {
        "ru-KZ": "https://justaudit.kz/ru",
        "kk-KZ": "https://justaudit.kz/kz",
      },
    },
    openGraph: {
      type: "website",
      locale: locale === "ru" ? "ru_KZ" : "kk_KZ",
      url: `https://justaudit.kz/${locale}`,
      siteName: "Just Audit",
    },
  };
}
export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const payload = await getPayload({ config });

  const hero = await payload.findGlobal({
    slug: "hero",
    locale: locale as "ru" | "kz",
    depth: 1,
  });

  const about = await payload.findGlobal({
    slug: "about",
    locale: locale as "ru" | "kz",
  });

  const approach = await payload.findGlobal({
    slug: "approach",
    locale: locale as "ru" | "kz",
    depth: 1,
  });

  const whyUs = await payload.findGlobal({
    slug: "why-us",
    locale: locale as "ru" | "kz",
    depth: 1,
  });

  return (
    <main className="min-h-screen">
      <AnnouncementsBanner locale={locale} />
      <HeroSection {...hero} />
      <AboutSection {...about} principles={about.principles ?? []} />
      <ApproachSection {...approach} items={approach.items ?? []} />
      <SpecialistsSection locale={locale} />
      <CertificatesSection locale={locale} />
      <ServicesSection locale={locale} />
      <WhyUsSection {...whyUs} points={whyUs.points ?? []} />
      <ContactSection locale={locale} />
      <Footer />
    </main>
  );
}

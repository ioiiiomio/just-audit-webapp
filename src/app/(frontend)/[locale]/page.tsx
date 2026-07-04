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

const TITLES: Record<string, string> = {
  ru: "Just Audit — Аудит и консалтинг",
  kz: "Just Audit — Аудит және консалтинг",
  en: "Just Audit — Audit and Consulting",
};

const DESCRIPTIONS: Record<string, string> = {
  ru: "Профессиональный аудит и консалтинг в Казахстане",
  kz: "Қазақстандағы кәсіби аудит және консалтинг",
  en: "Professional audit and consulting services in Kazakhstan",
};

const OG_LOCALES: Record<string, string> = {
  ru: "ru_KZ",
  kz: "kk_KZ",
  en: "en_US",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  return {
    title: {
      default: TITLES[locale] ?? TITLES.ru,
      template: "%s | Just Audit",
    },
    description: DESCRIPTIONS[locale] ?? DESCRIPTIONS.ru,
    alternates: {
      canonical: `https://justaudit.kz/${locale}`,
      languages: {
        "ru-KZ": "https://justaudit.kz/ru",
        "kk-KZ": "https://justaudit.kz/kz",
        "en-US": "https://justaudit.kz/en",
      },
    },
    openGraph: {
      type: "website",
      locale: OG_LOCALES[locale] ?? OG_LOCALES.ru,
      url: `https://justaudit.kz/${locale}`,
      siteName: "Just Audit",
    },
    other: {
      generator: "Built by Arslan",
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
    locale: locale as "ru" | "kz" | "en",
    depth: 1,
  });
  const about = await payload.findGlobal({
    slug: "about",
    locale: locale as "ru" | "kz" | "en",
  });
  const approach = await payload.findGlobal({
    slug: "approach",
    locale: locale as "ru" | "kz" | "en",
    depth: 1,
  });
  const whyUs = await payload.findGlobal({
    slug: "why-us",
    locale: locale as "ru" | "kz" | "en",
    depth: 1,
  });

  return (
    <main className="min-h-screen">
      <AnnouncementsBanner locale={locale} />
      <HeroSection {...hero} />
      <AboutSection
        {...about}
        paragraphs={about.paragraphs ?? []}
        principles={about.principles ?? []}
      />
      <ApproachSection {...approach} items={approach.items ?? []} />
      <SpecialistsSection locale={locale} />
      <CertificatesSection locale={locale} />
      <ServicesSection locale={locale} />
      <WhyUsSection {...whyUs} points={whyUs.points ?? []} />
      <ContactSection locale={locale} />
    </main>
  );
}

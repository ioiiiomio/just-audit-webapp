// src/app/(frontend)/[locale]/page.tsx
import type { Metadata } from "next";
import { getPayload } from "payload";
import { setRequestLocale } from "next-intl/server";
import config from "@payload-config";
import type { Locale } from "@/i18n/routing";
import { buildAlternates } from "@/lib/seo";

import { AboutSection } from "@/components/sections/about-section";
import { ApproachSection } from "@/components/sections/approach-section";
import { CertificatesSection } from "@/components/sections/certificates-section";
import { ContactSection } from "@/components/sections/contact-section";
import { HeroSection } from "@/components/sections/hero-section";
import { ServicesSection } from "@/components/sections/services-section";
import { TeamPreviewSection } from "@/components/sections/team-preview-section";
import { WhyUsSection } from "@/components/sections/why-us-section";
import { AnnouncementsBanner } from "@/components/sections/announcement-banner";

export const revalidate = 3600;

const SITE = "https://www.justaudit.kz";

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

const OG_LOCALES: Record<string, string> = { ru: "ru_KZ", kz: "kk_KZ", en: "en_US" };

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;

    return {
        // `absolute` so the root "%s | Just Audit" template doesn't repeat the brand
        title: { absolute: TITLES[locale] ?? TITLES.ru },
        description: DESCRIPTIONS[locale] ?? DESCRIPTIONS.ru,
        alternates: buildAlternates(locale),
        openGraph: {
            type: "website",
            locale: OG_LOCALES[locale] ?? OG_LOCALES.ru,
            url: `${SITE}/${locale}`,
            siteName: "Just Audit",
        },
        generator: "Built by ioiiiomio",
    };
}

export default async function HomePage({ params }: Props) {
    const { locale } = await params;
    setRequestLocale(locale);

    const payload = await getPayload({ config });

    // Independent globals: fetch in parallel (was 4 sequential DB round-trips)
    const [hero, about, approach, whyUs] = await Promise.all([
        payload.findGlobal({ slug: "hero", locale, depth: 1 }),
        payload.findGlobal({ slug: "about", locale, depth: 0 }),
        payload.findGlobal({ slug: "approach", locale, depth: 1 }),
        payload.findGlobal({ slug: "why-us", locale, depth: 1 }),
    ]);

    return (
        <main className="min-h-screen">
            <AnnouncementsBanner locale={locale} />

            <HeroSection
                {...hero}
                title={hero.title ?? ""}
                subtitle={hero.subtitle ?? ""}
                ctaLabel={hero.ctaLabel ?? ""}
            />

            <AboutSection
                {...about}
                eyebrow={about.eyebrow ?? ""}
                title={about.title ?? ""}
                principlesEyebrow={about.principlesEyebrow ?? ""}
                paragraphs={about.paragraphs ?? []}
                principles={about.principles ?? []}
            />

            <ApproachSection
                {...approach}
                eyebrow={approach.eyebrow ?? ""}
                title={approach.title ?? ""}
                items={approach.items ?? []}
            />

            <TeamPreviewSection locale={locale} />
            <CertificatesSection locale={locale} />
            <ServicesSection locale={locale} />

            <WhyUsSection
                {...whyUs}
                eyebrow={whyUs.eyebrow ?? ""}
                title={whyUs.title ?? ""}
                points={whyUs.points ?? []}
            />

            <ContactSection locale={locale} />
        </main>
    );
}


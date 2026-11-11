// src/app/(frontend)/[locale]/team/page.tsx
import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { SpecialistsSection } from "@/components/sections/specialists-section";
import type { Locale } from "@/i18n/routing";
import { buildAlternates } from "@/lib/seo";

export const revalidate = 60;

const BASE_PATH = "/team";
const SITE = "https://www.justaudit.kz";

const TITLES: Record<string, string> = {
    ru: "Наша команда",
    kz: "Біздің команда",
    en: "Our team",
};

const DESCRIPTIONS: Record<string, string> = {
    ru: "Аудиторы и консультанты Just Audit — опыт, квалификация и сертификаты",
    kz: "Just Audit аудиторлары мен кеңесшілері — тәжірибе, біліктілік және сертификаттар",
    en: "Just Audit auditors and consultants — experience, qualifications and certifications",
};

const OG_LOCALES: Record<string, string> = { ru: "ru_KZ", kz: "kk_KZ", en: "en_US" };

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    const title = TITLES[locale] ?? TITLES.ru;
    const description = DESCRIPTIONS[locale] ?? DESCRIPTIONS.ru;

    return {
        title, // becomes "Наша команда | Just Audit" via the root template
        description,
        alternates: buildAlternates(locale, BASE_PATH),
        openGraph: {
            type: "website",
            title,
            description,
            locale: OG_LOCALES[locale] ?? OG_LOCALES.ru,
            url: `${SITE}/${locale}${BASE_PATH}`,
            siteName: "Just Audit",
        },
    };
}

export default async function TeamPage({ params }: Props) {
    const { locale } = await params;
    setRequestLocale(locale);

    return (
        <main className="min-h-screen">
            <SpecialistsSection locale={locale} as="h1" />
        </main>
    );
}
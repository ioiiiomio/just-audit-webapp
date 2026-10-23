// src/app/(frontend)/[locale]/team/page.tsx
import type { Metadata } from "next";
import { SpecialistsSection } from "@/components/sections/specialists-section";

export const revalidate = 60;

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
    const title = TITLES[locale] ?? TITLES.ru;
    const description = DESCRIPTIONS[locale] ?? DESCRIPTIONS.ru;

    return {
        title, // becomes "Наша команда | Just Audit" via the root template
        description,
        alternates: {
            canonical: `https://justaudit.kz/${locale}/team`,
            languages: {
                "ru-KZ": "https://justaudit.kz/ru/team",
                "kk-KZ": "https://justaudit.kz/kz/team",
                "en-US": "https://justaudit.kz/en/team",
            },
        },
        openGraph: {
            type: "website",
            title,
            description,
            locale: OG_LOCALES[locale] ?? OG_LOCALES.ru,
            url: `https://justaudit.kz/${locale}/team`,
            siteName: "Just Audit",
        },
    };
}

export default async function TeamPage({
                                           params,
                                       }: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;

    return (
        <main className="min-h-screen">
            <SpecialistsSection locale={locale} as="h1" />
        </main>
    );
}
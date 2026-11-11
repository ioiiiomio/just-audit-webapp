import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import {Cormorant_Garamond, Montserrat, Montserrat_Alternates } from "next/font/google";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/layout/navbar";
import { ScrollToTopButton } from "@/components/ui/scroll-to-top-button";
import React from "react";
import type { Locale } from "@/i18n/routing";
import { routing } from "@/i18n/routing";
import "./globals.css";

import { CookieConsent } from "@/components/cookie-consent";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";
import { Footer } from "@/components/layout/footer";

// Headings. Replaces Playfair Display, which has no Kazakh glyphs (Ә Ғ Қ Ң Ө Ұ Ү Һ).
// Keeps the --font-playfair variable name so Tailwind's font-heading needs no changes.
// Headings. Replaces Playfair Display, which has no Kazakh glyphs (Ә Ғ Қ Ң Ө Ұ Ү Һ).
// Keeps the --font-playfair variable name so Tailwind's font-heading needs no changes.
const headingFont = Cormorant_Garamond({
    subsets: ["latin", "cyrillic", "cyrillic-ext"],
    weight: ["600", "700"],
    variable: "--font-playfair",
    display: "swap",
});
const montserrat = Montserrat({
    subsets: ["latin", "cyrillic", "cyrillic-ext"],
    variable: "--font-montserrat",
    display: "swap",
});
const montserratAlt = Montserrat_Alternates({
    subsets: ["latin", "cyrillic", "cyrillic-ext"],
    weight: ["400", "500", "600", "700"],
    variable: "--font-montserrat-alt",
    display: "swap",
});

// URL locale → valid HTML/BCP-47 language code ("kz" is a country code)
const HTML_LANG: Record<Locale, string> = { ru: "ru", kz: "kk", en: "en" };

export const metadata: Metadata = {
  icons: {
    icon: [
      { url: "/icons/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/icons/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/icons/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/android-chrome-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    shortcut: "/icons/favicon.ico",
    apple: "/icons/apple-touch-icon.png",
  },
  manifest: "/icons/site.webmanifest",
};

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale: rawLocale } = await params;

  if (!routing.locales.includes(rawLocale as Locale)) {
    notFound();
  }
  const locale = rawLocale as Locale;

  // Must run before any next-intl call, otherwise next-intl reads request
  // headers and every page becomes dynamic, disabling `revalidate`
  setRequestLocale(locale);

  const [messages, t] = await Promise.all([
    getMessages(),
    getTranslations({ locale, namespace: "cookies" }),
  ]);

  return (
      <html lang={HTML_LANG[locale]}>
      <body
          className={`${headingFont.variable} ${montserrat.variable} ${montserratAlt.variable} font-body bg-brand-milk text-brand-black antialiased`}
      >
      <NextIntlClientProvider messages={messages}>
        <Navbar locale={locale} />
        <ScrollToTopButton />
        {children}
        <Footer locale={locale} />
        <CookieConsent
            locale={locale}
            labels={{
              message: t("message"),
              policyLinkText: t("policyLinkText"),
              accept: t("accept"),
              decline: t("decline"),
            }}
        />
      </NextIntlClientProvider>
      <Analytics />
      <SpeedInsights />
      </body>
      </html>
  );
}

/*
  Built by Zhaniya Koshkimbayeva
  github: github.com/ioiiiomio
*/
import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  // 'kz' is used as the URL segment for the Kazakh-language version,
  // matching the locale code used in payload.config.ts localization.
  locales: ["ru", "kz", "en"],
  defaultLocale: "ru",
  // next-intl would emit hreflang="kz" (a country code, invalid for Google).
  // Correct hreflang tags (kk) are generated in generateMetadata via buildAlternates().
  alternateLinks: false,
});

export type Locale = (typeof routing.locales)[number];
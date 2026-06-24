import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  // 'kz' is used as the URL segment for the Kazakh-language version,
  // matching the locale code used in payload.config.ts localization.
  locales: ['ru', 'kz'],
  defaultLocale: 'ru',
})

export type Locale = (typeof routing.locales)[number]

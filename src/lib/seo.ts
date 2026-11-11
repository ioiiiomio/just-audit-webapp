const SITE = "https://www.justaudit.kz";

// URL locale → valid hreflang code
const HREFLANG: Record<string, string> = { ru: "ru", kz: "kk", en: "en" };

export function buildAlternates(locale: string, path = "") {
    const p = path && !path.startsWith("/") ? `/${path}` : path;
    return {
        canonical: `${SITE}/${locale}${p}`,
        languages: {
            ...Object.fromEntries(
                Object.entries(HREFLANG).map(([loc, code]) => [code, `${SITE}/${loc}${p}`]),
            ),
            "x-default": `${SITE}/ru${p}`,
        },
    };
}
import { getNavItems, getSiteSettings } from "@/lib/get-site-data";
import { NavbarClient } from "./navbar-client";
import type { Locale } from "@/i18n/routing";

export async function Navbar({ locale }: { locale: Locale }) {
  const [navItems, siteSettings] = await Promise.all([
    getNavItems(locale),
    getSiteSettings(locale),
  ]);

  const logo = siteSettings.logo;
  const logoUrl =
    typeof logo === "object" && logo !== null ? logo.url : undefined;

  return (
    <NavbarClient
      navItems={navItems.map((item) => ({
        id: item.id,
        label: item.label ?? "",
        href: item.href,
        type: item.type,
      }))}
      logoUrl={logoUrl ?? "/images/logo.svg"}
      ctaLabel={siteSettings.navCta?.label ?? "Получить консультацию"}
      ctaHref={siteSettings.navCta?.href ?? "#contact"}
    />
  );
}

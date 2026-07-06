import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import {
  getFooterNavItems,
  getFooterSettings,
  getContactDetails,
} from "@/lib/get-site-data";
import {
  groupContactDetails,
  type ContactDetailDoc,
} from "@/lib/contact-details";
import type { Locale } from "@/i18n/routing";

export async function Footer({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale });
  const [navItems, footerSettings, contactDetails] = await Promise.all([
    getFooterNavItems(locale),
    getFooterSettings(locale),
    getContactDetails(locale),
  ]);

  const year = new Date().getFullYear();
  const { description, services } = footerSettings;
  const contactItems = groupContactDetails(contactDetails as ContactDetailDoc[]);

  return (
    <footer className="bg-brand-green px-6 py-16 text-brand-milk lg:px-16">
      <div className="mx-auto grid max-w-7xl gap-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
        <div>
          <span className="font-heading text-2xl font-bold">JUST AUDIT</span>
          <p className="mt-4 max-w-xs font-body text-sm text-brand-milk/80">
            {description ?? t("footer.description")}
          </p>
          <p className="mt-8 font-body text-sm text-brand-milk/60">
            © {t("footer.copyright", { year })}
          </p>
          <p className="mt-2 font-body text-xs text-brand-milk/40">
            Site by{" "}
            <a
              href="https://github.com/ioiiiomio"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-brand-milk/70"
            >
              ioiiiomio
            </a>
          </p>
        </div>

        <div>
          <h3 className="font-label text-sm font-bold uppercase tracking-wide text-brand-milk/70">
            {t("footer.navigationTitle")}
          </h3>
          <ul className="mt-5 space-y-3">
            {navItems.map((item) => (
              <li key={item.id}>
                <Link
                  href={item.type === "anchor" ? `/${item.href}` : item.href}
                  className="font-body text-sm text-brand-milk/90 hover:text-white"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-label text-sm font-bold uppercase tracking-wide text-brand-milk/70">
            {t("footer.servicesTitle")}
          </h3>
          <ul className="mt-5 space-y-3">
            {services.map((service) => (
              <li key={service.id}>
                <Link
                  href="/#services"
                  className="font-body text-sm text-brand-milk/90 hover:text-white"
                >
                  {service.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-label text-sm font-bold uppercase tracking-wide text-brand-milk/70">
            {t("footer.contactsTitle")}
          </h3>
          <ul className="mt-5 space-y-3">
            {contactItems.map(({ key, icon: Icon, entries }) => (
              <li key={key} className="flex items-start gap-3">
                <Icon className="mt-0.5 size-4 shrink-0 text-brand-milk/70" />
                <div className="flex flex-col gap-1">
                  {entries.map((entry, i) => {
                    if (entry.href) {
                      return (
                        <Link
                          key={i}
                          href={entry.href}
                          className="font-body text-sm text-brand-milk/90 hover:text-white"
                        >
                          {entry.text}
                        </Link>
                      );
                    }
                    return (
                      <span
                        key={i}
                        className="font-body text-sm text-brand-milk/90"
                      >
                        {entry.text}
                      </span>
                    );
                  })}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}

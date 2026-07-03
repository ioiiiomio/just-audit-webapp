import { getTranslations } from "next-intl/server";
import { MapPin, Phone, Mail, MessageCircle } from "lucide-react";
import { Link } from "@/i18n/navigation";
import {
  getFooterNavItems,
  getFooterServices,
  getSiteSettings,
} from "@/lib/get-site-data";
import type { Locale } from "@/i18n/routing";

export async function Footer({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale });
  const [navItems, services, siteSettings] = await Promise.all([
    getFooterNavItems(locale),
    getFooterServices(locale),
    getSiteSettings(locale),
  ]);

  const year = new Date().getFullYear();
  const { contact } = siteSettings;

  const address = [contact?.address1, contact?.address2, contact?.address3]
    .filter(Boolean)
    .join(", ");

  const whatsappHref = contact?.whatsapp
    ? `https://wa.me/${contact.whatsapp.replace(/\D/g, "")}`
    : undefined;

  const contactItems = [
    { icon: MapPin, label: address },
    {
      icon: Phone,
      label: contact?.phone,
      href: contact?.phone
        ? `tel:${contact.phone.replace(/\s/g, "")}`
        : undefined,
    },
    {
      icon: Mail,
      label: contact?.email,
      href: contact?.email ? `mailto:${contact.email}` : undefined,
    },
    { icon: MessageCircle, label: "WhatsApp", href: whatsappHref },
  ].filter((item) => item.label);

  return (
    <footer className="bg-brand-green px-6 py-16 text-brand-milk lg:px-16">
      <div className="mx-auto grid max-w-7xl gap-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
        <div>
          <span className="font-heading text-2xl font-bold">JUST AUDIT</span>
          <p className="mt-4 max-w-xs font-body text-sm text-brand-milk/80">
            {siteSettings.footerDescription ?? t("footer.description")}
          </p>
          <p className="mt-8 font-body text-sm text-brand-milk/60">
            © {t("footer.copyright", { year })}
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
                  href={`/${locale}/services/${service.slug}`}
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
            {contactItems.map(({ icon: Icon, label, href }) => (
              <li key={label} className="flex items-center gap-3">
                <Icon className="size-4 shrink-0 text-brand-milk/70" />
                {href ? (
                  <a
                    href={href}
                    className="font-body text-sm text-brand-milk/90 hover:text-white"
                  >
                    {label}
                  </a>
                ) : (
                  <span className="font-body text-sm text-brand-milk/90">
                    {label}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}

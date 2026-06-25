// src/components/layout/footer.tsx
import Link from "next/link";
import { MapPin, Phone, Mail, MessageCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import { navItems } from "@/data/navigation";

const footerServices = [
  "financialAudit",
  "taxAudit",
  "internalAudit",
  "consulting",
  "training",
] as const;

export function Footer() {
  const t = useTranslations();
  const year = new Date().getFullYear();

  const contactItems = [
    { icon: MapPin, label: t("footer.contacts.address") },
    {
      icon: Phone,
      label: t("footer.contacts.phone"),
      href: `tel:${t("footer.contacts.phone").replace(/\s/g, "")}`,
    },
    {
      icon: Mail,
      label: t("footer.contacts.email"),
      href: `mailto:${t("footer.contacts.email")}`,
    },
    {
      icon: MessageCircle,
      label: "WhatsApp",
      href: t("footer.contacts.whatsappLink"),
    },
  ];

  return (
    <footer className="bg-brand-green px-6 py-16 text-brand-milk lg:px-16">
      <div className="mx-auto grid max-w-7xl gap-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
        <div>
          <span className="font-heading text-2xl font-bold">JUST AUDIT</span>
          <p className="mt-4 max-w-xs font-body text-sm text-brand-milk/80">
            {t("footer.description")}
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
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="font-body text-sm text-brand-milk/90 hover:text-white"
                >
                  {t(item.label)}
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
            {footerServices.map((id) => (
              <li key={id}>
                <Link
                  href="#services"
                  className="font-body text-sm text-brand-milk/90 hover:text-white"
                >
                  {t(`footer.services.${id}`)}
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
                  <Link
                    href={href}
                    className="font-body text-sm text-brand-milk/90 hover:text-white"
                  >
                    {label}
                  </Link>
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

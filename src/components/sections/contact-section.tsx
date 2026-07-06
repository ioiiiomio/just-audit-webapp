import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { MessageCircle, Linkedin, Mail, MapPin } from "lucide-react";
import { ContactForm } from "@/components/sections/contact-form";
import { getContactDetails } from "@/lib/get-site-data";
import {
  buildContactHref,
  findFirstContact,
  type ContactDetailDoc,
} from "@/lib/contact-details";
import type { Locale } from "@/i18n/routing";

export async function ContactSection({ locale }: { locale: string }) {
  const t = await getTranslations("contact");
  const contactDetails = (await getContactDetails(
    locale as Locale,
  )) as ContactDetailDoc[];

  const whatsapp = findFirstContact(contactDetails, "whatsapp");
  const linkedin = findFirstContact(contactDetails, "linkedin");
  const email = findFirstContact(contactDetails, "email");
  const address = findFirstContact(contactDetails, "address");

  const links = [
    {
      icon: MessageCircle,
      label: "WhatsApp",
      href: whatsapp?.value
        ? buildContactHref("whatsapp", whatsapp.value)
        : undefined,
    },
    {
      icon: Linkedin,
      label: "LinkedIn",
      href: linkedin?.value
        ? buildContactHref("linkedin", linkedin.value)
        : undefined,
    },
    {
      icon: Mail,
      label: email?.value ?? undefined,
      href: email?.value ? buildContactHref("email", email.value) : undefined,
    },
    {
      icon: MapPin,
      label: address?.addressValue ?? undefined,
      href: undefined,
    },
  ].filter(
    (item): item is typeof item & { label: string } => Boolean(item.label),
  ); // drop entries with no content at all

  return (
    <section id="contact" className="bg-brand-milk px-24 py-24 lg:px-16">
      <div className="mx-auto grid max-w-6xl gap-16 lg:grid-cols-2 lg:gap-24">
        <div>
          <h2 className="font-heading text-4xl font-bold uppercase leading-tight text-brand-green sm:text-5xl">
            {t("title")}
          </h2>
          <div className="mt-6 space-y-4 font-body text-brand-black/80">
            <p>{t("paragraph1")}</p>
            <p>{t("paragraph2")}</p>
          </div>
          <ul className="mt-10 space-y-4">
            {links.map((item) => (
              <li key={item.label} className="flex items-center gap-3">
                <item.icon className="size-5 text-brand-green" />
                {item.href ? (
                  <Link
                    href={item.href}
                    target={item.href.startsWith("http") ? "_blank" : undefined}
                    rel="noopener noreferrer"
                    className="font-body text-brand-black hover:text-brand-green"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span className="font-body text-brand-black">
                    {item.label}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
        <div className="lg:border-l lg:border-brand-black/10 lg:pl-16">
          <ContactForm
            labels={{
              name: t("form.name"),
              phone: t("form.phone"),
              email: t("form.email"),
              company: t("form.company"),
              comment: t("form.comment"),
              submit: t("form.submit"),
              success: t("form.success"),
              error: t("form.error"),
              errorName: t("form.errorName"),
              errorPhone: t("form.errorPhone"),
              errorEmail: t("form.errorEmail"),
              errorComment: t("form.errorComment"),
            }}
          />
        </div>
      </div>
    </section>
  );
}

import {
  MapPin,
  Phone,
  Mail,
  MessageCircle,
  Send,
  Instagram,
  Linkedin,
  Globe,
  Link2,
  type LucideIcon,
} from "lucide-react";

export type ContactType =
  | "address"
  | "phone"
  | "email"
  | "whatsapp"
  | "telegram"
  | "instagram"
  | "linkedin"
  | "website"
  | "other";

export interface ContactDetailDoc {
  id: string | number;
  type: ContactType;
  value?: string | null;
  addressValue?: string | null;
  order?: number | null;
}

export const contactIconMap: Record<ContactType, LucideIcon> = {
  address: MapPin,
  phone: Phone,
  email: Mail,
  whatsapp: MessageCircle,
  telegram: Send,
  instagram: Instagram,
  linkedin: Linkedin,
  website: Globe,
  other: Link2,
};

export function buildContactHref(
  type: ContactType,
  rawValue: string,
): string | undefined {
  const value = rawValue.trim();
  if (!value) return undefined;

  switch (type) {
    case "phone":
      return `tel:${value.replace(/\s/g, "")}`;
    case "email":
      return `mailto:${value}`;
    case "whatsapp":
      return `https://wa.me/${value.replace(/\D/g, "")}`;
    case "telegram":
      return value.startsWith("http")
        ? value
        : `https://t.me/${value.replace(/^@/, "")}`;
    case "instagram":
      return value.startsWith("http")
        ? value
        : `https://instagram.com/${value.replace(/^@/, "")}`;
    case "linkedin":
      return value.startsWith("http")
        ? value
        : `https://linkedin.com/in/${value.replace(/^@/, "")}`;
    case "website":
    case "other":
      return value.startsWith("http") ? value : `https://${value}`;
    default:
      return undefined;
  }
}

export function contactDisplayLabel(type: ContactType, value: string): string {
  switch (type) {
    case "whatsapp":
      return "WhatsApp";
    case "telegram":
      return "Telegram";
    case "instagram":
      return "Instagram";
    case "linkedin":
      return "LinkedIn";
    default:
      return value;
  }
}

/**
 * Groups every ContactDetails doc by type, for surfaces (like the footer)
 * that want to render everything that's been added in the admin.
 */
export interface ContactItem {
  key: string;
  icon: LucideIcon;
  entries: { text: string; href?: string }[];
}

export function groupContactDetails(docs: ContactDetailDoc[]): ContactItem[] {
  const grouped = new Map<ContactType, ContactDetailDoc[]>();

  for (const doc of docs) {
    const list = grouped.get(doc.type) ?? [];
    list.push(doc);
    grouped.set(doc.type, list);
  }

  const items: ContactItem[] = [];

  for (const [type, typeDocs] of grouped) {
    const icon = contactIconMap[type] ?? Link2;

    if (type === "address") {
      const entries = typeDocs
        .map((d) => d.addressValue)
        .filter((line): line is string => Boolean(line))
        .map((line) => ({ text: line }));

      if (entries.length > 0) items.push({ key: type, icon, entries });
      continue;
    }

    const entries = typeDocs
      .filter((d) => Boolean(d.value))
      .map((d) => ({
        text: contactDisplayLabel(type, d.value as string),
        href: buildContactHref(type, d.value as string),
      }));

    if (entries.length > 0) items.push({ key: type, icon, entries });
  }

  return items;
}

/** Finds the first doc of a given type that has a usable value. */
export function findFirstContact(
  docs: ContactDetailDoc[],
  type: ContactType,
): ContactDetailDoc | undefined {
  return docs.find((d) =>
    d.type === type && (type === "address" ? d.addressValue : d.value),
  );
}

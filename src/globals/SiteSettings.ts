import type { GlobalConfig } from "payload";

export const SiteSettings: GlobalConfig = {
  slug: "site-settings",
  admin: {
    description: "Site-wide content: hero, contact details, socials",
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: "logo",
      type: "upload",
      relationTo: "media",
    },
    {
      type: "group",
      name: "navCta",
      label: "Navbar CTA button",
      fields: [
        { name: "label", type: "text", localized: true },
        { name: "href", type: "text", defaultValue: "#contact" },
      ],
    },
    {
      type: "group",
      name: "contact",
      fields: [
        { name: "phone", type: "text" },
        { name: "email", type: "text" },
        { name: "address1", type: "text", localized: true },
        { name: "address2", type: "text", localized: true },
        { name: "address3", type: "text", localized: true },
        { name: "representatives", type: "text", localized: true },
        { name: "whatsapp", type: "text" },
        { name: "telegram", type: "text" },
        { name: "instagram", type: "text" },
        { name: "socail-project", type: "text" },
        { name: "linkedin", type: "text" },
      ],
    },
  ],
};

import type { GlobalConfig } from "payload";

export const SiteSettings: GlobalConfig = {
  slug: "site-settings",
  admin: {
    description:
      "Site-wide content: logo, navbar CTA. Contact details & socials are now managed in the Contact Details collection.",
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
  ],
};

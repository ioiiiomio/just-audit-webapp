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
      name: "siteName",
      type: "text",
      label: "Site Name",
      admin: {
        description:
          "Company name shown in the browser tab title and used as a fallback in SEO metadata.",
      },
    },
    {
      name: "metaDescription",
      type: "textarea",
      label: "Meta Description",
      localized: true,
      admin: {
        description:
          "Short SEO description shown in Google/Yandex search results (recommended: 120–160 characters).",
      },
    },
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

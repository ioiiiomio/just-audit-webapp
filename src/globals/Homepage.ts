import type { GlobalConfig } from "payload";

export const Homepage: GlobalConfig = {
  slug: "homepage",
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          name: "hero", // add this
          label: "Hero",
          fields: [
            { name: "title", type: "text", localized: true, required: true },
            { name: "subtitle", type: "text", localized: true, required: true },
            { name: "ctaLabel", type: "text", localized: true, required: true },
            { name: "backgroundImage", type: "upload", relationTo: "media" },
          ],
        },
      ],
    },
    // About, Approach, Specialists, Certificates, Services, WhyUs, Contact — pending their component files
  ],
};

import type { GlobalConfig } from "payload";

export const Footer: GlobalConfig = {
  slug: "footer",
  admin: {
    description:
      "Footer section: description text and the list of services shown in the footer",
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: "description",
      type: "textarea",
      localized: true,
      admin: {
        description: "Short blurb shown under the logo in the footer",
      },
    },
    {
      name: "services",
      type: "array",
      label: "Footer Services",
      admin: {
        description:
          "Pick and order which services appear in the footer's Services column",
      },
      fields: [
        {
          name: "service",
          type: "relationship",
          relationTo: "services",
          required: true,
        },
      ],
    },
  ],
};

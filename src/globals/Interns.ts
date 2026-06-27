import type { GlobalConfig } from "payload";

export const Interns: GlobalConfig = {
  slug: "interns",
  access: {
    read: () => true,
  },
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
      localized: true,
      admin: {
        description:
          'Heading for the internship section, e.g. "Стажировка в Just Audit"',
      },
    },
    {
      name: "description",
      type: "richText",
      localized: true,
    },
    {
      name: "requirements",
      type: "array",
      localized: true,
      fields: [
        {
          name: "item",
          type: "text",
        },
      ],
    },
    {
      name: "contactEmail",
      type: "text",
    },
  ],
};

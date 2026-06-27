import type { CollectionConfig } from "payload";

export const Certificates: CollectionConfig = {
  slug: "certificates",
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "issuedBy", "order"],
  },
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
      localized: true,
    },
    {
      name: "image",
      type: "upload",
      relationTo: "media",
      required: true,
    },
    {
      name: "issuedBy",
      type: "text",
      localized: true,
      admin: {
        description: 'e.g. "Министерство финансов РК"',
      },
    },
    {
      name: "issueDate",
      type: "date",
      admin: {
        date: {
          pickerAppearance: "dayAndMonth",
        },
      },
    },
    {
      name: "order",
      type: "number",
      defaultValue: 0,
      admin: {
        description:
          "Controls display order in the carousel — lower shows first",
      },
    },
  ],
};

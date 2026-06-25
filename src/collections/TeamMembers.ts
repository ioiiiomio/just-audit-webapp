// src/collections/TeamMembers.ts
import type { CollectionConfig } from "payload";

export const TeamMembers: CollectionConfig = {
  slug: "team-members",
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "position", "order"],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
    },
    {
      name: "position",
      type: "text",
      required: true,
      localized: true,
    },
    {
      name: "bio",
      type: "textarea",
      localized: true,
      admin: { condition: (data) => !data.featured },
    },
    {
      name: "photo",
      type: "upload",
      relationTo: "media",
    },
    {
      name: "linkedin",
      type: "text",
    },
    {
      name: "order",
      type: "number",
      defaultValue: 0,
    },
    {
      name: "featured",
      type: "checkbox",
      defaultValue: false,
      admin: {
        description:
          "Shows this member in the large highlight card on the homepage",
      },
    },
    {
      name: "highlights",
      type: "array",
      admin: { condition: (data) => data.featured },
      fields: [
        {
          name: "icon",
          type: "select",
          options: [
            "building",
            "briefcase",
            "certificate",
            "shield",
            "users",
            "podium",
          ],
        },
        { name: "text", type: "textarea", localized: true },
      ],
    },
  ],
};

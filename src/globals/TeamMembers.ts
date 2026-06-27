import type { GlobalConfig } from "payload";

export const TeamMembers: GlobalConfig = {
  slug: "team-members",
  access: {
    read: () => true,
  },
  fields: [
    {
      name: "items",
      type: "array",
      label: "Team Members",
      fields: [
        {
          name: "name",
          type: "text",
          required: true,
        },
        {
          name: "position",
          type: "text",
          localized: true,
        },
        {
          name: "bio",
          type: "textarea",
          localized: true,
          admin: { condition: (_, siblingData) => !siblingData.featured },
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
          admin: { condition: (_, siblingData) => siblingData.featured },
          fields: [
            {
              name: "icon",
              type: "select",
              required: true,
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
    },
  ],
};

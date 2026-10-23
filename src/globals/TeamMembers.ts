import type { GlobalConfig } from "payload";

export const TeamMembers: GlobalConfig = {
  slug: "team-members",
  access: {
    read: () => true,
  },
  fields: [
    {
      name: "eyebrow",
      type: "text",
      localized: true,
      required: true,
    },
    {
      name: "subtitle",
      type: "textarea",
      localized: true,
      required: true,
    },
    {
      name: "carouselHeading",
      type: "text",
      localized: true,
      admin: {
        description: 'Heading above the homepage carousel, e.g. "Наша команда"',
      },
    },
    {
      name: "viewAllLabel",
      type: "text",
      localized: true,
      admin: {
        description: 'Link to the team page, e.g. "вся команда"',
      },
    },
    {
      name: "items",
      type: "array",
      label: "Team Members",
      fields: [
        {
          name: "name",
          type: "text",
          required: true,
          localized: true,
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
                "Founder card — shown at the top of the team section on the homepage and on the team page",
          },
        },
        {
          name: "showOnHomepage",
          type: "checkbox",
          defaultValue: false,
          admin: {
            condition: (_, siblingData) => !siblingData.featured,
            description: "Show in the homepage carousel (first 8 are used)",
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
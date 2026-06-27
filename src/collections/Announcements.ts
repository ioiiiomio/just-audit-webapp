import type { CollectionConfig } from "payload";

export const Announcements: CollectionConfig = {
  slug: "announcements",
  labels: {
    singular: "Announcement",
    plural: "Announcements",
  },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "type", "isActive", "startDate", "endDate"],
    description:
      "Banner messages shown on the homepage (maintenance notices, news, etc.)",
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
      localized: true,
    },
    {
      name: "message",
      type: "textarea",
      localized: true,
    },
    {
      name: "type",
      type: "select",
      required: true,
      defaultValue: "info",
      options: [
        { label: "Info", value: "info" },
        { label: "Maintenance", value: "maintenance" },
        { label: "Success", value: "success" },
        { label: "Warning", value: "warning" },
      ],
    },
    {
      name: "isActive",
      type: "checkbox",
      defaultValue: true,
      admin: {
        description: "Turn off to hide without deleting",
      },
    },
    {
      name: "startDate",
      type: "date",
      admin: {
        description: "Leave empty to show immediately",
        date: { pickerAppearance: "dayAndTime" },
      },
    },
    {
      name: "endDate",
      type: "date",
      admin: {
        description: "Leave empty to show indefinitely",
        date: { pickerAppearance: "dayAndTime" },
      },
    },
    {
      type: "group",
      name: "link",
      fields: [
        { name: "label", type: "text", localized: true },
        { name: "href", type: "text" },
      ],
    },
    {
      name: "priority",
      type: "number",
      defaultValue: 0,
      admin: {
        description:
          "Higher numbers show first when multiple announcements are active",
      },
    },
  ],
};

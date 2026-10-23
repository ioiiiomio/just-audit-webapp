import type { CollectionConfig } from "payload";

export const Announcements: CollectionConfig = {
  slug: "announcements",
  labels: {
    singular: "Announcement",
    plural: "Announcements",
  },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "display", "type", "isActive", "startDate", "endDate"],
    description:
        "Banner strips or popups shown on the homepage (maintenance notices, news, etc.)",
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
      name: "display",
      type: "select",
      required: true,
      defaultValue: "banner",
      options: [
        { label: "Banner (strip at the top)", value: "banner" },
        { label: "Modal (popup)", value: "modal" },
      ],
      admin: {
        position: "sidebar",
        description:
            "If several popups are active, only the highest-priority one is shown",
      },
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
      name: "contact",
      type: "group",
      admin: {
        condition: (data) => data?.display === "modal",
        description: "Optional contact card inside the popup",
      },
      fields: [
        { name: "name", type: "text", localized: true },
        {
          name: "note",
          type: "textarea",
          localized: true,
          admin: { description: "e.g. «По всем вопросам свяжитесь с нами…»" },
        },
        { name: "phone", type: "text" },
        { name: "email", type: "email" },
      ],
    },
    {
      name: "buttonLabel",
      type: "text",
      localized: true,
      admin: {
        condition: (data) => data?.display === "modal",
        description:
            'Main button text. Closes the popup, or opens the link below if set. Default: "Понятно"',
      },
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
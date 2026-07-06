import type { CollectionConfig } from "payload";

export const ContactDetails: CollectionConfig = {
  slug: "contact-details",
  admin: {
    description:
      "Contact info & social links shown in the footer. Add or remove as many as you want — order controls display sequence.",
    useAsTitle: "value",
    defaultColumns: ["type", "value", "order"],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: "type",
      type: "select",
      required: true,
      options: [
        { label: "Address", value: "address" },
        { label: "Phone", value: "phone" },
        { label: "Email", value: "email" },
        { label: "WhatsApp", value: "whatsapp" },
        { label: "Telegram", value: "telegram" },
        { label: "Instagram", value: "instagram" },
        { label: "LinkedIn", value: "linkedin" },
        { label: "Website", value: "website" },
        { label: "Other", value: "other" },
      ],
    },
    {
      name: "value",
      type: "text",
      admin: {
        description:
          "Raw value used to build the link: phone number, email, @username, or full URL. Not used for Address type.",
        condition: (_, siblingData) => siblingData?.type !== "address",
      },
    },
    {
      name: "addressValue",
      type: "text",
      localized: true,
      admin: {
        description: "Full address text (only used when Type = Address)",
        condition: (_, siblingData) => siblingData?.type === "address",
      },
    },
    {
      name: "order",
      type: "number",
      defaultValue: 0,
      admin: {
        description: "Lower numbers appear first",
      },
    },
  ],
};

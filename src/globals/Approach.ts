import type { GlobalConfig } from "payload";

export const Approach: GlobalConfig = {
  slug: "approach",
  fields: [
    { name: "eyebrow", type: "text", localized: true, required: true },
    { name: "title", type: "text", localized: true, required: true },
    { name: "backgroundImage", type: "upload", relationTo: "media" },
    {
      name: "items",
      type: "array",
      minRows: 1,
      maxRows: 3,
      fields: [
        { name: "title", type: "text", localized: true, required: true },
        {
          name: "description",
          type: "textarea",
          localized: true,
          required: true,
        },
      ],
    },
  ],
};

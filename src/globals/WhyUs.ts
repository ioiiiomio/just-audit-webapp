import type { GlobalConfig } from "payload";

export const WhyUs: GlobalConfig = {
  slug: "why-us",
  fields: [
    { name: "eyebrow", type: "text", localized: true, required: true },
    { name: "title", type: "text", localized: true, required: true },
    { name: "backgroundImage", type: "upload", relationTo: "media" },
    {
      name: "points",
      type: "array",
      minRows: 1,
      fields: [
        {
          name: "icon",
          type: "text",
          required: true,
          admin: {
            description:
              'Exact icon name from lucide.dev/icons, e.g. "ShieldCheck", "Clock", "Award". Case-sensitive, PascalCase.',
          },
        },
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

import type { GlobalConfig } from "payload";

export const About: GlobalConfig = {
  slug: "about",
  fields: [
    { name: "eyebrow", type: "text", localized: true, required: true },
    { name: "title", type: "text", localized: true, required: true },
    {
      name: "paragraph1",
      type: "textarea",
      localized: true,
      required: true,
    },
    { name: "paragraph2", type: "textarea", localized: true },
    { name: "paragraph3", type: "textarea", localized: true },
    {
      name: "principlesEyebrow",
      type: "text",
      localized: true,
      required: true,
    },
    {
      name: "principles",
      type: "array",
      minRows: 1,
      fields: [
        { name: "title", type: "text", localized: true, required: true },
        {
          name: "description",
          type: "textarea",
          localized: true,
          required: true,
        },
        {
          name: "icon",
          type: "text",
          required: true,
          admin: {
            description:
              'Exact icon name from lucide.dev/icons, e.g. "MessageCircle", "Grid2x2", "ShieldCheck". Case-sensitive, PascalCase.',
          },
        },
      ],
    },
  ],
};

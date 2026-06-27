import type { GlobalConfig } from "payload";

export const Hero: GlobalConfig = {
  slug: "hero",
  fields: [
    { name: "title", type: "text", localized: true, required: true },
    { name: "subtitle", type: "text", localized: true, required: true },
    { name: "ctaLabel", type: "text", localized: true, required: true },
    { name: "backgroundImage", type: "upload", relationTo: "media" },
  ],
};

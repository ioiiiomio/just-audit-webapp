// src/globals/Careers.ts
import type { GlobalConfig } from "payload";

export const Careers: GlobalConfig = {
  slug: "careers",
  admin: {
    group: "Pages",
  },
  fields: [
    {
      name: "heroTitle",
      type: "text",
      localized: true,
    },
    {
      name: "heroSubtitle",
      type: "textarea",
      localized: true,
    },
    {
      name: "heroImage",
      type: "upload",
      relationTo: "media",
    },
    {
      name: "primaryButtonLabel",
      type: "text",
      localized: true,
    },
    {
      name: "primaryButtonHref",
      type: "text",
      admin: {
        description:
          "Where 'Присоединиться к команде' points to (e.g. #vacancies, mailto:hr@justaudit.kz, or an external link)",
      },
    },
    {
      name: "secondaryButtonLabel",
      type: "text",
      localized: true,
      admin: {
        description:
          "This button always opens the application modal — no href needed.",
      },
    },
  ],
};

// src/collections/CareerBenefits.ts
import type { CollectionConfig } from "payload";

export const CareerBenefits: CollectionConfig = {
  slug: "career-benefits",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["order", "icon", "title"],
    group: "Pages",
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: "order",
      type: "number",
      required: true,
      defaultValue: 0,
    },
    {
      name: "icon",
      type: "text",
      required: true,
      admin: {
        description:
          "Exact PascalCase icon name from lucide-react (e.g. TrendingUp, GraduationCap, Globe, Users, Rocket). See lucide.dev/icons for the full list.",
      },
    },
    {
      name: "title",
      type: "text",
      localized: true,
    },
    {
      name: "description",
      type: "textarea",
      localized: true,
    },
  ],
};

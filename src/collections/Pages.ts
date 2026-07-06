import type { CollectionConfig } from "payload";

export const Pages: CollectionConfig = {
  slug: "pages",
  labels: {
    singular: "Page",
    plural: "Pages",
  },
  admin: {
    group: "Pages",
    useAsTitle: "title",
    defaultColumns: ["title", "slug", "updatedAt"],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: "title",
      type: "text",
      localized: true,
    },
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
      index: true,
      admin: {
        description:
          'URL segment, e.g. "about-office". Shared across all locales → /ru/about-office, /kz/about-office, /en/about-office.',
      },
      validate: (value: string | null | undefined) => {
        const reserved = [
          "careers",
          "services",
          "contacts",
          "about",
          "api",
          "admin",
        ];
        if (value && reserved.includes(value.toLowerCase())) {
          return `"${value}" is reserved for an existing route — choose a different slug.`;
        }
        return true;
      },
    },
    {
      name: "featuredImage",
      type: "upload",
      relationTo: "media",
    },
    {
      name: "content",
      type: "richText",
      localized: true,
    },
    {
      type: "collapsible",
      label: "SEO",
      fields: [
        { name: "metaTitle", type: "text", localized: true },
        { name: "metaDescription", type: "textarea", localized: true },
      ],
    },
  ],
};

// src/collections/Submissions.ts
import type { CollectionConfig } from "payload";

export const Submissions: CollectionConfig = {
  slug: "submissions",
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "phone", "company", "createdAt"],
  },
  access: {
    read: ({ req }) => Boolean(req.user),
    create: () => true,
    update: () => false,
    delete: ({ req }) => Boolean(req.user),
  },
  fields: [
    { name: "name", type: "text", required: true },
    { name: "phone", type: "text", required: true },
    { name: "company", type: "text" },
    { name: "comment", type: "textarea" },
  ],
};

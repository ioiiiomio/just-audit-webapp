// src/collections/Submissions.ts
import type { CollectionConfig } from "payload";
import { sendTelegramNotification } from "@/lib/telegram";

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
  hooks: {
    afterChange: [
      async ({ doc, operation }) => {
        if (operation === "create") {
          const message = `
🔔 <b>Новая заявка — Just Audit</b>
👤 ${doc.name}
📞 ${doc.phone}
🏢 ${doc.company ?? "—"}
💬 ${doc.comment ?? "—"}
          `.trim();

          await sendTelegramNotification(message);
        }
      },
    ],
  },
};

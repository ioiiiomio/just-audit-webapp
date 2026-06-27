// src/collections/Submissions.ts
import type { CollectionConfig } from "payload";
import { sendTelegramNotification } from "@/lib/telegram";

const NAME_REGEX = /^[A-Za-zА-Яа-яЁё\s-]+$/;
// Accepts +7XXXXXXXXXX or 8XXXXXXXXXX, with optional spaces/dashes/parens
// e.g. "+7 701 123 45 67", "8 (701) 123-45-67", "+77011234567"
const KZ_PHONE_REGEX = /^(\+7|8)7\d{9}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const COMMENT_MAX_LENGTH = 320;

export const Submissions: CollectionConfig = {
  slug: "submissions",
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "phone", "email", "company", "createdAt"],
  },
  access: {
    read: ({ req }) => Boolean(req.user),
    create: () => true,
    update: () => false,
    delete: ({ req }) => Boolean(req.user),
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
      validate: (value: string | null | undefined) => {
        if (!value) return "Имя обязательно для заполнения";
        if (!NAME_REGEX.test(value)) {
          return "Имя должно содержать только буквы (кириллица или латиница)";
        }
        return true;
      },
    },
    {
      name: "phone",
      type: "text",
      required: true,
      validate: (value: string | null | undefined) => {
        if (!value) return "Номер телефона обязателен для заполнения";
        const normalized = value.replace(/[\s()-]/g, "");
        if (!KZ_PHONE_REGEX.test(normalized)) {
          return "Введите номер в формате +7 7XX XXX XX XX";
        }
        return true;
      },
    },
    {
      name: "email",
      type: "email",
      required: true,
      validate: (value: string | null | undefined) => {
        if (!value) return "Email обязателен для заполнения";
        if (!EMAIL_REGEX.test(value)) {
          return "Введите email в корректном формате (например, name@example.com)";
        }
        return true;
      },
    },
    { name: "company", type: "text" },
    {
      name: "comment",
      type: "textarea",
      validate: (value: string | null | undefined) => {
        if (value && value.length > COMMENT_MAX_LENGTH) {
          return `Комментарий не должен превышать ${COMMENT_MAX_LENGTH} символов (сейчас ${value.length})`;
        }
        return true;
      },
    },
  ],
  hooks: {
    afterChange: [
      async ({ doc, operation }) => {
        if (operation === "create") {
          const message = `
🔔 <b>Новая заявка — Just Audit</b>
👤 ${doc.name}
📞 ${doc.phone}
✉️ ${doc.email}
🏢 ${doc.company ?? "—"}
💬 ${doc.comment ?? "—"}
          `.trim();

          await sendTelegramNotification(message);
        }
      },
    ],
  },
};

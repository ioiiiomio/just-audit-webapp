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
    defaultColumns: ["type", "name", "phone", "email", "position", "createdAt"],
  },
  access: {
    read: ({ req }) => Boolean(req.user),
    create: () => true,
    update: () => false,
    delete: ({ req }) => Boolean(req.user),
  },
  fields: [
    {
      name: "type",
      type: "select",
      required: true,
      defaultValue: "contact",
      options: [
        { label: "Контактная форма", value: "contact" },
        { label: "Заявка на вакансию", value: "career" },
      ],
    },
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
      name: "city",
      type: "text",
      admin: {
        condition: (data) => data?.type === "career",
      },
    },
    {
      name: "position",
      type: "text",
      admin: {
        condition: (data) => data?.type === "career",
      },
      validate: (value: string | null | undefined, { data }: any) => {
        if (data?.type === "career" && !value) {
          return "Укажите желаемую позицию";
        }
        return true;
      },
    },
    {
      name: "resume",
      type: "upload",
      relationTo: "media",
      admin: {
        condition: (data) => data?.type === "career",
        description: "Резюме кандидата (PDF)",
      },
    },
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
      async ({ doc, operation, req }) => {
        if (operation !== "create") return;

        let resumeLine = "📎 Без резюме";
        if (doc.resume) {
          const resumeUrl =
            typeof doc.resume === "object" && doc.resume.url
              ? `${process.env.NEXT_PUBLIC_SITE_URL ?? "https://justaudit.kz"}${doc.resume.url}`
              : null;

          if (resumeUrl) {
            resumeLine = `📎 <a href="${resumeUrl}">Резюме</a>`;
          } else {
            resumeLine = "📎 Резюме прикреплено (ссылка недоступна)";
          }
        }

        const message =
          doc.type === "career"
            ? `
🧑‍💼 <b>Новая заявка на вакансию — Just Audit</b>
👤 ${doc.name}
📞 ${doc.phone}
✉️ ${doc.email}
🏙️ ${doc.city ?? "—"}
💼 ${doc.position ?? "—"}
${resumeLine}
💬 ${doc.comment ?? "—"}
            `.trim()
            : `
🔔 <b>Новая заявка — Just Audit</b>
👤 ${doc.name}
📞 ${doc.phone}
✉️ ${doc.email}
🏢 ${doc.company ?? "—"}
💬 ${doc.comment ?? "—"}
            `.trim();

        await sendTelegramNotification(message);
      },
    ],
  },
};

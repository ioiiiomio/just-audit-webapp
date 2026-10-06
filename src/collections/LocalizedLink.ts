import type { GroupField } from 'payload'

type Options = {
  name: string
  label: string
  /** Default button text shown in the admin when nothing is filled in */
  defaultLabel?: string
  required?: boolean
}

/**
 * A button/link whose text AND url are stored per locale.
 * Switch the locale in the admin (RU / KZ / EN) to fill a different link for each language.
 * If a locale is left empty, Payload falls back to the default locale (ru).
 */
export const localizedLink = ({ name, label, defaultLabel, required = false }: Options): GroupField => ({
  name,
  label,
  type: 'group',
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'label',
          label: 'Текст кнопки',
          type: 'text',
          localized: true,
          required,
          defaultValue: defaultLabel,
          admin: { width: '40%' },
        },
        {
          name: 'url',
          label: 'Ссылка (для текущего языка)',
          type: 'text',
          localized: true,
          required,
          admin: {
            width: '60%',
            description: 'https://…, /ru/contacts, #form или mailto:…',
          },
          hooks: {
            beforeValidate: [({ value }) => (typeof value === 'string' ? value.trim() : value)],
          },
          validate: (value: unknown) => {
            if (!value) return true
            if (typeof value !== 'string') return 'Некорректная ссылка'
            return /^(https?:\/\/|\/|#|mailto:|tel:)/.test(value)
              ? true
              : 'Ссылка должна начинаться с https://, /, #, mailto: или tel:'
          },
        },
      ],
    },
    {
      name: 'newTab',
      label: 'Открывать в новой вкладке',
      type: 'checkbox',
      defaultValue: false,
    },
  ],
})

import type { CollectionConfig } from 'payload'
import { localizedLink} from "@/collections/LocalizedLink";

export const PROJECT_ICONS = [
  { label: 'Видео', value: 'video' },
  { label: 'Люди', value: 'users' },
  { label: 'Книга', value: 'book' },
  { label: 'Звезда', value: 'star' },
  { label: 'Цель', value: 'target' },
  { label: 'Глаз', value: 'eye' },
  { label: 'Сердце', value: 'heart' },
  { label: 'Лампочка', value: 'lightbulb' },
  { label: 'Рукопожатие', value: 'handshake' },
  { label: 'Выпускник', value: 'graduation' },
] as const

const iconField = {
  name: 'icon',
  label: 'Иконка',
  type: 'select' as const,
  required: true,
  defaultValue: 'star',
  options: [...PROJECT_ICONS],
}

export const Projects: CollectionConfig = {
  slug: 'projects',
  labels: {
    singular: 'Проект',
    plural: 'Проекты',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'order', 'updatedAt'],
    group: 'Контент',
  },
  access: {
    read: () => true,
  },
  defaultSort: 'order',
  fields: [
    // ─── Sidebar ─────────────────────────────────────────────
    {
      name: 'slug',
      label: 'Slug (URL)',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: {
        position: 'sidebar',
        description: 'Например: talanty-ryadom → /ru/projects/talanty-ryadom',
      },
      hooks: {
        beforeValidate: [
          ({ value }) =>
            typeof value === 'string'
              ? value.trim().toLowerCase().replace(/^\/+|\/+$/g, '').replace(/\s+/g, '-')
              : value,
        ],
      },
      validate: (value: unknown) =>
        typeof value === 'string' && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value)
          ? true
          : 'Только латиница, цифры и дефисы (без / в начале)',
    },
    {
      name: 'order',
      label: 'Порядок',
      type: 'number',
      defaultValue: 0,
      admin: { position: 'sidebar' },
    },

    // ─── Main ────────────────────────────────────────────────
    {
      name: 'title',
      label: 'Название проекта',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      type: 'tabs',
      tabs: [
        // 1. Hero
        {
          label: 'Первый экран',
          fields: [
            { name: 'eyebrow', label: 'Надзаголовок', type: 'text', localized: true },
            {
              name: 'intro',
              label: 'Описание',
              type: 'textarea',
              localized: true,
              required: true,
              admin: { description: 'Пустая строка между абзацами = новый абзац' },
            },
            { name: 'heroImage', label: 'Изображение', type: 'upload', relationTo: 'media', required: true },
            localizedLink({ name: 'heroCta', label: 'Кнопка', defaultLabel: 'Отправить заявку' }),
          ],
        },

        // 2. What we do
        {
          label: 'Что мы делаем',
          fields: [
            {
              name: 'about',
              type: 'group',
              label: false,
              fields: [
                { name: 'heading', label: 'Заголовок', type: 'text', localized: true, defaultValue: 'Что мы делаем' },
                { name: 'text', label: 'Текст', type: 'textarea', localized: true },
                {
                  name: 'features',
                  label: 'Карточки',
                  type: 'array',
                  maxRows: 6,
                  admin: { initCollapsed: true },
                  fields: [
                    iconField,
                    { name: 'title', label: 'Заголовок', type: 'text', localized: true, required: true },
                    { name: 'description', label: 'Описание', type: 'textarea', localized: true },
                  ],
                },
              ],
            },
          ],
        },

        // 3. Mission / beliefs / vision
        {
          label: 'Миссия и ценности',
          fields: [
            {
              name: 'values',
              label: 'Блоки (миссия, во что верим, видение…)',
              type: 'array',
              maxRows: 4,
              admin: { initCollapsed: true },
              fields: [
                iconField,
                { name: 'title', label: 'Заголовок', type: 'text', localized: true, required: true },
                { name: 'text', label: 'Текст', type: 'textarea', localized: true, required: true },
                localizedLink({ name: 'link', label: 'Ссылка (необязательно)', defaultLabel: 'Подробнее' }),
              ],
            },
          ],
        },

        // 4. Gallery
        {
          label: 'Команда в действии',
          fields: [
            {
              name: 'gallery',
              type: 'group',
              label: false,
              fields: [
                {
                  name: 'heading',
                  label: 'Заголовок',
                  type: 'text',
                  localized: true,
                  defaultValue: 'Наша команда в действии',
                },
                localizedLink({ name: 'moreLink', label: 'Ссылка «Смотреть больше»', defaultLabel: 'Смотреть больше' }),
                {
                  name: 'images',
                  admin: { description: 'До 8 фото, листаются каруселью' },
                  label: 'Фото',
                  type: 'upload',
                  relationTo: 'media',
                  hasMany: true,
                  maxRows: 8,
                },
              ],
            },
          ],
        },

        // 5. Join CTA
        {
          label: 'Призыв (внизу)',
          fields: [
            {
              name: 'joinCta',
              type: 'group',
              label: false,
              fields: [
                { name: 'eyebrow', label: 'Надзаголовок', type: 'text', localized: true, defaultValue: 'Присоединяйтесь' },
                {
                  name: 'heading',
                  label: 'Заголовок',
                  type: 'text',
                  localized: true,
                  defaultValue: 'Хотите стать частью команды?',
                },
                { name: 'subheading', label: 'Подзаголовок', type: 'text', localized: true },
                { name: 'image', label: 'Фоновое изображение', type: 'upload', relationTo: 'media' },
                localizedLink({ name: 'button', label: 'Кнопка', defaultLabel: 'Заполнить заявку' }),
              ],
            },
          ],
        },

        // 6. SEO
        {
          label: 'SEO',
          fields: [
            { name: 'metaTitle', label: 'Meta title', type: 'text', localized: true },
            { name: 'metaDescription', label: 'Meta description', type: 'textarea', localized: true },
          ],
        },
      ],
    },
  ],
}

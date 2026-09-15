import type { CollectionConfig } from 'payload'
import { sanitizeSlug } from './hooks/sanitizeSlug'

export const EducationTopics: CollectionConfig = {
  slug: 'education-topics',
  labels: {
    singular: 'Education Topic',
    plural: 'Education Topics',
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug', 'order'],
    group: 'Education',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      localized: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      hooks: {
        beforeValidate: [sanitizeSlug],
      },
    },
    {
      name: 'description',
      type: 'text',
      localized: true,
      label: 'Подзаголовок',
      admin: {
        description: 'Короткая подпись под названием темы на странице видео (необязательно).',
      },
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      label: 'Порядок секции',
      admin: {
        description: 'Определяет, в каком порядке темы идут на странице видео. Меньше — выше.',
      },
    },
  ],
}
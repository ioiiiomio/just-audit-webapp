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
    defaultColumns: ['name', 'slug'],
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
  ],
}

import type { CollectionConfig } from 'payload'
import { sanitizeSlug } from './hooks/sanitizeSlug'

export const EducationCategories: CollectionConfig = {
  slug: 'education-categories',
  labels: {
    singular: 'Education Category',
    plural: 'Education Categories',
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
      localized: true, // never required: true on localized fields
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      hooks: {
        beforeValidate: [sanitizeSlug],
      },
      admin: {
        description: 'URL-safe id, e.g. "audit-guarantees". Used for filter query params.',
      },
    },
    {
      name: 'icon',
      type: 'text',
      admin: {
        description:
          'lucide-react PascalCase icon name (e.g. "ShieldCheck"). Falls back to HelpCircle if not found — same pattern as your Services icons.',
      },
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      admin: {
        description: 'Display order for the category pill row on the landing page.',
      },
    },
  ],
}

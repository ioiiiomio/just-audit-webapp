import type { GlobalConfig } from 'payload'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  admin: {
    description: 'Site-wide content: hero, contact details, socials',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'heroTitle',
      type: 'text',
      localized: true,
    },
    {
      name: 'heroSubtitle',
      type: 'textarea',
      localized: true,
    },
    {
      name: 'heroImage',
      type: 'upload',
      relationTo: 'media',
    },
    {
      type: 'group',
      name: 'contact',
      fields: [
        { name: 'phone', type: 'text' },
        { name: 'email', type: 'text' },
        { name: 'address', type: 'text', localized: true },
        { name: 'whatsapp', type: 'text' },
        { name: 'telegram', type: 'text' },
      ],
    },
  ],
}

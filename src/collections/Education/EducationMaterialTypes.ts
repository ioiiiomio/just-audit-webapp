import type { CollectionConfig } from 'payload'
import { sanitizeSlug } from './hooks/sanitizeSlug'

export const EducationMaterialTypes: CollectionConfig = {
    slug: 'education-material-types',
    labels: {
        singular: 'Education Material Type',
        plural: 'Education Material Types',
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
            required: true,
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
            name: 'order',
            type: 'number',
            defaultValue: 0,
            label: 'Порядок',
            admin: {
                description: 'Определяет порядок в списке фильтра "Тип материала".',
            },
        },
    ],
}
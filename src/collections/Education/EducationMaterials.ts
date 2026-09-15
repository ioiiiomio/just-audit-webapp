import type { CollectionConfig } from 'payload'
import { sanitizeSlug } from './hooks/sanitizeSlug'

export const EducationMaterials: CollectionConfig = {
    slug: 'education-materials',
    labels: {
        singular: 'Education Material',
        plural: 'Education Materials',
    },
    admin: {
        useAsTitle: 'title',
        defaultColumns: ['title', 'contentType', 'type', 'category', 'publishedDate'],
        group: 'Education',
    },
    access: {
        read: () => true,
    },
    fields: [
        {
            name: 'title',
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
            admin: {
                description: 'Powers /knowledge/videos/[slug] or /knowledge/seminars/[slug]',
            },
        },
        {
            // Drives which list page it appears on and which detail template renders
            name: 'contentType',
            type: 'select',
            required: true,
            options: [
                { label: 'Video', value: 'video' },
                { label: 'Article (text seminar)', value: 'article' },
            ],
            admin: {
                description: 'video → /knowledge/videos, article → /knowledge/seminars',
            },
        },
        {
            name: 'type',
            type: 'select',
            required: true,
            options: [
                { label: 'Лекция', value: 'lecture' },
                { label: 'Семинар', value: 'seminar' },
                { label: 'Мастер-класс', value: 'masterclass' },
                { label: 'Вебинар', value: 'webinar' },
            ],
        },
        {
            name: 'format',
            type: 'select',
            options: [
                { label: 'PDF', value: 'pdf' },
                { label: 'Video', value: 'video' },
                { label: 'Document', value: 'document' },
                { label: 'Excel', value: 'excel' },
            ],
            admin: {
                description: 'File-type badge shown on the card (matches PDF / Презентация / Excel icons).',
            },
        },
        {
            name: 'category',
            type: 'relationship',
            relationTo: 'education-categories',
        },
        {
            name: 'topics',
            type: 'array',
            label: 'Темы',
            fields: [
                { name: 'topic', type: 'relationship', relationTo: 'education-topics', required: true },
                {
                    name: 'order',
                    type: 'number',
                    label: 'Порядок внутри темы',
                    defaultValue: 0,
                    admin: { description: 'Меньше — выше в списке этой темы' },
                },
            ],
        },
        {
            name: 'excerpt',
            type: 'textarea',
            localized: true,
        },
        // --- video-only fields ---
        {
            name: 'videoUrl',
            type: 'text',
            admin: {
                condition: (_, siblingData) => siblingData?.contentType === 'video',
                description: 'Full YouTube URL. Video ID is parsed at render time.',
            },
        },
        // --- article-only fields ---
        {
            name: 'content',
            type: 'richText',
            localized: true,
            admin: {
                condition: (_, siblingData) => siblingData?.contentType === 'article',
            },
        },
        {
            name: 'faq',
            type: 'array',
            admin: {
                condition: (_, siblingData) => siblingData?.contentType === 'article',
            },
            fields: [
                { name: 'question', type: 'text', localized: true },
                { name: 'answer', type: 'textarea', localized: true },
            ],
        },
        // --- shared ---
        {
            name: 'durationSeconds',
            type: 'number',
            admin: {
                description:
                    'Used for the video duration filter buckets. Display strings (e.g. "28:45", "1 ч 20 мин") are computed at render time from this value.',
            },
        },
        {
            name: 'thumbnail',
            type: 'upload',
            relationTo: 'media', // adjust if your Media collection slug differs
        },
        {
            name: 'publishedDate',
            type: 'date',
            admin: {
                date: { pickerAppearance: 'dayOnly' },
            },
        },
        {
            // NOTE: your Team collection (`team-members`) is a Payload *global* with an
            // `items` array, not a collection — relationships can only target collections,
            // so this can't be a `relationship` field (that's what threw
            // InvalidFieldRelationship earlier). Embedding the expert fields directly
            // instead; fill them in by copy-pasting from the relevant team-members entry.
            name: 'expert',
            type: 'group',
            fields: [
                { name: 'name', type: 'text' },
                { name: 'role', type: 'text', localized: true },
                { name: 'photo', type: 'upload', relationTo: 'media' },
                {
                    name: 'bulletPoints',
                    type: 'array',
                    fields: [
                        { name: 'icon', type: 'text', admin: { description: 'lucide-react PascalCase icon name' } },
                        { name: 'label', type: 'text', localized: true },
                    ],
                },
            ],
        },
        {
            name: 'downloadFiles',
            type: 'array',
            admin: {
                description: 'Sidebar "Материалы для скачивания" list on the article detail page.',
            },
            fields: [
                { name: 'label', type: 'text', localized: true },
                { name: 'file', type: 'upload', relationTo: 'media' },
            ],
        },
        {
            name: 'tags',
            type: 'array',
            admin: {
                description: 'Free-form tag chips shown on the detail page (e.g. Тренды, Регулирование).',
            },
            fields: [{ name: 'label', type: 'text', localized: true }],
        },
    ],
}
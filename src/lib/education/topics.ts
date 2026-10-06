// lib/education/topics.ts
import type { EducationMaterial } from './types'

// Reserved slug for the "Другие видео" (no topic) bucket.
// Make sure no real topic in the CMS uses this slug.
export const OTHER_TOPIC_SLUG = 'other'

export function topicOrderOf(material: EducationMaterial, topicId: string | number) {
    return material.topics?.find((entry) => entry.topic?.id === topicId)?.order ?? 0
}
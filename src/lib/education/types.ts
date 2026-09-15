// Populated-relation shape for EducationMaterials, assuming queries use `depth: 2`
// so category/topics/expert/thumbnail/downloadFiles.file come back as objects, not IDs.
// Swap these for the generated types in `@/payload-types` once you've run
// `pnpm payload generate:types` against the new collections.

export interface EducationCategory {
  id: string | number
  name: string
  slug: string
  icon?: string | null
  order?: number | null
}

export interface EducationTopic {
  id: string | number
  name: string
  slug: string
}

export interface EducationMedia {
  id: string | number
  url: string
  alt?: string | null
  filesize?: number | null
  filename?: string | null
}

export interface EducationExpert {
  id: string | number
  name: string
  role?: string | null
  photo?: EducationMedia | null
  bulletPoints?: { label: string; icon?: string | null; id?: string }[] | null
}

export type EducationMaterialType = 'lecture' | 'seminar' | 'masterclass' | 'webinar'
export type EducationMaterialLevel = 'basic' | 'medium' | 'advanced'
export type EducationMaterialFormat = 'pdf' | 'video' | 'document' | 'excel'
export type EducationContentType = 'video' | 'article'

export interface EducationMaterial {
  id: string | number
  title: string
  slug: string
  contentType: EducationContentType
  type: EducationMaterialType
  format?: EducationMaterialFormat | null
  level?: EducationMaterialLevel | null
  category?: EducationCategory | null
  topics?: EducationTopic[] | null
  excerpt?: string | null
  videoUrl?: string | null
  content?: unknown
  faq?: { question: string; answer: string; id?: string }[] | null
  durationSeconds?: number | null
  thumbnail?: EducationMedia | null
  publishedDate?: string | null
  expert?: EducationExpert | null
  downloadFiles?: { label: string; file: EducationMedia; id?: string }[] | null
  tags?: { label: string; id?: string }[] | null
}

export const MATERIAL_TYPE_LABELS: Record<EducationMaterialType, string> = {
  lecture: 'Лекция',
  seminar: 'Семинар',
  masterclass: 'Мастер-класс',
  webinar: 'Вебинар',
}

export const MATERIAL_LEVEL_LABELS: Record<EducationMaterialLevel, string> = {
  basic: 'Базовый',
  medium: 'Средний',
  advanced: 'Продвинутый',
}

export const MATERIAL_FORMAT_LABELS: Record<EducationMaterialFormat, string> = {
  pdf: 'PDF',
  video: 'Видео',
  document: 'Документ',
  excel: 'Excel',
}

// Populated-relation shape for EducationMaterials, assuming queries use `depth: 2`
// so category/topics/type/expert/thumbnail/downloadFiles.file come back as objects,
// not IDs. Swap these for the generated types in `@/payload-types` once you've run
// `pnpm payload generate:types` against the updated collections.

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
  /** Subtitle shown under the topic name on the grouped videos page. */
  description?: string | null
  /** Controls the display order of topic sections on the grouped videos page. */
  order?: number | null
}

/**
 * Was a hardcoded string union (lecture/seminar/masterclass/webinar) — now a
 * Payload-managed collection (education-material-types) so new types can be
 * added from the admin without a code deploy.
 */
export interface EducationMaterialType {
  id: string | number
  name: string
  slug: string
  order?: number | null
}

export interface EducationMedia {
  id: string | number
  url: string
  alt?: string | null
  filesize?: number
  filename?: string | null
}

export interface EducationExpert {
  id: string | number
  name: string
  role?: string | null
  photo?: EducationMedia | null
  bulletPoints?: { label: string; icon?: string | null; id?: string }[] | null
}

export type EducationMaterialFormat = 'pdf' | 'video' | 'document' | 'excel'
export type EducationContentType = 'video' | 'article'

export interface EducationMaterial {
  id: string | number
  title: string
  slug: string
  contentType: EducationContentType
  type: EducationMaterialType
  format?: EducationMaterialFormat | null
  category?: EducationCategory | null
  /**
   * Each entry pairs a topic with this material's position *within that
   * topic* — so the same video can rank differently in different topics.
   * `order` is set per material/topic pair in the admin (lower = earlier).
   */
  topics?: { topic: EducationTopic; order: number }[] | null
  excerpt?: string | null
  videoUrl?: string | null
  // Left loosely typed on purpose: `lexical`'s SerializedEditorState type isn't
  // reachable as a direct import in this project's TS config, and this value
  // only ever gets handed straight to `<RichText data={...} />` — it's never
  // read or transformed here, so precision isn't worth chasing a working
  // import path for a third time.
  content?: any
  faq?: { question: string; answer: string; id?: string }[] | null
  durationSeconds?: number | null
  thumbnail?: EducationMedia | null
  publishedDate?: string | null
  expert?: EducationExpert | null
  downloadFiles?: { label: string; file: EducationMedia; id?: string }[] | null
  tags?: { label: string; id?: string }[] | null
}

export const MATERIAL_FORMAT_LABELS: Record<EducationMaterialFormat, string> = {
  pdf: 'PDF',
  video: 'Видео',
  document: 'Документ',
  excel: 'Excel',
}
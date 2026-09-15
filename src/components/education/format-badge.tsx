import { FileText, Presentation, Sheet, Video } from 'lucide-react'
import type { EducationMaterialFormat } from '@/lib/education/types'
import { MATERIAL_FORMAT_LABELS } from '@/lib/education/types'

const FORMAT_ICON: Record<EducationMaterialFormat, typeof FileText> = {
  pdf: FileText,
  document: Presentation,
  excel: Sheet,
  video: Video,
}

export function FormatBadge({ format }: { format: EducationMaterialFormat }) {
  const Icon = FORMAT_ICON[format]
  const label = format === 'document' ? 'Презентация' : MATERIAL_FORMAT_LABELS[format]
  return (
    <span className="inline-flex items-center gap-1.5 text-sm text-[#1A1A1A]/70">
      <Icon className="h-4 w-4" strokeWidth={1.75} />
      {label}
    </span>
  )
}

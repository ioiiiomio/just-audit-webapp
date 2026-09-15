import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import { getTranslations } from 'next-intl/server'
import { formatDuration } from '@/lib/education/format'
import { FormatBadge } from './format-badge'
import {
  MATERIAL_TYPE_LABELS,
  type EducationMaterial,
} from '@/lib/education/types'
import { GraduationCap } from 'lucide-react'

export async function EducationCard({ material, locale }: { material: EducationMaterial; locale: string }) {
  const t = await getTranslations({ locale, namespace: 'knowledge' })

  return (
      <Link
          href={`/knowledge/${material.contentType === 'video' ? 'videos' : 'seminars'}/${material.slug}`}
          className="group flex flex-col overflow-hidden rounded-2xl border border-[#EDE9E3] bg-white transition-colors hover:border-[#155335]/30"
      >
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#EDE9E3]">
          {material.thumbnail?.url ? (
              <Image
                  src={material.thumbnail.url}
                  alt={material.thumbnail.alt ?? material.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
              />
          ) : (
              <div className="flex h-full w-full items-center justify-center text-[#1A1A1A]/20">
                <GraduationCap className="h-10 w-10" strokeWidth={1.25} />
              </div>
          )}

          <span className="absolute left-3 top-3 rounded-full bg-white px-3 py-1 text-xs font-medium text-[#1A1A1A] shadow-sm">
          {MATERIAL_TYPE_LABELS[material.type]}
        </span>

          {material.durationSeconds ? (
              <span className="absolute bottom-3 right-3 rounded bg-black/70 px-2 py-0.5 text-xs text-white">
            {formatDuration(material.durationSeconds)}
          </span>
          ) : null}
        </div>

        <div className="flex flex-1 flex-col gap-3 p-6">
          <h3 className="font-serif text-lg leading-snug text-[#1A1A1A]">{material.title}</h3>
          {material.excerpt ? (
              <p className="line-clamp-2 text-sm leading-relaxed text-[#1A1A1A]/60">{material.excerpt}</p>
          ) : null}

          <div className="mt-auto flex flex-wrap items-center gap-4 pt-2 text-sm text-[#1A1A1A]/70">
            {material.format ? (
                <FormatBadge format={material.format} documentLabel={t('formatBadge.documentLabel')} />
            ) : null}
          </div>
        </div>
      </Link>
  )
}
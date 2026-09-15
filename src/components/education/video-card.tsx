import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import { Play, Youtube, Tag } from 'lucide-react'
import { formatClock, formatShortDate, getYoutubeThumbnail } from '@/lib/education/format'
import type { EducationMaterial } from '@/lib/education/types'

interface VideoCardProps {
  material: EducationMaterial
  variant?: 'compact' | 'grid'
}

export function VideoCard({ material, variant = 'grid' }: VideoCardProps) {
  const thumbnail = material.thumbnail?.url ?? getYoutubeThumbnail(material.videoUrl)
  const topicLabel = material.topics?.[0]?.name

  return (
    <Link
      href={`/education/videos/${material.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-[#EDE9E3] bg-white transition-colors hover:border-[#155335]/30"
    >
      <div className="relative aspect-video w-full overflow-hidden bg-[#EDE9E3]">
        {thumbnail ? (
          <Image
            src={thumbnail}
            alt={material.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
        ) : null}

        {variant === 'grid' ? (
          <>
            <div className="absolute inset-0 flex items-center justify-center bg-black/10 opacity-0 transition-opacity group-hover:opacity-100">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#155335] text-white">
                <Play className="h-5 w-5 translate-x-[1px]" fill="currentColor" />
              </span>
            </div>
            {material.durationSeconds ? (
              <span className="absolute bottom-2 right-2 rounded bg-black/70 px-2 py-0.5 text-xs text-white">
                {formatClock(material.durationSeconds)}
              </span>
            ) : null}
          </>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-5">
        <h3 className="font-serif text-base leading-snug text-[#1A1A1A]">{material.title}</h3>
        {material.excerpt ? (
          <p className="line-clamp-2 text-sm leading-relaxed text-[#1A1A1A]/60">{material.excerpt}</p>
        ) : null}

        {variant === 'grid' ? (
          <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-[#1A1A1A]/50">
            {topicLabel ? (
              <span className="inline-flex items-center gap-1">
                <Tag className="h-3.5 w-3.5" /> {topicLabel}
              </span>
            ) : null}
            <span>JUST AUDIT</span>
            {material.publishedDate ? <span>· {formatShortDate(material.publishedDate)}</span> : null}
          </div>
        ) : null}

        <div className="mt-auto flex items-center gap-1.5 pt-2 text-sm text-[#1A1A1A]/60">
          <Youtube className="h-4 w-4 text-red-600" />
          JUST Audit
        </div>
      </div>
    </Link>
  )
}

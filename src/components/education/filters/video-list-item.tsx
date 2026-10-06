import Image from 'next/image'
import { PlayCircle } from 'lucide-react'
import { Link } from '@/i18n/navigation'
import type { Locale } from '@/i18n/routing'
import { formatClock, formatDate } from '@/lib/education/format'
import type { EducationMaterial } from '@/lib/education/types'

export function VideoListItem({ material, locale }: { material: EducationMaterial; locale: Locale }) {
    return (
        <Link
            href={`/knowledge/videos/${material.slug}`}
            className="group flex flex-col gap-4 rounded-2xl border border-[#EDE9E3] bg-white p-4 transition hover:border-[#155335]/30 sm:flex-row sm:items-center sm:gap-6"
        >
            <div className="relative aspect-video w-full shrink-0 overflow-hidden rounded-xl bg-[#EDE9E3] sm:w-56 lg:w-64">
                {material.thumbnail?.url ? (
                    <Image
                        src={material.thumbnail.url}
                        alt={material.title}
                        fill
                        className="object-cover transition group-hover:scale-[1.02]"
                        sizes="(max-width: 640px) 100vw, 256px"
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center text-[#155335]/40">
                        <PlayCircle className="h-10 w-10" strokeWidth={1.5} />
                    </div>
                )}
                {material.durationSeconds ? (
                    <span className="absolute bottom-2 right-2 rounded bg-black/70 px-1.5 py-0.5 text-xs text-white">
                        {formatClock(material.durationSeconds)}
                    </span>
                ) : null}
            </div>

            <div className="min-w-0 flex-1">
                <h3 className="font-serif text-lg leading-snug text-[#1A1A1A] transition group-hover:text-[#155335]">
                    {material.title}
                </h3>
                {material.excerpt ? (
                    <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-[#1A1A1A]/60">{material.excerpt}</p>
                ) : null}
                <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs uppercase tracking-wide text-[#1A1A1A]/45">
                    {material.publishedDate ? <span>{formatDate(material.publishedDate, locale)}</span> : null}
                    {material.publishedDate && material.category ? <span>·</span> : null}
                    {material.category ? <span>{material.category.name}</span> : null}
                </div>
            </div>
        </Link>
    )
}
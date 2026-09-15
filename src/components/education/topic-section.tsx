'use client'

import { useRef, useState } from 'react'
import { ChevronDown, ChevronRight, FolderOpen } from 'lucide-react'
import { Link } from '@/i18n/navigation'
import { VideoCard } from '@/components/education/video-card'
import type { EducationMaterial } from '@/lib/education/types'

interface TopicSectionProps {
    /** Omit for the "materials without a topic" bucket — it gets a folder icon instead of a number. */
    index?: number
    title: string
    description?: string
    /** Already sorted (by this topic's order) and sliced to the preview size. */
    materials: EducationMaterial[]
    /** Full count for this topic, used for the "N уроков" label and the "show all" link. */
    totalCount: number
    /** Link to the flat, paginated view for this one topic. Omit for the untagged bucket. */
    viewAllHref?: string
}

// Russian plural rules for "урок" (one / few / many) — kept local to this
// client component so we don't have to pass a formatting function down from
// the server component (function props can't cross that boundary in Next 15).
function formatLessons(count: number) {
    const mod10 = count % 10
    const mod100 = count % 100
    if (mod10 === 1 && mod100 !== 11) return `${count} урок`
    if ([2, 3, 4].includes(mod10) && ![12, 13, 14].includes(mod100)) return `${count} урока`
    return `${count} уроков`
}

export function TopicSection({ index, title, description, materials, totalCount, viewAllHref }: TopicSectionProps) {
    const [expanded, setExpanded] = useState(true)
    const scrollerRef = useRef<HTMLDivElement>(null)

    if (materials.length === 0) return null

    const hasMore = totalCount > materials.length

    return (
        <div className="mb-6 overflow-hidden rounded-2xl border border-[#155335]/10">
            <button
                type="button"
                onClick={() => setExpanded((value) => !value)}
                className="flex w-full items-center justify-between bg-[#155335]/5 px-6 py-4 text-left"
                aria-expanded={expanded}
            >
                <div className="flex items-center gap-3">
                    {typeof index === 'number' ? (
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#155335] text-sm font-medium text-white">
              {index}
            </span>
                    ) : (
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center text-[#155335]">
              <FolderOpen size={18} />
            </span>
                    )}
                    <div>
                        <p className="font-serif text-lg text-[#1A1A1A]">{title}</p>
                        {description ? <p className="text-sm text-[#1A1A1A]/50">{description}</p> : null}
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <span className="text-sm text-[#1A1A1A]/60">{formatLessons(totalCount)}</span>
                    <ChevronDown
                        size={18}
                        className={`text-[#1A1A1A]/60 transition-transform ${expanded ? 'rotate-180' : ''}`}
                    />
                </div>
            </button>

            {expanded ? (
                <div className="relative bg-white px-6 py-6">
                    <div
                        ref={scrollerRef}
                        className="flex gap-6 overflow-x-auto scroll-smooth"
                        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    >
                        {materials.map((material) => (
                            <div key={material.id} className="w-[260px] shrink-0">
                                <VideoCard material={material} variant="grid" />
                            </div>
                        ))}
                    </div>

                    {hasMore ? (
                        <button
                            type="button"
                            onClick={() => scrollerRef.current?.scrollBy({ left: 280, behavior: 'smooth' })}
                            className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white text-[#155335] shadow-md"
                            aria-label="Scroll"
                        >
                            <ChevronRight size={18} />
                        </button>
                    ) : null}

                    {viewAllHref && hasMore ? (
                        <div className="mt-4 text-right">
                            <Link href={viewAllHref} className="inline-flex items-center gap-1 text-sm font-medium text-[#155335]">
                                Показать все {formatLessons(totalCount)} →
                            </Link>
                        </div>
                    ) : null}
                </div>
            ) : null}
        </div>
    )
}

/*
  NOTE on the scrollbar: the inline style above hides it in Firefox/IE.
  For Chrome/Safari, add this once to your global CSS:

    .topic-section-scroller::-webkit-scrollbar { display: none; }

  and add that class to the scroller div, if you want it hidden there too —
  left as a plain scrollbar for now since it's cosmetic only.
*/
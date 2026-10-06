'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { ChevronDown, ChevronLeft, ChevronRight, FolderOpen } from 'lucide-react'
import { Link } from '@/i18n/navigation'
import { VideoCard } from '@/components/education/video-card'
import type { EducationMaterial } from '@/lib/education/types'

interface TopicSectionProps {
    /** Omit for the "materials without a topic" bucket — it gets a folder icon instead of a number. */
    index?: number
    title: string
    description?: string | null
    /** Already sorted by this topic's order. Pass all of them — the row scrolls horizontally. */
    materials: EducationMaterial[]
    /** Full count for this topic, shown in the header. */
    totalCount: number
    /** Link to the dedicated page for this topic (/knowledge/videos/[topic]). */
    viewAllHref?: string
    viewAllLabel?: string
}

// Card width = (row width − gaps) / cards-per-view. Gap is gap-6 = 1.5rem.
// 5 per view on wide screens, fewer on narrower ones so titles stay readable.
const CARD_WIDTH = [
    'w-[85%]', //                                      mobile: 1 + a peek of the next
    'sm:w-[calc((100%_-_1.5rem)/2)]', //               2 per view
    'md:w-[calc((100%_-_3rem)/3)]', //                 3 per view
    'xl:w-[calc((100%_-_4.5rem)/4)]', //               4 per view
    '2xl:w-[calc((100%_-_6rem)/5)]', //                5 per view
].join(' ')

export function TopicSection({
                                 index,
                                 title,
                                 description,
                                 materials,
                                 totalCount,
                                 viewAllHref,
                                 viewAllLabel = 'Смотреть все',
                             }: TopicSectionProps) {
    const [expanded, setExpanded] = useState(true)
    const [canScrollLeft, setCanScrollLeft] = useState(false)
    const [canScrollRight, setCanScrollRight] = useState(false)
    const scrollerRef = useRef<HTMLDivElement>(null)

    // Arrows depend on real overflow, not on how many items were passed in.
    const updateScrollState = useCallback(() => {
        const el = scrollerRef.current
        if (!el) return
        setCanScrollLeft(el.scrollLeft > 4)
        setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4)
    }, [])

    useEffect(() => {
        const el = scrollerRef.current
        if (!el) return
        updateScrollState()
        const observer = new ResizeObserver(updateScrollState)
        observer.observe(el)
        return () => observer.disconnect()
    }, [expanded, materials.length, updateScrollState])

    // One click = one full "page" of cards (e.g. the next 5); snap-start aligns it.
    const scrollByPage = (direction: 1 | -1) => {
        const el = scrollerRef.current
        if (!el) return
        el.scrollBy({ left: direction * el.clientWidth, behavior: 'smooth' })
    }

    const toggle = () => setExpanded((value) => !value)

    if (materials.length === 0) return null

    return (
        <div className="mb-6 overflow-hidden rounded-2xl border border-[#155335]/10">
            {/* Header: a div, not a button — so the "View all" link can live inside it */}
            <div className="flex w-full items-center justify-between gap-4 bg-[#155335]/5 px-6 py-4">
                <button
                    type="button"
                    onClick={toggle}
                    aria-expanded={expanded}
                    className="flex min-w-0 flex-1 items-center gap-3 text-left"
                >
                    {typeof index === 'number' ? (
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#155335] text-sm font-medium text-white">
                            {index}
                        </span>
                    ) : (
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center text-[#155335]">
                            <FolderOpen size={18} />
                        </span>
                    )}
                    <div className="min-w-0">
                        <p className="font-serif text-lg text-[#1A1A1A]">{title}</p>
                        {description ? <p className="text-sm text-[#1A1A1A]/50">{description}</p> : null}
                    </div>
                </button>

                <div className="flex shrink-0 items-center gap-4">
                    <span className="hidden text-sm text-[#1A1A1A]/60 sm:inline">{totalCount} видео</span>

                    {viewAllHref ? (
                        <Link
                            href={viewAllHref}
                            className="inline-flex items-center gap-1 rounded-full border border-[#155335]/20 px-4 py-1.5 text-sm font-medium text-[#155335] transition hover:bg-[#155335] hover:text-white"
                        >
                            {viewAllLabel}
                            <ChevronRight size={14} />
                        </Link>
                    ) : null}

                    <button
                        type="button"
                        onClick={toggle}
                        aria-expanded={expanded}
                        aria-label={expanded ? 'Свернуть' : 'Развернуть'}
                        className="flex h-8 w-8 items-center justify-center rounded-full text-[#1A1A1A]/60 hover:bg-[#155335]/10"
                    >
                        <ChevronDown size={18} className={`transition-transform ${expanded ? 'rotate-180' : ''}`} />
                    </button>
                </div>
            </div>

            {expanded ? (
                <div className="relative bg-white px-6 py-6">
                    <div
                        ref={scrollerRef}
                        onScroll={updateScrollState}
                        className="flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                    >
                        {materials.map((material) => (
                            <div key={material.id} className={`${CARD_WIDTH} shrink-0 snap-start`}>
                                <VideoCard material={material} variant="grid" />
                            </div>
                        ))}
                    </div>

                    {canScrollLeft ? (
                        <button
                            type="button"
                            onClick={() => scrollByPage(-1)}
                            className="absolute left-2 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-[#155335]/10 bg-white text-[#155335] shadow-md transition hover:bg-[#155335] hover:text-white"
                            aria-label="Назад"
                        >
                            <ChevronLeft size={20} />
                        </button>
                    ) : null}

                    {canScrollRight ? (
                        <button
                            type="button"
                            onClick={() => scrollByPage(1)}
                            className="absolute right-2 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-[#155335]/10 bg-white text-[#155335] shadow-md transition hover:bg-[#155335] hover:text-white"
                            aria-label="Вперёд"
                        >
                            <ChevronRight size={20} />
                        </button>
                    ) : null}
                </div>
            ) : null}
        </div>
    )
}
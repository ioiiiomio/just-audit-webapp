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
const CARD_WIDTH = [
    'w-[85%]', //                          mobile: 1 + a peek of the next
    'sm:w-[calc((100%_-_1.5rem)/2)]', //   2 per view
    'md:w-[calc((100%_-_3rem)/3)]', //     3 per view
    'xl:w-[calc((100%_-_4.5rem)/4)]', //   4 per view
    '2xl:w-[calc((100%_-_6rem)/5)]', //    5 per view
].join(' ')

const ARROW_CLASS =
    'absolute top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-[#155335]/10 bg-white text-[#155335] shadow-md transition hover:bg-[#155335] hover:text-white sm:flex'

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

    // One click = one full "page" of cards; snap-start aligns it.
    const scrollByPage = (direction: 1 | -1) => {
        const el = scrollerRef.current
        if (!el) return
        el.scrollBy({ left: direction * el.clientWidth, behavior: 'smooth' })
    }

    const toggle = () => setExpanded((value) => !value)

    if (materials.length === 0) return null

    return (
        <div className="mb-6 overflow-hidden rounded-2xl border border-[#155335]/10">
            {/* ---------- Header ---------- */}
            <div className="bg-[#155335]/5 px-4 py-4 sm:px-6">
                <div className="flex items-start gap-3 sm:items-center sm:gap-4">
                    <button
                        type="button"
                        onClick={toggle}
                        aria-expanded={expanded}
                        className="flex min-w-0 flex-1 items-start gap-3 text-left sm:items-center"
                    >
                        {typeof index === 'number' ? (
                            <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#155335] text-sm font-medium text-white sm:mt-0">
                                {index}
                            </span>
                        ) : (
                            <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center text-[#155335] sm:mt-0">
                                <FolderOpen size={18} />
                            </span>
                        )}
                        <div className="min-w-0">
                            <p className="font-serif text-lg leading-snug text-[#1A1A1A]">{title}</p>
                            {description ? (
                                <p className="mt-0.5 text-sm text-[#1A1A1A]/50">{description}</p>
                            ) : null}
                        </div>
                    </button>

                    <div className="flex shrink-0 items-center gap-4">
                        {/* Desktop: count + pill inline with the title */}
                        <span className="hidden text-sm text-[#1A1A1A]/60 sm:inline">{totalCount} видео</span>
                        {viewAllHref ? (
                            <Link
                                href={viewAllHref}
                                className="hidden items-center gap-1 rounded-full border border-[#155335]/20 px-4 py-1.5 text-sm font-medium text-[#155335] transition hover:bg-[#155335] hover:text-white sm:inline-flex"
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
                            <ChevronDown
                                size={18}
                                className={`transition-transform ${expanded ? 'rotate-180' : ''}`}
                            />
                        </button>
                    </div>
                </div>

                {/* Mobile: pill on its own row, aligned with the title, count included */}
                {viewAllHref ? (
                    <div className="mt-3 pl-10 sm:hidden">
                        <Link
                            href={viewAllHref}
                            className="inline-flex items-center gap-1 rounded-full border border-[#155335]/20 px-4 py-1.5 text-sm font-medium text-[#155335] transition active:bg-[#155335] active:text-white"
                        >
                            {viewAllLabel} · {totalCount}
                            <ChevronRight size={14} />
                        </Link>
                    </div>
                ) : null}
            </div>

            {/* ---------- Carousel ---------- */}
            {expanded ? (
                <div className="relative bg-white px-4 py-5 sm:px-6 sm:py-6">
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
                            className={`${ARROW_CLASS} left-2`}
                            aria-label="Назад"
                        >
                            <ChevronLeft size={20} />
                        </button>
                    ) : null}

                    {canScrollRight ? (
                        <button
                            type="button"
                            onClick={() => scrollByPage(1)}
                            className={`${ARROW_CLASS} right-2`}
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
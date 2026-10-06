import { cache } from 'react'
import { getPayload } from 'payload'
import { getTranslations } from 'next-intl/server'
import configPromise from '@payload-config'
import type { Metadata } from 'next'
import { Link } from '@/i18n/navigation'
import type { Locale } from '@/i18n/routing'
import { VideoCard } from '@/components/education/video-card'
import { Pagination } from '@/components/education/pagination'
import { SearchSortBar } from '@/components/education/search-sort-bar'
import { VideoListItem} from "@/components/education/filters/video-list-item";
import { VideoFiltersSidebar } from '@/components/education/filters/video-filters-sidebar'
import type { EducationMaterial, EducationTopic } from '@/lib/education/types'
import { OTHER_TOPIC_SLUG, topicOrderOf } from '@/lib/education/topics'

const PAGE_SIZE = 12

export type TopicVideosData = {
    topic?: EducationTopic
    materials: EducationMaterial[]
}

/** Returns null when `slug` isn't a topic, so the caller can fall back to the video detail page. */
export const loadTopicVideos = cache(async (locale: Locale, slug: string): Promise<TopicVideosData | null> => {
    const payload = await getPayload({ config: configPromise })
    const isOther = slug === OTHER_TOPIC_SLUG

    let topic: EducationTopic | undefined
    if (!isOther) {
        const res = await payload.find({
            collection: 'education-topics',
            locale,
            where: { slug: { equals: slug } },
            limit: 1,
            depth: 0,
        })
        topic = res.docs[0] as EducationTopic | undefined
        if (!topic) return null // not a topic → it's a video slug
    }

    const { docs } = await payload.find({
        collection: 'education-materials',
        locale,
        where: { contentType: { equals: 'video' } },
        sort: '-publishedDate',
        depth: 2,
        pagination: false,
    })
    const all = docs as EducationMaterial[]

    const materials = topic
        ? all
            .filter((m) => m.topics?.some((entry) => entry.topic?.id === topic!.id))
            .sort((a, b) => topicOrderOf(a, topic!.id) - topicOrderOf(b, topic!.id))
        : all.filter((m) => !m.topics || m.topics.length === 0)

    return { topic, materials }
})

export async function topicVideosMetadata(locale: Locale, slug: string, data: TopicVideosData): Promise<Metadata> {
    const t = await getTranslations({ locale, namespace: 'knowledge' })
    const title = data.topic?.name ?? t('videosList.noTopicTitle')
    const url = `https://justaudit.kz/${locale}/knowledge/videos/${slug}`

    return {
        title: `${title} | Just Audit`,
        description: data.topic?.description ?? t('videosList.noTopicDescription'),
        alternates: {
            canonical: url,
            languages: {
                'ru-KZ': `https://justaudit.kz/ru/knowledge/videos/${slug}`,
                'kk-KZ': `https://justaudit.kz/kz/knowledge/videos/${slug}`,
                'en-US': `https://justaudit.kz/en/knowledge/videos/${slug}`,
            },
        },
        openGraph: { type: 'website', url, siteName: 'Just Audit' },
    }
}

// ---------- in-memory filtering helpers ----------

function yearOf(material: EducationMaterial): string | null {
    return material.publishedDate ? String(new Date(material.publishedDate).getUTCFullYear()) : null
}

function timeOf(material: EducationMaterial): number {
    return material.publishedDate ? new Date(material.publishedDate).getTime() : 0
}

function matchesQuery(material: EducationMaterial, query: string): boolean {
    const haystack = `${material.title} ${material.excerpt ?? ''}`.toLowerCase()
    return haystack.includes(query.toLowerCase().trim())
}

function sortMaterials(materials: EducationMaterial[], sort: string, locale: Locale): EducationMaterial[] {
    const list = [...materials]
    switch (sort) {
        case 'newest':
            return list.sort((a, b) => timeOf(b) - timeOf(a))
        case 'oldest':
            return list.sort((a, b) => timeOf(a) - timeOf(b))
        case 'title':
            return list.sort((a, b) => a.title.localeCompare(b.title, locale === 'kz' ? 'kk' : locale))
        default:
            return list // 'order' — already in the topic's admin-defined order
    }
}

export async function TopicVideosView({
                                          locale,
                                          slug,
                                          data,
                                          searchParams: sp,
                                      }: {
    locale: Locale
    slug: string
    data: TopicVideosData
    searchParams: Record<string, string | undefined>
}) {
    const t = await getTranslations({ locale, namespace: 'knowledge' })
    const { topic, materials } = data
    const title = topic?.name ?? t('videosList.noTopicTitle')
    const description = topic?.description ?? t('videosList.noTopicDescription')

    // ---- Sidebar options — counts are based on this topic's videos ----

    const yearCounts = new Map<string, number>()
    for (const m of materials) {
        const year = yearOf(m)
        if (year) yearCounts.set(year, (yearCounts.get(year) ?? 0) + 1)
    }
    const yearOptions = [...yearCounts.entries()]
        .sort(([a], [b]) => Number(b) - Number(a))
        .map(([year, count]) => ({ value: year, label: year, count }))

    // ---- Apply filters ----
    let filtered = materials
    if (sp.year) filtered = filtered.filter((m) => yearOf(m) === sp.year)
    if (sp.q) filtered = filtered.filter((m) => matchesQuery(m, sp.q!))

    // Topics default to the admin-defined order; "other" has none, so newest first.
    const defaultSort = topic ? 'order' : 'newest'
    const sort = sp.sort ?? defaultSort
    filtered = sortMaterials(filtered, sort, locale)

    const sortOptions = [
        ...(topic ? [{ value: 'order', label: t('searchSortBar.sortDefault') }] : []),
        { value: 'newest', label: t('searchSortBar.sortNewest') },
        { value: 'oldest', label: t('searchSortBar.sortOldest') },
        { value: 'title', label: t('searchSortBar.sortByTitle') },
    ]

    // ---- Pagination ----
    const totalDocs = filtered.length
    const totalPages = Math.max(1, Math.ceil(totalDocs / PAGE_SIZE))
    const page = Math.min(Math.max(1, Number(sp.page) || 1), totalPages)
    const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

    const view = sp.view === 'list' ? 'list' : 'grid'

    return (
        <main className="min-h-screen bg-[#F7F5F2]">
            <div className="w-full px-6 pt-8 lg:px-16">
                <nav className="flex flex-wrap items-center gap-2 text-sm text-[#1A1A1A]/50">
                    <Link href="/">{t('home')}</Link>
                    <span>/</span>
                    <Link href="/knowledge">{t('breadcrumb')}</Link>
                    <span>/</span>
                    <Link href="/knowledge/videos">{t('videosTitle')}</Link>
                    <span>/</span>
                    <span className="text-[#1A1A1A]">{title}</span>
                </nav>
            </div>

            <section className="w-full px-6 pb-10 pt-6 lg:px-16">
                <h1 className="font-serif text-4xl text-[#1A1A1A]">{title}</h1>
                {description ? <p className="mt-4 max-w-2xl text-base text-[#1A1A1A]/60">{description}</p> : null}
            </section>

            <section className="w-full gap-10 px-6 pb-20 lg:flex lg:px-16">
                <VideoFiltersSidebar
                    totalCount={materials.length}
                    years={yearOptions}
                    yearLabel={t('videosList.yearLabel')}
                    allYearsLabel={t('videosList.allYearsLabel')}
                />

                <div className="mt-8 min-w-0 flex-1 lg:mt-0">
                    <SearchSortBar
                        resultsCount={totalDocs}
                        resultsLabel={t('videosList.resultsLabel')}
                        sortOptions={sortOptions}
                        searchPlaceholder={t('searchSortBar.searchPlaceholder')}
                        gridViewLabel={t('searchSortBar.gridViewLabel')}
                        listViewLabel={t('searchSortBar.listViewLabel')}
                        foundLabel={t('searchSortBar.foundLabel')}
                    />

                    {paged.length > 0 ? (
                        <div
                            className={
                                view === 'list'
                                    ? 'mt-6 flex flex-col gap-4'
                                    : 'mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4'
                            }
                        >
                            {paged.map((material) =>
                                view === 'list' ? (
                                    <VideoListItem key={material.id} material={material} locale={locale} />
                                ) : (
                                    <VideoCard key={material.id} material={material} variant="grid" />
                                ),
                            )}
                        </div>
                    ) : (
                        <p className="mt-10 rounded-2xl border border-[#EDE9E3] bg-white p-10 text-center text-[#1A1A1A]/60">
                            {t('videosList.empty')}
                        </p>
                    )}

                    {totalPages > 1 ? (
                        <div className="mt-10">
                            <Pagination
                                currentPage={page}
                                totalPages={totalPages}
                                basePath={`/knowledge/videos/${slug}`}
                                searchParams={sp}
                                nextLabel={t('pagination.nextLabel')}
                            />
                        </div>
                    ) : null}
                </div>
            </section>
        </main>
    )
}
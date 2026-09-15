import { getPayload } from 'payload'
import { getTranslations } from 'next-intl/server'
import configPromise from '@payload-config'
import type { Where } from 'payload'
import { Link } from '@/i18n/navigation'
import type { Locale } from '@/i18n/routing'
import { VideoCard } from '@/components/education/video-card'
import { SearchSortBar } from '@/components/education/search-sort-bar'
import { Pagination } from '@/components/education/pagination'
import { VideoFiltersSidebar } from '@/components/education/filters/video-filters-sidebar'
import { TopicSection } from '@/components/education/topic-section'
import type { EducationMaterial, EducationCategory, EducationTopic } from '@/lib/education/types'

const PAGE_SIZE = 9
const PREVIEW_SIZE = 4 // cards shown per topic row before "Показать все"

// Stable values used for filtering logic; display labels are localized separately.
const YEAR_VALUES = ['2024', '2023', '2022', 'older'] as const

// `topics` on EducationMaterial is now `{ topic, order }[]` — order is scoped
// to one topic, so the same video can rank differently in different topics.
function topicOrderOf(material: EducationMaterial, topicId: string | number) {
    return material.topics?.find((entry) => entry.topic?.id === topicId)?.order ?? 0
}

export default async function VideosListPage({
                                                 params,
                                                 searchParams,
                                             }: {
    params: Promise<{ locale: Locale }>
    searchParams: Promise<Record<string, string | undefined>>
}) {
    const { locale } = await params
    const sp = await searchParams
    const page = Number(sp.page) || 1
    const t = await getTranslations({ locale, namespace: 'knowledge' })

    const payload = await getPayload({ config: configPromise })

    // Filters that map cleanly to a DB `where` clause. Topic filtering happens
    // in memory below, since ordering lives inside the `topics` array field.
    const and: Where[] = [{ contentType: { equals: 'video' } }]
    if (sp.category) and.push({ 'category.slug': { equals: sp.category } })
    if (sp.q) and.push({ title: { like: sp.q } })
    if (sp.year && sp.year !== 'older') {
        and.push({ publishedDate: { greater_than_equal: `${sp.year}-01-01` } })
        and.push({ publishedDate: { less_than: `${Number(sp.year) + 1}-01-01` } })
    } else if (sp.year === 'older') {
        and.push({ publishedDate: { less_than: '2022-01-01' } })
    }

    const sortMap: Record<string, string> = { newest: '-publishedDate', oldest: 'publishedDate', title: 'title' }
    const sort = sortMap[sp.sort ?? 'newest'] ?? '-publishedDate'

    const [allMaterialsResult, categoriesResult, topicsResult] = await Promise.all([
        // depth: 2 populates `topics[].topic` (name/slug) and `category`.
        // pagination: false returns every matching doc — fine at a firm's-library
        // scale (tens/low hundreds of videos); move sorting/grouping server-side
        // (or filter `topics.topic` directly in `where`) if this ever grows large.
        payload.find({
            collection: 'education-materials',
            locale,
            where: { and },
            sort,
            depth: 2,
            pagination: false,
        }),
        payload.find({ collection: 'education-categories', locale, sort: 'order', depth: 0 }),
        payload.find({ collection: 'education-topics', locale, sort: 'order', depth: 0 }),
    ])

    const allMaterials = allMaterialsResult.docs as EducationMaterial[]
    const categories = categoriesResult.docs as EducationCategory[]
    const topics = topicsResult.docs as EducationTopic[]

    const categoryOptions = await Promise.all(
        categories.map(async (category) => {
            const { totalDocs } = await payload.count({
                collection: 'education-materials',
                where: { and: [{ contentType: { equals: 'video' } }, { category: { equals: category.id } }] },
            })
            return { value: category.slug, label: category.name, count: totalDocs }
        }),
    )

    const topicOptions = topics.map((topic) => ({
        value: topic.slug,
        label: topic.name,
        count: allMaterials.filter((m) => m.topics?.some((entry) => entry.topic?.id === topic.id)).length,
    }))

    const yearOptions = YEAR_VALUES.map((year) => ({
        value: year,
        label: year === 'older' ? t('videosList.yearOlder') : year,
        count: 0,
    }))

    const view = sp.view === 'list' ? 'list' : 'grid'
    const activeTopic = sp.topic ? topics.find((topic) => topic.slug === sp.topic) : undefined

    const sidebarProps = {
        totalCount: allMaterials.length,
        categories: categoryOptions,
        topics: topicOptions,
        years: yearOptions,
        categoriesTitle: t('categoriesTitle'),
        allCategoriesLabel: t('videosList.allCategoriesLabel'),
        topicsLabel: t('seminarsList.topicsLabel'),
        allTopicsLabel: t('seminarsList.allTopicsLabel'),
        yearLabel: t('videosList.yearLabel'),
        allYearsLabel: t('videosList.allYearsLabel'),
    }

    const sortOptions = [
        { value: 'newest', label: t('searchSortBar.sortNewest') },
        { value: 'oldest', label: t('searchSortBar.sortOldest') },
        { value: 'title', label: t('searchSortBar.sortByTitle') },
    ]

    // ---- Flat, paginated view — shown once a topic is picked or a search is typed ----
    if (activeTopic || sp.q) {
        let filtered = allMaterials
        if (activeTopic) {
            filtered = filtered
                .filter((m) => m.topics?.some((entry) => entry.topic?.id === activeTopic.id))
                .sort((a, b) => topicOrderOf(a, activeTopic.id) - topicOrderOf(b, activeTopic.id))
        }

        const totalDocs = filtered.length
        const totalPages = Math.ceil(totalDocs / PAGE_SIZE)
        const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

        return (
            <div className="bg-[#F7F5F2]">
                <PageHeader t={t} />
                <section className="mx-auto max-w-6xl gap-10 px-6 pb-20 lg:flex lg:px-16">
                    <VideoFiltersSidebar {...sidebarProps} />
                    <div className="mt-8 flex-1 lg:mt-0">
                        <SearchSortBar
                            resultsCount={totalDocs}
                            resultsLabel={t('videosList.resultsLabel')}
                            sortOptions={sortOptions}
                            searchPlaceholder={t('searchSortBar.searchPlaceholder')}
                            gridViewLabel={t('searchSortBar.gridViewLabel')}
                            listViewLabel={t('searchSortBar.listViewLabel')}
                            foundLabel={t('searchSortBar.foundLabel')}
                        />
                        <div
                            className={
                                view === 'list' ? 'mt-6 flex flex-col gap-4' : 'mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3'
                            }
                        >
                            {paged.map((material) => (
                                <VideoCard key={material.id} material={material} variant="grid" />
                            ))}
                        </div>
                        <div className="mt-10">
                            <Pagination
                                currentPage={page}
                                totalPages={totalPages}
                                basePath="/knowledge/videos"
                                searchParams={sp}
                                nextLabel={t('pagination.nextLabel')}
                            />
                        </div>
                    </div>
                </section>
            </div>
        )
    }

    // ---- Grouped-by-topic view — default browsing state ----
    const topicGroups = topics
        .map((topic, i) => {
            const materials = allMaterials
                .filter((m) => m.topics?.some((entry) => entry.topic?.id === topic.id))
                .sort((a, b) => topicOrderOf(a, topic.id) - topicOrderOf(b, topic.id))
            return { index: i + 1, topic, materials }
        })
        .filter((group) => group.materials.length > 0)

    const untaggedMaterials = allMaterials.filter((m) => !m.topics || m.topics.length === 0)

    return (
        <div className="bg-[#F7F5F2]">
            <PageHeader t={t} />
            <section className="mx-auto max-w-6xl gap-10 px-6 pb-20 lg:flex lg:px-16">
                <VideoFiltersSidebar {...sidebarProps} />
                <div className="mt-8 flex-1 lg:mt-0">
                    <SearchSortBar
                        resultsCount={allMaterials.length}
                        resultsLabel={t('videosList.resultsLabel')}
                        sortOptions={sortOptions}
                        searchPlaceholder={t('searchSortBar.searchPlaceholder')}
                        gridViewLabel={t('searchSortBar.gridViewLabel')}
                        listViewLabel={t('searchSortBar.listViewLabel')}
                        foundLabel={t('searchSortBar.foundLabel')}
                    />

                    <div className="mt-6">
                        {topicGroups.map(({ index, topic, materials }) => (
                            <TopicSection
                                key={topic.id}
                                index={index}
                                title={topic.name}
                                description={topic.description}
                                materials={materials.slice(0, PREVIEW_SIZE)}
                                totalCount={materials.length}
                                viewAllHref={`/knowledge/videos?topic=${topic.slug}`}
                            />
                        ))}

                        {untaggedMaterials.length > 0 ? (
                            <TopicSection
                                title={t('videosList.noTopicTitle')}
                                description={t('videosList.noTopicDescription')}
                                materials={untaggedMaterials.slice(0, PREVIEW_SIZE)}
                                totalCount={untaggedMaterials.length}
                            />
                        ) : null}
                    </div>
                </div>
            </section>
        </div>
    )
}

function PageHeader({ t }: { t: Awaited<ReturnType<typeof getTranslations>> }) {
    return (
        <>
            <div className="mx-auto max-w-6xl px-6 pt-8 lg:px-16">
                <nav className="flex items-center gap-2 text-sm text-[#1A1A1A]/50">
                    <Link href="/">{t('home')}</Link>
                    <span>/</span>
                    <Link href="/knowledge">{t('breadcrumb')}</Link>
                    <span>/</span>
                    <span className="text-[#1A1A1A]">{t('videosTitle')}</span>
                </nav>
            </div>
            <section className="mx-auto max-w-6xl px-6 pb-10 pt-6 lg:px-16">
                <h1 className="font-serif text-4xl text-[#1A1A1A]">
                    {t('videosList.titleLine1')}
                    <br />
                    {t('videosList.titleLine2')}
                </h1>
                <p className="mt-4 max-w-xl text-base text-[#1A1A1A]/60">{t('videosList.subtitle')}</p>
            </section>
        </>
    )
}
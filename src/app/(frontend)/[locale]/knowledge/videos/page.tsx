// videos/page.tsx
import { unstable_cache } from 'next/cache'
import { getPayload } from 'payload'
import { getTranslations } from 'next-intl/server'
import configPromise from '@payload-config'
import { redirect } from 'next/navigation'
import { Link } from '@/i18n/navigation'
import Image from 'next/image'
import type { Metadata } from 'next'
import type { Locale } from '@/i18n/routing'
import { VideoCard } from '@/components/education/video-card'
import { SearchSortBar } from '@/components/education/search-sort-bar'
import { Pagination } from '@/components/education/pagination'
import { VideoFiltersSidebar } from '@/components/education/filters/video-filters-sidebar'
import { VideoListItem } from '@/components/education/filters/video-list-item'
import { TopicSection } from '@/components/education/topic-section'
import { OTHER_TOPIC_SLUG, topicOrderOf } from '@/lib/education/topics'
import type { EducationMaterial, EducationCategory, EducationTopic } from '@/lib/education/types'
import { buildAlternates } from '@/lib/seo'

const BASE_PATH = '/knowledge/videos'
const SITE = 'https://www.justaudit.kz'
const PAGE_SIZE = 9
const YEAR_BUCKETS = 4 // current year + 3 previous, then "older"

const TITLES: Record<string, string> = {
    ru: 'Видео материалы | Just Audit',
    kz: 'Бейне материалдар | Just Audit',
    en: 'Video Materials | Just Audit',
}

const DESCRIPTIONS: Record<string, string> = {
    ru: 'Экспертные видеоматериалы об аудите, финансах и консалтинге от команды JUST AUDIT.',
    kz: 'JUST AUDIT командасының аудит, қаржы және консалтинг бойынша сарапшы бейне материалдары.',
    en: 'Expert video content on audit, finance, and consulting from the JUST AUDIT team.',
}

const OG_LOCALES: Record<string, string> = { ru: 'ru_KZ', kz: 'kk_KZ', en: 'en_US' }

type Props = {
    params: Promise<{ locale: Locale }>
    searchParams: Promise<Record<string, string | undefined>>
}

// One cached fetch per locale (60 s). Replaces the per-request query + one
// count() per category. Filtering/sorting below happens in memory.
const getVideosData = unstable_cache(
    async (locale: Locale) => {
        const payload = await getPayload({ config: configPromise })
        const [all, categories, topics] = await Promise.all([
            payload.find({
                collection: 'education-materials',
                locale,
                where: { contentType: { equals: 'video' } },
                sort: '-publishedDate',
                depth: 2,
                pagination: false,
            }),
            payload.find({ collection: 'education-categories', locale, sort: 'order', depth: 0, pagination: false }),
            payload.find({ collection: 'education-topics', locale, sort: 'order', depth: 0, pagination: false }),
        ])
        return {
            materials: all.docs as EducationMaterial[],
            categories: categories.docs as EducationCategory[],
            topics: topics.docs as EducationTopic[],
        }
    },
    ['videos-list'],
    { revalidate: 60, tags: ['education-materials'] },
)

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
    const { locale } = await params
    const sp = await searchParams

    // Search / filter / sort views are variations of this list: keep them out of the index
    const isVariant = Boolean(sp.q || sp.category || sp.year || sp.topic || sp.sort || sp.view || sp.page)

    return {
        title: { absolute: TITLES[locale] ?? TITLES.ru },
        description: DESCRIPTIONS[locale] ?? DESCRIPTIONS.ru,
        alternates: buildAlternates(locale, BASE_PATH),
        robots: isVariant ? { index: false, follow: true } : undefined,
        openGraph: {
            type: 'website',
            locale: OG_LOCALES[locale] ?? OG_LOCALES.ru,
            url: `${SITE}/${locale}${BASE_PATH}`,
            siteName: 'Just Audit',
        },
    }
}

const yearOf = (m: EducationMaterial) =>
    m.publishedDate ? new Date(m.publishedDate).getFullYear() : null

export default async function VideosListPage({ params, searchParams }: Props) {
    const { locale } = await params
    const sp = await searchParams
    const page = Math.max(1, Number(sp.page) || 1)

    const [t, { materials: allVideos, categories, topics }] = await Promise.all([
        getTranslations({ locale, namespace: 'knowledge' }),
        getVideosData(locale),
    ])

    const activeTopic = sp.topic ? topics.find((topic) => topic.slug === sp.topic) : undefined

    // Old `?topic=` links (e.g. from the sidebar) → the dedicated topic page.
    // Kept only when combined with a search, where the flat view below handles it.
    if (activeTopic && !sp.q) {
        redirect(`/${locale}${BASE_PATH}/${activeTopic.slug}`)
    }

    // ---- Year buckets, derived from today's date (no more hard-coded years) ----
    const currentYear = new Date().getFullYear()
    const recentYears = Array.from({ length: YEAR_BUCKETS }, (_, i) => String(currentYear - i))
    const olderThan = currentYear - YEAR_BUCKETS + 1

    const matchesYear = (m: EducationMaterial, year: string) => {
        const y = yearOf(m)
        if (y === null) return false
        return year === 'older' ? y < olderThan : y === Number(year)
    }

    // ---- Apply filters in memory (same semantics as the old `where`) ----
    let filtered = allVideos
    if (sp.category) filtered = filtered.filter((m) => m.category?.slug === sp.category)
    if (sp.year) filtered = filtered.filter((m) => matchesYear(m, sp.year!))
    if (sp.q) {
        // Payload `like` semantics: every word must appear, case-insensitive
        const words = sp.q.toLowerCase().split(/\s+/).filter(Boolean)
        filtered = filtered.filter((m) => {
            const title = m.title.toLowerCase()
            return words.every((w) => title.includes(w))
        })
    }

    const sortBy = sp.sort ?? 'newest'
    if (sortBy !== 'newest') {
        filtered = [...filtered].sort((a, b) => {
            if (sortBy === 'title') return a.title.localeCompare(b.title, locale)
            const dateA = a.publishedDate ? new Date(a.publishedDate).getTime() : 0
            const dateB = b.publishedDate ? new Date(b.publishedDate).getTime() : 0
            return dateA - dateB // oldest
        })
    }

    // ---- Facet counts ----
    const categoryOptions = categories.map((category) => ({
        value: category.slug,
        label: category.name,
        count: allVideos.filter((m) => m.category?.id === category.id).length,
    }))

    const topicOptions = topics.map((topic) => ({
        value: topic.slug,
        label: topic.name,
        count: filtered.filter((m) => m.topics?.some((entry) => entry.topic?.id === topic.id)).length,
    }))

    const yearOptions = [...recentYears, 'older'].map((year) => ({
        value: year,
        label: year === 'older' ? t('videosList.yearOlder') : year,
        count: allVideos.filter((m) => matchesYear(m, year)).length,
    }))

    const view = sp.view === 'list' ? 'list' : 'grid'

    const sidebarProps = {
        totalCount: filtered.length,
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

    // ---- Flat, paginated view — shown when a search is typed ----
    if (sp.q) {
        let results = filtered
        if (activeTopic) {
            results = results
                .filter((m) => m.topics?.some((entry) => entry.topic?.id === activeTopic.id))
                .sort((a, b) => topicOrderOf(a, activeTopic.id) - topicOrderOf(b, activeTopic.id))
        }

        const totalDocs = results.length
        const totalPages = Math.ceil(totalDocs / PAGE_SIZE)
        const paged = results.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

        return (
            <main className="min-h-screen bg-[#F7F5F2]">
                <PageHeader t={t} />
                <section className="w-full gap-10 px-6 pb-20 lg:flex lg:px-16">
                    <VideoFiltersSidebar {...sidebarProps} />
                    <div className="mt-8 min-w-0 flex-1 lg:mt-0">
                        <SearchSortBar
                            resultsCount={totalDocs}
                            resultsLabel={t('videosList.resultsLabel')}
                            sortOptions={sortOptions}
                            searchPlaceholder={t('searchSortBar.searchPlaceholder')}
                            gridViewLabel={t('searchSortBar.gridViewLabel')}
                            listViewLabel={t('searchSortBar.listViewLabel')}
                            showViewToggle={false}
                            foundLabel={t('searchSortBar.foundLabel')}
                        />
                        <div
                            className={
                                view === 'list' ? 'mt-6 flex flex-col gap-4' : 'mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3'
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
                        <div className="mt-10">
                            <Pagination
                                currentPage={page}
                                totalPages={totalPages}
                                basePath={BASE_PATH}
                                searchParams={sp}
                                nextLabel={t('pagination.nextLabel')}
                            />
                        </div>
                    </div>
                </section>
            </main>
        )
    }

    // ---- Grouped-by-topic view — default browsing state ----
    const topicGroups = topics
        .map((topic, i) => {
            const materials = filtered
                .filter((m) => m.topics?.some((entry) => entry.topic?.id === topic.id))
                .sort((a, b) => topicOrderOf(a, topic.id) - topicOrderOf(b, topic.id))
            return { index: i + 1, topic, materials }
        })
        .filter((group) => group.materials.length > 0)

    const untaggedMaterials = filtered.filter((m) => !m.topics || m.topics.length === 0)

    return (
        <main className="min-h-screen bg-[#F7F5F2]">
            <PageHeader t={t} />
            <section className="w-full gap-10 px-6 pb-20 lg:flex lg:px-16">
                <VideoFiltersSidebar {...sidebarProps} />
                <div className="mt-8 min-w-0 flex-1 lg:mt-0">
                    <SearchSortBar
                        resultsCount={filtered.length}
                        resultsLabel={t('videosList.resultsLabel')}
                        sortOptions={sortOptions}
                        searchPlaceholder={t('searchSortBar.searchPlaceholder')}
                        gridViewLabel={t('searchSortBar.gridViewLabel')}
                        listViewLabel={t('searchSortBar.listViewLabel')}
                        showViewToggle={false}
                        foundLabel={t('searchSortBar.foundLabel')}
                    />

                    <div className="mt-6">
                        {topicGroups.map(({ index, topic, materials }) => (
                            <TopicSection
                                key={topic.id}
                                index={index}
                                title={topic.name}
                                description={topic.description}
                                materials={materials}
                                totalCount={materials.length}
                                viewAllHref={`${BASE_PATH}/${topic.slug}`}
                                viewAllLabel={t('videosList.viewAll')}
                            />
                        ))}

                        {untaggedMaterials.length > 0 ? (
                            <TopicSection
                                title={t('videosList.noTopicTitle')}
                                description={t('videosList.noTopicDescription')}
                                materials={untaggedMaterials}
                                totalCount={untaggedMaterials.length}
                                viewAllHref={`${BASE_PATH}/${OTHER_TOPIC_SLUG}`}
                                viewAllLabel={t('videosList.viewAll')}
                            />
                        ) : null}
                    </div>
                </div>
            </section>
        </main>
    )
}

function PageHeader({ t }: { t: Awaited<ReturnType<typeof getTranslations>> }) {
    return (
        <>
            <div className="w-full px-6 pt-8 lg:px-16">
                <nav className="flex items-center gap-2 text-sm text-[#1A1A1A]/70">
                    <Link href="/">{t('home')}</Link>
                    <span aria-hidden="true">/</span>
                    <Link href="/knowledge">{t('breadcrumb')}</Link>
                    <span aria-hidden="true">/</span>
                    <span className="text-[#1A1A1A]">{t('videosTitle')}</span>
                </nav>
            </div>
            <section className="w-full gap-10 px-6 pb-10 pt-6 lg:flex lg:px-16">
                <div className="grid w-full items-center gap-10 lg:grid-cols-[3fr_2fr]">
                    <div className="text-left">
                        <h1 className="font-serif text-4xl text-[#1A1A1A]">{t('videosList.titleLine1')}</h1>
                        <p className="mt-4 max-w-xl text-base text-[#1A1A1A]/70">{t('videosList.subtitle')}</p>
                    </div>
                    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-[#EDE9E3] lg:ml-auto lg:aspect-[16/10] lg:max-w-md">
                        <Image
                            src="/images/education.png"
                            alt={t('imageAlt')}
                            fill
                            priority
                            className="object-cover"
                            sizes="(max-width: 1024px) 100vw, 448px"
                        />
                    </div>
                </div>
            </section>
        </>
    )
}
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
import type { EducationMaterial, EducationCategory, EducationTopic } from '@/lib/education/types'

const PAGE_SIZE = 9

// Stable values used for filtering logic; display labels are localized separately.
const YEAR_VALUES = ['2024', '2023', '2022', 'older'] as const

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

    const where: Where = { contentType: { equals: 'video' } }
    const and: Where[] = []

    if (sp.category) and.push({ 'category.slug': { equals: sp.category } })
    if (sp.topic) and.push({ 'topics.slug': { equals: sp.topic } })
    if (sp.q) and.push({ title: { like: sp.q } })
    if (sp.year && sp.year !== 'older') {
        and.push({ publishedDate: { greater_than_equal: `${sp.year}-01-01` } })
        and.push({ publishedDate: { less_than: `${Number(sp.year) + 1}-01-01` } })
    } else if (sp.year === 'older') {
        and.push({ publishedDate: { less_than: '2022-01-01' } })
    }

    if (and.length) where.and = and

    const sortMap: Record<string, string> = { newest: '-publishedDate', oldest: 'publishedDate', title: 'title' }
    const sort = sortMap[sp.sort ?? 'newest'] ?? '-publishedDate'

    const [result, categoriesResult, topicsResult] = await Promise.all([
        payload.find({
            collection: 'education-materials',
            locale: locale,
            where,
            sort,
            page,
            limit: PAGE_SIZE,
            depth: 1,
        }),
        payload.find({ collection: 'education-categories', locale: locale, sort: 'order', depth: 0 }),
        payload.find({ collection: 'education-topics', locale: locale, depth: 0 }),
    ])

    const [categoryOptions, topicOptions] = await Promise.all([
        Promise.all(
            (categoriesResult.docs as EducationCategory[]).map(async (category) => {
                const { totalDocs } = await payload.count({
                    collection: 'education-materials',
                    where: { and: [{ contentType: { equals: 'video' } }, { category: { equals: category.id } }] },
                })
                return { value: category.slug, label: category.name, count: totalDocs }
            }),
        ),
        Promise.all(
            (topicsResult.docs as EducationTopic[]).map(async (topic) => {
                const { totalDocs } = await payload.count({
                    collection: 'education-materials',
                    where: { and: [{ contentType: { equals: 'video' } }, { topics: { equals: topic.id } }] },
                })
                return { value: topic.slug, label: topic.name, count: totalDocs }
            }),
        ),
    ])

    const yearOptions = YEAR_VALUES.map((year) => ({
        value: year,
        label: year === 'older' ? t('videosList.yearOlder') : year,
        count: 0,
    }))

    const totalPages = Math.ceil(result.totalDocs / PAGE_SIZE)

    return (
        <div className="bg-[#F7F5F2]">
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

            <section className="mx-auto max-w-6xl gap-10 px-6 pb-20 lg:flex lg:px-16">
                <VideoFiltersSidebar
                    totalCount={result.totalDocs}
                    categories={categoryOptions}
                    topics={topicOptions}
                    years={yearOptions}
                />

                <div className="mt-8 flex-1 lg:mt-0">
                    <SearchSortBar resultsCount={result.totalDocs} resultsLabel={t('videosList.resultsLabel')} />

                    <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {(result.docs as EducationMaterial[]).map((material) => (
                            <VideoCard key={material.id} material={material} variant="grid" />
                        ))}
                    </div>

                    <div className="mt-10">
                        <Pagination
                            currentPage={page}
                            totalPages={totalPages}
                            basePath="/knowledge/videos"
                            searchParams={sp}
                        />
                    </div>
                </div>
            </section>
        </div>
    )
}
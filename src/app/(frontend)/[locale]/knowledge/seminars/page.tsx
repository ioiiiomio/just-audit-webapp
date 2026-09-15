// seminars/page.tsx
import { getPayload } from 'payload'
import { getTranslations } from 'next-intl/server'
import configPromise from '@payload-config'
import { Link } from '@/i18n/navigation'
import Image from 'next/image'
import type { Locale } from '@/i18n/routing'
import { EducationCard } from '@/components/education/education-card'
import { SearchSortBar } from '@/components/education/search-sort-bar'
import { Pagination } from '@/components/education/pagination'
import { MaterialsFiltersSidebar } from '@/components/education/filters/materials-filters-sidebar'
import type { EducationMaterial, EducationMaterialType, EducationTopic } from '@/lib/education/types'
import type { Metadata } from 'next'

export const revalidate = 60

const TITLES: Record<string, string> = {
    ru: 'Текстовые материалы | Just Audit',
    kz: 'Мәтіндік материалдар | Just Audit',
    en: 'Text Materials | Just Audit',
}

const DESCRIPTIONS: Record<string, string> = {
    ru: 'Практические материалы от наших экспертов — семинары, статьи и разборы с презентациями и дополнительными файлами.',
    kz: 'Біздің сарапшылардың тәжірибелік материалдары — семинарлар, мақалалар және презентациялары бар талдаулар.',
    en: 'Practical materials from our experts — seminars, articles, and analyses with presentations and additional files.',
}

const OG_LOCALES: Record<string, string> = {
    ru: 'ru_KZ',
    kz: 'kk_KZ',
    en: 'en_US',
}

export async function generateMetadata({
                                           params,
                                       }: {
    params: Promise<{ locale: string }>
}): Promise<Metadata> {
    const { locale } = await params

    return {
        title: {
            default: TITLES[locale] ?? TITLES.ru,
            template: '%s | Just Audit',
        },
        description: DESCRIPTIONS[locale] ?? DESCRIPTIONS.ru,
        alternates: {
            canonical: `https://justaudit.kz/${locale}/knowledge/seminars`,
            languages: {
                'ru-KZ': 'https://justaudit.kz/ru/knowledge/seminars',
                'kk-KZ': 'https://justaudit.kz/kz/knowledge/seminars',
                'en-US': 'https://justaudit.kz/en/knowledge/seminars',
            },
        },
        openGraph: {
            type: 'website',
            locale: OG_LOCALES[locale] ?? OG_LOCALES.ru,
            url: `https://justaudit.kz/${locale}/knowledge/seminars`,
            siteName: 'Just Audit',
        },
    }
}

const PAGE_SIZE = 9

export default async function SeminarsListPage({
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

    const [allResult, materialTypesResult, topicsResult] = await Promise.all([
        // Every text material, unfiltered — type/topic/search are applied in
        // memory below against this one fetch, same approach used on the videos page.
        payload.find({
            collection: 'education-materials',
            locale,
            where: { contentType: { equals: 'article' } },
            depth: 2,
            pagination: false,
        }),
        payload.find({ collection: 'education-material-types', locale, sort: 'order', depth: 0 }),
        payload.find({ collection: 'education-topics', locale, sort: 'order', depth: 0 }),
    ])

    const allMaterials = allResult.docs as EducationMaterial[]
    const materialTypes = materialTypesResult.docs as EducationMaterialType[]
    const topics = topicsResult.docs as EducationTopic[]

    // ---- Facet counts — static, computed against the full unfiltered set ----
    const typeOptions = materialTypes.map((materialType) => ({
        value: materialType.slug,
        label: materialType.name,
        count: allMaterials.filter((m) => m.type?.id === materialType.id).length,
    }))

    const topicOptions = topics.map((topic) => ({
        value: topic.slug,
        label: topic.name,
        count: allMaterials.filter((m) => m.topics?.some((entry) => entry.topic?.id === topic.id)).length,
    }))

    // ---- Apply active filters, in memory ----
    const selectedTypes = new Set((sp.type ?? '').split(',').filter(Boolean))

    let filtered = allMaterials
    if (selectedTypes.size > 0) filtered = filtered.filter((m) => m.type && selectedTypes.has(m.type.slug))
    if (sp.topic) filtered = filtered.filter((m) => m.topics?.some((entry) => entry.topic?.slug === sp.topic))
    if (sp.q) {
        const query = sp.q.toLowerCase()
        filtered = filtered.filter((m) => m.title.toLowerCase().includes(query))
    }

    const sortBy = sp.sort ?? 'newest'
    filtered = [...filtered].sort((a, b) => {
        if (sortBy === 'title') return a.title.localeCompare(b.title, locale)
        const dateA = a.publishedDate ? new Date(a.publishedDate).getTime() : 0
        const dateB = b.publishedDate ? new Date(b.publishedDate).getTime() : 0
        return sortBy === 'oldest' ? dateA - dateB : dateB - dateA
    })

    const totalDocs = filtered.length
    const totalPages = Math.ceil(totalDocs / PAGE_SIZE)
    const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
    const view = sp.view === 'list' ? 'list' : 'grid'

    return (
        <main className="min-h-screen bg-[#F7F5F2]">
            <div className="w-full px-6 pt-8 lg:px-16">
                <nav className="flex items-center gap-2 text-sm text-[#1A1A1A]/50">
                    <Link href="/">{t('home')}</Link>
                    <span>/</span>
                    <Link href="/knowledge">{t('breadcrumb')}</Link>
                    <span>/</span>
                    <span className="text-[#1A1A1A]">{t('seminarsList.title')}</span>
                </nav>
            </div>
            <section className="w-full gap-10 px-6 pb-10 pt-6 lg:flex lg:px-16">
                <div className="grid w-full items-center gap-10 lg:grid-cols-[3fr_2fr]">
                    <div className="text-left">
                        <h1 className="font-serif text-4xl text-[#1A1A1A]">
                            {t('seminarsList.title')}
                        </h1>
                        <p className="mt-4 max-w-xl text-base text-[#1A1A1A]/60">
                            {t('seminarsList.subtitle')}
                        </p>
                    </div>
                    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-[#EDE9E3] lg:ml-auto lg:aspect-[16/10] lg:max-w-md">
                        <Image
                            src="/images/education.png"
                            alt={t('imageAlt')}
                            fill
                            priority
                            className="object-cover"
                            sizes="(max-width: 1024px) 100vw, 400px"
                        />
                    </div>
                </div>
            </section>

            <section className="w-full gap-10 px-6 pb-20 lg:flex lg:px-16">
                <MaterialsFiltersSidebar typeOptions={typeOptions} topics={topicOptions} totalCount={totalDocs} />
                <div className="mt-8 flex-1 lg:mt-0">
                    <SearchSortBar
                        resultsCount={totalDocs}
                        resultsLabel={t('seminarsList.resultsLabel')}
                        sortOptions={[
                            { value: 'newest', label: t('searchSortBar.sortNewest') },
                            { value: 'oldest', label: t('searchSortBar.sortOldest') },
                            { value: 'title', label: t('searchSortBar.sortByTitle') },
                        ]}
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
                            <EducationCard key={material.id} material={material} locale={locale} />
                        ))}
                    </div>
                    <div className="mt-10">
                        <Pagination
                            currentPage={page}
                            totalPages={totalPages}
                            basePath="/knowledge/seminars"
                            searchParams={sp}
                            nextLabel={t('pagination.nextLabel')}
                        />
                    </div>
                </div>
            </section>
        </main>
    )
}
import { getPayload } from 'payload'
import { getTranslations } from 'next-intl/server'
import configPromise from '@payload-config'
import type { Where } from 'payload'
import { Link } from '@/i18n/navigation'
import type { Locale } from '@/i18n/routing'
import { EducationCard } from '@/components/education/education-card'
import { SearchSortBar } from '@/components/education/search-sort-bar'
import { Pagination } from '@/components/education/pagination'
import { MaterialFiltersSidebar } from '@/components/education/filters/material-filters-sidebar'
import {
  MATERIAL_TYPE_LABELS,
  type EducationMaterial,
  type EducationTopic,
} from '@/lib/education/types'

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

  const and: Where[] = []
  if (sp.type) and.push({ type: { in: sp.type.split(',') } })
  if (sp.topic) and.push({ 'topics.slug': { equals: sp.topic } })
  if (sp.q) and.push({ title: { like: sp.q } })

  const where: Where = and.length ? { and } : {}

  const sortMap: Record<string, string> = { newest: '-publishedDate', oldest: 'publishedDate', title: 'title' }
  const sort = sortMap[sp.sort ?? 'newest'] ?? '-publishedDate'

  const [result, topicsResult] = await Promise.all([
    payload.find({
      collection: 'education-materials',
      locale: locale,
      where,
      sort,
      page,
      limit: PAGE_SIZE,
      depth: 1,
    }),
    payload.find({ collection: 'education-topics', locale: locale, depth: 0 }),
  ])

  const [typeOptions, topicOptions] = await Promise.all([
    Promise.all(
        Object.entries(MATERIAL_TYPE_LABELS).map(async ([value, label]) => {
          const { totalDocs } = await payload.count({ collection: 'education-materials', where: { type: { equals: value } } })
          return { value, label, count: totalDocs }
        }),
    ),
    Promise.all(
        (topicsResult.docs as EducationTopic[]).map(async (topic) => {
          const { totalDocs } = await payload.count({ collection: 'education-materials', where: { topics: { equals: topic.id } } })
          return { value: topic.slug, label: topic.name, count: totalDocs }
        }),
    ),
  ])

  const totalPages = Math.ceil(result.totalDocs / PAGE_SIZE)

  return (
      <div className="bg-[#F7F5F2]">
        <div className="mx-auto max-w-6xl px-6 pt-8 lg:px-16">
          <nav className="flex items-center gap-2 text-sm text-[#1A1A1A]/50">
            <Link href="/">{t('home')}</Link>
            <span>/</span>
            <Link href="/knowledge">{t('breadcrumb')}</Link>
            <span>/</span>
            <span className="text-[#1A1A1A]">{t('seminarsList.breadcrumb')}</span>
          </nav>
        </div>

        <section className="mx-auto max-w-6xl px-6 pb-10 pt-6 lg:px-16">
          <h1 className="font-serif text-4xl text-[#1A1A1A]">{t('seminarsList.title')}</h1>
          <p className="mt-4 max-w-xl text-base text-[#1A1A1A]/60">{t('seminarsList.subtitle')}</p>
        </section>

        <section className="mx-auto max-w-6xl gap-10 px-6 pb-20 lg:flex lg:px-16">
          <MaterialFiltersSidebar
              totalCount={result.totalDocs}
              materialTypes={typeOptions}
              topics={topicOptions}
          />

          <div className="mt-8 flex-1 lg:mt-0">
            <SearchSortBar resultsCount={result.totalDocs} resultsLabel={t('seminarsList.resultsLabel')} />

            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {(result.docs as EducationMaterial[]).map((material) => (
                  <EducationCard key={material.id} material={material} locale={locale} />
              ))}
            </div>

            <div className="mt-10">
              <Pagination currentPage={page} totalPages={totalPages} basePath="/knowledge/seminars" searchParams={sp} />
            </div>
          </div>
        </section>
      </div>
  )
}
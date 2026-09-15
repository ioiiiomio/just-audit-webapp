import { getPayload } from 'payload'
import { getTranslations } from 'next-intl/server'
import configPromise from '@payload-config'
import { Link } from '@/i18n/navigation'
import type { Locale } from '@/i18n/routing'
import { ArrowRight } from 'lucide-react'
import { EducationCard } from '@/components/education/education-card'
import { VideoCard } from '@/components/education/video-card'
import { CategoryPills } from '@/components/education/category-pills'
import { NewsletterCTA } from '@/components/education/newsletter-cta'
import Image from 'next/image'
import type { EducationMaterial, EducationCategory } from '@/lib/education/types'

export default async function EducationLandingPage({
  params,
}: {
  params: Promise<{ locale: Locale }>
}) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'knowledge' })
  const payload = await getPayload({ config: configPromise })

  const [categoriesResult, allMaterialsCount, lectures, videos] = await Promise.all([
    payload.find({
      collection: 'education-categories',
      locale,
      sort: 'order',
      limit: 20,
      depth: 0,
    }),
    payload.count({ collection: 'education-materials' }),
    payload.find({
      collection: 'education-materials',
      locale,
      where: { contentType: { equals: 'article' } },
      sort: '-publishedDate',
      limit: 3,
      depth: 1,
    }),
    payload.find({
      collection: 'education-materials',
      locale,
      where: { contentType: { equals: 'video' } },
      sort: '-publishedDate',
      limit: 3,
      depth: 1,
    }),
  ])

  // Category counts require a per-category query; batched here since the list is short.
  const categoriesWithCounts = await Promise.all(
    (categoriesResult.docs as EducationCategory[]).map(async (category) => {
      const { totalDocs } = await payload.count({
        collection: 'education-materials',
        where: { category: { equals: category.id } },
      })
      return { ...category, count: totalDocs }
    }),
  )

  return (
    <div className="bg-[#F7F5F2]">
      <div className="mx-auto max-w-6xl px-6 pt-8 lg:px-16">
        <nav className="flex items-center gap-2 text-sm text-[#1A1A1A]/50">
          <Link href="/">{t('home')}</Link>
          <span>/</span>
          <span className="text-[#1A1A1A]">{t('breadcrumb')}</span>
        </nav>
      </div>

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-6 pb-12 pt-6 lg:px-16">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <span className="mb-6 inline-block rounded-full bg-white px-4 py-1.5 text-sm text-[#1A1A1A]/70">
              {t('badge')}
            </span>
            <h1 className="font-serif text-4xl leading-tight text-[#155335] md:text-5xl">
              {t('heroTitleLine1')}
              <br />
              {t('heroTitleLine2')}
            </h1>
            <p className="mt-5 max-w-md text-base leading-relaxed text-[#1A1A1A]/70">
              {t('subtitle')}
            </p>
            <Link
              href="/knowledge/seminars"
              className="mt-8 inline-flex items-center gap-2 rounded-lg bg-[#155335] px-6 py-3.5 text-sm font-medium text-white hover:opacity-90"
            >
              {t('cta')}
            </Link>
          </div>

          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-[#EDE9E3] lg:aspect-[16/10]">
            <Image
                src="/images/education.png"
                alt={t('imageAlt')}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-6xl px-6 pb-14 lg:px-16">
        <h2 className="mb-6 font-serif text-2xl text-[#1A1A1A]">{t('categoriesTitle')}</h2>
        <CategoryPills categories={categoriesWithCounts} totalCount={allMaterialsCount.totalDocs} />
      </section>

      {/* Seminars & materials row */}
      <section className="mx-auto max-w-6xl px-6 pb-14 lg:px-16">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-serif text-2xl text-[#1A1A1A]">{t('seminarsTitle')}</h2>
          <Link href="/knowledge/seminars" className="flex items-center gap-1.5 text-sm text-[#155335]">
            {t('viewAll')} <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {(lectures.docs as EducationMaterial[]).map((material) => (
            <EducationCard key={material.id} material={material} locale={locale} />
          ))}
        </div>
      </section>

      {/* YouTube row */}
      <section className="mx-auto max-w-6xl px-6 pb-16 lg:px-16">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-serif text-2xl text-[#1A1A1A]">{t('videosTitle')}</h2>
          <Link href="/knowledge/videos" className="flex items-center gap-1.5 text-sm text-[#155335]">
            {t('viewAll')} <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {(videos.docs as EducationMaterial[]).map((material) => (
            <VideoCard key={material.id} material={material} variant="compact" />
          ))}
        </div>
      </section>
    </div>
  )
}

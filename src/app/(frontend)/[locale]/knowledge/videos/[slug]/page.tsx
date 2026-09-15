import { getPayload } from 'payload'
import { getTranslations } from 'next-intl/server'
import configPromise from '@payload-config'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import type { Locale } from '@/i18n/routing'
import { Calendar, Clock, Folder, Radio, Youtube, ExternalLink, ArrowRight } from 'lucide-react'
import { ExpertCard } from '@/components/education/expert-card'
import { NewsletterCTA } from '@/components/education/newsletter-cta'
import { formatClock, formatDate, getYoutubeId } from '@/lib/education/format'
import type { EducationMaterial } from '@/lib/education/types'

export default async function VideoDetailPage({
                                                params,
                                              }: {
  params: Promise<{ locale: Locale; slug: string }>
}) {
  const { locale, slug } = await params
  const t = await getTranslations({ locale, namespace: 'knowledge' })
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'education-materials',
    locale: locale,
    where: { and: [{ slug: { equals: slug } }, { contentType: { equals: 'video' } }] },
    limit: 1,
    depth: 2,
  })

  const material = result.docs[0] as EducationMaterial | undefined
  if (!material) notFound()

  const relatedResult = await payload.find({
    collection: 'education-materials',
    locale: locale,
    where: {
      and: [{ contentType: { equals: 'video' } }, { id: { not_equals: material.id } }],
    },
    sort: '-publishedDate',
    limit: 5,
    depth: 1,
  })

  const youtubeId = getYoutubeId(material.videoUrl)

  return (
      <div className="bg-[#F7F5F2]">
        <div className="mx-auto max-w-6xl px-6 pt-8 lg:px-16">
          <nav className="flex flex-wrap items-center gap-2 text-sm text-[#1A1A1A]/50">
            <Link href="/">{t('home')}</Link>
            <span>/</span>
            <Link href="/knowledge">{t('breadcrumb')}</Link>
            <span>/</span>
            <Link href="/knowledge/videos">{t('videosTitle')}</Link>
            <span>/</span>
            <span className="text-[#1A1A1A]">{material.title}</span>
          </nav>
        </div>

        <section className="mx-auto max-w-6xl px-6 pb-14 pt-6 lg:px-16">
          <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
            <div className="overflow-hidden rounded-2xl bg-black">
              {youtubeId ? (
                  <div className="aspect-video">
                    <iframe
                        className="h-full w-full"
                        src={`https://www.youtube.com/embed/${youtubeId}`}
                        title={material.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    />
                  </div>
              ) : (
                  <div className="flex aspect-video items-center justify-center text-white/40">
                    {t('videoDetail.videoUnavailable')}
                  </div>
              )}
            </div>

            <div>
            <span className="mb-4 inline-block rounded-full bg-white px-3 py-1 text-xs text-[#1A1A1A]/60">
              {t('videosTitle')}
            </span>
              <h1 className="font-serif text-3xl leading-tight text-[#1A1A1A]">{material.title}</h1>
              {material.excerpt ? (
                  <p className="mt-4 text-sm leading-relaxed text-[#1A1A1A]/60">{material.excerpt}</p>
              ) : null}

              <ul className="mt-6 space-y-3 text-sm text-[#1A1A1A]/70">
                {material.publishedDate ? (
                    <li className="flex items-center gap-2.5">
                      <Calendar className="h-4 w-4 text-[#155335]" strokeWidth={1.75} />
                      {t('videoDetail.publishedLabel')}: {formatDate(material.publishedDate, locale)}
                    </li>
                ) : null}
                {material.durationSeconds ? (
                    <li className="flex items-center gap-2.5">
                      <Clock className="h-4 w-4 text-[#155335]" strokeWidth={1.75} />
                      {t('videoDetail.durationLabel')}: {formatClock(material.durationSeconds)}
                    </li>
                ) : null}
                {material.category ? (
                    <li className="flex items-center gap-2.5">
                      <Folder className="h-4 w-4 text-[#155335]" strokeWidth={1.75} />
                      {t('videoDetail.categoryLabel')}: {material.category.name}
                    </li>
                ) : null}
                <li className="flex items-center gap-2.5">
                  <Radio className="h-4 w-4 text-[#155335]" strokeWidth={1.75} />
                  {t('videoDetail.sourceLabel')}: JUST Audit
                </li>
              </ul>

              {material.videoUrl ? (
                  <a
                      href={material.videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-8 flex items-center justify-center gap-2 rounded-lg bg-[#155335] px-6 py-3.5 text-sm font-medium text-white hover:opacity-90"
                  >
                    <Youtube className="h-4 w-4" />
                    {t('videoDetail.watchOnYoutube')}
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
              ) : null}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl gap-10 px-6 pb-16 lg:flex lg:px-16">
          <div className="flex-1 space-y-8">
            {material.expert ? <ExpertCard expert={material.expert} /> : null}

            {material.excerpt ? (
                <div className="rounded-2xl border border-[#EDE9E3] bg-white p-6">
                  <h2 className="mb-4 font-serif text-xl text-[#1A1A1A]">{t('videoDetail.aboutVideoTitle')}</h2>
                  <p className="text-sm leading-relaxed text-[#1A1A1A]/70">{material.excerpt}</p>
                </div>
            ) : null}

            {material.tags?.length ? (
                <div className="rounded-2xl border border-[#EDE9E3] bg-white p-6">
                  <h2 className="mb-4 font-serif text-xl text-[#1A1A1A]">{t('videoDetail.tagsTitle')}</h2>
                  <div className="flex flex-wrap gap-2">
                    {material.tags.map((tag) => (
                        <span
                            key={tag.id ?? tag.label}
                            className="rounded-full border border-[#EDE9E3] px-3 py-1 text-sm text-[#1A1A1A]/70"
                        >
                    {tag.label}
                  </span>
                    ))}
                  </div>
                </div>
            ) : null}
          </div>

          <aside className="mt-8 w-full shrink-0 lg:mt-0 lg:w-80">
            <div className="rounded-2xl border border-[#EDE9E3] bg-white p-6">
              <h2 className="mb-4 font-serif text-lg text-[#1A1A1A]">{t('videoDetail.otherVideosTitle')}</h2>
              <div className="space-y-4">
                {(relatedResult.docs as EducationMaterial[]).map((related) => (
                    <Link
                        key={related.id}
                        href={`/knowledge/videos/${related.slug}`}
                        className="flex gap-3"
                    >
                      <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-lg bg-[#EDE9E3]">
                        {related.thumbnail?.url ? (
                            <Image src={related.thumbnail.url} alt={related.title} fill className="object-cover" />
                        ) : null}
                        {related.durationSeconds ? (
                            <span className="absolute bottom-1 right-1 rounded bg-black/70 px-1 text-[10px] text-white">
                        {formatClock(related.durationSeconds)}
                      </span>
                        ) : null}
                      </div>
                      <p className="text-sm leading-snug text-[#1A1A1A]">{related.title}</p>
                    </Link>
                ))}
              </div>

              <Link
                  href="/knowledge/videos"
                  className="mt-6 flex items-center justify-center gap-2 rounded-lg border border-[#EDE9E3] py-3 text-sm text-[#1A1A1A] hover:border-[#155335]/30"
              >
                {t('videoDetail.allVideosCta')} <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </aside>
        </section>

        <section className="mx-auto max-w-6xl px-6 pb-20 lg:px-16">
          <NewsletterCTA />
        </section>
      </div>
  )
}